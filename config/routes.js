/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  /*START_Authentication*/

  'POST /auth/login': 'AuthController.login' , // Login
  'PUT /auth/change-password': 'UserController.changePassword', // Change password

  /*END_Authentication*/

  /*START_User*/

  'POST /user/add-new-user': 'UserController.createUser', // Add new User
  'GET /user/get-all-user': 'UserController.getAllUser', // Get all User
  'GET /user/get-user-by-id': 'UserController.getUserById', // Get User by id
  'PUT /user/update-user': 'UserController.updateUser', // Update User by id
  'DELETE /user/delete-user': 'UserController.deleteUser', // Delete User by id
  'PUT /user/reset-password': 'UserController.resetPassword', // Reset password
  'PUT /user/approval-status-user': 'UserController.approvalStatusUser', // Approval status User

  /*END_User*/

  /*START_RightGroup-Authorization-Feature*/

  'GET /right/get-all-right-group': 'RightGroupController.getAllRightGroup',  // Get all RightGroup
  'GET /right/get-right-group-select': 'RightGroupController.getRightGroupSelect',  // Get all RightGroup containing user
  'GET /right/get-right-group-select1': 'RightGroupController.getRightGroupSelect1',  // Get all RightGroup containing user 1
  'GET /right/get-right-group-select-by-manager': 'RightGroupController.getRightGroupSelectByManager',  // Get all RightGroup by manager
  // 'GET /right/getRightGroupSelectSub': 'RightGroupController.getRightGroupSelectSub',  // Lấy tất cả nhóm quyền chứa user trừ nhóm TVĐ
  'GET /right/search-right-group-by-name': 'RightGroupController.searchRightGroupByGroupName',    // Get Right Group By Name
  'GET /right/list-all-right-group': 'RightGroupController.listRightGroup',    // List all Right Group
  'GET /right/get-right-group-by-id': 'RightGroupController.getRightGroupByID',    // Get Right Group By ID
  'GET /right/get-right-group-by-id-for-user': 'RightGroupController.getRightGroupByIdForUser',    // Get Right Group By ID For User
  'GET /right/get-right-group-by-id-for-permission': 'RightGroupController.getRightGroupByIdForPermission',    // Get Right Group By ID For Permission
  'POST /right/add-new-right-group' : 'RightGroupController.addRightGroup', // Add new Right Group
  'PUT /right/update-right-group' : 'RightGroupController.updateByID', // Update Right Group By ID and {data}
  'DELETE /right/delete-right-group' : 'RightGroupController.deleteByID', // Delete Right Group

  /*END_RightGroup-Authorization-Feature*/

  /*START_Service*/

  'POST /service/add-new-service': 'ServiceController.createService', // Add new Service
  'GET /service/get-all-service': 'ServiceController.getAllService', // Get all Service
  'GET /service/get-all-service-no-paging': 'ServiceController.getAllServiceNoPaging', // Get all Service no paging
  'GET /service/get-service-by-id': 'ServiceController.getServiceById', // Get Service by id
  'PUT /service/update-service': 'ServiceController.updateService', // Update Service by id
  'PUT /service/approval-status-service': 'ServiceController.approvalStatusService', // Approval status Service by id

  /*END_Service*/

  /*START_Document*/

  'POST /document/add-new-document': 'DocumentController.createDocument', // Add new Document
  'GET /document/get-all-document': 'DocumentController.getAllDocument', // Get all Document
  'GET /document/download-document': 'DocumentController.downloadDocument',  // Download Document by id
  'DELETE /document/delete-document': 'DocumentController.deleteDocument',  // Delete Document by id

  /*END_Document*/

  /*START_Request*/

  'POST /request/add-new-request': 'RequestController.createRequest', // Add new Request
  'GET /request/get-all-request': 'RequestController.getAllRequest', // Get all Request
  'GET /request/export-all-request': 'RequestController.exportAllRequest', // Export all Request
  'GET /request/get-all-request-of-me': 'RequestController.getAllRequestOfMe', // Get all Request of Me
  'GET /request/export-all-request-of-me': 'RequestController.exportAllRequestOfMe', // Export all Request of Me
  'GET /request/list-history-request': 'RequestController.getListHistoryRequest', // List history Request
  'GET /request/get-request-by-id': 'RequestController.getRequestById', // Get Request by id
  'GET /request/get-history-request-by-id': 'RequestController.getHistoryRequestById', // Get History Request by id
  'PUT /request/update-request': 'RequestController.updateRequest', // Update Request
  'PUT /request/check-request': 'RequestController.checkRequest', // Check Request
  'DELETE /request/delete-request': 'RequestController.deleteRequest', // Delete Request
  'GET /request/download-file': 'RequestController.downloadFileRequest', // Download file Request
  'POST /request/send-mail': 'RequestController.sendMail',  // Send email

  /*END_Request*/

  /*START_Report*/

  'GET /report/get-all-report-detail': 'ReportController.reportDetail', // List report detail
  'GET /report/export-report-detail': 'ReportController.exportReportDetail', // Export report detail
  'GET /report/get-all-report-general': 'ReportController.reportGeneral', // List report general
  'GET /report/export-report-general': 'ReportController.exportReportGeneral', // Export report general
  'GET /report/get-all-report-request-out-of-date': 'ReportController.reportRequestOutOfDate', // List report request out of date
  'GET /report/export-report-request-out-of-date': 'ReportController.exportReportRequestOutOfDate', // Export report request out of date
  'GET /report/get-all-report-request-no-handling': 'ReportController.reportRequestNotHandling', // List report request no handling
  'GET /report/export-report-request-no-handling': 'ReportController.exportRequestNotHandling' // Export report request no handling

  /*END_Report*/

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
