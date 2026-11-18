<p align="center">
  <img src="./assets/readme/hero.svg" width="100%" alt="AI Gallery — AI 图片画廊：951 张原创 AI 图片，网格、列表、灯箱随心看">
</p>

<p align="center">
  <a href="https://ai-gallery.xiaosang.cc/">▶ 在线浏览 View Online</a>
  ·
  <a href="https://github.com/holynova/ai-gallery">GitHub 仓库</a>
</p>

AI Gallery 是一个静态 AI 图片画廊：收录 951 张原创 AI 图片，支持搜索、网格 / 列表切换、文件夹、排序、随机浏览与高清灯箱，点赞收藏存在本地，暗色主题。缩略图只用于列表预览，原图保持不变。

AI Gallery is a static gallery of 951 original AI images, with search, grid/list views, folders, sorting, random browsing, a high-resolution lightbox, and local likes — all in a dark theme. Thumbnails are generated for list previews only; originals stay untouched.

## 截图 / Screenshots

<p align="center">
  <img src="./assets/readme/screenshot-grid.jpg" width="800" alt="画廊首页：暗色主题网格视图，左侧文件夹与排序、评分筛选，右侧 951 张图片缩略图">
</p>

<p align="center">
  <img src="./assets/readme/artwork-sample.jpg" width="300" alt="收录作品示例：维多利亚时代伦敦街景，少年侦探手持放大镜，致敬福尔摩斯">
</p>

## 功能 / Features

- **网格 / 列表视图**：一键切换两种浏览方式，图片懒加载。
- **搜索与文件夹**：按文件名搜索，按文件夹分组浏览（当前 951 张都在 default 分组）。
- **7 种排序**：名称、日期、大小各升降序，外加随机浏览。
- **高清灯箱**：点击看原图，支持键盘与手势切换。
- **本地点赞收藏**：点赞 / 点踩存在浏览器 localStorage，可按评分筛选。
- **本地上传预览**：拖放自己的图片到页面即可临时浏览，不上传服务器。
- **暗色主题**：全站暗色，可切换。

## 添加图片 / Adding Images

原图放入 `public/images/`，运行一次准备脚本，自动生成图片清单（`config.json`）与缺少的缩略图，不会把缩略图重复收录，也不会改写原图：

```bash
pnpm run prepare:static
```

## 本地运行 / Run Locally

```bash
pnpm install --frozen-lockfile
pnpm run dev
```

检查画廊完整性（清单与文件是否一致）：

```bash
pnpm run check:gallery
```

## 技术 / Tech

- React 19 + TypeScript + Vite，状态用 Zustand，样式用 Tailwind CSS 4。
- 灯箱用 yet-another-react-lightbox；缩略图生成用 sharp。
- 零后端：图片清单是构建时生成的静态 `config.json`，整站可静态托管。
- 完整原图库约 2.1 GB，超过 GitHub Pages 的 1 GB 站点限制，Pages 站点仅保留历史版本。

```
public/images/      951 张原图 + 自动生成的缩略图 + config.json 图片清单
src/App.tsx         主界面：搜索、文件夹、排序、评分筛选
src/components/     GalleryGrid / ImageCard / Lightbox / Toolbar / UploadZone
src/hooks/          useGallery / useLightbox / useImageRatings / useDarkMode / useLazyLoad
src/store/          Zustand 画廊状态
scripts/            generate-config.js / generate-thumbnails.mjs / check-gallery.mjs
```

## English

**AI Gallery** is a static gallery of 951 original AI images. Search, grid/list views, folders, 7 sort orders (name/date/size + random), a high-resolution lightbox, and local likes stored in the browser — all in a dark theme.

- **Browse**: grid or list, lazy-loaded; filter by folder or by your own ratings.
- **Lightbox**: full-resolution originals with keyboard and swipe navigation.
- **Local upload preview**: drag your own images onto the page to browse them temporarily — nothing leaves your device.
- **Add images**: drop originals into `public/images/` and run `pnpm run prepare:static` to regenerate the catalog and missing thumbnails.
- **Run it**: `pnpm install --frozen-lockfile && pnpm run dev`. Verify the catalog with `pnpm run check:gallery`.
- **Tech**: React 19 + TypeScript + Vite, Zustand state, Tailwind CSS 4, yet-another-react-lightbox, sharp for thumbnails. No backend — the catalog is a static `config.json` generated at build time.
