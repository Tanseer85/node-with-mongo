import express from 'express';
import { createCause, getAllCause, getSingleCause, updateCause, deleteCause } from '../controllers/cause';
import { createUser, loginUser } from '../controllers/user';
import verifyToken from '../middleware/verifytoken';

const router = express.Router();

// Causes Endpoint
router.post('/causes', verifyToken, createCause);
router.get('/causes', getAllCause);
router.get('/causes/:causeId', getSingleCause);
router.patch('/causes/:causeId', verifyToken, updateCause);
router.delete('/causes/:causeId', verifyToken, deleteCause);

// User Endpoint
router.post('/user/signup', createUser);
router.post('/user/login', loginUser);

export default router;