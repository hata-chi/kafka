import React from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface NoteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  color: string;
  fontSize: number;
  createdAt: string;
}

export function NoteContentModal({
  isOpen,
  onClose,
  content,
  color,
  fontSize,
  createdAt,
}: NoteContentModalProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-[60]">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="w-full max-w-md rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl"
        >
          <div
            className="p-6"
            style={{
              backgroundColor: color,
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <Dialog.Title className="text-lg font-medium">
                Note Content
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-600 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div
              className="prose dark:prose-invert max-w-none"
              style={{ fontSize: `${fontSize}px` }}
            >
              <p className="whitespace-pre-wrap break-words">{content}</p>
            </div>

            <div className="mt-4 text-sm text-gray-600">
              Created at: {formatDate(createdAt)}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}