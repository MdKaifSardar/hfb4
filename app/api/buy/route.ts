import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const { email, tokensBought } = await req.json();
    if (!email || !tokensBought) {
      return NextResponse.json({ error: "Missing email or token amount" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOneAndUpdate(
      { email },
      { $inc: { tokenBalance: tokensBought } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, balance: user.tokenBalance });
  } catch (error) {
    console.error("Buy Route Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}