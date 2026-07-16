import Course from '../models/course.model.js';
import User from '../models/user.model.js';
import Enrollment from '../models/enrollment.model.js';
import Settings from '../models/settings.model.js';

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

export const getRecentEnrollments = async (req, res, next) => {
    try {
        const { limit = 20 } = req.query;

        const enrollments = await Enrollment.find()
            .populate('user', 'name email role createdAt')
            .populate('course', 'title createdAt')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit, 10));

        res.json({
            success: true,
            enrollments,
        });
    } catch (error) {
        next(error);
    }
};

export const assignCourse = async (req, res, next) => {
    try {
        const { userId, courseId, dueDate } = req.body;

        if (!userId || !courseId) {
            return res.status(400).json({ success: false, message: 'userId and courseId are required.' });
        }

        const [user, course] = await Promise.all([
            User.findById(userId),
            Course.findById(courseId),
        ]);

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

        // Prevent duplicate enrollment
        const existing = await Enrollment.findOne({ user: userId, course: courseId });
        if (existing) {
            return res.status(409).json({ success: false, message: 'User is already enrolled in this course.' });
        }

        const enrollment = await Enrollment.create({
            user: userId,
            course: courseId,
            dueDate: dueDate || null,
            assignedByAdmin: true,
            paymentStatus: 'completed',
        });

        res.status(201).json({ success: true, message: 'Course assigned successfully.', enrollment });
    } catch (error) {
        next(error);
    }
};

export const getSystemPrompt = async (req, res, next) => {
    try {
        const settings = await Settings.findOne({ key: 'global' });
        const prompt = settings?.aiSystemPrompt || '';
        res.json({ success: true, aiSystemPrompt: prompt });
    } catch (error) {
        next(error);
    }
};

export const updateSystemPrompt = async (req, res, next) => {
    try {
        const { aiSystemPrompt } = req.body;
        if (typeof aiSystemPrompt !== 'string') {
            return res.status(400).json({ success: false, message: 'aiSystemPrompt must be a string.' });
        }

        const settings = await Settings.findOneAndUpdate(
            { key: 'global' },
            { aiSystemPrompt, lastUpdatedBy: req.user._id },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({ success: true, message: 'AI system prompt updated.', aiSystemPrompt: settings.aiSystemPrompt });
    } catch (error) {
        next(error);
    }
};
