import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
    question: String,
    answer: String,
    difficulty: String,
    feedback: String,
    timelimit: Number,
    timeTaken:Number,
    score: {
        type: Number,
        default: 0
    },
    confidence: {
        type: Number,
        default: 0
    },
    communication: {
        type: Number,
        default: 0
    },
    correctness: {
        type: Number,
        default: 0
    },
})

const interviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    role: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ["Case-study", "Technical", "Behavioral"],
        required: true
    },
    resumeText: {
        type: String
    },
    questions:[questionSchema],
    totalTimeTaken:Number,
    finalScore:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:["complete","incomplete"],
        default:'incomplete'
    }

}, { timestamps: true });

const Interview = mongoose.model("Interview", interviewSchema)

export default Interview