const express = require('express');
const { v4: uuidV4 } = require("uuid")
const app = express();
app.use(express.json());

const costumers = [];

function verifyExistsAccountCPF(request, response, next) {
    const { cpf } = request.headers;
    const customer = costumers.find((customer) => customer.cpf === cpf);
    if (!customer) {
        return response.status(404).send({ message: "Customer not found." })
    }
    request.customer = customer;
    return next();
}

function getBalance(statment) {
    const balance = statment.reduce((acc, operation) => {
        if (operation.type === "credit") {
            return (acc + operation.amount);
        } else {
            return (acc - operation.amount);
        }
    }, 0)
    
    return balance;
}

app.post('/account', (request, response) => {
    const { cpf, name } = request.body
    const customerAlreadyExist = costumers.some((element) => element.cpf === cpf);

    if (customerAlreadyExist) {
        return response.status(400).send({ message: "Customer already exists." });
    }
    costumers.push({
        cpf,
        name,
        id: uuidV4(),
        statment: []

    })
    console.log(costumers);
    return response.status(201).send()
})

app.get('/statement', verifyExistsAccountCPF, (request, response) => {
    const { customer } = request;
    return response.json(customer.statment);
})

app.post("/deposit", verifyExistsAccountCPF, (request, response) => {
    const { description, amount } = request.body;
    const { customer } = request;

    const statmentOperation = {
        description,
        amount,
        create_at: new Date(),
        type: "credit",
    };
    customer.statment.push(statmentOperation);
    return response.status(201).send();
})

app.post("/withdraw", verifyExistsAccountCPF, (request, response) => {
    const {amount} = request.body;
    const { customer } = request;
    const balance = getBalance(customer.statment)
    if(balance < amount){
        return response.status(400).send({ message: "Insufficient balance." })
    }
    const statmentOperation = {
        amount,
        create_at: new Date(),
        type: "debit",
    }

    customer.statment.push(statmentOperation);
    return response.status(201).send();
})

app.listen(3333)