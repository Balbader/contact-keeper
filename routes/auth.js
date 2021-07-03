const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { findById } = require('../models/User');

// @route	->	GET api/auth
// @descr	->	Get logged in user
// @access	->	Private
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Sever Error');
	}
});


// @route	->	POST api/auth
// @descr	->	auth user & get token
// @access	->	Public
router.post('/', [
	check('email', 'Please include a valid Email').isEmail(),
	check('password', 'Password is required').exists()
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { email, password } = req.body;

	try {
		// Waiting to find User email in DB
		let user = await User.findOne({ email });

		// Sending err msg if wrong email
		if (!user) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		// Comparing user registered password
		const isMatch = await bcrypt.compare(password, user.password);

		// Sending err msg if wrong password
		if(!isMatch) {
			return res.status(400).json({ msg: 'Invalid Credentials' });
		}

		// payload obj to send user id through jsonwebtoken
		const payload = {
			user: {
				id: user.id
			}
		}

		// Generate a token
		jwt.sign(payload, config.get('jwtSecret'), {
			expiresIn: 360000
		}, (err, token) => {
			if (err) {
				throw err;
			}
			res.json({ token });
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Sever Error');

	}
});

module.exports = router;
