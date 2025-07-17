
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
// import Link from "@/schema";
// import { getClientIP } from "@/utils/getClientIP";
import Link from "@/model/Link";





export async function GET(
  req: NextRequest,
  context: { params: { shortCode: string } }
) {
  try {
    await connectToDatabase();

    const params =  context.params;
    const shortCode = params.shortCode;



    console.log("Fetching link for shortCode:", shortCode);

   

    const link = await Link.findOne({ shortCode });

    if (!link) {
      return NextResponse.json(
        { error: "Short link not found" },
        { status: 404 }
      );
    }

   

    if (link.expiresAt && new Date() > link.expiresAt) {
      return NextResponse.json(
        { error: "Short link has expired" },
        { status: 410 }
      );
    }



    const userAgent = req.headers.get("user-agent") || "Unknown";
    const referrer = req.headers.get("referer") || "Direct";
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "Unknown";

    const timestamp = new Date();

        

    link.analytics?.push({
      timestamp,
      userAgent,
      referrer,
      ip,
    });
    

    await link.save();

    
    return NextResponse.json({ longUrl: link.longUrl });

    // return NextResponse.redirect(link.longUrl , 301);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}


