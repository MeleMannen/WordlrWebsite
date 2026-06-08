import { AppleFeatureLaurelsBadge } from "@/components/apple_feature_laurels_badge/apple_feature_laurels_badge";
import { CardGrid } from "@/components/card_grid/card_grid";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { EmailForm } from "@/components/email_form/email_form";
import { Hero } from "@/components/hero/hero";
import { RatingLaurelsBadge } from "@/components/rating_laurels_badge/rating_laurels_badge";
import { Section } from "@/components/section/section";
import { TestimonialsGrid } from "@/components/testimonials_grid/testimonials_grid";
import { IS_WAITLIST_ENABLED } from "@/constants";

import styles from "./page.module.css";

export default function Page() {
  if (IS_WAITLIST_ENABLED) {
    return (
      <>
        <div className={styles.waitlistSpacer} />

        <Section paddingTop={60}>
          <Hero
            title="App Title"
            subtitle="Short app description that highlights what the app does and its key value"
            media={
              <Hero.Image
                src="/app_view/screenshot_placeholder.png"
                alt=""
                bezel="iPhone 17 Black"
              />
            }
            action={
              <>
                <EmailForm
                  providerConfig={{
                    provider: "loops",
                    config: {
                      formId: "your-loops-form-id",
                    },
                  }}
                />
                {/*
                  You can also use a simple button to redirect users
                  to a custom page where you collect emails
                */}
                {/* <GetNotifiedActionButton href="your-email-form-link" /> */}
              </>
            }
          />
        </Section>
      </>
    );
  }

  return (
    <>
      <Section paddingTop={100}>
        <Hero
          title="App Title"
          subtitle="Short app description that highlights what the app does and its key value"
          media={
            <Hero.Image
              src="/app_view/screenshot_placeholder.png"
              bezel="iPhone 17 Black"
              alt=""
            />
          }
          badges={
            <>
              <RatingLaurelsBadge
                showStars={true}
                rating={4.9}
                caption="worldwide rating"
              />
              <AppleFeatureLaurelsBadge featureName="App of the Day" />
            </>
          }
          action={<DownloadActionButton size="medium" />}
        />
      </Section>

      <Section navigationAnchor="features">
        <CardGrid rowHeight={438}>
          <CardGrid.StackedCard
            maxWidth="third"
            title="Feature Title"
            description="Short feature description"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/stacked_card_image_placeholder_light.png"
                srcset={[
                  {
                    src: "/app_view/stacked_card_image_placeholder_dark.png",
                    theme: "dark",
                  },
                ]}
                alt="Grid"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Another Feature Title"
            description="And another feature description"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/screenshot_placeholder.png"
                alt="Make sure to provide an image description for accessibility purposes"
                bezel="iPhone 17 Black"
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Keep Titles Concise"
            description="Use the extra space on big cards for longer descriptions"
            layoutDirection="reverse"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/screenshot_placeholder.png"
                alt="Make sure to provide an image description for accessibility purposes"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.25 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.OverlaidCard
            maxWidth="third"
            imageSrc="/app_view/overlay_image_placeholder_light.png"
            imageSrcset={[
              {
                src: "/app_view/overlay_image_placeholder_dark.png",
                theme: "dark",
              },
            ]}
            title="Feature On An Overlay Card"
            description="These look great with photos or a custom graphics if you're willing to go the extra mile"
            textAlignment="center"
          />

          <CardGrid.StackedCard
            maxWidth="full"
            title="Huge Card For a Major Feature"
            description="Zoomed in UI or a custom graphic look great here"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/stacked_card_image_placeholder_light.png"
                srcset={[
                  {
                    src: "/app_view/stacked_card_image_placeholder_dark.png",
                    theme: "dark",
                  },
                ]}
                alt="Grid"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.1 }}
              />
            }
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="There Are Different Font Styles For Titles"
            titleFontStyle="cursive"
            description="When used sparingly, it adds personality and breaks the monotony"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/screenshot_placeholder.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "bottom", croppedRatio: 0.5 }}
                alt=""
              />
            }
            layoutDirection="reverse"
            textAlignment="center"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Check AppView Docs For More Guidance"
            description="There is a section about each card style and how to use it best"
            media={
              <CardGrid.StackedCard.Image
                src="/app_view/screenshot_placeholder.png"
                bezel="iPhone 17 Black"
                bezelCrop={{ edge: "top", croppedRatio: 0.5 }}
                alt=""
              />
            }
            layoutDirection="forward"
            textAlignment="center"
          />
        </CardGrid>
      </Section>

      <Section title="What people are saying" navigationAnchor="testimonials">
        <TestimonialsGrid maxColumnCount={2}>
          <TestimonialsGrid.Testimonial
            message="Showing social proof is very important. Show some nice words about your app from social media or App Store reviews."
            authorName="Jane Doe"
            authorTitle="Person's Title"
            authorImageUrl="/app_view/profile_image_placeholder.png"
            messageFontStyle="italic"
            source="https://threads.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="If it's an App Store review, make sure to show the stars rating, it catches attention and add visual variety."
            authorName="John Smith"
            source="appStore"
            starsRating={true}
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="Include a link to the testimonial's source when possible, this makes them look more trustworthy"
            authorName="Emily Johnson"
            source="https://reddit.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>

          <TestimonialsGrid.Testimonial
            message="Having person's credentials could also help build trust, especially if they are relevant to your app's domain."
            authorName="Michael Brown"
            authorTitle="CEO of Some Company"
            source="https://x.com/some-thread-message"
          ></TestimonialsGrid.Testimonial>
        </TestimonialsGrid>
      </Section>

      <Section title="Additional Highlights">
        <CardGrid rowHeight={280}>
          <CardGrid.IconCard
            maxWidth="third"
            iconName="check_circle"
            title="Icon Card"
            description="These are great for listing highlights that don't need images"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="lock"
            title="There Are A Ton Of Icons"
            description="AppView uses Material Symbols for icons with a huge collection to choose from"
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="star"
            title="Check AppView Docs"
            description="There are sections about using icons and icon cards"
          />
        </CardGrid>
      </Section>

      <Section paddingTop={60} paddingBottom={160}>
        <DownloadActionButton
          size="medium"
        />
      </Section>
    </>
  );
}
