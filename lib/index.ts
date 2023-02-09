import { loadBridge } from "./modules/bridge";
import {
  SbSDKOptions,
  StoryblokBridgeConfigV2,
  StoryblokBridgeV2,
  ISbStoryData,
  SbInitResult,
  ISbRichtext,
  StoryblokComponentType,
  SbRichTextOptions,
} from "./types";

import { RichtextResolver } from "storyblok-js-client";

let richTextResolver;

const bridgeLatest = "https://app.storyblok.com/f/storyblok-v2-latest.js";

export const useStoryblokBridge = <
  T extends StoryblokComponentType<string> = any
>(
  id: Number,
  cb: (newStory: ISbStoryData<T>) => void,
  options: StoryblokBridgeConfigV2 = {}
) => {
  const isServer = typeof window === "undefined";
  const isBridgeLoaded = typeof window.storyblokRegisterEvent !== "undefined";
  if (isServer || (!isServer && !isBridgeLoaded)) {
    return;
  }

  if (!id) {
    console.warn("Story ID is not defined. Please provide a valid ID.");
    return;
  }

  window.storyblokRegisterEvent(() => {
    const sbBridge: StoryblokBridgeV2 = new window.StoryblokBridge(options);
    sbBridge.on(["input", "published", "change"], (event) => {
      if (event.action === "input" && event.story.id === id) {
        cb(event.story);
      } else if (
        (event.action === "change" || event.action === "published") &&
        (event.storyId as any) === id // @todo: "as any" is a temporary fix till https://github.com/storyblok/storyblok-js-client/pull/280 is merged
      ) {
        window.location.reload();
      }
    });
  });
};

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
  richTextResolver = new RichtextResolver(richText.schema);
  if (richText.resolver) {
    setComponentResolver(richTextResolver, richText.resolver);
  }

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
  data: ISbRichtext,
  options?: SbRichTextOptions,
  resolverInstance?: RichtextResolver
): string => {
  let localResolver = resolverInstance || richTextResolver;
  if (!localResolver) {
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

  if (options) {
    localResolver = new RichtextResolver(options.schema);
    if (options.resolver) {
      setComponentResolver(localResolver, options.resolver);
    }
  }

  return localResolver.render(data);
};

export const loadStoryblokBridge = () => loadBridge(bridgeLatest);

export { useStoryblokBridge as registerStoryblokBridge };

export { default as apiPlugin } from "./modules/api";
export { default as storyblokEditable } from "./modules/editable";

export {
  RichtextResolver as RichTextResolver,
  RichtextSchema as RichTextSchema,
} from "storyblok-js-client";

// Reexport all types so users can have access to them
export * from "./types";
