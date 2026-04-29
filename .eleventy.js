const Image = require("@11ty/eleventy-img");
const path  = require("path");

module.exports = function (eleventyConfig) {

  // Passthrough — CSS is handled by PostCSS, not copied raw
  eleventyConfig.addPassthroughCopy("src/assets/images");

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

  // Async shortcode for optimised images
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, sizes = "100vw") {
    const fullSrc = path.join("src", src);
    const metadata = await Image(fullSrc, {
      widths:     [400, 800, 1200, 1600],
      formats:    ["avif", "webp", "jpeg"],
      outputDir:  "./_site/assets/images/optimised/",
      urlPath:    "/assets/images/optimised/",
    });
    const imageAttributes = { alt, sizes, loading: "lazy", decoding: "async" };
    return Image.generateHTML(metadata, imageAttributes);
  });

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
