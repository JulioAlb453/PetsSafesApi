const express = require('express');
const router = express.Router();
const userRoute = require('../controllers/users')

router.post('/register', userRoute.registerUser);

router.get('/usuarios', userRoute.getAllUser);        
router.get('/ObtenerData/:id', userRoute.getUserData);        
router.post('/login', userRoute.loginUser);
router.post('/info', userRoute.getUserLoged);




module.exports = router;
