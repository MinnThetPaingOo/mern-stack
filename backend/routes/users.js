const express = require("express");
const router = express.Router();
const handleErrorMessage = require("../middlewares/handleErrorMessage");
const UserController = require("../controllers/UserController");
const { body } = require("express-validator");
const User = require("../models/User");
const AuthMiddleware = require('../middlewares/AuthMiddleware')

router.post(
    "/login",
    UserController.login
);
router.get(
    "/me",
    AuthMiddleware,
    UserController.me
);
router.post(
    "/logout",
    UserController.logout
);

router.post(
    "/register",
    [
        body("name").notEmpty(),
        body("email").notEmpty(),
        body("email").custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error("E-mail already in use");
            }
        }),
        body("password").notEmpty(),
    ],
    handleErrorMessage,
    UserController.register
);

module.exports = router;
