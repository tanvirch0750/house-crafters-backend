import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { BookingController } from './booking.controller';
import { validationSchema } from './booking.validation';

const router = express.Router();

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(validationSchema.create),
  BookingController.insertIntoDB
);

export const bookingRoutes = router;
