"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function CombinedDataHub() {
  const [currentView, setCurrentView] = useState("home");
  const datasetFolderInputRef = useRef<HTMLInputElement>(null);
  const codeFolderInputRef = useRef<HTMLInputElement>(null);

  // Trik: Atribut ditambahkan lewat JavaScript setelah halaman dimuat.
  // Ini membuat HTML kita "bersih" dari mata TypeScript saat build.
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

  // ... (tambahkan state dan fungsi lainnya di sini) ...

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* ... (isi komponen lainnya) ... */}
      
      {/* INPUT FOLDER INI SEKARANG BERSIH DARI ERROR BUILD */}
      <input 
        type="file" 
        ref={datasetFolderInputRef} 
        onChange={(e) => console.log(e.target.files)} 
        className="hidden" 
        multiple 
      />
      
      {/* ... */}
    </div>
  );
}