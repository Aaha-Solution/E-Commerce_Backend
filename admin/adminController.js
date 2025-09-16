const jwt = require("jsonwebtoken");
const AdminModel = require("../admin/adminModels");

class AdminController {

    static async getUsers(req, res) {
        try {
            const users = await AdminModel.getAllUsers();
            // console.log("Fetched users:", users);
            res.json({ users });
        } catch (err) {
            console.error("Error fetching users:", err);
            res.status(500).json({ error: err.message });
        }
    }

    static async updateUser(req, res) {
        try {
            const { id, firstname, lastname, email, mobile, password, role } = req.body;
            // console.log("Update request body:", req.body);

            // Check if user exists
            const user = await AdminModel.findById(id);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            // Update user
            const updatedUser = await AdminModel.updateUser(
                id,
                firstname,
                lastname,
                email,
                mobile,
                password,
                role
            );

            res.json({
                message: "User updated successfully",
                updatedUser,
            });
        } catch (err) {
            console.error("Error during user update:", err);
            res.status(500).json({ error: err.message });
        }
    }
    static async deleteUser(req, res) {
        try {
            const { id } = req.params; // <-- get id from URL
            console.log("Delete request for user ID:", id);

            const user = await AdminModel.findById(id);
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            const deletedUser = await AdminModel.deleteUser(id);
            console.log("Deleted user ID:", id);

            res.json({
                message: "User deleted successfully",
                deletedUser,
            });
        } catch (err) {
            console.error("Error during user deletion:", err);
            res.status(500).json({ error: err.message });
        }
    }

}
module.exports = AdminController;