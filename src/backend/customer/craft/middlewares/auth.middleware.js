const {verify} = require("jsonwebtoken");
const {findByMobile} = require("../services/auth/auth.service");
const protect = async (req, res, next) => {
    try {
        if (!req.path.includes("/orders")  ){
            return next();
        }

        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(200).json({
                status: "401",
                message: "Unauthorized" ,
                error: "You are not logged in. Please log in to get access"
            });
        }

        const decoded = verify(token, process.env.JWT_SECRET);

        if (decoded.mobile) {
            req.user = await findByMobile(decoded.mobile);
            return next();
        } else return res.status(200).json({
            status: "401",
            message: "Unauthorized" ,
            error: "You are not logged in. Please log in to get access"
        })
    } catch (error) {
        return res.status(200).json({
            status: "401",
            message: "Unauthorized",
            error: error.message,
        });
    }
};

module.exports = protect;
