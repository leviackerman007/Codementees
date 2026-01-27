import mongoose from 'mongoose';

const courseSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
        },

        decription:{
            type:String,
            required:true,
        },

        duration:String,
        level:String,
        techStack:[String],
        includes:[String],

        price:{
            type:Number,
            required:true,
        },

        isPublished:{
            type:Boolean,
            default:false,
        },
    },
    {timestamps:true}
);

export default mongoose.model('Course',courseSchema);