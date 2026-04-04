"use client";

import { useState, useTransition } from "react";
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

  async function openFolder(folder: FolderKey) {
    setCurrentFolder(folder);
    setIsLoading(true);
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
              </div>
            ) : files.length === 0 ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-300" strokeWidth={1} />
                <p className="mt-3 text-sm font-medium text-gray-500">
                  Carpeta vacia
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {isAdmin
                    ? "Sube el primer archivo"
                    : "No hay archivos disponibles"}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
                {files.map((file) => {
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
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Eye className="h-4 w-4" />
                          </a>
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
