const LanguageDefinitions = {
  "word.before": "Input",
  "word.after": "Result",
  "word.mesh": "Mesh",
  "word.uv": "UV",
};
export function getLanguage() {
  return LanguageDefinitions;
}
export function translate(subject) {
  return subject.replace(/[a-zA-Z_][a-zA-Z0-9_\.]+/g, (key) => {
    return getLanguage(LanguageDefinitions)[key] ?? key;
  });
}
const getURL = (e) =>
  // `http://127.0.0.1:5500/${e}?t=${Math.random()}`;
  `https://github.com/Malik12tree/blockbench-plugins/blob/master/src/mesh_tools/${e}?raw=true`;

export function renderPill({ title, color = "var(--color-accent)" }) {
  return `<span style="
	border: max(1px, 0.0625rem) solid ${color};
	color: ${color};
	border-radius: 2em;
	font-size: .75rem;
	font-weight: 500;
	padding: 0 7px;
	white-space: nowrap;">${(title + "").toUpperCase()}</span>`;
}
export function renderImage({ src, caption = "" }) {
  return `
  <figure>
  <img style="image-rendering: auto;object-fit:contain;width: 250px; height: 250px;min-width: 100px" src="${getURL(
    `assets/actions/${src}`
  )}" />
  <figcaption>${translate(caption)}</figcaption>
  </figure>
  `;
}
export function renderOverflow(children) {
  return `<content>${children}</content>`;
}
export function renderInsetRow({ items }) {
  return `<div style="display: flex;flex-wrap:wrap;">
		${items
      .map(
        (e) =>
          `<div style="border: 1px solid var(--color-dark);background: var(--color-back);">${renderLine(
            e
          )}</div>`
      )
      .join("\n")}
	</div>
	`;
}
export function renderLine(options) {
  if (typeof options == "string") return options;

  switch (options.type) {
    case "image":
      return renderImage(options);
    case "overflow":
      return renderOverflow(options);
    case "inset_row":
      return renderInsetRow(options);
    default:
      throw new Error(`Unknown line type: ${options.type}`);
  }
}
