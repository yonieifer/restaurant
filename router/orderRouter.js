import express from "express"
import { writeData, readData } from "../data/dataAccess.js"
import validateID from "../middlewares/validateID.js"

const router = express.Router()

router.post("/", async (req, res) => {
    const allOrders = await readData()
    const {customer, table, dishesList} = req.body
    const newOrder = {
        id: Math.max(0, ...allOrders.map(o => o.id)) + 1,
        customer: customer,
        table: table,
        dishesList: dishesList,
        status: "NEW"
    }
    await writeData(newOrder)
    res.status(201).send("New order created")
})

router.get("/", async (req, res) => {
    const allOrders = await readData()
    res.send(allOrders)
})

router.get("/:id", validateID, (req, res) => {
    const order = req.order
    res.send(order)
})

// router.put("/:id")

// router.delete("/:id")

// router.patch("/:id/status")


export default router