"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GroupNotFoundError extends Error {
    constructor(id) {
        super(`Group \`${id}\` could not be found`);
    }
}
exports.GroupNotFoundError = GroupNotFoundError;
//# sourceMappingURL=GroupNotFoundError.js.map