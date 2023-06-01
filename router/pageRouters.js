const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    try {
        res.render('./showdata.ejs')
    } catch (error) {
        res.status(404).json({
            status: "failed",
            message: "404 Error"
        })

    }
})

module.exports = router