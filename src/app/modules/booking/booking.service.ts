import { Booking } from '@prisma/client';

import prisma from '../../../shared/prisma';

const insertIntoDB = async (data: Booking): Promise<Booking> => {
  const result = await prisma.booking.create({
    data,
    include: {
      user: true,
      service: {},
      slot: true,
    },
  });
  return result;
};

export const BookingServices = {
  insertIntoDB,
};
