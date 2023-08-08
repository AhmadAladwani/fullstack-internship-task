import type { NextFunction, Request, Response } from "express"
import { Error as MongooseError } from "mongoose"
import { MongoServerError } from "mongodb"

const errorHandlerMiddleware = (err: Error, _: Request, res: Response, __: NextFunction) => {
    const customError: { statusCode: number, message: string } = { statusCode: 500, message: 'Something went wrong, try again later.' }
    if (err instanceof MongooseError.ValidationError) {
        customError.statusCode = 400
        customError.message = Object.values(err.errors)
            .map(item => item.message)
            .join(',')
    }
    if (err instanceof MongoServerError) {
        if (err.code === 11000) {
            customError.statusCode = 400
            customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        }
    }
    if (err instanceof MongooseError.CastError) {
        customError.statusCode = 404
        customError.message = `No item found with id : ${err.value}`
    }
    return res.status(customError.statusCode).json({ message: customError.message })
}

export default errorHandlerMiddleware