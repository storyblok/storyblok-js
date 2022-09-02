import {
  storyblokInit,
  loadStoryblokBridge,
  renderRichText,
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

window.initWithBridge = () => {
  storyblokInit({
    accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
  });
};

window.initWithoutBridge = () => {
  storyblokInit({
    accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
    bridge: false,
  });
};
window.initCustomRichText = () => {
  storyblokInit({
    accessToken: "wANpEQEsMYGOwLxwXQ76Ggtt",
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
