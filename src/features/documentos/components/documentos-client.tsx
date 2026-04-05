"use client";

import { useState, useTransition, useMemo } from "react";
import {
  Folder,
  FileText,
  Receipt,
  Scale,
  Wallet,
  FolderOpen,
  ChevronLeft,
  Upload,
  File,
  FileImage,
  X,
  Download,
  Eye,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/motion";
import type { DocumentFile, FolderKey } from "../queries/get-documents";
import { DOCUMENT_FOLDERS } from "../queries/get-documents";
import { uploadDocument } from "../actions/upload-document";

const FOLDER_ICONS: Record<string, typeof Folder> = {
  receipt: Receipt,
  "file-text": FileText,
  scale: Scale,
  wallet: Wallet,
  folder: Folder,
};

const FOLDER_COLORS: Record<FolderKey, string> = {
  recibos: "#3B82F6",
  actas: "#8B5CF6",
  reglamento: "#EF4444",
  presupuesto: "#10B981",
  otros: "#6B7280",
};

function formatSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getFileIcon(mime: string) {
  if (mime.startsWith("image/")) return FileImage;
  if (mime.includes("pdf")) return FileText;
  return File;
}

interface DocumentosClientProps {
  isAdmin: boolean;
}

export function DocumentosClient({ isAdmin }: DocumentosClientProps) {
  const [currentFolder, setCurrentFolder] = useState<FolderKey | null>(null);
  const [files, setFiles] = useState<DocumentFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"pdf" | "image" | null>(null);

  const filteredFiles = useMemo(() => {
    if (!searchQuery.trim()) return files;
    const q = searchQuery.toLowerCase();
    return files.filter((f) =>
      f.name.replace(/^\d+_/, "").toLowerCase().includes(q)
    );
  }, [files, searchQuery]);

  async function openFolder(folder: FolderKey) {
    setCurrentFolder(folder);
    setIsLoading(true);
    setSearchQuery("");
    try {
      const { getDocuments } = await import("../queries/get-documents");
      const docs = await getDocuments(folder);
      setFiles(docs);
    } catch {
      setFiles([]);
    }
    setIsLoading(false);
  }

  function goBack() {
    setCurrentFolder(null);
    setFiles([]);
    setSearchQuery("");
  }

  function openPreview(file: DocumentFile) {
    const isImage = file.mime_type.startsWith("image/");
    const isPdf = file.mime_type.includes("pdf");
    if (!isImage && !isPdf) return;
    setPreviewUrl(file.url);
    setPreviewType(isPdf ? "pdf" : "image");
  }

  function closePreview() {
    setPreviewUrl(null);
    setPreviewType(null);
  }

  return (
    <div className="mx-auto w-full max-w-md min-h-screen bg-[#F5F5F7]">
      {/* Header */}
      <div className="bg-white px-5 pb-5 pt-6 shadow-sm">
        {currentFolder ? (
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {DOCUMENT_FOLDERS.find((f) => f.key === currentFolder)?.label}
              </p>
              <p className="text-xs text-gray-400">
                {files.length} archivo{files.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-400">Documentos</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Archivos y recibos del conjunto
            </p>
          </>
        )}
      </div>

      <div className="px-5 pt-5 pb-32">
        {!currentFolder ? (
          /* Folder grid */
          <StaggerContainer className="grid grid-cols-2 gap-3">
            {DOCUMENT_FOLDERS.map((folder) => {
              const Icon = FOLDER_ICONS[folder.icon] ?? Folder;
              const color = FOLDER_COLORS[folder.key];
              return (
                <StaggerItem key={folder.key}>
                  <button
                    onClick={() => openFolder(folder.key)}
                    className="group flex w-full flex-col items-center gap-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-105"
                      style={{ backgroundColor: color + "12" }}
                    >
                      <Icon
                        className="h-7 w-7"
                        style={{ color }}
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {folder.label}
                    </p>
                  </button>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        ) : (
          /* File list */
          <div>
            {/* Search input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar archivo..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-300" strokeWidth={1} />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  {searchQuery ? "Sin resultados" : "Carpeta vacia"}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {searchQuery
                    ? "Intenta con otro termino de busqueda"
                    : isAdmin
                      ? "Sube el primer archivo"
                      : "No hay archivos disponibles"}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
                {filteredFiles.map((file) => {
                  const FileIcon = getFileIcon(file.mime_type);
                  const isImage = file.mime_type.startsWith("image/");
                  const isPdf = file.mime_type.includes("pdf");

                  return (
                    <div
                      key={file.name}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50">
                        <FileIcon className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name.replace(/^\d+_/, "")}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatSize(file.size)} - {formatDate(file.created_at)}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {(isImage || isPdf) && (
                          <button
                            onClick={() => openPreview(file)}
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        <a
                          href={file.url}
                          download
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upload button for admin */}
            {isAdmin && (
              <button
                onClick={() => setShowUpload(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 bg-white py-4 text-sm font-medium text-gray-500 transition-colors hover:border-amber-300 hover:text-amber-600 active:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                Subir archivo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Preview modal */}
      <AnimatePresence>
        {previewUrl && previewType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={closePreview}
          >
            <button
              onClick={closePreview}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              style={{ maxHeight: "85vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              {previewType === "pdf" ? (
                <iframe
                  src={previewUrl}
                  className="h-[80vh] w-full border-0"
                  title="Vista previa PDF"
                />
              ) : (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="h-auto max-h-[80vh] w-full object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && currentFolder && (
          <UploadModal
            folder={currentFolder}
            onClose={() => setShowUpload(false)}
            onSuccess={() => {
              setShowUpload(false);
              openFolder(currentFolder);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---- Upload Modal ----

function UploadModal({
  folder,
  onClose,
  onSuccess,
}: {
  folder: FolderKey;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!file) {
      setError("Selecciona un archivo");
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("folder", folder);

      const result = await uploadDocument(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onSuccess();
      }
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        className="w-full max-w-md rounded-t-3xl bg-white px-5 pb-8 pt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Subir archivo</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="mb-4">
          <label className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center cursor-pointer transition-colors hover:border-amber-300">
            <Upload className="h-8 w-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {file ? file.name : "Seleccionar archivo"}
              </p>
              <p className="text-xs text-gray-400">PDF, imagen o documento (max 10MB)</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx"
              onChange={(e) => {
                const selected = e.target.files?.[0];
                if (selected) setFile(selected);
              }}
            />
          </label>
        </div>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={isPending || !file}
          className="w-full rounded-2xl bg-amber-500 py-3.5 text-sm font-semibold text-white transition-all active:scale-[0.98] hover:bg-amber-600 disabled:opacity-50"
        >
          {isPending ? "Subiendo..." : "Subir"}
        </button>
      </motion.div>
    </motion.div>
  );
}
