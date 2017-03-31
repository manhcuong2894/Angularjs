/**
 * RightGroupController
 *
 * @description :: Server-side logic for managing rightgroups
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jsonwebtoken');
var SECRET = process.env.tokenSecret || "4ukI0uIVnB3iI1yxj646fVXSE3ZVk4doZgz6fTbNg7jO41EAtl20J5F7Trtwe7OM";

module.exports = {

  // Get All RightGroup
  getAllRightGroup: function (req, res) {
    RightGroup.find({status: 1}).exec(function (err, result) {
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
    })
  },

  // Get All RightGroup Containing User
  getRightGroupSelect: function (req, res) {
    RightGroup.find({status: 1})
      .populate('roleId_user',
        {
          where: {
            status: 1
          }
        })
      .exec(function (err, result) {
        if (!err) {
          res.status(200).json({
            message: '',
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

  // Get All RightGroup By Manager
  getRightGroupSelectByManager: function (req, res) {
    RightGroup.find({status: 1})
      .populate('roleId_user',
        {
          where: {
            status: 1,
            manager: '1'
          }
        })
      .exec(function (err, result) {
        if (!err) {
          res.status(200).json({
            message: '',
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

  // Get All RightGroup Containing User
  getRightGroupSelect1: function (req, res) {
    var decoded = jwt.verify(req.headers.authorization.split('JWT ').pop(), SECRET);

    RightGroup.find({status: 1})
      .populate('roleId_user',
        {
          where: {
            status: 1,
            roleId: parseInt(decoded.user.roleId)
          }
        })
      .exec(function (err, result) {
        console.log(result);
        if (!err) {
          res.status(200).json({
            message: '',
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

  /*Search RightGroup By Group Name*/

  searchRightGroupByGroupName: function (req, res) {
    var groupName = req.param('group_name');
    var page = req.param('page');
    var limit = req.param('limit');

    RightGroup.pagify('items', {
      findQuery: {'groupName': {'like': '%' + groupName + '%'}, ID: {'!': 10}},
      sort: ['NgayTao DESC'],
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
      res.status(400).json({
        message: 'Not found',
        status: 0,
        data: {},
        total: 0
      });
    });
  },

  /*User add new Right Group combine with features*/
  addRightGroup: function (req, res) {
    var groupName = req.body.groupName;
    var groupDesc = req.body.description;
    var status = req.body.status;
    var createBy = req.body.createBy;
    var createAt = new Date();
    var featuresOfGroup = req.body.features;    // Array data of features [2,3,10]


    RightGroup.find({groupName: req.body.groupName})
      .exec(function (err, services) {
        if (err) {
          return res.negotiate(err);
        }
        if (services.length) {
          res.status(400);
          return res.json({
            status: 5,
            message: 'Tên nhóm quyền đã tồn tại'
          });
        } else {
          RightGroup.create({
            groupName: groupName,
            description: groupDesc,
            status: status,
            createBy: createBy,
            createAt: createAt
          }).exec(function (err, rightGroup) {
            if (err) {
              return res.serverError(err);
            } else {
              rightGroup.features.add(featuresOfGroup);

              rightGroup.save(function (err) {
                //return res.serverError(err);
              });

              res.status(200).json({
                message: 'Group has been successfully added.',
                status: 1,
                data: rightGroup
              });
            }
          })
        }
      });
  },

  /*Get all RightGroup*/
  listRightGroup: function (req, res) {
    RightGroup.find()
      .exec(function (err, records) {
        if (err) {
          return res.serverError(err);
        }
        if (!records) {
          return res.notFound('Could not find records.');
        }
        return res.json({
          message: 'Successful',
          status: 1,
          data: records
        });
      });
  },

  /*Get RightGroup By ID For User*/
  getRightGroupByIdForUser: function (req, res) {
    var idOfRightGroup = req.param('id');

    existOrNot(res, idOfRightGroup, function () {
      RightGroup.find(idOfRightGroup)
        .populate('roleId_user')
        .exec(function (err, records) {
          if (err) {
            return res.serverError(err);
          }
          if (!records) {
            return res.notFound('Could not find records.');
          }
          return res.json({
            message: 'Successful.',
            status: 1,
            data: records
          });
          return;
        });
    });
  },

  /*Get RightGroup By ID For Setup Permission*/
  getRightGroupByIdForPermission: function (req, res) {
    var idOfRightGroup = req.param('id');

    existOrNot(res, idOfRightGroup, function () {
      RightGroup.find(idOfRightGroup)
        .populate('features')
        .exec(function (err, records) {
          if (err) {
            return res.serverError(err);
          }
          if (!records) {
            return res.notFound('Could not find records.');
          }
          return res.json({
            message: 'Successful.',
            status: 1,
            data: records
          });
          return;
        });
    });
  },

  /*Get RightGroup By ID*/
  getRightGroupByID: function (req, res) {
    var idOfRightGroup = req.param('id');
    var objectTMP = {};
    var arrTMP = [];
    var arr1 = [];
    var arr10 = [];
    var arr13 = [];
    var arr17 = [];
    var arr23 = [];
    var arr29 = [];

    existOrNot(res, idOfRightGroup, function () {
      RightGroup.find(idOfRightGroup)
        .populate('features')
        .exec(function (err, records) {
          if (err) {
            return res.serverError(err);
          }
          if (!records) {
            return res.notFound('Could not find records.');
          }

          records.forEach(function (value) {
            objectTMP.ID = value.id;
            objectTMP.groupName = value.groupName;
            objectTMP.groupDesc = value.description;
            objectTMP.createAt = value.createAt;
            objectTMP.editedAt = value.editedAt;
            objectTMP.createBy = value.createBy;
            objectTMP.editedBy = value.editedBy;
            objectTMP.status = value.status;

            (value.features).forEach(function (value) {

              // console.log('id: ' + value.featureFather);
              if (value.featureFather == '1') {
                arr1.push(value.id);
              }
              if (value.featureFather == '10') {
                arr10.push(value.id);
              }
              if (value.featureFather == '13') {
                arr13.push(value.id);
              }
              if (value.featureFather == '17') {
                arr17.push(value.id);
              }
              if (value.featureFather == '23') {
                arr23.push(value.id);
              }
              if (value.featureFather == '29') {
                arr29.push(value.id);
              }
            });

            checkArrayAndPushData(arrTMP, arr1, {"rightgroups1": arr1});
            checkArrayAndPushData(arrTMP, arr10, {"rightgroups10": arr10});
            checkArrayAndPushData(arrTMP, arr13, {"rightgroups13": arr13});
            checkArrayAndPushData(arrTMP, arr17, {"rightgroups17": arr17});
            checkArrayAndPushData(arrTMP, arr23, {"rightgroups23": arr23});
            checkArrayAndPushData(arrTMP, arr29, {"rightgroups29": arr29});

          });

          // console.log('arrTMP: ' + arrTMP);

          return res.json({
            message: 'Successful.',
            status_code: 1,
            features: arrTMP,
            ID: objectTMP.ID,
            groupName: objectTMP.groupName,
            description: objectTMP.groupDesc,
            createAt: objectTMP.createAt,
            editedAt: objectTMP.editedAt,
            createBy: objectTMP.createBy,
            editedBy: objectTMP.editedBy,
            status: objectTMP.status
          });

          // console.log('arrTmp: '+ arrTMP);
          return;
        });
    })
  },

  /*Update RightGroup By ID*/
  updateByID: function (req, res) {
    var id = parseInt(req.body.id);
    var groupName = req.body.groupName;
    var description = req.body.description;
    var status = parseInt(req.body.status);
    var editedBy = req.body.editedBy;
    var editedAt = req.body.editedAt;
    var featuresOfGroup = req.body.features;    // Array data of features [2,3,10]

    existOrNot(res, id, function () {
      RightGroup.update({id: id}, {
        description: description,
        groupName: groupName,
        status: status,
        editedBy: editedBy,
        editedAt: new Date(),
        features: featuresOfGroup
      }).exec(function afterwards(err, updated) {
        if (err) {
          return res.negotiate(err);
        }
        res.status(200).json({
          message: 'Information has been successfully updated.',
          status: 1,
          data: {}
        });
        return;
      });
    })
  },

  /*Delete RightGroup By ID*/
  deleteByID: function (req, res) {
    var id = req.param('id');
    existOrNot(res, id, function () {
      RightGroup.destroy({id: id})
        .exec(function (err) {
          if (err) {
            return res.negotiate(err);
            return;
          }
          res.status(200).json({
            message: 'RightGroup has been successfully deleted.',
            status: 1,
            data: {}
          });
          return;
        })
    })

  }
};

/*_________START_Helper*/

/*Check record exist or not*/
function existOrNot(res, id, doneChecking) {
  RightGroup.count(id).exec(function countCB(error, found) {
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

/*Check Array Is Empty Or not*/
function checkArrayAndPushData(mainArr, arrTmp, data) {
  if (typeof arrTmp !== 'undefined' && arrTmp.length > 0) {
    mainArr.push(data);
  }
}

/*END_Helper_________*/
