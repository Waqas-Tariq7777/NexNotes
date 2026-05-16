import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const useNoteStore = create((set, get) => ({
    notes: [],
    loading: false,

    fetchNotes: async () => {
        set({ loading: true });
        try {
            const res = await axios.get(`${baseUrl}/api/v1/notes`, { withCredentials: true });
            if (res.status === 200) {
                set({ notes: res.data.data, loading: false });
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Failed to fetch notes";
            toast.error(message);
        }
    },

    createNote: async (formData) => {
        set({ loading: true });
        try {
            const res = await axios.post(`${baseUrl}/api/v1/notes`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.status === 201) {
                const newNote = res.data.data;
                set((state) => ({ 
                    notes: [newNote, ...state.notes], 
                    loading: false 
                }));
                toast.success("Note added successfully");
                return true;
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Failed to create note";
            toast.error(message);
            return false;
        }
    },

    updateNote: async (noteId, data) => {
        set({ loading: true });
        try {
            const isFormData = data instanceof FormData;
            const res = await axios.patch(`${baseUrl}/api/v1/notes/${noteId}`, data, {
                withCredentials: true,
                headers: { 
                    "Content-Type": isFormData ? "multipart/form-data" : "application/json" 
                }
            });
            if (res.status === 200) {
                const updatedNote = res.data.data;
                set((state) => ({ 
                    notes: state.notes.map(n => n._id === noteId ? updatedNote : n), 
                    loading: false 
                }));
                toast.success("Note updated successfully");
                return true;
            }
        } catch (error) {
            set({ loading: false });
            const message = error.response?.data?.message || "Failed to update note";
            toast.error(message);
            return false;
        }
    },

    deleteNote: async (noteId) => {
        set({ loading: true });
        try {
            const res = await axios.delete(`${baseUrl}/api/v1/notes/${noteId}`, { withCredentials: true });
            if (res.status === 200) {
                set((state) => ({
                    notes: state.notes.filter(n => n._id !== noteId),
                    loading: false
                }));
                toast.success("Note deleted");
                return true;
            }
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to delete note");
            return false;
        }
    }
}));
