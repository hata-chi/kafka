import React, { useState } from 'react';
import { DndContext, DragEndEvent, useDroppable, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';
import { useStore } from './store';
import { StickyNote } from './components/StickyNote';
import { NoteModal } from './components/NoteModal';
import { Sidebar } from './components/Sidebar';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { notes, addNote, deleteNote, updateNotePosition, darkMode } = useStore();
  const sensors = useSensors(useSensor(MouseSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, delta ,over } = event;
    const note = notes.find((n) => n.id === active.id);
    
    if (!note) return;

    // Check if note is dropped on trash
    // const trashElement = document.getElementById('trash-zone');
    // if (trashElement) {
    //   const trashRect = trashElement.getBoundingClientRect();
    //   const { x, y } = event.over?.rect ?? { x: 0, y: 0 };
    //   console.log('x座標:', x);
    //   console.log('y座標:', y);
    //   console.log('trashRect.left:', trashRect.left);
    //   console.log('trashRect.right:', trashRect.right);
    //   console.log('trashRect.top:', trashRect.top);
    //   console.log('trashRect.bottom:', trashRect.bottom);

    //   if (
    //     x >= trashRect.left &&
    //     x <= trashRect.right &&
    //     y >= trashRect.top &&
    //     y <= trashRect.bottom
    //   ) {
    //     console.log('Dropped over item ID: ${over.id}');
    //     deleteNote(note.id);
    //     return;
    //   }
    // }

    if(over){
      deleteNote(note.id);
      return;
    }

    // Update note position
    const newX = Math.min(Math.max(note.position.x + delta.x, 0), window.innerWidth - 256);
    const newY = Math.min(Math.max(note.position.y + delta.y, 0), window.innerHeight - 200);   
    updateNotePosition(note.id, newX, newY);
  };

  // Droppableな要素のごみ箱作る
  const Droppable = ({ id }) => {
    const { setNodeRef } = useDroppable({id});
    
    return (
      <div
        ref={setNodeRef}
        id="trash-zone"
        className="fixed bottom-4 right-4 p-4 rounded-full bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors"
        style={{ zIndex: 50 }}
      >
        <Trash2 size={24} />
      </div>
    )
  }

  // bgがクリックされた時、モーダルを出す
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(true);
    }
  };

  // Saveを押したときに付箋を作る
  const handleCreateNote = ({ content, color, fontSize }: { content: string; color: string; fontSize: number }) => {  
    const note = {
      content,
      color,
      fontSize,
      position: {
        x: Math.random() * (window.innerWidth - 256),
        y: Math.random() * (window.innerHeight - 200),
      },
    };
    addNote(note);
  };

  return (
    <div
      className={`min-h-screen w-full ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
      onClick={handleBackgroundClick}
    >
      <Sidebar onCreateNote={() => setIsModalOpen(true)} />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        {notes
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((note) => (
            <StickyNote key={note.id} {...note} />
          ))}
        <Droppable id="trash-zone" />
      </DndContext>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateNote}
      />
    </div>
  );
}

export default App;