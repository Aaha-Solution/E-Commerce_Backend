const db = require("../db");

class AdminModel {

    static async findByEmail(email) {
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        return rows[0];
    }

    static async getAllUsers() {
        const [rows] = await db.query("SELECT * FROM users"); // fetch all columns
        // Add a merged 'name' field
        return rows.map(user => ({
            ...user,
            name: `${user.firstname} ${user.lastname}`
        }));
    }

    static async findById(id) {
        const sql = "SELECT * FROM users WHERE id = ?";
        const [rows] = await db.query(sql, [id]);
        return rows[0]; // return single user
    }

    static async updateUser(id, firstname, lastname, email, mobile, password, role) {
        const sql = `
    UPDATE users 
    SET firstname = ?, lastname = ?, email = ?, mobile = ?, password = ?, role = ?
    WHERE id = ?
  `;
        const values = [firstname, lastname, email, mobile, password, role, id];
        const [result] = await db.query(sql, values);
        return result;
    }



    static async deleteUser(id) {
        const sql = "DELETE FROM users WHERE id = ?";
        const [result] = await db.query(sql, [id]);
        return result;
    }
}
module.exports = AdminModel;