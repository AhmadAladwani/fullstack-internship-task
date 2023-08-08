import { config } from "dotenv"
config()
import "express-async-errors"

import express from "express"
export const app = express()

import rateLimiter from "express-rate-limit"
import helmet from "helmet"
import cors from "cors"
import mongoSanitize from "express-mongo-sanitize"

import router from "./routes/userRoutes"
import connectDB from "./db/connect"
import errorHandlerMiddleware from "./middleware/error-handler"

app.set('trust proxy', 1)
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
}))
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(mongoSanitize())

app.use(express.json())

app.use('/api', router)
app.get('/api/test', (_, res) => res.json({ greeting: 'Hello' }))

app.use(errorHandlerMiddleware)

async function start() {
    try {
        await connectDB(process.env.MONGO_URI!)
        if (!process.env['VITE']) {
            const frontendFiles = process.cwd() + '/dist'
            app.use(express.static(frontendFiles))
            app.get('/*', (_, res) => {
                res.send(frontendFiles + '/index.html')
            })
            app.listen(process.env['PORT'])
        }
    } catch (error) {}
}

start()