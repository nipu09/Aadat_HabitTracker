const bcrypt = require("bcryptjs");

const ROUNDS = 12;

const hashPassword = (password) => bcrypt.hash(password, ROUNDS);
const comparePassword = (plain, hash) => bcrypt.compare(plain, hash);

module.exports = { hashPassword, comparePassword };
