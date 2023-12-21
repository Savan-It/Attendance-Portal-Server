import mongoose from 'mongoose'

const connection = async (URL) =>{
    
    try {
        await mongoose.connect(URL)
        console.log("Database successfully Connected!!");
        
    } catch (error) {
        console.log(`Error while connecting with databse :`, error.message);
    }
}

export default connection;