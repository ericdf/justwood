const Image = require("@11ty/eleventy-img");
const path  = require("path");
const fs    = require("fs");

// Trailing slash stripped so we can safely write `${prefix}/foo/`.
// Locally prefix is "" (serving at /); in GitHub Pages CI it is "/justwood".
const prefix = (process.env.PATH_PREFIX || "/").replace(/\/$/, "");

module.exports = function (eleventyConfig) {

  // In production, inline the compiled CSS so there's no render-blocking stylesheet request.
  // PostCSS runs before Eleventy in the build script, so the file exists by the time this transform fires.
  if (process.env.NODE_ENV === "production") {
    eleventyConfig.addTransform("inlineCss", function (content) {
      if (!this.outputPath || !this.outputPath.endsWith(".html")) return content;
      const cssPath = path.join("_site", "assets", "css", "main.css");
      if (!fs.existsSync(cssPath)) return content;
      const css = fs.readFileSync(cssPath, "utf8");
      return content.replace(
        /<link rel="stylesheet" href="[^"]*main\.css[^"]*">/,
        `<style>${css}</style>`
      );
    });
  }

  // Passthrough — CSS is handled by PostCSS, not copied raw
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

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

  const imageOptions = {
    widths:    [400, 800, 1200, 1600],
    formats:   ["avif", "webp", "jpeg"],
    outputDir: "./src/assets/images/optimised/",
    urlPath:   `${prefix}/assets/images/optimised/`,
  };

  // Async shortcode for optimised images.
  // src: path from /assets/... or assets/... (leading slash stripped automatically)
  // loading: "lazy" (default) or "eager" — eager also adds fetchpriority="high"
  // cls: CSS classes forwarded to the <img> element
  // style: inline styles forwarded to the <img> element
  eleventyConfig.addAsyncShortcode(
    "image",
    async function (src, alt, sizes = "100vw", loading = "lazy", cls = "", style = "") {
      const srcStripped = src.startsWith("/") ? src.slice(1) : src;
      const fullSrc = path.join("src", srcStripped);
      const metadata = await Image(fullSrc, imageOptions);
      const attrs = {
        alt,
        sizes,
        loading,
        decoding: "async",
        ...(loading === "eager" ? { fetchpriority: "high" } : {}),
        ...(cls   ? { class: cls }   : {}),
        ...(style ? { style }        : {}),
      };
      return Image.generateHTML(metadata, attrs);
    }
  );

  // Returns a <link rel="preload"> tag for the avif srcset of an image.
  // Use in <head> to preload the LCP hero image.
  eleventyConfig.addAsyncShortcode(
    "imagePreload",
    async function (src, sizes = "100vw") {
      const srcStripped = src.startsWith("/") ? src.slice(1) : src;
      const fullSrc = path.join("src", srcStripped);
      const metadata = await Image(fullSrc, imageOptions);
      const srcset = metadata.avif.map(img => `${img.url} ${img.width}w`).join(", ");
      return `<link rel="preload" as="image" imagesrcset="${srcset}" imagesizes="${sizes}" type="image/avif">`;
    }
  );

  return {
    pathPrefix: process.env.PATH_PREFIX || "/",
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
