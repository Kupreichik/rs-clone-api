import PenModel from '../models/Pen.js'

export const create = async (req, res) => {
  try {
    const doc = new PenModel({
      title: req.body.title,
      html: req.body.html,
      css: req.body.css,
      js: req.body.js,
      user: req.userId,
    });

    const pen = await doc.save();

    const { __v, ...penData } = pen._doc;
    res.json(penData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Some server error',
    });
  }
};
