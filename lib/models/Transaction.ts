import mongoose, { Schema, model, models } from "mongoose";

export interface ITransaction {
  _id?: string;
  title: string;
  amount: number;
  type: "income" | "outcome";
  category?: string;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be positive"],
    },
    type: {
      type: String,
      enum: ["income", "outcome"],
      required: [true, "Type is required"],
    },
    category: {
      type: String,
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = models.Transaction || model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
