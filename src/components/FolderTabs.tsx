import { Folder } from 'lucide-react';
import type { Folder as FolderType } from '../types/gallery';

interface FolderTabsProps {
  folders: FolderType[];
  selectedFolder: string | null;
  onSelectFolder: (folderId: string | null) => void;
}

export function FolderTabs({ folders, selectedFolder, onSelectFolder }: FolderTabsProps) {
  if (folders.length === 0) return null;

  return (
    <div className="folder-tabs">
      <button
        className={`folder-tab ${selectedFolder === null ? 'active' : ''}`}
        onClick={() => onSelectFolder(null)}
      >
        All ({folders.reduce((acc, f) => acc + (f.count || 0), 0)})
      </button>
      {folders.map((folder) => (
        <button
          key={folder.id}
          className={`folder-tab ${selectedFolder === folder.id ? 'active' : ''}`}
          onClick={() => onSelectFolder(folder.id)}
        >
          <Folder size={14} style={{ marginRight: '0.25rem' }} />
          {folder.name} ({folder.count || 0})
        </button>
      ))}
    </div>
  );
}
