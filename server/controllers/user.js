// import required dependencies
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/user';
import Token from '../middleware/token';

export function createUser(req, res) {
  bcrypt.hash(req.body.password, 15, (err, hash) => {
    const password = hash;
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      username: req.body.username,
      email: req.body.email,
      password,
    });
    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({
        message: 'Please ensure you have filled the username, email, and password',
      });
    }

// verify the user isn't stored in the database
    return User.count({
      $or: [
        { username: req.body.username},
        { email: req.body.email },
      ],
    })
      .then((count) => {
        if (count > 0) {
          return res.status(400).json({
            message: 'User exist',
          });
        }
        return user
          .save()
          .then((newUser) => {
            const token = Token(newUser);
            res.status(201).json({
              message: 'User successfully signed in',
              newUser: {
                username: newUser.username,
                email: newUser.email,
              },
              token,
            });
          })
          .catch(() => {
            console.log('err');
            res.status(500).json({
              message: 'Our server is in the locker room, please do try again.',
            });
        });
    });
  });
}

export function loginUser(req, res) {
  const { username, password } = req.body;
  User.findOne({ username })
    .then((existingUser) => {
      bcrypt.compare(password, existingUser.password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: 'Not authorized',
          });
        }
        if (result) {
          const token = Token(existingUser);
          return res.status(200).json({
            message: 'User authorization successful',
            existingUser: {
              username: existingUser.username,
              email: existingUser.email,
              _id: existingUser.id,
            },
            token,
          });
        }
        return res.status(401).json({
          message: 'Invalid details',
        });
      });
    })
    .catch(() => res.status(500).json({ message: 'Our server is in the locker room, please do try again.'}));
}

export default User;