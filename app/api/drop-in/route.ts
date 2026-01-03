import prisma from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fee, documents } = await req.json();

  const gym = await prisma.gym.findUnique({
    where: { id: session.user.gymId },
    select: { id: true, slug: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "Gym not found" }, { status: 404 });
  }

  const documentIds = Array.isArray(documents) ? documents : [];

  try {
    await prisma.dropIn.create({
      data: {
        fee: Number(fee),
        gymId: gym.id,
        qrCode: `https://${gym.slug}.bjjdesk.com/drop-in`,
        documents: {
          connect: documentIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fee, documents, dropInId } = await req.json();

  const dropIn = await prisma.dropIn.findUnique({
    where: { id: dropInId },
    select: { gymId: true },
  });

  if (!dropIn || dropIn.gymId !== session.user.gymId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const documentIds = Array.isArray(documents) ? documents : [];

  try {
    await prisma.dropIn.update({
      where: { id: dropInId },
      data: {
        fee: Number(fee),
        documents: {
          set: documentIds.map((id: string) => ({ id })),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}