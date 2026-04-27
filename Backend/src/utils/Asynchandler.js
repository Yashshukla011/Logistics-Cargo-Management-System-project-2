const asynchanldler=(requesthandler)=>{      //Ye code Express me async errors handle karne
//  ke liye wrapper function hai. Isko asyncHandler bolte hain.
return async(req,res,next)=>{
  Promise.resolve(requesthandler(req,res,next)).catch((err)=>next(err))
}
}
export default asynchanldler;