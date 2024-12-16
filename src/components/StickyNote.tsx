import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { useStore } from '../store';
import { NoteContentModal } from './NoteContentModal';

// interfaceで形を定義
interface StickyNoteProps {
  id: string;
  content: string;
  color: string;
  fontSize: number;
  position: { x: number; y: number };
  createdAt: string;
  zIndex: number;
}

const MAX_CONTENT_LENGTH = 280; // Twitter-like character limit

export function StickyNote({ id, content, color, fontSize, position, createdAt, zIndex }: StickyNoteProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { bringToFront } = useStore();
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    bringToFront(id);
  };

  const truncatedContent = content.length > MAX_CONTENT_LENGTH
    ? content.slice(0, MAX_CONTENT_LENGTH) + '...'
    : content;

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          position: 'absolute',
          left: position.x,
          top: position.y,
          maxWidth: '100%',
          maxHeight: '100%',
          zIndex,
        }}
        className="w-64 rounded-xl shadow-lg cursor-move overflow-hidden"
        onClick={handleClick}
        {...listeners}
        {...attributes}
      >
        <div
          className="p-4"
          style={{
            backgroundColor: color,
            fontSize: `${fontSize}px`,
          }}
        >
          <p className="break-words mb-2">{truncatedContent}</p>
          {content.length > MAX_CONTENT_LENGTH && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Show more...
            </button>
          )}
          <div className="text-xs text-gray-600 mt-2 flex items-center">
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      <NoteContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={content}
        color={color}
        fontSize={fontSize}
        createdAt={createdAt}
      />
    </>
  );
}