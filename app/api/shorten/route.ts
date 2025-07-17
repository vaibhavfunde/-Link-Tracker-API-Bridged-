import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Link from "@/model/Link";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { longUrl, customAlias, expiresAt } = await request.json();

    if (!longUrl) {
      return NextResponse.json({ error: "longUrl is required" }, { status: 400 });
    }
     
     
    await connectToDatabase();

    const shortCode = customAlias || nanoid(6);

    const existing = await Link.findOne({ shortCode });
    if (existing) {
      return NextResponse.json({ error: "Short code already exists" }, { status: 409 });
    }

    // Optional: Decode JWT to get user
    const token = request.cookies.get("token")?.value;
    let userId;
    interface JwtPayload {
  id: string;
}

    if (token) {
      // try {
      //   const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      //   userId = (decoded as any).id;
      // } catch (err) {
      //   console.warn("Invalid JWT" , err);
      // }
  try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = decoded.id;
  } catch (err) {
    console.warn("Invalid JWT" + err);
  }
    }

    // Default expiresAt to 10 days later if not provided
    const expiryDate = expiresAt
      ? new Date(expiresAt)
      : new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days from now

    const newLink = new Link({
      longUrl,
      shortCode,
      customAlias: customAlias || undefined,
      createdBy: userId || undefined,
      expiresAt: expiryDate,
    });

    await newLink.save();

    return NextResponse.json({
      message: "Short URL created successfully",
      shortUrl: `${process.env.DOMAIN}/shortcode/${shortCode}`,
      expiresAt: expiryDate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
