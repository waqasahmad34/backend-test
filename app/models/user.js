import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: [true, 'Email is required'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const User = mongoose.model('user', userSchema);
export default User;
