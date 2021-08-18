import getServer from "./server/index.js";
import client from './client.js'

getServer(client).then(app => app.listen(8090, '0.0.0.0'));
