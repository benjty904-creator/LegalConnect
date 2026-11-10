import { StoredDocument } from "../types";
import { generateId } from "./cryptoService";

const DB_NAME = "LegalConnectDB";
const STORE_NAME = "documents";
const DB_VERSION = 1;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB is not supported by this browser."));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("requestId", "requestId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function validateDocumentFile(file: File): { valid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds the maximum 5MB size limit.`,
    };
  }

  const isAllowedType = ALLOWED_TYPES.includes(file.type) ||
    file.name.endsWith(".pdf") ||
    file.name.endsWith(".docx") ||
    file.name.endsWith(".doc");

  if (!isAllowedType) {
    return {
      valid: false,
      error: `File format for "${file.name}" is not supported. Please upload PDF, Word documents, images (JPEG/PNG), or text files.`,
    };
  }

  return { valid: true };
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export async function saveDocument(
  file: File,
  requestId: string
): Promise<StoredDocument> {
  const dataUrl = await fileToDataUrl(file);
  const doc: StoredDocument = {
    id: generateId(),
    requestId,
    name: file.name,
    size: file.size,
    type: file.type || "application/octet-stream",
    dataUrl,
    uploadedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(doc);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn("Could not write document to IndexedDB:", err);
  }

  return doc;
}

export async function getDocumentsByRequestId(
  requestId: string
): Promise<StoredDocument[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const index = store.index("requestId");
      const req = index.getAll(requestId);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => resolve([]);
    });
  } catch (err) {
    console.warn("Could not retrieve documents from IndexedDB:", err);
    return [];
  }
}

