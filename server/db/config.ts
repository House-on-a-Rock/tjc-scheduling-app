import dotenv from 'dotenv';

dotenv.config();

const config = {
    development: {
        database: process.env.DB_NAME,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        host: process.env.DB_HOST,
        dialect: 'postgres',
    },
};

// module.exports = {
//     development: {
//         database: process.env.DB_NAME,
//         username: process.env.DB_USER,
//         password: process.env.DB_PASS,
//         host: process.env.DB_HOST,
//         dialect: 'postgres',
//     },
// };

export default config;
