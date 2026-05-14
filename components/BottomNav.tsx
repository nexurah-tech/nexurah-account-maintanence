"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, PieChart, Plus } from "lucide-react";

const BottomNav: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: LayoutDashboard },
    { name: "Activity", href: "/transactions", icon: Receipt },
    { name: "Analytics", href: "/analytics", icon: PieChart },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-safe flex items-center justify-between z-50">
      {links.slice(0, 2).map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-primary" : "text-gray-400"
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
          </Link>
        );
      })}
      
      <button 
        onClick={onAddClick}
        className="relative -top-8 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 border-4 border-page-bg active:scale-90 transition-all"
      >
        <Plus size={32} strokeWidth={3} />
      </button>
      
      {links.slice(2).map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? "text-primary" : "text-gray-400"
            }`}
          >
            <Icon size={22} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{link.name}</span>
          </Link>
        );
      })}
      
      {/* Placeholder for symmetry if only 3 links */}
      <div className="flex flex-col items-center gap-1 text-gray-400 opacity-0 pointer-events-none">
        <div className="w-[22px] h-[22px]"></div>
        <span className="text-[10px] font-bold">More</span>
      </div>
    </div>
  );
};

export default BottomNav;
