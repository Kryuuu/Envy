"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, ArrowLeft, Loader2, Save, Send, BookOpen, Clock, User, FileText, Calendar, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function JadwalNgajarPage() {
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJadwal, setEditingJadwal] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    nama_murid: "",
    mata_pelajaran: "",
    materi: "",
    jam: "",
    laporan_akhir: ""
  });
  
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('jadwal_ngajar')
      .select('*')
      .order('jam', { ascending: true });
      
    if (error) {
      console.error(error);
      // Fallback if table doesn't exist yet
      if (error.code === '42P01') {
        showToast("Tabel jadwal_ngajar belum dibuat di Supabase!", "error");
      }
    } else {
      setJadwalList(data || []);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingJadwal(null);
    setFormData({
      nama_murid: "",
      mata_pelajaran: "",
      materi: "",
      jam: "",
      laporan_akhir: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (jadwal: any) => {
    setEditingJadwal(jadwal);
    
    // Format timestamp for datetime-local input
    let formattedJam = "";
    if (jadwal.jam) {
      const d = new Date(jadwal.jam);
      const tzOffset = d.getTimezoneOffset() * 60000;
      formattedJam = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
    }

    setFormData({
      nama_murid: jadwal.nama_murid,
      mata_pelajaran: jadwal.mata_pelajaran,
      materi: jadwal.materi,
      jam: formattedJam,
      laporan_akhir: jadwal.laporan_akhir || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus jadwal ini?")) return;
    
    const { error } = await supabase
      .from('jadwal_ngajar')
      .delete()
      .eq('id', id);
      
    if (error) {
      showToast("Gagal menghapus data", "error");
    } else {
      showToast("Berhasil dihapus", "success");
      fetchJadwal();
    }
  };

  const handleTestNotif = async (jadwal: any) => {
    setToast({ message: "Mengirim test notif...", type: "success" });
    try {
      const res = await fetch('/api/test-notif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jadwal)
      });
      const data = await res.json();
      if (data.success) {
        showToast("Test notif berhasil dikirim!", "success");
      } else {
        showToast("Gagal: " + data.error, "error");
      }
    } catch (err) {
      showToast("Terjadi kesalahan jaringan", "error");
    }
  };

  const handleSave = async () => {
    if (!formData.nama_murid || !formData.mata_pelajaran || !formData.jam) {
      showToast("Nama, mapel, dan jam wajib diisi", "error");
      return;
    }

    setSaving(true);
    
    const dataToSave = {
      nama_murid: formData.nama_murid,
      mata_pelajaran: formData.mata_pelajaran,
      materi: formData.materi,
      jam: new Date(formData.jam).toISOString(),
      laporan_akhir: formData.laporan_akhir,
      user_id: 1 // Default user id
    };

    if (editingJadwal) {
      const { error } = await supabase
        .from('jadwal_ngajar')
        .update(dataToSave)
        .eq('id', editingJadwal.id);
        
      if (error) showToast("Gagal update data", "error");
      else {
        showToast("Berhasil diupdate", "success");
        setIsModalOpen(false);
        fetchJadwal();
      }
    } else {
      const { error } = await supabase
        .from('jadwal_ngajar')
        .insert([dataToSave]);
        
      if (error) showToast("Gagal menambah data", "error");
      else {
        showToast("Berhasil ditambahkan", "success");
        setIsModalOpen(false);
        fetchJadwal();
      }
    }
    
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-slate-200 p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl text-white font-medium shadow-2xl animate-in slide-in-from-right flex items-center gap-3 backdrop-blur-md border ${toast.type === 'error' ? 'bg-red-500/90 border-red-400' : 'bg-emerald-500/90 border-emerald-400'}`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="flex items-center gap-5">
            <Link href="/admin" className="p-3 bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-md rounded-2xl transition-all border border-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 group">
              <ArrowLeft size={22} className="text-slate-300 group-hover:text-white transition-colors" />
            </Link>
            <div>
                 <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 drop-shadow-sm">Jadwal Ngajar</h1>
                 <p className="text-slate-400 text-sm mt-2 font-medium">Kelola jadwal, notifikasi Telegram, dan laporan akhir secara efisien.</p>
            </div>
          </div>
          
          <button 
            onClick={openNewModal}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 border border-blue-400/20 text-white"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Tambah Jadwal
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/30 animate-pulse"></div>
              <Loader2 className="animate-spin text-blue-400 relative z-10" size={48} />
            </div>
            <p className="text-slate-400 font-medium animate-pulse">Memuat data jadwal...</p>
          </div>
        ) : (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-950/50 border-b border-slate-800 text-slate-400 text-sm font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5">Nama Murid</th>
                    <th className="px-8 py-5">Mapel & Materi</th>
                    <th className="px-8 py-5">Waktu</th>
                    <th className="px-8 py-5">Status Notif</th>
                    <th className="px-8 py-5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {jadwalList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-16 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-16 w-16 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-500 mb-2">
                            <Calendar size={32} />
                          </div>
                          <p className="text-slate-300 font-medium text-lg">Belum ada jadwal mengajar</p>
                          <p className="text-slate-500 text-sm max-w-xs">Klik tombol "Tambah Jadwal" di atas untuk membuat jadwal baru.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    jadwalList.map((j) => (
                      <tr key={j.id} className="hover:bg-slate-800/30 transition-all duration-200 group">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                              <User size={18} />
                            </div>
                            <span className="font-bold text-slate-200 text-base">{j.nama_murid}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2 mb-1.5">
                            <BookOpen size={16} className="text-purple-400" />
                            <span className="text-purple-300 font-bold">{j.mata_pelajaran}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <FileText size={14} />
                            <span className="truncate max-w-[200px]">{j.materi || '-'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex items-center gap-2 text-slate-200 font-medium">
                              <Calendar size={15} className="text-emerald-400" />
                              <span>{new Date(j.jam).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <Clock size={15} className="text-emerald-500/70" />
                              <span>{new Date(j.jam).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          {j.notif_sent ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                              <CheckCircle2 size={14} /> Terkirim
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                              <Bell size={14} /> Menunggu
                            </span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                            <button 
                              onClick={() => handleTestNotif(j)} 
                              title="Test Notifikasi Telegram"
                              className="p-2.5 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:-translate-y-0.5"
                            >
                              <Send size={18} />
                            </button>
                            <button 
                              onClick={() => openEditModal(j)} 
                              className="p-2.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700 hover:border-slate-600 hover:-translate-y-0.5"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(j.id)} 
                              className="p-2.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:-translate-y-0.5"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500"></div>
              <h2 className="text-2xl font-bold text-white">{editingJadwal ? "Edit Jadwal Mengajar" : "Buat Jadwal Baru"}</h2>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 space-y-6 overflow-y-auto max-h-[65vh] custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <User size={16} className="text-blue-400" /> Nama Murid *
                </label>
                <input 
                  value={formData.nama_murid}
                  onChange={e => setFormData({...formData, nama_murid: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Contoh: Budi Susanto"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-400" /> Mata Pelajaran *
                  </label>
                  <input 
                    value={formData.mata_pelajaran}
                    onChange={e => setFormData({...formData, mata_pelajaran: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                    placeholder="Contoh: Matematika"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                    <Clock size={16} className="text-emerald-400" /> Waktu Mengajar *
                  </label>
                  <input 
                    type="datetime-local"
                    value={formData.jam}
                    onChange={e => setFormData({...formData, jam: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all [color-scheme:dark]"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Topik / Materi *
                </label>
                <input 
                  value={formData.materi}
                  onChange={e => setFormData({...formData, materi: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  placeholder="Detail materi yang akan dibahas"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-300">Laporan Akhir (Opsional)</label>
                <textarea 
                  value={formData.laporan_akhir}
                  onChange={e => setFormData({...formData, laporan_akhir: e.target.value})}
                  className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all min-h-[120px] resize-y"
                  placeholder="Bisa diisi setelah sesi mengajar selesai..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-bold text-white hover:from-blue-500 hover:to-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {saving ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
