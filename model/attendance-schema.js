import mongoose from 'mongoose'

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  attendanceRecords: [
    {
      employee: { type: String, required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
  ],
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;