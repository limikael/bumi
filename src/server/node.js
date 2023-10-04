import {Hono} from 'hono';
import {quickmin} from "quickmin/hono-middleware";
import {drizzleSqliteDriver} from "quickmin/drizzle-sqlite";
import {nodeStorageDriver} from "quickmin/node-storage";
import {googleAuthDriver} from "quickmin/google-auth";
import {serveStatic} from '@hono/node-server/serve-static';
import {serve} from '@hono/node-server';
import fs from "fs";
import isoqMiddleware from "__ISOQ_MIDDLEWARE";
import Api from "./Api.js";
import {quickRpc} from "fullstack-utils/hono-quick-rpc";

let quickminYaml=fs.readFileSync("quickmin.yaml","utf8");
let quickminDrivers=[
    drizzleSqliteDriver,
    nodeStorageDriver,
    googleAuthDriver
];

const app=new Hono();
app.use('*',serveStatic({root: './public'}))
app.use("*",quickmin(quickminYaml,quickminDrivers));
app.use("/quickrpc",quickRpc(Api));
app.use("*",isoqMiddleware({
    localFetch: app.fetch,
    setGlobalLocation: true
}));

serve(app,(info)=>{
    console.log(`Listening on http://localhost:${info.port}`)
})