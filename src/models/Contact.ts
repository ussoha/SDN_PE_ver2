import mongoose from "mongoose"

const ContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    phone: {
      type: String,
      trim: true,
    },
    group: {
      type: String,
      enum: ["Friends", "Work", "Family"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent re-compilation during development
const Contact = mongoose.models.Contact || mongoose.model("Contact", ContactSchema)

export default Contact
