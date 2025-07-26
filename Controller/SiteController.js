import Site from '../model/site-schema.js';
import Attendance from '../model/attendance-schema.js';
import Employee from '../model/employee-schema.js';

const SiteController = {
  async createSite(req, res) {
    try {
      const { name, clientPayment } = req.body;
      const newSite = new Site({
        name,
        clientPayments: [{ date: new Date(), amount: clientPayment }],
        expenses: []
      });
      await newSite.save();
      res.status(201).json(newSite);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getSites(req, res) {
    try {
      const sites = await Site.find();

      const enrichedSites = await Promise.all(
        sites.map(async site => {
          const attendances = await Attendance.find({ 'attendanceRecords.site': site._id });

          const siteRecords = attendances.flatMap(att =>
            att.attendanceRecords.filter(r => r.site?.toString() === site._id.toString())
          );

          const empDays = {};
          for (let record of siteRecords) {
            const id = record.employee.toString();
            const isHalf = record.status === 'Half';
            if (!empDays[id]) empDays[id] = 0;
            empDays[id] += isHalf ? 0.5 : 1;
          }

          const employees = await Employee.find({ _id: { $in: Object.keys(empDays) } });

          const manpower = employees.map(emp => {
            const totalDays = empDays[emp._id.toString()];
            const totalCost = totalDays * emp.dailySalary;
            return {
              name: emp.name,
              days: totalDays,
              total: totalCost
            };
          });

          return { ...site.toObject(), manpower };
        })
      );

      res.json(enrichedSites);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async getSite(req, res) {
    try {
      const site = await Site.findById(req.params.id);
      if (!site) return res.status(404).json({ message: 'Not found' });

      const attendances = await Attendance.find({ 'attendanceRecords.site': site._id });

      const siteRecords = attendances.flatMap(att =>
        att.attendanceRecords.filter(r => r.site?.toString() === site._id.toString())
      );

      const empDays = {};
      for (let record of siteRecords) {
        const id = record.employee.toString();
        const isHalf = record.status === 'Half';
        if (!empDays[id]) empDays[id] = 0;
        empDays[id] += isHalf ? 0.5 : 1;
      }

      const employees = await Employee.find({ _id: { $in: Object.keys(empDays) } });

      const manpower = employees.map(emp => {
        const totalDays = empDays[emp._id.toString()];
        const totalCost = totalDays * emp.dailySalary;
        return {
          name: emp.name,
          days: totalDays,
          total: totalCost
        };
      });

      res.json({ ...site.toObject(), manpower });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async addExpense(req, res) {
    try {
      const { id } = req.params;
      const { date, type, amount } = req.body;
      const site = await Site.findById(id);
      site.expenses.push({ date, type, amount });
      await site.save();
      res.json(site);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deleteExpense(req, res) {
    try {
      const { siteId, expId } = req.params;
      const site = await Site.findById(siteId);
      site.expenses.id(expId).remove();
      await site.save();
      res.json(site);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async addPayment(req, res) {
    try {
      const { id } = req.params;
      const { date, amount } = req.body;
      const site = await Site.findById(id);
      site.clientPayments.push({ date, amount });
      await site.save();
      res.json(site);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async deletePayment(req, res) {
    try {
      const { siteId, paymentId } = req.params;
      const site = await Site.findById(siteId);
      site.clientPayments.id(paymentId).remove();
      await site.save();
      res.json(site);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

export default SiteController;
