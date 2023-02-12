import PenModel from '../models/Pen.js';
import UserModel from '../models/User.js';

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

export const update = async (req, res) => {
  try {
    PenModel.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      {
        title: req.body.title,
        html: req.body.html,
        css: req.body.css,
        js: req.body.js,
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
    ).populate({
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

export const remove = async (req, res) => {
  try {
    PenModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json(serverError);
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Pen not found',
          });
        }

        res.json({
          success: true,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
};

export const addInLoved = async (req, res) => {
  try {
    const { loved } = await UserModel.findOne({ _id: req.userId });
    const index = loved.indexOf(req.params.id);
    let inc;

    if (index === -1) {

      inc = 1;
      loved.push(req.params.id);
      UserModel.findOneAndUpdate({ _id: req.userId }, { loved },
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json(serverError);
          }
        }
      );

    } else {

      inc = -1;
      loved.splice(index, 1);
      UserModel.findOneAndUpdate({ _id: req.userId }, { loved }, (err) => {
        if (err) {
        console.log(err);
        return res.status(500).json(serverError);
        }
      });
    }

    PenModel.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likesCount: inc } },
      { returnDocument: 'after' },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json(serverError);
        }
        res.json(doc);
      }
    ).populate({
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

export const getMy = async (req, res) => {
  try {
    const data = await PenModel.find({ user: req.userId })
      .populate({
        path: 'user',
        select: {
          name: 1,
          username: 1,
          avatar: 1,
          _id: 0,
        },
      })
      .exec();

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
}

export const getLoved = async (req, res) => {
  try {
    const { loved } = await UserModel.findOne({ _id: req.userId });
    const data = await PenModel.find({ _id: [...loved] })
        .populate({
          path: 'user',
          select: {
            name: 1,
            username: 1,
            avatar: 1,
            _id: 0,
          },
        })

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(serverError);
  }
};
