"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function CombinedDataHub() {
  const [currentView, setCurrentView] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const datasetFolderInputRef = useRef<HTMLInputElement>(null);
  const codeFolderInputRef = useRef<HTMLInputElement>(null);

  // Injeksi atribut dilakukan setelah aplikasi berjalan, 
  // sehingga tidak akan terbaca oleh TypeScript saat Build.
  useEffect(() => {
    if (datasetFolderInputRef.current) {
      (datasetFolderInputRef.current as any).webkitdirectory = true;
      (datasetFolderInputRef.current as any).directory = true;
    }
    if (codeFolderInputRef.current) {
      (codeFolderInputRef.current as any).webkitdirectory = true;
      (codeFolderInputRef.current as any).directory = true;
    }
  }, []);

  // ... (Sisanya tetap sama, pastikan fungsi handleDatasetFolderChange tetap ada) ...

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ... (Nav bar sama) ... */}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {currentView === "datasets" && (
          <div>
            <div className="flex justify-between mb-8">
              <h1 className="text-3xl font-bold">Datasets</h1>
              <div className="flex gap-2">
                {/* INPUT FOLDER BERSIH TANPA ATRIBUT YANG ERROR */}
                <input 
                  type="file" 
                  ref={datasetFolderInputRef} 
                  onChange={(e) => console.log(e.target.files)} 
                  className="hidden" 
                  multiple 
                />
                <button 
                  onClick={() => datasetFolderInputRef.current?.click()} 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  📁 Upload Folder
                </button>
              </div>
            </div>
            {/* ... (Tampilan List Data) ... */}
          </div>
        )}
      </main>
    </div>
  );
}