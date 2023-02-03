import userModel from '../models/User.js'

export const checkUsername = async (req, res) => {
  try {
    const user = await userModel.findOne({ username: req.query.username });

    if (!user) {
      return res.json({
        canUse: true,
      });
    } else {
      return res.json({
        canUse: false,
      });
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
}