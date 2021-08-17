import express from "express";
import cors from "cors";
import compression from "compression";
import { Router } from "express";
import { createProxyMiddleware } from 'http-proxy-middleware';

const getServer = async (client) => {
    const app = express();
    const router = new Router();

    app.use(cors());
    app.use(compression());
    app.use(express.json());

    router.get('/api/v1/market/candles', async (req, res) => {
        res.send(await client.getCandles(req.query.symbol, req.query.interval));
    });
    router.get('/health', async (req, res) => {
        console.log('health query');
        res.send('OKAY');
    });


    router.use(createProxyMiddleware({
        target: 'https://openapi-v2.kucoin.com',
        changeOrigin: true,
        pathRewrite: { '^/api/v3/api/v1': '/api/v1' },
        logLevel: 'debug'
    }));

    app.use("/api/v3/", router);

    app.use("/", router);
    return app
}

export default getServer
