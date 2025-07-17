import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/db";
import Link from "@/model/Link";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(
  req: NextRequest,
  context: { params: { shortCode: string } }
) {
  try {
    await connectToDatabase();

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    } catch (err) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    const  {shortCode}  = context.params;
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return NextResponse.json({ error: "Short link not found" }, { status: 404 });
    }

    if (!link.createdBy || link.createdBy.toString() !== decoded.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // 🔍 Process analytics
    const analytics = link.analytics || [];
    const totalClicks = analytics.length;

    const now = new Date();
    const clicksPerDay: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const key = date.toISOString().split("T")[0];
      clicksPerDay[key] = 0;
    }

    const referrerCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    analytics.forEach((entry) => {
      const dateKey = new Date(entry.timestamp).toISOString().split("T")[0];
      if (clicksPerDay[dateKey] !== undefined) {
        clicksPerDay[dateKey]++;
      }

      const ref = entry.referrer || "Direct";
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

      const country = entry.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    return NextResponse.json({
      shortCode,
      totalClicks,
      clicksPerDay,
      referrerCounts,
      countryCounts,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}



