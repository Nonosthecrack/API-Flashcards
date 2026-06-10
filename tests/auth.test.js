import { describe, it, expect } from "vitest";
import { api, registerAndLogin } from "./helpers.js";

describe("POST /auth/register", () => {
  it("retourne 201 avec un token sur donnees valides", async () => {
    const res = await api.post("/auth/register").send({
      email: "new@test.com",
      name: "Jean",
      surname: "Dupont",
      password: "secret123",
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.userData.email).toBe("new@test.com");
  });

  it("retourne 400 si email invalide", async () => {
    const res = await api.post("/auth/register").send({
      email: "pas-un-email",
      name: "Jean",
      surname: "Dupont",
      password: "secret123",
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Validation failed");
  });

  it("retourne 400 si mot de passe trop court", async () => {
    const res = await api.post("/auth/register").send({
      email: "jean@test.com",
      name: "Jean",
      surname: "Dupont",
      password: "abc",
    });

    expect(res.status).toBe(400);
  });

  it("retourne 400 si champs manquants", async () => {
    const res = await api.post("/auth/register").send({ email: "a@b.com" });

    expect(res.status).toBe(400);
  });
});

describe("POST /auth/login", () => {
  it("retourne un token sur credentials valides", async () => {
    await api.post("/auth/register").send({
      email: "user@test.com",
      name: "Test",
      surname: "User",
      password: "secret123",
    });

    const res = await api
      .post("/auth/login")
      .send({ email: "user@test.com", password: "secret123" });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
  });

  it("retourne 401 sur mauvais mot de passe", async () => {
    await api.post("/auth/register").send({
      email: "user@test.com",
      name: "Test",
      surname: "User",
      password: "secret123",
    });

    const res = await api
      .post("/auth/login")
      .send({ email: "user@test.com", password: "mauvais_mdp" });

    expect(res.status).toBe(401);
  });

  it("retourne 401 si email inconnu", async () => {
    const res = await api
      .post("/auth/login")
      .send({ email: "inconnu@test.com", password: "secret123" });

    expect(res.status).toBe(401);
  });
});

describe("GET /auth/me", () => {
  it("retourne le profil de l'utilisateur connecte", async () => {
    const { token, user } = await registerAndLogin();

    const res = await api
      .get("/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });

  it("retourne 401 sans token", async () => {
    const res = await api.get("/auth/me");
    expect(res.status).toBe(401);
  });

  it("retourne 401 avec un token invalide", async () => {
    const res = await api
      .get("/auth/me")
      .set("Authorization", "Bearer token_invalide");
    expect(res.status).toBe(401);
  });
});
