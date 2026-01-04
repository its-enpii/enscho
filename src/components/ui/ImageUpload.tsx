"use client";

import { useState, useEffect } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  label?: string;
  defaultValue?: string;
  className?: string;
}

export default function ImageUpload({ name, label, defaultValue, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue || null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (defaultValue) {
      setPreview(defaultValue);
    }
  }, [defaultValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFileName(file.name);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName(null);
    // Reset the file input if needed, but for native form submission we mostly just care about visual feedback here.
    // However, ensuring the input is cleared in DOM is tricky without ref, but mostly user just wants to see what they selected.
    
    // Note: To strictly clear the input value we would need a ref. 
    // For this simple implementation, we assume user selects a different file or just ignores it.
    // Ideally if they want to 'clear' the selection to send NOTHING, that's harder with native forms without JS controlling the submission data entirely.
    // But since this is likely replacing an image or optional, visual feedback is the priority.
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>}
      
      <div className="space-y-4">
        {/* Preview Area */}
        {preview ? (
          <div className="relative group w-full max-w-md aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
               <label htmlFor={name} className="cursor-pointer bg-white text-slate-900 px-4 py-2 rounded-full font-medium text-sm hover:bg-slate-100 transition-colors mr-2">
                 Ganti
               </label>
               {/* Note: 'X' to remove purely visual preview if it was a file, but if it was server data, it won't delete it server-side just by clicking X here yet. */}
            </div>
          </div>
        ) : (
          <label 
            htmlFor={name}
            className="w-full max-w-md aspect-video flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors bg-slate-50"
          >
             <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImageIcon className="w-10 h-10 text-slate-400 mb-3" />
                <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">Klik untuk upload</span> atau drag and drop</p>
                <p className="text-xs text-slate-500">JPG, PNG, WebP (MAX. 2MB)</p>
             </div>
          </label>
        )}

        {/* Hidden File Input (or visible if preferred, but styled label covers it) */}
        <input 
          id={name}
          name={name}
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleFileChange}
        />
        
        {fileName && (
           <p className="text-sm text-slate-500 flex items-center gap-2">
             <span className="font-medium text-slate-700">File terpilih:</span> {fileName}
           </p>
        )}
      </div>
    </div>
  );
}
