/* eslint-disable no-unused-vars */
import express from 'express';
import Sequelize from 'sequelize';

import db from '../index';
import { createJWTToken, sendEmail } from '../utilities/helperFunctions';

import router from './authentication';

const { Op } = Sequelize;

const MINUTE = 'MINUTE';
const HOUR = 'HOUR';
const DAY = 'DAY';

function calculateTimeFromNow({ type, date }) {
  const modifier = {
    [MINUTE]: 60,
    [HOUR]: 3600,
    [DAY]: 86400,
  };

  const [start, end] = [new Date(), new Date(date)];
  const difference = (end.getTime() - start.getTime()) / 1000;

  return difference / modifier[type];
}

router.post('/availabilities', async (req, res, next) => {
  const { deadline, start, end, churchId } = req.body;

  try {
    // Check if church already has an availability table (return id to delete)
    const existingAvailabilityRequest = await db.Availability.findOne({
      where: { churchId },
    });
    if (existingAvailabilityRequest)
      return res.status(409).json({ availability: existingAvailabilityRequest });

    // Create an availability table
    const newAvailabilityRequest = await db.Availability.create({
      deadline,
      start,
      end,
      churchId,
    });

    // Associate availability table to active users
    const activeUsers = await db.User.findAll({
      where: { disabled: false, firstName: { [Op.not]: null } },
      attributes: ['id', 'firstName', 'lastName', 'email', 'gender', 'password'],
    });

    const MALE = 'Male';
    const FEMALE = 'Female';

    const title = {
      [MALE]: 'Brother',
      [FEMALE]: 'Sister',
    };

    const newUserAvailabilityInstances = activeUsers.map(({ id: userId }) => {
      return {
        userId,
        availabilityId: newAvailabilityRequest.id,
      };
    });
    // Create all user availabilities
    await db.UserAvailability.bulkCreate(newUserAvailabilityInstances);

    // Email all users
    await Promise.all(
      activeUsers.map(
        ({ id: userId, firstName, lastName, email, gender, password }, idx) => {
          const token = createJWTToken({
            userId,
            expirationInMin: calculateTimeFromNow({ type: MINUTE, date: deadline }),
            secret: password,
          });
          const [tokenHeader, tokenPayload, tokenSignature] = token.split('.');
          const link = `${process.env.DEV_SERVER_API_URL}/auth/checkAvailabilityToken?header=${tokenHeader}&payload=${tokenPayload}&signature=${tokenSignature}`;
          const mailResponse = sendEmail({
            email: process.env.PERSONAL_EMAIL,
            text: `Hallelujah ${title[gender]} ${firstName} ${lastName},\n\n Please send your availabilities between the dates ${start} to ${end} by clicking the link: \n${link}\n\n Please submit by ${deadline}`,
            subject: `Send availabilities for ${start} to ${end}`,
          });
          return mailResponse;
        },
      ),
    );
    // console.log(mailResponses[0][0].statusCode === 202);
    return res.status(201).send({ message: 'It is done' });
  } catch (error) {
    next(error);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});

router.delete('/availabilities', async (req, res, next) => {
  const { churchId } = req.body;

  try {
    // Check if church already has an availability table (return id to delete)
    const existingAvailabilityRequest = await db.Availability.findOne({
      where: { churchId },
    });
    if (!existingAvailabilityRequest)
      return res
        .status(404)
        .send({ message: 'No availability request exists for this church' });

    // Delete all associated UserAvailabilities
    await db.UserAvailability.destroy({
      where: { availabilityId: existingAvailabilityRequest.id },
    });

    await db.Availability.destroy({
      where: { id: existingAvailabilityRequest.id },
    });
    return res.status(201).send({ message: 'It is done' });
  } catch (error) {
    next(error);
    return res.status(503).send({ message: 'Server error, try again later' });
  }
});
export default router;
