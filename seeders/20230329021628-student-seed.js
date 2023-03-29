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

    const students = require("../mock_data/students.json");

    const length = students.length;

    students = students.map((el, idx) => {
      if (idx < 6) {
        el.ClassId = 1;
      } else if (idx < 12) {
        el.ClassId = 2;
      } else if (idx < 18) {
        el.ClassId = 3;
      } else if (idx < 24) {
        el.ClassId = 4;
      } else if (idx < 30) {
        el.ClassId = 5;
      }
      el.createdAt = new Date();
      el.updatedAt = new Date();
      return el;
    });

    await queryInterface.bulkInsert("Students", students);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Students", students);
  },
};
