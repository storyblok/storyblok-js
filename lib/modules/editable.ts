import { BlokData } from "../types";

export default (blok: BlokData) => {
  if (typeof blok !== "object" || typeof blok._editable === "undefined") {
    return {};
  }

  const options = JSON.parse(
    blok._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
  );

  return {
    "data-blok-c": JSON.stringify(options),
    "data-blok-uid": options.id + "-" + options.uid,
  };
};
