const express = require("express");
const router = express.Router();
const AdminController = require("../admin/adminController");

router.get("/getUsers", AdminController.getUsers); // Get list of users
router.put("/updateUsers/:id",AdminController.updateUser); // Update user details
router.delete('/deleteUsers/:id', AdminController.deleteUser); // Delete user


module.exports = router;