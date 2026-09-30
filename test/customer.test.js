const request = require("supertest");
const app = require("../server");

describe("Customer Portal API Tests", () => {

    test("Health endpoint should return UP", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe("UP");
    });

    test("Get all customers should return customer list", async () => {
        const response = await request(app)
            .get("/customers");

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    test("Get customer by ID should return customer details", async () => {
        const response = await request(app)
            .get("/customers/1");

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(1);
        expect(response.body.name).toBe("Arun Kumar");
    });

    test("Customer registration should create a new customer", async () => {
        const response = await request(app)
            .post("/customers/register")
            .send({
                name: "Siva Kumar",
                email: "siva@example.com"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe(
            "Customer registered successfully"
        );
        expect(response.body.customer.name).toBe("Siva Kumar");
    });

});