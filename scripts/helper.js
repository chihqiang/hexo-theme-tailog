hexo.extend.helper.register("conf", (cfg) => {
  let conf = hexo.theme.config[cfg];
  if (hexo.config[cfg]) {
    conf = hexo.config[cfg];
  }
  return conf;
});

hexo.extend.generator.register("404", function (locals) {
  return {
    path: "404.html",
    data: {},
    layout: ["404", "layout"],
  };
});


hexo.extend.generator.register("tags", function (locals) {
  return {
    path: "tags.html",
    data: {},
    layout: ["tags", "layout"],
  };
});


hexo.extend.generator.register("resources", function (locals) {
  return {
    path: "resources.html",
    data: {},
    layout: ["resources", "layout"],
  };
});

hexo.extend.helper.register("listResources", function () {
  const sourceDir = hexo.source_dir;
   console.log("source_dir:", hexo.source_dir);
  const htmlFiles = [];
  const fs = require("fs");
  const path = require("path");
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (
        stat.isFile() &&
        path.extname(file).toLowerCase() === ".html"
      ) {
        // 相对于 source 目录的路径
        const relativePath = path.relative(sourceDir, fullPath);
        htmlFiles.push(relativePath.replace(/\\/g, "/")); // 统一用斜杠
      }
    });
  }
  walkDir(sourceDir);
  return htmlFiles; // 返回所有 html 文件相对路径数组
});
