import editable from "./editable";

function createEditInEditorLink(link) {
  // Create the bubble button (a link with inline CSS)
  const editInEditorEl = document.createElement("a");
  editInEditorEl.id = `sb_edit-in-editor-link`;
  editInEditorEl.innerHTML = `
  <svg width="40px" height="40px" viewBox="0 0 45 45" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g id="storyblok-logo-kit" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <g id="storyblok-partner-logo" fill-rule="nonzero">
          <g id="storyblok-symbol">
              <path d="M2.32662261,0 C1.03405449,0 0,1.0331384 0,2.27290448 L0,42.8752437 C0,44.1150097 1.03405449,44.8898635 2.27491989,44.8898635 L8.27243596,44.8898635 L8.27243596,53 L15.7176283,44.9415205 L42.9132615,44.9415205 C44.1541269,44.9415205 44.9296678,44.1666667 44.9296678,42.8752437 L44.9296678,2.3245614 C44.9296678,1.08479532 44.2058296,0 42.9132615,0 L2.32662261,0 Z" id="Shape-path-Copy" fill="#0AB3AF"></path>
              <path d="M29.1016723,8.11483254 C30.1351059,8.11483254 31.0135245,8.32132604 31.8402713,8.78593643 C32.6153465,9.19892344 33.33875,9.76678059 33.9071385,10.4378845 C35.0647615,11.8482391 35.6869248,13.6215753 35.6639755,15.445352 C35.6639755,16.7875598 35.3022738,18.0781442 34.630542,19.3171053 C33.9341248,20.5632996 32.8438147,21.5436614 31.5302412,22.1047676 C33.183735,22.569378 34.4755269,23.395352 35.4572888,24.5826897 C36.387379,25.8216507 36.8524241,27.4219754 36.8524241,29.4352871 C36.8524241,30.7258715 36.6168825,31.8756998 36.1290206,32.7391832 C35.6123039,33.668404 34.8372287,34.4427546 33.9071385,35.0106118 C32.9253766,35.6300923 31.8402713,36.1979494 30.600151,36.4560663 C29.3600307,36.7658066 28.0165671,37.0239234 26.6214318,37.0239234 L8.32965751,37.0239234 L8.32965751,8.11483254 L29.1016723,8.11483254 Z M26.1340815,24.271851 L15.77813,24.271851 L15.77813,29.1552028 L25.8851404,29.1552028 C26.4825991,29.1552028 27.0302696,28.9110352 27.4783637,28.5203671 C27.8766695,28.1296989 28.1256107,27.5436967 28.1256107,26.811194 C28.140051,26.1827412 27.948041,25.5663945 27.5779401,25.0531873 C27.1796343,24.5648522 26.7315403,24.271851 26.1340815,24.271851 Z M25.2876816,14.5051475 L15.77813,14.5051475 L15.77813,18.9001641 L25.0885287,18.9001641 C25.586411,18.9001641 26.0842933,18.6559965 26.4825991,18.3629954 C26.9306932,18.0699943 27.1298461,17.4351586 27.1298461,16.6049888 C27.1298461,15.872486 26.9306932,15.3353173 26.5821756,14.9934827 C26.233658,14.7004816 25.7855639,14.5051475 25.2876816,14.5051475 Z" id="Combined-Shape-Copy-3" fill="#FFFFFF"></path>
          </g>
      </g>
  </g>
</svg>
  `;
  editInEditorEl.setAttribute(
    "style",
    `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 60px;
      height: 60px;
      background-color: #0ab3af;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 18px;
      color: #fff;
      text-decoration: none;
  `
  );

  // Set the link for the button
  editInEditorEl.href = link || "#"; // Set the provided link or a default value

  // Append the bubble button to the end of the body
  document.body.appendChild(editInEditorEl);
}

// Initialize the EditInEditor button
export default () => {
  //@ts-ignore
  window.updateEditInEditorLink = (story) => {
    const blockFields = editable(story.content);
    const { space, id: storyId } = JSON.parse(blockFields["data-blok-c"]);

    const editInEditorEl: HTMLLinkElement = document.querySelector(
      "#sb_edit-in-editor-link"
    );

    if (editInEditorEl) {
      editInEditorEl.href = `https://app.storyblok.com/#/me/spaces/${space}/stories/0/0/${storyId}`;
    }
  };

  const storyId = new URL(window.location?.href).searchParams.get("_storyblok");
  !!!storyId && createEditInEditorLink("");
};
