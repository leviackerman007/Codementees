import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";

const validateCourse = (data) => {
    const errors = [];
    if (!data.title?.trim()) errors.push("Title is required");
    if (!data.description?.trim()) errors.push("Description is required");
    if (typeof data.price !== "number" || data.price < 0) {
        errors.push("Valid price is required");
    }
    if (!Array.isArray(data.techStack) || data.techStack.length === 0) {
        errors.push("Tech stack is required")
    }
    return errors;
}

export const getCourses = async (req, res, next) => {
    try {
        const { search, techStack, page = 1, limit = 10 } = req.query;

        let query = { isPublished: true };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        }

        if (techStack) {
            const techArray = Array.isArray(techStack) ? techStack : [techStack];
            query.techStack = { $in: techArray };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const courses = await Course.find(query).populate("createdBy", "name email").sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit));

        const total = await Course.countDocuments(query);

        res.json({ success: true, courses, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
    } catch (error) {
        next(error);
    }
};

export const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate("createdBy", "name email");
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        res.json({ success: true, course });
    } catch (error) {
        next(error)
    }
}

export const createCourse = async (req, res, next) => {
    try {
        const errors = validateCourse(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation failed", errors })
        }
        const course = await Course.create({
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            duration: req.body.duration,
            level: req.body.level,
            techStack: req.body.techStack,
            includes: req.body.includes,
            price: req.body.price,
            createdBy: req.user._id,
            isPublished: false
        })
        res.status(201).json({ success: true, message: "Course created successfully", course });
    } catch (error) {
        next(error);
    }
};


export const getMyCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        next(error);
    }
};

export const updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id)
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this course" })
        }
        const errors = validateCourse(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, message: "Validation failed", errors })
        }
        course = await Course.findByIdAndUpdate(req.params.id, {
            title: req.body.title.trim(),
            description: req.body.description.trim(),
            duration: req.body.duration,
            level: req.body.level,
            techStack: req.body.techStack,
            includes: req.body.includes,
            price: req.body.price
        }, { new: true, runValidators: true })

        res.json({
            success: true, message: "Course updated successfully", course
        })

    } catch (error) {
        next(error);
    }
}

export const deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this course" })
        }

        await Course.findByIdAndDelete(req.params.id);
        await Enrollment.deleteMany({ course: req.params.id });

    } catch (error) {
        next(error);
    }
};

export const togglePublishedCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }
        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }
        course.isPublished = !course.isPublished;
        await course.save();
        res.json({ success: true, message:`Course ${course.isPublished ? 'published' : 'unpublished'} successfully`, course });
    } catch (error) {
        next(error);
    }
}


// STUDENT ENDPOINT ENROLL STUDENTS IN COURSE

export const enrollCourse= async(req,res,next)=>{
    try{
        const courseId=req.params.id;

        const course=await Course.findById(courseId);
        if(!course){
            return res.status(404).json({success:false,message:"Course not found"});
        }

        const existingEnrollment=await Enrollment.findOne({
            user:req.user._id,
            course:courseId
        })

        if(existingEnrollment){
            return res.status(400).json({success:false,message:"You are already enrolled in this course"});
        }

        const enrollment=await Enrollment.create({
            user:req.user._id,
            course:courseId,
            enrolledAt:new Date(),
            paymentStatus:"completed"
        })

        res.status(201).json({success:true,message:"Successfully enrolled in course",enrollment});
    }catch(error){
        next(error);
    }
}

export const getEnrolledCourses=async(req,res,next)=>{
    try{
        const enrollments=await Enrollment.find({user:req.user._id}).populate({
            path:"course",
            populate:{path:"createdBy",select:"name email"}
        })
        res.json({success:true,enrollments});
    }catch(error){
        next(error);
    }
}