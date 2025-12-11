import { useState } from 'react';
import { discussionApi } from '../api';
import { ArrowLeft } from 'lucide-react';
import { ApiError } from '../../../lib/apiClient';

interface CreateDiscussionFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function CreateDiscussionForm({ onBack, onSuccess }: CreateDiscussionFormProps) {
  const [formData, setFormData] = useState({
    topic: '',
    content: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.topic.length < 3) {
      setError('Titel muss mindestens 3 Zeichen lang sein');
      return;
    }
    if (formData.content.length < 10) {
      setError('Inhalt muss mindestens 10 Zeichen lang sein');
      return;
    }

    try {
      setSubmitting(true);
      await discussionApi.createDiscussion(formData);
      onSuccess();
    } catch (err) {
      console.error('Failed to create discussion:', err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Fehler beim Erstellen der Diskussion. Bitte versuche es erneut.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Zurück zur Übersicht
      </button>

      <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100">
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-bold text-gray-900">
            Neue Diskussion starten
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Fehler
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
              Titel
            </label>
            <input
              type="text"
              id="topic"
              required
              minLength={3}
              maxLength={200}
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-xl p-3"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">Mindestens 3 Zeichen</p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Kategorie
            </label>
            <select
              id="category"
              className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-xl"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="general">Allgemein</option>
              <option value="math">Mathe</option>
              <option value="study-tips">Lerntipps</option>
              <option value="technical">Technik</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Inhalt
            </label>
            <textarea
              id="content"
              rows={6}
              required
              minLength={10}
              className="mt-1 block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-xl p-3"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <p className="mt-1 text-xs text-gray-500">Mindestens 10 Zeichen</p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onBack}
              className="bg-white py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Erstelle...' : 'Diskussion erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
