const { default: mongoose } = require("mongoose");
const { sendResponse, AppError } = require("../helpers/utils");
const User = require("../models/User.js");
// const { body, validationResult } = require("express-validator");

const userController = {};

//Create a User
userController.createUser = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const info = req.body;
  try {
    //mongoose query
    const user = await User.findOne({ name: info.name });
    if (user)
      throw new AppError(409, "User already exists", "Create User Error");

    const created = await User.create(info);
    sendResponse(
      res,
      200,
      true,
      { data: created },
      null,
      "Creat user successfuly!"
    );
  } catch (error) {
    next(error);
  }
};

userController.getAllUser = async (req, res, next) => {
  try {
    let { page, limit, name, ...filterQuery } = req.query;
    const allowFilter = ["name"];
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = limit * (page - 1);
    //handel query
    const filterKey = Object.keys(filterQuery);
    filterKey.forEach((key) => {
      if (!allowFilter.includes(key))
        throw new AppError(400, "Query is validation", "Query error");
    });

    const filterConditions = name
      ? { name: name, isDeleted: false }
      : { isDeleted: false };

    //handel existance user
    const listOfUser = await User.find(filterConditions).populate("task");
    if (listOfUser.length === 0)
      throw new AppError(400, "User not exists", "Get user error");

    sendResponse(
      res,
      200,
      true,
      {
        data:
          listOfUser.length <= limit
            ? listOfUser
            : listOfUser.slice(offset, offset + limit),
        page: page,
        total: listOfUser.length,
      },
      null,
      "Get all users"
    );
  } catch (error) {
    next(error);
  }
};

userController.getUserTask = async (req, res, next) => {
  try {
    const { userTarget } = req.params;
    let userDetail = {};
    if (mongoose.isValidObjectId(userTarget)) {
      userDetail = await User.findOne({
        $or: [
          { _id: mongoose.Types.ObjectId(userTarget) },
          { name: userTarget },
        ],
      }).populate("task");
    } else {
      userDetail = await User.findOne({
        $or: [{ name: userTarget }],
      }).populate("task");
    }

    sendResponse(res, 200, true, { data: userDetail }, null, `Get detail task`);
  } catch (error) {
    next(error);
  }
};

userController.assignTask = async (req, res, next) => {
  try {
    const { userName } = req.params;
    const { ref } = req.body;

    let check = await User.findOne({ name: userName });
    if (check.task.includes(ref))
      throw new AppError(404, "User haven this task");
    let found = await User.findOneAndUpdate(
      { name: userName },
      { $push: { task: ref } },
      { new: true }
    ).sort({ updateAt: -1 });
    sendResponse(res, 200, true, { data: found }, null, "Assign task success!");
  } catch (error) {
    next(error);
  }
};

userController.unAssignTask = async (req, res, next) => {
  try {
    const { userName } = req.params;
    let { ref } = req.body;
    let check = await User.findOne({ name: userName });
    if (!check.task.includes(ref))
      throw new AppError(404, "User have not task", "UnAssign error");
    const result = check.task.filter((e) => e.toString() !== ref);

    let found = await User.findOneAndUpdate(
      { name: userName },
      { task: result },
      { new: true }
    );

    sendResponse(
      res,
      200,
      true,
      { data: found },
      null,
      "Unassign task success!"
    );
  } catch (error) {
    next(error);
  }
};
module.exports = userController;
