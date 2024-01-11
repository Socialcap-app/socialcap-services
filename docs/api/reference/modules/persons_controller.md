[Socialcap API](../README.md) / [Exports](../modules.md) / persons-controller

# Module: persons-controller

## Table of contents

### Functions

- [getProfile](persons_controller.md#getprofile)
- [signUp](persons_controller.md#signup)
- [updateProfile](persons_controller.md#updateprofile)

## Functions

### getProfile

▸ **getProfile**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[persons-controller.ts:64](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/persons-controller.ts#L64)

___

### signUp

▸ **signUp**(`params`): `Promise`\<`ResultOrError`\>

signUp
Starts the onboarding process for a new user.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Object: { email, ... } |
| `params.email` | `string` | - |
| `params.full_name` | `string` | - |
| `params.phone?` | `string` | - |
| `params.telegram?` | `string` | - |

#### Returns

`Promise`\<`ResultOrError`\>

MutationResult

#### Defined in

[persons-controller.ts:14](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/persons-controller.ts#L14)

___

### updateProfile

▸ **updateProfile**(`params`): `Promise`\<`ResultOrError`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `params` | `any` |

#### Returns

`Promise`\<`ResultOrError`\>

#### Defined in

[persons-controller.ts:71](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/persons-controller.ts#L71)
