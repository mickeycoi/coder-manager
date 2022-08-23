const { default: mongoose, Types } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils.js");
const Task = require("../models/Task.js");

const taskController = {};
taskController.createTask = async (req, res, next) => {
  const info = req.body;
  try {
    //mongoose query
    const task = await Task.findOne({ name: info.name });
    if (task)
      throw new AppError(409, "Task already exists", "Create Task Error");
    const created = await Task.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Creat task successfuly!"
    );
  } catch (error) {
    next(error);
  }
};

taskController.getAllTask = async (req, res, next) => {
  try {
    let { page, limit, name, status, createdAt, updateAt, description } =
      req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = limit * (page - 1);

    const filter =
      name || status
        ? {
            $or: [
              { name: name, isDeleted: false },
              { status: status, isDeleted: false },
            ],
          }
        : { isDeleted: false };

    const listOfTask = await Task.find(filter).sort({
      createdAt: -1,
      updateAt: -1,
    });
    sendResponse(res, 200, true, {
      data:
        listOfTask.length <= limit
          ? listOfTask
          : listOfTask.slice(offset, offset + limit),
      page: page,
      total: listOfTask.length,
    });
  } catch (error) {
    next(error);
  }
};

taskController.getTaskDetail = async (req, res, next) => {
  try {
    const { taskTarget } = req.params;

    let taskDetail = {};
    if (mongoose.isValidObjectId(taskTarget)) {
      taskDetail = await Task.findOne({
        $or: [
          { _id: mongoose.Types.ObjectId(taskTarget) },
          { name: taskTarget },
        ],
      });
    } else {
      taskDetail = await Task.findOne({
        $or: [{ name: taskTarget }],
      });
    }

    sendResponse(res, 200, true, { data: taskDetail }, null, `Get detail task`);
  } catch (error) {
    next(error);
  }
};

taskController.updateTaks = async (req, res, next) => {
  try {
    const { taskName } = req.params;
    const { status } = req.body;
    // let check = await Task.findOne({ name: taskName, status: "done" });
    // console.log("check", check);
    let check = await Task.findOne({ name: taskName });
    if (status === check.status)
      throw new AppError(404, "Nothing updated", "Update error");
    let find = await Task.findOneAndUpdate(
      { name: taskName },
      {
        status:
          check.status === "done" || check.status === "archive"
            ? "archive"
            : status,
      },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { data: find },
      null,
      "Update status taks success"
    );
  } catch (error) {
    next(error);
  }
};

taskController.deletedTask = async (req, res, next) => {
  try {
    const { taskName } = req.params;
    let find = await Task.findOneAndUpdate(
      { name: taskName },
      { isDeleted: true },
      { new: true }
    );
    sendResponse(
      res,
      200,
      true,
      { data: find },
      null,
      "Deleted task successfully!"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = taskController;
