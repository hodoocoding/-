import { rest } from "msw";
import { ProductType } from "types/product";
import products from "./data/products.json";

const cacheData = JSON.parse(localStorage.getItem("resist_products") || "{}");

export const handlers = [
  // 아이템 목록
  rest.get("/products", (req, res, ctx) => {
    if (cacheData.length) {
      const data = cacheData.state.products;
      console.log("캐시데이터", products);
      return res(ctx.status(200), ctx.json({ data: { products: data } }));
    }
    return res(ctx.status(200), ctx.json({ data: { products } }));
  }),

  // 아이템 추가
  rest.post("/products", (req: any, res, ctx) => {
    products.push(req.body);
    return res(ctx.status(200), ctx.json({ data: { products } }));
  }),

  // 아이템 조회
  rest.get("/products/:id", (req, res, ctx) => {
    const { id } = req.params;
    const data = cacheData.length ? cacheData.state.products : products;
    const filtered = data.filter((product: ProductType) => product.id === id);
    return res(ctx.status(200), ctx.json({ data: { product: filtered[0] } }));
  }),

  // 아이템 삭제
  rest.delete("/products/:id", (req, res, ctx) => {
    const { id } = req.params;
    const data = cacheData.length ? cacheData.state.products : products;
    const filtered = data.filter((product: ProductType) => product.id !== id);

    return res(ctx.status(200), ctx.json({ data: { products: filtered } }));
  }),

  // 아이템 업데이트
  rest.put("/products/:id", (req: any, res, ctx) => {
    const { id } = req.params;
    const data = cacheData.length ? cacheData.state.products : products;
    const shallowdata = [...data];
    const target = shallowdata.find(
      (product: ProductType) => product.id === id,
    );
    const indexOfTarget = shallowdata.indexOf(target);
    const updateProducts = shallowdata.splice(indexOfTarget, 1, req.body);
    return res(ctx.status(200), ctx.json({ data: { products: shallowdata } }));
  }),
];
