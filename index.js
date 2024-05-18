const uuid = require('uuid')
const express = require('express')

const port = 3000
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

const orders = []

const checkId = (req, res, next) => {

    const { id } = req.params // RECEBE O ID PELA URL

    const index = orders.findIndex(order => order.id === id) // PESQUISA SE O ID RECEBIDO CONSTA DENTRO DO ARRAY

    if (index < 0) {
        return res.status(404).json({ error: "Not Found" })
    } // SE NÃO RETORNAR NADA É EXIBIDA A MENSAGEM DE ERRRO


    req.orderIndex = index
    req.orderId = id

    // SE ENCONTRAR ELE SEGUE O FLUXO
    next()
}

const checkUrlandMethod = (req, res, next) => {

    const method = req.method
    const url = req.url

    console.log(`[${method}]-${url} `)

    next()
}

app.post("/orders", checkUrlandMethod, (req, res) => {
    const { items, clientName, price } = req.body // RECEBE PELO BODY (CLIENTE)
    const order = { id: uuid.v4(), items, clientName, price, status: "Em preparação" } // MONTA O OBJETO
    orders.push(order) // ADICIONA O OBJETO MONTADO DENTRO DO ARRAY
    return res.status(201).json(order) // RETORNA O OBJETO CRIADO COM SUCESSO
})

app.get("/orders", checkUrlandMethod, (req, res) => res.json(orders)) // RETORNA O ARRAY PARA O BODY EM FORMA DE JSON

app.put("/orders/:id", checkId, checkUrlandMethod, (req, res) => {
    const { items, clientName, price } = req.body
    const index = req.orderIndex
    const id = req.orderId


    const updateOrder = { id, items, clientName, price } // CRIANDO UM NOVO OBEJTO COM AS ATUALIZAÇÕES RECEBIDAS

    orders[index] = updateOrder // SUBSTITUINDO O OBJETO PELO ATUALIZADO

    return res.json(orders)
})

app.delete("/orders/:id", checkId, checkUrlandMethod, (req, res) => {
    const index = req.orderIndex

    orders.splice(index, 1)

    return res.status(204).json()
})

app.get("/orders/:id", checkId, checkUrlandMethod, (req, res) => {
    const index = req.orderIndex
    const clientOrder = orders[index]

    return res.json(clientOrder)
}) // RETORNA O PEDIDO REF AO ID INFORMADO EM FORMA DE JSON

app.patch("/orders/:id", checkId, checkUrlandMethod, (req, res) => {
    const index = req.orderIndex

    const clientOrder = orders[index]

    const orderReady = {
        id: clientOrder.id,
        items: clientOrder.items,
        clientName: clientOrder.clientName,
        price: clientOrder.price,
        status: "Pronto"
    }

    return res.json(orderReady)
})

app.listen(port, () => {
    console.log(`🚀 Server started in port:${port}`)
})