"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_config_1 = require("./app.config");
const server_1 = __importDefault(require("./presentation/server"));
server_1.default.start(app_config_1.config)
    .catch(err => {
    console.error('----- Fatal error -----');
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map