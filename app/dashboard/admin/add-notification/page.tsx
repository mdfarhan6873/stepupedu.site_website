"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddNotification() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create notification");
      }
      toast.success("Notification created successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create notification");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">&larr; Back</button>
      <h2 className="text-xl font-bold mb-6">Add Notification</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input name="title" required className="input" />
        </div>
        <div>
          <label className="block text-sm font-medium">Message</label>
          <textarea name="message" required className="input h-24" />
        </div>
        <div>
          <label className="block text-sm font-medium">Send To</label>
          <select name="forRole" className="input">
            <option value="">All Users</option>
            <option value="student">Students Only</option>
            <option value="teacher">Teachers Only</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Specific Mobile No (optional)</label>
          <input name="mobileNo" className="input" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {loading ? "Creating..." : "Add Notification"}
        </button>
      </form>
    </div>
  );
}
