const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nim_nip: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  nama_lengkap: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('mahasiswa', 'tu_fakultas', 'prodi', 'dekan', 'admin'),
    allowNull: false,
    defaultValue: 'mahasiswa',
  },
  prodi: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  angkatan: {
    type: DataTypes.STRING(4),
    allowNull: true,
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
