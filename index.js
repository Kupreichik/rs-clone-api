import express from 'express';
import mongoose from 'mongoose';

const app = express();

mongoose.set('strictQuery', true);
mongoose
  .connect(
    'mongodb+srv://admin:yyyyyy@cluster0.qbtixrj.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(() => console.log('DB connect successfully'))
  .catch((err) => console.log('DB error', err));

app.listen(3033, (err) => {
  if (err) return console.log(err);
  console.log('Server run')
});
