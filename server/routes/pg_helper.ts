import postgres from 'pg';

function newClient() {
    const client = new postgres.Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'testdb',
        password: process.env.DB_PASS,
        port: 5432,
    });
    return client;
}

export default newClient;
