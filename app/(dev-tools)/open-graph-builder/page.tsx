import { Instructions } from "./components/instructions/instructions";
import { OpenGraphPreview } from "./components/open_graph_preview/open_graph_preview";
import styles from "./page.module.css";

export default function OpenGraphBuilderPage() {
  return (
    <div className={styles.ogBuilder}>
      <h2 className={styles.sectionTitle}>Preview</h2>
      <div className={`ogBuilderPreview ${styles.preview}`}>
        {/*
					Customize parameters of this component:
					* Keep the title short to make the overall image uncluttered
					* Use the screenshot that showcases the most eye-catching part of
						the app in order to grab user's attention
					* Adjust the screenshot crop if needed
				*/}
        <OpenGraphPreview
          title="Wordlr"
          iconSrc="favicon.png"
          screenshotSrc="/app_view/app_images/gameplay_words_solve_animation.png"
          bezel="iPhone 16 Pro Max Space Black"
          bezelCrop={{ edge: "bottom", croppedRatio: 0.40 }}
          theme="dark"
        />
      </div>

      <h2 className={styles.sectionTitle}>Instructions</h2>
      <div className={styles.instructions}>
        <Instructions />
      </div>
    </div>
  );
}
