import mongoose from "mongoose";

export const dbConnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"MERN_STACK_JOB_SEEKING",
    })
    .then(()=>{
        console.log("Database connected with server");
    }).catch((error)=>{
        console.log(`Some error occured while connecting to database: ${error}`);
    })
}