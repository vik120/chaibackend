// 1st approch
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
         
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

// 2nd approcah with try and catch
/*
const asyncHandler = (fn) => async (err, req, res, next) => {
    try{
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
} */

export {asyncHandler}