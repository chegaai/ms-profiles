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
const validator_1 = require("@expresso/validator");
const Profile_1 = require("../../../domain/profile/Profile");
const ProfileNotFoundError_1 = require("../../../services/profiles/errors/ProfileNotFoundError");
function factory(service) {
    return [
        validator_1.validate({
            type: 'object',
            properties: {
                name: { type: 'string' },
                link: { type: 'string', format: 'uri' }
            },
            required: ['name', 'link']
        }),
        express_rescue_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const socialNetwork = req.body;
            const { id } = req.params;
            const updatedProfile = yield service.addSocialNetwork(id, socialNetwork);
            res.status(200)
                .json(Profile_1.profileToObject(updatedProfile));
        })),
        (err, _req, _res, next) => {
            if (err instanceof ProfileNotFoundError_1.ProfileNotFoundError) {
                return next(errors_1.boom.notFound(err.message, { code: 'profile-not-found' }));
            }
            next(err);
        }
    ];
}
exports.factory = factory;
exports.default = { factory };
//# sourceMappingURL=add-social-network.js.map