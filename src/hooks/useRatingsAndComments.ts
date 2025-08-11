import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface RatingData {
  averageRating: number;
  totalRatings: number;
  ratingDistribution: Record<number, number>;
}

interface CommentData {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

interface Comment {
  _id: string;
  content: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  product: {
    _id: string;
    productId: string;
    name: string;
    images?: string[];
  };
  isEdited: boolean;
  editedAt?: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

interface UserRatingCommentData {
  canComment: boolean;
  userRating: number | null;
}

export const useRatingsAndComments = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rate a product
  const rateProduct = useCallback(async (productId: string, rating: number) => {
    if (!session?.user) {
      setError('You must be logged in to rate products');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, rating }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rate product');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rate product';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get product ratings
  const getProductRatings = useCallback(async (productId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ratings?productId=${productId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch ratings');
      }

      return data.data as RatingData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch ratings';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a rating
  const deleteRating = useCallback(async (productId: string) => {
    if (!session?.user) {
      setError('You must be logged in to delete ratings');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/ratings?productId=${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete rating');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete rating';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get product comments
  const getProductComments = useCallback(async (
    productId: string,
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        productId,
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/comments?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch comments');
      }

      return data.data as CommentData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch comments';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a comment
  const createComment = useCallback(async (
    productId: string,
    content: string
  ) => {
    if (!session?.user) {
      setError('You must be logged in to comment');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create comment');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create comment';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update a comment
  const updateComment = useCallback(async (commentId: string, content: string) => {
    if (!session?.user) {
      setError('You must be logged in to update comments');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update comment');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update comment';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Delete a comment
  const deleteComment = useCallback(async (commentId: string) => {
    if (!session?.user) {
      setError('You must be logged in to delete comments');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/comments?commentId=${commentId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete comment');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete comment';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Toggle like on a comment
  const toggleCommentLike = useCallback(async (commentId: string) => {
    if (!session?.user) {
      setError('You must be logged in to like comments');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comments/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle like';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Toggle dislike on a comment
  const toggleCommentDislike = useCallback(async (commentId: string) => {
    if (!session?.user) {
      setError('You must be logged in to dislike comments');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/comments/dislike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to toggle dislike');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle dislike';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Check if user can comment on a product
  const checkCanComment = useCallback(async (productId: string) => {
    if (!session?.user) {
      return { canComment: false, userRating: null };
    }

    try {
      const response = await fetch(`/api/user/can-comment?productId=${productId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check comment permission');
      }

      return data.data as UserRatingCommentData;
    } catch (err) {
      console.error('Error checking comment permission:', err);
      return { canComment: false, userRating: null };
    }
  }, [session]);

  // Get user's rating history
  const getUserRatings = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!session?.user) {
      setError('You must be logged in to view your ratings');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/user/ratings?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user ratings');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user ratings';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Get user's comment history
  const getUserComments = useCallback(async (page: number = 1, limit: number = 10) => {
    if (!session?.user) {
      setError('You must be logged in to view your comments');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/user/comments?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch user comments');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user comments';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    clearError,
    rateProduct,
    getProductRatings,
    deleteRating,
    getProductComments,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    toggleCommentDislike,
    checkCanComment,
    getUserRatings,
    getUserComments,
  };
};
