export type CatalogType = "universities" | "majors" | "combinations";

export type CatalogMeta = { total: number; page: number; limit: number };

export type CatalogListResponse<T> = {
  data: T[];
  meta: CatalogMeta;
};

