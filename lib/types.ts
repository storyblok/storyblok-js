import { StoryblokConfig, StoryblokComponent } from "storyblok-js-client";

declare global {
  interface Window {
    storyblokRegisterEvent: any;
    StoryblokBridge: any;
  }
}

export interface BlokData extends StoryblokComponent<string> {
  [index: string]: any;
}

export interface SDKOptions {
  bridge?: boolean;
  accessToken?: string;
  use?: [];
  apiOptions?: StoryblokConfig;
}
