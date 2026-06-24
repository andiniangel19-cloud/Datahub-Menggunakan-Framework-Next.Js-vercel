"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";

export default function CombinedDataHub() {
  // ... (semua state dan fungsi handle sebelumnya sama persis) ...
  // Cukup ubah bagian Input Folder Dataset dan Code di bawah ini:

  const datasetFolderInputRef = useRef<HTMLInputElement>(null);
  const codeFolderInputRef = useRef<HTMLInputElement>(null);

  // Tambahkan useEffect ini agar atribut dipasang saat runtime (Vercel Build tidak akan protes!)
  useEffect(() => {
    if (datasetFolderInputRef.current) {
      datasetFolderInputRef.current.setAttribute("webkitdirectory", "");
      datasetFolderInputRef.current.setAttribute("directory", "");
    }
    if (codeFolderInputRef.current) {
      codeFolderInputRef.current.setAttribute("webkitdirectory", "");
      codeFolderInputRef.current.setAttribute("directory", "");
    }
  }, []);

  // ... (sisanya sama, tapi ubah bagian input folder jadi seperti ini) ...

  // GANTI BAGIAN INPUT FOLDER DI DATASET VIEW JADI INI:
  // <input type="file" ref={datasetFolderInputRef} onChange={handleDatasetFolderChange} className="hidden" multiple />
  
  // GANTI BAGIAN INPUT FOLDER DI CODE VIEW JADI INI:
  // <input type="file" ref={codeFolderInputRef} onChange={handleCodeFolderChange} className="hidden" multiple />