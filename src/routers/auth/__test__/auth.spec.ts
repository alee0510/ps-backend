import { test, expect } from "@playwright/test";

test("POST /auth/login should return 200", async ({ baseURL, request }) => {
  const response = await request.post(baseURL + "/auth/login", {
    data: {
      email: "alexandria@gmail.com",
      password: "l@LLip0p",
    },
  });
  expect(response.status()).toBe(200);
});

test("POST /auth/login should return 400 if email is invalid", async ({
  baseURL,
  request,
}) => {
  const response = await request.post(baseURL + "/auth/login", {
    data: {
      email: "alexan@.com",
      password: "l@LLip0p",
    },
  });
  expect(response.status()).toBe(400);
});
