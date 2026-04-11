import { Upload, Grid, List, Sun, Moon, Monitor } from 'lucide-react';
import type { SortOption, SortLabel } from '../types/gallery';

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  onUploadClick: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  theme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
  imageCount: number;
  selectedCount: number;
}

const sortOptions: { value: SortOption; label: SortLabel }[] = [
  { value: 'date-desc', label: 'Date (Newest)' },
  { value: 'date-asc', label: 'Date (Oldest)' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'size-desc', label: 'Size (Large)' },
  { value: 'size-asc', label: 'Size (Small)' },
];

export function Toolbar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onUploadClick,
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange,
  imageCount,
  selectedCount,
}: ToolbarProps) {
  const themeIcon = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  }[theme];

  const ThemeIcon = themeIcon;

  const cycleTheme = () => {
    const next: Record<string, 'light' | 'dark' | 'system'> = {
      light: 'dark',
      dark: 'system',
      system: 'light',
    };
    onThemeChange(next[theme]);
  };

  return (
    <div className="toolbar">
      <button className="btn btn-primary" onClick={onUploadClick}>
        <Upload size={18} />
        Upload
      </button>

      <input
        type="text"
        className="search-input"
        placeholder="Search images..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <select
        className="select-input"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <div className="flex gap-1">
        <button
          className={`btn btn-secondary ${viewMode === 'grid' ? 'active' : ''}`}
          onClick={() => onViewModeChange('grid')}
          title="Grid view"
        >
          <Grid size={18} />
        </button>
        <button
          className={`btn btn-secondary ${viewMode === 'list' ? 'active' : ''}`}
          onClick={() => onViewModeChange('list')}
          title="List view"
        >
          <List size={18} />
        </button>
      </div>

      <button className="btn btn-secondary" onClick={cycleTheme} title={`Theme: ${theme}`}>
        <ThemeIcon size={18} />
      </button>

      <div className="stats-bar" style={{ marginLeft: 'auto' }}>
        <span>{imageCount} images</span>
        {selectedCount > 0 && <span>{selectedCount} selected</span>}
      </div>
    </div>
  );
}
