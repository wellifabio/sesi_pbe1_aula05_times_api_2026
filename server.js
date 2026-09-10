const express = require("express")
const cors = require('cors')
const times = require("./times.json")

//Funções diversas
const autoIncrement = () => {
    times.sort((a, b) => a.id - b.id)
    const ultimoTime = times[times.length - 1]
    return ultimoTime.id + 1
}

function calcOrdem() {
    for (const time of times) {
        time.vitorias = Number(time.vitorias)
        time.empates = Number(time.empates)
        time.derrotas = Number(time.derrotas)
        time.pontos = time.vitorias * 3 + Number(time.empates)
        time.jogos = time.vitorias + time.derrotas + time.empates
    }
    times.sort((a, b) => b.pontos - a.pontos)
}

//Rota de teste
const rotaInicial = (req, res) => {
    res.json("Back-end respondendo")
}

//Funções CRUD
const createTime = (req, res) => {
    const dados = req.body
    dados.id = autoIncrement()
    if (req.body) {
        times.push(dados)
        // res.status(201).json(dados)
        res.redirect('http://127.0.0.1:5500/client/')
    } else {
        res.status(400).json("Erro ao receber time")
    }
}

const readTimes = (req, res) => {
    calcOrdem()
    res.json(times)
}

const updateTime = (req, res) => {
    const id = req.params.id
    const dados = req.body
    let status = 0

    times.forEach((time, indice) => {
        if (time.id == id) {
            dados.id = Number(id)
            times[indice] = dados
            status = 1
        }
    })

    if (status == 1) {
        res.status(202).json(dados)
    } else {
        res.status(404).send("Time não encontrado")
    }
}

const deleteTime = (req, res) => {
    const id = req.params.id
    let status = 0

    times.forEach((time, indice) => {
        if (time.id == id) {
            times.splice(indice, 1)
            status = 1
        }
    })

    if (status == 1) {
        res.json("Time excluido com sucesso")
    } else {
        res.status(404).send("Time não encontrado")
    }
}

//Configurações do servidor
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const porta = 3000

//Rotas
app.get('/', rotaInicial)
app.post('/times', createTime)
app.get('/times', readTimes)
app.put('/times/:id', updateTime)
app.delete('/times/:id', deleteTime)

app.listen(porta, () => {
    console.log(`Servidor respondendo em: http://localhost:${porta}`)
    console.log(`Rotas:`)
    console.log(`Post time: http://localhost:${porta}/times`)
    console.log(`Get times: http://localhost:${porta}/times`)
    console.log(`Put time: http://localhost:${porta}/times/:id`)
    console.log(`Delete time: http://localhost:${porta}/times/:id`)
})