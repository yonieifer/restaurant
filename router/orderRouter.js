import express from "express"
import { writeData } from "../data/dataAccess.js"

const router = express.Router()

router.post("/", async (req, res) => {
    const {customer, table, dishesList}
    const newOrder = {
        customer: customer,
        table: table,
        dishesList = dishesList,
        status: "NEW"
    }
    await writeData(newOrder)
})

router.get("/")

router.get("/:id")

router.put("/:id")

router.delete("/:id")


export default router