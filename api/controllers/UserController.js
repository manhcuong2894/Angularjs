/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";

module.exports = {

  // Add new User
  createUser: function (req, res) {

    data = JSON.parse(req.param('data'));
    data.createAt = new Date();

    if (req.method === 'GET') {
      return res.json({'status': 'GET not allowed'});
      //	Call to /upload via GET is error
    }

    if (req._fileparser.upstreams.length == 0) {
      add_new_user(data, req, res);
    } else {
      if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'png' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'jpg' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'PNG' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'JPG') {
        return new Promise(function () {
          req.file('uploadFile').upload({
            // dirname: require('path').resolve(sails.config.appPath, 'assets/images/avatar'),
            dirname: '../../.tmp/public/images/avatar',
            saveAs: data.username + '.' + req.file('uploadFile')._files[0].stream.filename.split('.').pop(),
            maxBytes: 4000000
          }, function whenDone(err, uploadedFiles) {

            if (req._fileparser.form.bytesExpected > 4000000) {
              return res.json({
                status: 0,
                message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
              });
            }

            if (err) {
              return res.send(500, err);
            } else {
              data.avatar = data.username + '.' + req.file('uploadFile')._files[0].stream.filename.split('.').pop();
              // data.avatar = (uploadedFiles[0].filename).toString();
            }

            add_new_user(data, req, res);

          });
        });
      } else {
        return res.json({
          status: 0,
          message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
        });
      }
    }

    // var username = req.body.user_name;
    // var fullName = req.body.full_name;
    // var email = req.body.email;
    // var phoneNumber = req.body.phone_number;
    // var password = req.body.password;
    // var roleId = req.body.role_id;
    // var status = req.body.status;
    // var createBy = req.body.create_by;
    // var createAt = new Date();
    //
    // User.find({username: req.body.user_name})
    //   .exec(function (err, result) {
    //     if (err) {
    //       return res.negotiate(err);
    //     }
    //     if (result.length) {
    //       res.status(400);
    //       return res.json({
    //         status: 5,
    //         message: 'Tên đăng nhập đã tồn tại'
    //       });
    //     } else {
    //       User.create({
    //         username: username,
    //         fullName: fullName,
    //         email: email,
    //         phoneNumber: phoneNumber,
    //         password: password,
    //         roleId: roleId,
    //         status: status,
    //         createBy: createBy,
    //         createAt: createAt
    //       }).exec(function (err, user) {
    //         if (err) {
    //           return res.serverError(err);
    //         } else {
    //           user.save(function (err) {
    //             return res.serverError(err);
    //           });
    //
    //           res.status(200).json({
    //             message: 'User create successfully.',
    //             status: 1,
    //             data: user
    //           });
    //         }
    //       })
    //     }
    //   });
  },

  // Get All User
  getAllUser: function (req, res) {
    var username = req.param('username');
    var email = req.param('email');
    var roleId = req.param('roleId');
    var status = req.param('status');
    var page = req.param('page');
    var limit = req.param('limit');

    var decoded = jwt.verify(req.headers.authorization.split('JWT ').pop(), SECRET);
    console.log(decoded.user.id);

    User.pagify('items', {
      findQuery: {
        username: {'like': '%' + username + '%'},
        email: {'like': '%' + email + '%'},
        roleId: {'like': '%' + roleId + '%'},
        status: {'like': '%' + status + '%'},
        id: {'!': decoded.user.id}
      },
      sort: ['createAt DESC'],
      populate: ['roleId'],
      page: parseInt(page),
      perPage: parseInt(limit)
    }).then(function (data) {
      res.status(200).json({
        message: 'success',
        status: 1,
        data: data.items,
        total: data.meta.paginate.totalCount
      });
    }).catch(function (err) {
      console.log(err);
      res.status(400).json({
        message: 'Not found',
        status: 0,
        data: {}
      })
    });
  },

  // Get User By Id
  getUserById: function (req, res) {
    var id = req.param('id');

    User.findOne({id: id}).populate('roleId').exec(function (err, result) {
      if (!err) {
        res.status(200).json({
          message: 'success',
          status: 1,
          data: result
        });
      } else {
        res.status(400).json({
          message: 'Not found',
          status: 0,
          data: {}
        });
      }
    });
  },

  // Update User
  updateUser: function (req, res) {

    data = JSON.parse(req.param('data'));
    data.editedAt = new Date();

    if (req.method === 'GET') {
      return res.json({'status': 'GET not allowed'});
      //	Call to /upload via GET is error
    }

    if (req._fileparser.upstreams.length == 0) {
      update_user(data, req, res);
    } else {
      if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'png' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'jpg' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'PNG' || req.file('uploadFile')._files[0].stream.filename.split('.').pop() == 'JPG') {
        return new Promise(function () {
          req.file('uploadFile').upload({
            dirname: '../../.tmp/public/images/avatar',
            saveAs: data.username + '.' + req.file('uploadFile')._files[0].stream.filename.split('.').pop(),
            maxBytes: 4000000
          }, function whenDone(err, uploadedFiles) {

            if (req._fileparser.form.bytesExpected > 4000000) {
              return res.json({
                status: 0,
                message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
              });
            }

            if (err) {
              return res.send(500, err);
            } else {
              data.avatar = data.username + '.' + req.file('uploadFile')._files[0].stream.filename.split('.').pop();
            }

            update_user(data, req, res);

          });
        });
      } else {
        return res.json({
          status: 0,
          message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
        });
      }
    }


    // var id = req.param('id');
    // var username = req.body.username;
    // var fullName = req.body.fullName;
    // var email = req.body.email;
    // var phoneNumber = req.body.phoneNumber;
    // var password = req.body.password;
    // var roleId = req.body.roleId;
    // var status = req.body.status;
    // var editedBy = req.body.editedBy;
    // var editedAt = new Date();
    //
    // User.find({
    //   username: req.body.user_name,
    //   id: {'!': id}
    // })
    //   .exec(function (err, result) {
    //     if (err) {
    //       return res.negotiate(err);
    //     }
    //     if (result.length) {
    //       res.status(400);
    //       return res.json({
    //         status: 5,
    //         message: 'Tên đăng nhập đã tồn tại'
    //       });
    //     } else {
    //       User.update({id: id}, {
    //         username: username,
    //         fullName: fullName,
    //         email: email,
    //         phoneNumber: phoneNumber,
    //         password: password,
    //         roleId: roleId,
    //         status: status,
    //         editedBy: editedBy,
    //         editedAt: editedAt
    //       }).exec(function (err, user) {
    //         if (!err) {
    //           res.status(200).json({
    //             message: 'Update success',
    //             data: user
    //           });
    //         } else {
    //           res.status(400).json({
    //             message: 'Not found',
    //             status: err.status
    //           });
    //         }
    //       });
    //     }
    //   });
  },

  // Delete User By Id
  deleteUser: function (req, res) {
    var id = req.param('id');

    User.destroy({id: id})
      .exec(function (err) {
        if (err) {
          return res.negotiate(err);
        }
        res.status(200).json({
          message: 'User has been successfully deleted.',
          status: 1,
          data: {}
        });
      })
  },

  // Reset Password
  resetPassword: function (req, res) {
    var id = req.param('id');
    var password = req.body.password;

    User.update({id: id}, {
      password: password
    }).exec(function (err, result) {
      if (!err) {
        res.status(200).json({
          message: 'Update password success',
          data: result
        });
      } else {
        res.status(400).json({
          message: 'Not found',
          status: err.status
        });
      }
    });
  },

  // Approval Status User
  approvalStatusUser: function (req, res) {
    var id = req.param('id');

    User.findOne({id: id}).exec(function (err, users) {
      if (!err) {
        if (users.status === 1) {
          User.update({id: users.id}, {status: 0}).exec(function (err, result) {
            if (!err) {
              res.status(200).json({
                message: 'Update success',
                data: result
              });
            } else {
              res.status(400).json({
                message: 'Not found',
                status: err.status
              });
            }
          });
        } else {
          User.update({id: users.id}, {status: 1}).exec(function (err, result) {
            if (!err) {
              res.status(200).json({
                message: 'Update success',
                data: result
              });
            } else {
              console.log(err);
              res.status(400).json({
                message: 'Not found',
                status: err.status
              });
            }
          });
        }
      } else {
        res.status(400).json({
          message: 'Not found',
          status: 0,
          data: {}
        });
      }
    });
  },

  // Change Password
  changePassword: function (req, res) {
    var id = req.param('id');
    var current_pass = req.body.current_pass;
    var new_pass = req.body.new_pass;

    User.findOne({id: id}).exec(function (err, users) {
      if (!err) {

        bcrypt.compare(current_pass, users.password, function (err, ress) {
          console.log(ress);
          if (ress == true) {
            if (current_pass == new_pass) {
              res.status(400).json({
                message: 'Mật khẩu mới trùng giá trị với mật khẩu hiện tại',
                status: 0
              });
            } else {
              User.update({id: users.id}, {
                password: new_pass
              }).exec(function (err, result) {
                if (!err) {
                  res.status(200).json({
                    message: 'Thay đổi mật khẩu thành công',
                    data: result
                  });
                } else {
                  res.status(400).json({
                    message: 'Thay đổi mật khẩu không thành công',
                    status: 0
                  });
                }
              });
            }
          } else {
            res.status(400).json({
              message: 'Mật khẩu hiện tại không chính xác',
              status: 0
            });
          }
        });
      } else {
        res.status(400).json({
          message: 'Not found',
          status: 0,
          data: {}
        });
      }
    });
  }

};

// function add new user
function add_new_user(data, req, res) {

  User.find({username: data.username})
    .exec(function (err, result) {
      if (err) {
        return res.negotiate(err);
      }
      if (result.length) {
        res.status(400);
        return res.json({
          status: 5,
          message: 'Tên đăng nhập đã tồn tại'
        });
      } else {
        User.create(data).exec(function (err, user) {
          if (err) {
            return res.serverError(err);
          } else {
            user.save(function (err) {
              return res.serverError(err);
            });

            res.status(200).json({
              message: 'User create successfully.',
              status: 1,
              data: user
            });
          }
        })
      }
    });
}

// function update user
function update_user(data, req, res) {
  var id = req.param('id');

  User.find({
    username: data.username,
    id: {'!': id}
  })
    .exec(function (err, result) {
      if (err) {
        return res.negotiate(err);
      }
      if (result.length) {
        res.status(400);
        return res.json({
          status: 5,
          message: 'Tên đăng nhập đã tồn tại'
        });
      } else {
        User.update({id: id}, data).exec(function (err, user) {
          if (!err) {
            res.status(200).json({
              message: 'Update success',
              data: user
            });
          } else {
            res.status(400).json({
              message: 'Not found',
              status: err.status
            });
          }
        });
      }
    });

  // User.find({
  //   username: data.username,
  //   id: {'!': id}
  //   })
  //   .exec(function (err, result) {
  //     if (err) {
  //       return res.negotiate(err);
  //     }
  //     if (result.length) {
  //       res.status(400);
  //       return res.json({
  //         status: 5,
  //         message: 'Tên đăng nhập đã tồn tại'
  //       });
  //     } else {
  //       User.create(data).exec(function (err, user) {
  //         if (err) {
  //           return res.serverError(err);
  //         } else {
  //           user.save(function (err) {
  //             return res.serverError(err);
  //           });
  //
  //           res.status(200).json({
  //             message: 'User create successfully.',
  //             status: 1,
  //             data: user
  //           });
  //         }
  //       })
  //     }
  //   });
}

/*_________START_Helper*/

/*Check record exist or not*/
function existOrNot(res, id, doneChecking) {
  User.count(id).exec(function countCB(error, found) {
    if (error) {
      return res.serverError(err);
      return;
    }
    if (found == 0) {
      res.badRequest('The record does not exist');
      return;
    }
    doneChecking();
  });
}

/*Check Object Is Empty or Not*/
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

/*END_Helper_________*/
