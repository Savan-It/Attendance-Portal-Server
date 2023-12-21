// upadModel.js
import mongoose from 'mongoose';

const upadSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // Reference to Employee model
  amount: { type: Number, required: true },
});

const Upad = mongoose.model('Upad', upadSchema);

export default Upad;
