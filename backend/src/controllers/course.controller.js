import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
    try {
        const course = await Course.create({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Failed to create course" });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("createdBy", "name email");
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses" });
    }
}

export const getMyCourses = async (req, res) => {
    try{
        const courses=await Course.find({createdBy:req.user._id})
        res.status(200).json(courses);
    }catch(error){
        res.status(500).json({message:"Failed to fetch your courses"})
    }
};

export const togglePublisherCourse = async (req,res) => {
    try{
        const course = await Course.findOne({_id:req.params.id, createdBy:req.user._id});

        if(!course){
            return res.status(404).json({message:"Course not found"});
        }
        course.isPublished = !course.isPublished;
        await course.save();
        res.json(course); 
    }catch(error){
        res.status(500).json({message:"Failed to update course status"})
    }
}

export const deleteCourse= async(req,res)=>{
    try {const course=await Course.findOneAndDelete({_id:req.params.id, createdBy:req.user._id});
    if(!course){
        return res.status(404).json({message:"Course not found"});
    }

    res.json({message:"Course deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Delete failed"})
    }
};

