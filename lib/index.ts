import { loadBridge } from "./modules/bridge";
import {
  SbSDKOptions,
  StoryblokBridgeConfigV2,
  StoryblokBridgeV2,
  StoryData,
  SbInitResult,
  Richtext,
  StoryblokComponentType,
  SbRichTextOptions,
} from "./types";

import RichTextResolver from "storyblok-js-client/source/richTextResolver";
export { default as RichTextSchema } from "storyblok-js-client/source/schema";

let richTextResolver;

const bridgeLatest = "https://app.storyblok.com/f/storyblok-v2-latest.js";

export const useStoryblokBridge = <
  T extends StoryblokComponentType<string> = any
>(
  id: Number,
  cb: (newStory: StoryData<T>) => void,
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
      if (event.story.id === id) {
        if (event.action === "input") cb(event.story);
        else window.location.reload();
      }
    });
  });
};

export { default as apiPlugin } from "./modules/api";
export { default as storyblokEditable } from "./modules/editable";

export const storyblokInit = (pluginOptions: SbSDKOptions = {}) => {
  const {
    bridge,
    accessToken,
    use = [],
    apiOptions = {},
    richText = {},
  } = pluginOptions;

  apiOptions.accessToken = apiOptions.accessToken || accessToken;

  // Initialize plugins
  const options = { bridge, apiOptions };
  let result: SbInitResult = {};

  use.forEach((pluginFactory: Function) => {
    result = { ...result, ...pluginFactory(options) };
  });

  // Load bridge
  if (bridge !== false) {
    loadBridge(bridgeLatest);
  }

  // Rich Text resolver
  richTextResolver = new RichTextResolver(richText.schema);
  if (richText.resolver)
    setComponentResolver(richTextResolver, richText.resolver);

  return result;
};

const setComponentResolver = (resolver, resolveFn) => {
  resolver.addNode("blok", (node) => {
    let html = "";

    node.attrs.body.forEach((blok) => {
      html += resolveFn(blok.component, blok);
    });

    return {
      html: html,
    };
  });
};

export const renderRichText = (
  data: Richtext,
  options?: SbRichTextOptions
): string => {
  if (!richTextResolver) {
    console.error(
      "Please initialize the Storyblok SDK before calling the renderRichText function"
    );
    return;
  }

  if ((data as any) === "") {
    return "";
  } else if (!data) {
    console.warn(`${data} is not a valid Richtext object. This might be because the value of the richtext field is empty.
    
  For more info about the richtext object check https://github.com/storyblok/storyblok-js#rendering-rich-text`);
    return "";
  }

  let localResolver = richTextResolver;
  if (options) {
    localResolver = new RichTextResolver(options.schema);
    if (options.resolver) setComponentResolver(localResolver, options.resolver);
  }

  return localResolver.render(data);
};

export const loadStoryblokBridge = () => loadBridge(bridgeLatest);

// Reexport all types so users can have access to them
export * from "./types";
