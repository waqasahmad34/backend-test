import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Task = mongoose.model('task', taskSchema);
export default Task;
