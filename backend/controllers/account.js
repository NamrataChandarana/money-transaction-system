import mongoose from 'mongoose';
import {Account }from '../model/accounts.js'

export const getBalance = async(req, res) =>{
    try{
        const  userId = req.userId;

        const account = await Account.findOne({
            userId
        })
    
        res.json({
            balance: account.balance
        })
    }catch(error){
        res.jsong({
            message:"Something went wrong!"
        })
    }

}

export const transfer = async(req, res) =>{
    try{
        const session = await mongoose.startSession();

        await session.startTransaction();
        const { amount , to } = req.body;

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if(!toAccount){
           await session.abortTransaction();
           return res.status(400).json({
                message: "Invalid account"
            });
        }

        const userAccount = await Account.findOne({ userId: req.userId }).session(session);

        if(!userAccount || userAccount.balance < amount){
            await session.abortTransaction();
            return res.status(400).json({
                message: "Insufficient balance"
            })
        }
        //transcation
        await Account.updateOne({userId: req.userId}, {$inc:  {"balance": -amount}}).session(session);
        await Account.updateOne({userId: to}, {$inc:  {"balance": -amount}}).session(session);

        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    }catch(error){
        res.json({
            message:"somthing went wrong!"
        })
    }
}
    


