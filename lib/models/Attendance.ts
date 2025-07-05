import mongoose from 'mongoose';

const StudentAttendanceSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  rollNo: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'leave'], required: true },
});

const AttendanceEntrySchema = new mongoose.Schema({
  date: { type: String, required: true }, // e.g. '2025-07-05'
  class: { type: String, required: true },
  section: { type: String, required: true },
  subject: { type: String, required: true },
  students: [StudentAttendanceSchema],
});

const AttendanceSchema = new mongoose.Schema({
  year: { type: String, required: true },
  month: { type: String, required: true },
  entries: [AttendanceEntrySchema],
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
