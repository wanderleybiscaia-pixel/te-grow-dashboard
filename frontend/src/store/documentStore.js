import { create } from 'zustand';
import api from '../services/api';

const useDocumentStore = create((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,
  error: null,

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  fetchDocuments: async (filters = {}) => {
    set({ loading: true });
    try {
      const response = await api.get('/documents', { params: filters });
      set({ documents: response.data.documents, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchDocument: async (id) => {
    set({ loading: true });
    try {
      const response = await api.get(`/documents/${id}`);
      set({ currentDocument: response.data.document, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateDocument: async (id, updates) => {
    set({ loading: true });
    try {
      const response = await api.put(`/documents/${id}`, updates);
      const { documents } = get();
      const updated = documents.map(doc => 
        doc.id === id ? response.data.document : doc
      );
      set({ documents: updated, currentDocument: response.data.document, error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  deleteDocument: async (id) => {
    set({ loading: true });
    try {
      await api.delete(`/documents/${id}`);
      const { documents } = get();
      set({ documents: documents.filter(doc => doc.id !== id), error: null });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  clearCurrent: () => set({ currentDocument: null })
}));

export default useDocumentStore;
