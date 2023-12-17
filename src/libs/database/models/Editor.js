const db = require('../index')
const { Model, DataTypes } = require('sequelize')

class Editor extends Model {
  static associate() {
    // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
  }
}

Editor.init(
  {
    // Initializing the model for the table in the DB, each column will be defined in the first argument
    editorId: {
      type: DataTypes.STRING,
      references: {
        // foreign key using the discord unique id called discordSnowflake
        model: 'Staff Members',
        key: 'discordSnowflake',
      },
      allowNull: false,
    },
    discordUsername: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    numProjects: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0,
    },
    numChapterReleases: {
      type: DataTypes.INTEGER,
      unique: false,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Editor',
  }
)

module.exports = Editor
