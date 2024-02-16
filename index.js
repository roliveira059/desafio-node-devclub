const express = require('express')
const uuid = require('uuid')
const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if(index < 0){
        return response.status(404).json({ error: "User not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrlMethod = (request, response, next) =>{
    console.log(`Método ${request.method}, url: ${request.url}`)
    
    next()
}


app.get('/orders', checkUrlMethod, (request, response) => {
    return response.json(orders)
})

app.get('/orders/:id',checkOrderId, checkUrlMethod, (request, response) => {
    const index = request.orderIndex
    
    const showOrders = orders[index]
 
    return response.json(showOrders)
})


app.post('/orders', checkUrlMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const orderId = { id: uuid.v4(), order, clientName, price, status }

    orders.push(orderId)
    
    return response.status(201).json(orders)
})

app.put('/orders/:id', checkOrderId, checkUrlMethod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const { id } = request.params
    
    const updateOrder = { id, order, clientName, price, status}

    orders[index] = updateOrder

    console.log(`Método ${request.method}, url: ${request.url}`)
    return response.json(updateOrder)
})

app.delete('/orders/:id', checkOrderId, checkUrlMethod, (request, response) => {

    const index = request.orderIndex

    orders.splice(index, 1)

    console.log(`Método ${request.method}, url: ${request.url}`)
    return response.status(204).json()
})



app.listen(3000, () => {
    console.log(`🚀 Server started on port ${port}`) 
})