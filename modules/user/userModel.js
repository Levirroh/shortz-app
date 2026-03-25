// carrega a classe DataType do módulo sequelize
const { DataTypes } = require('sequelize');
// importa o objeto 'sequelize' de 'config/database.js'
const sequelize = require('../../config/database');

// define a estrutura da entidade User (tabela users)
const User = sequelize.define(
   // 1º parametro: nome da entidade
   'User', 
   // 2º parâmetro: coleção de campos
   {
      // campo id
      id: {
         type: DataTypes.INTEGER,
         primaryKey: true,
         autoIncrement: true
      },
      // campo username
      username: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true
      },
      // campo email
      email: {
         type: DataTypes.STRING,
         allowNull: false,
         unique: true,
         validate: { isEmail: true }
      },
      // campo password
      password: {
         type: DataTypes.STRING,
         allowNull: false
      },
      // campo fullName
      fullName: {
         type: DataTypes.STRING,
         allowNull: true
      },
      // campo bio
      bio: {
         type: DataTypes.STRING(255),
         allowNull: true
      },
      // campo profilePicture
      profilePicture: {
         type: DataTypes.STRING,
         allowNull: true,
         defaultValue: 'default-profile.png'
      },
      // campo isBlocked
      isBlocked: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      },
      // campo isAdmin
      isAdmin: {
         type: DataTypes.BOOLEAN,
         defaultValue: false
      }
   },
   // 3º parâmetro: comportamento do banco
   {
      // cria automaticamente createdAt e updatedAt
      timestamps: true, 
      // define o nome da tabela
      tableName: 'users'
   }
);

// exporta a entidade User para ser usada em outro módulo
module.exports = User;