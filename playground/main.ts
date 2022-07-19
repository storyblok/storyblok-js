import { storyblokInit, loadStoryblokBridge, renderRichText } from "@storyblok/js";

declare global {
  interface Window {
    initWithBridge: any;
    initWithoutBridge: any;
    loadStoryblokBridgeScript: any;
  }
}

window.initWithBridge = () => {
  storyblokInit({
    accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
  });
};

window.initWithoutBridge = () => {
  storyblokInit({
    accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
    bridge: false,
  });
};

window.loadStoryblokBridgeScript = () => {
  loadStoryblokBridge();
};

const richText = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "text": "Experiamur igitur, inquit, etsi habet haec Stoicorum ratio difficilius quiddam et obscurius. Non enim iam stirpis bonum quaeret, sed animalis. ",
          "type": "text"
        },
        {
          "text": "Quia dolori non voluptas contraria est, sed doloris privatio.",
          "type": "text",
          "marks": [
            {
              "type": "bold"
            }
          ]
        },
        {
          "text": " Quis enim confidit semper sibi illud stabile et firmum permansurum, quod fragile et caducum sit? Stuprata per vim Lucretia a regis filio testata civis se ipsa interemit. Hic ambiguo ludimur.",
          "type": "text"
        }
      ]
    }
  ]
};

const renderedRichText = renderRichText(richText);
console.log(renderedRichText);

const richTextContainer = document.getElementById('rich-text-container');

richTextContainer?.insertAdjacentHTML('afterbegin', renderedRichText);