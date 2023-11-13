/* eslint-disable @typescript-eslint/ban-ts-comment */
import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import config from '../../../config';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PaymentServices } from './payment.service';

export const initiatePayment: RequestHandler = catchAsync(async (req, res) => {
  const { bookingId } = req.params;
  const result = await PaymentServices.initiatePayment(bookingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    status: 'success',
    message: 'Payment successfull',
    data: result,
  });
});

export const paymentSuccess: RequestHandler = catchAsync(async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.redirect(`${config.forntend_url}/payment/fail`);
  }

  // @ts-ignore
  const result = await PaymentServices.paymentSuccess(bookingId);

  if (result) {
    res.redirect(
      `${config.forntend_url}/payment/success?bookingId=${bookingId}`
    );
  }

  // sendResponse(res, {
  //   statusCode: httpStatus.OK,
  //   success: true,
  //   status: 'success',
  //   message: 'Payment Successful',
  //   data: result,
  // });
});

export const paymentFailed: RequestHandler = catchAsync(async (req, res) => {
  const { bookingId } = req.query;

  if (!bookingId) {
    return res.redirect(`${config.forntend_url}/payment/fail`);
  }

  // @ts-ignore
  const result = await PaymentServices.paymentFailed(bookingId);

  if (result) {
    res.redirect(`${config.forntend_url}/payment/fail?bookingId=${bookingId}`);
  }
});

export const PaymentController = {
  initiatePayment,
  paymentSuccess,
  paymentFailed,
};
