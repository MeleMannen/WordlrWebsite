import { Article } from "@/components/article/article";

export default function SupportPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Article>{children}</Article>;
}
