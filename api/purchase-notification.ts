export const config = {
  runtime: "edge",
};

type PurchaseNotificationPayload = {
  signedPayload?: string;
  productId?: string;
  transactionId?: string;
  originalTransactionId?: string;
  environment?: string;
  notificationType?: string;
  subtype?: string;
  source?: string;
};

type DecodedAppStoreNotification = {
  notificationType?: string;
  subtype?: string;
  notificationUUID?: string;
  data?: {
    appAppleId?: number;
    bundleId?: string;
    bundleVersion?: string;
    environment?: string;
    signedTransactionInfo?: string;
    signedRenewalInfo?: string;
  };
};

type DecodedTransactionInfo = {
  productId?: string;
  transactionId?: string;
  originalTransactionId?: string;
  purchaseDate?: number;
  type?: string;
  inAppOwnershipType?: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  });
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function timingSafeEqualString(left: string, right: string): boolean {
  if (left.length !== right.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < left.length; index += 1) {
    result |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return result === 0;
}

function getRequestSecret(request: Request): string | null {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length).trim();
  }

  return new URL(request.url).searchParams.get("secret");
}

function verifyRequestSecret(request: Request): boolean {
  const expectedSecret = getRequiredEnv("APP_STORE_NOTIFICATION_SECRET");
  const requestSecret = getRequestSecret(request);

  if (!requestSecret) {
    return false;
  }

  return timingSafeEqualString(requestSecret, expectedSecret);
}

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );

  return atob(paddedBase64);
}

function decodeJwtPayload<T>(jwt: string | undefined): T | null {
  if (!jwt) {
    return null;
  }

  const [, payload] = jwt.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload)) as T;
  } catch {
    return null;
  }
}

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) {
    return "Unknown";
  }

  return new Date(timestamp).toISOString();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function shouldSendEmailForNotification(
  payload: PurchaseNotificationPayload,
  notification: DecodedAppStoreNotification | null,
): boolean {
  if (!payload.signedPayload) {
    return true;
  }

  return notification?.notificationType === "ONE_TIME_CHARGE";
}

function buildEmailHtml({
  payload,
  notification,
  transactionInfo,
}: {
  payload: PurchaseNotificationPayload;
  notification: DecodedAppStoreNotification | null;
  transactionInfo: DecodedTransactionInfo | null;
}): string {
  const notificationType =
    notification?.notificationType ?? payload.notificationType ?? "Unknown";
  const subtype = notification?.subtype ?? payload.subtype ?? "None";
  const productId = transactionInfo?.productId ?? payload.productId ?? "Unknown";
  const transactionId =
    transactionInfo?.transactionId ?? payload.transactionId ?? "Unknown";
  const originalTransactionId =
    transactionInfo?.originalTransactionId ??
    payload.originalTransactionId ??
    "Unknown";
  const environment =
    notification?.data?.environment ?? payload.environment ?? "Unknown";
  const source = payload.signedPayload
    ? "App Store Server Notification"
    : (payload.source ?? "App callback");

  return `
    <h1>Wordlr purchase notification</h1>
    <p>A one-time purchase notification was received.</p>
    <table>
      <tbody>
        <tr><td><strong>Source</strong></td><td>${escapeHtml(source)}</td></tr>
        <tr><td><strong>Notification type</strong></td><td>${escapeHtml(notificationType)}</td></tr>
        <tr><td><strong>Subtype</strong></td><td>${escapeHtml(subtype)}</td></tr>
        <tr><td><strong>Product ID</strong></td><td>${escapeHtml(productId)}</td></tr>
        <tr><td><strong>Transaction ID</strong></td><td>${escapeHtml(transactionId)}</td></tr>
        <tr><td><strong>Original transaction ID</strong></td><td>${escapeHtml(originalTransactionId)}</td></tr>
        <tr><td><strong>Environment</strong></td><td>${escapeHtml(environment)}</td></tr>
        <tr><td><strong>Purchase date</strong></td><td>${escapeHtml(formatDate(transactionInfo?.purchaseDate))}</td></tr>
      </tbody>
    </table>
  `;
}

async function sendPurchaseEmail({
  payload,
  notification,
  transactionInfo,
}: {
  payload: PurchaseNotificationPayload;
  notification: DecodedAppStoreNotification | null;
  transactionInfo: DecodedTransactionInfo | null;
}) {
  const resendApiKey = getRequiredEnv("RESEND_API_KEY");
  const emailFrom = getRequiredEnv("PURCHASE_EMAIL_FROM");
  const emailTo = getRequiredEnv("PURCHASE_EMAIL_TO");
  const productId = transactionInfo?.productId ?? payload.productId ?? "Unknown";
  const transactionId =
    transactionInfo?.transactionId ?? payload.transactionId ?? "Unknown";

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      authorization: `Bearer ${resendApiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [emailTo],
      subject: `Wordlr purchase: ${productId}`,
      html: buildEmailHtml({ payload, notification, transactionInfo }),
      text: [
        "Wordlr purchase notification",
        `Product ID: ${productId}`,
        `Transaction ID: ${transactionId}`,
      ].join("\n"),
    }),
  });

  if (!response.ok) {
    const responseText = await response.text();
    throw new Error(`Resend failed with ${response.status}: ${responseText}`);
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    if (!verifyRequestSecret(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const payload = (await request.json()) as PurchaseNotificationPayload;
    const notification = decodeJwtPayload<DecodedAppStoreNotification>(
      payload.signedPayload,
    );
    const transactionInfo = decodeJwtPayload<DecodedTransactionInfo>(
      notification?.data?.signedTransactionInfo,
    );

    if (!shouldSendEmailForNotification(payload, notification)) {
      return jsonResponse({
        ok: true,
        ignored: true,
        notificationType: notification?.notificationType ?? "Unknown",
      });
    }

    await sendPurchaseEmail({
      payload,
      notification,
      transactionInfo,
    });

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error("Purchase notification failed", error);

    return jsonResponse(
      {
        error: "Purchase notification failed",
      },
      500,
    );
  }
}
