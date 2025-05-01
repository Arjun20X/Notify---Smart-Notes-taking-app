// This is a wrapper fucntion which we are using to wrap
// our functions with async-wait and try-catch block or promises

// This one is implemented using promises
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

// const asyncHandler = () => {}
// const asyncHandler = (func) => {() => {}}
// const asynchandler = (func) => async() => {}

// this is an higher order function => higher order function is a
// function which can accept fcuntion in parameter and return  function
// it is breaked down versiojn for explanation is written just above in comments

// this one is implemented using try-catch

// const asyncHandler = (fn) => async(req,res,next) => {
//     try{
//         await fn(req,res,next)
//     }
//     catch(error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message: error.message,
//         })
//     }
// }
