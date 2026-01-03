"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import {  Gym } from "@prisma/client";

import { useState } from "react";

interface DocumentsModalProps {
  gym: Gym;
}

export function DocumentsModal({ gym }: DocumentsModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <section className="mt-10 rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Waiver</h2>
        <p className="mt-1 max-w-prose text-sm text-slate-600">
          Add waiver that students must sign before training
        </p>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed bg-slate-50 p-10 text-center">
        <p className="text-sm text-slate-500 max-w-xs">
          Upload a waiver for students to sign.
        </p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="hover:bg-black hover:text-white transition-colors delay-100"
              onClick={() => setOpen(true)}
            >
              Add waiver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-106.25"></DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
