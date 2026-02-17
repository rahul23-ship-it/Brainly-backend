import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken" ;
import { ContentModel, LinkModel, UserModel } from "./db.js";
import { JWT_PASSWORD } from "./config.js";
import { usermiddleware } from "./middleware.js";
import { random } from "./utils.js";

const app = express() ;
app.use(express.json());

app.post("/api/v1/signup" ,async(req , res)=>{
    const username = req.body.username ;
    const password = req.body.password ;
    try{
        const existing = await UserModel.findOne({
            username
        })
        if(existing){
            res.json({
                message: "User already exists"
            })
        }else{
            await UserModel.create({
            username : username ,
            password : password
        })
        res.json({
            message: "user is signed up "
        })
        }
        
}catch(e){
        res.status(414).json({
            message: "cant sign up"
        })
    }
    
})

app.post("/api/v1/signin" ,async(req , res)=>{
   const username = req.body.username ;
    const password = req.body.password ;
    const existing = await UserModel.findOne({
        username,
        password
    })
    if (existing){
        const token = jwt.sign({
            id: existing._id
        },JWT_PASSWORD)
        res.json({
            token
        })
    }else{
        res.status(403).json({
            message: "incorrect cred"
        })
    }
})

app.post("/api/v1/content",usermiddleware ,async(req , res)=>{
    const link = req.body.link;
    const type = req.body.type ;
    await ContentModel.create({
        type,
        link,
        userId :new mongoose.Types.ObjectId(req.userId) ,
        tags : []
    })
    res.json({
        message: "Content created "
    })
})

app.get("/api/v1/content" ,usermiddleware,async (req , res)=>{
    const userId = req.userId ;
    const content = await ContentModel.find({
        userId : new mongoose.Types.ObjectId(userId)
    }).populate("userId" ,"username") //populating the original Users information also (in schema ref:Users) selected username only and not their password 
    res.json({
        content
    })

})

app.delete("/api/v1/content" ,usermiddleware,async(req , res)=>{
    const contentId = req.body.contentId ;
    await ContentModel.deleteMany({
        contentId,
        userId:  new mongoose.Types.ObjectId(req.userId)
    })

    res.json({
        message: "Deleted Content"
    })

})


app.post("/api/v1/brain/share" ,usermiddleware,async(req , res)=>{
    const share = req.body.share ;
    if (share){
        const existingLink = await LinkModel.findOne({
            userId: new mongoose.Types.ObjectId(req.userId)
        })

        if (existingLink){
            res.json({
                hash: existingLink.hash
            })
        }

        const hash = random(10) 
        await LinkModel.create({
            userId : new mongoose.Types.ObjectId(req.userId) ,
            hash : hash
        })
        res.json({
        message: "/share/" + hash
    })
    } else {
        await LinkModel.deleteOne({
            userId : new mongoose.Types.ObjectId(req.userId)
        })
        res.json({
        message: "Removed link "
    })
    }
    

})


app.get("/api/v1/brain/:shareLink" ,async (req ,res)=>{
    const hash = req.params.shareLink ;
    const link = await LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input "
        })
        return ;
    }

    const content = await ContentModel.find({
        userId : link.userId
    })

    const User = await UserModel.findOne({
        _id : link.userId
    })

    if (!User) {
        res.json({
            message: "Sorry incoorect input"
        })
        return ;
    }

    res.json({
        username : User.username,
        content : content
    })

    
})

app.listen(3000);

