import mongoose from 'mongoose';

const PenSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  html: {
    type: String,
    required: true,
  },
  css: {
    type: String,
    required: true,
  },
  js: {
    type: String,
    required: true,
  },
  imageUrl: String,
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

export default mongoose.model('Post', PenSchema);
