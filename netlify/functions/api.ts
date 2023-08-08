import { config } from "dotenv"
config()
import "express-async-errors"

import express from "express"
import serverless from "serverless-http"

export const api = express()

import rateLimiter from "express-rate-limit"
import helmet from "helmet"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"

import router from "../../server/routes/userRoutes"
import connectDB from "../../server/db/connect"
import errorHandlerMiddleware from "../../server/middleware/error-handler"

api.set('trust proxy', 1)
api.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}))
api.use(helmet({ contentSecurityPolicy: false }))
api.use(cors())
api.use(mongoSanitize())

api.use(express.json())

api.use('/api', router)

api.use(errorHandlerMiddleware)

async function start() {
    try {
        await connectDB(process.env.MONGO_URI!)
        if (!process.env['VITE']) {
            const frontendFiles = process.cwd() + '/dist'
            api.use(express.static(frontendFiles))
            api.get('/*', (_, res) => {
                res.send(frontendFiles + '/index.html')
            })
            api.listen(process.env['PORT'])
        }
    } catch (error) {}
}

start()

export const handler = serverless(api)