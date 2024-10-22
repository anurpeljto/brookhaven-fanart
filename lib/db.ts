import mongoose from "mongoose";

export async function connectDB() {
    try {
        const connectionState = mongoose.connection.readyState;
        if(connectionState === 1){
            console.log('Already connected');
            return;
        }
        if(connectionState === 2) {
            console.log('Connecting...')
            return;
        }
        if(process.env.MONGO_URI) {
            mongoose.connect(process.env.MONGO_URI, {
                dbName:'FanArt', 
                bufferCommands: true
            });
            console.log('connected');
        }
    } catch (error: any) {
        throw new Error('Error while connecting to DB', error.message)
    }
}