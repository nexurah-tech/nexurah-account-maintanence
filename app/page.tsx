"use client";
import React, { useState, useEffect } from "react";
import StatCard from "@/components/StatCard";
import TransactionRow from "@/components/TransactionRow";
import FilterTabs from "@/components/FilterTabs";
import SkeletonCard from "@/components/SkeletonCard";
import { Settings, Bell } from "lucide-react";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all-time");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sumRes, transRes] = await Promise.all([
        fetch("/api/summary"),
        fetch("/api/transactions")
      ]);
      
      const sumData = await sumRes.json();
      const transData = await transRes.json();
      
      setSummary(sumData);
      setRecentTransactions(transData.slice(0, 8));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredStats = () => {
    if (!summary) return { income: 0, outcome: 0, balance: 0, net: 0 };
    
    switch (activeTab) {
      case "this-week":
        return { 
          income: summary.thisWeekIncome, 
          outcome: summary.thisWeekOutcome, 
          balance: summary.balance, 
          net: summary.thisWeekBalance 
        };
      case "this-month":
        return { 
          income: summary.thisMonthIncome, 
          outcome: summary.thisMonthOutcome, 
          balance: summary.balance, 
          net: summary.thisMonthBalance 
        };
      default:
        return { 
          income: summary.totalIncome, 
          outcome: summary.totalOutcome, 
          balance: summary.balance, 
          net: summary.totalIncome - summary.totalOutcome 
        };
    }
  };

  const stats = getFilteredStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">Dashboard</h2>
          <p className="text-text-secondary text-sm">Welcome back, Nexurah Team</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-full border border-gray-100 text-gray-500 hover:text-primary transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 bg-white rounded-full border border-gray-100 text-gray-500 hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Income" amount={stats.income} type="income" isLoading={loading} />
        <StatCard title="Total Outcome" amount={stats.outcome} type="outcome" isLoading={loading} />
        <StatCard title="Available Balance" amount={stats.balance} type="balance" isLoading={loading} />
        <StatCard title="Net Change" amount={stats.net} type="neutral" isLoading={loading} />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center md:justify-start">
        <FilterTabs 
          activeValue={activeTab}
          onChange={setActiveTab}
          options={[
            { label: "This Week", value: "this-week" },
            { label: "This Month", value: "this-month" },
            { label: "All Time", value: "all-time" },
          ]}
        />
      </div>

      {/* Recent Transactions */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Recent Transactions</h3>
          <button className="text-primary text-sm font-bold hover:underline">View All</button>
        </div>
        
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          {loading ? (
            Array(5).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((t) => (
              <TransactionRow 
                key={t._id}
                id={t._id}
                title={t.title}
                amount={t.amount}
                type={t.type}
                date={t.date}
                category={t.category}
                compact
              />
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              No transactions yet. Click the "+" button to add one.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
