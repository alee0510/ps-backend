import { test, expect } from "@playwright/test";

test("GET /tasks should return 200", async ({ baseURL, request }) => {
  const response = await request.get(baseURL + "/tasks");
  expect(response.status()).toBe(200);

  const { success } = await response.json();
  expect(success).toBe(true);
});

test("GET /tasks should array of tasks", async ({ baseURL, request }) => {
  const response = await request.get(baseURL + "/tasks");
  expect(response.status()).toBe(200);

  const { data } = await response.json();
  expect(Array.isArray(data)).toBe(true);
  expect(data.length).toBeGreaterThan(0);
});

test("GET /tasks if data empty it should resturn { succes: false, data : [], count 0}", async ({
  baseURL,
  request,
}) => {
  const response = await request.get(baseURL + "/tasks");
  expect(response.status()).toBe(200);

  const { success, data } = await response.json();
  if (data.length === 0) {
    expect(success).toBe(false);
  }
});
