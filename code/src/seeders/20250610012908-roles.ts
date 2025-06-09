'use strict';

import { QueryInterface, Transaction, Op } from 'sequelize';
import { PasswordService } from '../services/password.service';

/** @type {import('sequelize-cli').Migration} */

const roles = [
  "admin",
  "travel_agency_operator",
  "normal_user",
];

module.exports = {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    return queryInterface.sequelize.transaction(
      async (transaction: Transaction) => {
        // First, create admin user if it doesn't exist
        const [adminUsers] = await queryInterface.sequelize.query(
          `SELECT * FROM users WHERE email = 'admin@example.com' LIMIT 1`,
          { transaction }
        ) as [any[], any];

        let adminUserId;
        if (!adminUsers || adminUsers.length === 0) {
          const result = await queryInterface.bulkInsert('users', [{
            name: 'Admin User',
            email: 'admin@example.com',
            password: await PasswordService.hash('password123'),
            createdAt: new Date(),
            updatedAt: new Date()
          }], { transaction });
          const [adminUser] = await queryInterface.sequelize.query(
            `SELECT * FROM users WHERE email = 'admin@example.com' LIMIT 1`,
            { transaction }
          ) as [any[], any];

          adminUserId = adminUser[0].id;
        } else {
          adminUserId = adminUsers[0].id;
        }

        // Get existing roles
        const [existingRoles] = await queryInterface.sequelize.query(
          `SELECT name FROM roles`,
          { transaction }
        ) as [any[], any];
        const existingRoleNames = existingRoles.map((r: { name: string }) => r.name);

        // Filter out roles that already exist
        const newRoles = roles.filter(role => !existingRoleNames.includes(role));
        
        if (newRoles.length > 0) {
          const bulkInsertRoles = newRoles.map((name) => ({
            name: name,
            createdAt: new Date(),
            updatedAt: new Date()
          }));
          await queryInterface.bulkInsert('roles', bulkInsertRoles, { transaction });
        }

        // Get admin role and create user-role association
        const [adminRoles] = await queryInterface.sequelize.query(
          `SELECT id FROM roles WHERE name = 'admin' LIMIT 1`,
          { transaction }
        ) as [any[], any];


        if (adminRoles && adminRoles.length > 0) {
          const [usersRoles] = await queryInterface.sequelize.query(
            `SELECT * FROM users_roles WHERE "userId" = ${adminUserId} AND "roleId" = ${adminRoles[0].id} LIMIT 1`,
            { transaction }
          ) as [any[], any];
          if (usersRoles.length == 0) {
            await queryInterface.bulkInsert('users_roles', [{
              userId: adminUserId,
              roleId: adminRoles[0].id
            }], { transaction });
          }
        }
      });
  },
  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.bulkDelete('roles', {}, { transaction });
    }),
};
