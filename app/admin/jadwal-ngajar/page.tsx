"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, X, ArrowLeft, Loader2, Save, Send } from "lucide-react";
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
    <div className="min-h-screen bg-gray-950 text-white p-6 md:p-12 relative">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-lg text-white font-bold shadow-lg animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/10">
              <ArrowLeft size={20} />
            </Link>
            <div>
                 <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Jadwal Ngajar</h1>
                 <p className="text-gray-500 text-sm mt-1">Kelola jadwal dan laporan akhir mengajar</p>
            </div>
          </div>
          
          <button 
            onClick={openNewModal}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={20} /> Tambah Jadwal
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/50 border-b border-white/10 text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-4 font-medium">Nama Murid</th>
                    <th className="px-6 py-4 font-medium">Mapel & Materi</th>
                    <th className="px-6 py-4 font-medium">Jadwal</th>
                    <th className="px-6 py-4 font-medium">Status Notif</th>
                    <th className="px-6 py-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {jadwalList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        Belum ada jadwal mengajar
                      </td>
                    </tr>
                  ) : (
                    jadwalList.map((j) => (
                      <tr key={j.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-medium">{j.nama_murid}</td>
                        <td className="px-6 py-4">
                          <div className="text-blue-400 font-medium">{j.mata_pelajaran}</div>
                          <div className="text-gray-400 text-sm">{j.materi}</div>
                        </td>
                        <td className="px-6 py-4">
                          {new Date(j.jam).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          {j.notif_sent ? (
                            <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">Terkirim</span>
                          ) : (
                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-full border border-yellow-500/20">Menunggu</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleTestNotif(j)} 
                              title="Test Notifikasi Telegram"
                              className="p-2 text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-500 rounded-lg transition-colors"
                            >
                              <Send size={16} />
                            </button>
                            <button onClick={() => openEditModal(j)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(j.id)} className="p-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors">
                              <Trash2 size={16} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-gray-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h2 className="text-xl font-bold">{editingJadwal ? "Edit Jadwal" : "Tambah Jadwal Baru"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nama Murid *</label>
                <input 
                  value={formData.nama_murid}
                  onChange={e => setFormData({...formData, nama_murid: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                  placeholder="Contoh: Budi"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mata Pelajaran *</label>
                <input 
                  value={formData.mata_pelajaran}
                  onChange={e => setFormData({...formData, mata_pelajaran: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                  placeholder="Contoh: Matematika"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Materi *</label>
                <input 
                  value={formData.materi}
                  onChange={e => setFormData({...formData, materi: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none"
                  placeholder="Topik yang dibahas"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Jam Mengajar *</label>
                <input 
                  type="datetime-local"
                  value={formData.jam}
                  onChange={e => setFormData({...formData, jam: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Laporan Akhir (Opsional)</label>
                <textarea 
                  value={formData.laporan_akhir}
                  onChange={e => setFormData({...formData, laporan_akhir: e.target.value})}
                  className="w-full bg-black/50 border border-white/10 rounded-lg p-3 focus:border-blue-500 outline-none min-h-[100px]"
                  placeholder="Diisi setelah selesai..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-blue-600 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
