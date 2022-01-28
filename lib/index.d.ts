import "storyblok-js-client/types/index";
declare global {
    interface Window{
        StoryblokBridge: FunctionConstructor
    }
    interface Function{
        on:Function
    }
}
