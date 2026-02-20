import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        duration: { 
            type: String, 
            required: true 
        },
        level: { 
            type: String, 
            required: true,
            enum: ["Beginner", "Intermediate", "Advanced"]
        },
        techStack: [
            {
                type: String,
                required: true
            }
        ],
        includes: [
            {
                type: String,
                required: true
            }
        ],

        price: {
            type: Number,
            required: true,
        },
        createdBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model('Course', courseSchema);