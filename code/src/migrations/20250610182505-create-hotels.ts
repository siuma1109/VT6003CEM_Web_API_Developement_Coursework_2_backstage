import { QueryInterface, Transaction, DataTypes } from 'sequelize';

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.createTable('hotels', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        hotelBedsId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: true,
          comment: 'Hotel ID from Hotelbeds API'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        address: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        phones: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        city: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        countryCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        stateCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        destinationCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        zoneCode: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        latitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        longitude: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: true,
          comment: 'Hotel category/star rating'
        },
        images: {
          type: DataTypes.JSON,
          allowNull: true,
          comment: 'Array of hotel images URLs'
        },
        lastUpdated: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
          comment: 'Last time the hotel data was updated from API'
        },
        status: {
          type: DataTypes.ENUM('pending', 'active', 'inactive'),
          allowNull: false,
          defaultValue: 'pending'
        },
        customData: {
          type: DataTypes.JSON,
          allowNull: true,
          comment: 'Custom data to override original hotel data'
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

      // Add indexes for common search fields
      await queryInterface.addIndex('hotels', ['hotelBedsId'], { transaction });
      await queryInterface.addIndex('hotels', ['name'], { transaction });
      await queryInterface.addIndex('hotels', ['city'], { transaction });
      await queryInterface.addIndex('hotels', ['category'], { transaction });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction: Transaction) => {
      await queryInterface.dropTable('hotels');
    }
  )
}; 