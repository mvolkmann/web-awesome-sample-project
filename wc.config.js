export default {
  libraries: {
    "@awesome.me/webawesome": {
      /**
       * Fetch manifest from a URL
       * This isn't needed if you have the NPM package installed
       * See https://github.com/wc-toolkit/wc-language-server/issues/27.
       */
      manifestSrc:
        "[./build/custom-elements.json](https://cdn.jsdelivr.net/npm/@awesome.me/webawesome@3.0.0-beta.6/dist/custom-elements.json)",
    },
  },
};
