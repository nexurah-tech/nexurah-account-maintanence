import React from "react";

interface StatCardProps {
  title: string;
  amount: number;
  type?: "income" | "outcome" | "balance" | "neutral";
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, amount, type = "neutral", isLoading }) => {
  const getBadgeColor = () => {
    switch (type) {
      case "income": return "bg-income/10 text-income";
      case "outcome": return "bg-outcome/10 text-outcome";
      case "balance": return "bg-primary text-white";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className={`p-5 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md ${type === "balance" ? "bg-primary text-white" : "bg-white"}`}>
      <div className="flex flex-col gap-1">
        <span className={`text-xs font-medium uppercase tracking-wider ${type === "balance" ? "text-white/70" : "text-text-secondary"}`}>
          {title}
        </span>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {formatCurrency(amount)}
          </span>
          {type !== "balance" && type !== "neutral" && (
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getBadgeColor()}`}>
              {type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
