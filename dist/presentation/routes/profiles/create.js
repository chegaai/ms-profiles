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
const validator_1 = require("@expresso/validator");
const Profile_1 = __importDefault(require("../../../domain/profile/Profile"));
function factory(service) {
    return [
        validator_1.validate({
            type: 'object',
            properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                picture: { type: 'string' },
                socialNetworks: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            name: { type: 'string' },
                            link: { type: 'string' }
                        },
                        required: ['link', 'name']
                    }
                },
                location: {
                    type: 'object',
                    properties: {
                        country: { type: 'string' },
                        state: { type: 'string' },
                        city: { type: 'string' }
                    },
                    required: ['city', 'country', 'state']
                },
                language: { type: 'string' },
                groups: {
                    type: 'array',
                    items: { type: 'string' }
                },
                tags: {
                    type: 'array',
                    items: { type: 'string' }
                }
            },
            required: [
                'id',
                'email',
                'language',
                'lastName',
                'location',
                'name',
                'picture'
            ]
        }),
        express_rescue_1.default((req, res) => __awaiter(this, void 0, void 0, function* () {
            const payload = req.body;
            const profile = yield service.create(payload);
            res.status(201)
                .json(Profile_1.default.profileToObject(profile));
        }))
    ];
}
exports.factory = factory;
exports.default = { factory };
//# sourceMappingURL=create.js.map