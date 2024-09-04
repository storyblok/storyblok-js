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

let bridgeLatest = "https://app.storyblok.com/f/storyblok-v2-latest.js";

export const useStoryblokBridge = <
  T extends StoryblokComponentType<string> = any
>(
  id: Number,
  cb: (newStory: ISbStoryData<T>) => void,
  options: StoryblokBridgeConfigV2 = {}
) => {
  const isServer = typeof window === "undefined";
  const isBridgeLoaded =
    !isServer && typeof window.storyblokRegisterEvent !== "undefined";
  const storyId = new URL(window.location?.href).searchParams.get(
    "_storyblok"
  );
  const inStory = +storyId === id;

  if (!isBridgeLoaded || !inStory) {
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
        (event.storyId as number) === id
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
    bridgeUrl
  } = pluginOptions;

  apiOptions.accessToken = apiOptions.accessToken || accessToken;

  // Initialize plugins
  const options = { bridge, apiOptions };
  let result: SbInitResult = {};

  use.forEach((pluginFactory: Function) => {
    result = { ...result, ...pluginFactory(options) };
  });

  if (bridgeUrl) {
    bridgeLatest = bridgeUrl;
  }

  /*
  ** Load bridge if you are on the Visual Editor
  ** For more security: https://www.storyblok.com/faq/how-to-verify-the-preview-query-parameters-of-the-visual-editor
  */
  const isServer = typeof window === "undefined";
  const inEditor = !isServer && window.location?.search?.includes('_storyblok_tk');
  if (bridge !== false && inEditor) {
    loadBridge(bridgeLatest);
  }

  // Rich Text resolver
  // TODO: replace with @storyblok/richtext package on v4.x
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

export const isRichTextEmpty = (data?: ISbRichtext) => {
  return !data || !data?.content.some((node) => node.content || node.type === 'blok' || node.type === 'horizontal_rule');
}

export const renderRichText = (
  data?: ISbRichtext,
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

  if (isRichTextEmpty(data)) {
    return "";
  }

  if (options) {
    // TODO: replace with @storyblok/richtext package on v4.x
    localResolver = new RichtextResolver(options.schema);
    if (options.resolver) {
      setComponentResolver(localResolver, options.resolver);
    }
  }
  // NOTE: This will warn the user about deprecation of legacy Richtext when https://github.com/storyblok/storyblok-js-client/pull/845 is merged
  // WE supress the warning on SDK level to avoid spamming the console since user would not need to do anything about it
  return localResolver.render(data, {}, true);
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

// New Richtext Resolver
export {
  BlockTypes,
  MarkTypes,
  richTextResolver,
  TextTypes,
  type StoryblokRichTextOptions,
  type StoryblokRichTextDocumentNode,
  type StoryblokRichTextNodeTypes,
  type StoryblokRichTextNode,
  type StoryblokRichTextResolvers,
  type StoryblokRichTextNodeResolver,
  type StoryblokRichTextImageOptimizationOptions,
} from "@storyblok/richtext"
