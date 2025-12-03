import { create } from 'zustand';
import api from '../lib/api';

const useJobStore = create((set) => ({
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,

  fetchJobs: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await api.get(`/jobs?${params}`);
      set({ jobs: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch jobs', loading: false });
    }
  },

  fetchJobById: async (id) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.get(`/jobs/${id}`);
      set({ currentJob: data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch job', loading: false });
    }
  },

  createJob: async (jobData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/jobs', jobData);
      set((state) => ({ jobs: [data, ...state.jobs], loading: false }));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create job';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  updateJob: async (id, jobData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.put(`/jobs/${id}`, jobData);
      set((state) => ({
        jobs: state.jobs.map((job) => (job._id === id ? data : job)),
        currentJob: data,
        loading: false,
      }));
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update job';
      set({ error: message, loading: false });
      throw new Error(message);
    }
  },

  deleteJob: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/jobs/${id}`);
      set((state) => ({
        jobs: state.jobs.filter((job) => job._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete job', loading: false });
    }
  },
}));

export default useJobStore;
