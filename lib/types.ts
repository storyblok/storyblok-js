import StoryblokJSClient, {
  StoryblokConfig,
  StoryblokComponent,
} from "storyblok-js-client";

export type StoryblokClient = StoryblokJSClient;

export type SbFunction<
  Args extends unknown[] = [unknown],
  ReturnValue = void
> = (...args: Args) => ReturnValue;

export type SbPluginFactory = SbFunction<[SbPluginOptions], SbPluginInitResult>;

declare global {
  interface Window {
    storyblokRegisterEvent: (cb: SbFunction<never>) => void;
    StoryblokBridge: {
      new (options?: StoryblokBridgeConfigV2): StoryblokBridgeV2;
    };
  }
}

export interface SbPluginInitResult {
  storyblokApi?: StoryblokClient;
}

export type SbBlokKeyDataTypes = string | number | object;

export interface SbBlokData extends StoryblokComponent<string> {
  [index: string]: SbBlokKeyDataTypes;
}

export interface SbSDKOptions {
  bridge?: boolean;
  accessToken?: string;
  use?: SbPluginFactory[];
  apiOptions?: StoryblokConfig;
}

// TODO: temporary till the right bridge types are updated on storyblok-js-client
export interface StoryblokBridgeConfigV2 {
  resolveRelations?: [string];
  customParent?: string;
  preventClicks?: boolean;
}

export type StoryblokEvent =
  | "customEvent"
  | "published"
  | "input"
  | "change"
  | "unpublished"
  | "enterEditmode";

export interface StoryblokBridgeV2 {
  pingEditor: (event: unknown) => void;
  isInEditor: () => boolean;
  enterEditmode: () => void;
  on: (
    event: StoryblokEvent | StoryblokEvent[],
    callback: (payload?: StoryblokEventPayload) => void
  ) => void;
}

export interface SbPluginOptions {
  bridge: boolean;
  apiOptions: StoryblokConfig;
}

export type {
  StoryblokConfig,
  StoryblokCache,
  StoryblokCacheProvider,
  StoryblokResult,
  StoryblokManagmentApiResult,
  StoryblokComponent as StoryblokComponentType,
  StoryData,
  AlternateObject,
  Stories,
  Story,
  StoriesParams,
  StoryParams,
  Richtext,
  RichtextInstance,
} from "storyblok-js-client";
