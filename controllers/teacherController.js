const Teacher  = require('../models/teacherModel');
const factory = require('./handlerFactory');

exports.createTeacher = factory.createOne(Teacher);
exports.deleteTeacher = factory.deleteOne(Teacher);
exports.updateTeacher = factory.updateOne(Teacher);
exports.getTeacher = factory.getOne(Teacher);
exports.getAllTeachers = factory.getAll(Teacher);
