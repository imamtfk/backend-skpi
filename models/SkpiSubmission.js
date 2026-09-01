const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const SkpiCategory = require('./SkpiCategory');

const SkpiSubmission = sequelize.define('SkpiSubmission', {
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
  category_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    references: {
      model: SkpiCategory,
      key: 'id',
    },
  },
  judul_kegiatan: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  penyelenggara: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  tanggal_kegiatan: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  nomor_sertifikat: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  file_path: {
    type: DataTypes.TEXT('long'),
    allowNull: true // changed to store long base64 string
  },
  poin_diusulkan: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  poin_disetujui: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('draft', 'validasi_tu', 'validasi_prodi', 'approval_dekan', 'selesai', 'ditolak'),
    allowNull: false,
    defaultValue: 'draft',
  },
  catatan_verifikator: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  verified_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
  verified_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'skpi_submissions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Associations
User.hasMany(SkpiSubmission, { foreignKey: 'user_id', as: 'submissions' });
SkpiSubmission.belongsTo(User, { foreignKey: 'user_id', as: 'mahasiswa' });

SkpiCategory.hasMany(SkpiSubmission, { foreignKey: 'category_id' });
SkpiSubmission.belongsTo(SkpiCategory, { foreignKey: 'category_id', as: 'kategori' });

User.hasMany(SkpiSubmission, { foreignKey: 'verified_by', as: 'verified_submissions' });
SkpiSubmission.belongsTo(User, { foreignKey: 'verified_by', as: 'verifikator' });

module.exports = SkpiSubmission;
