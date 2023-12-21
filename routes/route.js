import express from 'express';
import AttendanceController from '../Controller/AttendanceController.js';
import EmployeeController from '../Controller/EmployeeController.js';
import SalaryController from '../Controller/SalaryController.js'; // Import the SalaryController
import UpadController from '../Controller/UpadController.js'; // Import the UpadController


const router = express.Router();

router.get('/attendance/:date', AttendanceController.getAttendanceForDate);
router.post('/attendance/:date', AttendanceController.saveAttendanceForDate);
router.post('/employees', EmployeeController.saveEmployee);
router.get('/employees', EmployeeController.getEmployee);
router.post('/generateSalary', SalaryController.generateSalaryForMonth); 
router.post('/upad', UpadController.saveUpad); // Route to save Upad data
router.get('/all-employees-attendace/:month', AttendanceController.getAttendanceForMonth); // Route to save Upad data
export default router;
