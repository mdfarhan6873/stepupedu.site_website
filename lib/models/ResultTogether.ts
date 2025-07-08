import mongoose, { Schema, models, model } from 'mongoose';

const ResultTogetherSchema = new Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default models.ResultTogether || model('ResultTogether', ResultTogetherSchema);
