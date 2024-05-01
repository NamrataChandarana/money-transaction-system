import { User } from "../model/users";
import {ParseStatus, z} from 'zod';
import { JWT_SECRET } from "../config";
import { jwt } from "jsonwebtoken";
import bcrypt from "bcryptjs"

const  userSignup = z.object({
    username: z.string().email(),
    Password: z.string().max(8),
    firstname: z.string(),
    lastname: z.string()
});


export const signup = async(req, res) =>{
    // const  body= req.body;

    const {success} = userSignup.safeParse(req.body);

    if(!success) {
        return res.status(411).json({
            message: "Email already taken / Incorreact inputs"
        })
    }
    
    const existingUser = await  User.findOne({username : req.body.username} );  

    if(existingUser){
        res.status(411).json({
            message: "Email already exits / Incorrect "
        })
    }

    const hashPassword = bcrypt.hash(req.user.password, 10);

    const user = await User.create({
        username: req.body.username,
        password: hashPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    })

    /// ----- Create new account ------

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const userId = user._id;

    const token = jwt.sign({
        userId
    },JWT_SECRET);

    //cookies 
    //or 
    //localstorage and then send token with header

    res.json({
        message: "User created successfully",
        token: token
    })
    
};

const userSignin = z.object({
    username: z.string().email(),
    password: z.string(),
})

export const signin = async(req, res) =>{
    const { success } = userSignin.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await  User.findOne({username : req.body.username} );  
    const isMatch = await bcrypt.compare(req.body.password, user.password);

      if (user && isMatch) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
  
        res.json({
            token: token
        })
        return;
    }

     res.status(411).json({
        message: "Error while logging in"
    })

}

const userUpdateProfile = z.object({
    Password: z.string().max(8).optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
})

export const updateProfile = async(req, res) =>{
    const {success} = userUpdateProfile.safeParse(req.body);

    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const hashPassword = await bcrypt.hash(req.body.Password , 10);
    
    const updateUserData = {
        password: hashPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }

    const user = await register.findByIdAndUpdate(req.userId, updateUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      res.status(200).json({
        success: true,
        message: "updated Successfully",
        user,
      });
}


//filter user via firstname and lastname
export const bulk = async(req, res) =>{
    const filter = req.query.filter || "";

    const users =  await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            },
            lastName: {
                "$regex": filter
            }
        }]        
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
}