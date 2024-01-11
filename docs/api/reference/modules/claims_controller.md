[Socialcap API](../README.md) / [Exports](../modules.md) / claims-controller

# Module: claims-controller

## Table of contents

### Functions

- [addClaim](claims_controller.md#addclaim)
- [getClaim](claims_controller.md#getclaim)
- [getMyClaimables](claims_controller.md#getmyclaimables)
- [getMyClaims](claims_controller.md#getmyclaims)
- [getRunningClaims](claims_controller.md#getrunningclaims)
- [submitClaim](claims_controller.md#submitclaim)
- [updateClaim](claims_controller.md#updateclaim)
- [updateClaimState](claims_controller.md#updateclaimstate)

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

[claims-controller.ts:147](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L147)

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

[claims-controller.ts:25](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L25)

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

[claims-controller.ts:71](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L71)

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

[claims-controller.ts:32](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L32)

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

[claims-controller.ts:132](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L132)

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

[claims-controller.ts:198](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L198)

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

[claims-controller.ts:163](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L163)

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

[claims-controller.ts:176](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/claims-controller.ts#L176)
