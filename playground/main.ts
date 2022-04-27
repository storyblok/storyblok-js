import { storyblokInit, loadStoryblokBridge } from "@storyblok/js";

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
