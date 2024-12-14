import {asyncHandler} from '../utils/asynchandler.js'
import { upload } from '../middleware/multer.js'
import { ApiError } from "../utils/apierror.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { User } from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloundnary.js'

const registerUser = asyncHandler(async (req, res) => {
   
    // Get Data from frontend
    const {fullname, email, username, password} = req.body
    console.log( email, password)
    // Validate the data
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "")
       ) {
         throw new ApiError(400, 'All fields are required')
       }
    // check if user already exist by userName and email
    const existedUser  = User.findOne({
        $or: [{email}, { username }]
       })
       console.log('existing user', existedUser)
       if(existedUser) throw new  ApiError(409, 'User with username or email already existed')
    // check file image like avatar

       const avtarLocalPath =  req.files?.avatar[0]?.path
       const coverImageLocalPath =  req.files?.coverImage[0]?.path

       if(!avtarLocalPath) throw new  ApiError(409, 'Avatar file is required')

    // upload them to cloundnary, avtar

        const avatar =    await uploadOnCloudinary(avtarLocalPath)
        const coverImage =    await uploadOnCloudinary(coverImageLocalPath)

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
    const createdUser = User.findById(user._id).select(
        "_password _refreshtoken"
    )
    // Check for user creation null response
    if(!createdUser)  throw new  ApiError(500, 'Something went wrong on registering the user')

    // return response

   return res.status(201).json(
    new ApiResponse(200, createdUser, 'User register successfully')
   )
   
   
})

export {registerUser}