const db = require('../index')
const { Model, DataTypes, DATE } = require('sequelize')

class Novel extends Model {
  static associate() {
    // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
  }
}

Novel.init(
  {
    // Initializing the model for the table in the DB, each column will be defined in the first argument
    novelId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    novelTitle: {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: false,
    },
    numChaptersReleased: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    translatorUsername: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    translatorId: {
      type: DataTypes.STRING,
      references: {
        // foreign key using the discord unique id in Translators to keep track of which novel is being translated and edited by which person
        model: 'Staff Members',
        key: 'discordSnowflake',
      },
      allowNull: true,
    },
    editor: {
      type: DataTypes.STRING,
      references: {
        model: 'Staff Members',
        key: 'discordSnowflake',
      },
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'Ongoing',
    },
    lastUpdated: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    original: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    sequelize: db,
    modelName: 'Novel',
  }
)

module.exports = Novel
