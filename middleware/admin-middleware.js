const isAdmin = (req, res, next) => {
    if(req.userInfo.role !== 'admin'){
        res.status(403).json({
            success: false,
            message: "Forbidden! You can not access this route"
        })
    }

    next()
}


module.exports = isAdmin