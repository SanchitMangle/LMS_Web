import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { typr: String, required: true },
    name: { typr: String, required: true },
    email: { typr: String, required: true },
    imageUrl: { typr: String, required: true },
    enrolledCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User