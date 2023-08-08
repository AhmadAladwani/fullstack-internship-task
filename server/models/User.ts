import { Schema, model } from "mongoose"

interface IUser {
    name: string,
    phoneNumber: string,
    email: string,
    hobbies: string,
}

const userSchema = new Schema<IUser>({
    name: {
        type: String,
        required: [true, 'Please provide a name.'],
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide phone number.'],
        minlength: 12,
        maxlength: 12,
        match: /[0-9]{3}-[0-9]{3}-[0-9]{4}/,
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        match: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        unique: true,
    },
    hobbies: {
        type: String,
        required: [true, 'Please provide hobbies.'],
    },
}, { timestamps: true })

export default model<IUser>('User', userSchema)