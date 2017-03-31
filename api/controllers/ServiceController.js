/**
 * ServiceController
 *
 * @description :: Server-side logic for managing services
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  // Add new Service
  createService: function (req, res) {
    var shortName = req.body.short_name;
    var serviceName = req.body.service_name;
    var status = req.body.status;
    var description = req.body.description;
    var sla = req.body.sla;
    var number = req.body.number;
    var createBy = req.body.create_by;
    var createAt = new Date();

    Service.find({shortName: req.body.short_name})
      .exec(function (err, services) {
        if (err) {
          return res.negotiate(err);
        }
        if (services.length) {
          res.status(400);
          return res.json({
            status: 5,
            message: 'Tên ngắn gọn đã tồn tại'
          });
        } else {
          Service.create({
            shortName: shortName,
            serviceName: serviceName,
            status: status,
            description: description,
            createAt: createAt,
            createBy: createBy,
            sla: sla,
            number: number
          }).exec(function (err, service) {
            if (err) {
              return res.serverError(err);
            } else {
              service.save(function (err) {
                return res.serverError(err);
              });

              res.status(200).json({
                message: 'Service create successfully.',
                status: 1,
                data: service
              });
            }
          });
        }
      });
  },

  // Get All Service
  getAllService: function (req, res) {
    var shortName = req.param('short_name');
    var page = req.param('page');
    var limit = req.param('limit');

    Service.pagify('items', {
      findQuery: {'shortName': {'like': '%' + shortName + '%'}},
      sort: ['createAt DESC'],
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
        data: {}
      });
    });
  },

  // Get All Service No Paging
  getAllServiceNoPaging: function (req, res) {
    Service.find({
      status: 1,
      sort: 'shortName ASC'
    }).exec(function (err, result) {
      if (!err) {
        res.status(200).json({
          message: 'success',
          status: 1,
          data: result
        });
      } else {
        res.status(200).json({
          message: 'Not found',
          status: 0,
          data: {}
        })
      }
    });
  },

  // Get Service By Id
  getServiceById: function (req, res) {
    var id = req.param('id');

    Service.findOne({id: id}).exec(function (err, result) {
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

  // Update Service By Id
  updateService: function (req, res) {
    var id = req.param('id');

    var shortName = req.body.shortName;
    var serviceName = req.body.serviceName;
    var status = req.body.status;
    var description = req.body.description;
    var editedAt = new Date();
    var editedBy = req.body.editedBy;
    var sla = req.body.sla;
    var number = req.body.number;

    console.log(req.body.editedBy);

    Service.find({
      shortName: req.body.shortName,
      id: {'!': id}
    })
      .exec(function (err, services) {
        if (err) {
          return res.negotiate(err);
        }
        if (services.length) {
          res.status(400);
          return res.json({
            status: 5,
            message: 'Tên ngắn gọn đã tồn tại'
          });
        } else {
          Service.update({id: id}, {
            shortName: shortName,
            serviceName: serviceName,
            status: status,
            description: description,
            editedAt: editedAt,
            editedBy: editedBy,
            sla: sla,
            number: number
          }).exec(function (err, result) {
            if (!err) {
              res.status(200).json({
                message: 'Update service successfully',
                data: result
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
  },

  // Approval Status Service By Id
  approvalStatusService: function (req, res) {
    var id = req.param('id');

    Service.findOne({id: id}).exec(function (err, services) {
      if (!err) {
        if (services.status === 1) {
          Service.update({id: services.id}, {status: 0}).exec(function (err, result) {
            if (!err) {
              res.status(200).json({
                message: 'Approval service successfully',
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
          Service.update({id: services.id}, {status: 1}).exec(function (err, result) {
            if (!err) {
              res.status(200).json({
                message: 'Approval service successfully',
                data: result
              });
            } else {
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
  }
};

