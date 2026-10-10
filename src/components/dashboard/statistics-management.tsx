"use client";
import { useState } from "react";
import { createStatistic, updateStatistic, deleteStatistic } from "@/actions/statistics";
import { Button } from "@/components/ui/button";

export default function StatisticsManagement({ initialData }: { initialData: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Statistics Management</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse">
          <thead><tr><th className="border-b py-2">Label</th><th className="border-b py-2">Value</th><th className="border-b py-2">Actions</th></tr></thead>
          <tbody>
            {initialData.map(stat => (
              <tr key={stat.id}>
                <td className="py-2 border-b">{stat.label}</td>
                <td className="py-2 border-b">{stat.value}</td>
                <td className="py-2 border-b">
                  <Button variant="destructive" size="sm" onClick={() => deleteStatistic(stat.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
