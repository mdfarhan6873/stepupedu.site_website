import mongoose from 'mongoose';

const SubjectAttendanceSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
  ],
});

const AttendanceSchema = new mongoose.Schema(
  {
    class: { type: String, required: true },
    section: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    subjects: [SubjectAttendanceSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model('Attendance', AttendanceSchema);
