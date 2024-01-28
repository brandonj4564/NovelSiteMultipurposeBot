const db = require('../index')
const { Model, DataTypes } = require('sequelize')

class User extends Model {
  static associate() {
    // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
  }
}

User.init(
  {
    // Initializing the model for the table in the DB, each column will be defined in the first argument
    discordSnowflake: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    discordUsername: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    websiteUsername: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    dateLastRelease: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
    },
    hiatus: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    retired: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    dateRetired: {
      type: DataTypes.DATEONLY,
      unique: false,
      allowNull: true,
    }
    // numProjects: {
    //   type: DataTypes.INTEGER,
    //   unique: false,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    // numChapterReleases: {
    //   type: DataTypes.INTEGER,
    //   unique: false,
    //   allowNull: false,
    //   defaultValue: 0,
    // },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Staff Member',
  }
)

module.exports = User
