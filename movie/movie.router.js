const express = require('express');
const router = express.Router();
const { listAction, removeAction, editAction, saveAction, viewAction, importAction } = require('./movie.controller');
const { ensureLoggedIn } = require('connect-ensure-login');
router.get('/', listAction);
router.get('/remove/:id', ensureLoggedIn('/login'), removeAction);
router.get('/edit/:id?', ensureLoggedIn('/login'), editAction);
router.get('/view/:id', viewAction)
router.post('/save', ensureLoggedIn('/login'), saveAction);
router.get('/import', ensureLoggedIn('/login'), importAction)

module.exports = router; 
