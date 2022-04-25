import StoryblokClient, { StoryblokConfig } from "storyblok-js-client";

export default (options: any = {}) => {
  const { apiOptions }: { apiOptions: StoryblokConfig } = options;

  if (!apiOptions.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }

  const storyblokApi = new StoryblokClient(apiOptions);
  return { storyblokApi };
};
