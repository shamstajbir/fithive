import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuickNotes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('admin_quick_notes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now(),
        text: newNote,
        timestamp: new Date().toLocaleString()
      };
      const updated = [note, ...notes];
      setNotes(updated);
      localStorage.setItem('admin_quick_notes', JSON.stringify(updated));
      setNewNote('');
    }
  };

  const deleteNote = (id) => {
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    localStorage.setItem('admin_quick_notes', JSON.stringify(updated));
  };

  const colors = ['bg-yellow-100', 'bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-purple-100'];

  return (
    <Card className="bg-gradient-to-br from-yellow-50 to-amber-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StickyNote className="w-5 h-5 text-yellow-600" />
          Quick Notes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Type your note here..."
              className="min-h-20 resize-none"
            />
            <Button onClick={addNote} className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            <AnimatePresence>
              {notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`${colors[index % colors.length]} p-4 rounded-lg shadow-md relative group`}
                >
                  <Button
                    onClick={() => deleteNote(note.id)}
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                  <p className="text-sm text-gray-800 whitespace-pre-wrap pr-8">{note.text}</p>
                  <div className="text-xs text-gray-500 mt-2">{note.timestamp}</div>
                </motion.div>
              ))}
            </AnimatePresence>
            {notes.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No notes yet. Add one above!
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}