// UpadController.js
import Upad from '../model/upad-schema.js'; // Import the Upad model

const UpadController = {
  async saveUpad(req, res) {
    try {
      const { date, employeeId, amount } = req.body;

      const newUpad = new Upad({
        date,
        employeeId,
        amount,
      });

      await newUpad.save();

      res.status(201).json({ message: 'Upad data saved successfully' });
    } catch (error) {
      console.error('Error saving Upad data:', error.message);
      res.status(500).json({ error: 'Unable to save Upad data' });
    }
  },
};

export default UpadController;
