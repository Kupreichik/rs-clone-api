import PenModel from '../models/Pen.js'

const serverError = {
      message: 'Some server error',
    };

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
    res.status(500).json(serverError);
  }
};

export const getAll = async (req, res) => {
    try {
      const limit = req.query._limit || 10;
      const data = await PenModel.find()
        .limit(limit)
        .populate({
          path: 'user',
          select: {
            name: 1,
            username: 1,
            avatar: 1,
            _id: 0
          },
        })
        .exec();

      const totalCount = await PenModel.find().count();

      res.setHeader('X-Total-Count', totalCount).json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
};

export const getOne = async (req, res) => {
  try {
    PenModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(404).json({
            message: 'Pen not found',
          });
        }

        res.json(doc);
      }
    )
      .populate({
        path: 'user',
        select: {
          name: 1,
          username: 1,
          avatar: 1,
          _id: 0,
        },
      });
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
};
