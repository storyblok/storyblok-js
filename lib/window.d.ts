export {};
declare global {
  interface Window {
    storyblokRegisterEvent?: (cb: () => void) => void;
    StoryblokBridge?: new (config: StoryblokBridgeConfig) => StoryblokBridge;
  }
}
