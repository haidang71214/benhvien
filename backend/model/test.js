import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g. 'CT scan', 'Blood test'
  description: { type: String },
  price: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Test = mongoose.model('Test', testSchema);
export default Test;
