const Image = require("@11ty/eleventy-img");
const path  = require("path");

module.exports = function (eleventyConfig) {

  // Passthrough — CSS is handled by PostCSS, not copied raw
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

  // Filters
  eleventyConfig.addFilter("byCategory", (pieces, category) =>
    pieces.filter((p) => p.category === category)
  );
  eleventyConfig.addFilter("featured", (pieces) =>
    pieces.filter((p) => p.featured)
  );
  eleventyConfig.addFilter("getBySlug", (pieces, slug) =>
    pieces.find((p) => p.slug === slug)
  );

  // Async shortcode for optimised images.
  // src: path from /assets/... or assets/... (leading slash stripped automatically)
  // loading: "lazy" (default) or "eager" — eager also adds fetchpriority="high"
  // cls: CSS classes forwarded to the <img> element
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, sizes = "100vw", loading = "lazy", cls = "") {
      const srcStripped = src.startsWith("/") ? src.slice(1) : src;
      const fullSrc = path.join("src", srcStripped);
      const metadata = await Image(fullSrc, {
        widths:    [400, 800, 1200, 1600],
        formats:   ["avif", "webp", "jpeg"],
        outputDir: "./src/assets/images/optimised/",
        urlPath:   "/assets/images/optimised/",
      });
      const attrs = {
        alt,
        sizes,
        loading,
        decoding: "async",
        ...(loading === "eager" ? { fetchpriority: "high" } : {}),
        ...(cls ? { class: cls } : {}),
      };
      return Image.generateHTML(metadata, attrs);
    }
  );

  return {
    dir: {
      input:    "src",
      output:   "_site",
      includes: "_includes",
      data:     "_data",
    },
    templateFormats:       ["njk", "html", "md"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine:    "njk",
  };
};
