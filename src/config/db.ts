import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI)
    const url = `${db.connection.host}:${db.connection.port}`
    console.log(`Connected to MongoDB at ${ url }`)
  } catch (error) {
    console.log(error)
  }
}

export default connectDB