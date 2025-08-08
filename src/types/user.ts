export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  active: boolean;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
};
