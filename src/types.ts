export interface Note {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  position: {
    x: number;
    y: number;
  };
  createdAt: string;
  zIndex: number;
}

export interface NoteStore {
  notes: Note[];
  darkMode: boolean;
  maxZIndex: number;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'zIndex'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  updateNotePosition: (id: string, x: number, y: number) => void;
  bringToFront: (id: string) => void;
  toggleDarkMode: () => void;
  importNotes: (notes: Note[]) => void;
}