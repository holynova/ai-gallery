# AI Gallery

A modern, beautiful image gallery built with React, TypeScript, and Zustand.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.4-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.2-3178c6.svg)

## Features

- **Image Upload** - Drag & drop or click to upload images
- **Grid/List View** - Toggle between grid and list layouts
- **Search** - Search images by name, alt text, or tags
- **Folder Organization** - Organize images into folders
- **Sorting** - Sort by name or date
- **Lightbox Preview** - Full-screen image preview with details
- **Dark Mode** - Beautiful dark theme UI
- **Persistent Storage** - Images stored in localStorage

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management with persistence
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/holynova/ai-gallery.git
cd ai-gallery

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/       # React components
│   ├── FolderTabs.tsx
│   ├── GalleryGrid.tsx
│   ├── ImageCard.tsx
│   ├── Lightbox.tsx
│   ├── Toolbar.tsx
│   └── UploadZone.tsx
├── hooks/           # Custom React hooks
│   ├── useGallery.ts
│   ├── useLazyLoad.ts
│   ├── useLightbox.ts
│   └── useDarkMode.ts
├── store/           # Zustand store
│   └── galleryStore.ts
├── types/           # TypeScript types
│   └── gallery.ts
├── App.tsx          # Main app component
├── App.css          # App styles
└── main.tsx         # Entry point
```

## Usage

1. **Upload Images** - Click the Upload button or drag & drop images onto the gallery
2. **Organize** - Images are automatically sorted by date (newest first)
3. **Search** - Use the search bar to find images by name
4. **Folders** - Click a folder in the sidebar to filter images
5. **Preview** - Click any image to view it in lightbox mode
6. **Delete** - Hover over an image and click the trash icon to remove it

## License

MIT License - see LICENSE file for details.
