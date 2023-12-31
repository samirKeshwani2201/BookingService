'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'bookings',
      "noOfSeats", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    );
    await queryInterface.addColumn(
      'bookings',
      "totalCost", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    );

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
    */
    await queryInterface.removeColumn('bookings', "noOfSeats");
    await queryInterface.removeColumn('bookings', "totalCost");
  }
};
