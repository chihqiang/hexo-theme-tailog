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

  // 移动端搜索按钮逻辑
  const mobileSearchBtn = document.getElementById("mobile-search-button");
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener("click", function () {
      const searchButton = document.getElementById("searchButton");
      if (searchButton) {
        searchButton.click();
        const menu = document.getElementById("mobile-menu");
        menu.classList.add("hidden");
      }
    });
  }

  // 回到顶部按钮逻辑
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", function () {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.remove("opacity-0", "invisible");
        backToTopBtn.classList.add("opacity-100", "visible");
      } else {
        backToTopBtn.classList.add("opacity-0", "invisible");
        backToTopBtn.classList.remove("opacity-100", "visible");
      }
    });

    backToTopBtn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // 阅读进度条逻辑
  const progressBar = document.getElementById("reading-progress");
  if (progressBar) {
    window.addEventListener("scroll", function () {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      progressBar.style.width = progress + "%";
    });
  }

  // 深色模式切换逻辑
  const themeToggleBtn = document.getElementById("theme-toggle");
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  
  if (themeToggleBtn) {
    function updateThemeIcons() {
      if (document.documentElement.classList.contains("dark")) {
        sunIcon.classList.remove("hidden");
        moonIcon.classList.add("hidden");
      } else {
        sunIcon.classList.add("hidden");
        moonIcon.classList.remove("hidden");
      }
    }
    
    updateThemeIcons();
    
    themeToggleBtn.addEventListener("click", function () {
      document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
      updateThemeIcons();
    });
  }
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
  let articlesLoaded = false;
  inputField.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const keyword = this.value.toLowerCase();
      if (keyword === "") {
        articleList.innerHTML = "";
        return;
      }
      if (!articlesLoaded) {
        fetch("/search.json")
          .then((res) => res.json())
          .then((data) => {
            articles = data;
            articlesLoaded = true;
            filterAndDisplayArticles(keyword);
          })
          .catch((err) => console.error("load search.json err", err));
      } else {
        filterAndDisplayArticles(keyword);
      }
    }, 300);
  });

  function filterAndDisplayArticles(keyword) {
    const filteredArticles = articles
      .filter((article) => article.title.toLowerCase().includes(keyword))
      .slice(0, 10);
    
    articleList.innerHTML =
      filteredArticles.length > 0
        ? filteredArticles
            .map(
              (article) => `
            <div class="result-item" data-url="${article.url}">
              <div class="result-title">${article.title}</div>
              ${article.excerpt ? `<div class="result-excerpt">${article.excerpt}</div>` : ''}
              ${article.date ? `<div class="result-date">${article.date}</div>` : ''}
            </div>`
            )
            .join('')
        : '<div class="no-results">抱歉，未找到相关内容，换个关键词试试？</div>';

    if (filteredArticles.length > 0) {
      const resultItems = articleList.querySelectorAll('.result-item');
      resultItems.forEach(item => {
        item.addEventListener('click', () => {
          const url = item.getAttribute('data-url');
          if (url) {
            window.location.href = url;
          }
        });
      });
    }
  }
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
    for (
      let i = currentIndex;
      i < Math.min(currentIndex + loadCount, total);
      i++
    ) {
      onLoad(i);
    }
    currentIndex += loadCount;
    if (currentIndex >= total) {
      onFinish?.();
      stop();
    }
  }
  function handleScroll() {
    const scrollTop =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;
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

// 导航栏滚动效果
window.addEventListener("scroll", function() {
  const navbar = document.getElementById("navbar");
  if (navbar) {
    if (window.pageYOffset > 50) {
      navbar.classList.add("shadow-2xl", "backdrop-blur-md", "bg-opacity-90");
      navbar.classList.remove("shadow-lg");
    } else {
      navbar.classList.remove("shadow-2xl", "backdrop-blur-md", "bg-opacity-90");
      navbar.classList.add("shadow-lg");
    }
  }
});

// 自适应导航菜单
(function initAdaptiveNav() {
  const desktopMenu = document.getElementById('desktop-menu');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const dropdownContent = document.getElementById('dropdown-content');
  
  if (!desktopMenu || !dropdownMenu || !dropdownContent) return;
  
  const navItems = Array.from(desktopMenu.querySelectorAll('.nav-item'));
  const menuData = navItems.map(item => ({
    element: item,
    text: item.textContent.trim(),
    href: item.getAttribute('href'),
    index: parseInt(item.getAttribute('data-index'))
  }));
  
  function calculateVisibleItems() {
    const availableWidth = window.innerWidth;
    const titleWidth = 200;
    const buttonsWidth = 150;
    const paddingWidth = 100;
    const itemWidth = 100;
    const dropdownWidth = 80;
    
    const usableWidth = availableWidth - titleWidth - buttonsWidth - paddingWidth;
    
    if (usableWidth <= 0) return 0;
    
    let visibleCount = Math.floor((usableWidth - dropdownWidth) / itemWidth);
    if (visibleCount < 0) visibleCount = 0;
    if (visibleCount > menuData.length) visibleCount = menuData.length;
    
    return visibleCount;
  }
  
  function updateMenu() {
    const visibleCount = calculateVisibleItems();
    
    menuData.forEach((item, index) => {
      if (index < visibleCount) {
        item.element.classList.remove('hidden');
      } else {
        item.element.classList.add('hidden');
      }
    });
    
    if (visibleCount < menuData.length) {
      dropdownMenu.classList.remove('hidden');
      
      const dropdownItems = menuData.slice(visibleCount);
      dropdownContent.innerHTML = dropdownItems.map(item => `
        <a href="${item.href}" class="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition first:rounded-t-lg last:rounded-b-lg">
          ${item.text}
        </a>
      `).join('');
    } else {
      dropdownMenu.classList.add('hidden');
    }
  }
  
  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  const throttledUpdate = throttle(updateMenu, 100);
  
  window.addEventListener('resize', throttledUpdate);
  
  updateMenu();
})();
