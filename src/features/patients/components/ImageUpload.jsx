"use client";

import { useRef, useState } from "react";
import { User } from "lucide-react";

export default function ImageUpload({ 
  label = "Profile Image",
  onFileSelect
})  {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
function handleChange(e) {
  const file = e.target.files?.[0];

  if(file){
    setPreview(URL.createObjectURL(file));
    onFileSelect(file);
  }
}

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 border border-slate-200"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <User className="h-8 w-8 text-slate-400" />
        )}
      </button>

    <input
 ref={inputRef}
 type="file"
 accept="image/*"
 onChange={handleChange}
 className="hidden"
/>
    </div>
  );
}