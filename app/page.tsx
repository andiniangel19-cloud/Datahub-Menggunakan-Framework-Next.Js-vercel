"use client";
import { useState, useRef } from "react";

export default function CombinedDataHub() {
  // ========================================================
  // STATE MANAGEMENT (TERMASUK STATE AUTH BARU)
  // ========================================================
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<{ type: "data" | "code"; title: string; content: any } | null>(null);
  const [githubLink, setGithubLink] = useState("");

  // State Baru untuk Fitur Sign In & Register
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<"signin" | "register" | null>(null);
  
  // State Input Form Auth
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");

  // Referensi tombol upload
  const datasetInputRef = useRef<HTMLInputElement>(null);
  const datasetFolderInputRef = useRef<HTMLInputElement>(null);

  // Data awal untuk list Dataset
  const [datasets, setDatasets] = useState([
    { 
      id: 1, 
      title: "Customer Segmentation Dataset", 
      size: "12.5 MB", 
      type: "CSV", 
      downloads: "2.3k",
      headers: ["ID", "Age", "Annual Income", "Spending Score"],
      rows: [
        ["1", "24", "$45,000", "78"],
        ["2", "32", "$80,000", "45"],
        ["3", "45", "$95,000", "55"]
      ]
    },
    { 
      id: 2, 
      title: "Indonesian Product Sentiment Analysis", 
      size: "4.1 MB", 
      type: "JSON", 
      downloads: "840",
      headers: ["Text", "Sentiment"],
      rows: [
        ["Buku ini sangat bagus dan bermanfaat!", "Positive"],
        ["Kualitas produk kurang sesuai foto.", "Negative"],
        ["Pengiriman cepat, respon penjual ramah.", "Positive"]
      ]
    },
  ]);

  // Data awal untuk list Code
  const [codes, setCodes] = useState([
    {
      id: 1,
      title: "data_ninja / K-Means-Clustering",
      author: "@data_ninja",
      time: "2 hours ago",
      link: "https://github.com/data-ninja/K-Means-Clustering"
    }
  ]);

  const filteredDatasets = datasets.filter(dataset =>
    dataset.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCodes = codes.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ========================================================
  // FUNGSI AKSI UTAMA & FITUR AUTH
  // ========================================================
  
  // Fungsi Login Manual Form
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      alert("Mohon isi semua kolom!");
      return;
    }

    if (authModal === "register" && !authUsername) {
      alert("Mohon tentukan username akun kamu!");
      return;
    }

    // Tentukan nama user yang dipakai berdasarkan mode login
    const finalUser = authModal === "register" ? authUsername : authEmail.split("@")[0];
    
    setIsLoggedIn(true);
    setCurrentUser(finalUser);
    setAuthModal(null); // Tutup modal pop-up setelah sukses
    
    // Bersihkan form input
    setAuthEmail("");
    setAuthPassword("");
    setAuthUsername("");
  };

  // Fungsi Login Cepat Pakai GitHub (Simulasi OAuth)
  const handleQuickGitHubLogin = () => {
    setIsLoggedIn(true);
    setCurrentUser("github_user");
    setAuthModal(null);
  };

  // Fungsi Keluar Akun
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentView("home");
  };

  const handleDatasetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = (event.target?.result as string) || "";
        const lines = text.split(/\r\n|\n|\r/).map(line => line.trim()).filter(line => line !== '');
        
        let headers: string[] = ["Data Preview"];
        let rows: string[][] = [];

        if (file.name.toLowerCase().endsWith('.csv') && lines.length > 0) {
          const separator = lines[0].includes(';') ? ';' : ',';
          headers = lines[0].split(separator);
          rows = lines.slice(1, 6).map(line => line.split(separator)); 
        } else {
          rows = [[`Preview belum tersedia untuk format ini. File "${file.name}" berhasil terdaftar.`]];
        }

        const newDataset = {
          id: Date.now(),
          title: file.name,
          size: `${fileSizeMB} MB`,
          type: file.name.split('.').pop()?.toUpperCase() || "FILE",
          downloads: "0",
          headers: headers,
          rows: rows
        };

        setDatasets(prev => [newDataset, ...prev]);
      };
      
      reader.readAsText(file);
      e.target.value = '';
    }
  };

  const handleDatasetFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const folderName = files[0].webkitRelativePath.split("/")[0];
      const newDataset = {
        id: Date.now(),
        title: `📁 ${folderName} (Folder Dataset)`,
        size: "Multiple Files",
        type: "DIR",
        downloads: "0",
        headers: ["Files inside folder"],
        rows: [["Berisi total " + files.length + " file di dalam direktori dataset."]]
      };
      setDatasets(prev => [newDataset, ...prev]);
      e.target.value = '';
    }
  };

  const handleGithubSubmit = () => {
    if (!githubLink.trim()) return;

    if (!githubLink.includes("github.com")) {
      alert("Mohon masukkan tautan GitHub yang valid! (contoh: https://github.com/username/repo)");
      return;
    }

    const urlParts = githubLink.split("/").filter(Boolean);
    const repoName = urlParts[urlParts.length - 1];
    
    // Jika user sudah login, pakai nama akun miliknya. Jika belum, pakai nama dari link repository.
    const authorName = isLoggedIn && currentUser ? currentUser : (urlParts[urlParts.length - 2] || "user");

    const newRepo = {
      id: Date.now(),
      title: `${authorName} / ${repoName}`,
      author: `@${authorName}`,
      time: "Just now",
      link: githubLink
    };

    setCodes(prev => [newRepo, ...prev]);
    setGithubLink("");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden">
      
      {/* ========================================================
          1. NAVBAR SECTION (DINAMIS SINKRON STATUS AUTH)
         ======================================================== */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-8">
          <div 
            onClick={() => { setCurrentView("home"); setSearchQuery(""); }} 
            className="text-2xl font-black text-indigo-600 tracking-tight cursor-pointer flex items-center gap-2"
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            DataHub
          </div>
          <div className="hidden md:flex items-center gap-6 text-[15px] font-medium text-gray-600">
            <button onClick={() => { setCurrentView("competitions"); setSearchQuery(""); }} className={`transition-colors ${currentView === "competitions" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"}`}>Competitions</button>
            <button onClick={() => { setCurrentView("datasets"); setSearchQuery(""); }} className={`transition-colors ${currentView === "datasets" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"}`}>Datasets</button>
            <button onClick={() => { setCurrentView("code"); setSearchQuery(""); }} className={`transition-colors ${currentView === "code" ? "text-indigo-600 font-bold" : "hover:text-indigo-600"}`}>Code & Models</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Kolom Pencarian Global */}
          <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 w-64 focus-within:border-indigo-400 focus-within:bg-white transition-all">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search data, code..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView === "home" || currentView === "competitions") {
                  setCurrentView("datasets");
                }
              }}
              className="bg-transparent outline-none w-full text-[14px] placeholder-gray-400 text-gray-800" 
            />
          </div>

          {/* SINKRONISASI AREA TOMBOL AUTH KANAN */}
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase">
                  {currentUser?.charAt(0)}
                </div>
                <span className="text-[14px] font-semibold text-indigo-900">@{currentUser}</span>
              </div>
              <button 
                onClick={handleSignOut}
                className="text-[14px] font-semibold text-gray-500 hover:text-red-600 px-2 py-2 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setAuthModal("signin")}
                className="text-[14px] font-semibold text-gray-700 hover:text-indigo-600 px-3 py-2 transition-colors"
              >
                Sign In
              </button>
              <button 
                onClick={() => setAuthModal("register")}
                className="bg-indigo-600 text-white text-[14px] font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ========================================================
          2. DYNAMIC CONTENT VIEWS
         ======================================================== */}
      
      {/* --- HOME VIEW --- */}
      {currentView === "home" && (
        <main className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-12 relative">
          <div className="w-full md:w-1/2 pr-0 md:pr-10 z-10">
            <h1 className="text-[50px] leading-[1.1] font-extrabold text-gray-900 mb-6 tracking-tight">Build, Share, and Deploy Data Projects.</h1>
            <p className="text-[17px] leading-relaxed text-gray-600 mb-10 max-w-[480px]">The ultimate platform to discover datasets, upload your machine learning algorithms, and collaborate directly via GitHub integration.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => { if(!isLoggedIn) setAuthModal("signin"); }} className="flex items-center gap-3 border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-50 transition-colors font-medium text-[15px] shadow-sm">
                Connect with GitHub
              </button>
              <button onClick={() => setCurrentView("datasets")} className="font-semibold text-[15px] text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2">Explore Datasets →</button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-end relative">
            <div className="w-[450px] h-[400px] relative flex items-center justify-center">
              <svg className="absolute w-full h-full opacity-10" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="150" fill="none" stroke="#4F46E5" strokeWidth="1" strokeDasharray="4 8" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="#4F46E5" strokeWidth="1" />
              </svg>
              <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center border-4 border-white">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
              </div>
              <div className="absolute top-12 right-16 w-12 h-12 bg-white rounded-full shadow-lg border border-indigo-100 flex items-center justify-center z-10"><div className="w-4 h-4 bg-blue-500 rounded-full"></div></div>
              <div className="absolute bottom-16 left-16 w-10 h-10 bg-white rounded-full shadow-lg border border-indigo-100 flex items-center justify-center z-10"><div className="w-3 h-3 bg-pink-500 rounded-full"></div></div>
              <div className="absolute top-8 left-0 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 transform -rotate-6 z-20">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-black text-xs">CSV</div>
                <div><p className="text-sm font-bold text-gray-800">sales_data.csv</p><p className="text-xs text-gray-400 font-medium">12.5 MB</p></div>
              </div>
              <div className="absolute bottom-8 right-0 bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 transform rotate-6 z-20">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-black text-xs">.PY</div>
                <div><p className="text-sm font-bold text-gray-800">train_model.py</p><p className="text-xs text-emerald-500 font-medium">✓ 98.4%</p></div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* --- DATASETS VIEW --- */}
      {currentView === "datasets" && (
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
              <p className="text-gray-500">Temukan atau bagikan dataset untuk melatih model machine learning kamu.</p>
            </div>
            
            <input type="file" accept=".csv,.json,.xlsx" ref={datasetInputRef} onChange={handleDatasetFileChange} className="hidden" />
            <input type="file" ref={datasetFolderInputRef} onChange={handleDatasetFolderChange} className="hidden" webkitdirectory="" directory="" multiple />
            
            <div className="flex gap-2">
              <button onClick={() => datasetInputRef.current?.click()} className="border border-indigo-600 text-indigo-600 font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-sm transition-colors">
                + Upload File
              </button>
              <button onClick={() => datasetFolderInputRef.current?.click()} className="bg-indigo-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-indigo-700 text-sm shadow-sm transition-colors">
                📁 Upload Folder
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input type="text" placeholder="Cari dataset spesifik..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-indigo-500 bg-gray-50 text-sm text-gray-800 shadow-inner" />
          </div>

          <div className="space-y-4">
            {filteredDatasets.length > 0 ? (
              filteredDatasets.map(dataset => (
                <div key={dataset.id} className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm flex justify-between items-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-l-4 border-l-indigo-500">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{dataset.title}</h3>
                    <div className="flex gap-4 text-xs text-gray-400 mt-1 font-medium">
                      <span className="bg-gray-100 px-2 py-1 rounded">📊 {dataset.type}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">📁 {dataset.size}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">📥 {dataset.downloads} downloads</span>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal({ type: "data", title: dataset.title, content: dataset })} className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">View Data</button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 border rounded-xl text-gray-400 font-medium">🔍 Dataset "{searchQuery}" tidak ditemukan.</div>
            )}
          </div>
        </main>
      )}

      {/* --- COMPETITIONS VIEW --- */}
      {currentView === "competitions" && (
        <main className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Data Science Competitions</h1>
          <p className="text-gray-500 mb-8">Ikuti kompetisi sengit dan menangkan hadiah menarik.</p>
          <div className="p-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">🏆 Belum ada kompetisi aktif saat ini.</div>
        </main>
      )}

      {/* --- CODE & MODELS VIEW --- */}
      {currentView === "code" && (
        <main className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Code & Notebooks</h1>
              <p className="text-gray-500">Tautkan langsung repository GitHub kamu ke platform ini.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <input 
                type="text" 
                placeholder="https://github.com/user/repo" 
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="border border-gray-300 px-4 py-2.5 rounded-lg text-sm w-full md:w-64 focus:outline-none focus:border-indigo-500 text-gray-800"
              />
              <button 
                onClick={handleGithubSubmit}
                className="bg-gray-900 text-white font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm hover:bg-black transition-colors whitespace-nowrap"
              >
                Connect Repo
              </button>
            </div>
          </div>

          <div className="mb-6">
            <input type="text" placeholder="Cari repository kode atau nama pemilik..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border border-gray-200 rounded-lg p-3 outline-none focus:border-indigo-500 bg-gray-50 text-sm text-gray-800 shadow-inner" />
          </div>

          <div className="space-y-4">
            {filteredCodes.length > 0 ? (
              filteredCodes.map(item => (
                <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm flex justify-between items-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md border-l-4 border-l-gray-800">
                  <div className="flex items-center gap-4">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-gray-800 fill-current hidden sm:block"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 cursor-pointer hover:underline" onClick={() => window.open(item.link, "_blank")}>{item.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 font-medium">Added by {item.author} • GitHub Repository • {item.time}</p>
                    </div>
                  </div>
                  <button onClick={() => setActiveModal({ type: "code", title: item.title, content: item })} className="text-sm font-semibold border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">View Info</button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 border rounded-xl text-gray-400 font-medium">🔍 Repository "{searchQuery}" tidak ditemukan.</div>
            )}
          </div>
        </main>
      )}

      {/* ========================================================
          3. SIGN IN / REGISTER POP-UP MODAL PANEL
         ======================================================== */}
      {authModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 border border-gray-100 flex flex-col relative animate-in fade-in zoom-in duration-200">
            
            {/* Tombol Silang Tutup */}
            <button onClick={() => setAuthModal(null)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
            
            {/* Judul Modal */}
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {authModal === "signin" ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {authModal === "signin" ? "Sign in to manage your datasets and code repositories." : "Join DataHub to share projects with the community."}
            </p>

            {/* Form Login / Register */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authModal === "register" && (
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Username</label>
                  <input 
                    type="text" 
                    placeholder="ex: andini_dev" 
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800"
                  />
                </div>
              )}
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:outline-none focus:border-indigo-500 bg-gray-50 text-gray-800"
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl text-sm shadow-md hover:bg-indigo-700 transition-colors mt-2">
                {authModal === "signin" ? "Sign In" : "Register"}
              </button>
            </form>

            {/* Pembatas Atau */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-3 text-xs text-gray-400 font-bold uppercase tracking-widest">Or</span>
            </div>

            {/* Tombol Oauth GitHub Simulasi */}
            <button 
              onClick={handleQuickGitHubLogin}
              className="w-full border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              Continue with GitHub
            </button>

            {/* Teks Tukar Halaman Auth */}
            <p className="text-center text-xs text-gray-500 mt-6 font-medium">
              {authModal === "signin" ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => setAuthModal(authModal === "signin" ? "register" : "signin")} 
                className="text-indigo-600 font-bold hover:underline"
              >
                {authModal === "signin" ? "Register here" : "Sign In here"}
              </button>
            </p>

          </div>
        </div>
      )}

      {/* --- DATA MODAL PREVIEW --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100 overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 truncate pr-4">{activeModal.title}</h2>
              <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-lg">✕</button>
            </div>
            
            <div className="p-6 overflow-auto bg-gray-50 flex-1">
              {activeModal.type === "data" ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-fit min-w-full overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-100 text-gray-700 font-semibold border-b border-gray-200">
                        {activeModal.content.headers.map((header: string, i: number) => (
                          <th key={i} className="p-3 border-r border-gray-200 last:border-0">{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {activeModal.content.rows.map((row: string[], rowIndex: number) => (
                        <tr key={rowIndex} className="hover:bg-gray-50/50">
                          {row.map((cell: string, cellIndex: number) => (
                            <td key={cellIndex} className="p-3 border-r border-gray-200 last:border-0">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-xl p-8 shadow-inner flex flex-col items-center justify-center text-center text-white py-16">
                  <svg viewBox="0 0 24 24" className="w-20 h-20 mb-6 fill-current text-white"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  <h3 className="text-2xl font-bold mb-3">{activeModal.content.title}</h3>
                  <p className="text-gray-400 mb-8 max-w-md">Source code dan manajemen proyek ini tersedia langsung di GitHub. Kamu bisa berkolaborasi secara real-time di sana.</p>
                  <a href={activeModal.content.link || "#"} target="_blank" rel="noreferrer" className="bg-white text-black font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors shadow-lg">
                    Buka Repositori ↗
                  </a>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="bg-indigo-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-indigo-700 text-sm">Tutup</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}