import React from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowUpRight, ArrowDownLeft, Trash2 } from "lucide-react";

interface TransactionRowProps {
  id: string;
  title: string;
  amount: number;
  type: "income" | "outcome";
  category?: string;
  date: string | Date;
  onDelete?: (id: string) => void;
  compact?: boolean;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ 
  id, title, amount, type, category, date, onDelete, compact = false 
}) => {
  const transactionDate = new Date(date);
  
  const formatDate = (d: Date) => {
    if (isToday(d)) return "Today";
    if (isYesterday(d)) return "Yesterday";
    return format(d, "dd MMM yyyy");
  };

  const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
    return type === "income" ? `+${formatted}` : `-${formatted}`;
  };

  return (
    <div className={`group flex items-center justify-between p-4 bg-white border-l-4 transition-all hover:bg-gray-50 ${type === "income" ? "border-income" : "border-outcome"}`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${type === "income" ? "bg-income/10 text-income" : "bg-outcome/10 text-outcome"}`}>
          {type === "income" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <h4 className="font-semibold text-text-primary leading-tight">{title}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-text-secondary">{formatDate(transactionDate)}</span>
            {!compact && category && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <span className={`font-bold ${type === "income" ? "text-income" : "text-outcome"}`}>
          {formatCurrency(amount)}
        </span>
        {onDelete && (
          <button 
            onClick={() => onDelete(id)}
            className="p-2 text-gray-400 hover:text-outcome transition-colors opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
