import Course from "../models/course.models.js"
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary'
import fs from 'fs/promises'

const getAllCourses = async (req,res,next) =>{
    const courses = await Course.find({}).select('-lectures');
    res.status(200).json({
        success: true,
        message: 'All Course',
        courses,
    });
}

const getLecturesByCourseId = async (req,res)=>{
    try {
        const {id} = req.params;

        const course = await Course.findById(id);

        if(!course){
            return ne(new AppError("no course found", 400))
        }

        res.status(200).json({
            success: true,
            message: 'course lectures fetched successfully',
             lectures: course.lectures
        });
        
    } catch (error) {
      
            return next(
                new AppError(error.message,500)
            )
        
    }
}

const createCourse = async (req, res, next)=>{
    const {title, description, category, createdBy} = req.body;
    if(!title|| !description|| !category|| !createdBy){
        return next(
            new AppError('all fields are required', 400)
        )
    }

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail: {
            public_id:"dummy",
            secure_url:"dummy"
        }
    });

    if(!course){
        return next(
            new AppError('course could not be created try again', 500)
        )
    }

    if(req.file){
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
            folder:"lms"
        });
        if(result){
            course.thumbnail.public_id = result.public_id;
            course.thumbnail.secure_url=result.secure_url;
        }
        fs.rm(`uploads/${req.file.filename}`);
    }
    await course.save();

    res.status(200).json({
        success: true,
        message: 'course created successfully',
        course
    });
}
const updateCourse = async (req, res, next)=>{
    try {
        const {id} = req.params;
        const course = await Course.findByIdAndUpdate(
            id,
            {
                $set: req.body
            },
            {
                runValidators: true
            }
        )
        if(!course){
            return next(
                new AppError('course with given id does not exist', 400)
            )
        }

        res.status(200).json({
            success:true,
            message:'coures updated successfully',
            course
        })
        
    } catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }
}

const removeCourse = async (req,res, next)=>{
    try {
        const {id} = req.params;
        const course = await Course.findById(id);

        if(!course){
            return next(
                new AppError('course with given id does not exist', 400)
            )
        }
        await Course.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message:'course deleted successfully'
        });
    }catch (e) {
        return next(
            new AppError(e.message, 500)
        )
    }

}

const addLectureToCourseById = async (req,res, next)=>{
    const {title, description} =req.body;
    const {id} = req.params;
    if(!title|| !description){
        return next(
            new AppError('all fields are required', 400)
        )
    }
    const course = await Course.findById(id);
    if(!course){
        return next(
            new AppError('course with given id does not exist', 400)
        )
    }
    const leactureData = {
        title,
        description,
        lecture:{}
    }
    if(req.file){
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder:"lms"
            });
            if(result){
                leactureData.lecture.public_id = result.public_id;
                leactureData.lecture.secure_url=result.secure_url;
            }
            fs.rm(`uploads/${req.file.filename}`);
        } catch (e) {
            return next(
                new AppError(e.message, 400)
            )
        }
    }
    course.lectures.push(leactureData);
    course.numbersOfLectures = course.lectures.length;

    await course.save();

    res.status(200).json({
        success : true,
        message :"lecture is uploaded successfully",
        leactureData
    })
}


export {
    getAllCourses,
    getLecturesByCourseId,
    createCourse,
    updateCourse,
    removeCourse,
    addLectureToCourseById
}