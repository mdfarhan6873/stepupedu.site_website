"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddTeacher() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/users/teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create teacher");
      }
      toast.success("Teacher created successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-xl font-bold mb-6">Add Teacher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input name="name" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Mobile No</label>
            <input name="mobileNo" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input name="password" type="password" required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input name="address" required className="input" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Subjects (e.g. Math[6,7,8], Science[6,7])</label>
            <input name="subjects" required className="input" />
          </div>
        </div>
        <input type="hidden" name="role" value="teacher" />
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {loading ? "Creating..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
}
