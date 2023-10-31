import mongoose from "mongoose";

export function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        console.log('Mongoose is already connected.');
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI;
        console.log('Connecting to MongoDB...');
        return mongoose.connect(uri);
    }
}
