import express from "express";
import { writeData, readData } from "../data/dataAccess.js";
import validateID from "../middlewares/validateID.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { customer, table, dishesList } = req.body;
    const allOrders = await readData();
    const newOrder = {
        id: Math.max(0, ...allOrders.map((o) => o.id)) + 1,
        customer: customer,
        table: table,
        dishesList: dishesList,
        status: "NEW",
    };
    allOrders.push(newOrder)
    await writeData(allOrders);
    res.status(201).send("New order created");
});

router.get("/", async (req, res) => {
    const filter = req.query
    const allOrders = await readData();
    const filterdOrders = allOrders.filter(order => {
        for (const key in filter) {
            if (order[key] === filter[key]) return true
            return false
        }
    })
    res.send(filterdOrders);
});

router.get("/:id", validateID, (req, res) => {
    const order = req.order;
    res.send(order);
});

router.put("/:id", validateID, async (req, res) => {
    const { customer, table, dishesList } = req.body;
    if (!customer || !table || !dishesList) {
        return res.status(400).send("body field missing");
    }
    const id = req.params.id;
    const allOrders = await readData();
    const order = allOrders.find((order) => order.id === +id);
    Object.assign(order, { customer, table, dishesList });
    writeData(allOrders);

    res.send(`Order ${id} updated`);
});

router.delete("/:id", validateID, async (req, res) => {
    const id = req.params.id;
    const allOrders = await readData();
    const updatedOrders = allOrders.filter((order) => order.id !== +id);
    await writeData(updatedOrders);
    res.send(`order ${id} deleted`);
});

router.patch("/:id/status", validateID, async (req, res) => {
    const id = req.params.id;
    const newStatus = req.body.status;
    const allOrders = await readData();
    const order = allOrders.find((order) => order.id === +id);
    const oldStatus = order.status;
    if (
        (newStatus === "CANCELLED" &&
            ["NEW", "PREPARING"].includes(oldStatus)) ||
        (oldStatus === "NEW" && newStatus === "PREPARING") ||
        (oldStatus === "PREPARING" && newStatus === "READY") ||
        (oldStatus === "READY" && newStatus === "DELIVERED")
    ) {
        order.status = newStatus
        await writeData(allOrders)
        return res.send("updated")
    }
    res.status(400).send("not authorized status")
});

export default router;
