/**
 * Feature.js
 *
 * @description :: Feature model
 * @auth        :: TuanAnh
 */

module.exports = {
  autoCreatedAt: false,
  autoUpdatedAt: false,
  connection: 'someMysqlServer',
  tableName: 'TBL_ChucNang',
  attributes: {

    featureName: {
      type: 'string',
      required: true,
      columnName: 'TenChucNang'
    },

    featureFather: {
      type: 'integer',
      columnName: 'IDChucNangCha'
    },

    /**
     * [rightGroups/owners Many to many relationship]
     * @auth TuanAnh
     */
    owners: {
      collection: 'rightgroup', // match model name here
      via: 'features',
      dominant: true // dominant side
    }
  }
};

