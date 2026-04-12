import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Grid, List, FolderOpen, Image as ImageIcon, Menu, ThumbsUp, ThumbsDown } from 'lucide-react';
import type { GalleryImage, Folder, SortOption } from './types/gallery';
import { useLightbox } from './hooks/useLightbox';
import { useImageRatings } from './hooks/useImageRatings';
import { Lightbox } from './components/Lightbox';
import './App.css';

export type RatingFilter = 'all' | 'liked' | 'disliked' | 'neutral';

function App() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('all');
  const [shuffleSeed, setShuffleSeed] = useState(Math.random());
  const sortSelectRef = useRef<HTMLSelectElement>(null);

  // Image ratings state and controls
  const {
    getRating,
    toggleLike,
    toggleDislike,
    getLikeCount,
    getDislikeCount,
  } = useImageRatings();

  // Lightbox state and controls
  const {
    isOpen,
    currentImage,
    currentIndex,
    images: lightboxImages,
    open: openLightbox,
    close: closeLightbox,
    goToNext,
    goToPrevious,
    hasNext,
    hasPrevious,
  } = useLightbox();

  // Load images from config.json
  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL;
    fetch(`${baseUrl}images/config.json`)
      .then((res) => res.json())
      .then((data) => {
        const loadedImages: GalleryImage[] = data.images.map((img: any) => ({
          ...img,
          src: img.src,
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

  // Listen for native select change events (fallback for React onChange issues)
  useEffect(() => {
    const select = sortSelectRef.current;
    if (!select) return;

    const handleNativeChange = () => {
      const value = select.value as SortOption;
      setSortBy(value);
      if (value === 'random') {
        setShuffleSeed(Math.random());
      }
    };

    select.addEventListener('change', handleNativeChange);
    return () => select.removeEventListener('change', handleNativeChange);
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

    // Rating filter
    if (ratingFilter === 'liked') {
      result = result.filter((img) => getRating(img.id) === 'like');
    } else if (ratingFilter === 'disliked') {
      result = result.filter((img) => getRating(img.id) === 'dislike');
    } else if (ratingFilter === 'neutral') {
      result = result.filter((img) => getRating(img.id) === null);
    }

    // Fisher-Yates shuffle for random sort
    function shuffleArray<T>(array: T[], seed: number): T[] {
      const shuffled = [...array];
      // Use seed for reproducible randomness within same seed
      let random = seed;
      for (let i = shuffled.length - 1; i > 0; i--) {
        random = (random * 9301 + 49297) % 233280;
        const j = Math.floor((random / 233280) * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    if (sortBy === 'random') {
      return shuffleArray(result, shuffleSeed);
    }

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return (a.name || a.alt || '').localeCompare(b.name || b.alt || '');
        case 'name-desc':
          return (b.name || a.alt || '').localeCompare(a.name || b.alt || '');
        case 'date-asc':
          return (a.createdAt?.getTime() || 0) - (b.createdAt?.getTime() || 0);
        case 'date-desc':
          return (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0);
        default:
          return 0;
      }
    });
  }, [images, selectedFolder, sortBy, searchQuery, ratingFilter, getRating, shuffleSeed]);

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
              onChange={(e) => {
                const value = e.target.value as SortOption;
                setSortBy(value);
                if (value === 'random') {
                  setShuffleSeed(Math.random());
                }
              }}
              className="sort-select"
              ref={sortSelectRef}
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="random">Shuffle (Random)</option>
            </select>
          </div>

          {/* Rating filter */}
          <div className="sidebar-section">
            <h3>Filter by rating</h3>
            <div className="rating-filter">
              <button
                className={`rating-btn ${ratingFilter === 'all' ? 'active' : ''}`}
                onClick={() => setRatingFilter('all')}
              >
                All
              </button>
              <button
                className={`rating-btn ${ratingFilter === 'liked' ? 'active' : ''}`}
                onClick={() => setRatingFilter('liked')}
              >
                <ThumbsUp size={14} /> {getLikeCount()}
              </button>
              <button
                className={`rating-btn ${ratingFilter === 'disliked' ? 'active' : ''}`}
                onClick={() => setRatingFilter('disliked')}
              >
                <ThumbsDown size={14} /> {getDislikeCount()}
              </button>
              <button
                className={`rating-btn ${ratingFilter === 'neutral' ? 'active' : ''}`}
                onClick={() => setRatingFilter('neutral')}
              >
                Neutral
              </button>
            </div>
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
                  onClick={() => openLightbox(image, filteredImages)}
                >
                  <div className="gallery-item-image">
                    <img src={image.thumbnail || image.src} alt={image.alt || image.name} loading="lazy" />
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
      <Lightbox
        isOpen={isOpen}
        image={currentImage}
        images={lightboxImages}
        currentIndex={currentIndex}
        onClose={closeLightbox}
        onPrevious={goToPrevious}
        onNext={goToNext}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        rating={currentImage ? getRating(currentImage.id) : null}
        onLike={() => currentImage && toggleLike(currentImage.id)}
        onDislike={() => currentImage && toggleDislike(currentImage.id)}
      />
    </div>
  );
}

export default App;
