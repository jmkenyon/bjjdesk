import prisma from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, belt, gymId } = await req.json();

    await prisma.user.create({
      data: {
        name,
        email,
        belt,
        role: "STUDENT",
        gym: {
          connect: {
            id: gymId,
          },
        },
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email already exists in this gym" },
          { status: 409 }
        );
      }
    }

    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
