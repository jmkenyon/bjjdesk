import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/lib/prisma";
import { getSignedUrlForDownload, deleteFile } from "@/app/lib/r2";

/**
 * GET — optional: list documents for the current gym
 * (recommended instead of listing raw R2 files)
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.document.findMany({
    where: { gymId: session.user.gymId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}

/**
 * POST — generate signed download URL
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { documentId } = await req.json();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { fileUrl: true, gymId: true },
  });

  if (!document || document.gymId !== session.user.gymId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const signedUrl = await getSignedUrlForDownload(document.fileUrl);

  return NextResponse.json({ signedUrl });
}

/**
 * DELETE — delete file + DB record
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { documentId } = await req.json();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id: documentId },
    select: { fileUrl: true, gymId: true },
  });

  if (!document || document.gymId !== session.user.gymId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteFile(document.fileUrl);
  await prisma.document.delete({ where: { id: documentId } });

  return NextResponse.json({ success: true });
}