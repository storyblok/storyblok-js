import {
  storyblokInit,
  apiPlugin,
  storyblokEditable,
  renderRichText,
  isRichTextEmpty,
} from "@storyblok/js";
import { describe, it, expect, vi, afterEach } from "vitest";

import richTextFixture from "../fixtures/richTextObject.json";
import emptyRichTextFixture from "../fixtures/emptyRichTextObject.json";

describe("@storyblok/js", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

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

    it("Logs an error if no access token is provided", () => {
      const spy = vi.spyOn(console, "error");
      storyblokInit({
        accessToken: null,
        apiOptions: { accessToken: null },
        use: [apiPlugin],
      });

      expect(spy).toBeCalledWith(
        "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
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

  describe("isRichTextEmpty", () => {
    it("should return true when passing an empty or invalid RichText object", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(isRichTextEmpty(emptyRichTextFixture)).toBe(true);
    })
    it("should return true when passing a falsy value", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(isRichTextEmpty("")).toBe(true);
    })
  })

  describe("Rich Text Resolver", () => {
    it("should return the rendered HTML when passing a valid RichText object", () => {
      storyblokInit({ accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt", bridge: false });
      expect(renderRichText(richTextFixture)).toMatchSnapshot();
    });
  });
});
