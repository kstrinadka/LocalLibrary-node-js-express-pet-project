import mongoose from "mongoose";

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
    name: { type: String, required: true, max: 100 },
});

// Virtual for genre's URL
GenreSchema.virtual("url").get(function () {
    return "/catalog/genre/" + this._id;
});

//Export model
export default mongoose.model('Genre', GenreSchema);
// module.exports = mongoose.model("Genre", GenreSchema);
