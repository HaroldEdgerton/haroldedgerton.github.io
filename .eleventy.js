export default function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/wp-content": "wp-content" });
  eleventyConfig.addPassthroughCopy({ "src/new": "new" });
  eleventyConfig.addPassthroughCopy({ "src/.nojekyll": ".nojekyll" });

  eleventyConfig.addFilter("absoluteUrl", function(value) {
    if (!value) return "/";
    return value.startsWith("/") ? value : `/${value}`;
  });

  return {
    dir: {
      input: "src",
      output: "site",
      includes: "_includes",
      data: "_data"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md", "json"]
  };
}
