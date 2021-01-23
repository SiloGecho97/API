'use strict';
let randomstring = require("randomstring");


module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

   let codeUnique = (codes, code) => {
    let unique = true;
    codes.map((c) => {
      if (c.code == code) {
        unique = false;
      }
    });
    return unique;
  };
  let codes = [];
  for (let i = 1; i <= 10000; i++) {
    let code = parseInt(randomstring.generate({ length: 6, charset: "123456789" }));
    while (!codeUnique(codes, code)) {
      code = parseInt(randomstring.generate({ length: 6, charset: "123456789" }));
    }
    codes.push({
      code
    });
  }

  await queryInterface.bulkInsert("code", codes, {});


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
