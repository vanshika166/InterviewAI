import User from '../models/userModel.js'
import Payment from '../models/paymentModel.js'

export const payment = async (req, res) => {
    try {
        const { amount } = req.body;
        const user = await User.findById(req.userId)
        if (!user) {
            return res.json({success:false,message:"User does not exist."})
        }
        const transationId = "TXN" + Date.now()
        const payment = await Payment.create({
            userId: req.userId,
            amount,
            success: true,
            transationId
        })
        if (amount === 99) {
            user.credits += 500
        }
        if (amount === 299) {
            user.credits += 2000
        }
        if (amount === 599) {
            user.credits += 5000
        }
        await user.save();

        return res.json({
            success: true,
            data: payment
        });
    } catch (error) {
        console.log(`payment error: ${error}`)
        return res.json({ error: error.message })
    }
}