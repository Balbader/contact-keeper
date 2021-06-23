const express = require('express');
const router = express.Router();

// @route	->	GET api/contacts
// @descr	->	Get all users contacts
// @access	->	Private (you have to be logged in to CRUD)
router.get('/', (req, res) => {
	res.send('Get all contacts');
});


// @route	->	POST api/contacts
// @descr	->	Add new contacts
// @access	->	Private (you have to be logged in to CRUD)
router.post('/', (req, res) => {
	res.send('Add contact');
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
