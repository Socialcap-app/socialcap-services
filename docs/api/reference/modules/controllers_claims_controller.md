[Socialcap API](../README.md) / [Modules](../modules.md) / controllers/claims-controller

# Module: controllers/claims-controller

## Table of contents

### Functions

- [addClaim](controllers_claims_controller.md#addclaim)
- [getClaim](controllers_claims_controller.md#getclaim)
- [getMyClaimables](controllers_claims_controller.md#getmyclaimables)
- [getMyClaims](controllers_claims_controller.md#getmyclaims)
- [getRunningClaims](controllers_claims_controller.md#getrunningclaims)
- [submitClaim](controllers_claims_controller.md#submitclaim)
- [updateClaim](controllers_claims_controller.md#updateclaim)
- [updateClaimState](controllers_claims_controller.md#updateclaimstate)

## Functions

### addClaim

▸ **addClaim**(`params`): `Promise`\<`ResultOrError`\>

Mutations

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:147](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L147)

___

### getClaim

▸ **getClaim**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:25](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L25)

___

### getMyClaimables

▸ **getMyClaimables**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:71](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L71)

___

### getMyClaims

▸ **getMyClaims**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:32](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L32)

___

### getRunningClaims

▸ **getRunningClaims**(`params`): `Promise`\<`ResultOrError`\>

Gets all claim instance data that are in a voting state (CLAIMED).
We need them for doing rollups over and over again.

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:132](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L132)

___

### submitClaim

▸ **submitClaim**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.claim` | `any` |
| `params.extras` | `any` |
| `params.user` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:198](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L198)

___

### updateClaim

▸ **updateClaim**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:163](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L163)

___

### updateClaimState

▸ **updateClaimState**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `Object` |
| `params.state` | `number` |
| `params.uid` | `string` |
| `params.user` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[src/controllers/claims-controller.ts:176](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/claims-controller.ts#L176)
