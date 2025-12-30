"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Document, Gym } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import toast from "react-hot-toast";

interface DocumentsModalProps {
  gym: Gym;
  docs: Document[];
}

export function DocumentsModal({ gym, docs }: DocumentsModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [title, setTitle] = useState("");
  const documents = docs;

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          fileName: file.name,
          fileType: file.type,
          gymId: gym.id,
        }),
      });
      const { signedUrl } = await response.json();

      await uploadFileWithProgress(
        file,
        signedUrl,
        abortControllerRef.current.signal
      );

      toast.success("File uploaded successfully!");
      setOpen(false); 
      setFile(null);
      setTitle("");
      router.refresh();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Upload cancelled");
      } else {
        console.error("Error uploading file:", error);
        toast.error("Error uploading file");
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      abortControllerRef.current = null;
    }
  };

  const handleCancelUpload = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const uploadFileWithProgress = (
    file: File,
    signedUrl: string,
    signal: AbortSignal
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", signedUrl);
      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Upload failed"));
      };

      xhr.send(file);

      signal.addEventListener("abort", () => {
        xhr.abort();
        reject(new Error("Upload cancelled"));
      });
    });
  };

  const handleDownload = async (key: string) => {
    try {
      const response = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const { signedUrl } = await response.json();
      window.open(signedUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Error downloading file");
    }
  };

  const handleDelete = async (key: string, id: string) => {
    try {
      await fetch("/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, id }),
      });
      toast.success("File deleted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file");
    }
  };

  return (
    <section className="mt-10 rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Documents</h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Add documents that students must sign before training
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-slate-50 p-10 text-center">
        {documents.length === 0 ? (
          <p className="text-sm font-medium text-slate-700">No documents yet</p>
        ) : (
          <ul className="w-full divide-y rounded-lg border bg-white shadow-sm">
            {" "}
            {documents.map((document) => (
              <li
                key={document.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition"
              >
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-slate-800 truncate pr-5">
                    {document.title}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      document.fileUrl && handleDownload(document.fileUrl)
                    }
                    className="cursor-pointer text-sm text-blue-600 hover:underline"
                  >
                    Download
                  </button>
                  <button
                    onClick={() =>
                      document.fileUrl &&
                      handleDelete(document.fileUrl, document.id)
                    }
                    className="cursor-pointer text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-slate-500 max-w-xs">
          Upload waivers, policies, or agreements for students to sign.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>

          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="hover:bg-black hover:text-white transition-colors delay-100"
              onClick={() => setOpen(true)}
            >
              Add document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25">
            <form onSubmit={handleUpload}>
              <DialogHeader>
                <DialogTitle>Add document</DialogTitle>
                <DialogDescription>Add a new document here</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3 pt-4">
                  <Label htmlFor="title-1">Title</Label>
                  <Input
                    id="title-1"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="file-1">File</Label>
                  <Input
                    id="file-1"
                    type="file"
                    className="cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <DialogFooter className="pt-5">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-black"
                  disabled={isUploading}
                >
                  {isUploading ? "Adding document" : "Add document"}
                </Button>
              </DialogFooter>
            </form>

            {isUploading && (
              <div className="mb-8">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">
                    {uploadProgress.toFixed(2)}% uploaded
                  </p>
                  <button
                    onClick={handleCancelUpload}
                    className="text-red-500 hover:text-red-600 transition duration-300"
                  >
                    Cancel Upload
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
