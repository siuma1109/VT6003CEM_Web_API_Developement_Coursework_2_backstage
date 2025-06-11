import { QueryInterface, Transaction, DataTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.addColumn('users', 'avatar', {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL to user avatar image'
      }, { transaction });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.removeColumn('users', 'avatar', { transaction });
    }
  )
}; 