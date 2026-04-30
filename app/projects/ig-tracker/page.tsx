"use client";
import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, UserMinus, UserPlus, Users, Heart, Search, X, AlertCircle, CheckCircle2, FileText, Shield, ChevronDown, LayoutDashboard, Instagram } from "lucide-react";

type TabKey = "not_following_back" | "fans" | "mutual" | "not_followed_back";

function extractUsernames(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const links = doc.querySelectorAll("a");
  const usernames: string[] = [];
  links.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.includes("instagram.com/")) {
      const match = href.match(/instagram\.com\/([^/?#]+)/);
      if (match?.[1] && !["p","reel","stories","explore","accounts","directory"].includes(match[1])) {
        usernames.push(match[1].toLowerCase());
      }
    }
  });
  return [...new Set(usernames)];
}

const TABS = [
  { key: "not_following_back" as TabKey, label: "Unfollowers", icon: <UserMinus size={18}/>, color: "#f43f5e" },
  { key: "fans" as TabKey, label: "Fans", icon: <Heart size={18}/>, color: "#ec4899" },
  { key: "mutual" as TabKey, label: "Mutual", icon: <Users size={18}/>, color: "#10b981" },
  { key: "not_followed_back" as TabKey, label: "Not Followed", icon: <UserPlus size={18}/>, color: "#f59e0b" },
];

export default function IGTracker() {
  const [followingFile, setFollowingFile] = useState<File|null>(null);
  const [followersFile, setFollowersFile] = useState<File|null>(null);
  const [parsed, setParsed] = useState<{following:string[];followers:string[]}|null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("not_following_back");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const readFile = (file: File): Promise<string> => new Promise((res, rej) => {
    const r = new FileReader(); r.onload = () => res(r.result as string); r.onerror = () => rej(); r.readAsText(file);
  });

  const handleAnalyze = useCallback(async () => {
    if (!followingFile || !followersFile) return;
    setLoading(true); setError(null);
    try {
      const [fH, flH] = await Promise.all([readFile(followingFile), readFile(followersFile)]);
      const following = extractUsernames(fH), followers = extractUsernames(flH);
      if (!following.length && !followers.length) { setError("Tidak ada username ditemukan."); setLoading(false); return; }
      setParsed({ following, followers });
    } catch { setError("Gagal memproses file."); }
    setLoading(false);
  }, [followingFile, followersFile]);

  const results = useMemo(() => {
    if (!parsed) return { not_following_back:[], not_followed_back:[], mutual:[], fans:[] };
    const fgSet = new Set(parsed.following), flSet = new Set(parsed.followers);
    return {
      not_following_back: parsed.following.filter(u => !flSet.has(u)),
      not_followed_back: parsed.followers.filter(u => !fgSet.has(u)),
      mutual: parsed.following.filter(u => flSet.has(u)),
      fans: parsed.followers.filter(u => !fgSet.has(u)),
    };
  }, [parsed]);

  const filtered = useMemo(() => {
    const list = results[activeTab];
    return search.trim() ? list.filter(u => u.includes(search.toLowerCase())) : list;
  }, [results, activeTab, search]);

  const activeColor = TABS.find(t => t.key === activeTab)!.color;

  const UploadBox = ({ label, file, setFile, gradient }: { label:string; file:File|null; setFile:(f:File|null)=>void; gradient:string }) => (
    <div onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f&&f.name.endsWith(".html"))setFile(f);}}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition-all ${file?"border-emerald-500/50 bg-emerald-500/5":"border-white/10 hover:border-pink-500/40 bg-white/[0.02]"}`}>
      <div className={`w-14 h-14 rounded-xl ${gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
        {label==="Following"?<UserPlus size={24} className="text-white"/>:<Users size={24} className="text-white"/>}
      </div>
      <p className="text-white font-semibold mb-1">{label}</p>
      {file ? (
        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm">
          <CheckCircle2 size={14}/><span>{file.name}</span>
          <button onClick={()=>setFile(null)} className="text-white/30 hover:text-rose-400"><X size={12}/></button>
        </div>
      ) : (
        <label className="cursor-pointer inline-block mt-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-sm border border-white/10 transition-all">
          <input type="file" accept=".html,.htm" className="hidden" onChange={e=>{if(e.target.files?.[0])setFile(e.target.files[0]);}}/> Pilih File
        </label>
      )}
    </div>
  );

  /* ===== UPLOAD VIEW ===== */
  if (!parsed) return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-pink-600/15 to-transparent rounded-full blur-3xl"/>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-20 pb-20">
        <Link href="/projects" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-10 transition-colors"><ArrowLeft size={16}/>Back to Projects</Link>
        <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 mb-6">
            <Instagram size={16} className="text-pink-400"/><span className="text-pink-300 text-sm font-medium">Instagram Tool</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Follow <span className="bg-gradient-to-r from-pink-500 to-fuchsia-500 bg-clip-text text-transparent">Tracker</span></h1>
          <p className="text-gray-500 max-w-md mx-auto">Upload file HTML dari Instagram Data Export untuk analisis followers kamu.</p>
        </motion.div>

        <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3">
          <Shield size={18} className="text-emerald-400 shrink-0"/>
          <p className="text-emerald-400/80 text-xs">100% Private — Semua proses di browser, tidak ada data ke server.</p>
        </div>

        <button onClick={()=>setShowGuide(!showGuide)} className="mb-4 w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all text-left">
          <div className="flex items-center gap-2"><FileText size={16} className="text-blue-400"/><span className="text-white/70 text-sm">Cara mendapatkan file HTML</span></div>
          <ChevronDown size={16} className={`text-gray-600 transition-transform ${showGuide?"rotate-180":""}`}/>
        </button>
        <AnimatePresence>{showGuide&&(
          <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden mb-6">
            <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 grid sm:grid-cols-2 gap-3">
              {["Buka Instagram → Settings → Your Activity","Download Your Information → Request Download","Pilih format HTML lalu request","Download & extract file ZIP","Cari folder followers_and_following","Upload following.html & followers_1.html"].map((t,i)=>(
                <div key={i} className="flex gap-2 items-start"><span className="shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center text-white text-[10px] font-bold">{i+1}</span><p className="text-gray-400 text-xs mt-0.5">{t}</p></div>
              ))}
            </div>
          </motion.div>
        )}</AnimatePresence>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadBox label="Following" file={followingFile} setFile={setFollowingFile} gradient="bg-gradient-to-br from-blue-500 to-cyan-500"/>
            <UploadBox label="Followers" file={followersFile} setFile={setFollowersFile} gradient="bg-gradient-to-br from-pink-500 to-fuchsia-500"/>
          </div>
          {error&&<div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2"><AlertCircle size={16} className="text-rose-400"/><p className="text-rose-300 text-sm">{error}</p></div>}
          <button onClick={handleAnalyze} disabled={!followingFile||!followersFile||loading} className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 shadow-lg shadow-pink-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]">
            {loading?"Menganalisis...":"🔍 Analisis Sekarang"}
          </button>
        </motion.div>
      </div>
    </div>
  );

  /* ===== DASHBOARD VIEW ===== */
  return (
    <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none"><div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-pink-600/10 to-transparent rounded-full blur-3xl"/></div>

      {/* Top Navbar */}
      <div className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-fuchsia-600 flex items-center justify-center"><Instagram size={16} className="text-white"/></div>
            <span className="text-white font-bold text-lg hidden sm:block">Follow Tracker</span>
          </div>
          <div className="relative flex-1 max-w-md mx-4">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            <input type="text" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 text-sm"/>
            {search&&<button onClick={()=>setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"><X size={14}/></button>}
          </div>
          <button onClick={()=>{setParsed(null);setFollowingFile(null);setFollowersFile(null);setSearch("");setError(null);}} className="text-gray-500 hover:text-white text-sm transition-colors">↻ Reset</button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-500 text-sm">Analisis data following & followers Instagram kamu</p>
          </div>
          <p className="text-gray-600 text-sm hidden sm:block">{new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {label:"Following",sub:"Following",value:parsed.following.length,color:"#ec4899"},
            {label:"Followers",sub:"Followers",value:parsed.followers.length,color:"#a855f7"},
            {label:"Mutual",sub:"Mutual",value:results.mutual.length,color:"#10b981"},
            {label:"Unfollowers",sub:"Doesn't follow back",value:results.not_following_back.length,color:"#f43f5e"},
          ].map(s=>(
            <div key={s.label} className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 relative overflow-hidden" style={{borderColor:`${s.color}30`}}>
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{background:`linear-gradient(90deg, transparent, ${s.color}, transparent)`}}/>
              <p className="text-sm font-semibold mb-2" style={{color:s.color}}>{s.label}</p>
              <p className="text-3xl sm:text-4xl font-bold text-white mb-1">{s.value.toLocaleString()}</p>
              <p className="text-gray-600 text-xs">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Content: Sidebar + List */}
        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-1">
              {TABS.map(tab=>(
                <button key={tab.key} onClick={()=>{setActiveTab(tab.key);setSearch("");}} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab===tab.key?"bg-gradient-to-r from-pink-500/15 to-fuchsia-500/10 border border-pink-500/20":"hover:bg-white/5 border border-transparent"}`} style={activeTab===tab.key?{color:tab.color}:{color:"#9ca3af"}}>
                  {tab.icon}
                  <span>{tab.label}</span>
                  <span className="ml-auto text-xs opacity-60">{results[tab.key].length}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User List */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{TABS.find(t=>t.key===activeTab)!.label}</h2>
              <span className="text-gray-600 text-sm">{filtered.length} users</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1" style={{scrollbarWidth:"thin",scrollbarColor:"rgba(255,255,255,0.1) transparent"}}>
              {filtered.length===0?(
                <div className="col-span-2 text-center py-20 text-gray-600"><Users size={36} className="mx-auto mb-3 opacity-30"/><p className="text-sm">{search?"Tidak ditemukan":"Kosong"}</p></div>
              ):(
                filtered.map((username,i)=>(
                  <motion.a key={username} href={`https://instagram.com/${username}`} target="_blank" rel="noopener noreferrer" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:Math.min(i*0.02,0.4)}}
                    className="rounded-xl bg-white/[0.03] border border-white/8 hover:border-pink-500/30 p-4 flex items-center gap-3 transition-all group" style={{borderColor:`${activeColor}15`}}>
                    <div className="w-11 h-11 rounded-full shrink-0 overflow-hidden relative" style={{border:`2px solid ${activeColor}40`}}>
                      <img
                        src={`https://unavatar.io/instagram/${username}`}
                        alt={username}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          el.parentElement!.innerHTML = `<span style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,${activeColor}30,${activeColor}10);color:white;font-weight:bold;font-size:14px">${username[0].toUpperCase()}</span>`;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">@{username}</p>
                      <p className="text-gray-600 text-xs">instagram.com/{username}</p>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all group-hover:shadow-lg" style={{background:`${activeColor}20`,color:activeColor,border:`1px solid ${activeColor}30`}}>
                      View Profile
                    </span>
                  </motion.a>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
