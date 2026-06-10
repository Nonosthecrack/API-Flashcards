import { describe, it, expect } from "vitest";
import { api, registerAndLogin, createCollection, createFlashcard } from "./helpers.js";

async function setupRevision() {
  const { token } = await registerAndLogin();

  await createCollection(token, { visibility: "public" });
  const meRes = await api
    .get("/collections/me/list")
    .set("Authorization", `Bearer ${token}`);
  const collectionId = meRes.body[0]?.id;

  await createFlashcard(token, collectionId);
  const listRes = await api
    .get("/flashcards")
    .set("Authorization", `Bearer ${token}`);
  const flashCardId = listRes.body[0]?.id;

  return { token, collectionId, flashCardId };
}

describe("GET /revision/to-review", () => {
  it("retourne 401 sans token", async () => {
    const res = await api.get("/revision/to-review");
    expect(res.status).toBe(401);
  });

  it("retourne un tableau vide si aucune carte a reviser", async () => {
    const { token } = await registerAndLogin();
    const res = await api
      .get("/revision/to-review")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(0);
  });
});

describe("POST /revision/review/:flashCardId", () => {
  it("cree une entree de progression au premier passage (niveau 1)", async () => {
    const { token, flashCardId } = await setupRevision();

    const res = await api
      .post(`/revision/review/${flashCardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.level).toBe(1);
    expect(res.body.message).toContain("first time");
  });

  it("incremente le niveau au deuxieme passage", async () => {
    const { token, flashCardId } = await setupRevision();

    // Premier passage
    await api
      .post(`/revision/review/${flashCardId}`)
      .set("Authorization", `Bearer ${token}`);

    // Deuxieme passage
    const res = await api
      .post(`/revision/review/${flashCardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.level).toBe(2);
    expect(res.body.nextStudyDate).toBeDefined();
  });

  it("plafonne le niveau a 5", async () => {
    const { token, flashCardId } = await setupRevision();

    // 6 passages
    for (let i = 0; i < 6; i++) {
      await api
        .post(`/revision/review/${flashCardId}`)
        .set("Authorization", `Bearer ${token}`);
    }

    const res = await api
      .post(`/revision/review/${flashCardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.level).toBe(5);
  });

  it("retourne 401 sans token", async () => {
    const res = await api.post("/revision/review/fake-id");
    expect(res.status).toBe(401);
  });
});
