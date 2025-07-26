import express from 'express';
import AttendanceController from '../Controller/AttendanceController.js';
import EmployeeController from '../Controller/EmployeeController.js';
import SalaryController from '../Controller/SalaryController.js';
import UpadController from '../Controller/UpadController.js';
import SiteController from '../Controller/SiteController.js';

const router = express.Router();

router.get('/attendance/:date', AttendanceController.getAttendanceForDate);
router.post('/attendance/:date', AttendanceController.saveAttendanceForDate);
router.get('/all-employees-attendace/:month', AttendanceController.getAttendanceForMonth);

router.post('/employees', EmployeeController.saveEmployee);
router.get('/employees', EmployeeController.getEmployee);
router.put('/employees/:id', EmployeeController.updateEmployee);
router.delete('/employees/:id', EmployeeController.deleteEmployee);
router.post('/generateSalary', SalaryController.generateSalaryForMonth);

router.get('/upad', UpadController.getAllUpads);
router.post('/upad', UpadController.saveUpad);
router.put('/upad/:id', UpadController.updateUpad);
router.delete('/upad/:id', UpadController.deleteUpad);

router.post('/site', SiteController.createSite);
router.get('/site', SiteController.getSites);
router.get('/site/:id', SiteController.getSite);
router.post('/site/:id/expense', SiteController.addExpense);
router.delete('/site/:siteId/expense/:expId', SiteController.deleteExpense);
router.post('/site/:id/payment', SiteController.addPayment); // NEW

export default router;
