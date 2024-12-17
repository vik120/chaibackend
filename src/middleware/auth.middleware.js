import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from 'jsonwebtoken'

export const verifyJWT = asyncHandler( async (err, req, res, next) => {
    console.log(req.cookies)
    try {
        const authorizationHeader = req?.header("authorization") || req?.header("Authorization");
        console.log(authorizationHeader.replace("Bearer ", "") )
        const token = (typeof authorizationHeader === 'string' && authorizationHeader.startsWith("Bearer "))
        ? authorizationHeader.replace("Bearer ", "") : req.cookies?.accessToken;
        // const token = req.cookies?.accessToken ? req.cookies?.accessToken :  req?.header("authorization")?.replace("Bearer ", "")
        if(!token) throw new ApiError(401, 'Unauthorized request')
    const decodedToken =  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const getUser = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!getUser) throw new ApiError(401, "Invalid Access Token");

        req.user = user;
        next()
    } catch(err) {
        throw new ApiError(401, err?.message || "Invalid access token")
    }
    
})