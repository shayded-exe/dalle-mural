import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(cors());
app.use(
  createProxyMiddleware({
    target: 'https://labs.openai.com/api/labs',
    changeOrigin: true,
    logger: console,
  }),
);

const port = process.env.PORT || 5174;

app.listen(port, () => {
  console.log(`CORS proxy listening on port ${port}`);
});
