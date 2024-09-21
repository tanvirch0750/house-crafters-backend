/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BookingStatus,
  NotificationStatus,
  PaymentStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { generateTransactionId } from '../../../shared/generateTransactionId';
import prisma from '../../../shared/prisma';
const SSLCommerzPayment = require('sslcommerz-lts');

const initiatePayment = async (bookingId: string): Promise<any> => {
  try {
    const bookings = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
      include: {
        service: true,
        user: true,
        payment: true,
      },
    });

    if (!bookings) {
      throw new ApiError('Invalid booking service', httpStatus.NOT_FOUND);
    }

    const transactionId = generateTransactionId();

    const sslData = {
      total_amount: bookings?.service?.price,
      currency: 'BDT',
      tran_id: transactionId, // use unique tran_id for each api call
      success_url: `${config.backend_url}/payment/success?bookingId=${bookingId}`,
      fail_url: `${config.backend_url}/payment/fail?bookingId=${bookingId}`,
      cancel_url: `${config.backend_url}/payment/cancel`,
      ipn_url: 'http://localhost:3030/ipn',
      shipping_method: 'Courier',
      product_name: bookings?.service?.serviceName,
      product_category: 'Electronic',
      product_profile: 'general',
      cus_name: bookings?.user?.fullName,
      cus_email: bookings?.user?.email,
      cus_add1: bookings?.user?.address,
      cus_country: 'Bangladesh',
      cus_phone: bookings?.user?.contactNumber,
      ship_name: bookings?.user?.fullName,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    const payment = await prisma.payment.update({
      where: {
        bookingId: bookingId,
      },
      data: {
        transactionId: sslData.tran_id,
      },
    });

    console.log(payment);

    const sslcz = new SSLCommerzPayment(
      config.ssl_store_id,
      config.ssl_store_password,
      config.ssl_is_live
    );

    // Wait for the init method to complete and get the response
    const apiResponse: { GatewayPageURL: any } = await sslcz.init(sslData);

    // Redirect the user to the payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;

    return GatewayPageURL;
  } catch (error) {
    // Handle errors here
    console.error(error);
  }
};

const paymentSuccess = async (bookingId: string) => {
  // Checking if the available service exists
  const bookings = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (!bookings) {
    throw new ApiError('There is no booking', httpStatus.NOT_FOUND);
  }

  if (bookings.status === BookingStatus.confirmed) {
    throw new ApiError('This booking already completed', httpStatus.NOT_FOUND);
  }

  if (bookings.status === BookingStatus.rejected) {
    throw new ApiError('This booking already canceled', httpStatus.NOT_FOUND);
  }

  const finishBooking = await prisma.$transaction(async transactionClient => {
    const book = await transactionClient.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: BookingStatus.confirmed,
      },
    });

    const payment = await transactionClient.payment.update({
      where: {
        bookingId: bookingId,
      },
      data: {
        paymentStatus: PaymentStatus.paid,
      },
    });

    const updateAvlService = await transactionClient.availableService.update({
      where: {
        id: bookings.serviceId,
      },
      data: {
        totalServiceProvided: {
          increment: 1,
        },
      },
    });

    const notification = await transactionClient.notification.create({
      data: {
        message: `Payment is successful and your Service (${bookings.service.serviceName}) is confirmed!`,
        userId: bookings.userId,
        readStatus: false,
        type: NotificationStatus.confirmation,
      },
    });

    return {
      booking: book,
      payment: payment,
    };
  });

  return finishBooking;
};

const paymentFailed = async (bookingId: string) => {
  // Checking if the available service exists
  const bookings = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      service: true,
    },
  });

  if (!bookings) {
    throw new ApiError('There is no booking', httpStatus.NOT_FOUND);
  }

  if (bookings.status === BookingStatus.confirmed) {
    throw new ApiError('This booking already completed', httpStatus.NOT_FOUND);
  }

  if (bookings.status === BookingStatus.rejected) {
    throw new ApiError('This booking already canceled', httpStatus.NOT_FOUND);
  }

  const notification = await prisma.notification.create({
    data: {
      message: `Payment is failed for this (${bookings.service.serviceName}) service`,
      userId: bookings.userId,
      readStatus: false,
      type: NotificationStatus.confirmation,
    },
  });

  return bookings;
};

export const PaymentServices = {
  initiatePayment,
  paymentSuccess,
  paymentFailed,
};
