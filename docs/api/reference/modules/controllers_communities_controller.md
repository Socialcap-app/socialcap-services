[Socialcap API](../README.md) / [Modules](../modules.md) / controllers/communities-controller

# Module: controllers/communities-controller

## Table of contents

### Functions

- [getAdminedCommunity](controllers_communities_controller.md#getadminedcommunity)
- [getAllCommunities](controllers_communities_controller.md#getallcommunities)
- [getCommunity](controllers_communities_controller.md#getcommunity)
- [getMyCommunities](controllers_communities_controller.md#getmycommunities)
- [prepareCommunityClaimsDownload](controllers_communities_controller.md#preparecommunityclaimsdownload)
- [updateCommunity](controllers_communities_controller.md#updatecommunity)

## Functions

### getAdminedCommunity

▸ **getAdminedCommunity**(`params`): `Promise`\<`ResultOrError`\>

Extends the getCommunity() to return information only available
to its administrator, such as pending validators approvals, 
masterplans, etc...

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/communities-controller.ts:33](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L33)

___

### getAllCommunities

▸ **getAllCommunities**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/communities-controller.ts:116](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L116)

___

### getCommunity

▸ **getCommunity**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/communities-controller.ts:11](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L11)

___

### getMyCommunities

▸ **getMyCommunities**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/communities-controller.ts:90](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L90)

___

### prepareCommunityClaimsDownload

▸ **prepareCommunityClaimsDownload**(`uid`, `fileName`, `states?`): `Promise`\<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `fileName` | `string` |
| `states?` | `string` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/controllers/communities-controller.ts:135](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L135)

___

### updateCommunity

▸ **updateCommunity**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/communities-controller.ts:67](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/communities-controller.ts#L67)
