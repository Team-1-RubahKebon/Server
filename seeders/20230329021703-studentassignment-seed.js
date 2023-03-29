"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const studentAssignments =
      require("../mock_data/studentassignment.json").map((el) => {
        el.createdAt = new Date();
        el.updatedAt = new Date();
        return el;
      });

    await queryInterface.bulkInsert("StudentAssignments", studentAssignments);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("StudentAssignments");
  },
};
