'use client';

import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Edit, Trash2, Search, Calendar, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminNewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', category: 'Updates' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', excerpt: '', content: '', category: 'Updates' });
        fetchNews();
      } else {
        alert('Failed to publish news.');
      }
    } catch (error) {
      console.error('Error publishing news:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1A] text-white p-4 md:p-6 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              Content Management <Megaphone className="h-8 w-8 text-[#7C3AED]" />
            </h1>
            <p className="text-gray-400 mt-1">Publish news and announcements to the student portal.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:scale-105 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all"
            >
              <Plus className="h-4 w-4" /> Publish New Update
            </button>
          </div>
        </div>

        {/* List */}
        <div className="bg-[#111827]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 relative overflow-hidden min-h-[500px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-[#4F46E5]" />
            </div>
          ) : (
            <div className="space-y-4">
              {news.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <Megaphone className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No news published yet.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {news.map((item, index) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-black/40 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all flex justify-between items-center group"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] bg-[#4F46E5]/20 text-[#4F46E5] px-2 py-1 rounded font-bold uppercase">{item.category}</span>
                          <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar className="h-3 w-3" /> {item.date}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-400">{item.excerpt}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20"><Edit className="h-4 w-4" /></button>
                        <button className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111827] border border-white/10 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative"
          >
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Publish Announcement</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]"
                  placeholder="e.g. Phase 1 Counselling Begins Tomorrow"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option>Updates</option>
                    <option>Admissions</option>
                    <option>Counselling</option>
                    <option>Important</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Short Excerpt</label>
                <input 
                  required
                  type="text" 
                  value={formData.excerpt}
                  onChange={e => setFormData({...formData, excerpt: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5]"
                  placeholder="A one sentence summary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Full Content</label>
                <textarea 
                  required
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#4F46E5] min-h-[150px]"
                  placeholder="Write the full details here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
