import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Image as ImageIcon, 
  List as ListIcon, 
  Lightbulb, 
  Bell, 
  Archive, 
  Trash2, 
  Tag, 
  MoreVertical,
  Grid,
  Menu as MenuIcon,
  X,
  CheckSquare,
  Square,
  Edit3,
  Calendar,
  Palette,
  Maximize2,
  Clock,
  Layout,
  Pin,
  PinOff,
  BellRing,
  AlertCircle,
  RotateCcw,
  ArchiveRestore,
  Hash,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Notebook
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { useNoteStore } from '../store/noteStore';
import axios from 'axios';

// Helper for local datetime-local value
const toLocalISOString = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const offset = date.getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
  return localISOTime;
};

// Helper to check if a reminder is due within 1 hour
const isUrgentReminder = (reminderDate) => {
  if (!reminderDate) return false;
  const now = new Date();
  const reminder = new Date(reminderDate);
  const diffInMs = reminder.getTime() - now.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours > 0 && diffInHours <= 1;
};

// Custom Toolbar Component
const CustomToolbar = ({ id }) => (
  <div id={id} className="flex flex-wrap items-center gap-2 pb-4 mb-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="ql-formats !mr-0">
      <select className="ql-header text-primary font-bold bg-white/5 rounded-lg px-2" defaultValue="" title="Text Heading">
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="">Body</option>
      </select>
    </div>
    
    <span className="ql-formats !mr-0 flex gap-1 bg-white/5 p-1 rounded-xl">
      <button className="ql-bold cursor-pointer hover:text-primary transition-colors" title="Bold (Ctrl+B)" />
      <button className="ql-italic cursor-pointer hover:text-primary transition-colors" title="Italic (Ctrl+I)" />
      <button className="ql-underline cursor-pointer hover:text-primary transition-colors" title="Underline (Ctrl+U)" />
    </span>

    <span className="ql-formats !mr-0 flex gap-1 bg-white/5 p-1 rounded-xl">
      <button className="ql-list cursor-pointer hover:text-secondary transition-colors" value="ordered" title="Numbered List" />
      <button className="ql-list cursor-pointer hover:text-secondary transition-colors" value="bullet" title="Bullet List" />
    </span>

    <div className="flex-1" />

    <span className="ql-formats !mr-0 flex gap-1 bg-white/5 p-1 rounded-xl">
      <button className="ql-image cursor-pointer hover:text-accent transition-colors" title="Insert Image" />
      <button className="ql-clean cursor-pointer hover:text-red-400 transition-colors" title="Clear Formatting" />
    </span>
  </div>
);

const LabelPopover = ({ selectedLabels, onToggle, isOpen, onClose, allLabels }) => {
  const [newLabel, setNewLabel] = useState('');

  if (!isOpen) return null;

  const handleAddLabel = (e) => {
    e.preventDefault();
    if (newLabel.trim()) {
      onToggle(newLabel.trim());
      setNewLabel('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-4 z-[60] glass-card p-6 rounded-3xl min-w-[250px] shadow-2xl ring-2 ring-primary/20 bg-background/95 backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="text-primary" size={18} />
          <span className="text-sm font-black uppercase tracking-widest text-primary/80">Labels</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"><X size={16} /></button>
      </div>

      <form onSubmit={handleAddLabel} className="mb-4 relative group flex items-center gap-2">
        <div className="relative flex-1">
          <input 
            type="text" 
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Enter label name..."
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-xs text-theme-primary outline-none focus:border-primary/50 transition-all"
          />
          <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted group-focus-within:text-primary transition-colors" size={14} />
        </div>
        <AnimatePresence>
          {newLabel.trim() && (
            <motion.button 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              type="submit"
              className="p-3 bg-gradient-to-r from-primary to-secondary text-black rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              <Check size={14} className="font-black" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>

      {selectedLabels.length > 0 && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash size={14} className="text-primary" />
            <span className="text-xs font-black text-theme-primary uppercase tracking-tighter">Active: {selectedLabels[0]}</span>
          </div>
          <button 
            onClick={() => onToggle(selectedLabels[0])}
            className="text-[10px] font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest cursor-pointer px-2 py-1 hover:bg-red-400/10 rounded-lg"
          >
            Clear
          </button>
        </div>
      )}

      <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1 pr-1">
        {allLabels.length === 0 && !newLabel && (
          <p className="text-[10px] text-theme-muted text-center py-4">No labels yet</p>
        )}
        {allLabels.map((label) => (
          <button 
            key={label}
            onClick={() => onToggle(label)}
            className={`w-full flex items-center justify-between gap-3 p-3 rounded-xl transition-all group cursor-pointer text-left ${selectedLabels.includes(label) ? 'bg-primary/20 ring-1 ring-primary/30' : 'hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-2">
              <Hash size={14} className={selectedLabels.includes(label) ? 'text-primary' : 'text-theme-muted'} />
              <span className={`text-xs font-medium ${selectedLabels.includes(label) ? 'text-primary font-black' : 'text-theme-muted group-hover:text-theme-primary'}`}>{label}</span>
            </div>
            {selectedLabels.includes(label) && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check size={12} className="text-black font-black" />
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

const ReminderPicker = ({ reminder, setReminder, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="absolute bottom-full left-0 mb-4 z-[60] glass-card p-6 rounded-3xl min-w-[300px] shadow-2xl ring-2 ring-primary/20 bg-background/95 backdrop-blur-3xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="text-primary" size={18} />
          <span className="text-sm font-black uppercase tracking-widest text-primary/80">Set Reminder</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"><X size={16} /></button>
      </div>
      
      <div className="space-y-4">
        <input 
          type="datetime-local" 
          value={toLocalISOString(reminder)}
          onChange={(e) => setReminder(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-theme-primary outline-none focus:border-primary/50 transition-all cursor-pointer"
        />
        <div className="flex gap-2">
          <button 
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              tomorrow.setHours(8, 0, 0, 0);
              setReminder(tomorrow.toISOString());
            }}
            className="flex-1 text-[10px] font-bold p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer uppercase tracking-tighter"
          >
            Tomorrow 8AM
          </button>
          <button 
            onClick={() => {
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              nextWeek.setHours(8, 0, 0, 0);
              setReminder(nextWeek.toISOString());
            }}
            className="flex-1 text-[10px] font-bold p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all cursor-pointer uppercase tracking-tighter"
          >
            Next Week
          </button>
        </div>
        <div className="flex justify-between items-center pt-2">
          <button 
            onClick={() => { setReminder(null); onClose(); }}
            className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Clear Reminder
          </button>
          <button 
            onClick={onClose}
            className="btn-primary py-2 px-6 rounded-xl text-xs cursor-pointer"
          >
            Set
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ChecklistEditor = ({ checklists, setChecklists, isReadOnly = false }) => {
  const addItem = () => {
    if (isReadOnly) return;
    setChecklists([...checklists, { text: '', isCompleted: false }]);
  };

  const updateItem = (index, field, value) => {
    if (isReadOnly) return;
    const newList = [...checklists];
    newList[index][field] = value;
    setChecklists(newList);
  };

  const removeItem = (index) => {
    if (isReadOnly) return;
    setChecklists(checklists.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    if (isReadOnly) return;
    updateItem(index, 'isCompleted', !checklists[index].isCompleted);
  };

  return (
    <div className="space-y-2 mb-4">
      <AnimatePresence>
        {checklists.map((item, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex items-center gap-3 group/item py-1"
          >
            <button 
              onClick={() => toggleComplete(index)}
              disabled={isReadOnly}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${item.isCompleted ? 'text-primary bg-primary/20 shadow-[0_0_15px_rgba(0,242,255,0.3)]' : 'text-theme-muted hover:text-primary hover:bg-primary/5'}`}
            >
              {item.isCompleted ? <CheckSquare size={18} /> : <Square size={18} />}
            </button>
            {isReadOnly ? (
              <span className={`flex-1 text-theme-primary transition-all break-words text-base ${item.isCompleted ? 'line-through opacity-40' : ''}`}>
                {item.text || "Empty item"}
              </span>
            ) : (
              <input 
                value={item.text}
                onChange={(e) => updateItem(index, 'text', e.target.value)}
                placeholder="List item..."
                className={`flex-1 bg-transparent border-none outline-none text-theme-primary placeholder:text-theme-muted transition-all break-words text-base ${item.isCompleted ? 'line-through opacity-40' : ''}`}
              />
            )}
            {!isReadOnly && (
              <button 
                onClick={() => removeItem(index)}
                className="p-1.5 text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity cursor-pointer hover:bg-red-400/10 rounded-lg"
              >
                <X size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
      {!isReadOnly && (
        <button 
          onClick={addItem}
          className="flex items-center gap-2 text-primary font-bold text-xs hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all mt-1 cursor-pointer group/add"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center group-hover/add:rotate-90 transition-transform">
            <Plus size={14} />
          </div>
          <span>Add list item</span>
        </button>
      )}
    </div>
  );
};

const NoteModal = ({ note, isOpen, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState(note?.images || []);
  const [removedImages, setRemovedImages] = useState([]);
  const [checklists, setChecklists] = useState(note?.checklists || []);
  const [isPinned, setIsPinned] = useState(note?.isPinned || false);
  const [reminder, setReminder] = useState(note?.reminder || null);
  const [labels, setLabels] = useState(note?.labels || []);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const { updateNote, loading, notes } = useNoteStore();

  const allLabels = useMemo(() => {
    const set = new Set();
    notes.forEach(n => n.labels?.forEach(l => set.add(l)));
    return Array.from(set);
  }, [notes]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setPreviews(note.images || []);
      setChecklists(note.checklists || []);
      setIsPinned(note.isPinned || false);
      setReminder(note.reminder || null);
      setLabels(note.labels || []);
      setIsEditing(false);
    }
  }, [note, isOpen]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('title', title.trim() || 'Untitled');
    formData.append('content', content);
    formData.append('removedImages', JSON.stringify(removedImages));
    formData.append('checklists', JSON.stringify(checklists));
    formData.append('isPinned', isPinned);
    formData.append('reminder', reminder || '');
    formData.append('labels', JSON.stringify(labels));
    images.forEach(img => formData.append('images', img));

    const success = await updateNote(note._id, formData);
    if (success) setIsEditing(false);
  };

  const handleTogglePin = async () => {
    const newPinStatus = !isPinned;
    setIsPinned(newPinStatus);
    if (!isEditing) {
      await updateNote(note._id, { isPinned: newPinStatus });
    }
  };

  const handleReminderChange = async (date) => {
    setReminder(date);
    if (!isEditing) {
      await updateNote(note._id, { reminder: date || "" });
    }
  };

  const handleToggleLabel = async (label) => {
    const newLabels = labels.includes(label) ? [] : [label];
    setLabels(newLabels);
    if (!isEditing) {
      await updateNote(note._id, { labels: newLabels });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (img, index) => {
    if (note.images.includes(img)) {
      setRemovedImages([...removedImages, img]);
    }
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/notes/upload-image`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const url = res.data.data.url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: isEditing ? '#modal-toolbar' : null,
      handlers: { image: imageHandler }
    }
  }), [isEditing]);

  const formatReminder = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  const urgent = isUrgentReminder(reminder);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl cursor-pointer"
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-xl p-[2px] rounded-[2.5rem] bg-gradient-to-br from-primary via-secondary to-accent shadow-[0_0_50px_rgba(112,0,255,0.3)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full glass-card rounded-[2.45rem] p-8 flex flex-col max-h-[85vh] bg-background/95 backdrop-blur-3xl">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center ring-1 ring-primary/30">
                <Layout size={20} className="text-primary" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">NexNote Editor</span>
                {reminder && (
                  <div className={`flex items-center gap-1.5 text-[10px] font-bold animate-pulse ${urgent ? 'text-red-500' : 'text-primary'}`}>
                    {urgent ? <AlertCircle size={12} /> : <BellRing size={12} />}
                    <span>{formatReminder(reminder)} {urgent && "(DUE SOON)"}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleTogglePin}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${isPinned ? 'text-primary bg-primary/10 ring-1 ring-primary/30' : 'text-theme-muted hover:text-primary hover:bg-primary/5'}`}
                title={isPinned ? "Unpin Note" : "Pin Note"}
              >
                <Pin size={20} className={isPinned ? 'fill-primary' : ''} />
              </button>
              <button 
                onClick={onClose}
                className="p-2.5 text-theme-muted hover:text-white hover:bg-red-500/80 rounded-xl transition-all cursor-pointer shadow-lg active:scale-90"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-5">
            {/* Images Section */}
            {previews.length > 0 && (
              <div className="flex flex-wrap gap-3 pb-2">
                {previews.map((img, index) => (
                  <div key={index} className="relative group rounded-2xl overflow-hidden shadow-xl ring-2 ring-white/10">
                    <img src={img} alt="Preview" className="w-28 h-28 object-cover transition-transform group-hover:scale-110 duration-500" />
                    {isEditing && (
                      <button 
                        onClick={() => removeImage(img, index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-2xl scale-75 group-hover:scale-100"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Labels Pills */}
            {labels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {labels.map(l => (
                  <span key={l} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-theme-muted group/label">
                    <Hash size={10} className="text-primary" />
                    {l}
                    {isEditing && (
                      <button onClick={() => handleToggleLabel(l)} className="hover:text-red-400 cursor-pointer transition-colors"><X size={10} /></button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Title Section */}
            <div className="relative group">
              {isEditing ? (
                <div className="relative">
                  <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note Title..."
                    className="w-full bg-transparent border-none outline-none text-3xl font-black text-theme-primary tracking-tight placeholder:text-theme-muted/50 pb-2 border-b border-white/5 focus:border-primary/30 transition-colors"
                  />
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-primary to-secondary group-focus-within:w-full transition-all duration-700" />
                </div>
              ) : (
                <h2 className="text-3xl font-black text-theme-primary tracking-tight leading-tight break-words bg-clip-text text-transparent bg-gradient-to-r from-theme-primary to-theme-primary/60">{title || 'Untitled'}</h2>
              )}
            </div>

            {/* Content Section */}
            <div className="relative">
              {isEditing ? (
                <div className="space-y-4">
                  <CustomToolbar id="modal-toolbar" />
                  <div className="p-1 rounded-2xl bg-white/5 focus-within:bg-white/10 transition-all">
                    <ReactQuill 
                      ref={quillRef}
                      theme="snow"
                      value={content}
                      onChange={setContent}
                      modules={modules}
                      placeholder="Write your amazing thoughts here..."
                    />
                  </div>
                </div>
              ) : (
                <div 
                  className="text-theme-secondary text-lg leading-relaxed break-words quill-preview prose prose-invert dark:prose-invert max-w-none opacity-90"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              )}
            </div>

            {/* Checklist Section */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                <span className="text-[10px] font-bold text-theme-muted uppercase tracking-widest px-2">Checklist</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-white/10 to-transparent" />
              </div>
              <ChecklistEditor checklists={checklists} setChecklists={setChecklists} isReadOnly={!isEditing} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-white/10 relative">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl ring-1 ring-white/10">
                {isEditing && (
                  <>
                    <button 
                      onClick={() => fileInputRef.current.click()}
                      className="p-2.5 text-theme-muted hover:text-primary transition-all rounded-xl hover:bg-primary/10 cursor-pointer"
                      title="Add Images"
                    >
                      <ImageIcon size={20} />
                    </button>
                    <button 
                      onClick={() => setChecklists([...checklists, { text: '', isCompleted: false }])}
                      className="p-2.5 text-theme-muted hover:text-secondary transition-all rounded-xl hover:bg-secondary/10 cursor-pointer"
                      title="Add Checklist"
                    >
                      <CheckSquare size={20} />
                    </button>
                  </>
                )}
                <div className="relative">
                  <button 
                    onClick={() => setShowLabelPicker(!showLabelPicker)}
                    className={`p-2.5 transition-all rounded-xl cursor-pointer ${labels.length > 0 ? 'text-primary bg-primary/10' : 'text-theme-muted hover:text-primary hover:bg-primary/10'}`}
                    title="Edit Labels"
                  >
                    <Tag size={20} />
                  </button>
                  <LabelPopover 
                    selectedLabels={labels} 
                    onToggle={handleToggleLabel} 
                    isOpen={showLabelPicker} 
                    onClose={() => setShowLabelPicker(false)} 
                    allLabels={allLabels}
                  />
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowReminderPicker(!showReminderPicker)}
                    className={`p-2.5 transition-all rounded-xl cursor-pointer ${reminder ? 'text-primary bg-primary/10' : 'text-theme-muted hover:text-primary hover:bg-primary/10'}`}
                    title="Set Reminder"
                  >
                    <Bell size={20} />
                  </button>
                  <ReminderPicker 
                    reminder={reminder} 
                    setReminder={handleReminderChange} 
                    isOpen={showReminderPicker} 
                    onClose={() => setShowReminderPicker(false)} 
                  />
                </div>
              </div>
              <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 font-bold text-theme-muted hover:text-red-400 transition-colors cursor-pointer text-sm"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={handleUpdate}
                    disabled={loading}
                    className="relative group overflow-hidden px-8 py-2.5 rounded-xl font-bold text-sm text-black cursor-pointer transition-all active:scale-95"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
                    <span className="relative z-10">{loading ? "Syncing..." : "Update Note"}</span>
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-8 py-2.5 bg-white/10 hover:bg-white/20 text-theme-primary rounded-xl font-bold text-sm transition-all border border-white/10 cursor-pointer active:scale-95 shadow-xl hover:shadow-primary/10"
                >
                  <Edit3 size={18} className="text-primary" />
                  <span>Customize Note</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const NoteCard = ({ note, onClick }) => {
  const { updateNote, deleteNote } = useNoteStore();

  const handleTogglePin = async (e) => {
    e.stopPropagation();
    await updateNote(note._id, { isPinned: !note.isPinned });
  };

  const handleArchiveToggle = async (e) => {
    e.stopPropagation();
    await updateNote(note._id, { isArchived: !note.isArchived });
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (note.isTrash) {
      await deleteNote(note._id);
    } else {
      await updateNote(note._id, { isTrash: true, isPinned: false });
    }
  };

  const handleRestore = async (e) => {
    e.stopPropagation();
    await updateNote(note._id, { isTrash: false });
  };

  const formatReminder = (date) => {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(new Date(date));
  };

  const urgent = isUrgentReminder(note.reminder);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={() => onClick(note)}
      className={`group relative flex flex-col h-[300px] p-6 rounded-[2.5rem] cursor-pointer transition-all duration-700 overflow-hidden border border-white/10 bg-white/5 backdrop-blur-[40px] hover:bg-white/10 hover:border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-primary/20 ${urgent ? 'ring-2 ring-red-500/50' : ''}`}
    >
      {/* Dynamic Background Glow from Mockup */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[60px] opacity-10 transition-opacity duration-1000 group-hover:opacity-30 bg-gradient-to-br ${urgent ? 'from-red-500 to-orange-500' : 'from-primary to-secondary'}`} />

      <div className="relative z-10 flex flex-col h-full">
        {/* Header: Title and Pin */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-black text-theme-primary leading-tight line-clamp-2 tracking-tight group-hover:text-primary transition-colors">
              {note.title || "Untitled Note"}
            </h3>
            {note.reminder && (
              <div className={`flex items-center gap-1.5 mt-1.5 text-[9px] font-black uppercase tracking-widest ${urgent ? 'text-red-400 animate-pulse' : 'text-primary/60'}`}>
                {urgent ? <AlertCircle size={10} /> : <Clock size={10} />}
                {formatReminder(note.reminder)}
              </div>
            )}
          </div>
          
          {!note.isTrash && (
            <button 
              onClick={handleTogglePin}
              className={`p-2 rounded-xl transition-all z-20 cursor-pointer ${note.isPinned ? 'text-primary bg-primary/20 ring-1 ring-primary/30' : 'text-theme-muted hover:text-primary hover:bg-white/5'}`}
            >
              <Pin size={16} className={note.isPinned ? 'fill-primary' : ''} />
            </button>
          )}
        </div>

        {/* Content Preview */}
        <div className="flex-1 overflow-hidden">
          {note.images && note.images.length > 0 ? (
            <div className="relative rounded-2xl overflow-hidden h-24 mb-3 border border-white/10 ring-1 ring-white/5">
              <img src={note.images[0]} alt="Note Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ) : null}

          <div className="space-y-2">
            {note.content && note.content !== '<p><br></p>' && (
              <div 
                className="text-sm text-theme-secondary/70 line-clamp-3 leading-relaxed ql-editor !p-0"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            )}

            {note.checklists && note.checklists.length > 0 && (
              <div className="space-y-1.5">
                {note.checklists.slice(0, 2).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-md border transition-colors ${item.isCompleted ? 'bg-primary/50 border-primary' : 'border-white/20'}`} />
                    <span className={`text-[11px] ${item.isCompleted ? 'text-theme-muted line-through' : 'text-theme-secondary/80'} truncate`}>{item.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-white/5">
          <div className="flex items-center gap-2">
            {note.labels && note.labels.length > 0 ? (
              <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full text-[8px] font-black text-primary uppercase tracking-widest shadow-sm">
                #{note.labels[0]}
              </span>
            ) : (
              <div className={`w-1.5 h-1.5 rounded-full ${!note.isTrash && !note.isArchived ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-white/10'}`} />
            )}
            <span className="text-[9px] font-bold text-theme-muted uppercase tracking-[0.2em] opacity-40">
              {note.isTrash ? "Trash" : note.isArchived ? "Archived" : "Saved"}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
            {note.isTrash ? (
              <>
                <button onClick={handleRestore} className="p-2 text-theme-muted hover:text-primary transition-colors cursor-pointer" title="Restore"><RotateCcw size={14} /></button>
                <button onClick={handleDelete} className="p-2 text-theme-muted hover:text-red-400 transition-colors cursor-pointer" title="Delete Permanently"><Trash2 size={14} /></button>
              </>
            ) : (
              <>
                <button onClick={handleArchiveToggle} className={`p-2 transition-colors cursor-pointer ${note.isArchived ? 'text-primary' : 'text-theme-muted hover:text-primary'}`} title={note.isArchived ? "Unarchive" : "Archive"}>
                  {note.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
                </button>
                <button onClick={handleDelete} className="p-2 text-theme-muted hover:text-red-400 transition-colors cursor-pointer" title="Send to Trash"><Trash2 size={14} /></button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Notes = () => {
  const [activeTab, setActiveTab] = useState('notes');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [labels, setLabels] = useState([]);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [selectedLabelFilter, setSelectedLabelFilter] = useState('');
  const [isLabelMenuOpen, setIsLabelMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(12);
  const fileInputRef = useRef(null);
  const quillRef = useRef(null);
  const dropdownRef = useRef(null);

  const { notes, fetchNotes, createNote, loading } = useNoteStore();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const allLabels = useMemo(() => {
    const set = new Set();
    notes.forEach(n => n.labels?.forEach(l => set.add(l)));
    return Array.from(set).sort();
  }, [notes]);

  useEffect(() => {
    if (activeTab === 'labels' && allLabels.length > 0 && !selectedLabelFilter) {
      setSelectedLabelFilter(allLabels[0]);
    }
  }, [activeTab, allLabels]);

  // Responsive Sidebar Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setVisibleCount(12);
  }, [activeTab, searchQuery]);

  const urgentCount = useMemo(() => notes.filter(n => isUrgentReminder(n.reminder) && !n.isTrash).length, [notes]);

  const sidebarItems = useMemo(() => [
    { id: 'notes', icon: <Lightbulb size={22} />, label: 'Notes' },
    { 
      id: 'reminders', 
      icon: <Bell size={22} />, 
      label: 'Reminders',
      pill: urgentCount > 0 ? urgentCount : null 
    },
    { id: 'labels', icon: <Tag size={22} />, label: 'Labels' },
    { id: 'archive', icon: <Archive size={22} />, label: 'Archive' },
    { id: 'trash', icon: <Trash2 size={22} />, label: 'Trash' },
  ], [urgentCount]);

  const filteredNotes = useMemo(() => {
    let result = [];
    if (activeTab === 'reminders') {
      result = notes.filter(n => n.reminder && !n.isTrash);
      result.sort((a, b) => {
        const aUrgent = isUrgentReminder(a.reminder);
        const bUrgent = isUrgentReminder(b.reminder);
        if (aUrgent && !bUrgent) return -1;
        if (!aUrgent && bUrgent) return 1;
        return new Date(a.reminder) - new Date(b.reminder);
      });
    }
    else if (activeTab === 'archive') result = notes.filter(n => n.isArchived && !n.isTrash);
    else if (activeTab === 'trash') result = notes.filter(n => n.isTrash);
    else if (activeTab === 'labels') {
      if (!selectedLabelFilter) return [];
      result = notes.filter(n => n.labels?.includes(selectedLabelFilter) && !n.isTrash);
    }
    else result = notes.filter(n => !n.isTrash);

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(n => 
        n.title?.toLowerCase().includes(query) || 
        n.content?.toLowerCase().includes(query) ||
        n.labels?.some(l => l.toLowerCase().includes(query)) ||
        n.checklists?.some(c => c.text.toLowerCase().includes(query))
      );
    }

    return result;
  }, [notes, activeTab, selectedLabelFilter, searchQuery]);

  const pinnedNotes = useMemo(() => filteredNotes.filter(n => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter(n => !n.isPinned), [filteredNotes]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImages([...images, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const handleToggleLabel = (label) => {
    setLabels(prev => prev.includes(label) ? [] : [label]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const resetForm = () => {
    setNoteTitle('');
    setNoteContent('');
    setImages([]);
    setImagePreviews([]);
    setChecklists([]);
    setLabels([]);
    setShowReminderPicker(false);
    setShowLabelPicker(false);
    setIsExpanded(false);
  };

  const handleAddNote = async () => {
    if (!noteTitle.trim() && (!noteContent.trim() || noteContent === '<p><br></p>') && images.length === 0 && checklists.length === 0 && labels.length === 0) {
      resetForm();
      return;
    }

    const formData = new FormData();
    formData.append('title', noteTitle.trim() || 'Untitled');
    formData.append('content', noteContent);
    formData.append('checklists', JSON.stringify(checklists));
    formData.append('labels', JSON.stringify(labels));
    if (reminder) formData.append('reminder', reminder);
    images.forEach((image) => {
      formData.append('images', image);
    });

    const success = await createNote(formData);
    if (success) {
      resetForm();
    }
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/notes/upload-image`, formData, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const url = res.data.data.url;
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
      } catch (error) {
        console.error('Image upload failed:', error);
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: '#toolbar',
      handlers: { image: imageHandler }
    }
  }), []);

  return (
    <div className="min-h-screen flex bg-background pt-20 overflow-x-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && typeof window !== 'undefined' && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[65] md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: (typeof window !== 'undefined' && window.innerWidth < 768) ? 280 : (isSidebarOpen ? 280 : 80),
          x: (typeof window !== 'undefined' && window.innerWidth < 768 && !isSidebarOpen) ? -280 : 0
        }}
        className={`fixed left-0 top-0 bottom-0 z-[70] bg-white/[0.03] backdrop-blur-[80px] border-r border-white/10 flex flex-col transition-all duration-500 shadow-[20px_0_50px_rgba(0,0,0,0.3)]`}
      >
        {/* Sidebar Logo Section */}
        <div className="h-20 flex items-center px-6 shrink-0">
          <div className="flex items-center gap-3 group cursor-pointer overflow-hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300 shadow-primary/20 shrink-0">
              <Notebook className="text-white w-6 h-6" />
            </div>
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xl font-bold tracking-tight text-white whitespace-nowrap"
                >
                  Nex<span className="text-primary">Notes</span>
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className={`p-4 border-b border-white/5 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && <span className="text-xs font-black uppercase tracking-widest text-theme-muted ml-2">Navigation</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-white/5 rounded-xl transition-all cursor-pointer text-theme-muted hover:text-primary md:flex"
          >
            {(typeof window !== 'undefined' && window.innerWidth < 768) ? <X size={18} /> : (isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />)}
          </button>
        </div>
        <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center transition-all duration-300 relative group cursor-pointer ${
                !isSidebarOpen ? 'justify-center p-4' : 'gap-4 p-4'
              } rounded-2xl ${
                activeTab === item.id 
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(0,242,255,0.15)]' 
                : 'text-theme-muted hover:text-theme-primary hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex-shrink-0 group-hover:scale-110 transition-transform relative">
                {item.icon}
                {item.pill && !isSidebarOpen && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-background" />
                )}
              </div>
              {isSidebarOpen && (
                <div className="flex-1 flex items-center justify-between overflow-hidden">
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="font-medium truncate">{item.label}</motion.span>
                  {item.pill && (
                    <motion.span 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                    >
                      {item.pill}
                    </motion.span>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-auto pb-8 space-y-4">
          <div className="h-[1px] bg-white/5 mx-4 mb-4" />
        </div>
      </motion.aside>

      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-[80px]'} p-4 md:p-8 lg:p-12 min-w-0`}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-12">
            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden self-start p-4 bg-white/5 rounded-2xl text-primary border border-white/10 shadow-xl active:scale-90 transition-transform mb-2"
            >
              <MenuIcon size={24} />
            </button>

            {/* Search Bar */}
            <div className="relative flex-1 group w-full">
              <div className="absolute inset-0 bg-primary/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
              <div className="relative flex items-center gap-4 rgb-border p-4 rounded-[1.5rem] shadow-xl transition-all">
                <Search className="text-primary ml-1" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..." 
                  className="bg-transparent border-none outline-none text-theme-primary w-full text-base placeholder:text-theme-muted" 
                />
              </div>
            </div>

            {/* Composer */}
            {activeTab === 'notes' && (
              <motion.div 
                layout
                initial={false}
                className={`composer-card rgb-border transition-all duration-500 relative z-40 overflow-hidden ${isExpanded ? 'w-full p-10 rounded-[2.5rem]' : 'w-full md:w-auto md:min-w-[300px] p-2 rounded-[1.5rem]'}`}
              >
                {!isExpanded ? (
                  <div 
                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-[1.2rem] transition-colors"
                    onClick={() => setIsExpanded(true)}
                  >
                    <span className="text-theme-muted text-sm font-medium tracking-tight whitespace-nowrap">Take a note...</span>
                    <div className="flex items-center gap-3 text-theme-muted ml-4">
                      <button 
                        className="hover:text-primary transition-colors p-1.5 cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(true); setChecklists([{ text: '', isCompleted: false }]); }}
                      >
                        <CheckSquare size={18} />
                      </button>
                     
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-composer">
                    <div className="flex flex-wrap gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-xl">
                          <img src={preview} alt="Preview" className="w-24 h-24 object-cover" />
                          <button 
                            onClick={() => removeImage(index)} 
                            className="absolute top-1 right-1 bg-red-500/80 p-1 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {labels.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {labels.map(l => (
                          <span key={l} className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-theme-muted group/label">
                            <Hash size={10} className="text-primary" />
                            {l}
                            <button onClick={() => handleToggleLabel(l)} className="hover:text-red-400 cursor-pointer transition-colors"><X size={10} /></button>
                          </span>
                        ))}
                      </div>
                    )}

                    <input 
                      autoFocus
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full bg-transparent border-none outline-none text-3xl font-bold text-theme-primary tracking-tight placeholder:text-theme-muted mb-2"
                    />

                    <div className="flex flex-col gap-2">
                      <CustomToolbar id="toolbar" />
                      <ReactQuill 
                        ref={quillRef} 
                        theme="snow" 
                        value={noteContent} 
                        onChange={setNoteContent} 
                        modules={modules} 
                        placeholder="Write something brilliant..." 
                      />
                      <ChecklistEditor checklists={checklists} setChecklists={setChecklists} />
                    </div>

                    <div className="flex items-center justify-between pt-8 mt-4 border-t border-white/5 relative">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => fileInputRef.current.click()} 
                          className="p-3 text-theme-muted hover:text-primary transition-all rounded-xl hover:bg-white/5 cursor-pointer"
                          title="Add Image"
                        >
                          <ImageIcon size={20} />
                        </button>
                        <button 
                          onClick={() => setChecklists([...checklists, { text: '', isCompleted: false }])} 
                          className="p-3 text-theme-muted hover:text-primary transition-all rounded-xl hover:bg-white/5 cursor-pointer"
                          title="Add Checklist"
                        >
                          <CheckSquare size={20} />
                        </button>
                        <div className="relative">
                          <button 
                            onClick={() => setShowLabelPicker(!showLabelPicker)}
                            className={`p-3 transition-all rounded-xl cursor-pointer ${labels.length > 0 ? 'text-primary bg-primary/10' : 'text-theme-muted hover:text-primary hover:bg-white/5'}`}
                            title="Add Labels"
                          >
                            <Tag size={20} />
                          </button>
                          <LabelPopover 
                            selectedLabels={labels} 
                            onToggle={handleToggleLabel} 
                            isOpen={showLabelPicker} 
                            onClose={() => setShowLabelPicker(false)} 
                            allLabels={allLabels}
                          />
                        </div>
                        <div className="relative">
                          <button 
                            onClick={() => setShowReminderPicker(!showReminderPicker)}
                            className={`p-3 transition-all rounded-xl cursor-pointer ${reminder ? 'text-primary bg-primary/10' : 'text-theme-muted hover:text-primary hover:bg-white/5'}`}
                            title="Add reminder"
                          >
                            <Bell size={20} />
                          </button>
                          <ReminderPicker 
                            reminder={reminder} 
                            setReminder={setReminder} 
                            isOpen={showReminderPicker} 
                            onClose={() => setShowReminderPicker(false)} 
                          />
                        </div>
                        <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                      </div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={resetForm} 
                          className="px-6 py-2.5 font-bold text-theme-muted hover:text-theme-primary transition-colors text-sm cursor-pointer"
                        >
                          Discard
                        </button>
                        <button 
                          onClick={handleAddNote} 
                          disabled={loading} 
                          className="btn-primary py-2.5 px-8 rounded-xl shadow-[0_0_20px_rgba(0,242,255,0.2)] text-sm cursor-pointer"
                        >
                          {loading ? "Saving..." : "Save Note"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Labels Dropdown Header */}
          {activeTab === 'labels' && (
            <div className="mb-12 flex flex-col items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center ring-1 ring-primary/30">
                  <Tag size={24} className="text-primary" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-theme-primary">Labels Explorer</h1>
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsLabelMenuOpen(!isLabelMenuOpen)}
                  className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-[1.5rem] transition-all cursor-pointer min-w-[280px] justify-between shadow-2xl group"
                >
                  <div className="flex items-center gap-3">
                    <Hash size={18} className="text-primary" />
                    <span className="font-black text-theme-primary uppercase tracking-widest text-sm">
                      {selectedLabelFilter || 'Select a Label'}
                    </span>
                  </div>
                  <ChevronDown size={20} className={`text-theme-muted transition-transform duration-500 ${isLabelMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isLabelMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full mt-4 left-0 w-full z-50 glass-card rounded-[2rem] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2"
                    >
                      {allLabels.length === 0 ? (
                        <div className="p-8 text-center text-theme-muted italic">No labels created yet</div>
                      ) : (
                        <div className="space-y-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                          {allLabels.map(l => (
                            <button 
                              key={l}
                              onClick={() => { setSelectedLabelFilter(l); setIsLabelMenuOpen(false); }}
                              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all cursor-pointer text-left ${selectedLabelFilter === l ? 'bg-primary text-black font-black' : 'text-theme-muted hover:bg-white/5 hover:text-theme-primary'}`}
                            >
                              <Hash size={16} />
                              <span className="text-sm font-bold">{l}</span>
                              {selectedLabelFilter === l && <Check size={16} className="ml-auto" />}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Notes Grid Sections */}
          <div className="space-y-12">
            {pinnedNotes.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 px-4 py-1 rounded-full bg-primary/5 ring-1 ring-primary/20">Pinned Notes</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pinnedNotes.map((note) => (
                    <NoteCard key={note._id} note={note} onClick={setSelectedNote} />
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {pinnedNotes.length > 0 && otherNotes.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-theme-muted px-4 py-1 rounded-full bg-white/5">Others</span>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherNotes.slice(0, visibleCount).map((note) => (
                  <NoteCard key={note._id} note={note} onClick={setSelectedNote} />
                ))}
              </div>
              
              {otherNotes.length > visibleCount && (
                <div className="flex justify-center pt-10">
                  <button 
                    onClick={() => setVisibleCount(prev => prev + 12)}
                    className="group relative px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-primary/10 transition-colors" />
                    <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary to-secondary transform translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative z-10 text-theme-muted group-hover:text-primary flex items-center gap-2">
                      Show More Notes
                      <Plus size={14} className="group-hover:rotate-90 transition-transform" />
                    </span>
                  </button>
                </div>
              )}

              {filteredNotes.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-white/10">
                    {activeTab === 'notes' && <Lightbulb className="text-theme-muted" size={40} />}
                    {activeTab === 'reminders' && <Bell className="text-theme-muted" size={40} />}
                    {activeTab === 'archive' && <Archive className="text-theme-muted" size={40} />}
                    {activeTab === 'trash' && <Trash2 className="text-theme-muted" size={40} />}
                    {activeTab === 'labels' && <Tag className="text-theme-muted" size={40} />}
                  </div>
                  <p className="text-theme-muted font-medium">
                    {searchQuery.trim() ? "No notes matching your search." :
                     activeTab === 'notes' ? "Notes you add appear here." :
                     activeTab === 'reminders' ? "Notes with upcoming reminders appear here." :
                     activeTab === 'archive' ? "Your archived notes appear here." :
                     activeTab === 'trash' ? "No notes in Trash." :
                     activeTab === 'labels' ? "No notes matching this label." : 
                     "No notes found."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedNote && (
          <NoteModal 
            note={selectedNote} 
            isOpen={!!selectedNote} 
            onClose={() => setSelectedNote(null)} 
          />
        )}
      </AnimatePresence>

      {isExpanded && <div className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-all duration-500 cursor-pointer" onClick={resetForm} />}
    </div>
  );
};

export default Notes;
