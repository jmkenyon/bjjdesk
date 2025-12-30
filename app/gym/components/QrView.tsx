"use client";

import UserQRCode from "@/app/gym/components/QRCode";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import { DropInModal } from "./DropInModal";
import { Document, Gym } from "@prisma/client";

interface QrViewProps {
  gym: Gym;
  docs: Document[];
}

const QrView = ({ gym, docs }: QrViewProps) => {
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Title",
    contentRef: printRef,
  });
  return (
    <>
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Drop-In Student QR Code</h2>
        <p className="mt-1 mb-2 text-sm text-slate-600 max-w-prose">
          Students can scan this QR code to sign required documents and pay for
          a drop-in class.
        </p>
        <DropInModal gym={gym} docs={docs} />
      </div>

      <div className="flex flex-col items-center gap-4 rounded-md border bg-slate-50 p-6">
        <div ref={printRef}>
          <UserQRCode value="https://bjjdesk.com/" />
        </div>

        <Button
          variant="outline"
          className="hover:bg-black hover:text-white"
          onClick={handlePrint}
        >
          Print QR Code
        </Button>
      </div>
    </>
  );
};

export default QrView;
