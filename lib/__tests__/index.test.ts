import {
  storyblokInit,
  apiPlugin,
  storyblokEditable,
  StoryblokPlugin,
} from "../index";

describe("@storyblok/js", () => {
  describe("Api", () => {
    it("Is not loaded by default", () => {
      const result = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
      });

      expect(result).toEqual({});
    });

    it("Is loaded correctly when using the apiPlugin", async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
        use: [apiPlugin],
      });

      const result = await storyblokApi.getAll("cdn/stories");

      expect(result.length).toBeGreaterThan(0);
    });

    it("Is loaded correctly when using apiPlugin and mockPlugin", async () => {
      const mockPlugin: StoryblokPlugin<{ mock: "plugin" }> = () => ({
        mock: "plugin",
      });
      const { storyblokApi, mock } = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
        use: [apiPlugin, mockPlugin],
      });

      expect(mock).toEqual("plugin");

      const result = await storyblokApi.getAll("cdn/stories");

      expect(result.length).toBeGreaterThan(0);
    });

    it("Logs an error if no access token is provided", () => {
      expect(() =>
        storyblokInit({
          accessToken: undefined,
          apiOptions: { accessToken: undefined },
          use: [apiPlugin],
        })
      ).toThrowErrorMatchingInlineSnapshot(
        `"You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"`
      );
    });
  });

  describe("Editable", () => {
    it("Gets data-blok-c and data-blok-uid", async () => {
      const { storyblokApi } = storyblokInit({
        accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
        use: [apiPlugin],
      });

      const { data } = await storyblokApi.get("cdn/stories/demo");

      let blok = data.story.content;
      blok._editable = `<!--#storyblok#{"id":${data.story.id},"uid":"${data.story.uid}"}-->`;

      const editableResult = storyblokEditable(blok);

      expect(editableResult["data-blok-c"]).toBeDefined();
      expect(editableResult["data-blok-uid"]).toBeDefined();
    });
  });
});
