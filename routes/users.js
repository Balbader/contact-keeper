const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');

// @route	->	POST api/users
// @descr	->	Register a user
// @access	->	Public
router.post('/', [
	check('name', 'Please add name').not().isEmpty(),
	check('email', 'Please include a valid Email').isEmail(),
	check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, password } = req.body;

	try {
		let user = await User.findOne({ email });
		// Display msg if user exists
		if (user) {
			return res.status(400).json({ msg: 'User already exists' });
		}

		// Create new user if user is not in DB
		user = new User({
			name,
			email,
			password
		});

		// Generate salt to encrypt the password
		const salt = await bcrypt.genSalt(10);

		// Hash the password
		user.password = await bcrypt.hash(password, salt);

		// Call user.save
		await user.save();

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