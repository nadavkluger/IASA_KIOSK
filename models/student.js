var mongoose = require('mongoose');

// Product Schema
var studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    room: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: false
    },
    debt: {
        type: Number,
        required: true
    },
    transactions:[
      {
        productName:{
          type: String,
          required: true
        },
        quantity:{
          type: Number,
          required: true
        },
        productPrice:{
          type: Number,
          required: true
        },
        time:{
          type:String,
          required:true
        }
        // striked:{//strikethrough
        //   type:Boolean,
        //   default:false
        //   required:true
        // }
      }
    ]
});

var Student = module.exports = mongoose.model('Student', studentSchema);

// Get Students
module.exports.getStudents = function(callback, limit) {
    Student.find(callback).limit(limit);
}

// Get Student
module.exports.getStudentById = function(id, callback) {
    Student.findById(id, callback);
}

// Update Student
module.exports.updateStudent = function(id, student, options, callback) {
    var query = {
        _id: id
    };
    var update = {
        name: student.name,
        room: student.room,
        phone: student.phone,
        debt: student.debt,
    }
    Student.findOneAndUpdate(query, update, options, callback);
}

// Delete Student
module.exports.removeStudent = function(id, callback) {
    var query = {
        _id: id
    };
    Student.remove(query, callback);
}
