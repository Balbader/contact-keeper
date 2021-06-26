const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator/check');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route	->	GET api/contacts
// @descr	->	Get all users contacts
// @access	->	Private (you have to be logged in to CRUD)
router.get('/', auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
		res.json(contacts);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Sever Error');
	}
});


// @route	->	POST api/contacts
// @descr	->	Add new contacts
// @access	->	Private (you have to be logged in to CRUD)
router.post('/', [auth, [
	check('name', 'Name is required')
		.not()
		.isEmpty()
]], async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	const { name, email, phone, type } = req.body;

	try {
		const newContact = new Contact({
			name,
			email,
			phone,
			type,
			user: req.user.id
		});

		const contact = await newContact.save();

		res.json(contact);
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Sever Error');
	}
});


// @route	->	PUT api/contacts/:id
// @descr	->	Update contact
// @access	->	Private (you have to be logged in to CRUD)
router.put('/:id', (req, res) => {
	res.send('Update contact');
});


// @route	->	DELETE api/contacts/:id
// @descr	->	Delete contact
// @access	->	Private (you have to be logged in to CRUD)
router.delete('/:id', (req, res) => {
	res.send('Delete contact');
});

module.exports = router;
