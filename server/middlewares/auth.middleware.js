import jwt from "jsonwebtoken";
import AppError from "../utils/error.utils.js";

const isLoggedIn = async (req, res, next) => {
    const {token } = req.cookies;

    if(!token) {
        return next(new AppError('Unauthenticated, please login again', 401));
    }

    const userDetails = await jwt.verify(token, process.env.JWT_SECRET);

    req.user = userDetails;

    next();
}
const authorizedRoles = (...roles) =>async(req,res,next)=>{
    const currentUserRoles = req.user.role;

    if(roles.includes(currentUserRoles)){
        return next(
            new AppError('you do not have premition to access this route', 300)
        )
    }
    next();
}

export{
    isLoggedIn,
    authorizedRoles
}