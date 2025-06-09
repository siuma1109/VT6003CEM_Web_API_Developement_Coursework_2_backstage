import { QueryInterface, Transaction, DataTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.createTable('user_tokens', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        accessToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        accessTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        refreshTokenExpiresAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      });

      // Add indexes
      await queryInterface.addIndex('user_tokens', ['userId'], { transaction });
      await queryInterface.addIndex('user_tokens', ['accessToken'], { transaction });
      await queryInterface.addIndex('user_tokens', ['refreshToken'], { transaction });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.dropTable('user_tokens');
    }
  )
}; 