import fs from 'fs'
import * as pdfjsLIb from 'pdfjs-dist/legacy/build/pdf.mjs'
import { askAI } from '../services/openRouterServices.js';
import User from '../models/userModel.js'
import Interview from '../models/interviewModel.js';
// import { json } from 'stream/consumers';

// ANALYSE RESUME USING AI:
export const analyseResume = async (req, res) => {
    try {
        const userId = req.userId;
        if(!userId){
            return res.json("user does not have a token")
        }
        const user = await User.findById(userId)
        if(!user){
            return res.json("user does not exist.")
        }
        if (!req.file) {
            return res.json("resume required.")
        }
        const filePath = req.file.path;
        const fileBuffer = await fs.promises.readFile(filePath)
        const uintarray = new Uint8Array(fileBuffer)

        const loadingTask = pdfjsLIb.getDocument({ data: uintarray });
        const pdf = await loadingTask.promise;

        let resumeText = ""

        console.log("Pages:", pdf.numPages); //remove

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items.map(item => ('str' in item ? item.str : '')).join(" ");
            resumeText += pageText + "\n";
        }

        resumeText = resumeText.replace(/\s+/g, " ").trim();

        const messages = [
            {
                role: 'system',
                content: `
Extract structured data from resume.

STRICT RULES:
- Return ONLY valid JSON
- No explanation, no text, no markdown
- If field missing, return empty string or empty array

Format:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const AIresponse = await askAI(messages);
        let parseData;

        try {
            parseData = JSON.parse(AIresponse);
        } catch (err) {
            console.log("Raw AI response:", AIresponse);
            throw new Error("Invalid JSON from AI");
        }

        fs.unlinkSync(filePath)

        return res.json({
            role: parseData.role,
            experience: parseData.experience,
            projects: parseData.projects,
            skills: parseData.skills,
            resumeText
        });

    } catch (error) {
        console.log("AnalyseResume error: ", error)

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        return res.json(error)
    }
}
// GENERATE QUESTIONS USING AI:
export const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;
        console.log(req.body)
        role = role.trim();
        experience = experience.trim();
        mode = mode.trim();
        if (!role || !experience || !mode) {
            return res.json("Role experience and mode are required.")
        }
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json("User does not exist.")
        }
        if (user.credits < 50) {
            return res.json("User does not have enough credits.")
        }
        const saferesumeText = resumeText?.trim() || "none";
        const safeProjects = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
        const safeSkills = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

        const userPrompt = `
        Role: ${role},
        experience: ${experience},
        interview mode: ${mode},
        projects: ${safeProjects},
        skills: ${safeSkills},
        resume text : ${saferesumeText},
        ` ;
        if (!userPrompt.trim()) {
            return json("User prompt is missing or empty.")
        }

        const systemPrompt = [
            {
                role: "system",
                content: `You are a human interviewer conducting a real interview.

Speak in simple, natural, conversational English like you are directly talking to a candidate. Do not sound like an AI.

You will receive candidate details including role, interview mode, experience, projects, skills, and resume.

Your task:
- Carefully understand the candidate profile.
- Generate exactly 5 interview questions.
- Questions must be relevant to the role and experience level.
- Adjust questions based on the interview mode (technical / behavioral / case-study).
- Use candidate's projects, skills, or resume to make questions feel personalized.
- Keep a realistic, practical interview style.

Interview Mode Instructions:
- If interview mode is "Technical":
  Ask questions about coding concepts, frameworks, project implementation, debugging, and technical decision-making.

- If interview mode is "Behavioral":
  Ask scenario-based questions about communication, teamwork, challenges, learning, and real-life situations. Keep them open-ended.

- If interview mode is "Case-study":
  Ask real-world problem-solving questions where the candidate explains step-by-step thinking, approach, and decisions. Focus on practical situations, scalability, or debugging.

Strict Rules:
- Each question must be between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number the questions.
- Do NOT add explanations.
- Do NOT add any extra text before or after.
- Output exactly 5 questions.
- One question per line only.
- Keep language simple and conversational.

Difficulty progression:
- Question 1 → easy
- Question 2 → easy
- Question 3 → medium
- Question 4 → medium
- Question 5 → hard
`
            },
            {
                role: "user",
                content: userPrompt
            }
        ];


        const AIresponse = await askAI(systemPrompt);
        if (!AIresponse.trim()) {
            return res.json("AI response is empty.")
        }

        const questionsArray = AIresponse.split("\n").map((q) => q.trim()).filter((q) => q.length > 0).slice(0, 5);
        if (questionsArray.length === 0) {
            return res.json("AI failed to generate Questions.")
        }

        user.credits -= 50
        await user.save()

        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            resumeText: saferesumeText,
            questions: questionsArray.map((q, i) => ({
                question: q,
                difficulty: ["easy", "easy", "medium", "medium", "hard"][i],
                timelimit: [60, 60, 90, 90, 120][i]

            }))
        })

        return res.json({
            interviewId: interview._id,
            username: user.name,
            questions: interview.questions,
            creditLeft: user.credits
        })
    } catch (error) {
        console.log("generate questions error: ", error)
        return res.json(error)
    }
}
// GENERATE FEEDBACK USING AI AND SUBMIT ANSWER:
export const submitAnswer = async (req, res) => {
    try {
        const { interviewId, questionIndex, answer, timeTaken } = req.body;
        const interview = await Interview.findById(interviewId)
        const question = interview.questions[questionIndex]

        if (!answer) {
            question.answer = "",
                question.score = 0,
                question.feedback = "You did not submit the answer."

            await interview.save()
            return res.json({ feedback: question.feedback })
        }

        // if time limit exceeded:

        if (timeTaken > question.timelimit) {
            question.score = 0,
                question.answer = answer,
                question.feedback = "time limit exceeded. Can't evaluate the answer."

            await interview.save()
            return res.json({ feedback: question.feedback })
        }

        const prompt = [
            {
                role: "system",
                content: `You are a real human interviewer evaluating a candidate's answer.

Speak in simple, natural, conversational English. Your tone should feel fair, honest, and human — not robotic or overly formal.

Your task:
- Evaluate the candidate’s answer based on:
  1. Correctness
  2. Confidence
  3. Communication
  4. Clarity and structure
  5. Relevance to the question
  6. problemsolving

Scoring Rules:
- Give a score from 1 to 10 for each category.
- Also provide one overall score (1 to 10).
- Be fair and unbiased. Do not be too harsh or too lenient.

Response Rules:
- Keep feedback short, clear, and easy to understand.
- Sound like a real interviewer giving feedback after an answer.
- Do NOT use complex words.
- Do NOT add unnecessary explanations.

Feedback rule:
write natural human feedback.
10 to 15 words only.
sound like real interview feedback.
can suggest improvement if needed.
Do not repaet the questions.
Do not explain score.

return only valid JSON in this format:
{
"confidence":Number,
"communication":Number,
"correctness":Number,
"problemsolving":Number,
"finalscore":Number,
"feedback":"short human feedback"
}
`
            }, {
                role: "user",
                content: `
    Question: ${question.question},
    Answer: ${answer}
    `
            }
        ]
        // AI response:
        const AIresponse = await askAI(prompt);
        if (!AIresponse.trim()) {
            return res.json("AI response is empty.")
        }

        const parsed = JSON.parse(AIresponse);

        question.answer = answer,
            question.confidence = parsed.confidence,
            question.communication = parsed.communication,
            question.correctness = parsed.correctness,
            question.score = parsed.finalscore,
            question.feedback = parsed.feedback,
            question.timeTaken = timeTaken
        await interview.save()

        return res.json({
            feedback: parsed.feedback
        })

    } catch (error) {
        console.log("submit answer error: ", error)
        return res.json(error)
    }
}
// GENERATE REPORT FOR THE INTERVIEW:
export const interviewReport = async (req, res) => {
    try {
        const { interviewId } = req.body
        const interview = await Interview.findById(interviewId)

        if (!interview) {
            return res.json("Interview not found.")
        }

        let totalQuestions = interview.questions.length;
        let totalTimeTaken = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;
        let totalScore = 0;

        interview.questions.forEach((q) => {
            totalScore += q.score || 0;
            totalConfidence += q.confidence || 0;
            totalCommunication += q.communication || 0;
            totalCorrectness += q.correctness || 0;
            totalTimeTaken += q.timeTaken || 0
        });

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
        const averageConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
        const averageCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
        const averageCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore;
        interview.totalTimeTaken = totalTimeTaken
        interview.status = "complete"
        await interview.save();

        return res.json({
            finalScore: Number(finalScore.toFixed(1)),
            totalTimeTaken,
            confidence: Number(averageConfidence.toFixed(1)),
            correctness: Number(averageCorrectness.toFixed(1)),
            communication: Number(averageCommunication.toFixed(1)),
            questionWiseScore: interview.questions.map((q) => ({
                question: q.question,
                feedback: q.feedback || "",
                score: q.score || 0,
                confidence: q.confidence || 0,
                communication: q.communication || 0,
                correctness: q.correctness || 0
            }))
        })
    } catch (error) {
        console.log("interview report error: ", error)
        return res.json(error)
    }
}
// GET INTERVIEW REPORT:
export const getInterviewData = async (req, res) => {
    try {
        const { id } = req.body;
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({ success: false, message: "user does not exist" })
        }

        const interviewData = await Interview.findById(id)
        if (!interviewData) {
            return res.json({ success: false, message: "interview does not exist" })
        }
        return res.json(interviewData);
    } catch (error) {
        console.log("interview report error: ", error)
        return res.json(error)
    }
}
// GET USER'S INTERVIEWS LIST:
export const userInterviewList = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({ success: false, message: "user does not exist" })
        }
        const interviews = await Interview.find({ userId: req.userId }).sort({ createdAt: -1 }).select("role mode finalScore status createdAt experience questions")
        return res.json({ success: true, interviews })
    } catch (error) {
        console.log("user interview list error: ", error)
        return res.json(error)
    }
}
// GET USER'S INTERVIEWS STATS:
export const userInterviewStats = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({ success: false, message: "user does not exist" })
        }
        let totalInterviews;
        let averageScore;
        let totalTime;
        let bestScore;

        let interviews = await Interview.find({ userId: req.userId }).select("finalScore totalTimeTaken")

        totalInterviews = interviews.length;

        let total = interviews.reduce((a, b) => (a + b.finalScore||0), 0)
        averageScore = interviews.length > 0 ? Math.floor(((total / interviews.length) / 10) * 100) : 0;
        let scoreList = interviews.map((i) => i.finalScore)
        bestScore = Math.max(...scoreList)
        totalTime = interviews.reduce(
            (a,b) => a + (b.totalTimeTaken || 0),
            0
        );

        return res.json({ success: true, stats: { totalInterviews, averageScore, bestScore, totalTime } })
    } catch (error) {
        console.log("userInterviewStats error: ", error)
        return res.json(error)
    }
}
// GET USER'S PROGRESS IN ALL INTERVIEWS:
export const Userprogress = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({ success: false, message: "user does not exist" })
        }
        const interviews = await Interview.find({ userId: req.userId });
        if (!interviews) {
            return res.json("user has not perform any interview yet.")
        }

        let confidence = 0
        let correctness = 0
        let communication = 0

        interviews.forEach((i) => {
            i.questions.map((q) => {
                confidence += q.confidence
                correctness += q.correctness
                communication += q.communication
            })
        })

        const totalQuestions = interviews.reduce((a, b) => a + (b.questions.length || 0), 0)
        const maxPerQuestion = 10;
        const totalMax = totalQuestions * maxPerQuestion;

        confidence = totalMax ? Math.floor((confidence / totalMax) * 100) : 0;
        correctness = totalMax ? Math.floor((correctness / totalMax) * 100) : 0;
        communication = totalMax ? Math.floor((communication / totalMax) * 100) : 0;

        return res.json({ confidence, correctness, communication })

    } catch (error) {
        console.log(`userprogress error: ${error}`)
        return res.json({ error: error.message })
    }
}