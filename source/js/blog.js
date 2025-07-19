// 代码复制按钮逻辑
document.addEventListener("DOMContentLoaded", function () {
  // 为所有代码块添加复制按钮
  document.querySelectorAll("figure.highlight pre").forEach(function (block) {
    const wrapper = block.parentElement;
    wrapper.style.position = "relative";

    const btn = document.createElement("button");
    btn.textContent = "复制";
    btn.className =
      "copy-btn absolute top-2 right-2 bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded transition";

    btn.addEventListener("click", function () {
      const code = block.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = "已复制";
        setTimeout(() => (btn.textContent = "复制"), 1500);
      });
    });

    wrapper.appendChild(btn);
  });
  // 移动端菜单切换逻辑
  document
    .getElementById("mobile-menu-button")
    .addEventListener("click", function () {
      const menu = document.getElementById("mobile-menu");
      menu.classList.toggle("hidden");
    });
});

// 文章列表随机背景色
function randomColor() {
  const colors = [
    "linear-gradient(to right, #f43f5e, #fb923c)", // pink-orange
    "linear-gradient(to right, #3b82f6, #06b6d4)", // blue-cyan
    "linear-gradient(to right, #10b981, #22c55e)", // green shades
    "linear-gradient(to right, #f59e0b, #ef4444)", // amber-red
    "linear-gradient(to right, #8b5cf6, #6366f1)", // purple-indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 搜索函数
function DOMContentLoadedSearch() {
  const inputField = document.getElementById("inputField");
  const articleList = document.getElementById("articleList");
  const searchOverlay = document.getElementById("searchOverlay");
  const inputContainer = document.getElementById("inputContainer");
  // 假设页面有一个触发按钮id为searchButton
  const searchButton = document.getElementById("searchButton");
  if (searchButton) {
    searchButton.addEventListener("click", () => {
      inputContainer.classList.remove("hidden");
      inputContainer.classList.add("fade-in");
      inputContainer.classList.remove("fade-out");
      searchOverlay.classList.remove("hidden");
      inputField.focus();
    });
  }
  function hideSearch() {
    inputContainer.classList.add("fade-out");
    setTimeout(() => {
      inputContainer.classList.add("hidden");
      inputContainer.classList.remove("fade-in");
      searchOverlay.classList.add("hidden");
    }, 300);
  }
  searchOverlay.addEventListener("click", hideSearch);
  // 监听 ESC 关闭搜索框和遮罩
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hideSearch();
    }
  });

  let debounceTimer;
  let articles = [];
  inputField.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const keyword = this.value.toLowerCase();
      if (keyword === "") {
        articleList.innerHTML = "";
        return;
      }
      fetch("/search.json")
        .then((res) => res.json())
        .then((data) => (articles = data))
        .catch((err) => console.error("load search.json err", err));
      const filteredArticles = articles
        .filter((article) => article.title.toLowerCase().includes(keyword))
        .slice(0, 10);
      const directions = ["fromTop", "fromBottom", "fromLeft", "fromRight"];
      articleList.innerHTML =
        filteredArticles.length > 0
          ? filteredArticles
              .map(
                (article, index) => `
              <div class="mb-2 animate-article" style="animation-name: ${
                directions[index % directions.length]
              }">
                <a href="${
                  article.url
                }" class="text-blue-600 hover:underline">${article.title}</a>
              </div>`
              )
              .join("")
          : '<p class="text-gray-500">抱歉，未找到相关内容，换个关键词试试？</p>';
    }, 300);
  });
}
// 流加载函数开始
function createLoadMore({
  total,
  startIndex = 3,
  loadCount = 2,
  waitTime = 100, // 滚动事件节流时间
  threshold = 100, // 距离底部多少像素触发
  immediate = false, // 是否初始化直接触发一次
  onLoad = () => {},
  onFinish = () => {},
}) {
  let currentIndex = startIndex;

  function loadMore() {
    for (let i = currentIndex; i < Math.min(currentIndex + loadCount, total); i++) {
      onLoad(i);
    }
    currentIndex += loadCount;
    if (currentIndex >= total) {
      onFinish?.();
      stop();
    }
  }
  function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;

    if (scrollTop + windowHeight >= fullHeight - threshold) {
      loadMore();
    }
  }

  function throttle(fn, wait) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  const throttledScroll = throttle(handleScroll, waitTime);

  function start() {
    window.addEventListener("scroll", throttledScroll);
    if (immediate) handleScroll();
  }

  function stop() {
    window.removeEventListener("scroll", throttledScroll);
  }

  return { loadMore, start, stop };
}
