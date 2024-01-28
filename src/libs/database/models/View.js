const db = require('../index')
const { Model, DataTypes, DATE } = require('sequelize')

class View extends Model {
    static associate() {
        // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
    }
}

View.init(
    {
        // Initializing the model for the table in the DB, each column will be defined in the first argument
        novelId: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Novels',
                key: 'novelId',
            },
            allowNull: false,
        },
        chapterId: { // Might never get used
            type: DataTypes.INTEGER,
            references: {
                model: 'Chapters',
                key: 'id',
            },
            allowNull: true,
        },
        date: { // I know this is technically unnecessary since postgres has the createdAt column automatically
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        amount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        paranoid: true,
        sequelize: db,
        modelName: 'View',
    }
)

module.exports = View
