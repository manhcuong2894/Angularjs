/**
 * DocumentController
 *
 * @description :: Server-side logic for managing documents
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');

module.exports = {

  // Add New Document
  createDocument: function (req, res) {
    data = JSON.parse(req.param('data'));
    data.uploadDate = new Date();

    if (req.method === 'GET')
      return res.json({'status': 'GET not allowed'});
    //	Call to /upload via GET is error

    console.log(req.file('uploadFile'));

    if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() != 'exe') {

      return new Promise(function () {
        req.file('uploadFile').upload({
          dirname: '../../upload/document',
          maxBytes: 20000000
        }, function whenDone(err, uploadedFiles) {

          if (req._fileparser.form.bytesExpected > 20000000) {
            return res.json({
              status: 0,
              message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
            });
          }

          if (err) {
            return res.send(500, err);
          } else {
            data.file = (uploadedFiles[0].fd).toString();
            data.fileNameDownload = (uploadedFiles[0].filename).toString();
          }

          add_new_document(data, req, res);

        });
      });
    } else {
      return res.json({
        status: 0,
        message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
      });
    }
  },

  // Get All Document
  getAllDocument: function (req, res) {
    var fileName = req.param('file_name');
    var serviceId = req.param('service_id');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var page = req.param('page');
    var limit = req.param('limit');

    Document.query('CALL proc_getdocument("' + fileName + '","' + serviceId + '","' + startDate + '","' + endDate + '","' + page + '","' + limit + '", @total)', function (err, result) {
      if (!err) {
        if (result[0].length > 0) {
          res.status(200).json({
            message: 'success',
            status: 1,
            total: result[0][0].RowCount,
            data: result[0]
          });
        } else {
          res.status(200).json({
            message: 'success',
            status: 1,
            total: 0,
            data: result[0]
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

    // var jsonQuery = {
    //   fileName: {'like': '%' + fileName + '%'},
    //   service: {'like': '%' + serviceId + '%'},
    //   uploadDate: {'>': new Date(startDate), '<': new Date(endDate)}
    // };
    //
    // if ((startDate == '' || startDate == null) && (endDate == '' || endDate == null)) {
    //   jsonQuery = {
    //     fileName: {'like': '%' + fileName + '%'},
    //     service: {'like': '%' + serviceId + '%'}
    //   };
    // } else if ((startDate == '' || startDate == null) && (endDate != '' && endDate != null)) {
    //   jsonQuery = {
    //     fileName: {'like': '%' + fileName + '%'},
    //     service: {'like': '%' + serviceId + '%'},
    //     uploadDate: {'<': new Date(endDate)}
    //   };
    // }
    //
    // console.log(dateString2Date(startDate));
    // console.log(dateString2Date(endDate));
    //
    // Document.pagify('items', {
    //   findQuery: jsonQuery,
    //   sort: ['uploadDate DESC'],
    //   populate: ['service', 'uploadPerson'],
    //   page: parseInt(page),
    //   perPage: parseInt(limit)
    // }).then(function (data) {
    //   res.status(200).json({
    //     message: 'success',
    //     status: 1,
    //     data: data.items,
    //     total: data.meta.paginate.totalCount
    //   });
    // }).catch(function (err) {
    //   res.status(400).json({
    //     message: 'Not found',
    //     status: 0,
    //     data: {}
    //   })
    // });
  },

  // Download Document
  downloadDocument: function (req, res) {
    Document.findOne(req.param('id')).exec(function (err, document) {
      if (err) return res.negotiate(err);
      if (!document) return res.notFound();

      // User has no avatar image uploaded.
      // (should have never have hit this endpoint and used the default image)
      if (!document.file) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk(/* optional opts */);

      // set the filename to the same file as the user uploaded
      res.set("Content-disposition", 'attachment; filename="' + document.fileNameDownload + '"');

      // Stream the file down
      fileAdapter.read(document.file)
        .on('error', function (err) {
          return res.serverError(err);
        })
        .pipe(res);
    });
  },

  // Delete Document By Id
  deleteDocument: function (req, res) {
    Document.findOne(req.param('id')).exec(function (err, document) {
      if (!document) {
        return res.notFound();
      }

      if (err) {
        return res.negotiate(err);
      } else {
        if (document.file == '' && document.file == null) {
          Document.destroy(document.id).exec(function (err, document) {
            if (err) {
              return res.negotiate(err);
            } else {
              return res.json({
                'message': 'Success',
                'status': 'Delete 1 record successfully!'
              });
            }
          });
        } else {
          Document.destroy(document.id).exec(function (err, document) {
            if (err) {
              return res.negotiate(err);
            } else {
              return res.json({
                'message': 'Success',
                'status': 'Delete 1 record successfully!'
              });
            }
          });
          fs.unlink(document.file);
        }
      }
    });
  }
};

function dateString2Date(dateString) {
  var dt  = dateString.split(/\/|\s/);
  console.log(dt[1] + '/' + dt[0] + '/' + dt[2]);
  return new Date(dt[1] + '/' + dt[0] + '/' + dt[2]);
}

function add_new_document(data, req, res) {
  Document.create(data).exec(function (err, result) {
    if (!err) {
      res.status(200).json({
        message: 'Create success',
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

