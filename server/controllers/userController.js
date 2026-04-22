import User from '../models/userModel.js'

export const currentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    return res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.log(`currentUser error: ${error}`);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};