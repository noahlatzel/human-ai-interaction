import { useEffect, useState, useCallback } from 'react';
import { discussionApi } from '../api';
import type { Discussion } from '../types';
import { MessageSquare, Plus } from 'lucide-react';
import studentAvatar from '../../../assets/studentAvatarPlaceholder.png';
import studentFemaleAvatar from '../../../assets/female_AvatarPlaceholder.png';
import teacherAvatar from '../../../assets/teacherAvatarPlaceholder.png';

interface DiscussionListProps {
  onSelectDiscussion: (id: number) => void;
  onCreateDiscussion: () => void;
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

export function DiscussionList({ onSelectDiscussion, onCreateDiscussion }: DiscussionListProps) {
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | undefined>(undefined);

  const loadDiscussions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await discussionApi.getDiscussions(category);
      setDiscussions(data);
    } catch (error) {
      console.error('Failed to load discussions:', error);
      setError(error instanceof Error ? error.message : 'Failed to load discussions');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadDiscussions();
  }, [loadDiscussions]);

  // removed duplicate loadDiscussions

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Community Diskussionen</h2>
        <button
          onClick={onCreateDiscussion}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Neue Diskussion
        </button>
      </div>

      <div className="flex space-x-3 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setCategory(undefined)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!category ? 'bg-indigo-100 text-indigo-800' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          Alle
        </button>
        {['general', 'math', 'study-tips', 'technical'].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat ? 'bg-indigo-100 text-indigo-800' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-500">Laden...</div>
      ) : (
        <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 hover:shadow-md transition-shadow">
                <button 
                  onClick={() => onSelectDiscussion(discussion.id)} 
                  className="block w-full text-left focus:outline-none"
                >
                  <div className="px-6 py-5">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-white border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                          <img 
                            src={getAvatar(discussion.author.role, discussion.author.gender)} 
                            alt={`${discussion.author.first_name} ${discussion.author.last_name}`}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getCategoryColor(discussion.category)}`}>
                            {getCategoryLabel(discussion.category)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(discussion.created_at).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                          {discussion.topic}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm text-gray-500">
                              Von {discussion.author.first_name} {discussion.author.last_name}
                            </p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MessageSquare className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{discussion.reply_count} Antworten</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            ))}
            {discussions.length === 0 && (
              <div className="px-4 py-8 text-center text-gray-500">
                No discussions found. Be the first to start one!
              </div>
            )}
        </div>
      )}
    </div>
  );
}
