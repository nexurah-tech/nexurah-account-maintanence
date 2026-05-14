import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";

export async function GET() {
  try {
    await connectDB();

    // Check if data already exists
    const count = await Transaction.countDocuments();
    if (count > 0) {
      return NextResponse.json({ seeded: false, message: "Already has data" });
    }

    const seedData = [
      { title: "Freelance project received", amount: 2000, type: "income", category: "freelance", date: new Date("2025-05-14") },
      { title: "Domain purchase", amount: 500, type: "outcome", category: "tools", date: new Date("2025-05-14") },
      { title: "Ad run payment to GrowX", amount: 1500, type: "outcome", category: "ads", date: new Date("2025-05-14") },
      { title: "Received from Doctor (Principal)", amount: 10000, type: "income", category: "salary", date: new Date("2025-05-14") },
      { title: "Paid to Sachin", amount: 1000, type: "outcome", category: "other", date: new Date("2025-05-14") },
      { title: "Ad payment to Digiforce", amount: 1000, type: "outcome", category: "ads", date: new Date("2025-05-14") },
      { title: "Received from RRB Doctor", amount: 20000, type: "income", category: "salary", date: new Date("2025-05-14") },
      { title: "Paid to Nithish", amount: 10000, type: "outcome", category: "other", date: new Date("2025-05-14") },
      { title: "Paid to Sachin", amount: 9000, type: "outcome", category: "other", date: new Date("2025-05-14") },
      { title: "Dr Kumaravel properties project amount received", amount: 5000, type: "income", category: "freelance", date: new Date("2025-05-14") },
      { title: "Chennai train ticket booking Up and down", amount: 1270, type: "outcome", category: "travel", date: new Date("2025-05-14") },
      { title: "Paid to Sachin", amount: 3000, type: "outcome", category: "other", date: new Date("2025-05-14") },
      { title: "SACROSANCT logo design", amount: 1000, type: "outcome", category: "tools", date: new Date("2025-05-14") }
    ];

    await Transaction.insertMany(seedData);

    return NextResponse.json({ seeded: true, count: seedData.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
