import { storyblokInit, loadStoryblokBridge, renderRichText } from "@storyblok/js";
import richTextFixture from "../lib/fixtures/richTextObject.json";

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


const renderedRichText = renderRichText(richTextFixture);

const richTextContainer = document.getElementById('rich-text-container');

richTextContainer?.insertAdjacentHTML('afterbegin', renderedRichText);