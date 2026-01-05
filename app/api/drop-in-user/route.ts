import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const gymSlug = searchParams.get("gym");

  if (!gymSlug) {
    return NextResponse.json({ error: "No gym found" }, { status: 400 });
  }

  const gym = await prisma.gym.findUnique({
    where: { slug: gymSlug },
    include: { waiver: true },
  });

  if (!gym) {
    return NextResponse.json({ error: "No gym found" }, { status: 400 });
  }

  const { firstName, lastName, gender, phone, email, dateOfBirth, signature } =
    await req.json();

  const normalizedEmail = email.toLowerCase().trim();

  if (!normalizedEmail) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  if (gym.waiver && typeof signature !== "string") {
    return NextResponse.json(
      { error: "Waiver must be signed" },
      { status: 400 }
    );
  }

  let user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      gymId: gym.id,
    },
  });

  try {
    if (!user) {
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          email: normalizedEmail,
          gender,
          phone,
          dateOfBirth,
          gymId: gym.id,
          role: "STUDENT",
          type: "DROP_IN",
        },
      });
    }

    await prisma.accessPass.create({
      data: {
        type: "DROP_IN",
        userId: user.id,
        gymId: gym.id,
      },
    });

    if (gym.waiver && signature) {
      await prisma.signedWaiver.create({
        data: {
          userId: user.id,
          gymId: gym.id,
          waiverId: gym.waiver.id,
          waiverText: gym.waiver.content,
          signature,
        },
      });
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
