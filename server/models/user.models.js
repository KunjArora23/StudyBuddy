import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }, 
  photoUrl: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Student", "Instrutor"],
    default: "Student",
  },
  enrolledCourses: [
    {
      type: Schema.Types.ObjectId,
      ref: "course",
    },
  ],
},{timestamps:true});

export const User = mongoose.model("User", userSchema);
