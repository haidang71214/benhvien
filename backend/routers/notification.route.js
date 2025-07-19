import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';

const router = express.Router();

router.get('/', middlewareTokenAsyncKey, getNotifications);
router.put('/:id/read', middlewareTokenAsyncKey, markAsRead);

export default router;
