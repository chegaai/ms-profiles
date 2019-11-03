"use strict";
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
exports.PROFILE_COLLECTION = 'profiles';
function createProfile(data) {
    return Object.assign(Object.assign({}, data), { deletedAt: null, createdAt: new Date(), updatedAt: new Date() });
}
function profileToObject(_a) {
    var { _id } = _a, profile = __rest(_a, ["_id"]);
    return Object.assign(Object.assign({ id: _id.toHexString() }, profile), { groups: profile.groups.map(groupId => groupId.toHexString()) });
}
exports.profileDomain = {
    createProfile,
    profileToObject
};
exports.default = exports.profileDomain;
//# sourceMappingURL=Profile.js.map