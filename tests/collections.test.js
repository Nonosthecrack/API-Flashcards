import { describe, it, expect } from "vitest";
import { api, registerAndLogin, createCollection } from "./helpers.js";

describe("GET /collections", () => {
  it("retourne 401 sans token", async () => {
    const res = await api.get("/collections");
    expect(res.status).toBe(401);
  });

  it("retourne 200 avec un tableau vide au depart", async () => {
    const { token } = await registerAndLogin();
    const res = await api
      .get("/collections")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("POST /collections", () => {
  it("cree une collection avec des donnees valides", async () => {
    const { token } = await registerAndLogin();
    const res = await createCollection(token);

    expect(res.status).toBe(201);
  });

  it("retourne 400 si le titre est trop court", async () => {
    const { token } = await registerAndLogin();
    const res = await createCollection(token, { title: "abc" });

    expect(res.status).toBe(400);
  });

  it("retourne 400 si visibility est invalide", async () => {
    const { token } = await registerAndLogin();
    const res = await createCollection(token, { visibility: "invalid" });

    expect(res.status).toBe(400);
  });

  it("retourne 401 sans token", async () => {
    const res = await api.post("/collections").send({
      title: "Test",
      description: "Test",
      visibility: "public",
    });
    expect(res.status).toBe(401);
  });
});

describe("GET /collections/:id", () => {
  it("retourne une collection publique", async () => {
    const { token } = await registerAndLogin();
    const created = await createCollection(token, { visibility: "public" });

    const allRes = await api
      .get("/collections")
      .set("Authorization", `Bearer ${token}`);
    const colId = allRes.body[0]?.id ||
      (await api.get("/collections/me/list").set("Authorization", `Bearer ${token}`)).body[0]?.id;

    // On recupere via me/list pour avoir l'id
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${token}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .get(`/collections/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(id);
  });

  it("retourne 404 pour un id inexistant", async () => {
    const { token } = await registerAndLogin();
    const res = await api
      .get("/collections/id-qui-nexiste-pas")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("retourne 403 pour une collection privee d'un autre utilisateur", async () => {
    const { token: owner } = await registerAndLogin({ email: "owner@test.com" });
    const { token: other } = await registerAndLogin({ email: "other@test.com" });

    await createCollection(owner, { visibility: "private" });
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${owner}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .get(`/collections/${id}`)
      .set("Authorization", `Bearer ${other}`);

    expect(res.status).toBe(403);
  });
});

describe("PUT /collections/:id", () => {
  it("met a jour sa propre collection", async () => {
    const { token } = await registerAndLogin();
    await createCollection(token);
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${token}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .put(`/collections/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Nouveau titre", description: "Nouvelle description" });

    expect(res.status).toBe(200);
  });

  it("retourne 403 si on modifie la collection d'un autre", async () => {
    const { token: owner } = await registerAndLogin({ email: "owner@test.com" });
    const { token: other } = await registerAndLogin({ email: "other@test.com" });

    await createCollection(owner);
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${owner}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .put(`/collections/${id}`)
      .set("Authorization", `Bearer ${other}`)
      .send({ title: "Titre vole", description: "Description volee" });

    expect(res.status).toBe(403);
  });
});

describe("DELETE /collections/:id", () => {
  it("supprime sa propre collection", async () => {
    const { token } = await registerAndLogin();
    await createCollection(token);
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${token}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .delete(`/collections/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("retourne 403 si on supprime la collection d'un autre", async () => {
    const { token: owner } = await registerAndLogin({ email: "owner@test.com" });
    const { token: other } = await registerAndLogin({ email: "other@test.com" });

    await createCollection(owner);
    const meRes = await api
      .get("/collections/me/list")
      .set("Authorization", `Bearer ${owner}`);
    const id = meRes.body[0]?.id;

    const res = await api
      .delete(`/collections/${id}`)
      .set("Authorization", `Bearer ${other}`);

    expect(res.status).toBe(403);
  });
});
