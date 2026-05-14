import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Transaction from "@/lib/models/Transaction";
import { format, startOfMonth, endOfMonth, eachWeekOfInterval, getWeek, startOfWeek, endOfWeek } from "date-fns";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") || "monthly";

    const transactions = await Transaction.find({}).sort({ date: 1 });

    if (view === "monthly") {
      const monthlyData: Record<string, any> = {};

      transactions.forEach((t) => {
        const monthKey = format(t.date, "yyyy-MM");
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { month: monthKey, income: 0, outcome: 0, balance: 0 };
        }

        if (t.type === "income") {
          monthlyData[monthKey].income += t.amount;
        } else {
          monthlyData[monthKey].outcome += t.amount;
        }
        monthlyData[monthKey].balance = monthlyData[monthKey].income - monthlyData[monthKey].outcome;
      });

      return NextResponse.json(Object.values(monthlyData));
    } else {
      // Weekly view for current month
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      
      const weeks = eachWeekOfInterval({
        start: monthStart,
        end: monthEnd
      });

      const weeklyData = weeks.map((week, index) => {
        const wStart = startOfWeek(week);
        const wEnd = endOfWeek(week);
        
        const weekTransactions = transactions.filter(t => t.date >= wStart && t.date <= wEnd);
        
        const income = weekTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        const outcome = weekTransactions.filter(t => t.type === "outcome").reduce((sum, t) => sum + t.amount, 0);
        
        return {
          week: `Week ${index + 1}`,
          income,
          outcome,
          balance: income - outcome
        };
      });

      return NextResponse.json(weeklyData);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
