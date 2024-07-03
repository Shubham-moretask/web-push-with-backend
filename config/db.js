
const mongoose =require("mongoose");
const db =()=>{
    try {
        const conn =mongoose.connect(process.env.MONGO_URL);
        console.log("Database Connected successfully !");
    } catch (error) {
        console.log("Database failed !", error);
    }
}


module.exports=db;
