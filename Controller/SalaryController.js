import Attendance from '../model/attendance-schema.js';
import Employee from '../model/employee-schema.js';
import Upad from '../model/upad-schema.js'; // Import the Upad model

const SalaryController = {
  async generateSalaryForMonth(req, res) {
    try {
      const { month } = req.body; // Assuming the frontend sends the selected month (YYYY-MM)

      // Retrieve attendance records for the given month
      const year = parseInt(month.split('-')[0]);
      const startMonth = parseInt(month.split('-')[1]);
      const startDate = new Date(year, startMonth - 1, 1); // Start of the month
      const endDate = new Date(year, startMonth, 0); // End of the month

      const attendanceData = await Attendance.find({
        date: { $gte: startDate, $lte: endDate },
      });

      // Retrieve all employees
      const employees = await Employee.find();

      let salaryReport = [];

      // Calculate salary based on attendance data and employee type
      for (const employee of employees) {
        const employeeAttendance = attendanceData.filter(
          (record) => record.attendanceRecords.some((rec) => rec.employee === employee._id.toString())
        );

        const upadData = await Upad.find({
          date: { $gte: startDate, $lte: endDate },
          employeeId: employee._id,
        });

        let totalSalary = 0;
        let presentDay = 0;
        let upadDates = []; // Array to store Upad dates for the employee

        for (const record of employeeAttendance) {
          const presentDays = record.attendanceRecords.filter(
            (rec) => rec.employee === employee._id.toString() && rec.status === 'Present'
          ).length;

          const employeeType = employee.employeeType;
          const dailyRate = employeeType === 'laborer' ? 450 : 550;
          presentDay += presentDays;
          totalSalary += presentDays * dailyRate;
        }

        // Include Upad data for the employee
        let totalUpadAmount = 0;
        for (const upad of upadData) {
          totalUpadAmount += upad.amount;
          upadDates.push(upad.date); // Add Upad dates for the employee
        }

        salaryReport.push({
          employeeName: employee.name,
          totalSalary,
          presentDay,
          totalUpadAmount,
          upadDates, // Add Upad dates for the employee to the report
        });
      }

      res.status(200).json({ salaryReport });
    } catch (error) {
      console.error('Error generating salary:', error.message);
      res.status(500).json({ message: error.message });
    }
  },
};

export default SalaryController;
