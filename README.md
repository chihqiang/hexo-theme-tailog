# Tailog 

一个基于 TailwindCSS 的 Hexo 主题模板

## 介绍

Tailog 是一个使用 [TailwindCSS](https://tailwindcss.com/) 构建的现代化 Hexo 主题，注重简洁、响应式和良好的用户体验。  
它适合个人博客，尤其是喜欢极简设计和高性能页面的用户。

- 响应式设计，支持移动端和桌面端自适应  
- 纯净的渐变配色，支持深色主题（可扩展）  
- 灵活的布局模块，方便二次开发和定制  
- 内置搜索、文章目录和评论等常用功能支持  
- 友好的 SEO 优化和性能优化  

## 主要技术栈

- Hexo 静态博客框架  
- TailwindCSS 进行样式编写和响应式设计  
- EJS 模板引擎  
- JavaScript (可选用于交互效果)  

## 安装与使用

将主题仓库克隆到 Hexo 的 `themes` 目录下：

```bash
git clone https://github.com/chihqiang/hexo-theme-tailog.git themes/tailog
```

修改 Hexo 根目录的 `_config.yml`，指定主题为 `tailog`：

```
theme: tailog
```

安装依赖并生成静态文件：

~~~
npm install
hexo clean && hexo g
~~~

启动本地服务预览：

```
hexo s
```
