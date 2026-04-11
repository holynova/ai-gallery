import { useState, useEffect, useMemo } from 'react';
import { Search, Grid, List, FolderOpen, Image as ImageIcon, Menu } from 'lucide-react';
import type { GalleryImage, Folder, SortOption } from './types/gallery';
import './App.css';

function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load images from config.json
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    fetch(`${baseUrl}images/config.json`)
      .then((res) => res.json())
      .then((data) => {
        const loadedImages: GalleryImage[] = data.images.map((img: any) => ({
          ...img,
          src: `${baseUrl}${img.src.replace(/^\//, '')}`,
          createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
        }));
        setImages(loadedImages);
        setFolders(calculateFolders(loadedImages));
        setLoading(false);
      })
      .catch(() => {
        setImages([]);
        setFolders([]);
        setLoading(false);
      });
  }, []);

  // Calculate folders from images
  function calculateFolders(imgs: GalleryImage[]): Folder[] {
    const folderMap = new Map<string, Folder>();
    imgs.forEach((img) => {
      const folderId = img.folder || 'uncategorized';
      const existing = folderMap.get(folderId);
      if (existing) {
        existing.count = (existing.count || 0) + 1;
      } else {
        folderMap.set(folderId, {
          id: folderId,
          name: folderId === 'uncategorized' ? 'Uncategorized' : folderId,
          count: 1,
        });
      }
    });
    return Array.from(folderMap.values());
  }

  // Filter and sort images
  const filteredImages = useMemo(() => {
    let result = images;

    if (selectedFolder) {
      result = result.filter((img) => img.folder === selectedFolder);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (img) =>
          img.name?.toLowerCase().includes(query) ||
          img.alt?.toLowerCase().includes(query) ||
          img.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return [...result].sort((a, b) => {
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
  }, [images, selectedFolder, sortBy, searchQuery]);

  if (loading) {
    return (
      <div className="app loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

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
                ×
              </button>
            )}
          </div>
        </div>
        <div className="header-right">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
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
        </div>
      </header>

      {/* Main content */}
      <div className="main">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FolderOpen size={20} />
            <span>Folders</span>
          </div>
          <nav className="folder-list">
            <button
              className={`folder-item ${selectedFolder === null ? 'active' : ''}`}
              onClick={() => { setSelectedFolder(null); setSidebarOpen(false); }}
            >
              <span>All Images</span>
              <span className="folder-count">{images.length}</span>
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                className={`folder-item ${selectedFolder === folder.id ? 'active' : ''}`}
                onClick={() => { setSelectedFolder(folder.id); setSidebarOpen(false); }}
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
              onChange={(e) => setSortBy(e.target.value as SortOption)}
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
        <main className="gallery">
          {filteredImages.length === 0 ? (
            <div className="empty-state">
              <ImageIcon size={64} />
              <h2>No images</h2>
              <p>Add images to public/images/ and update config.json</p>
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
                    <img src={image.src} alt={image.alt || image.name} loading="lazy" />
                  </div>
                  <div className="gallery-item-overlay">
                    <span className="gallery-item-name">{image.name || image.alt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div className="lightbox" onClick={() => setLightboxImage(null)}>
          <button className="lightbox-close" onClick={() => setLightboxImage(null)}>
            ×
          </button>
          <img
            src={lightboxImage.src}
            alt={lightboxImage.alt || lightboxImage.name}
            className="lightbox-image"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="lightbox-info">
            <h3>{lightboxImage.name || lightboxImage.alt}</h3>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
