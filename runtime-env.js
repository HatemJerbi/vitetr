(function () {
  fetch("/vitetr/config/app-config.json", { cache: "no-cache" })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      window.env = {};
      window.env = { ...data };
    });
})();
