import {asyncHandler} from '../utils/asynchandler.js'
import { upload } from '../middleware/multer.js'
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloundnary.js'

const generateAccessRefreshToken = async(id) => {
    try {
        const getuser = await  User.findById(id);
        const accessToken = getuser.generateAccessToken()
        const refreshToken = getuser.generateRefreshToken()

        getuser.refreshToken = refreshToken;
        
        await getuser.save({ validateBeforeSave: false })
        return {accessToken, refreshToken}
    } catch(err) {
        throw new ApiError(500, 'Something went wrong while generating token, Please try again later.')
    }
}

const registerUser = asyncHandler(async (req, res) => {
   
    // Get Data from frontend
    const {fullname, email, username, password} = req.body

    // Validate the data
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
       ) {
        console.log('fields are blank')
         throw new ApiError(400, 'All fields are required')
       }
    // check if user already exist by userName and email
    const existedUser  = await User.findOne({
        $or: [{email}, { username }]
       })

       console.log('alreay existed', existedUser)

       if(existedUser) throw new  ApiError(409, 'User with username or email already existed')
    // check file image like avatar
       const avtarLocalPath =  req.files?.avatar[0]?.path
       console.log('error avtarLocalPath', avtarLocalPath)
       let coverImageLocalPath
       if(req.files?.coverImage.length > 0 && req.files?.coverImage[0]?.path) {
            coverImageLocalPath = req.files?.coverImage[0]?.path
       }

       if(!avtarLocalPath) {
        throw new  ApiError(409, 'Avatar file is required')
       }
       console.log('error coverImageLocalPath', coverImageLocalPath)

    // upload them to cloundnary, avtar

        const avatar =    await uploadOnCloudinary(avtarLocalPath)
        const coverImage =    coverImageLocalPath && await uploadOnCloudinary(coverImageLocalPath)
        console.log('error coverImageLocalPath', avatar)
        if(!avatar) throw new  ApiError(409, 'Avatar file is required')

    // Create user Object - create entry in db
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()

    })
   
    // remove password and refresh token field from response    
    const createdUser = await User.findById(user._id).select(
        "-password"
    )
    // Check for user creation null response
    if(!createdUser)  throw new  ApiError(500, 'Something went wrong on registering the user')

    // return response

   return res.status(201).json(
    new ApiResponse(200, createdUser, 'User register successfully')
   )
})

const loginUser = asyncHandler( async (req, res) => {
    // Get data from request (req)
    const { email, username, password } = req.body;
    // username or email
    if(!(username || email)) {
        throw new ApiError(400, 'username or email is required');
    }
    // find the user by email or username
    const getUser = await User.findOne({
        $or: [{email}, {username}]
    })

    if(!getUser) {
        throw new ApiError(400, 'No user found')
    }
    // check password 

    const isPasswordValid = await getUser.isPasswordCorrect(password)
    if(!isPasswordValid) {
        throw new ApiError(400, 'Invalid Password')
    }
     
    // generate access and refresh token
    const {accessToken, refreshToken} = await generateAccessRefreshToken(getUser._id)
    
    // send secure cookie with access and refresh token
    const loggedInUser = await User.findById(getUser._id).select("-password -refreshToken")
    const option = {
        httpOnly: true,
        secure: true
    }

    return res.status(201)
    .cookie( "accessToken", accessToken, option )
    .cookie( "refreshToken", refreshToken, option )
    .json(
        new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, 'Login successfully')
    )
       
})

const logoutUser = asyncHandler( async (req, res) => {
    console.log('user logout')
        User.findByIdAndUpdate(
            req.user._id, {
                $set: {
                    refreshToken: undefined
                }
            },
            {
                new: true   
            }
        )

        const option = {
            httpOnly: true,
            secure: true
        }

        return res.status(200)
        .clearCookies("accessToken", option).clearCookies("refreshToken", option)
        .json( new ApiResponse(200, {}, 'Logout successfully') )
} )

export {registerUser, loginUser, logoutUser}