"use client";
import { useState, useRef, ChangeEvent } from "react";

export default function CombinedDataHub() {
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<{ type: "data" | "code"; title: string; content: any } | null>(null);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authModal, setAuthModal] = useState<"signin" | "register" | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [githubLink, setGithubLink] = useState("");

  const datasetInputRef = useRef<HTMLInputElement>(null);
  const datasetFolderInputRef = useRef<HTMLInputElement>(null);

  const [datasets, setDatasets] = useState([
    { 
      id: 1, title: "Customer Segmentation Dataset", size: "12.5 MB", type: "CSV", downloads: "2.3k",
      headers: ["ID", "Age", "Annual Income", "Spending Score"],
      rows: [["1", "24", "$45,000", "78"], ["2", "32", "$80,000", "45"]]
    }
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
        const lines = text.split(/\r\n|\n|\r/).map(l => l.trim()).filter(l => l !== '');
        const separator = lines[0]?.includes(';') ? ';' : ',';
        const newDataset = {
          id: Date.now(),
          title: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
          type: file.name.split('.').pop()?.toUpperCase() || "FILE",
          downloads: "0",
          headers: lines[0]?.split(separator) || ["Data"],
          rows: lines.slice(1, 6).map(l => l.split(separator))
        };
        setDatasets(prev => [newDataset, ...prev]);
      };
      reader.readAsText(file);
    }
  };

  const handleDatasetFolderChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      const folderName = files[0].webkitRelativePath.split("/")[0];
      setDatasets(prev => [{
        id: Date.now(), title: `📁 ${folderName}`, size: "Multiple", type: "DIR", downloads: "0",
        headers: ["Status"], rows: [["Berisi " + files.length + " file."]]
      }, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-40">
        <div className="flex items-center gap-8">
          <div onClick={() => setCurrentView("home")} className="text-2xl font-black text-indigo-600 cursor-pointer">DataHub</div>
          <div className="hidden md:flex gap-6 font-medium text-gray-600">
            <button onClick={() => setCurrentView("datasets")} className={currentView === "datasets" ? "text-indigo-600 font-bold" : ""}>Datasets</button>
            <button onClick={() => setCurrentView("code")} className={currentView === "code" ? "text-indigo-600 font-bold" : ""}>Code & Models</button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input className="hidden md:block bg-gray-50 border rounded-lg px-4 py-2 w-64 text-sm" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          {isLoggedIn ? (
             <div className="text-sm font-bold text-indigo-900">@{currentUser}</div>
          ) : (
             <button onClick={() => setAuthModal("signin")} className="text-sm font-bold">Sign In</button>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-6 py-12">
        {currentView === "datasets" && (
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="text-3xl font-bold">Datasets</h1>
              <div className="flex gap-2">
                <input type="file" ref={datasetInputRef} onChange={handleDatasetFileChange} className="hidden" />
                {/* FIX TYPE ERROR DENGAN AS ANY */}
                <input type="file" ref={datasetFolderInputRef} onChange={handleDatasetFolderChange} className="hidden" {...({ webkitdirectory: "", directory: "", multiple: true } as any)} />
                <button onClick={() => datasetInputRef.current?.click()} className="border px-4 py-2 rounded-lg">+ File</button>
                <button onClick={() => datasetFolderInputRef.current?.click()} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">📁 Folder</button>
              </div>
            </div>
            <div className="space-y-4">
              {filteredDatasets.map(d => (
                <div key={d.id} className="p-5 border rounded-xl flex justify-between">
                  <h3 className="font-bold">{d.title}</h3>
                  <button onClick={() => setActiveModal({ type: "data", title: d.title, content: d })} className="text-sm border px-4 py-2 rounded-lg">View Data</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      
      {/* Modal Preview ... (sisanya sama seperti kode terakhir) */}
    </div>
  );
}