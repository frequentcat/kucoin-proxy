# kucoin-proxy



## UNDER DEVELOPMENT, DO NOT USE YET


# todo:

- implement correct candle calls and transformation 

# ...

# notes:
https://github.com/ccxt/ccxt/blob/master/python/ccxt/kucoin.py

https://github.com/markokeeffe/kucoin-websocket-api/commit/ae288df3b9cc37e6c2c6ee6d14758972dc02b589#diff-c34458b7199f090dcf72b8f57ada0a1d3f17ae15dde0a97a9c46cff2daebccfd
# ...

in the fine arts of forking, thanks to the originator project binance-proxy.



Long story short: a kucoin proxy for freqtrade that is using websockets to maintain candlestick/klines data in memory, thus having great performance and reducing the amount of API calls to the Kucoin API.
All other calls are proxied as usual.

![schema](proxy_scheme.png]

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
