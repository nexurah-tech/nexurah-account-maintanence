"use client";
import React, { useState, useEffect } from "react";
import FilterTabs from "@/components/FilterTabs";
import { TrendingUp, TrendingDown, Target, Info } from "lucide-react";
import { format } from "date-fns";

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("monthly");

  useEffect(() => {
    fetchAnalytics();
  }, [view]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?view=${view}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Analytics fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const maxVal = Math.max(...data.map(d => Math.max(d.income, d.outcome)), 1);

  // Summary stats
  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalOutcome = data.reduce((sum, d) => sum + d.outcome, 0);
  const avgMonthlyBalance = data.length > 0 ? (totalIncome - totalOutcome) / data.length : 0;
  
  const highestIncome = [...data].sort((a, b) => b.income - a.income)[0];
  const highestOutcome = [...data].sort((a, b) => b.outcome - a.outcome)[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Analytics</h2>
          <p className="text-text-secondary text-sm">Visualizing your financial health</p>
        </div>
        
        <FilterTabs 
          activeValue={view}
          onChange={setView}
          options={[
            { label: "Monthly View", value: "monthly" },
            { label: "Weekly View", value: "weekly" },
          ]}
        />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-income/10 text-income rounded-2xl">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Best {view === "monthly" ? "Month" : "Week"}</p>
            <p className="text-lg font-bold">{highestIncome ? (view === "monthly" ? highestIncome.month : highestIncome.week) : "N/A"}</p>
            <p className="text-income font-bold text-sm">₹{highestIncome?.income.toLocaleString("en-IN") || 0}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-outcome/10 text-outcome rounded-2xl">
            <TrendingDown size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Highest Spending</p>
            <p className="text-lg font-bold">{highestOutcome ? (view === "monthly" ? highestOutcome.month : highestOutcome.week) : "N/A"}</p>
            <p className="text-outcome font-bold text-sm">₹{highestOutcome?.outcome.toLocaleString("en-IN") || 0}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-2xl">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase">Avg. Balance</p>
            <p className="text-lg font-bold">₹{avgMonthlyBalance.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
            <p className="text-primary/60 font-bold text-sm">per period</p>
          </div>
        </div>
      </div>

      {/* Analytics Table & Chart */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-text-primary">Performance Breakdown</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3 h-3 bg-income rounded-full"></div> Income
            <div className="w-3 h-3 bg-outcome rounded-full ml-2"></div> Outcome
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Period</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Performance Chart</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Income</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Outcome</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : data.length > 0 ? (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-bold text-primary">
                      {view === "monthly" ? format(new Date(row.month + "-01"), "MMM yyyy") : row.week}
                    </td>
                    <td className="px-6 py-5 w-64">
                      <div className="space-y-1.5">
                        {/* Income Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-income transition-all duration-500" 
                              style={{ width: `${(row.income / maxVal) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-income w-8">{Math.round((row.income / maxVal) * 100)}%</span>
                        </div>
                        {/* Outcome Bar */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-outcome transition-all duration-500" 
                              style={{ width: `${(row.outcome / maxVal) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-outcome w-8">{Math.round((row.outcome / maxVal) * 100)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-income font-bold">₹{row.income.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-5 text-outcome font-bold">₹{row.outcome.toLocaleString("en-IN")}</td>
                    <td className={`px-6 py-5 font-bold ${row.balance >= 0 ? "text-primary" : "text-outcome"}`}>
                      ₹{row.balance.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    No analytics data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-blue-50 p-6 rounded-3xl flex items-start gap-4 border border-blue-100">
        <Info className="text-blue-500 shrink-0" size={24} />
        <div className="space-y-1">
          <h4 className="font-bold text-blue-900 text-sm">Insights</h4>
          <p className="text-blue-700 text-xs leading-relaxed">
            Your savings rate is currently <strong>{totalIncome > 0 ? Math.round(((totalIncome - totalOutcome) / totalIncome) * 100) : 0}%</strong>. 
            Aim for at least 20% to ensure long-term startup stability. 
            The highest spending period was <strong>{highestOutcome ? (view === "monthly" ? highestOutcome.month : highestOutcome.week) : "N/A"}</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
