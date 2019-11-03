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
const routes_1 = __importDefault(require("./routes"));
const app_1 = __importDefault(require("@expresso/app"));
const errors_1 = __importDefault(require("@expresso/errors"));
const mongodb_data_layer_1 = __importDefault(require("@nindoo/mongodb-data-layer"));
const GroupClient_1 = require("../data/clients/GroupClient");
const GroupService_1 = require("../services/groups/GroupService");
const ProfileService_1 = require("../services/profiles/ProfileService");
const ProfileRepository_1 = require("../data/repositories/ProfileRepository");
exports.app = app_1.default((app, config, environment) => __awaiter(void 0, void 0, void 0, function* () {
    const mongodbConnection = yield mongodb_data_layer_1.default.createConnection(config.mongodb);
    const profileRepository = new ProfileRepository_1.ProfileRepository(mongodbConnection);
    const groupClient = GroupClient_1.getGroupClient(config.clients.group);
    const groupService = GroupService_1.getGroupService(groupClient);
    const profileService = ProfileService_1.getProfileService(profileRepository, groupService);
    app.post('/', routes_1.default.profiles.create.factory(profileService));
    app.get('/:id', routes_1.default.profiles.find.factory(profileService));
    app.use(errors_1.default(environment));
    return app;
}));
//# sourceMappingURL=app.js.map