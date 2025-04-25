import mongoose from "mongoose"

const lectureProgressSchema = new mongoose.Schema({
    lectureId: { type: String },
    viewed: { type: Boolean, default: false },
})

const courseProgressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    courseId: {
        type: String
    },
    lectureProgress: [lectureProgressSchema],
    completed: { type: Boolean, default: false },
}, { timestamps: true })


export const CourseProgress = mongoose.model("CourseProgress", courseProgressSchema)
