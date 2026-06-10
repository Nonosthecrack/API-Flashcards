import { describe, it, expect } from "vitest";
import { api, registerAndLogin, createCollection, createFlashcard } from "./helpers.js";

async function setupUserWithCollection(email = "user@test.com", visibility = "public") {
  const { token } = await registerAndLogin({ email });
  await createCollection(token, { visibility });
  const meRes = await api
    .get("/collections/me/list")
    .set("Authorization", `Bearer ${token}`);
  const collectionId = meRes.body[0]?.id;
  return { token, collectionId };
}

describe("GET /flashcards", () => {
  it("retourne 401 sans token", async () => {
    const res = await api.get("/flashcards");
    expect(res.status).toBe(401);
  });

  it("retourne 200 avec un tableau", async () => {
    const { token } = await registerAndLogin();
    const res = await api
      .get("/flashcards")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /flashcards", () => {
  it("cree une flashcard dans sa collection", async () => {
    const { token, collectionId } = await setupUserWithCollection();
    const res = await createFlashcard(token, collectionId);

    expect(res.status).toBe(201);
  });

  it("retourne 404 si la collection n'existe pas", async () => {
    const { token } = await registerAndLogin();
    const res = await createFlashcard(token, "id-inexistant");

    expect(res.status).toBe(404);
  });

  it("retourne 403 si on ajoute dans la collection d'un autre", async () => {
    const { collectionId } = await setupUserWithCollection("owner@test.com");
    const { token: other } = await registerAndLogin({ email: "other@test.com" });

    const res = await createFlashcard(other, collectionId);
    expect(res.status).toBe(403);
  });

  it("retourne 400 si rectoText est vide", async () => {
    const { token, collectionId } = await setupUserWithCollection();
    const res = await createFlashcard(token, collectionId, { rectoText: "" });

    expect(res.status).toBe(400);
  });

  it("retourne 401 sans token", async () => {
    const res = await api.post("/flashcards").send({
      rectoText: "Q",
      versoText: "R",
      collectionId: "id",
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /flashcards/:id", () => {
  it("retourne une flashcard accessible", async () => {
    const { token, collectionId } = await setupUserWithCollection();
    await createFlashcard(token, collectionId);

    const listRes = await api
      .get("/flashcards")
      .set("Authorization", `Bearer ${token}`);
    const id = listRes.body[0]?.id;

    const res = await api
      .get(`/flashcards/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("retourne 404 pour un id inexistant", async () => {
    const { token } = await registerAndLogin();
    const res = await api
      .get("/flashcards/id-inexistant")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("retourne 403 pour une flashcard dans une collection privee d'un autre", async () => {
    const { token: owner, collectionId } = await setupUserWithCollection("owner@test.com", "private");
    await createFlashcard(owner, collectionId);

    const listRes = await api
      .get("/flashcards")
      .set("Authorization", `Bearer ${owner}`);
    const id = listRes.body[0]?.id;

    const { token: other } = await registerAndLogin({ email: "other@test.com" });
    const res = await api
      .get(`/flashcards/${id}`)
      .set("Authorization", `Bearer ${other}`);

    expect(res.status).toBe(403);
  });
});

describe("DELETE /flashcards/:id", () => {
  it("supprime sa propre flashcard", async () => {
    const { token, collectionId } = await setupUserWithCollection();
    await createFlashcard(token, collectionId);

    const listRes = await api
      .get("/flashcards")
      .set("Authorization", `Bearer ${token}`);
    const id = listRes.body[0]?.id;

    const res = await api
      .delete(`/flashcards/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("retourne 403 si on supprime la flashcard d'un autre", async () => {
    const { token: owner, collectionId } = await setupUserWithCollection("owner@test.com");
    await createFlashcard(owner, collectionId);

    const listRes = await api
      .get("/flashcards")
      .set("Authorization", `Bearer ${owner}`);
    const id = listRes.body[0]?.id;

    const { token: other } = await registerAndLogin({ email: "other@test.com" });
    const res = await api
      .delete(`/flashcards/${id}`)
      .set("Authorization", `Bearer ${other}`);

    expect(res.status).toBe(403);
  });
});
