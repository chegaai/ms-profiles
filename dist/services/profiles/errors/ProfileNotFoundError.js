"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfileNotFoundError extends Error {
    constructor(id) {
        super(`profile \`${id}\` could not be found`);
    }
}
exports.ProfileNotFoundError = ProfileNotFoundError;
//# sourceMappingURL=ProfileNotFoundError.js.map