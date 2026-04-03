"use client";

import { useState, useCallback } from "react";
import { Upload, FileAudio, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AudioUploadProps {
  assemblyId: string;
}

const ACCEPTED_TYPES = [
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/wav",
  "audio/webm",
];
const ACCEPTED_EXTENSIONS = ".mp3,.m4a,.wav,.webm";
const MAX_SIZE_MB = 500;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AudioUpload({ assemblyId }: AudioUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const validateAndSetFile = useCallback((f: File) => {
    setError(null);

    if (!ACCEPTED_TYPES.includes(f.type)) {
      setError("Formato no soportado. Usa MP3, M4A, WAV o WebM.");
      return;
    }

    if (f.size > MAX_SIZE_BYTES) {
      setError(`El archivo excede ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(f);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) validateAndSetFile(droppedFile);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSetFile(selected);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `assemblies/${assemblyId}/audio.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("assembly-audio")
        .upload(path, file, { upsert: true });

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      // Update assembly record with audio URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("assembly-audio").getPublicUrl(path);

      await supabase
        .from("assemblies")
        .update({ audio_url: publicUrl })
        .eq("id", assemblyId);

      setUploaded(true);
    } catch {
      setError("Error al subir el archivo. Intenta de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  if (uploaded) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3">
        <FileAudio className="h-4 w-4 text-emerald-600" />
        <span className="text-xs font-medium text-emerald-700">
          Audio subido correctamente. La transcripcion se procesara
          pronto.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Drop zone */}
      {!file ? (
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-6 transition-colors ${
            dragOver
              ? "border-amber-400 bg-amber-50"
              : "border-gray-200 bg-gray-50 hover:border-gray-300"
          }`}
        >
          <Upload className="h-6 w-6 text-gray-400" />
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600">
              Arrastra el audio aqui
            </p>
            <p className="text-[10px] text-gray-400">
              MP3, M4A, WAV, WebM - Max {MAX_SIZE_MB}MB
            </p>
          </div>
          <input
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-3">
          <FileAudio className="h-4 w-4 shrink-0 text-amber-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{file.name}</p>
            <p className="text-[10px] text-muted-foreground">
              {formatSize(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="shrink-0 rounded-full p-1 hover:bg-gray-200"
          >
            <X className="h-3.5 w-3.5 text-gray-500" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {/* Upload button */}
      {file && !uploading && (
        <button
          type="button"
          onClick={handleUpload}
          className="rounded-lg bg-amber-600 py-2 text-sm font-semibold text-white shadow-md shadow-amber-600/25 transition-all hover:bg-amber-700"
        >
          Procesar con IA
        </button>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
          <span className="text-xs text-muted-foreground">
            Subiendo audio...
          </span>
        </div>
      )}
    </div>
  );
}
