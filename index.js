import express from 'express'
import { v4 } from 'uuid'
import cors from 'cors'

const port = 3001
const app = express()
app.use(express.json())
app.use(cors())

const users = []

const checkId = (req, res, next) => {

    const { id } = req.params // RECEBE O ID PELA URL

    const index = users.findIndex(user => user.id === id) // PESQUISA SE O ID RECEBIDO CONSTA DENTRO DO ARRAY

    if (index < 0) {
        return res.status(404).json({ error: "Not Found" })
    } // SE NÃO RETORNAR NADA É EXIBIDA A MENSAGEM DE ERRRO


    req.userIndex = index
    req.userId = id

    // SE ENCONTRAR ELE SEGUE O FLUXO
    next()
}

app.post("/users", (req, res) => {
    const { name, age } = req.body // RECEBE PELO BODY (CLIENTE)
    const user = { id: v4(), name, age } // MONTA O OBJETO
    users.push(user) // ADICIONA O OBJETO MONTADO DENTRO DO ARRAY
    return res.status(201).json(user) // RETORNA O OBJETO CRIADO COM SUCESSO
})

app.get("/users", (req, res) => res.json(users)) // RETORNA O ARRAY PARA O BODY EM FORMA DE JSON

app.put("/users/:id", checkId, (req, res) => {
    const { name, age } = req.body
    const index = req.userIndex
    const id = req.userId


    const updateUser = { id, name, age } // CRIANDO UM NOVO OBEJTO COM AS ATUALIZAÇÕES RECEBIDAS

    users[index] = updateUser // SUBSTITUINDO O OBJETO PELO ATUALIZADO

    return res.json(users)
})

app.delete("/users/:id", checkId, (req, res) => {
    const index = req.userIndex

    users.splice(index, 1)

    return res.status(204).json()
})


app.listen(port, () => {
    console.log(`🚀 Server started in port:${port}`)
})