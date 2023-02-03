import userModel from '../models/User.js'

export const checkUsername = async (req, res) => {
  try {
    console.log(req.params.uniqName);
    const user = await userModel.findOne({ username: req.params.uniqName });

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