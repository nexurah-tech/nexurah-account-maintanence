"use client";
import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AddTransactionModal from "@/components/AddTransactionModal";
import { Toaster } from "react-hot-toast";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = () => {
    // This will be handled by pages using swr or simple window.location.reload() 
    // for this single-page app context if needed, or by specific state lifting.
    // For now, we'll just reload the page to keep it simple and reliable.
    window.location.reload();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-page-bg">
      <Sidebar onAddClick={() => setIsModalOpen(true)} />
      
      <main className="flex-1 pb-24 md:pb-8 max-w-7xl mx-auto w-full px-4 md:px-8 py-6 overflow-x-hidden">
        {children}
      </main>

      <BottomNav onAddClick={() => setIsModalOpen(true)} />
      
      <AddTransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={refreshData}
      />
      
      <Toaster position="top-center" />
    </div>
  );
}
