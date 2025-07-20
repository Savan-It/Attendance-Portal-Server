import Attendance from '../model/attendance-schema.js';
import Employee from '../model/employee-schema.js';
import Upad from '../model/upad-schema.js';

const SalaryController = {
  async generateSalaryForMonth(req, res) {
    try {
      const { month } = req.body; // Format: YYYY-MM

      const year = parseInt(month.split('-')[0]);
      const startMonth = parseInt(month.split('-')[1]);
      const startDate = new Date(year, startMonth - 1, 1);
      const endDate = new Date(year, startMonth, 0);

      const attendanceData = await Attendance.find({
        date: { $gte: startDate, $lte: endDate },
      });

      const employees = await Employee.find();
      let salaryReport = [];

      for (const employee of employees) {
        const employeeAttendance = attendanceData.filter((record) =>
          record.attendanceRecords.some((rec) => rec.employee === employee._id.toString())
        );

        const upadData = await Upad.find({
          date: { $gte: startDate, $lte: endDate },
          employeeId: employee._id,
        });

        let totalSalary = 0;
        let presentDay = 0;
        let halfDayCount = 0;
        let fullDayCount = 0;
        let upadDates = [];
        const dailyRate = employee.dailySalary;

        for (const record of employeeAttendance) {
          for (const rec of record.attendanceRecords) {
            if (rec.employee === employee._id.toString()) {
              if (rec.status === 'Present') {
                fullDayCount += 1;
              } else if (rec.status === 'Half') {
                halfDayCount += 1;
              }
            }
          }
        }

        presentDay = fullDayCount + halfDayCount * 0.5;
        totalSalary = (fullDayCount * dailyRate) + (halfDayCount * (dailyRate / 2));

        let totalUpadAmount = 0;
        for (const upad of upadData) {
          totalUpadAmount += upad.amount;
          upadDates.push(upad.date);
        }

        salaryReport.push({
          employeeName: employee.name,
          fullDayCount,
          halfDayCount,
          presentDay,
          totalSalary,
          totalUpadAmount,
          upadDates,
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
