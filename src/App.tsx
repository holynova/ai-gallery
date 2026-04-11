import { useState, useCallback, useRef } from 'react';
import { useGalleryStore } from './store/galleryStore';
import { Upload, Search, Grid, List, Trash2, FolderOpen, X, Image as ImageIcon } from 'lucide-react';
import type { GalleryImage } from './types/gallery';
import './App.css';

function App() {
  const {
    images,
    folders,
    selectedFolder,
    sortBy,
    searchQuery,
    viewMode,
    addImages,
    removeImage,
    selectFolder,
    setSortBy,
    setSearchQuery,
    setViewMode,
  } = useGalleryStore();

  const [isDragging, setIsDragging] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort images
  const filteredImages = images
    .filter((img) => {
      if (selectedFolder && img.folder !== selectedFolder) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          img.name?.toLowerCase().includes(query) ||
          img.alt?.toLowerCase().includes(query) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || a.alt || '').localeCompare(b.name || b.alt || '');
        case 'name-desc':
          return (b.name || a.alt || '').localeCompare(a.name || a.alt || '');
        case 'date-asc':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'date-desc':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        default:
          return 0;
      }
    });

  // Handle file upload
  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const newImages: GalleryImage[] = [];

      Array.from(files).forEach((file) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const galleryImage: GalleryImage = {
                id: crypto.randomUUID(),
                src: e.target?.result as string,
                thumbnail: e.target?.result as string,
                name: file.name,
                alt: file.name,
                width: img.width,
                height: img.height,
                folder: selectedFolder || 'uncategorized',
                createdAt: new Date(),
              };
              newImages.push(galleryImage);
              if (newImages.length === Array.from(files).filter((f) => f.type.startsWith('image/')).length) {
                addImages(newImages);
              }
            };
            img.src = e.target?.result as string;
          };
          reader.readAsDataURL(file);
        }
      });
    },
    [addImages, selectedFolder]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <h1 className="logo">
            <ImageIcon className="logo-icon" />
            AI Gallery
          </h1>
        </div>
        <div className="header-center">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="header-right">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={20} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <List size={20} />
          </button>
          <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
            <Upload size={20} />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      {/* Main content */}
      <div className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <FolderOpen size={20} />
            <span>Folders</span>
          </div>
          <nav className="folder-list">
            <button
              className={`folder-item ${selectedFolder === null ? 'active' : ''}`}
              onClick={() => selectFolder(null)}
            >
              <span>All Images</span>
              <span className="folder-count">{images.length}</span>
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                onClick={() => selectFolder(folder.id)}
              >
                <span>{folder.name}</span>
                <span className="folder-count">{folder.count}</span>
              </button>
            ))}
          </nav>

          {/* Sort options */}
          <div className="sidebar-section">
            <h3>Sort by</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="sort-select"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
          </div>
        </aside>

        {/* Gallery */}
        <main
          className={`gallery ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {filteredImages.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={64} />
              <h2>No images yet</h2>
              <p>Drag and drop images here or click Upload to get started</p>
            </div>
          ) : (
            <div className={`gallery-grid ${viewMode}`}>
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  onClick={() => setLightboxImage(image)}
                >
                  <div className="gallery-item-image">
                    <img
                      src={image.thumbnail || image.src}
                      alt={image.alt || image.name}
                      loading="lazy"
                    />
                  </div>
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-name">{image.name || image.alt}</span>
                    <button
                      className="gallery-item-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {isDragging && (
            <div className="drop-overlay">
              <Upload size={64} />
              <span>Drop images here</span>
            </div>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
            <X size={24} />
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt || lightboxImage.name}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-info">
            <h3>{lightboxImage.name || lightboxImage.alt}</h3>
            {lightboxImage.width && lightboxImage.height && (
              <p>
                {lightboxImage.width} x {lightboxImage.height}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
