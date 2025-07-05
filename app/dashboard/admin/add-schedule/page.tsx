"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Helper types for form state
interface Period {
  startTime: string;
  endTime: string;
  subject: string;
  teacherName: string;
}
interface DaySchedule {
  day: string;
  periods: Period[];
}

const WEEK_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function AddSchedule() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [week, setWeek] = useState<DaySchedule[]>(
    [{ day: "Monday", periods: [{ startTime: "", endTime: "", subject: "", teacherName: "" }] }]
  );

  // Add a new day
  const addDay = () => {
    setWeek([
      ...week,
      { day: "", periods: [{ startTime: "", endTime: "", subject: "", teacherName: "" }] },
    ]);
  };

  // Remove a day
  const removeDay = (dayIdx: number) => {
    setWeek(week.filter((_, idx) => idx !== dayIdx));
  };

  // Update day name
  const updateDayName = (dayIdx: number, value: string) => {
    setWeek(
      week.map((d, idx) => (idx === dayIdx ? { ...d, day: value } : d))
    );
  };

  // Add a period to a day
  const addPeriod = (dayIdx: number) => {
    setWeek(
      week.map((d, idx) =>
        idx === dayIdx
          ? { ...d, periods: [...d.periods, { startTime: "", endTime: "", subject: "", teacherName: "" }] }
          : d
      )
    );
  };

  // Remove a period from a day
  const removePeriod = (dayIdx: number, periodIdx: number) => {
    setWeek(
      week.map((d, idx) =>
        idx === dayIdx
          ? { ...d, periods: d.periods.filter((_, pIdx) => pIdx !== periodIdx) }
          : d
      )
    );
  };

  // Update a period field
  const updatePeriod = (dayIdx: number, periodIdx: number, field: keyof Period, value: string) => {
    setWeek(
      week.map((d, idx) =>
        idx === dayIdx
          ? {
              ...d,
              periods: d.periods.map((p, pIdx) =>
                pIdx === periodIdx ? { ...p, [field]: value } : p
              ),
            }
          : d
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // Validate
    if (!className.trim() || !section.trim()) {
      toast.error("Class and Section are required");
      setLoading(false);
      return;
    }
    if (week.length === 0) {
      toast.error("At least one day is required");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class: className, section, week }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create schedule");
      }
      toast.success("Schedule created successfully!");
      setClassName("");
      setSection("");
      setWeek([{ day: "Monday", periods: [{ startTime: "", endTime: "", subject: "", teacherName: "" }] }]);
    } catch (error: any) {
      toast.error(error.message || "Failed to create schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded shadow">
      <button onClick={() => router.back()} className="mb-4 text-blue-600 hover:underline">&larr; Back</button>
      <h2 className="text-xl font-bold mb-6">Add Class Schedule</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Class</label>
            <input name="class" value={className} onChange={e => setClassName(e.target.value)} required className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">Section</label>
            <input name="section" value={section} onChange={e => setSection(e.target.value)} required className="input" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Weekly Schedule</label>
          {week.map((day, dayIdx) => (
            <div key={dayIdx} className="border rounded p-4 mb-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <select
                  className="input"
                  value={day.day}
                  onChange={e => updateDayName(dayIdx, e.target.value)}
                  required
                >
                  <option value="">Select Day</option>
                  {WEEK_DAYS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeDay(dayIdx)} className="text-red-500 text-xs ml-2">Remove Day</button>
              </div>
              {day.periods.map((period, periodIdx) => (
                <div key={periodIdx} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2 items-end">
                  <div>
                    <label className="block text-xs font-medium">Start Time</label>
                    <input type="time" className="input" value={period.startTime} onChange={e => updatePeriod(dayIdx, periodIdx, "startTime", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">End Time</label>
                    <input type="time" className="input" value={period.endTime} onChange={e => updatePeriod(dayIdx, periodIdx, "endTime", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Subject</label>
                    <input className="input" value={period.subject} onChange={e => updatePeriod(dayIdx, periodIdx, "subject", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium">Teacher</label>
                    <input className="input" value={period.teacherName} onChange={e => updatePeriod(dayIdx, periodIdx, "teacherName", e.target.value)} required />
                  </div>
                  <button type="button" onClick={() => removePeriod(dayIdx, periodIdx)} className="text-red-500 text-xs">Remove</button>
                </div>
              ))}
              <button type="button" onClick={() => addPeriod(dayIdx)} className="text-blue-600 text-xs mt-2">+ Add Period</button>
            </div>
          ))}
          <button type="button" onClick={addDay} className="text-blue-600 text-sm">+ Add Day</button>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">
          {loading ? "Creating..." : "Add Schedule"}
        </button>
      </form>
    </div>
  );
}
