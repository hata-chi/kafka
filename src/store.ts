import { create } from 'zustand';
import { Note, NoteStore } from './types';

export const useStore = create<NoteStore>((set, get) => ({
  notes: [],
  darkMode: false,
  maxZIndex: 0,
  addNote: (note) =>
    set((state) => {
      const newZIndex = state.maxZIndex + 1;
      return {
        notes: [
          ...state.notes,
          {
            ...note,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            zIndex: newZIndex,
          },
        ],
        maxZIndex: newZIndex,
      };
    }),
  updateNote: (id, note) =>
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, ...note } : n)),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  updateNotePosition: (id, x, y) =>
    set((state) => {
      const newZIndex = state.maxZIndex + 1;
      return {
        notes: state.notes.map((n) =>
          n.id === id
            ? { ...n, position: { x, y }, zIndex: newZIndex }
            : n
        ),
        maxZIndex: newZIndex,
      };
    }),
  bringToFront: (id) =>
    set((state) => {
      const newZIndex = state.maxZIndex + 1;
      return {
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, zIndex: newZIndex } : n
        ),
        maxZIndex: newZIndex,
      };
    }),
  toggleDarkMode: () =>
    set((state) => ({
      darkMode: !state.darkMode,
    })),
  importNotes: (notes) =>
    set(() => ({
      notes,
      maxZIndex: Math.max(...notes.map((n) => n.zIndex), 0),
    })),
}));