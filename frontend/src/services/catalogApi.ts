import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:3000/api/v1";

function getToken() {
  return localStorage.getItem("token");
}

const client = axios.create({
  baseURL: BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

type CatalogType = "universities" | "majors" | "combinations";

export async function getCatalogList(params: {
  type: CatalogType;
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { type, page = 1, limit = 10, search = "" } = params;
  const res = await client.get(`/catalogs/${type}`, {
    params: { page, limit, search },
  });
  return res.data as { data: any[]; meta: { total: number; page: number; limit: number } };
}

export async function createCatalogItem(params: {
  type: CatalogType;
  payload: any;
}) {
  const { type, payload } = params;
  const res = await client.post(`/catalogs/${type}`, payload);
  return res.data;
}

export async function updateCatalogItem(params: {
  type: CatalogType;
  id: string;
  payload: any;
}) {
  const { type, id, payload } = params;
  const res = await client.put(`/catalogs/${type}/${id}`, payload);
  return res.data;
}

export async function deleteCatalogItem(params: {
  type: CatalogType;
  id: string;
}) {
  const { type, id } = params;
  const res = await client.delete(`/catalogs/${type}/${id}`);
  return res.data;
}

