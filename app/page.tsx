"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function CombinedDataHub() {
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<{ type: "data" | "code"; title: string; content: any } | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<"signin" | "register" | null>(null);
  const [githubLink, setGithubLink] = useState("");

  const datasetInputRef = useRef<HTMLInputElement>(null);
  const datasetFolderInputRef = useRef<HTMLInputElement>(null);
  const codeFolderInputRef = useRef<HTMLInputElement>(null);

  // Trik Vercel Build: Inject atribut folder saat aplikasi sudah berjalan (Client-side)
  useEffect(() => {
    [datasetFolderInputRef, codeFolderInputRef].forEach(ref => {
      if (ref.current) {
        ref.current.setAttribute("webkitdirectory", "");
        ref.current.setAttribute("directory", "");
      }
    });
  }, []);

  const [datasets, setDatasets] = useState([
    { id: 1, title: "Customer Segmentation Dataset", size: "12.5 MB", type: "CSV", downloads: "2.3k", headers: ["ID", "Age"], rows: [["1", "24"]] }
  ]);

  const [codes, setCodes] = useState([
    { id: 1, title: "data_ninja / K-Means-Clustering", author: "@data_ninja", time: "2 hours ago", link: "https://github.com/data-ninja/K-Means-Clustering" }
  ]);

  const filteredDatasets = datasets.filter(d => d.title.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredCodes = codes.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.author.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDatasetFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const text = (ev.target?.result as string) || "";
        const lines = text.split(/\r\n|\n|\r/).filter(l => l.trim() !== '');
        const sep = lines[0]?.includes(';') ? ';' : ',';
        setDatasets(prev => [{
          id: Date.now(), title: file.name, size: (file.size/1024/1024).toFixed(2)+" MB", type: "CSV", downloads: "0",
          headers: lines[0]?.split(sep) || ["Data"], rows: lines.slice(1, 6).map(l => l.split(sep))
        }, ...prev]);
      };
      reader.readAsText(file);
    }
  };

  const handleDatasetFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setDatasets(prev => [{
        id: Date.now(), title: `📁 ${e.target.files![0].webkitRelativePath.split("/")[0]}`, size: "Multiple", type: "DIR", downloads: "0",
        headers: ["Status"], rows: [["Berisi " + e.target.files!.length + " file."]]
      }, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div onClick={() => setCurrentView("home")} className="text-2xl font-black text-indigo-600 cursor-pointer">DataHub</div>
        <div className="flex gap-4">
           <input className="bg-gray-50 border rounded-lg px-4 py-2 text-sm" placeholder="Search..." onChange={(e) => setSearchQuery(e.target.value)} />
           {isLoggedIn ? <button onClick={() => {setIsLoggedIn(false); setCurrentUser(null);}}>Sign Out</button> : <button onClick={() => setAuthModal("signin")}>Sign In</button>}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {currentView === "datasets" && (
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="text-3xl font-bold">Datasets</h1>
              <div className="flex gap-2">
                <input type="file" ref={datasetInputRef} onChange={handleDatasetFileChange} className="hidden" />
                <input type="file" ref={datasetFolderInputRef} onChange={handleDatasetFolderChange} className="hidden" multiple />
                <button onClick={() => datasetInputRef.current?.click()} className="border px-4 py-2 rounded-lg">+ File</button>
                <button onClick={() => datasetFolderInputRef.current?.click()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">📁 Folder</button>
              </div>
            </div>
            {filteredDatasets.map(d => (
              <div key={d.id} className="p-5 border rounded-xl flex justify-between mb-4">
                <h3 className="font-bold">{d.title}</h3>
                <button onClick={() => setActiveModal({ type: "data", title: d.title, content: d })} className="border px-4 py-2 rounded-lg">View Data</button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Preview Tetap Sama... */}
    </div>
  );
}