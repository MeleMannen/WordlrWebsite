import { CardGrid } from "@/components/card_grid/card_grid";
import { DownloadActionButton } from "@/components/download_action_button/download_action_button";
import { EmailForm } from "@/components/email_form/email_form";
import { Hero } from "@/components/hero/hero";
import { RatingLaurelsBadge } from "@/components/rating_laurels_badge/rating_laurels_badge";
import { Section } from "@/components/section/section";
import { IS_WAITLIST_ENABLED } from "@/constants";

import styles from "./page.module.css";

const IMAGE_PATH = "/app_view/app_images/";
const WORDLR_BEZEL = "iPhone 16 Pro Max Space Black";

export default function Page() {
  if (IS_WAITLIST_ENABLED) {
    return (
      <>
        <div className={styles.waitlistSpacer} />

        <Section paddingTop={60}>
          <Hero
            title="Wordlr"
            subtitle="A flexible word game with 1-8 letter puzzles, multiple languages, searchable word lists, definitions, stats, and history."
            media={
              <Hero.Image
                src={`${IMAGE_PATH}game_setup_word_length_language.png`}
                alt="Wordlr setup screen with word length, language, daily word, unlimited, and expert mode options."
                bezel={WORDLR_BEZEL}
              />
            }
            action={
              <EmailForm
                providerConfig={{
                  provider: "loops",
                  config: {
                    formId: "your-loops-form-id",
                  },
                }}
              />
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
          title="Wordlr"
          subtitle="Guess words your way: 1-8 letters, five languages, daily and unlimited modes, built-in definitions, smart word search, stats, and game history."
          media={
            <Hero.Image
              src={`${IMAGE_PATH}gameplay_words_solve_animation.png`}
              bezel={WORDLR_BEZEL}
              alt="Wordlr game board showing the word WORDS being solved."
            />
          }
          badges={
            <RatingLaurelsBadge
              showStars={true}
              rating={4.6}
              caption="Worldwide rating"
            />
          }
          action={<DownloadActionButton size="medium" />}
        />
      </Section>

      <Section navigationAnchor="features">
        <CardGrid rowHeight={438}>
          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Choose 1-8 letter words in five languages"
            description="Set the exact word length and language before you play, then switch between daily puzzles and unlimited rounds whenever you want."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}game_setup_word_length_language.png`}
                alt="Wordlr setup screen with word length and language controls."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.18 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Daily, unlimited, or expert"
            description="Play a quick daily word, keep going in unlimited mode, or add pressure by enabling expert mode."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}english_words_result.png`}
                alt="Five-letter Wordlr board with guesses entered."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.40 }}
              />
            }
            layoutDirection="reverse"
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Play in your language"
            description="Wordlr supports language-specific keyboards and word lists, including Spanish words with the letter Ñ."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}spanish_ahora_solve_animation.png`}
                alt="Spanish Wordlr board using the word AHORA and a Spanish keyboard."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.3 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="Short, long, and everything between"
            description="Go from quick one-letter warmups to longer eight-letter challenges that make every guess count."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}six_letter_phrase_solve_animation.png`}
                alt="Six-letter Wordlr board with the word PHRASE in progress."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.3 }}
              />
            }
            textAlignment="leading"
          />
        </CardGrid>
      </Section>

      <Section title="Find the right word faster">
        <CardGrid rowHeight={500}>
          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Search every possible word"
            description="Browse matching words while you play, to see whether it fits your next guess."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}word_search_results.png`}
                alt="Wordlr search screen showing possible words such as WORDS, WORDY, WORKS, and WORLD."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.12 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="third"
            title="Filter by what you know"
            description="Narrow down results by starting letters, ending letters, included letters, excluded letters, or pull clues straight from the current game."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}word_search_filter_options.png`}
                alt="Wordlr filter options for search, starts with, ends with, included letters, and excluded letters."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.18 }}
              />
            }
            layoutDirection="reverse"
            textAlignment="leading"
          />
        </CardGrid>
      </Section>

      <Section title="Learn from every answer">
        <CardGrid rowHeight={470}>
          <CardGrid.StackedCard
            maxWidth="third"
            title="Definitions after the solve"
            description="When the puzzle is done, jump straight into the answer's meaning instead of leaving the app."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}english_words_result.png`}
                alt="Wordlr result screen with buttons for a new word and showing the definition."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "top", croppedRatio: 0.15 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="twoThirds"
            title="Built-in word definitions"
            description="Read pronunciation, noun forms, examples, and usage notes without breaking your puzzle flow."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}word_definition_words.png`}
                alt="Definition screen for the word WORDS with pronunciation, explanation, usage, and examples."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.14 }}
              />
            }
            layoutDirection="reverse"
            textAlignment="leading"
          />
        </CardGrid>
      </Section>

      <Section title="Track your progress">
        <CardGrid rowHeight={500}>
          <CardGrid.StackedCard
            maxWidth="half"
            title="Statistics that keep you honest"
            description="See amount of played words, win rate, guess distribution, and streak performance across word lengths, languages, and game modes."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}statistics_dashboard.png`}
                alt="Wordlr statistics screen showing played games, win rate, guesses, and streaks."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.12 }}
              />
            }
            textAlignment="leading"
          />

          <CardGrid.StackedCard
            maxWidth="half"
            title="History you can search"
            description="Review previous answers, filter by length, language, and mode, then view word definitions from your past games."
            media={
              <CardGrid.StackedCard.Image
                src={`${IMAGE_PATH}game_history_overview.png`}
                alt="Wordlr history screen showing previous solved words grouped by date."
                bezel={WORDLR_BEZEL}
                bezelCrop={{ edge: "bottom", croppedRatio: 0.12 }}
              />
            }
            textAlignment="leading"
          />
        </CardGrid>
      </Section>

      <Section title="Why Wordlr stands out">
        <CardGrid rowHeight={280}>
          <CardGrid.IconCard
            maxWidth="third"
            iconLabel="1-8"
            title="Not just five letters"
            description="Choose any word length from 1 to 8 letters instead of playing the same fixed puzzle every time."
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="check_circle"
            title="Smarter than guessing"
            description="Search and filter possible words using the clues already on your board."
          />

          <CardGrid.IconCard
            maxWidth="third"
            iconName="star"
            title="Built for learning"
            description="Use hints to reveal one letter, play in multiple languages, then review definitions, stats, and history."
          />
        </CardGrid>
      </Section>

      <Section paddingTop={60} paddingBottom={160}>
        <div className={styles.finalAction}>
          <DownloadActionButton size="medium" />
        </div>
      </Section>
    </>
  );
}
