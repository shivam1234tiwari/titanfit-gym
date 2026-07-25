const express = require('express');
const router = express.Router();
const { 
  submitContact, 
  getContacts, 
  replyToContact 
} = require('../controllers/contactController');

// GET all messages & POST new contact query
router.route('/')
  .get(getContacts)
  .post(submitContact);

// PUT reply to contact query by ID 👈 (Yeh missing hone se error aa raha tha)
router.route('/:id')
  .put(replyToContact);

module.exports = router;