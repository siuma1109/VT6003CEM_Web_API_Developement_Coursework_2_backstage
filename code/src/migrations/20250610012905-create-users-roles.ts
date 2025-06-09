import { QueryInterface, Transaction, DataTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.createTable('users_roles', {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
        },
        roleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'roles',
            key: 'id'
          },
          onDelete: 'CASCADE',
          primaryKey: true
        },
      });

      // Add indexes
      await queryInterface.addIndex('users_roles', ['userId'], { transaction });
      await queryInterface.addIndex('users_roles', ['roleId'], { transaction });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.dropTable('users_roles');
    }
  )
}; 