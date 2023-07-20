const Student = require("../models/studentModel");
const factory = require('./handlerFactory');


exports.createStudent = factory.createOne(Student);
exports.deleteStudent = factory.deleteOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.getStudent = factory.getOne(Student);
exports.getAllStudents = factory.getAll(Student);
