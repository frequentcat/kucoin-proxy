# kucoin-proxy

in the fine arts of forking, thanks to the originator project binance-proxy.



Long story short: a kucoin proxy for freqtrade that is using websockets to maintain candlestick/klines data in memory, thus having great performance and reducing the amount of API calls to the Kucoin API.
All other calls are proxied as usual.


Start the docker instance and then point freqtrade to it, rate limit can be disabled:

```
    "exchange": {
        "name": "kucoin",
        "key": "",
        "secret": "",
        "ccxt_config": {
            "enableRateLimit": false,
            "urls": {
                "api": {
                    "public": "http://127.0.0.1:8080/api/v3"
                }
            }
        },
        "ccxt_async_config": {
            "enableRateLimit": false
        }
    }
```

with the .env file (copy the .env.sample) you can set an other port for the service.
If you want to let this run in host network mode, check out the binance-proxy project
