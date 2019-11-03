"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Profile_1 = require("../../domain/profile/Profile");
const mongodb_data_layer_1 = require("@nindoo/mongodb-data-layer");
class ProfileRepository extends mongodb_data_layer_1.MongodbRepository {
    constructor(connection) {
        super(connection.collection(Profile_1.PROFILE_COLLECTION));
    }
}
exports.ProfileRepository = ProfileRepository;
//# sourceMappingURL=ProfileRepository.js.map