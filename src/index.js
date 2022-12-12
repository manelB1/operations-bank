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
    const { amount } = request.body;
    const { customer } = request;
    const balance = getBalance(customer.statment)
    if (balance < amount) {
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

app.get('/statement/date', verifyExistsAccountCPF, (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormated = new Date(date + " 00:00");

    const statment = customer.statment.filter((statment) => statment.create_at.toDateString() === new Date(dateFormated).toDateString());
    return response.json(statment);
})

app.put("/account", verifyExistsAccountCPF, (request, response) => {
    const { name } = request.body;
    const { customer } = request;

    customer.name = name;

    return response.status(201).send();
})

app.get("/account", verifyExistsAccountCPF, (request, response) => {
    const { customer } = request;

    return response.json(customer)
})

app.get("/balance", verifyExistsAccountCPF ,(request, response) => {
    const { customer } = request;

    const balance = getBalance(customer.statment);
    return response.json(balance);
})

app.delete("/account", verifyExistsAccountCPF, (request, response) => {
    const { customer } = request;

    costumers.slice(customer, 1)

    return response.status(200).json(customer);
})


app.listen(3333)