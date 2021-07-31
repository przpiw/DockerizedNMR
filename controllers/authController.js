const User = require('../models/UserModel')
const bcrypt = require('bcryptjs')

exports.signUp = async (req, res) => {
  try {
    const { username, password } = req.body
    const hashpassword = await bcrypt.hash(password, 12)
    const newUser = await User.create({
      username,
      password: hashpassword,
    })
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    })
  } catch (e) {
    res.status(400).json({
      status: 'failed',
      message: e,
    })
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) {
      res.status(404).json({
        status: 'failed',
        message: 'user not found',
      })
    }

    const isCorrent = await bcrypt.compare(password, user.password)
    if (isCorrent) {
      res.status(200).json({
        status: 'success',
      })
    } else {
      res.status(400).json({
        status: 'fail',
        message: 'incorrect username or password',
      })
    }
  } catch (e) {
    res.status(400).json({
      status: 'failed',
    })
  }
}
