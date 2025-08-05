import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { middlewareTokenAsyncKey } from '../config/jwt.js';

const notificationRouter = express.Router();

notificationRouter.get('/', middlewareTokenAsyncKey, getNotifications);
notificationRouter.put('/:id/read', middlewareTokenAsyncKey, markAsRead);

export default notificationRouter;
