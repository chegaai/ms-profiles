"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnreachableServiceError extends Error {
    constructor(service) {
        super(`service \`${service}\` is unreachable at the moment`);
    }
}
exports.UnreachableServiceError = UnreachableServiceError;
//# sourceMappingURL=UnreachableServiceError.js.map