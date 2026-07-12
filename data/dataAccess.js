import fs from "fs/promises"


export const readData = async () => {
    const data = await fs.readFile("./data/orders.json", "utf8")
    return JSON.parse(data)
}

export const writeData = async (data) => {
    fs.writeFile("./data/orders.json", JSON.stringify(data, null, 2))
}