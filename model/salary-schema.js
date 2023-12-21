
import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  amount: { type: Number, required: true },
  // Other fields related to salary information
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;