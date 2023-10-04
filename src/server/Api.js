import {HTTPException} from "hono/http-exception";

export default class Api {
	constructor(honoContext) {
		this.qm=honoContext.get("quickmin");
	}
}
