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
      const { name, employeeType, dailySalary } = req.body;
      const newEmployee = new Employee({ name, employeeType, dailySalary });
      await newEmployee.save();
      res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },  

  async updateEmployee(req, res) {
    try {
      const { id } = req.params;
      const { name, employeeType, dailySalary } = req.body;
      const updated = await Employee.findByIdAndUpdate(
        id,
        { name, employeeType, dailySalary },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Employee not found' });
      res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  async deleteEmployee(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Employee.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ message: 'Employee not found' });
      res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }


};

export default EmployeeController;
