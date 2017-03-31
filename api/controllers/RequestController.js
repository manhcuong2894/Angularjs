/**
 * RequestController
 *
 * @description :: Server-side logic for managing requests
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var excel = require('node-excel-export');
var nodemailer = require('nodemailer');
var fs = require('fs');
var moment = require('moment');
var util = require('util');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(smtpTransport({
  host: sails.config.emailSettings.host,
  port: sails.config.emailSettings.port,
  secure: true, // use SSL
  auth: {
    user: sails.config.emailSettings.user_name,
    pass: sails.config.emailSettings.password
  }
}));

// function randomString(length, chars) {
//   var result = '';
//   for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
//   return result;
// }

module.exports = {

  // Add New Request
  createRequest: function (req, res) {

    // [{ "service": "36",  "level": "1",   "channel": "1",  "timeRequest": "10-01-2017",  "contact": "Nguyễn Hoàng Đô",  "sla": "1",  "number": "2",  "status": "1", "assigned": "68", "responsible": "68",  "content": "Muốn nâng cấp phần mềm"}]

    /* Params Object JSON Complaint
     * {
     *    "service": "",
     *    "level": "",
     *    "channel": "",
     *    "timeRequest": "",
     *    "contact": "",
     *    "sla": "",
     *    "number": "",
     *    "status": "",
     *    "assigned": "",
     *    "responsible": "",
     *    "content": "",
     *    "file": ""
     * } */

    data = JSON.parse(req.param('data'));
    data.createAt = new Date();

    // data.ticketCode = randomString(10, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789');
    // console.log(data.ticketCode);

    if (req.method === 'GET') {
      return res.json({'status': 'GET not allowed'});
      //	Call to /upload via GET is error
    }

    if (req._fileparser.upstreams.length == 0) {
      add_new_request(data, req, res);
    } else {
      if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() != 'exe') {
        return new Promise(function () {
          req.file('uploadFile').upload({
            dirname: '../../upload/request',
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
              console.log(data);
              data.file = (uploadedFiles[0].fd).toString();
              data.fileName = (uploadedFiles[0].filename).toString();
              add_new_request(data, req, res);
            }

          });
        });
      } else {
        return res.json({
          status: 0,
          message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
        });
      }
    }
  },

  // Get All Request
  getAllRequest: function (req, res) {

    var ticketCode = req.param('ticket_code');
    var serviceId = req.param('service_id');
    var channel = req.param('channel');
    var keyWord = req.param('key_word');
    var level = req.param('level');
    var status = req.param('status');
    var assignedId = req.param('assigned_id');
    var responsibleId = req.param('responsible_id');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var userId = req.param('user_id');
    var page = req.param('page');
    var limit = req.param('limit');

    Request.query('CALL proc_getcomplaint("' + ticketCode + '","' + serviceId + '","' + channel + '","' + keyWord + '","' + level + '","' + status
      + '","' + assignedId + '","' + responsibleId + '","' + startDate + '","' + endDate + '","' + userId
      + '","' + page + '","' + limit + '", @total)', function (err, result) {

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
  },

  // Export All Request
  exportAllRequest: function (req, res) {

    var ticketCode = req.param('ticket_code');
    var serviceId = req.param('service_id');
    var channel = req.param('channel');
    var keyWord = req.param('key_word');
    var level = req.param('level');
    var status = req.param('status');
    var assignedId = req.param('assigned_id');
    var responsibleId = req.param('responsible_id');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var userId = req.param('user_id');
    var page = req.param('page');
    var limit = req.param('limit');

    Request.query('CALL proc_getcomplaint("' + ticketCode + '","' + serviceId + '","' + channel + '","' + keyWord + '","' + level + '","' + status
      + '","' + assignedId + '","' + responsibleId + '","' + startDate + '","' + endDate + '","' + userId
      + '","' + page + '","' + limit + '", @total)', function (err, result) {
      if (!err) {
        var styles = {
          headerDark: {
            fill: {
              fgColor: {
                rgb: 'FF000000'
              }
            },
            font: {
              color: {
                rgb: 'FFFFFFFF'
              },
              sz: 10,
              bold: true,
              underline: true
            }
          },
          cellPink: {
            font: {
              color: {
                rgb: 'FF000000'
              },
              sz: 10
            }
          },
          cellGreen: {
            fill: {
              fgColor: {
                rgb: 'FF00FF00'
              }
            }
          }
        };

        //Here you specify the export structure
        var specification = {
          STT: { // <- the key should match the actual data key
            displayName: 'STT', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.cellPink, // <- Cell style
            width: 30 // <- width in pixels
          },

          ticketCode: { // <- the key should match the actual data key
            displayName: 'Mã ticket', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.cellPink, // <- Cell style
            width: 110 // <- width in pixels
          },

          reception: {
            displayName: 'Ngày tiếp nhận',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 120 // <- width in chars (when the number is passed as string)
          },

          service: {
            displayName: 'Dịch vụ',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 130 // <- width in chars (when the number is passed as string)
          },

          level: {
            displayName: 'Mức độ',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 60, // <- width in pixels
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              switch (value) {
                case 0:
                  return 'Bình thường';
                case 1:
                  return 'Gấp';
                case 2:
                  return 'Rất gấp';
                default:
                  return '';
              }
            }
          },

          channel: {
            displayName: 'Kênh tiếp nhận',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 80 // <- width in pixels
          },

          handlers: {
            displayName: 'Người xử lý',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 90 // <- width in pixels
          },

          responsible: {
            displayName: 'Người chịu TN',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
          },

          status: {
            displayName: 'Tình trạng',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 70, // <- width in pixels
            cellFormat: function (value, row) {
              switch (value) {
                case 1:
                  return 'Open';
                case 2:
                  return 'Update';
                case 3:
                  return 'Pending';
                case 4:
                  return 'Reopen';
                case 5:
                  return 'Closed';
                case 6:
                  return 'Delete';
                default:
                  return '';
              }
            }
          }
        };

        var dataset = [];

        for (var i = 0; i < result[0].length; i++) {
          dataset.push({
            STT: i + 1,
            ticketCode: result[0][i].MaTicket,
            reception: result[0][i].ThoiGianTao,
            service: result[0][i].DichVu,
            level: result[0][i].MucDo,
            channel: result[0][i].KenhTiepNhan,
            handlers: result[0][i].NguoiXuLy,
            responsible: result[0][i].NguoiChiuTrachNhiem,
            status: result[0][i].TinhTrang
          });
        }

        // This function will return Buffer
        var report = excel.buildExport(
          [
            {
              name: 'Sheet name', // <- Specify sheet name (optional)
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        // You can then return this straight
        res.attachment('request.xlsx');
        return res.send(report);
      } else {
        res.status(400).json({
          message: 'Not found',
          status: 0,
          data: {}
        });
      }
    });
  },

  // Get All Request Of Me
  getAllRequestOfMe: function (req, res) {

    var ticketCode = req.param('ticket_code');
    var serviceId = req.param('service_id');
    var channel = req.param('channel');
    var keyWord = req.param('key_word');
    var level = req.param('level');
    var status = req.param('status');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var userId = req.param('user_id');
    var page = req.param('page');
    var limit = req.param('limit');

    Request.query('CALL proc_getmycomplaint("' + ticketCode + '","' + serviceId + '","' + channel + '","' + keyWord + '","' + level + '","' + status
      + '","' + startDate + '","' + endDate + '","' + userId
      + '","' + page + '","' + limit + '", @total)', function (err, result) {

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
  },

  // Export All Request Of Me
  exportAllRequestOfMe: function (req, res) {

    var ticketCode = req.param('ticket_code');
    var serviceId = req.param('service_id');
    var channel = req.param('channel');
    var keyWord = req.param('key_word');
    var level = req.param('level');
    var status = req.param('status');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var userId = req.param('user_id');
    var page = req.param('page');
    var limit = req.param('limit');

    Request.query('CALL proc_getmycomplaint("' + ticketCode + '","' + serviceId + '","' + channel + '","' + keyWord + '","' + level + '","' + status
      + '","' + startDate + '","' + endDate + '","' + userId
      + '","' + page + '","' + limit + '", @total)', function (err, result) {
      if (!err) {
        var styles = {
          headerDark: {
            fill: {
              fgColor: {
                rgb: 'FF000000'
              }
            },
            font: {
              color: {
                rgb: 'FFFFFFFF'
              },
              sz: 10,
              bold: true,
              underline: true
            }
          },
          cellPink: {
            font: {
              color: {
                rgb: 'FF000000'
              },
              sz: 10
            }
          },
          cellGreen: {
            fill: {
              fgColor: {
                rgb: 'FF00FF00'
              }
            }
          }
        };

        //Here you specify the export structure
        var specification = {
          STT: { // <- the key should match the actual data key
            displayName: 'STT', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.cellPink, // <- Cell style
            width: 30 // <- width in pixels
          },

          ticketCode: { // <- the key should match the actual data key
            displayName: 'Mã ticket', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            cellStyle: styles.cellPink, // <- Cell style
            width: 110 // <- width in pixels
          },

          reception: {
            displayName: 'Ngày tiếp nhận',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 120 // <- width in chars (when the number is passed as string)
          },

          service: {
            displayName: 'Dịch vụ',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 130 // <- width in chars (when the number is passed as string)
          },

          level: {
            displayName: 'Mức độ',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 60, // <- width in pixels
            cellFormat: function (value, row) { // <- Renderer function, you can access also any row.property
              switch (value) {
                case 0:
                  return 'Bình thường';
                case 1:
                  return 'Gấp';
                case 2:
                  return 'Rất gấp';
                default:
                  return '';
              }
            }
          },

          channel: {
            displayName: 'Kênh tiếp nhận',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 80 // <- width in pixels
          },

          status: {
            displayName: 'Tình trạng',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 70, // <- width in pixels
            cellFormat: function (value, row) {
              switch (value) {
                case 1:
                  return 'Open';
                case 2:
                  return 'Update';
                case 3:
                  return 'Pending';
                case 4:
                  return 'Reopen';
                case 5:
                  return 'Closed';
                case 6:
                  return 'Delete';
                default:
                  return '';
              }
            }
          }
        };

        var dataset = [];

        for (var i = 0; i < result[0].length; i++) {
          dataset.push({
            STT: i + 1,
            ticketCode: result[0][i].MaTicket,
            reception: result[0][i].ThoiGianTao,
            service: result[0][i].DichVu,
            level: result[0][i].MucDo,
            channel: result[0][i].KenhTiepNhan,
            status: result[0][i].TinhTrang
          });
        }

        // This function will return Buffer
        var report = excel.buildExport(
          [
            {
              name: 'Sheet name', // <- Specify sheet name (optional)
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        // You can then return this straight
        res.attachment('request_of_me.xlsx');
        return res.send(report);
      } else {
        res.status(400).json({
          message: 'Not found',
          status: 0,
          data: {}
        });
      }
    });
  },

  // List History Request
  getListHistoryRequest: function (req, res) {

    var ticketCode = req.param('ticket_code');
    var keyWord = req.param('key_word');
    var handlerId = req.param('handler_id');
    var status = req.param('status');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var page = req.param('page');
    var limit = req.param('limit');

    Request.query('CALL proc_lichsukhieunai("' + ticketCode + '","' + keyWord + '","' + handlerId + '","' + status
      + '","' + startDate + '","' + endDate + '","' + page + '","' + limit + '", @total)', function (err, result) {

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
  },

  // Get Request By Id
  getRequestById: function (req, res) {
    var id = req.param('id');

    Request
      .findOne({id: id})
      .populateAll()
      .exec(function (err, result) {
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

  // Get History Request By Id
  getHistoryRequestById: function (req, res) {
    var id = req.param('id');

    HandlingRequest
      .find({requestId: id})
      .sort('timeHandling DESC')
      .populateAll()
      .exec(function (err, result) {
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

  // Update Request
  updateRequest: function (req, res) {

    data = JSON.parse(req.param('data'));
    data.editedAt = new Date();

    if (req.method === 'GET') {
      return res.json({'status': 'GET not allowed'});
      //	Call to /upload via GET is error
    }

    if (req._fileparser.upstreams.length == 0) {
      update_request(data, req, res);
    } else {
      if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() != 'exe') {
        return new Promise(function () {
          req.file('uploadFile').upload({
            dirname: '../../upload/request',
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
              data.file = (uploadedFiles[0].fd).toString();
              data.fileName = (uploadedFiles[0].filename).toString();
            }

            update_request(data, req, res);

          });
        });
      } else {
        return res.json({
          status: 0,
          message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
        });
      }
    }
  },

  // Check Request
  checkRequest: function (req, res) {
    var id = req.param('id');
    req.body.editedAt = new Date();

    var ticketCode = req.body.ticketCode;
    var serviceId = req.body.service;
    var channel = req.body.channel;
    var timeRequest = req.body.timeRequest;
    var contact = req.body.contact;
    var sla = req.body.sla;
    var content = req.body.content;
    var file = req.body.file;
    // field need update
    var level = req.body.level; // reopen
    var status = req.body.status; // reopen and check
    var handlerId = req.body.handlers; // reopen and check
    var assigned = req.body.assigned; // reopen and check
    var responsibleId = req.body.responsible; // reopen and check
    var contentHandling = req.body.contentHandling; // check
    var reason = req.body.reason; // reopen

    Request.update({id: id}, {
      ticketCode: ticketCode,
      service: serviceId,
      level: level,
      channel: channel,
      timeRequest: timeRequest,
      contact: contact,
      sla: sla,
      content: content,
      file: file,
      status: status,
      handlers: handlerId,
      assigned: assigned,
      responsible: responsibleId,
      contentHandling: contentHandling,
      reason: reason
    }).exec(function (err1, result) {
      console.log(result);
      if (!err1) {
        User.find({id: result[0].assigned})
          .exec(function (err2, userAssigned) {
            if (err2) {
              return res.negotiate(err2);
            } else {
              User.find({id: result[0].responsible})
                .exec(function (err3, userResponsible) {
                  if (err3) {
                    return res.negotiate(err3);
                  } else {

                    res.status(200).json({
                      message: 'Check success',
                      data: result
                    });

                    var mailOptions = {
                      to: userAssigned[0].email,
                      cc: [userResponsible[0].email],
                      subject: 'Thông báo thay đổi tình trạng yêu cầu ' + result.ticketCode,
                      html: 'Yêu cầu hỗ trợ: ' + '<b>' + result.ticketCode + '</b>' + ' đã được chuyển xử lý cho anh chị.' + '<br/>' + 'Đề nghị anh chị vào xử lý.' + '<br/>' + 'Xin cảm ơn!'
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                      console.log('Message sent: ' + info.response);
                    });
                  }
                });
            }
          });
      } else {
        res.status(400).json({
          message: 'Not found',
          status: err1.status
        });
      }
    });
  },

  // Delete Request By Id
  deleteRequest: function (req, res) {

    Request.findOne(req.param('id')).exec(function (err, request) {
      if (!request) return res.notFound();

      if (err) {
        return res.negotiate(err);
      } else {
        if (request.file == '' || request.file == null) {
          Request.destroy(request.id).exec(function (err, document) {
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
          Request.destroy(request.id).exec(function (err, document) {
            if (err) {
              return res.negotiate(err);
            } else {
              return res.json({
                'message': 'Success',
                'status': 'Delete 1 record successfully!'
              });
            }
          });
          fs.unlink(request.file);
        }
      }
    });
  },

  // Download File Request By Id
  downloadFileRequest: function (req, res) {
    Request.findOne(req.param('id')).exec(function (err, request) {
      if (err) return res.negotiate(err);
      if (!request) return res.notFound();

      // User has no avatar image uploaded.
      if (!request.file) {
        return res.notFound();
      }

      var SkipperDisk = require('skipper-disk');
      var fileAdapter = SkipperDisk();

      // set the filename to the same file as the user uploaded
      res.set("Content-disposition", 'attachment; filename="' + request.fileName + '"');

      // Stream the file down
      fileAdapter.read(request.file)
        .on('error', function (err) {
          return res.serverError(err);
        })
        .pipe(res);
    });
  },

  // Send Mail
  sendMail: function (req, res) {

    data = JSON.parse(req.param('data'));
    var mails = [];
    mails.toString();

    var transporter = nodemailer.createTransport(smtpTransport({
      host: sails.config.emailSettings.host,
      port: sails.config.emailSettings.port,
      secure: true, // use SSL
      auth: {
        user: sails.config.emailSettings.user_name,
        pass: sails.config.emailSettings.password
      }
    }));

    for (var i = 0; i < mails.length; i++) {
      if (i != mails.length - 1) {
        data.CC += mails[i] + ";"
      } else {
        data.CC += mails[i];
      }
    }


    if (req.method === 'GET') {
      return res.json({'status': 'GET not allowed'});
    }

    if (req._fileparser.upstreams.length == 0) {

      var mailOptions = {
        to: data.To,
        cc: data.CC,
        subject: data.Subject,
        text: data.NoiDung
      };

      transporter.sendMail(mailOptions, function (error, info) {

        if (error) {
          return res.json({
            'message': 'Error',
            'status': error
          });
        } else {
          return res.json({
            'message': 'Success',
            'status': 'Message sent: ' + info.response
          });
        }
      });

    } else {

      if (req.file('uploadFile')._files[0].stream.filename.split('.').pop() != 'exe') {
        return new Promise(function () {
          req.file('uploadFile').upload({
            dirname: '../../upload/mails',
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

              var mailOptions = {
                attachments: [
                  {
                    filename: uploadedFiles[0].filename,
                    path: uploadedFiles[0].fd,
                    contentType: uploadedFiles[0].type
                  }
                ],
                to: data.To,
                cc: data.CC,
                subject: data.Subject,
                text: data.NoiDung
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return res.json({
                    'message': 'Error',
                    'status': error
                  });
                } else {
                  return res.json({
                    'message': 'Success',
                    'status': 'Message sent: ' + info.response
                  });
                }
              });

            }

          });
        });

      } else {
        return res.json({
          status: 0,
          message: 'File đính kèm không hợp lệ hoặc lớn hơn dung lượng quy định'
        });
      }
    }
  }

};

function add_new_request(data, req, res) {
  User.find({id: data.assigned})
    .exec(function (err1, userAssigned) {
      if (err1) {
        return res.negotiate(err1);
      } else {
        User.find({id: data.responsible})
          .exec(function (err2, userResponsible) {
            if (err2) {
              return res.negotiate(err2);
            } else {
              Request.create(data).exec(function (err3, result) {
                if (!err3) {
                  Request
                    .findOne({id: result.id})
                    .exec(function (err, IdResult) {
                      if (!err) {
                        res.status(200).json({
                          message: 'Create success',
                          data: result
                        });

                        var mailOptions = {
                          to: userAssigned[0].email,
                          cc: [userResponsible[0].email],
                          subject: 'Thông báo thay đổi tình trạng yêu cầu ' + IdResult.ticketCode,
                          html: 'Yêu cầu hỗ trợ: ' + '<b>' + IdResult.ticketCode + '</b>' + ' đã được gán cho anh chị.' + '<br/>' + 'Đề nghị anh chị vào xử lý.' + '<br/>' + 'Xin cảm ơn!'
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                          console.log('Message sent: ' + info.response);
                        });
                      } else {
                        res.status(400).json({
                          message: 'Not found',
                          status: 0,
                          data: {}
                        });
                      }
                    });
                } else {
                  console.log(err3);
                  res.status(400).json({
                    message: 'Not found',
                    status: err3.status
                  });
                }
              });
            }
          });
      }
    });
}

function update_request(data, req, res) {
  var id = req.param('id');

  Request.update({id: id}, data).exec(function (err, result) {
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
}

