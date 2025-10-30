import { randomUUID } from "crypto";

export function generateUUID(): string {
    // Request Node.js v14.17.0 or higher
    if(typeof randomUUID !== 'undefined'){
        return randomUUID();
    }
    throw new Error("UUID generation not supported");
}