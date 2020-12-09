const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: "belix-pro",
    api_key: 416253713757466,
    api_secret: "sl6DuVCXisev09ilH3vvTcbNmxE"
})

module.exports = cloudinary