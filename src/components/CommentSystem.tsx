'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { MessageCircle, Edit, Trash2, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRatingsAndComments } from '@/hooks/useRatingsAndComments';
import Image from 'next/image';

interface CommentSystemProps {
  productId: string;
}

interface Comment {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  content: string;
  isEdited: boolean;
  editedAt?: string;
  likes: string[];
  dislikes: string[];
  createdAt: string;
}

export const CommentSystem: React.FC<CommentSystemProps> = ({ productId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalComments: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [canComment, setCanComment] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);

  const {
    error,
    loading,
    clearError,
    getProductComments,
    createComment,
    updateComment,
    deleteComment,
    toggleCommentLike,
    toggleCommentDislike,
    checkCanComment,
  } = useRatingsAndComments();

  const checkCommentPermission = useCallback(async () => {
    if (session?.user) {
      const result = await checkCanComment(productId);
      setCanComment(result.canComment);
      setUserRating(result.userRating);
    }
  }, [session?.user, productId, checkCanComment]);

  const loadComments = useCallback(async (page: number = 1) => {
    const result = await getProductComments(productId, page, 10, sortBy, sortOrder);
    if (result) {
      setComments(result.comments);
      setPagination(result.pagination);
    }
  }, [productId, sortBy, sortOrder, getProductComments]);

  useEffect(() => {
    checkCommentPermission();
    loadComments();
  }, [productId, checkCommentPermission, loadComments]);

  const handleCreateComment = async () => {
    if (!newComment.trim()) return;

    const result = await createComment(productId, newComment.trim());
    if (result) {
      setNewComment('');
      await loadComments(1);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    const result = await updateComment(commentId, editContent.trim());
    if (result) {
      setEditingComment(null);
      setEditContent('');
      await loadComments(pagination.currentPage);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const success = await deleteComment(commentId);
      if (success) {
        await loadComments(pagination.currentPage);
      }
    }
  };

  const handleToggleLike = async (commentId: string) => {
    const result = await toggleCommentLike(commentId);
    if (result) {
      await loadComments(pagination.currentPage);
    }
  };

  const handleToggleDislike = async (commentId: string) => {
    const result = await toggleCommentDislike(commentId);
    if (result) {
      await loadComments(pagination.currentPage);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment) => (
    <div key={comment._id} className="border-b border-gray-200 pb-4 mb-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {comment.user.image ? (
            <Image
              src={comment.user.image}
              alt={comment.user.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">{comment.user.name}</span>
            <span className="text-sm text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>
          
          {editingComment === comment._id ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Edit your comment..."
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleUpdateComment(comment._id)}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="px-3 py-1 text-gray-600 text-sm hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mt-1">{comment.content}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-3">
            {/* Like Button */}
            <button
              onClick={() => handleToggleLike(comment._id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.likes.includes((session?.user as { id: string })?.id || '')
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${
                comment.likes.includes((session?.user as { id: string })?.id || '') ? 'fill-current' : ''
              }`} />
              <span>{comment.likes.length || 0}</span>
            </button>
            
            {/* Dislike Button */}
            <button
              onClick={() => handleToggleDislike(comment._id)}
              className={`flex items-center space-x-1 text-sm transition-colors ${
                comment.dislikes.includes((session?.user as { id: string })?.id || '')
                  ? 'text-red-600'
                  : 'text-gray-500 hover:text-red-600'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${
                comment.dislikes.includes((session?.user as { id: string })?.id || '') ? 'fill-current' : ''
              }`} />
              <span>{comment.dislikes.length || 0}</span>
            </button>
            
            {/* Edit/Delete buttons for comment owner */}
            {session?.user && comment.user._id === (session.user as { id: string }).id && (
              <>
                <button
                  onClick={() => {
                    setEditingComment(comment._id);
                    setEditContent(comment.content);
                  }}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 text-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-700 text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Comment Form */}
      {session?.user && (
        <div className="border rounded-lg p-4">
          {canComment ? (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Write a comment</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md resize-none"
                rows={3}
                placeholder="Share your thoughts about this product..."
                maxLength={1000}
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">
                  {newComment.length}/1000 characters
                </span>
                <button
                  onClick={handleCreateComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Post Comment
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">
                {userRating 
                  ? 'You need to rate this product before commenting'
                  : 'You need to rate this product before commenting'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Comments List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Comments ({pagination.totalComments})
          </h3>
          
          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="createdAt">Date</option>
              <option value="likes">Likes</option>
            </select>
            
            <button
              onClick={() => {
                const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
                setSortOrder(newOrder);
                loadComments(1);
              }}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm hover:bg-gray-50"
            >
              {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
            </button>
          </div>
        </div>

        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map(comment => renderComment(comment))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-6">
            <button
              onClick={() => loadComments(pagination.currentPage - 1)}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => loadComments(pagination.currentPage + 1)}
              disabled={!pagination.hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  );
};
