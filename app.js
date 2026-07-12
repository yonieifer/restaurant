import express from "express"
import router from "./router/orderRouter"
import logger from "./middlewares/logger.js" 

const app = express()

app.use(express.json())

app.use(logger)

app.use("/order", router)