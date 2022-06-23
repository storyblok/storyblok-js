import { loadBridge } from "./modules/bridge";
import {
  StoryblokBridgeConfigV2,
  StoryblokBridgeV2,
  StoryData,
  SbSDKOptions,
  SbPluginInitResult,
  SbPluginOptions,
  SbPluginFactory,
} from "./types";

const bridgeLatest = "https://app.storyblok.com/f/storyblok-v2-latest.js";

export const useStoryblokBridge = (
  id: number,
  cb: (newStory: StoryData) => void,
  options: StoryblokBridgeConfigV2 = {}
) => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.storyblokRegisterEvent === "undefined") {
    console.error(
      "Storyblok Bridge is disabled. Please enable it to use it. Read https://github.com/storyblok/storyblok-js"
    );

    return;
  }

  if (!id) {
    console.warn("Story ID is not defined. Please provide a valid ID.");
    return;
  }

  window.storyblokRegisterEvent(() => {
    const sbBridge: StoryblokBridgeV2 = new window.StoryblokBridge(options);
    sbBridge.on(["input", "published", "change"], (event) => {
      if (event.action == "input" && event.story.id === id) {
        cb(event.story);
      } else {
        window.location.reload();
      }
    });
  });
};

export { default as apiPlugin } from "./modules/api";
export { default as storyblokEditable } from "./modules/editable";

export const storyblokInit = (pluginOptions: SbSDKOptions = {}) => {
  const { bridge, accessToken, use = [], apiOptions = {} } = pluginOptions;

  apiOptions.accessToken = apiOptions.accessToken || accessToken;

  // Initialize plugins
  const options: SbPluginOptions = { bridge, apiOptions };
  let result: SbPluginInitResult = {};

  use.forEach((pluginFactory: SbPluginFactory) => {
    result = { ...result, ...pluginFactory(options) };
  });

  // Load bridge
  if (bridge !== false) {
    loadBridge(bridgeLatest);
  }

  return result;
};

export const loadStoryblokBridge = () => {
  return loadBridge(bridgeLatest);
};

// Reexport all types so users can have access to them
export * from "./types";
