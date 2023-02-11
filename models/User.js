import mongoose from 'mongoose';

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  passwordHash: {
    type: String,
  },
  avatar: String,
});

export default mongoose.model('User', UserSchema);
