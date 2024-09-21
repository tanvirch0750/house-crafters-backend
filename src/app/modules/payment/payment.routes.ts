import express from 'express';
import { ENUM_USER_ROLE } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.patch(
  '/initiate-payment/:bookingId',
  auth(ENUM_USER_ROLE.CUSTOMER),
  PaymentController.initiatePayment
);

router.post(
  '/success',

  PaymentController.paymentSuccess
);

router.post(
  '/fail',

  PaymentController.paymentFailed
);

export const paymentRoutes = router;
