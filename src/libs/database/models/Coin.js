const db = require('../index')
const { Model, DataTypes, DATE } = require('sequelize')

class Coin extends Model {
    static associate() {
        // Does nothing right now but will be helpful if I want to create a foreign key and primary key relationship... somehow
    }
}

Coin.init(
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
        staff: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: { // This is unused, maybe delete later? Use createdAt instead.
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
        modelName: 'Coin',
    }
)

module.exports = Coin
