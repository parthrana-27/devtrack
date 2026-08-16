import React, { useState, useEffect } from 'react';
import { X, Send, Clock, User, AlertCircle, CheckCircle2, RotateCw } from 'lucide-react';
import type { IssueResponse, IssueStatus, IssuePriority } from '../services/issue.service';
import { issueService } from '../services/issue.service';
import { commentService } from '../services/comment.service';
import type { CommentResponse } from '../services/comment.service';

interface IssueModalProps {
  issue: IssueResponse;
  onClose: () => void;
  onUpdate: () => void;
}

const statusColors: Record<IssueStatus, string> = {
  TODO: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  IN_PROGRESS: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  IN_REVIEW: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  TESTING: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  DONE: 'text-brand-400 bg-brand-400/10 border-brand-400/20',
  CLOSED: 'text-green-400 bg-green-400/10 border-green-400/20',
};

const priorityColors: Record<IssuePriority, string> = {
  LOW: 'text-gray-400',
  MEDIUM: 'text-yellow-400',
  HIGH: 'text-orange-400',
  CRITICAL: 'text-red-400',
};

export default function IssueModal({ issue, onClose, onUpdate }: IssueModalProps) {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [issue.id]);

  const fetchComments = async () => {
    try {
      const data = await commentService.getIssueComments(issue.id);
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments', error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await commentService.addComment(issue.id, newComment);
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Failed to add comment', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await issueService.updateIssueStatus(issue.id, e.target.value as IssueStatus);
      onUpdate();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col glass-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${statusColors[issue.status]}`}>
              {issue.status.replace('_', ' ')}
            </div>
            <span className="text-gray-400 font-mono text-sm">DEV-{issue.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
          
          {/* Main Column */}
          <div className="flex-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">{issue.title}</h2>
              
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {issue.description || <span className="text-gray-500 italic">No description provided.</span>}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <h3 className="text-lg font-semibold text-white">Comments</h3>
              
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No comments yet. Be the first to start the discussion!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">{comment.authorName?.charAt(0).toUpperCase() || 'U'}</span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-baseline justify-between">
                          <span className="font-medium text-gray-200 text-sm">{comment.authorName || 'Unknown User'}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="w-full md:w-64 space-y-6 shrink-0">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
              <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Details</h4>
              
              <div className="space-y-3 text-sm">
                <div>
                  <label className="text-gray-500 block mb-1">Status</label>
                  <select 
                    value={issue.status}
                    onChange={handleStatusChange}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="TESTING">Testing</option>
                    <option value="DONE">Done</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Priority</label>
                  <div className={`flex items-center gap-2 ${priorityColors[issue.priority]}`}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-medium">{issue.priority}</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Type</label>
                  <div className="flex items-center gap-2 text-gray-300">
                    {issue.type === 'BUG' ? <AlertCircle className="w-4 h-4 text-red-400" /> : 
                     issue.type === 'TASK' ? <CheckCircle2 className="w-4 h-4 text-blue-400" /> :
                     issue.type === 'STORY' ? <CheckCircle2 className="w-4 h-4 text-green-400" /> :
                     <RotateCw className="w-4 h-4 text-brand-400" />}
                    <span className="font-medium">{issue.type}</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Assignee</label>
                  <div className="flex items-center gap-2 text-gray-300">
                    <User className="w-4 h-4" />
                    <span>{issue.assigneeId ? `User #${issue.assigneeId}` : 'Unassigned'}</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-500 block mb-1">Created</label>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(issue.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Comment Input) */}
        <div className="p-4 border-t border-white/10 bg-black/20 mt-auto">
          <form onSubmit={handleAddComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isSubmitting || !newComment.trim()}
              className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:hover:bg-brand-500 text-white rounded-xl font-medium flex items-center justify-center transition-colors shadow-lg shadow-brand-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
