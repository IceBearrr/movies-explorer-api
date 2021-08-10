require('dotenv').config();

const { BASE_URL = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;
const { JWT_SECRET = 'secret-key' } = process.env;
module.exports = { BASE_URL, JWT_SECRET };
