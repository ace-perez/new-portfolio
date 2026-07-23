import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchPosts,
  fetchPost,
  fetchAllPosts,
  createPost,
  updatePost,
  deletePost,
} from '@/lib/api';

// ── Public ────────────────────────────────────────────────────────────────────

export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog-posts'],
    queryFn: fetchPosts,
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useBlogPost(slug) {
  return useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => fetchPost(slug),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
}

// ── Admin ─────────────────────────────────────────────────────────────────────

export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin-posts'],
    queryFn: fetchAllPosts,
    staleTime: 0, // always fresh in the admin panel
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }) => updatePost(slug, data),
    onSuccess: (_, { slug }) => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['blog-post', slug] });
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['blog-posts'] });
      qc.invalidateQueries({ queryKey: ['admin-posts'] });
    },
  });
}
