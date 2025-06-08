/* ------------------------------------------------------------------ */
/* ALL data logic lives here. Feel free to add validation / errors.   */
/* ------------------------------------------------------------------ */

// create or overwrite a store
export const init = (stores, id, sep, raw) => {
  if (!id || !sep) return false;
  stores.set(id, { sep, data: raw.split(sep).map(x => x.trim()).filter(Boolean) });
  return true;
};

// fixed-width page (page 1 = first <per> items, page 2 = next <per>, …)
export const list = (stores, id, page = 1, per = 10) => {
  const store = stores.get(id);
  if (!store) return "";
  const start = (page - 1) * per;
  return store.data.slice(start, start + per).join(store.sep);
};

// arbitrary slice (start index is 1-based)
export const slice = (stores, id, start = 1, count = 10) => {
  const store = stores.get(id);
  if (!store) return "";
  return store.data.slice(start - 1, start - 1 + count).join(store.sep);
};

// total pages (ceil)
export const count = (stores, id, per = 10) =>
  stores.has(id) ? Math.ceil(stores.get(id).data.length / per) : 0;

// append entries
export const add = (stores, id, values) => {
  const store = stores.get(id);
  if (!store) return false;
  store.data.push(...values.split(store.sep).map(x => x.trim()).filter(Boolean));
  return true;
};

// remove one entry by 1-based index
export const remove = (stores, id, index) => {
  const store = stores.get(id);
  if (!store || index < 1 || index > store.data.length) return false;
  store.data.splice(index - 1, 1);
  return true;
};

// sort asc / desc
export const sort = (stores, id, dir = "asc") => {
  const store = stores.get(id);
  if (!store) return false;
  store.data.sort();
  if (dir === "desc") store.data.reverse();
  return true;
};

// find first page containing query
export const search = (stores, id, query, per = 10) => {
  const store = stores.get(id);
  if (!store) return 0;
  const idx = store.data.findIndex(x => x.includes(query));
  return idx < 0 ? 0 : Math.floor(idx / per) + 1;
};