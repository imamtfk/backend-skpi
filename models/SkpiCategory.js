const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SkpiCategory = sequelize.define('SkpiCategory', {
  id: {
    type: DataTypes.STRING(20),
    primaryKey: true,
  },
  parent_id: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  nama_kategori: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  tipe_poin: {
    type: DataTypes.ENUM('statis', 'dinamis'),
    allowNull: false,
  },
  poin_default: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  max_poin_kategori: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_wajib: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'skpi_categories',
  timestamps: false,
});

module.exports = SkpiCategory;
