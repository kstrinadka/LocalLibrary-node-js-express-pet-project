import mongoose from "mongoose";


const Post = new mongoose.Schema({
    author: {type: String, required:true},
    title: {type: String, required:true},
    content: {type: String, required:true},
    picture: {type: String}     // будем хранить только название изображения на диске
})


export default mongoose.model('Post', Post)
