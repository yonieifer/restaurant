import express from "express"
import router from "./router/orderRouter.js"
import logger from "./middlewares/logger.js" 

const app = express()

app.use(express.json())

app.use(logger)

app.use("/order", router)

app.listen(3000, () => console.log("server is up!"))