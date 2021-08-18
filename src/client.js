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

    subscribe(symbol, interval, startAt, endAt) {
	console.log('new client subscription ' + symbol + ' - ' + interval);
        if (!this.subscribed.find(e => e === symbol + interval)) {

            this.subscribed.push(symbol + interval);

            console.log('HELLO')

            this.client.MarketCandles(symbol, interval, (res) => {
                console.log(res);

                console.log('HELLO wo ist res')

                if (!this.klines[symbol + interval]) {
                    this.klines[symbol + interval] = new FixedQueue(1000, []);
                }

            })



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

            this.client.websockets.chart(symbol, interval, (symbol, interval, chart) => {
                if (!this.klines[symbol + interval]) {
                    this.klines[symbol + interval] = new FixedQueue(1000, []);
                }
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

    async getCandles(symbol, type, startAt, endAt) {
        let data = this.klines[symbol + type];
        if (!data) {
            this.subscribe(symbol, type, startAt, endAt);
        }
        while (!data || data[data.length - 1][6] <= Date.now()) {
            await new Promise(r => setTimeout(r, 20));
            data = this.klines[symbol + interval];
        }
        return data;
    }
}


export default new Client();
