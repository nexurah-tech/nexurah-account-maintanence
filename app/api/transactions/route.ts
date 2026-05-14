import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, parseISO } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    
    const type = searchParams.get("type");
    const month = searchParams.get("month"); // YYYY-MM
    const week = searchParams.get("week");   // 1-53
    const search = searchParams.get("search");

    let query: any = {};

    if (type && type !== "all") {
      query.type = type;
    }

    if (month) {
      const date = parseISO(`${month}-01`);
      query.date = {
        $gte: startOfMonth(date),
        $lte: endOfMonth(date),
      };
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // Sort by date desc
    const transactions = await Transaction.find(query).sort({ date: -1 });

    return NextResponse.json(transactions);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    
    const { title, amount, type, category, date } = body;

    if (!title || !amount || !type || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transaction = await Transaction.create({
      title,
      amount: Math.abs(amount), // Ensure positive
      type,
      category: category || "Other",
      date: new Date(date),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
