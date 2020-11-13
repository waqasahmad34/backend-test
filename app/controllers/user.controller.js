/* eslint-disable max-len */
/* eslint-disable no-tabs */
/* eslint-disable no-mixed-spaces-and-tabs */
import BaseController from './base.controller';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Constants from '../config/constants';

class UsersController extends BaseController {
	whitelist = [
	  'email',
	  'password',
	];
	register = async (req, res, next) => {
	  // filter data from body
	  const data = this.filterParams(req.body, this.whitelist);
	  try {
	    // See if user exist
	    let user = await User.findOne({ email: data['email'] });
	    if (user) {
	      return res.status(400).json({ msg: Constants.messages.userExist });
	    }
	    user = new User({
	      ...data,
	    });
	    // Encrypt password
	    const salt = await bcrypt.genSalt(10);
	    user.password = await bcrypt.hash(data['password'], salt);
	    await user.save();
	    const userObj = {
	      id: user._id,
	      email: user.email,
	    };
	    res.status(200).json({ msg: Constants.messages.success, user: userObj });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};

	login = async (req, res, next) => {
	  // filter data from body
	  const data = this.filterParams(req.body, this.whitelist);
	  try {
	    // See if user exist
	    const user = await User.findOne({ email: data['email'] });
	    if (!user) {
	      return res.status(400).json({ msg: Constants.messages.inValidCredentials });
	    }
	    // match incoming user password
	    const isMatch = await bcrypt.compare(data['password'], user.password);
	    if (!isMatch) {
	      return res.status(400).json({ msg: Constants.messages.inValidCredentials });
	    }
	    // Return jsonwebtoken
	    const payload = {
	      user: {
	        id: user.id,
	        email: user.email,
	      },
	    };
	    jwt.sign(payload, Constants.security.sessionSecret, { expiresIn: Constants.security.sessionExpiration }, (err, token) => {
	      if (err) throw err;
	      res.status(200).json({ msg: Constants.messages.success, jwt: token });
	    });
	  } catch (error) {
	    error.status = 400;
	    next(error);
	  }
	};

	getUser = async (req, res, next) => {
	  try {
	    const user = await User.findById({ _id: req.user.id }).select('_id email');
	    if (!user) {
	      return res.status(404).json({ msg: Constants.messages.userNotFound });
	    }
	    const userObj = {
	      id: user._id,
	      email: user.email,
	    };
	    return res.status(200).json({ msg: Constants.messages.success, user: userObj });
	  } catch (err) {
	    err.status = 400;
	    next(err);
	  }
	};
}

export default new UsersController();
