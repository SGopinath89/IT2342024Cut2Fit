const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/cut2fit")
.then(()=>{
    console.log("Database connected successfully!");
})
.catch(()=>{
    console.log("Failed to connect database!");

})




//create login schema
const LoginSchema=new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const collection= new mongoose.model("login_users",LoginSchema);


module.exports=collection;