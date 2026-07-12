import { readData } from "../data/dataAccess"

export default async (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).send("no ID")
    }
    const id = req.params.id
    const allOrders = await readData()
    const order = allOrders.find(order => order.id === +id)
    if (!order) {
        return res.status(401).send(`Order ${id} not found`)
    }
    req.order = order
    next()
}