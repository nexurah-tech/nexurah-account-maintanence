"use client";
import React, { useState, useEffect } from "react";
import TransactionRow from "@/components/TransactionRow";
import SkeletonCard from "@/components/SkeletonCard";
import { Search, Filter, Trash2, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(""); // YYYY-MM

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, monthFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (monthFilter) params.append("month", monthFilter);

      const res = await fetch(`/api/transactions?${params.toString()}`);
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Transaction deleted");
        setTransactions(transactions.filter(t => t._id !== id));
      } else {
        throw new Error("Delete failed");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  // Group transactions by month
  const groupedTransactions: Record<string, any[]> = {};
  transactions.forEach(t => {
    const month = format(new Date(t.date), "MMMM yyyy");
    if (!groupedTransactions[month]) groupedTransactions[month] = [];
    groupedTransactions[month].push(t);
  });

  const months = Object.keys(groupedTransactions);

  // Summary bar data
  const currentMonthStats = transactions.reduce((acc, t) => {
    if (t.type === "income") acc.income += t.amount;
    else acc.outcome += t.amount;
    return acc;
  }, { income: 0, outcome: 0 });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-text-primary">All Transactions</h2>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
        >
          <option value="all">All Types</option>
          <option value="income">Income Only</option>
          <option value="outcome">Outcome Only</option>
        </select>

        <input 
          type="month" 
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/10"
        />
        
        {(search || typeFilter !== "all" || monthFilter) && (
          <button 
            onClick={() => { setSearch(""); setTypeFilter("all"); setMonthFilter(""); }}
            className="text-xs font-bold text-primary hover:underline px-2"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Summary Bar */}
      <div className="bg-primary text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-primary/20">
        <div className="flex items-center gap-2">
          <Calendar size={20} className="text-white/60" />
          <span className="font-bold">{monthFilter ? format(parseISO(`${monthFilter}-01`), "MMMM yyyy") : "Total Selection"}</span>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="flex flex-col">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Income</span>
            <span className="font-bold">₹{currentMonthStats.income.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Outcome</span>
            <span className="font-bold">₹{currentMonthStats.outcome.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex flex-col border-l border-white/20 pl-6">
            <span className="text-white/60 text-[10px] uppercase font-bold tracking-wider">Net Balance</span>
            <span className="font-bold text-income">₹{(currentMonthStats.income - currentMonthStats.outcome).toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-6 pb-12">
        {loading ? (
          Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : months.length > 0 ? (
          months.map((month) => (
            <div key={month} className="space-y-3">
              <div className="sticky top-0 z-10 py-2 bg-page-bg/80 backdrop-blur-md">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{month}</h3>
              </div>
              <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                {groupedTransactions[month].map((t) => (
                  <TransactionRow 
                    key={t._id}
                    id={t._id}
                    title={t.title}
                    amount={t.amount}
                    type={t.type}
                    date={t.date}
                    category={t.category}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <h3 className="text-lg font-bold text-text-primary">No transactions found</h3>
            <p className="text-text-secondary text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
