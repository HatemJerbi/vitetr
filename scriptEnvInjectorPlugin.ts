import type { PluginOption } from "vite";

/**
 * Concatenate the string fragments and interpolated values
 * to get a single string.
 */
function populateTemplate(strings: TemplateStringsArray, ...interps: string[]) {
  let string = "";
  for (let i = 0; i < strings.length; i++) {
    string += `${strings[i] || ""}${interps[i] || ""}`;
  }
  return string;
}

/**
 * Shift all lines left by the *smallest* indentation level,
 * and remove initial newline and all trailing spaces.
 */
export function undent(strings: TemplateStringsArray, ...interps: string[]) {
  let string = populateTemplate(strings, ...interps);
  // Remove initial and final newlines
  string = string.replace(/^[\r\n]+/, "").replace(/\s+$/, "");
  const dents = string.match(/^([ \t])*/gm);
  if (!dents || dents.length == 0) {
    return string;
  }
  dents.sort((dent1, dent2) => dent1.length - dent2.length);
  const minDent = dents[0];
  if (!minDent) {
    // Then min indentation is 0, no change needed
    return string;
  }
  const dedented = string.replace(new RegExp(`^${minDent}`, "gm"), "");
  return dedented;
}

export const scriptEnvInjector = (
  jsonConfigFile: string,
  basePath: string
): PluginOption => {
  return {
    name: "vite-plugin-script-env-injector", // Name of the plugin
    apply: "build",
    transformIndexHtml(html, { bundle }) {
      let jsAsset = "";
      Object.keys(bundle!).forEach((elem) => {
        if (
          elem.includes(".js") &&
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          bundle![elem].isEntry === true &&
          bundle![elem].name === "index" &&
          bundle![elem].type === "chunk"
        ) {
          jsAsset = elem;
          return;
        }
      });

      // delete vite generated entrypoint script from html
      let arr = html.split("\n");
      arr = arr.filter((elem) => !elem.includes(jsAsset));
      const htmlWithoutEntryScript = arr.join("\n");

      // Replace the ${scriptToInject} placeholder with this script
      return htmlWithoutEntryScript.replace(
        "<!-- ${scriptToInject} -->",
        undent`
              <script type="module" crossorigin>
                    fetch("${basePath}/${jsonConfigFile}", { cache: "no-cache" })
                    .then((resp) => {
                      return resp.json();
                    })
                    .then((data) => {
                      window.env = {};
                      window.env={...data};
                      import("${basePath}/${jsAsset}");
                    });
                  </script>
              `
      );
    },
  };
};
