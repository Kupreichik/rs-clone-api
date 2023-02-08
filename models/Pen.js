import mongoose from 'mongoose';

const PenSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  html: String,
  css: String,
  js: String,

  likesCount: {
    type: Number,
    default: 0,
  },
  viewsCount: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Pens', PenSchema);
