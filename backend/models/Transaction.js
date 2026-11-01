
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },

    category: {
      type: String,
      default: "",
      trim: true,
      required: function () {
        return this.type === "expense";
      },
    },

    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value) {
          if (!value) return true;

          const selectedDate = new Date(value);
          const today = new Date();

          selectedDate.setHours(0, 0, 0, 0);
          today.setHours(0, 0, 0, 0);

          return selectedDate <= today;
        },
        message: "Transaction date cannot be in the future.",
      },
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
