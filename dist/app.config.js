"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sugar_env_1 = __importDefault(require("sugar-env"));
exports.config = {
    name: 'ms-profiles',
    mongodb: {
        uri: sugar_env_1.default.get('MONGODB_URI', 'mongodb://localhost:27017'),
        dbName: sugar_env_1.default.get('MONGODB_DBNAME', 'chegaai')
    },
    clients: {
        group: {
            url: sugar_env_1.default.get('CLIENTS_GROUP_URL', ''),
            timeout: sugar_env_1.default.get.int('CLIENTS_GROUP_TIMEOUT', 3000)
        }
    }
};
//# sourceMappingURL=app.config.js.map