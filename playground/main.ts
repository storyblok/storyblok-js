import {
  storyblokInit,
  loadStoryblokBridge,
  renderRichText,
  useStoryblokBridge,
  apiPlugin,
} from "@storyblok/js";
import richTextFixture from "../lib/fixtures/richTextObject.json";

const customSchema = {
  nodes: {},
  marks: {
    custom_link(node) {
      const attrs = { ...node.attrs };

      return {
        tag: [
          {
            tag: "a",
            attrs: attrs,
          },
        ],
      };
    },
  },
};

const customComponentResolver = (component, blok) => {
  switch (component) {
    case "custom_component":
      return `<div class="custom-component">${blok.message}</div>`;
      break;
    default:
      return `Component ${component} not found`;
  }
};

declare global {
  interface Window {
    initWithBridge: any;
    initWithoutBridge: any;
    loadStoryblokBridgeScript: any;
    initCustomRichText: any;
    renderRichText: any;
    renderRichTextWithOptions: any;
  }
}

window.initWithBridge = async () => {
  const { storyblokApi } = storyblokInit({
    accessToken: "OurklwV5XsDJTIE1NJaD2wtt",
    use: [apiPlugin],
  });

  const { data } = await storyblokApi!.get("cdn/stories/js", {
    version: "draft",
  });

  //@ts-ignore
  window.updateBubbleButton(data.story);

  useStoryblokBridge(data.story.id, (newStory) => {
    console.log("-- PLAYGROUND --");
    console.log(newStory);
  });
};

window.initWithoutBridge = () => {
  storyblokInit({
    accessToken: "OurklwV5XsDJTIE1NJaD2wtt",
    bridge: false,
  });

  // Used to test no log/warn/errors are printed
  useStoryblokBridge(1, () => {});
};
window.initCustomRichText = () => {
  storyblokInit({
    accessToken: "OurklwV5XsDJTIE1NJaD2wtt",
    richText: {
      schema: customSchema,
      resolver: customComponentResolver,
    },
  });
};

window.renderRichText = () => {
  const renderedRichText = renderRichText(richTextFixture);
  const richTextContainer = document.getElementById(
    "rich-text-container"
  ) as any;
  richTextContainer.innerHTML = renderedRichText;
  console.log(renderedRichText);
};

window.renderRichTextWithOptions = () => {
  const renderedRichText = renderRichText(richTextFixture, {
    schema: customSchema,
    resolver: customComponentResolver,
  });
  const richTextContainer = document.getElementById(
    "rich-text-container"
  ) as any;
  richTextContainer.innerHTML = renderedRichText;
};

window.loadStoryblokBridgeScript = () => {
  loadStoryblokBridge();
};
