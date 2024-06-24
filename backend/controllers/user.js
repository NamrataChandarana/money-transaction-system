import { User } from "../model/users.js";
import {Account }from '../model/accounts.js'
import {ParseStatus, string, z} from 'zod';
import jwt  from "jsonwebtoken";
import bcrypt from "bcryptjs"

const  userSignup = z.object({
    username: z.string().email(),
    password: z.string(),
    firstname: z.string(),
    lastname: z.string()
});


export const signup = async(req, res) =>{
    try{
        const {success} = userSignup.safeParse(req.body);
        // console.log(success)
        if(!success) {
            return res.status(411).json({
                message: "Incorreact inputs"
            })
        }
        
        const existingUser = await  User.findOne({username : req.body.username} );  
    
        if(existingUser){
            return res.status(411).json({
                message: "Email already exits / Incorrect "
            })
           
        }
    
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashPassword);
    
        const user = await User.create({
            username: req.body.username,
            password: hashPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        })
    
        /// ----- Create new account ------
        const userId = user._id;
    
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        })
    
        const token = jwt.sign({
            userId
        },process.env.JWT_SECRET);
    
        //cookies 
        //or 
        //localstorage and then send token with header
    
        res.json({
            message: "User created successfully",
            token: token
        })

    }catch(error){
        res.json({
            message: "something went wrong!"
        })
    }
};

const userSignin = z.object({
    username: z.string().email(),
    password: z.string(),
})

export const signin = async(req, res) =>{
    try{
        const { success } = userSignin.safeParse(req.body);

        if (!success) {
            return res.status(411).json({
                message: "Invalid inputs"
            })
        }

        const user = await  User.findOne({username : req.body.username} );  

        if(!user){
            return res.status(411).json({
                message: "Email or Password Incorrect"
            })
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if(!isMatch){
            return res.status(411).json({
                message: "Email or Password Incorrect"
            })
        }

        if (isMatch && user) {
          const token = jwt.sign({
              userId: user._id
          }, process.env.JWT_SECRET);

          return res.json({
              token: token
          })
        }

        return res.status(411).json({
            message: "Error while logging in"
        })
    }catch(error){
        res.json({
            message:"something went wrong!"
        })
    }
}

const userUpdateProfile = z.object({
    password: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
})

export const updateProfile = async(req, res) =>{
    try{
        const {success} = userUpdateProfile.safeParse(req.body);

        if (!success) {
            return res.status(411).json({
                message: "Incorrect inputs"
            })
        }
    
        const hashPassword = await bcrypt.hash(req.body.password , 10);
        
        const updateUserData = {
            password: hashPassword,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        }
    
        const user = await User.findByIdAndUpdate(req.userId, updateUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
    
          res.status(200).json({
            success: true,
            message: "updated Successfully",
            user,
          });
    }catch(error){
        res.json({
            message:"something went wrong!"
        })
    }
   
}


//filter user via firstname and lastname
export const bulk = async(req, res) =>{
    const userId = req.userId
    try{
        const filter = req.query.filter || "";
        const filterRegex = new RegExp(filter, 'i');
        const users =  await User.find({
            $or: [{
                firstname: {
                    $regex: filterRegex, 
                    // $options: "i"
                }},{
                lastname: {
                    $regex: filterRegex,
                    // $options: "i"
                }}],
        _id: { $ne: userId }       
        })
        res.json({
            user: users.map(user => ({
                username: user.username,
                firstname: user.firstname,
                lastname: user.lastname,
                _id: user._id
            }))
        })
    }catch(error){
        res.json({
            message:"Something Went Wrong!"
        })
    }
   
}

export const profile = async(req, res) => {
    const userId = req.userId;
    try{
        const user = await User.findById(userId);
        if(user){
            res.status(200).json({
                message: "user details",
                user: user
            });
        }
    }catch(error){
       return res.status(500).json({
            message: "User not found!"
        })
    }

}

export const logout = async(req, res) =>{
    return res.json({
        message:"Logout successfully"
    })
}