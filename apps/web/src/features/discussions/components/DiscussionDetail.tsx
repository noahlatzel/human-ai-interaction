import { useEffect, useState } from 'react';
import { discussionApi } from '../api';
import type { DiscussionDetail as IDiscussionDetail } from '../types';
import { ArrowLeft, Send } from 'lucide-react';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';
import studentFemaleAvatar from '../../../assets/female_AvatarPlaceholder.png';
import teacherAvatar from '../../../assets/teacherAvatarPlaceholder.png';

interface DiscussionDetailProps {
  discussionId: number;
  onBack: () => void;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'technical':
      return 'bg-blue-100 text-blue-800';
    case 'general':
      return 'bg-green-100 text-green-800';
    case 'study-tips':
      return 'bg-yellow-100 text-yellow-800';
    case 'math':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryLabel = (category: string) => {
  switch (category) {
    case 'technical':
      return 'Technik';
    case 'general':
      return 'Allgemein';
    case 'study-tips':
      return 'Lerntipps';
    case 'math':
      return 'Mathe';
    default:
      return category;
  }
};

const getAvatar = (role: string, gender?: string) => {
  if (role === 'teacher') return teacherAvatar;
  return gender === 'female' ? studentFemaleAvatar : studentAvatar;
};

export function DiscussionDetail({ discussionId, onBack }: DiscussionDetailProps) {
  const [discussion, setDiscussion] = useState<IDiscussionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (discussionId) {
      loadDiscussion(discussionId);
    }
  }, [discussionId]);

  const loadDiscussion = async (id: number) => {
    try {
      setLoading(true);
      const data = await discussionApi.getDiscussion(id);
      setDiscussion(data);
    } catch (error) {
      console.error('Failed to load discussion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionId || !replyContent.trim()) return;

    try {
      setSubmitting(true);
      await discussionApi.createReply(discussionId, { content: replyContent });
      setReplyContent('');
      // Reload to show new reply
      await loadDiscussion(discussionId);
    } catch (error) {
      console.error('Failed to post reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Laden...</div>;
  if (!discussion) return <div className="text-center py-10 text-gray-500">Diskussion nicht gefunden</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
      >
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </div>
        <span className="text-base font-semibold text-slate-900">Zurück</span>
      </button>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden mb-6 border border-slate-100">
        <div className="px-6 py-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                  <img 
                    src={getAvatar(discussion.author.role, discussion.author.gender)} 
                    alt={`${discussion.author.first_name} ${discussion.author.last_name}`}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {discussion.topic}
                </h3>
                <p className="text-sm text-gray-500">
                  Von {discussion.author.first_name} {discussion.author.last_name} am{' '}
                  {new Date(discussion.created_at).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(discussion.category)}`}>
              {getCategoryLabel(discussion.category)}
            </span>
          </div>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap ml-16">
            {discussion.content}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900">Antworten ({discussion.replies.length})</h4>
        
        <div className="space-y-4">
          {discussion.replies.map((reply) => (
            <div key={reply.id} className="bg-white shadow-sm rounded-2xl p-6 border border-slate-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                    <img 
                      src={getAvatar(reply.author.role, reply.author.gender)} 
                      alt={`${reply.author.first_name} ${reply.author.last_name}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm text-gray-900">
                      {reply.author.first_name} {reply.author.last_name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(reply.created_at).toLocaleString('de-DE')}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm whitespace-pre-wrap">
                    {reply.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleReply} className="mt-6 bg-white shadow-sm rounded-2xl p-6 border border-slate-100">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Antwort verfassen</h4>
          <textarea
            rows={4}
            className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-xl p-3"
            placeholder="Schreibe deine Antwort hier..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
          />
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Senden...' : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Antworten
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
