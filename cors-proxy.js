import cors from 'cors';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.use(cors());
app.use(
  createProxyMiddleware('/api', {
    target: 'https://labs.openai.com/api/labs',
    pathRewrite: { '^/api': '' },
    changeOrigin: true,
    logLevel: 'debug',
    logProvider: () => console,
  }),
);

app.use(
  createProxyMiddleware('/images', {
    target: 'https://openailabsprodscus.blob.core.windows.net',
    pathRewrite: { '^/images': '' },
    changeOrigin: true,
    logLevel: 'debug',
    logProvider: () => console,
  }),
);

const port = process.env.PORT || 5174;

app.listen(port, () => {
  console.log(`CORS proxy listening on port ${port}`);
});
