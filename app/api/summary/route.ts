import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Total stats
    const allTransactions = await Transaction.find({});
    
    const totalIncome = allTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalOutcome = allTransactions
      .filter(t => t.type === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    // Monthly stats
    const monthTransactions = allTransactions.filter(t => t.date >= monthStart && t.date <= monthEnd);
    const thisMonthIncome = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const thisMonthOutcome = monthTransactions
      .filter(t => t.type === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    // Weekly stats
    const weekTransactions = allTransactions.filter(t => t.date >= weekStart && t.date <= weekEnd);
    const thisWeekIncome = weekTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const thisWeekOutcome = weekTransactions
      .filter(t => t.type === "outcome")
      .reduce((sum, t) => sum + t.amount, 0);

    return NextResponse.json({
      totalIncome,
      totalOutcome,
      balance: totalIncome - totalOutcome,
      thisMonthIncome,
      thisMonthOutcome,
      thisMonthBalance: thisMonthIncome - thisMonthOutcome,
      thisWeekIncome,
      thisWeekOutcome,
      thisWeekBalance: thisWeekIncome - thisWeekOutcome
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
