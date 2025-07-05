"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddTeacherPayment() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/teacher-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create teacher payment");
      }
      toast.success("Teacher payment added!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create teacher payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">&larr; Back</button>
      <h2 className="text-xl font-bold mb-6">Add Teacher Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Amount</label>
            <input name="amount" type="number" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Paid To</label>
            <input name="paidTo" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile No</label>
            <input name="mobileNo" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Month</label>
            <input name="month" required className="input" placeholder="e.g. July 2025" />
          </div>
          <div>
            <label className="block text-sm font-medium">Payment Date</label>
            <input name="paymentDate" type="date" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mode</label>
            <select name="mode" required className="input">
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">UTR No (if online)</label>
            <input name="utrNo" className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Remark</label>
            <input name="remark" className="input" />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {loading ? "Adding..." : "Add Payment"}
        </button>
      </form>
    </div>
  );
}
