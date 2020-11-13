/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import BaseController from './base.controller';
import User from '../models/user';
import Task from '../models/task';
import Constants from '../config/constants';

class TasksController extends BaseController {
	whitelist = ['name'];

	createTask = async (req, res, next) => {
	  // filter data from body
	  const data = this.filterParams(req.body, this.whitelist);
	  try {
	    const user = await User.findById({ _id: req.user.id });
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    data['user'] = req.user.id;
	    const task = new Task({
	      ...data,
	    });
	    await task.save();
	    const taskObj = {
	      id: task._id,
	      name: task.name,
	    };
	    res.status(200).json({ msg: Constants.messages.success, task: taskObj });
	  } catch (err) {
	    next(err);
	  }
	};

	listTasks = async (req, res, next) => {
	  try {
	    const user = await User.findById({ _id: req.user.id });
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    const tasks = await Task.find({ user: req.user.id }).select('_id name');
	    if (!tasks) {
	      return res.status(404).json({ msg: Constants.messages.taskNotFound });
	    }
	    res.status(200).json({ msg: Constants.messages.success, tasks });
	  } catch (err) {
		  next(err);
	  }
	  };
}

export default new TasksController();
