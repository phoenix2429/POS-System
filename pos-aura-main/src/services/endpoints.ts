import api from "./api";

export const authService = {
  login: (email: string, password: string) =>
    api.post("/auth/login", { email, password }),
};

export const categoryService = {
  getAll: () => api.get("/category"),
  create: (data: { name: string }) => api.post("/category", data),
  update: (id: number, data: { name: string }) => api.put(`/category/${id}`, data),
  delete: (id: number) => api.delete(`/category/${id}`),
};

export const itemService = {
  getAll: () => api.get("/item"),
  create: (data: FormData) => api.post("/item", data, { headers: { "Content-Type": "multipart/form-data" } }),
  delete: (id: number) => api.delete(`/item/${id}`),
};

export const orderService = {
  create: (data: any) => api.post("/order", data),
  getAll: () => api.get("/orders"),
};

export const dashboardService = {
  get: () => api.get("/dashboard"),
};

export const userService = {
  getAll: () => api.get("/users"),
  create: (data: any) => api.post("/users", data),
  delete: (id: number) => api.delete(`/users/${id}`),
};
