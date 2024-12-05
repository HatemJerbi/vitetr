import { PluginOption } from "vite";

export const scriptEnvInjector = (): PluginOption => {
  return {
    name: "vite-plugin-script-env-injector", // Name of the plugin
    apply: "build",
    transformIndexHtml(html: string, { bundle }): string {
      let arr = html.split("\n");
      arr = arr.filter((elem) => !elem.includes(".js"));
      const htmll = arr.join("\n");
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

      // Replace the ${scriptToInject} placeholder with this script
      return htmll.replace(
        "<!-- ${scriptToInject} -->",
        `\
  <script type="module" crossorigin>
        import("/runtime-env.js").then(()=>{
          import("/${jsAsset}");
        });  
      </script>`
      );
    },
  };
};

/* return htmll.replace(
    "<!-- ${scriptToInject} -->",
    `\
<script type="module" crossorigin>
    fetch("${jsonConfigFile}", { cache: "no-cache" })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      window.env = {};
      window.env={...data};
      import("/${jsAsset}");
    });
  </script>`
  ); */