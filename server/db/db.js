import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}${process.env.DBNAME}`)

        console.log(`Database is connected succesfully....`);
      
    } catch (error) {
        console.log("Error occuered while connecting to MONGODB ", error);
        process.exit(1)
    }


}
export {connectDB}