'use strict';

import { QueryInterface, Transaction, Op } from 'sequelize';
import { faker } from '@faker-js/faker';
import { PasswordService } from '../services/password.service';
import { User } from '../models/user.model';

/** @type {import('sequelize-cli').Migration} */

async function seedUsers(length: number) {
  const users = await Promise.all(Array.from({ length }, async () => ({
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: await PasswordService.hash('password123'),
    createdAt: new Date(),
    updatedAt: new Date(),
  })));

  return users;
}

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    const users = await seedUsers(10);
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        await queryInterface.bulkInsert('users', users, { transaction });
      });
  },

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      const users = await User.findAll({ limit: 10, order: [['id', 'DESC']] });
      await queryInterface.bulkDelete('users', {
        email: {
          [Op.in]: users.map((user: { email: string }) => user.email),
        },
      }, { transaction });
    }),
};
