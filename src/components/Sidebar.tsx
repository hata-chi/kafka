import React from 'react';
import { Menu } from '@headlessui/react';
import {
  Settings,
  Moon,
  Sun,
  Plus,
  Download,
  Upload,
  Trash2,
  Clock,
} from 'lucide-react';
import { useStore } from '../store';
import { Note } from '../types';

interface SidebarProps {
  onCreateNote: () => void;
}

export function Sidebar({ onCreateNote }: SidebarProps) {
  const { darkMode, toggleDarkMode, notes, importNotes, deleteNote } = useStore();

  const handleExport = () => {
    const dataStr = JSON.stringify(notes);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'notes.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedNotes = JSON.parse(e.target?.result as string) as Note[];
            importNotes(importedNotes);
          } catch (error) {
            console.error('Error importing notes:', error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700">
          <Settings className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </Menu.Button>

        <Menu.Items className="absolute left-0 mt-2 w-80 origin-top-left rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={onCreateNote}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Plus className="mr-2 h-5 w-5" />
                  New Note
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleExport}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Download className="mr-2 h-5 w-5" />
                  Export Notes
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleImport}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Import Notes
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={toggleDarkMode}
                  className={`${
                    active ? 'bg-gray-100 dark:bg-gray-700' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200`}
                >
                  {darkMode ? (
                    <Sun className="mr-2 h-5 w-5" />
                  ) : (
                    <Moon className="mr-2 h-5 w-5" />
                  )}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              )}
            </Menu.Item>

            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

            <div className="px-2 py-2">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                <Clock className="inline-block mr-2 h-4 w-4" />
                Recent Notes
              </h3>
              <div className="max-h-60 overflow-y-auto">
                {notes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((note) => (
                  <div
                    key={note.id}
                    className="flex items-start justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-200 truncate">
                        {note.content}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="ml-2 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Menu.Items>
      </Menu>
    </div>
  );
}