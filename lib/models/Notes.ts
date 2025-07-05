import mongoose from 'mongoose';

const NotesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  url: { type: String }
}, { timestamps: true });

export default mongoose.models.Notes || mongoose.model('Notes', NotesSchema);
