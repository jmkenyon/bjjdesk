import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import bcrypt from "bcrypt";

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

  const {
    firstName,
    lastName,
    gender,
    phone,
    email,
    dateOfBirth,
    street,
    city,
    postCode,
    county,
    country,
    contactName,
    contactNumber,
    relationship,
    membershipId,
    signature,
    password,
    confirmPassword,
    isFreeTrial,
  } = await req.json();

  const normalizedEmail = email.toLowerCase().trim();

  const resolvedMembershipId = isFreeTrial ? null : membershipId;

  if (!normalizedEmail || !password) {
    return NextResponse.json({ error: "Missing Details" }, { status: 400 });
  }

  if (!isFreeTrial && !membershipId) {
    return NextResponse.json({ error: "Membership required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      gymId: gym.id,
    },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already registered for this gym" },
      { status: 409 }
    );
  }

  if (gym.waiver && typeof signature !== "string") {
    return NextResponse.json(
      { error: "Waiver must be signed" },
      { status: 400 }
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 }
    );
  }
  const hashedPassword = await bcrypt.hash(password, 12);

  if (!isFreeTrial) {
    const membership = await prisma.membership.findFirst({
      where: { id: membershipId, gymId: gym.id },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "Invalid membership" },
        { status: 400 }
      );
    }
  }

  const type = isFreeTrial ? "FREE_TRIAL" : "MEMBERSHIP";

  try {
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        hashedPassword,
        gender,
        phone,
        email: normalizedEmail,
        dateOfBirth,
        street,
        city,
        postCode,
        county,
        country,
        contactName,
        contactNumber,
        relationship,
        membershipId: resolvedMembershipId,
        role: "STUDENT",
        gymId: gym.id,
        hasUsedFreeTrial: isFreeTrial,
        type,
      },
    });

    await prisma.accessPass.create({
      data: {
        type,
        userId: user.id,
        gymId: gym.id,
      },
    });

    if (gym.waiver) {
      await prisma.signedWaiver.create({
        data: {
          userId: user.id,
          gymId: gym.id,
          signature,
          waiverId: gym.waiver.id,
          waiverText: gym.waiver.content,
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
