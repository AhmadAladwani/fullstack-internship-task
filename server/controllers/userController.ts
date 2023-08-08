import type { Request, Response } from "express"
import User from "../models/User"
import { Types } from "mongoose"

export const createUser = async (req: Request, res: Response) => {
    const { name, phoneNumber, email, hobbies } = req.body
    if (typeof name !== 'string' || typeof phoneNumber !== 'string' || typeof email !== 'string' || typeof hobbies !== 'string') {
        return res.status(400).json({ message: 'Form not submitted correctly.' })
    }
    const user = await User.create({ name, phoneNumber, email, hobbies })
    return res.status(201).json({ user })
}

export const getUsers = async (_: Request, res: Response) => {
    const users = await User.find()
    return res.status(200).json({ users })
}

export const getSingleUser = async (req: Request, res: Response) => {
    const { id: _id } = req.params
    if (typeof _id !== 'string') {
        return res.status(400).json({ message: 'Id is not a valid string.' })
    }
    if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Id is not valid.' })
    }
    const user = await User.findById(_id)
    if (!user) {
        return res.status(400).json({ message: 'Could not find user.' })
    }
    return res.status(200).json({ user })
}

export const updateUser = async (req: Request, res: Response) => {
    const { id: _id } = req.params
    const { name, phoneNumber, email, hobbies } = req.body
    if (typeof _id !== 'string' || typeof name !== 'string' || typeof phoneNumber !== 'string' || typeof email !== 'string' || typeof hobbies !== 'string') {
        return res.status(400).json({ message: 'Form not submitted correctly.' })
    }
    if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Id is not valid.' })
    }
    const updatedUser = await User.findByIdAndUpdate(_id, { name, phoneNumber, email, hobbies }, { new: true, runValidators: true })
    if (!updatedUser) {
        return res.status(400).json({ message: 'Could not update user.' })
    }
    return res.status(200).json({ updatedUser })
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id: _id } = req.params
    if (typeof _id !== 'string') {
        return res.status(400).json({ message: 'Form not submitted correctly.' })
    }
    if (!Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ message: 'Id is not valid.' })
    }
    const deletedUser = await User.findByIdAndDelete(_id)
    if (!deletedUser) {
        return res.status(400).json({ message: 'Could not delete user.' })
    }
    return res.status(200).json({ message: 'User deleted successfully.' })
}