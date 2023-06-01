const DataTypes = require('sequelize')
const sequelize = require('./sequelize')

const datamodel = sequelize.define("pdfdata", {
    insertpdf: {
        type: DataTypes.TEXT('long')
    },
});

module.exports = datamodel;
