import { NextRequest, NextResponse } from "next/server";
import { getSignedUrlForUpload } from "@/app/lib/r2";
import prisma from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const { title, fileName, fileType, gymId } = await request.json();

  const objectKey = `gyms/${gymId}/documents/${crypto.randomUUID()}-${fileName}`;

  const signedUrl = await getSignedUrlForUpload(objectKey, fileType);

  try {
    await prisma.document.create({
      data: {
        title,
        fileUrl: objectKey,
        gym: {
          connect: {
            id: gymId,
          },
        },
      },
    });

    return NextResponse.json({ signedUrl });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error generating signed URL" },
      { status: 500 }
    );
  }
}
