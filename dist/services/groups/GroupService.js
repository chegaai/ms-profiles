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
Object.defineProperty(exports, "__esModule", { value: true });
const GroupNotFoundError_1 = require("./errors/GroupNotFoundError");
function find(client, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const group = yield client.findById(id);
        if (!group) {
            throw new GroupNotFoundError_1.GroupNotFoundError(id);
        }
        return group;
    });
}
exports.find = find;
function getGroupService(groupClient) {
    return {
        find: (id) => find(groupClient, id)
    };
}
exports.getGroupService = getGroupService;
//# sourceMappingURL=GroupService.js.map