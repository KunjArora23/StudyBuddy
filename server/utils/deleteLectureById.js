import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "./cloudinary.js";

export const deleteLectureById = async (courseId, lectureId) => {
    
        const course = await Course.findById(courseId);
        if (!course) throw new Error("Course not found");
        console.log(lectureId)
        const lecture = await Lecture.findByIdAndDelete(lectureId.toString());
        if (!lecture) throw new Error("Lecture not found");



        if (lecture.videoUrl) {
            const publiId = lecture.videoUrl.split('/').pop().split('.')[0];
            await deleteVideoFromCloudinary(publiId);
        }

        course.lectures = course.lectures.filter((lecture) => lecture._id.toString() !== lectureId.toString())

        await course.save();

}