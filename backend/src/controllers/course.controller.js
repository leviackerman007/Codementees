import Course from "../models/course.model.js";

export const createCourse=async (req,res)=>{
    try{
        const course=await Course.create({
            ...req.body,
            createdBy:req.user._id
        });
        res.status(201).json(course);
    }catch(error){
        res.status(500).json({message:"Failed to create course"});
    }
};

export const getCourses=async (req,res)=>{
    try{
        const courses=await Course.find({isPublished:true}).populate("createdBy","name email");
        res.status(200).json(courses);
    }catch(error){
        res.status(500).json({message:"Error fetching courses"});
    }
}