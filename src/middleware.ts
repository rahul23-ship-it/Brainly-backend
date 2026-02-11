import type { NextFunction , Request  ,Response} from "express";
import jwt from "jsonwebtoken";
import { JWT_PASSWORD } from "./config.js";
import mongoose from "mongoose";

interface JwtUserPayload {
  id: string;
}


export const usermiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers.authorization ;
    const decoded = jwt.verify(header as string ,JWT_PASSWORD) as JwtUserPayload
    if (decoded) {
        req.userId =  decoded.id;
        next()
    }else {
        res.status(403).json({
            message : "You are not logged in"
        })
    }
}