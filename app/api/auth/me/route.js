import { getServerRole } from "@/utils/auth-server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = await getServerRole();
    return NextResponse.json(auth);
  } catch (error) {
    console.error("Auth Me API Error:", error);
    return NextResponse.json({ role: null, user: null }, { status: 500 });
  }
}
