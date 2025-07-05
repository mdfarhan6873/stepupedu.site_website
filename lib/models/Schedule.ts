import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  class: { type: String, required: true },
  section: { type: String, required: true },
  week: [
    {
      day: { type: String, required: true },
      periods: [
        {
          startTime: String,
          endTime: String,
          subject: String,
          teacherName: String
        }
      ]
    }
  ]
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
