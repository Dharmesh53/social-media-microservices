import { IUser } from "@/interfaces/IUser";
import argon2 from "argon2"
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true
  },
}, { timestamps: true })

UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await argon2.hash(this.password)
    } catch (error) {
      next(error)
    }
  }
})

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch (error) {
    throw error
  }
}

UserSchema.index({ username: 'text' })

const User = mongoose.model<IUser & mongoose.Document>("User", UserSchema)

export default User
