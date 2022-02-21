import {webSocket} from "rxjs/webSocket";

export interface MiddlewareDependency {
    websocket: typeof webSocket
}