import mongoose from 'mongoose'
import { Lecture } from '../models/lecture.model.js';
import { Course } from '../models/course.model.js'
import { deleteVideoFromCloudinary, uploadMedia } from '../utils/cloudinary.js';
import { deleteLectureById } from '../utils/deleteLectureById.js';


export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const courseId = req.params.courseId;

        // checking if anything is missing or not
        if (!lectureTitle) {
            return res.status(400).json({
                success: false,
                message: "Lecture Title is required"
            })
        }
        const lecture = await Lecture.create({
            lectureTitle,
        })

        const course = await Course.findById(courseId);

        if (!course) {
            await Lecture.findByIdAndDelete(lecture._id);
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }

        course.lectures.push(lecture._id);
        await course.save();

        return res.status(201).json({
            success: true,
            message: "Lecture created successfully",
            lecture
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while creating the lecture"
        })

    }

}

export const getAllLectures = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).populate("lectures");

        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course not found"
            })
        }
        const lectures = course.lectures || [];

        return res.status(200).json({
            success: true,
            message: "Lectures fetched successfully",
            lectures
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while getting the lectures"
        })
    }
}
export const updateLecture = async (req, res) => {
    try {
        const { lectureTitle, isPreviewFree } = req.body;
        const { lectureId } = req.params;
        const video = req.file;
        console.log(video);
        console.log(lectureTitle);


        if (!lectureTitle) {
            return res.status(401).json({
                message: "Lecture title is required",
                succes: false
            })
        }
        const lecture = await Lecture.findById(lectureId);

        if (!video) {
            return res.status(401).json({
                message: "Video is required",
                success: false
            })
        }

        // deleteing the old video on cloudinary and updating new
        if (lecture.videoUrl) {
            try {
                const publiId = lecture.videoUrl.split('/').pop().split('.')[0];

                await deleteVideoFromCloudinary(publiId);
            } catch (error) {
                console.log(error)
                return res.status(401).json({
                    message: "Error occured while deleting the old video",
                    success: false
                })

            }
        }
        const response = await uploadMedia(video.path);
        const updatedVideoUrl = response.secure_url;
        const videoPublicId = response.public_id

        const updatedLecture = await Lecture.findByIdAndUpdate(lectureId, {
            lectureTitle,
            videoUrl: updatedVideoUrl,
            isPreviewFree
        }, { new: true })

        return res.status(200).json({
            message: "Lecture updated successfully",
            success: true,
            updatedLecture
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while updating the lectures"
        })
    }
}

export const deleteLecture = async (req, res) => {
    try {
        const { courseId, lectureId } = req.params;
        console.log(lectureId);
        
        await deleteLectureById(courseId, lectureId)

        return res.status(200).json({
            message: "Lecture is deleted succesfully",
            success: true
        })

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Error occured while deleting the lecture"
        })

    }

}

