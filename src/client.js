import Kucoin from './kucoin-websocket-api/index.js';
import FixedQueue from './misc/FixedQueue.js';

class Client {
    client;
    subscribed;
    klines;

    constructor() {
        this.client = new Kucoin();
        this.subscribed = [];
        this.klines = {};
    }


    /* 
    let the client (freqtrade) subscribe to the websocket on this proxy
    for decoding the data coming from the websocket, check
    https://docs.kucoin.com/#klines

    you need to send symbol + type

    example message:
    {
        "type":"message",
        "topic":"/market/candles:BTC-USDT_1hour",
        "subject":"trade.candles.update",
        "data":{

            "symbol":"BTC-USDT",    // symbol
            "candles":[

                "1589968800",   // Start time of the candle cycle
                "9786.9",       // open price
                "9740.8",       // close price
                "9806.1",       // high price
                "9732",         // low price
                "27.45649579",  // Transaction volume
                "268280.09830877"   // Transaction amount
            ],
            "time":1589970010253893337  // now（us）
        }
    }

     */
    subscribe(symbol, interval) {
	// console.log('new client subscription ' + symbol + ' - ' + interval);
        if (!this.subscribed.find(e => e === symbol + interval)) {
            this.subscribed.push(symbol + interval);
            this.client.MarketCandles(symbol, interval, (chart) => {
                //console.log(chart);
                //let timeDiff = Math.abs(Object.keys(chart)[0] - Object.keys(chart)[1]);

                if (!this.klines[symbol + interval]) {
                    this.klines[symbol + interval] = new FixedQueue(1000, []);
                }

                console.log("interval: ", interval, " - chart: ", chart);
                
                let openTime = parseInt(chart.candles[0]);
                //let closeTime = openTime + timeDiff - 1;
                let closeTime = chart.time;
                let item = {
                    start: chart.candles[0],
                    open: chart.candles[1],
                    high: chart.candles[3],
                    low: chart.candles[4],
                    close: chart.candles[2],
                    volume: chart.candles[5],
                    amount: chart.candles[6]
                }
                const frame = [
                    chart.time,
                    item.open,
                    item.high,
                    item.low,
                    item.close,
                    item.volume,
                    closeTime,
                    item.amount,
                    100,
                    (item.amount / 2),
                    (item.amount / 2),
                    "1.1"];
                console.log("frame:", frame)
                this.klines[symbol + interval].push(frame);
            })


/*

{
    "type":"message",
    "topic":"/market/candles:BTC-USDT_1hour",
    "subject":"trade.candles.update",
    "data":{

        "symbol":"BTC-USDT",    // symbol
        "candles":[

            "1589968800",   // Start time of the candle cycle
            "9786.9",       // open price
            "9740.8",       // close price
            "9806.1",       // high price
            "9732",         // low price
            "27.45649579",  // Transaction volume
            "268280.09830877"   // Transaction amount
        ],
        "time":1589970010253893337  // now（us）
    }
}

*/
// call /market/candles:{symbol}_{type}
/*


// Maximum 100 Symbol / Connection!
const symbols = ["BTC-USDT", "ETH-BTC"]

let test = async () => {
  let connection = await client.MarketLevel2(symbols, (e) => {
    console.log(e)
  })

  // With calling connection() it close the socket
  setTimeout(() => {
    // Close socket
    console.log("Close socket!")
    connection()
  }, 10000)
}


////////////////
// todo: transform this original code to use the kucoin api correct

                let timeDiff = Math.abs(Object.keys(chart)[0] - Object.keys(chart)[1]);
                for (let openTime of Object.keys(chart)) {
                    let item = chart[openTime];
                    openTime = parseInt(openTime);
                    let closeTime = openTime + timeDiff - 1;
                    let quoteAssetVolume = parseFloat(item.volume) / ((parseFloat(item.open) + parseFloat(item.close)) / 2);
                    const frame = [
                        openTime,
                        item.open,
                        item.high,
                        item.low,
                        item.close,
                        item.volume,
                        closeTime,
                        quoteAssetVolume.toString(),
                        100,
                        (quoteAssetVolume / 2).toString(),
                        (quoteAssetVolume / 2).toString(),
                        "1.1"];
                    this.klines[symbol + interval].push(frame);
                }
            }, 1000);
*/

        }
    }

    async getCandles(symbol, interval) {
        let data = this.klines[symbol + interval];
        if (!data) {
            this.subscribe(symbol, interval);
        }
        while (!data || data[data.length - 1][6] <= Date.now()) {
            await new Promise(r => setTimeout(r, 20));
            data = this.klines[symbol + interval];
        }
        return data;
    }
}


export default new Client();
