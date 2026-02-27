import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import Enrollment from '../models/enrollment.model.js';

export const getAdminStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalMentors,
            totalAdmins,
            totalCourses,
            publishedCourses,
            totalEnrollments
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'mentor' }),
            User.countDocuments({ role: 'admin' }),
            Course.countDocuments(),
            Course.countDocuments({ isPublished: true }),
            Enrollment.countDocuments()
        ]);

        const latestUsers = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .limit(5);

        const latestCourses = await Course.find()
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            success: true,
            stats: {
                totalUsers,
                totalMentors,
                totalAdmins,
                totalCourses,
                publishedCourses,
                totalEnrollments
            },
            latestUsers,
            latestCourses
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const users = await User.find()
            .select('name email role createdAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit, 10));

        const total = await User.countDocuments();

        res.json({
            success: true,
            users,
            pagination: {
                total,
                page: parseInt(page, 10),
                pages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCourses = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

        const query = {};
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await Course.find(query)
            .populate('createdBy', 'name email role')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit, 10));

        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            courses,
            pagination: {
                total,
                page: parseInt(page, 10),
                pages: Math.ceil(total / parseInt(limit, 10))
            }
        });
    } catch (error) {
        next(error);
    }
};
