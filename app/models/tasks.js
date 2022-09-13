const { Model, DataTypes } = require ('sequelize');
const database = require('../database');

class Task extends Model {}

Task.init({
    name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    color: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '#FFFFFF',
    },
    finish: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
}, {
    sequelize: database,
    tableName: 'task'
})

module.exports = Task;