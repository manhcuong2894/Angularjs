/**
 * ReportController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var excel = require('node-excel-export');

var styles = {
  headerDark: {
    font: {
      color: {
        rgb: 'FF000000'
      },
      sz: 14,
      bold: true
    }
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
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

module.exports = {

  // List Report Detail
  reportDetail: function (req, res) {
    var handlerId = req.param('handler_id');
    var responsibleId = req.param('responsible_id');
    var status = req.param('status');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var page = req.param('page');
    var limit = req.param('limit');

    DetailReport.query('CALL proc_baocaochitiet("' + handlerId + '","' + responsibleId + '","' + status + '","' + startDate + '","' + endDate + '","' + page + '","' + limit + '", @total)', function (err, result) {
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

  // Export report detail
  exportReportDetail: function (req, res) {
    var handlerId = req.param('handler_id');
    var responsibleId = req.param('responsible_id');
    var status = req.param('status');
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var page = req.param('page');
    var limit = req.param('limit');

    DetailReport.query('CALL proc_baocaochitiet("' + handlerId + '","' + responsibleId + '","' + status + '","' + startDate + '","' + endDate + '","' + page + '","' + limit + '", @total)', function (err, result) {
      if (!err) {
        TotalRecord.query('SELECT @total as total', function (errs, results) {

          //Here you specify the export structure
          var specification = {
            ID: { // <- the key should match the actual data key
              displayName: 'STT', // <- Here you specify the column header
              headerStyle: styles.headerDark, // <- Header style
              width: 30 // <- width in pixels
            },

            NgayTaoKieuNai: {
              displayName: 'Ngày tạo khiếu nại',
              headerStyle: styles.headerDark,
              width: 200 // <- width in chars (when the number is passed as string)
            },

            ThongTinLienHe: {
              displayName: 'Thông tin liên hệ',
              headerStyle: styles.headerDark,
              width: 200 // <- width in pixels
            },

            NguoiXuLy: {
              displayName: 'Người xử lý',
              headerStyle: styles.headerDark,
              width: 200 // <- width in pixels
            },

            NguoiChiuTrachNhiem: {
              displayName: 'Người chịu trách nhiệm',
              headerStyle: styles.headerDark,
              width: 200 // <- width in pixels
            },

            TinhTrang: {
              displayName: 'Tình trạng',
              headerStyle: styles.headerDark,
              width: 100 // <- width in pixels
            },

            NgayCapNhat: {
              displayName: 'Ngày cập nhật',
              headerStyle: styles.headerDark,
              width: 200 // <- width in pixels
            }
          };

          var dataset = [];
          // that are listed in the report specification

          for (var i = 0; i < result[0].length; i++) {
            dataset.push({
              ID: i + 1,
              NgayTaoKieuNai: result[0][i].NgayTaoKieuNai,
              ThongTinLienHe: result[0][i].ThongTinLienHe,
              NguoiXuLy: result[0][i].NguoiXuLy,
              NguoiChiuTrachNhiem: result[0][i].NguoiChiuTrachNhiem,
              TinhTrang: result[0][i].TinhTrang,
              NgayCapNhat: result[0][i].NgayCapNhat
            });
          }

          // Create the excel report.
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
          res.attachment('report_detail.xlsx');
          return res.send(report);

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

  // List report general
  reportGeneral: function (req, res) {
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var handlerGroupId = req.param('handler_group_id');

    GeneralReport.query('CALL proc_baocaotonghop("' + startDate + '","' + endDate + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {
        if (result[0].length > 0) {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: result[0]
          });
        } else {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: []
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

  // Export Report General
  exportReportGeneral: function (req, res) {
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var handlerGroupId = req.param('handler_group_id');

    GeneralReport.query('CALL proc_baocaotonghop("' + startDate + '","' + endDate + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {

        //Here you specify the export structure
        var specification = {
          TenDayDu: { // <- the key should match the actual data key
            displayName: 'Người xử lý', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 250 // <- width in pixels
          },
          DaXuLy: {
            displayName: 'Đã xử lý',
            headerStyle: styles.headerDark,
            width: 250 // <- width in chars (when the number is passed as string)
          },
          DangXuLy: {
            displayName: 'Đang xử lý',
            headerStyle: styles.headerDark,
            width: 250 // <- width in pixels
          },
          ChuaXuLy: {
            displayName: 'Chưa xử lý',
            headerStyle: styles.headerDark,
            width: 250 // <- width in pixels
          },

          Tong: {
            displayName: 'Tổng',
            headerStyle: styles.headerDark,
            width: 100 // <- width in pixels
          }
        };

        var dataset = [];

        for (var i = 0; i < result[0].length; i++) {
          dataset.push({
            TenDayDu: result[0][i].TenDayDu,
            DaXuLy: result[0][i].DaXuLy,
            DangXuLy: result[0][i].DangXuLy,
            ChuaXuLy: result[0][i].ChuaXuLy,
            Tong: result[0][i].Tong
          });
        }

        // Create the excel report.
        var report = excel.buildExport(
          [
            {
              name: 'Sheet name', // <- Specify sheet name (optional)
              // heading: heading, // <- Raw heading array (optional)
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        // You can then return this straight
        res.attachment('report_general.xlsx');
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

  // List Report Request Out Of Date
  reportRequestOutOfDate: function (req, res) {
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var handlerGroupId = req.param('handler_group_id');

    RequestOutOfDateReport.query('CALL proc_baocaotonghopfailSLA("' + startDate + '","' + endDate + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {
        if (result[0].length > 0) {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: result[0]
          });
        } else {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: []
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

  // Export Report Request Out Of Date
  exportReportRequestOutOfDate: function (req, res) {
    var startDate = req.param('start_date');
    var endDate = req.param('end_date');
    var handlerGroupId = req.param('handler_group_id');

    RequestOutOfDateReport.query('CALL proc_baocaotonghopfailSLA("' + startDate + '","' + endDate + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {

        //Here you specify the export structure
        var specification = {
          TenDayDu: { // <- the key should match the actual data key
            displayName: 'Người xử lý', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 250 // <- width in pixels
          },
          DangXuLy: {
            displayName: 'Đang xử lý',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 250 // <- width in pixels
          },
          ChuaXuLy: {
            displayName: 'Chưa xử lý',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 250 // <- width in pixels
          },

          Tong: {
            displayName: 'Tổng',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 100 // <- width in pixels
          }
        };

        var dataset = [];

        for (var i = 0; i < result[0].length; i++) {
          dataset.push({
            TenDayDu: result[0][i].TenDayDu,
            DangXuLy: result[0][i].DangXuLy,
            ChuaXuLy: result[0][i].ChuaXuLy,
            Tong: result[0][i].Tong
          });
        }

        // Create the excel report.
        var report = excel.buildExport(
          [
            {
              name: 'Sheet name', // <- Specify sheet name (optional)
              // heading: heading, // <- Raw heading array (optional)
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        // You can then return this straight
        res.attachment('report_request_out_of_date.xlsx');
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

  // List Request Not Handling
  reportRequestNotHandling: function (req, res) {
    var yearRequest = req.param('year_request');
    var handlerGroupId = req.param('handler_group_id');

    RequestNotHandlingReport.query('CALL proc_baocaotonghoptheonam("' + yearRequest + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {
        if (result[0].length > 0) {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: result[0]
          });
        } else {
          res.status(200).json({
            message: 'success',
            status: 1,
            data: []
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

  // Export Request Not Handling
  exportRequestNotHandling: function (req, res) {
    var yearRequest = req.param('year_request');
    var handlerGroupId = req.param('handler_group_id');

    RequestNotHandlingReport.query('CALL proc_baocaotonghoptheonam("' + yearRequest + '","' + handlerGroupId + '")', function (err, result) {
      if (!err) {

        //Here you specify the export structure
        var specification = {
          TenDayDu: { // <- the key should match the actual data key
            displayName: 'Người xử lý', // <- Here you specify the column header
            headerStyle: styles.headerDark, // <- Header style
            width: 250 // <- width in pixels
          },
          T1: {
            displayName: 'T1',
            headerStyle: styles.headerDark,
            width: 50 // <- width in chars (when the number is passed as string)
          },
          T2: {
            displayName: 'T2',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },
          T3: {
            displayName: 'T3',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T4: {
            displayName: 'T4',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T5: {
            displayName: 'T5',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T6: {
            displayName: 'T6',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T7: {
            displayName: 'T7',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T8: {
            displayName: 'T8',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T9: {
            displayName: 'T9',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T10: {
            displayName: 'T10',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T11: {
            displayName: 'T11',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          T12: {
            displayName: 'T12',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          },

          Tong: {
            displayName: 'Tổng',
            headerStyle: styles.headerDark,
            cellStyle: styles.cellPink, // <- Cell style
            width: 50 // <- width in pixels
          }
        };

        var dataset = [];
        // that are listed in the report specification

        for (var i = 0; i < result[0].length; i++) {
          dataset.push({
            TenDayDu: result[0][i].TenDayDu,
            T1: result[0][i].T1,
            T2: result[0][i].T2,
            T3: result[0][i].T3,
            T4: result[0][i].T4,
            T5: result[0][i].T5,
            T6: result[0][i].T6,
            T7: result[0][i].T7,
            T8: result[0][i].T8,
            T9: result[0][i].T9,
            T10: result[0][i].T10,
            T11: result[0][i].T11,
            T12: result[0][i].T12,
            Tong: result[0][i].Tong
          });
        }

        // Create the excel report.
        // This function will return Buffer
        var report = excel.buildExport(
          [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
              name: 'Sheet name', // <- Specify sheet name (optional)
              // heading: heading, // <- Raw heading array (optional)
              specification: specification, // <- Report specification
              data: dataset // <-- Report data
            }
          ]
        );

        // You can then return this straight
        res.attachment('report_request_not_handling.xlsx'); // This is sails.js specific (in general you need to set headers)
        return res.send(report);
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

