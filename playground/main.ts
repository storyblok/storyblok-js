import { storyblokInit, loadStoryblokBridge } from "@storyblok/js";

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
