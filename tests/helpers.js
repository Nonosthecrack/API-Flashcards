import request from "supertest";
import app from "../src/app.js";

export const api = request(app);

export async function registerAndLogin(overrides = {}) {
  const user = {
    email: "user@test.com",
    name: "Test",
    surname: "User",
    password: "secret123",
    ...overrides,
  };

  await api.post("/auth/register").send(user);

  const res = await api
    .post("/auth/login")
    .send({ email: user.email, password: user.password });

  return { token: res.body.token, user: res.body.userData };
}

export async function createCollection(token, overrides = {}) {
  return api
    .post("/collections")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Ma collection test",
      description: "Description de test",
      visibility: "public",
      ...overrides,
    });
}

export async function createFlashcard(token, collectionId, overrides = {}) {
  return api
    .post("/flashcards")
    .set("Authorization", `Bearer ${token}`)
    .send({
      rectoText: "Quelle est la capitale de la France ?",
      versoText: "Paris",
      rectoUrl: "",
      versoUrl: "",
      collectionId,
      ...overrides,
    });
}
