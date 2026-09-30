const express = require("express");

const app = express();

app.use(express.json());

const customers = [
    {
        id: 1,
        name: "Arun Kumar",
        email: "arun23@gmail.com"
    },
    {
        id: 2,
        name: "Priya Devi",
        email: "priyasweety@gmail.com"
    }
];

// Health endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "UP",
        message: "Customer Portal is running"
    });
});

// Get all customers
app.get("/customers", (req, res) => {
    res.status(200).json(customers);
});

// Get customer by ID
app.get("/customers/:id", (req, res) => {
    const id = Number(req.params.id);

    const customer = customers.find(c => c.id === id);

    if (!customer) {
        return res.status(404).json({
            message: "Customer not found"
        });
    }

    res.status(200).json(customer);
});

// Register customer
app.post("/customers/register", (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message: "Name and email are required"
        });
    }

    const newCustomer = {
        id: customers.length + 1,
        name,
        email
    };

    customers.push(newCustomer);

    res.status(201).json({
        message: "Customer registered successfully",
        customer: newCustomer
    });
});

// Start server only when this file is executed directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
        console.log(`Customer Portal running on port ${PORT}`);
    });
}

module.exports = app;