import express from "express"
import { writeData, readData } from "../data/dataAccess.js"
import validateID from "../middlewares/validateID.js"

const router = express.Router()

router.post("/", async (req, res) => {
    const {customer, table, dishesList} = req.body
    const allOrders = await readData()
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

router.put("/:id", validateID, (req, res) => {
    const {customer, table, dishesList} = req.body
    if (!customer || !table || !dishesList) {
        return res.status(400).send("body field missing")
    }
    const id = req.params.id
    const allOrders = readData()
    const order = allOrders.find(order => order.id === +id)
    Object.assign(order, {customer, table, dishesList}) 
    writeData(allOrders)

    res.send(`Order ${id} updated`)
})

// router.delete("/:id")

// router.patch("/:id/status")


export default router