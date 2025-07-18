import React, { useState, useEffect } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  blockId: string;
  notes: Note[];
  onClose: () => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ blockId, notes, onClose }) => {
  const [currentNote, setCurrentNote] = useState<Note | null>(notes[0] || null);
  const [title, setTitle] = useState(currentNote?.title || '');
  const [content, setContent] = useState(currentNote?.content || '');

  // Save note to Electron Store
  const saveNote = async () => {
    if (!title.trim()) return;

    const noteData: Note = {
      id: currentNote?.id || `note_${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      createdAt: currentNote?.createdAt || new Date(),
      updatedAt: new Date()
    };

    try {
      // TODO: Implement with Electron Store
      console.log('Saving note:', noteData);
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 's':
          e.preventDefault();
          saveNote();
          break;
        case 'b':
          e.preventDefault();
          // TODO: Implement bold formatting
          break;
        case 'i':
          e.preventDefault();
          // TODO: Implement italic formatting
          break;
      }
    }
  };

  return (
    <div className="note-editor-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="note-editor bg-secondary border border-border-color rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="editor-header flex justify-between items-center p-4 border-b border-border-color">
          <h3 className="text-lg font-semibold text-primary">محرر الملاحظات</h3>
          <div className="flex gap-2">
            <button
              onClick={saveNote}
              className="px-4 py-2 bg-accent-color text-white rounded hover:bg-blue-600 transition-colors"
            >
              حفظ
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-secondary text-secondary hover:text-primary rounded transition-colors"
            >
              إغلاق
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="editor-content flex-1 flex flex-col p-4">
          {/* Title Input */}
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="عنوان الملاحظة..."
              className="w-full p-3 bg-accent border border-border-color rounded text-primary placeholder-secondary"
              dir="rtl"
            />
          </div>

          {/* Markdown Toolbar */}
          <div className="toolbar flex gap-2 mb-4 p-2 bg-accent rounded">
            <button
              onClick={() => {/* TODO: Bold */}}
              className="px-3 py-1 bg-secondary text-secondary hover:text-primary rounded text-sm"
              title="عريض (Ctrl+B)"
            >
              B
            </button>
            <button
              onClick={() => {/* TODO: Italic */}}
              className="px-3 py-1 bg-secondary text-secondary hover:text-primary rounded text-sm"
              title="مائل (Ctrl+I)"
            >
              I
            </button>
            <button
              onClick={() => {/* TODO: Heading */}}
              className="px-3 py-1 bg-secondary text-secondary hover:text-primary rounded text-sm"
              title="عنوان"
            >
              H
            </button>
            <button
              onClick={() => {/* TODO: List */}}
              className="px-3 py-1 bg-secondary text-secondary hover:text-primary rounded text-sm"
              title="قائمة"
            >
              •
            </button>
            <button
              onClick={() => {/* TODO: Code */}}
              className="px-3 py-1 bg-secondary text-secondary hover:text-primary rounded text-sm"
              title="كود"
            >
              &lt;/&gt;
            </button>
          </div>

          {/* Content Textarea */}
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب ملاحظتك هنا... تدعم Markdown"
              className="w-full h-full p-4 bg-accent border border-border-color rounded text-primary placeholder-secondary resize-none"
              dir="rtl"
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="editor-footer p-4 border-t border-border-color text-xs text-secondary">
          <div className="flex justify-between">
            <span>Ctrl+S لحفظ • Ctrl+B للعريض • Ctrl+I للمائل</span>
            <span>آخر تحديث: {currentNote?.updatedAt ? new Date(currentNote.updatedAt).toLocaleString('ar-SA') : 'جديد'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor; 