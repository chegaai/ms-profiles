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
Object.defineProperty(exports, "__esModule", { value: true });
const bson_1 = require("bson");
const ProfileNotFoundError_1 = require("./errors/ProfileNotFoundError");
const Profile_1 = require("../../domain/profile/Profile");
function findGroup(groupService) {
    return (id) => __awaiter(this, void 0, void 0, function* () {
        return groupService.find(id).then(group => group.id);
    });
}
function create(profileRepository, groupService, _a) {
    var { id } = _a, data = __rest(_a, ["id"]);
    return __awaiter(this, void 0, void 0, function* () {
        const groupIds = data.groups
            ? yield Promise.all(data.groups.map(findGroup(groupService)))
            : [];
        const _id = new bson_1.ObjectId(id);
        const profile = Profile_1.profileDomain.createProfile(Object.assign(Object.assign({}, data), { _id, socialNetworks: data.socialNetworks || [], tags: data.tags || [], groups: groupIds }));
        yield profileRepository.save(profile);
        return profile;
    });
}
exports.create = create;
function find(profileRepository, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield profileRepository.findById(id);
        if (!result)
            throw new ProfileNotFoundError_1.ProfileNotFoundError(id);
        return result;
    });
}
exports.find = find;
function getProfileService(profileRepository, groupService) {
    return {
        create: (data) => create(profileRepository, groupService, data),
        find: (id) => find(profileRepository, id)
    };
}
exports.getProfileService = getProfileService;
//# sourceMappingURL=ProfileService.js.map