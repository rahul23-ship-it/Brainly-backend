import {model , Schema } from "mongoose";
import mongoose from "mongoose";
const objectId = Schema.ObjectId; 
const MONGO_URL = "mongodb+srv://rahulkaladharan2303_db_user:Rahul2003@cluster0.qs1ewis.mongodb.net/Second-brain" 
mongoose.connect(MONGO_URL);

const userSchema = new Schema({
    username : {type : String , required : true , unique: true},
    password : {type: String , required: true }
})

export const UserModel =  model("Users",userSchema) ;

const contentSchema = new Schema({
    title: String ,
    link : String ,
    type : String,
    tags: [{type: mongoose.Schema.Types.ObjectId , ref:"Tags"} ],
    userId: {type: mongoose.Schema.Types.ObjectId , ref:"Users" ,required: true}
})

export const ContentModel = model("Contents" , contentSchema);

const LinkSchema = new Schema({
    hash: String ,
    userId : {type: mongoose.Schema.Types.ObjectId , ref: 'userSchema' , required : true ,
        unique: true
    }

})

export const LinkModel = model("Links" , LinkSchema);