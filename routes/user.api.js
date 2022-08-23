const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUser,
  assignTask,
  unAssignTask,
  getUserTask,
} = require("../controllers/user.controller.js");
const { body, query, oneOf } = require("express-validator");
// const { sendResponse } = require("../helpers/utils.js");
const { validate } = require("../middlewares/validator.js");

/**
 * @route GET API/users
 * @description Get a list of users
 * @access private
 */
router.get("/", getAllUser);

/**
 * @route GET api/users/:id
 * @description Get user by id
 * @access public
 */
router.get("/:userTarget", getUserTask);

/**
 * @route POST api/users
 * @description Create new user
 * @access private, assigner
 */

router.post(
  "/",
  validate([
    body("name", "Invalid name").exists().notEmpty().trim().toLowerCase(),
  ]),
  // body("name", "Invalid name").exists().notEmpty().trim().escape(),
  createUser
);

/**
 * @route PUT api/user/:id
 * @description Update user by id
 * @access public, assigner
 */
router.put("/:userName/assign", assignTask);
router.put("/:userName/unassign", unAssignTask);

/**
 * @route DELETE api/users/:id
 * @description Delete a user by id
 * @access private
 */
module.exports = router;
