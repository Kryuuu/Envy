"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, Save, ArrowLeft, Loader2, Edit2, X, Image as ImageIcon, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  videoSrc?: string;
  youtubeId?: string;
  tiktokId?: string;
  description: string;
  tags: string[];
  link: string;
}

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Edit Mode State
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  // Diagnostic State
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState<{msg: string, status: 'ok' | 'error' | 'warn'}[]>([]);
  const [isRunningDiag, setIsRunningDiag] = useState(false);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Simple pass for local protection
  const AUTH_PASS = "gabut123"; 

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching:", error);
      showToast("Gagal mengambil data projects", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === AUTH_PASS) {
      setIsAuthenticated(true);
    } else {
      showToast("Password salah!", "error");
    }
  };

  const openNewProjectModal = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: "",
      category: "Development",
      image: "",
      description: "",
      tags: [],
      link: "#"
    };
    setEditingProject(newProject);
    setIsNew(true);
    setErrors({});
  };

  const openEditModal = (project: Project) => {
    setEditingProject({ ...project });
    setIsNew(false);
    setErrors({});
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Yakin hapus project ini?")) {
      const newProjects = projects.filter(p => p.id !== id);
      setProjects(newProjects);
      saveToApi(newProjects);
    }
  };

  const saveLocalProject = () => {
    if (!editingProject) return;
    
    // Validation for Tester
    const newErrors: Record<string, string> = {};
    if (!editingProject.title.trim()) newErrors.title = "Judul project wajib diisi!";
    if (!editingProject.description.trim()) newErrors.description = "Deskripsi tidak boleh kosong!";
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        showToast("Ada bagian yang error, silakan periksa form!", "error");
        return;
    }

    let updatedProjects = [...projects];
    if (isNew) {
        updatedProjects = [editingProject, ...projects];
    } else {
        updatedProjects = projects.map(p => p.id === editingProject.id ? editingProject : p);
    }

    setProjects(updatedProjects);
    setEditingProject(null); // Close modal
    saveToApi(updatedProjects); // Auto save to file
  };

  const saveToApi = async (data: Project[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        showToast("Gagal menyimpan ke file JSON!", "error");
      } else {
        showToast("Berhasil menyimpan data!", "success");
      }
    } catch (error) {
      console.error("Save error:", error);
      showToast("Terjadi kesalahan sistem saat menyimpan.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Helper to handle field changes in modal
  const updateEditField = (field: keyof Project, value: any) => {
    if (editingProject) {
        setEditingProject({ ...editingProject, [field]: value });
        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    }
  };

  const updateTags = (value: string) => {
     if (editingProject) {
         setEditingProject({ ...editingProject, tags: value.split(",").map(t => t.trim()) });
     }
  };

  const runDiagnostics = async () => {
    setShowDiagnostic(true);
    setIsRunningDiag(true);
    setDiagnosticLogs([{ msg: "Memulai pengecekan file & API sistem...", status: 'ok' }]);

    setTimeout(async () => {
        let logs: {msg: string, status: 'ok' | 'error' | 'warn'}[] = [];
        
        // 1. API Status
        try {
            const apiRes = await fetch("/api/projects");
            if (apiRes.ok) {
                logs.push({ msg: "Endpoint API (/api/projects) berfungsi normal. File JSON dapat diakses.", status: 'ok' });
            } else {
                logs.push({ msg: `API Error / File Bertabrakan! Status: ${apiRes.status}`, status: 'error' });
            }
        } catch (e) {
            logs.push({ msg: "Gagal terhubung ke API. Backend tidak merespon.", status: 'error' });
        }

        // 2. Data Integrity
        if (projects.length === 0) {
            logs.push({ msg: "Tidak ada data project ditemukan. File JSON kosong atau rusak.", status: 'warn' });
        } else {
            logs.push({ msg: `Membaca data file... Ditemukan ${projects.length} project.`, status: 'ok' });
            
            // Duplicate IDs
            const ids = projects.map(p => p.id);
            const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
            if (duplicates.length > 0) {
                logs.push({ msg: `Ditemukan ID bertabrakan (duplikat) di file JSON: ${duplicates.join(", ")}`, status: 'error' });
            } else {
                logs.push({ msg: "Semua ID project unik. Tidak ada ID yang bertabrakan.", status: 'ok' });
            }

            // Missing critical fields
            let missingFields = 0;
            projects.forEach(p => {
                if (!p.title || !p.category) missingFields++;
            });
            if (missingFields > 0) {
                logs.push({ msg: `Ada ${missingFields} project yang memiliki field kosong (Judul / Kategori).`, status: 'error' });
            } else {
                logs.push({ msg: "Semua project memiliki field Judul dan Kategori.", status: 'ok' });
            }

            // Media Links
            let missingMedia = 0;
            projects.forEach(p => {
                if (!p.image && !p.videoSrc && !p.youtubeId && !p.tiktokId) missingMedia++;
            });
            if (missingMedia > 0) {
                logs.push({ msg: `Peringatan: ${missingMedia} project tidak memiliki gambar/video (Thumbnail kosong).`, status: 'warn' });
            } else {
                logs.push({ msg: "Pengecekan media: Semua project memiliki referensi file media (Gambar/Video).", status: 'ok' });
            }
        }

        setDiagnosticLogs(prev => [...prev, ...logs, { msg: "Diagnostik selesai.", status: 'ok' }]);
        setIsRunningDiag(false);
    }, 1500);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white relative">
        {toast && (
            <div className={`absolute top-6 px-6 py-3 rounded-lg text-white font-bold shadow-lg ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                {toast.message}
            </div>
        )}
        <form onSubmit={handleLogin} className="p-8 border border-white/10 rounded-xl bg-black/50 text-center w-full max-w-sm backdrop-blur-md">
          <h1 className="text-2xl font-bold mb-6">Envy Admin</h1>
          <input 
            type="password" 
            placeholder="Enter Password" 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 mb-4 block w-full focus:border-primary focus:outline-none transition-colors"
          />
          <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/80 transition-all">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg text-white font-bold shadow-lg animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
              <ArrowLeft size={20} />
            </Link>
            <div>
                 <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Manage Projects</h1>
                 <p className="text-gray-500 text-sm mt-1">Total {projects.length} projects in portfolio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={runDiagnostics}
               className="flex items-center gap-2 px-4 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-medium hover:bg-blue-500/20 transition-all text-sm"
             >
               <Activity size={18} /> System Check
             </button>
             <div className="px-4 py-2 bg-yellow-500/10 text-yellow-500 text-xs rounded-full border border-yellow-500/20 hidden md:block">
                {saving ? "Saving changes..." : "All changes auto-saved"}
             </div>
             <button 
              onClick={openNewProjectModal}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary rounded-full font-medium hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 hover:scale-105"
            >
              <Plus size={20} /> Add Project
            </button>
          </div>
        </div>

        {/* Project Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => openEditModal(project)}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
              >
                 {/* Thumbnail Preview */}
                 <div className="aspect-video bg-black/40 relative overflow-hidden flex items-center justify-center">
                    {project.youtubeId ? (
                        <img src={`https://img.youtube.com/vi/${project.youtubeId}/hqdefault.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={project.title} />
                    ) : project.image ? (
                        <img src={project.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={project.title} />
                    ) : (
                        <ImageIcon className="text-white/20" size={40} />
                    )}
                    
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={(e) => handleDelete(project.id!, e)}
                            className="p-2 bg-red-500/80 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                 </div>

                 <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded-full">{project.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title || "Untitled Project"}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{project.description || "No description"}</p>
                 </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT/ADD MODAL */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-4xl bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-2xl font-bold">{isNew ? "Create New Project" : "Edit Project"}</h2>
                    <button onClick={() => setEditingProject(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* LEFT: Content */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Project Title *</label>
                                <input 
                                    className={`w-full bg-black/50 border ${errors.title ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'} rounded-lg p-3 outline-none text-lg font-bold`}
                                    placeholder="Project Name"
                                    value={editingProject.title}
                                    onChange={e => updateEditField("title", e.target.value)}
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                    <select 
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none appearance-none"
                                        value={editingProject.category}
                                        onChange={e => updateEditField("category", e.target.value)}
                                    >
                                        <option value="Development">Development</option>
                                        <option value="Video Editing">Video Editing</option>
                                        <option value="Photography">Photography</option>
                                        <option value="Design">Design</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                                    <input 
                                        className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                        placeholder="PHP, React (comma separated)"
                                        value={editingProject.tags.join(", ")}
                                        onChange={e => updateTags(e.target.value)}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Description *</label>
                                <textarea 
                                    className={`w-full bg-black/50 border ${errors.description ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-primary'} rounded-lg p-3 outline-none min-h-[120px]`}
                                    placeholder="Describe the project..."
                                    value={editingProject.description}
                                    onChange={e => updateEditField("description", e.target.value)}
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>
                        </div>

                        {/* RIGHT: Media */}
                        <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20">
                                <label className="block text-sm font-medium text-green-400 mb-2">YouTube Video</label>
                                <input 
                                    className="w-full bg-black/50 border border-green-500/30 rounded-lg p-3 focus:border-green-500 outline-none mb-2"
                                    placeholder="Paste YouTube ID (e.g. 08Jn9E-UoMQ)"
                                    value={editingProject.youtubeId || ""}
                                    onChange={e => updateEditField("youtubeId", e.target.value)}
                                />
                                {editingProject.youtubeId && (
                                    <div className="relative aspect-video rounded-lg overflow-hidden mt-4 shadow-lg">
                                        <img src={`https://img.youtube.com/vi/${editingProject.youtubeId}/hqdefault.jpg`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20"><p className="text-xs font-bold bg-black/50 px-2 py-1 rounded">Preview</p></div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/20">
                                <label className="block text-sm font-medium text-[#fe2c55] mb-2">TikTok Video</label>
                                <input 
                                    className="w-full bg-black/50 border border-[#fe2c55]/30 rounded-lg p-3 focus:border-[#fe2c55] outline-none"
                                    placeholder="Paste TikTok ID (e.g. 71234567890)"
                                    value={editingProject.tiktokId || ""}
                                    onChange={e => updateEditField("tiktokId", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Or Static Image URL</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    placeholder="/projects/image.png"
                                    value={editingProject.image}
                                    onChange={e => updateEditField("image", e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">External Link</label>
                                <input 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-primary outline-none"
                                    placeholder="https://..."
                                    value={editingProject.link}
                                    onChange={e => updateEditField("link", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                    <button 
                        onClick={() => setEditingProject(null)} 
                        className="px-6 py-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={saveLocalProject} 
                        className="px-8 py-2 bg-primary rounded-lg font-bold hover:bg-primary/80 transition-colors shadow-lg shadow-primary/20"
                    >
                        Save Project
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* DIAGNOSTIC MODAL */}
      {showDiagnostic && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-3xl bg-gray-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex items-center gap-3">
                        <Activity className="text-blue-400" />
                        <h2 className="text-xl font-bold text-white">System Diagnostics (Tester Mode)</h2>
                    </div>
                    <button onClick={() => setShowDiagnostic(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4 font-mono text-sm bg-black custom-scrollbar">
                    <p className="text-gray-500 mb-4">// Menjalankan pengecekan pada file konfigurasi & API...</p>
                    {diagnosticLogs.map((log, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border animate-in slide-in-from-bottom-2 ${
                            log.status === 'ok' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                            log.status === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                            'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                        }`}>
                            <div className="mt-0.5">
                                {log.status === 'ok' && <CheckCircle size={16} />}
                                {log.status === 'error' && <AlertTriangle size={16} />}
                                {log.status === 'warn' && <AlertTriangle size={16} />}
                            </div>
                            <p>{log.msg}</p>
                        </div>
                    ))}
                    {isRunningDiag && (
                        <div className="flex items-center gap-3 text-gray-500 p-3 animate-pulse">
                            <Loader2 className="animate-spin" size={16} /> <span>Memeriksa status integrasi file...</span>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-white/10 bg-white/5 flex justify-end">
                    <button 
                        onClick={runDiagnostics} 
                        disabled={isRunningDiag}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-colors font-bold"
                    >
                        {isRunningDiag ? "Scanning..." : "Re-run Scan"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
