import Attendance from '../model/attendance-schema.js';
import Employee from '../model/employee-schema.js'; // Import Employee model or adjust as per your schema

const AttendanceController = {
  async getAttendanceForMonth(req, res) {
    try {
      const { month } = req.params; // Get month from request parameters

      // Parse the month string to get the year and month
      const year = parseInt(month.split('-')[0]);
      const startMonth = parseInt(month.split('-')[1]);
      const startDate = new Date(year, startMonth - 1, 1); // Start of the month
      const endDate = new Date(year, startMonth, 0); // End of the month

      // Fetch attendance data within the specified date range
      const attendanceData = await Attendance.find({
        date: { $gte: startDate, $lte: endDate },
      });

      const formattedData = [];

      // Iterate through each date in the month
      for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDateData = {
          date: currentDate.toISOString().slice(0, 10), // Format date as 'YYYY-MM-DD'
          attendanceRecords: [],
        };

        // Find attendance data for the current date
        const currentDateAttendance = attendanceData.find(data =>
          data.date.toISOString().slice(0, 10) === currentDateData.date
        );

        if (currentDateAttendance) {
          // Process attendance records for the current date
          for (const record of currentDateAttendance.attendanceRecords) {
            const employee = await Employee.findById(record.employee); // Assuming employee ID is stored in record.employee
            if (employee) {
              currentDateData.attendanceRecords.push({
                employee: employee.name, // Change 'name' to your employee name field in the schema
                status: record.status
              });
            }
          }
        }

        formattedData.push(currentDateData);
      }

      res.status(200).json(formattedData);
    } catch (error) {
      console.error('Error fetching attendance:', error.message);
      res.status(500).json({ message: error.message });
    }
  },
  
  async getAttendanceForDate(req, res) {
    try {
      const date = req.params.date; // Get date from request params
      const attendance = await Attendance.findOne({ date });
      if (!attendance) {
        return res.status(404).json({ message: 'Attendance data not found for this date' });
      }
      res.status(200).json(attendance.attendanceRecords);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async saveAttendanceForDate(req, res) {
    try {
      const date = req.params.date;
      const attendanceData = req.body;
      
      let existingAttendance = await Attendance.findOne({ date });

      if (!existingAttendance) {
        // If attendance data doesn't exist for the specified date, create a new document
        existingAttendance = new Attendance({ date, attendanceRecords: attendanceData });
        await existingAttendance.save();
        res.status(200).json({ message: 'New attendance data created for ' + date });
      } else {
        // If attendance data exists for the date, update the attendance records
        existingAttendance.attendanceRecords = attendanceData;
        await existingAttendance.save();
        res.status(200).json({ message: 'Attendance data updated for ' + date });
      }
    } catch (error) {
      console.error('Error saving attendance:', error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

export default AttendanceController;
