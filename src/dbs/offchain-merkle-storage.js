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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.OffchainMerkleStorage = void 0;
/**
 * OffchainMerkleStorage
 * Manages a cached offchain storage for Merkle Maps
 * where map header and leafs are stored in a RDB
 * @created - MAZito - 2023-06-06
 */
var o1js_1 = require("o1js");
var global_js_1 = require("../global.js");
var responses_js_1 = require("../responses.js");
var offchain_merkle_map_js_1 = require("./offchain-merkle-map.js");
var OffchainMerkleStorage = /** @class */ (function () {
    function OffchainMerkleStorage() {
    }
    /**
     * Gets and rebuilds an existent MerkleMap using the stored data leafs
     * @param id - the MerkleMap ID
     * @returns - OffchainMerkleMap or IsError
     */
    OffchainMerkleStorage.getMerkleMap = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var cached, map, instance, leafs, j, key, hashed;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!OffchainMerkleStorage.started)
                            return [2 /*return*/, responses_js_1.hasError.DatabaseEngine("OffchainMerkleStorage not started")];
                        cached = OffchainMerkleStorage.cache.get(id);
                        if (cached)
                            return [2 /*return*/, (0, responses_js_1.hasResult)(cached)];
                        return [4 /*yield*/, global_js_1.prisma.merkleMap.findUnique({
                                where: { id: id }
                            })];
                    case 1:
                        map = _a.sent();
                        if (!map)
                            return [2 /*return*/, responses_js_1.hasError.NotFound("Not Found MerkleMap with id=".concat(id))];
                        instance = new offchain_merkle_map_js_1.OffchainMerkleMap(id, map === null || map === void 0 ? void 0 : map.name);
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.findMany({
                                select: { index: true, key: true, hash: true },
                                where: { mapId: map === null || map === void 0 ? void 0 : map.id },
                                orderBy: { index: 'asc' }
                            })];
                    case 2:
                        leafs = _a.sent();
                        for (j = 0; j < leafs.length; j++) {
                            key = (0, o1js_1.Field)(leafs[j].key);
                            hashed = (0, o1js_1.Field)(leafs[j].hash);
                            instance.memmap.set(key, hashed);
                        }
                        instance.count = leafs.length;
                        // MUST add it to the cache 
                        OffchainMerkleStorage.cache.set(id, instance);
                        return [2 /*return*/, (0, responses_js_1.hasResult)(instance)];
                }
            });
        });
    };
    /**
     * Creates a new MerkleMap and initializes it
     * @param name - the MerkleMap name
     * @returns - OffchainMerkleMap instance or error
     */
    OffchainMerkleStorage.createNewMerkleMap = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            var map, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!OffchainMerkleStorage.started)
                            return [2 /*return*/, responses_js_1.hasError.DatabaseEngine("OffchainMerkleStorage not started")];
                        return [4 /*yield*/, global_js_1.prisma.merkleMap.create({
                                data: { id: 10, name: name, root: 0, size: 0, height: 256 }
                            })];
                    case 1:
                        map = _a.sent();
                        if (!map)
                            return [2 /*return*/, responses_js_1.hasError.DatabaseEngine("Could not create new Merkle Map with name='".concat(name, "'"))];
                        instance = new offchain_merkle_map_js_1.OffchainMerkleMap(map.id, map.name);
                        // MUST add it to the cache 
                        OffchainMerkleStorage.cache.set(map.id, instance);
                        global_js_1.logger.info("Created merkleMap '".concat(name, "' with id=").concat(map.id));
                        return [2 /*return*/, (0, responses_js_1.hasResult)(instance)];
                }
            });
        });
    };
    /**
     * Resets an existent MerkleMap and initializes it.
     * @param name - the MerkleMap name
     * @returns - OffchainMerkleMap instance or error
     */
    OffchainMerkleStorage.resetMerkleMap = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var map, leafs, j, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!OffchainMerkleStorage.started)
                            return [2 /*return*/, responses_js_1.hasError.DatabaseEngine("OffchainMerkleStorage not started")];
                        return [4 /*yield*/, global_js_1.prisma.merkleMap.findUnique({
                                where: { id: id }
                            })];
                    case 1:
                        map = _a.sent();
                        if (!map)
                            return [2 /*return*/, responses_js_1.hasError.NotFound("Not Found MerkleMap with id=".concat(id))];
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.findMany({
                                where: { mapId: map.id }
                            })];
                    case 2:
                        leafs = _a.sent();
                        j = 0;
                        _a.label = 3;
                    case 3:
                        if (!(j < (leafs || []).length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf["delete"]({ where: { uid: leafs[j].uid } })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        j++;
                        return [3 /*break*/, 3];
                    case 6:
                        instance = new offchain_merkle_map_js_1.OffchainMerkleMap(map.id, map.name);
                        // MUST add it to the cache 
                        OffchainMerkleStorage.cache.set(map.id, instance);
                        global_js_1.logger.info("Reseted merkleMap with id=".concat(map.id));
                        return [2 /*return*/, (0, responses_js_1.hasResult)(instance)];
                }
            });
        });
    };
    /**
     * Startup the Offchain storage by creating a cache for all Merkle maps.
     * The Merkle maps will not be loaded here, but when someone asks for it.
     */
    OffchainMerkleStorage.startup = function () {
        var _this = this;
        if (OffchainMerkleStorage.started)
            return;
        console.log("OffchainMerkleStorage starting ...");
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var maps, j;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, global_js_1.prisma.merkleMap.findMany({ orderBy: { id: 'asc' } })];
                    case 1:
                        maps = _a.sent();
                        // reset the cache for all of them
                        for (j = 0; j < maps.length; j++) {
                            OffchainMerkleStorage.cache.set(maps[j].id, null);
                        }
                        OffchainMerkleStorage.started = true;
                        console.log("OffchainMerkleStorage started");
                        return [2 /*return*/];
                }
            });
        }); }, 100);
        return OffchainMerkleStorage;
    };
    // All MerkleMaps are memoized while server is running
    OffchainMerkleStorage.cache = new Map();
    // The startup status
    OffchainMerkleStorage.started = false;
    return OffchainMerkleStorage;
}());
exports.OffchainMerkleStorage = OffchainMerkleStorage;
