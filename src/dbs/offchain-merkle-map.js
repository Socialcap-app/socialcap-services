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
exports.OffchainMerkleMap = void 0;
/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 * @created - MAZito - 2023-06-06
 */
var o1js_1 = require("o1js");
var global_js_1 = require("../global.js");
var responses_js_1 = require("../responses.js");
var contracts_1 = require("@socialcap/contracts");
/**
 * OffchainMerkleMap
 * Describes a Merkle Map which will be stored in this server using a
 * RDBMS and can be accesed using the API.
 */
var OffchainMerkleMap = /** @class */ (function () {
    function OffchainMerkleMap(id, name) {
        this.id = id;
        this.name = name || "mm" + id.toString();
        this.memmap = new o1js_1.MerkleMap();
        this.memmap.set((0, o1js_1.Field)(0), (0, o1js_1.Field)(0)); // initalize with (key=0,value=0)
        this.root = this.memmap.getRoot();
        this.count = 0;
    }
    /**
     * Get a given key+value pair from the map
     * @param uid: string: the leaf key to get
     * @returns -
     */
    OffchainMerkleMap.prototype.get = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var storedLeaf, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!uid)
                            return [2 /*return*/, responses_js_1.hasError.BadRequest("Missing param 'uid'")];
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.findUnique({
                                where: { uid: uid }
                            })];
                    case 1:
                        storedLeaf = _a.sent();
                        if (!storedLeaf)
                            return [2 /*return*/, responses_js_1.hasError.NotFound("Not Found leaf with uid=".concat(uid))];
                        instance = {
                            key: (0, o1js_1.Field)(storedLeaf.key),
                            hash: (0, o1js_1.Field)(storedLeaf.hash)
                        };
                        return [2 /*return*/, (0, responses_js_1.hasResult)(instance)];
                }
            });
        });
    };
    /**
     * Sets (inserts or updates) a given 'uid' key with its data
     * @param uid: string - the leaf key to update or insert
     * @param hash: Field - optional hash of the leaf data, we will use this one if received
     * @param data?: any - the leaf data pack to insert/upload
     * @returns MerkleMapUpdate in result or error
     */
    OffchainMerkleMap.prototype.set = function (uid, hash) {
        return __awaiter(this, void 0, void 0, function () {
            var currentRoot, storedLeaf, key, hashed, index, isNewLeaf, updatedLeaf, merkleUpdate;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!uid)
                            return [2 /*return*/, responses_js_1.hasError.BadRequest("Missing param 'uid'")];
                        currentRoot = this.memmap.getRoot();
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.findUnique({
                                where: { uid: uid }
                            })
                            // the received data has already been hashed
                        ];
                    case 1:
                        storedLeaf = _a.sent();
                        key = contracts_1.UID.toField(uid);
                        hashed = hash;
                        index = storedLeaf ? storedLeaf.index : this.count;
                        isNewLeaf = !storedLeaf;
                        // update the current Merkle Map
                        try {
                            this.memmap.set(key, hashed);
                            this.count = storedLeaf ? this.count : this.count + 1;
                        }
                        catch (err) {
                            return [2 /*return*/, responses_js_1.hasError.InternalServer("Could not set MerkleMapLeaf with uid='".concat(uid, "' err=") + err.toString())];
                        }
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.upsert({
                                where: { uid: uid },
                                update: {
                                    hash: hashed.toString()
                                },
                                create: {
                                    uid: uid, mapId: this.id, index: index,
                                    key: key.toString(),
                                    hash: hashed.toString()
                                }
                            })
                            // check if leaf upsert operation succeeded, on failure we must revert 
                            // the Map operation because the key,hash was already updated in the Map 
                        ];
                    case 2:
                        updatedLeaf = _a.sent();
                        // check if leaf upsert operation succeeded, on failure we must revert 
                        // the Map operation because the key,hash was already updated in the Map 
                        if (!updatedLeaf) {
                            // rollback the key,value 
                            this.memmap.set(key, storedLeaf ? (0, o1js_1.Field)(storedLeaf.hash) : (0, o1js_1.Field)(0));
                            return [2 /*return*/, responses_js_1.hasError.DatabaseEngine("Could not set MerkleMapLeaf with uid='".concat(uid, "'"))];
                        }
                        merkleUpdate = {
                            mapId: o1js_1.UInt32.from(this.id),
                            txId: (0, o1js_1.Field)(0),
                            beforeRoot: currentRoot,
                            beforeLeaf: {
                                key: (0, o1js_1.Field)((storedLeaf === null || storedLeaf === void 0 ? void 0 : storedLeaf.key) || "0"),
                                hash: (0, o1js_1.Field)((storedLeaf === null || storedLeaf === void 0 ? void 0 : storedLeaf.hash) || "0")
                            },
                            afterRoot: this.memmap.getRoot(),
                            afterLeaf: {
                                key: key,
                                hash: hashed
                            }
                        };
                        return [2 /*return*/, (0, responses_js_1.hasResult)(merkleUpdate)];
                }
            });
        });
    };
    /**
     * Appends a Leaf at the end of the map
     * @param key Field used as key
     * @param hash the hash
     * @param data optional data object
     * @returns
     */
    OffchainMerkleMap.prototype.setLeafByKey = function (key, hash, data) {
        return __awaiter(this, void 0, void 0, function () {
            var count, uid, updatedLeaf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.count({
                            where: { mapId: this.id }
                        })];
                    case 1:
                        count = _a.sent();
                        this.memmap.set(key, hash);
                        uid = key.toString();
                        return [4 /*yield*/, global_js_1.prisma.merkleMapLeaf.upsert({
                                where: { uid: uid },
                                update: {
                                    hash: hash.toString()
                                },
                                create: {
                                    uid: uid,
                                    mapId: this.id,
                                    index: count + 1,
                                    key: key.toString(),
                                    hash: hash.toString()
                                }
                            })];
                    case 2:
                        updatedLeaf = _a.sent();
                        return [2 /*return*/, this];
                }
            });
        });
    };
    /**
     * Get the root of the memoized Merkle map
     * @returns - the MerkleMap root
     */
    OffchainMerkleMap.prototype.getRoot = function () {
        return this.memmap.getRoot() || null;
    };
    /**
     * Get a Witness of the memoized Merkle map, using its uid
     * @param uid: string - the uid of the leaf to witness
     * @returns - the MerkleMapWitness or null
     */
    /** DO NOT USE, use getWitnessByUid or getWitnessByKey */
    OffchainMerkleMap.prototype.getWitness = function (uid) {
        var key = contracts_1.UID.toField(uid);
        return this.memmap.getWitness(key) || null;
    };
    OffchainMerkleMap.prototype.getWitnessByKey = function (key) {
        return this.memmap.getWitness(key);
    };
    OffchainMerkleMap.prototype.getWitnessByUid = function (uid) {
        var key = contracts_1.UID.toField(uid);
        return this.memmap.getWitness(key);
    };
    /** Get the the amount of leaf nodes. */
    OffchainMerkleMap.prototype.size = function () {
        return this.count;
    };
    return OffchainMerkleMap;
}());
exports.OffchainMerkleMap = OffchainMerkleMap;
