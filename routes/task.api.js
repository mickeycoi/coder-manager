const express = require("express");
const router = express.Router();
const { validate } = require("../middlewares/validator.js");
const {
  createTask,
  getAllTask,
  getTaskDetail,
  updateTaks,
  deletedTask,
} = require("../controllers/task.controller.js");
const { body, query, param } = require("express-validator");

/**
 * @route GET API/tasks
 * @description Get a list of tasks
 * @access private
 */
router.get("/", getAllTask);
/**
 * @route GET api/tasks/:id
 * @description Get task by id
 * @access public
 */
router.get("/:taskTarget", getTaskDetail);

/**
 * @route POST api/tasks
 * @description Create new task
 * @access private, assigner
 */
router.post(
  "/",
  validate([
    body("name", "Invalid Task").exists().notEmpty().trim().toLowerCase(),
    body("description", "Invalid description")
      .exists()
      .notEmpty()
      .trim()
      .toLowerCase(),
  ]),
  createTask
);
/**
 * @route PUT api/tasks/:id
 * @description Update task by id
 * @access public, assigner
 */
router.put(
  "/:taskName",
  validate([
    body("status").isIn(["pending", "working", "review", "done", "archive"]),
  ]),
  updateTaks
);
/**
 * @route DELETE api/tasks/:id
 * @description Delete a task by id
 * @access private
 */

router.delete("/:taskName", deletedTask);
module.exports = router;
