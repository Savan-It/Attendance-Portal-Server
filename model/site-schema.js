import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
});

const clientPaymentSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
});

const siteSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  clientPayments: [clientPaymentSchema],
  expenses: [expenseSchema],
}, { timestamps: true });

const Site = mongoose.model('Site', siteSchema);
export default Site;
