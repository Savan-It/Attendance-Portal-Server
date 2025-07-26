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

  async getAllUpads(req, res) {
    try {
      const upads = await Upad.find().populate('employeeId', 'name');
      res.status(200).json(upads);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch upad data' });
    }
  },

  async updateUpad(req, res) {
    try {
      const { id } = req.params;
      const { employeeId, amount, date } = req.body;
      await Upad.findByIdAndUpdate(id, { employeeId, amount, date });
      res.status(200).json({ message: 'Upad updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update upad' });
    }
  },

  async deleteUpad(req, res) {
    try {
      const { id } = req.params;
      await Upad.findByIdAndDelete(id);
      res.status(200).json({ message: 'Upad deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete upad' });
    }
  }

};

export default UpadController;
