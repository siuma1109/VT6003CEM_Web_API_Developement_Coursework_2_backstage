import { QueryInterface, Transaction, DataTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.createTable('users-hotels-favourites', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        hotelId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'hotels',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW
        }
      }, { transaction });

      // Add a unique constraint to prevent duplicate favorites
      await queryInterface.addIndex('users-hotels-favourites', ['userId', 'hotelId'], {
        unique: true,
        transaction
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.dropTable('users-hotels-favourites', { transaction });
    }
  )
}; 