"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

type Props = {
  onImageSelect: (file: File | null) => void;
  currentImageUrl?: string | null;
  maxSizeMB?: number;
};

export function ImageUpload({
  onImageSelect,
  currentImageUrl,
  maxSizeMB = 5,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(file: File | null) {
    setError(null);

    if (!file) {
      setPreview(null);
      onImageSelect(null);
      return;
    }

    // Validar tipo
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Formato inválido. Use: JPG, PNG, WEBP ou GIF");
      return;
    }

    // Validar tamanho
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > maxSizeMB) {
      setError(`Arquivo muito grande. Máximo: ${maxSizeMB}MB`);
      return;
    }

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
  }

  function handleClear() {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const displayImage = preview || currentImageUrl;

  return (
    <div className="space-y-3">
      {/* Preview ou Upload Zone */}
      {displayImage ? (
        <div className="relative rounded-lg overflow-hidden border-2 border-slate-700 group">
          <Image
            src={displayImage}
            alt="Preview"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
          {preview && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm px-3 py-2">
              <p className="text-xs text-emerald-400">
                ✓ Nova imagem selecionada
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={[
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            isDragging
              ? "border-emerald-500 bg-emerald-950/20"
              : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50",
          ].join(" ")}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-full bg-slate-800">
              {isDragging ? (
                <Upload className="w-6 h-6 text-emerald-400" />
              ) : (
                <ImageIcon className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-300">
                {isDragging
                  ? "Solte a imagem aqui"
                  : "Clique ou arraste uma imagem"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                JPG, PNG, WEBP ou GIF • Máximo {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Input Hidden */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
        className="hidden"
      />

      {/* Erro */}
      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-md px-3 py-2">
          {error}
        </p>
      )}
    </div>
  );
}