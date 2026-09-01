const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Absensi = sequelize.define('Absensi', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  nama_kegiatan: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  foto_path: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
  },
  lat: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: false,
  },
  lng: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('hadir', 'izin', 'sakit'),
    allowNull: false,
    defaultValue: 'hadir',
  },
}, {
  tableName: 'absensi',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations
User.hasMany(Absensi, { foreignKey: 'user_id', as: 'absensi' });
Absensi.belongsTo(User, { foreignKey: 'user_id', as: 'mahasiswa' });

module.exports = Absensi;
