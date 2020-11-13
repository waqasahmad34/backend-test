import jwt from 'jsonwebtoken';
import Constants from '../config/constants';

export default function authenticate(req, res, next) {
  // Get token from the header
  const token = req.header(Constants.messages.authorization);
  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: Constants.messages.noToken });
  }
  // verify token
  try {
    const decoded = jwt.verify(token, Constants.security.sessionSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: Constants.messages.inValidToken });
  }
}
