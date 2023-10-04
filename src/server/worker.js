import {Hono} from 'hono';
import {quickmin} from "quickmin/hono-middleware";
import {drizzleD1Driver} from "quickmin/drizzle-d1";
import {r2StorageDriver} from "quickmin/r2-storage";
import {serveStatic} from "fullstack-utils/hono-cloudflare-content";
import {httpsRedirect} from "fullstack-utils/hono-https-redirect";
import quickminYaml from "../../quickmin.yaml";
import isoqMiddleware from "__ISOQ_MIDDLEWARE";
import {googleAuthDriver} from "quickmin/google-auth";
import Api from "./Api.js";
import {quickRpc} from "fullstack-utils/hono-quick-rpc";

let quickminDrivers=[
    drizzleD1Driver,
    r2StorageDriver,
    googleAuthDriver
];

const app=new Hono();
app.use("*",httpsRedirect({
    ignore: ["localhost","one.localhost","127.0.0.1"]
}));
app.use("*",serveStatic());
app.use("*",quickmin(quickminYaml,quickminDrivers));
app.use("/quickrpc",quickRpc(Api));
app.use("*",isoqMiddleware({
    localFetch: app.fetch,
    setGlobalLocation: true
}));

export default app;