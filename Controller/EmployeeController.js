import Employee from '../model/employee-schema.js';

const EmployeeController = {
    async getEmployee(req, res) {
        try {
          const employees = await Employee.find(); // Retrieve all employees
          res.status(200).json(employees); // Send the employees as a JSON response
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
async saveEmployee (req, res) {
    try {
      const { name, employeeType /* other fields */ } = req.body;
      const newEmployee = new Employee({ name, employeeType /* other fields */ });
      await newEmployee.save();
      res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

export default EmployeeController;
