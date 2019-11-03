"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const bson_1 = require("bson");
const UnreachableServiceError_1 = require("./errors/UnreachableServiceError");
function findById(http, id) {
    return __awaiter(this, void 0, void 0, function* () {
        return http.get(`/${id}`)
            .then(({ data }) => data)
            .then((_a) => {
            var { id } = _a, group = __rest(_a, ["id"]);
            return (Object.assign({ id: new bson_1.ObjectId(id) }, group));
        })
            .catch(err => {
            if (!err.response)
                throw new UnreachableServiceError_1.UnreachableServiceError('ms-groups');
            if (err.response.code == 404)
                return null;
            throw err;
        });
    });
}
exports.findById = findById;
function getGroupClient(config) {
    const http = axios_1.default.create({
        baseURL: config.url,
        timeout: config.timeout
    });
    return {
        findById: (id) => findById(http, id)
    };
}
exports.getGroupClient = getGroupClient;
exports.default = { getGroupClient };
//# sourceMappingURL=GroupClient.js.map