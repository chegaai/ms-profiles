"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const server_1 = __importDefault(require("@expresso/server"));
function start(config) {
    return server_1.default.start(app_1.app, config);
}
exports.start = start;
exports.default = {
    start
};
//# sourceMappingURL=server.js.map