import mongoose from "mongoose";

export const dbURI = 'mongodb+srv://user:user@cluster0.cyb4frz.mongodb.net/?retryWrites=true&w=majority'; // Проверьте, что адрес MongoDB правильный

async function connectToDB() {
    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        throw err;
    }
}

export default connectToDB;
// module.exports = connectToDB;