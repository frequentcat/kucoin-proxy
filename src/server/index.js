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
        console.log('-- get candle --')
        /* 
        we have req.query.startAt, req.query.endAt usually coming with the request 
        from freqtrade, but we are not using it here - just the "type" (1m->1h etc) 
        eventually, we must 
        */
        res.send(await client.getCandles(req.query.symbol, req.query.type));
    });

    router.get('/health', async (req, res) => {
        console.log('health query');
        res.send('DUMMMY OKAY');
    });

    router.use(createProxyMiddleware({
        target: 'https://openapi-v2.kucoin.com',
        changeOrigin: true,
        logLevel: 'debug'
    }));

    app.use("/", router);
    return app
}

export default getServer
