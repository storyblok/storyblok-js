import StoryblokJSClient, {
  ISbConfig,
  ISbComponentType,
  ISbStoryData,
} from "storyblok-js-client";

export type StoryblokClient = StoryblokJSClient;

declare global {
  interface Window {
    storyblokRegisterEvent: (cb: Function) => void;
    StoryblokBridge: {
      new (options?: StoryblokBridgeConfigV2): StoryblokBridgeV2;
    };
  }
}

export interface SbInitResult {
  storyblokApi?: StoryblokClient;
}

export type SbPluginFactory = (options: SbSDKOptions) => any;
export type SbBlokKeyDataTypes = string | number | object | boolean | undefined;

export interface SbBlokData extends ISbComponentType<string> {
  [index: string]: SbBlokKeyDataTypes;
}
export interface SbRichTextOptions {
  schema?: ISbConfig["richTextSchema"];
  resolver?: ISbConfig["componentResolver"];
}
export interface SbSDKOptions {
  bridge?: boolean;
  accessToken?: string;
  use?: any[];
  apiOptions?: ISbConfig;
  richText?: SbRichTextOptions;
}

export interface ISbEventPayload<S extends ISbComponentType<string> = any> {
  action:
    | "customEvent"
    | "published"
    | "input"
    | "change"
    | "unpublished"
    | "enterEditmode";
  event?: string;
  story?: ISbStoryData<S>;
  slug?: string;
  slugChanged?: boolean;
  storyId?: number;
  reload?: boolean;
}

// TODO: temporary till the right bridge types are updated on storyblok-js-client
export interface StoryblokBridgeConfigV2 {
  resolveRelations?: string[];
  customParent?: string;
  preventClicks?: boolean;
  language?: string;
}

export interface StoryblokBridgeV2 {
  pingEditor: (event: any) => void;
  isInEditor: () => boolean;
  enterEditmode: () => void;
  on: (
    event:
      | "customEvent"
      | "published"
      | "input"
      | "change"
      | "unpublished"
      | "enterEditmode"
      | string[],
    callback: (payload?: ISbEventPayload) => void
  ) => void;
}

export type {
  ISbConfig, // previously StoryblokConfig
  ISbCache, // previously StoryblokCache
  ISbResult, // previously StoryblokResult
  ISbResponse,
  ISbError,
  ISbNode,
  ISbSchema,
  ThrottleFn,
  AsyncFn,
  ArrayFn,
  ISbContentMangmntAPI,
  ISbManagmentApiResult, // previously StoryblokManagmentApiResult
  ISbStories, // previously Stories
  ISbStory, // previously Story
  ISbDimensions,
  ISbComponentType as StoryblokComponentType,
  ISbStoryData, // previously StoryData
  ISbAlternateObject, // previously AlternateObject
  ISbStoriesParams, // previously StoriesParams
  ISbStoryParams, // previously StoryParams
  ISbRichtext, // previously Richtext
  RichtextResolver as RichTextResolver,
  RichtextSchema as RichTextSchema,
} from "storyblok-js-client";
