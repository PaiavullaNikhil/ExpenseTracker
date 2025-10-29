import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { register, login, updatePassword, updateProfile } from '../controllers/authController.js';

const router = Router();

router.post('/register', register);

router.post('/login', login);

router.put('/profile', authRequired, updateProfile);

router.put('/password', authRequired, updatePassword);

export default router;


