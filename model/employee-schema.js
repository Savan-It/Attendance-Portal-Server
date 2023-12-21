
import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeType: { type: String, required: true },
  // other fields
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;