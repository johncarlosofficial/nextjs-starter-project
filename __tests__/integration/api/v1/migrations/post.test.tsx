import fetch from "node-fetch";
import database from "infra/database";
import orchestrator from "infra/orchestrator";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await database.query({
        text: "drop schema public cascade; create schema public;",
    });
});

test("POST to /api/v1/migrations should return 200", async () => {
    const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
    });
    expect(response1.status).toBe(201);

    const responseBody1 = await response1.json();
    expect(Array.isArray(responseBody1.migratedMigrations)).toBe(true);
    expect(responseBody1.migratedMigrations.length).toBeGreaterThan(0);

    const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
    });
    expect(response2.status).toBe(200);

    const responseBody2 = await response2.json();
    expect(Array.isArray(responseBody2.migratedMigrations)).toBe(true);
    expect(responseBody2.migratedMigrations.length).toBe(0);
});
