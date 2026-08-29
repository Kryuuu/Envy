'use client';

import React, { useState } from 'react';
import { Lock, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Photography',
    description: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [coverIndex, setCoverIndex] = useState<number>(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'gabut 123') {
      setIsAuthenticated(true);
    } else {
      setMessage({ type: 'error', text: 'Password salah bang!' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setCoverIndex(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Pilih media dulu ya' });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = new FormData();
      files.forEach(f => {
        data.append('files', f);
      });
      data.append('coverIndex', coverIndex.toString());
      data.append('title', formData.title);
      data.append('category', formData.category);
      data.append('description', formData.description);
      data.append('password', 'gabut 123'); // Simple auth for the API

      const res = await fetch('/api/upload-portfolio', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      setMessage({ type: 'success', text: 'Mantap! Portfolio berhasil diupload.' });
      setFormData({ title: '', category: 'Photography', description: '' });
      setFiles([]);
      setCoverIndex(0);
    } catch (err) {
      setMessage({ type: 'error', text: 'Waduh, gagal upload nih.' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans flex items-center justify-center p-4 selection:bg-white selection:text-black">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-zinc-900/50 p-8 rounded-2xl border border-white/10 backdrop-blur-md"
        >
          <div className="flex justify-center mb-6 text-zinc-500">
            <Lock size={48} strokeWidth={1} />
          </div>
          <h1 className="text-2xl font-light text-center mb-8 uppercase tracking-widest">Admin Access</h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors text-center"
              />
            </div>
            
            {message && message.type === 'error' && (
              <p className="text-red-400 text-sm text-center">{message.text}</p>
            )}

            <button
              type="submit"
              className="w-full bg-white text-black py-4 rounded-lg font-medium tracking-wide uppercase text-sm hover:bg-zinc-200 transition-colors"
            >
              Enter
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans p-8 md:p-16 selection:bg-white selection:text-black">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-light tracking-widest uppercase">Upload to Portfolio</h1>
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 px-3 py-1 border border-white/10 rounded-full">
            Admin Mode
          </div>
        </div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleSubmit} 
          className="space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-white/5"
        >
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors"
              placeholder="e.g. Minimalist Architecture"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors"
            >
              <option value="Photography">Photography</option>
              <option value="Videography">Videography</option>
              <option value="Drone">Drone</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Description</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:outline-none focus:border-white/30 transition-colors min-h-[120px]"
              placeholder="Brief description of the project..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs uppercase tracking-widest text-zinc-400">Media Files (Image/Video)</label>
            <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center hover:border-white/30 transition-colors relative cursor-pointer group">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-4 pointer-events-none">
                <Upload size={32} className="text-zinc-500 group-hover:text-white transition-colors" strokeWidth={1} />
                <span className="text-sm text-zinc-400">
                  {files.length > 0 ? `${files.length} files selected` : 'Click or drag media here (bisa pilih banyak)'}
                </span>
              </div>
            </div>

            {files.length > 0 && (
              <div className="space-y-3 mt-4">
                <label className="text-[10px] uppercase tracking-widest text-zinc-500 block">Pilih Sampul (Cover):</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {files.map((f, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => setCoverIndex(idx)}
                      className={`relative p-3 rounded-lg border-2 cursor-pointer transition-all ${coverIndex === idx ? 'border-white bg-white/10' : 'border-white/10 bg-black/50 hover:border-white/30'}`}
                    >
                      <div className="text-xs truncate max-w-full mb-1" title={f.name}>{f.name}</div>
                      <div className="text-[10px] text-zinc-500">{f.type.startsWith('video') ? 'Video' : 'Image'}</div>
                      {coverIndex === idx && (
                        <div className="absolute -top-2 -right-2 bg-white text-black rounded-full p-1 z-20">
                          <CheckCircle2 size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
              >
                {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black py-4 rounded-lg font-medium tracking-wide uppercase text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Uploading...' : 'Upload Project'}
          </button>
        </motion.form>
      </div>
    </div>
  );
}
