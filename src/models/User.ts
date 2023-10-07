import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export interface IUser extends mongoose.Document {
  name: string;
  password: string;
  email: string;
  token?: string;
  confirmed: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  token: { type: String },
  confirmed: { type: Boolean, default: false },
}, {
  timestamps: true
})

/**
 * en el controlador se llama el modelo User, ese modelo utiliza el schema, y antes de
 * todo lo del schema se ejecutan las funciones del pre, en este caso el haseho
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

/**
 * this en ambos casos se refiere al password del schema, del usuario que esta en la db en este caso
 */
UserSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

const User = mongoose.model('User', UserSchema)
export default User