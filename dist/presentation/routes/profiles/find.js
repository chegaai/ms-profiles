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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rescue_1 = __importDefault(require("express-rescue"));
const errors_1 = require("@expresso/errors");
const Profile_1 = __importDefault(require("../../../domain/profile/Profile"));
const ProfileNotFoundError_1 = require("../../../services/profiles/errors/ProfileNotFoundError");
function factory(service) {
    return [
        express_rescue_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const profile = yield service.find(id);
            res.status(200)
                .json(Profile_1.default.profileToObject(profile));
        })),
        (err, _req, _res, next) => {
            if (err instanceof ProfileNotFoundError_1.ProfileNotFoundError) {
                return next(errors_1.boom.notFound(err.message));
            }
        }
    ];
}
exports.factory = factory;
exports.default = { factory };
//# sourceMappingURL=find.js.map