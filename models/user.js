var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var sha1 = require('sha1');
var SALT_WORK_FACTOR = 10;
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    master: {
        type: Boolean,
        required: false,
        default: false
    },
    odin: {
        type: Boolean,
        required: false,
        default: false
    }
});
UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.changePass = function (id,newPass,oldPass,cb){
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) cb(err);
    bcrypt.hash(newPass, salt, function(err, hash) {
      User.findOneAndUpdate({_id:id},{password:hash},function(err,u){
      if (err) {cb(err);}
      cb(null,true);
  });
});
  });
};
// Reset User
module.exports.resetUser = function(id, options, callback) {
        var query = {
            _id: id
        };
        var update = {
            password: sha1('password')
        };
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) throw err;
            bcrypt.hash(update.password, salt, function(err, hash) {
                if (err) throw err;
                update.password = hash;
                User.findOneAndUpdate(query, update, options, callback);
            });
        });
    }
    // Add User
module.exports.addUser = function(name, isMaster,callback) {
    var user = {
        username: name,
        password: sha1('password'),
        master: isMaster,
        odin:false
    }
    // bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //     if (err) throw err;
    //     bcrypt.hash(user.password, salt, function(err, hash) {
    //         if (err) throw err;
    //         user.password = hash;
            User.create(user, callback);
        // });
    // });
}

module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
}

module.exports.removeUser = function(id, callback) {
    var query = {
        _id: id
    };
    User.remove(query, callback);
}
