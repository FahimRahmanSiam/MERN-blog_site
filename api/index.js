const express=require('express');
const mongoose=require('mongoose');
const app=express();
const dotenv=require('dotenv');
const authRoutes=require('./routes/auth');
const userRoutes=require('./routes/users');
const postRoutes=require('./routes/posts');
const categoryRoutes=require('./routes/categories');
const multer=require('multer');
const path=require('path');

dotenv.config();
app.use(express.json());
app.use("/images",express.static(path.join(__dirname,"/images")));

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true
}).then(console.log("Connected to MongoDB")).catch(err=>console.log(err));

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"images")
    },filename:(req,file,cb)=>{
        cb(null,req.body.name);
    },
});
const upload=multer({storage:storage});
app.post("/api/upload",upload.single("file"),(req,res)=>{
    res.status(200).json("file has been uploaded!"); 
});

app.use('/api/auth',authRoutes);
app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/categories',categoryRoutes);


app.listen(5004,()=>{
    console.log("server started successfully at port 5004");
});