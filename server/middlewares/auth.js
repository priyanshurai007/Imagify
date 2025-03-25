import jwt from 'jsonwebtoken'

const userAuth =async (req,res,next)=>{
    const {token} = req.headers
    if(!token){
        return res.status(401).json({msg:"No token, authorization denied"})
    }

    try{
        const tokenDecode= jwt.verify(token,process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }
        else{
            return res.status(400).json({success: false, message:"Invalid token"})
        }

        next();
    } catch(error){
        res.status(400).json({msg:"Token is not valid"})
    }
}

export default userAuth