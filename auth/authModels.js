const db = require('../db');

const createUser = async (username, email, hashedPassword, role) => {
    try {
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        await db.query(query, [username, email, hashedPassword, role]);
        console.log("User inserted into database:", email);
    } catch (error) {
        console.error("Error inserting user:", error);
        throw error;
    }
};

module.exports = { createUser };
