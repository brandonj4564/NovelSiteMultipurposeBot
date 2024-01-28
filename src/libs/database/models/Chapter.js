const db = require('../index')
const { Model, DataTypes, DATE } = require('sequelize')

class Chapter extends Model {
    static associate() {
        // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
    }
}

Chapter.init(
    {
        // Initializing the model for the table in the DB, each column will be defined in the first argument
        chapterId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        novelId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Novels',
                key: 'novelId',
            },
            allowNull: false,
        },
        title: {
            type: DataTypes.TEXT,
            unique: false,
            allowNull: true,
        },
        translatorUsername: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        translatorId: {
            type: DataTypes.STRING,
            references: {
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
        datePosted: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        views: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        paranoid: true,
        sequelize: db,
        modelName: 'Chapter',
    }
)

module.exports = Chapter
