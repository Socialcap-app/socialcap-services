[Socialcap API](../README.md) / [Modules](../modules.md) / controllers/persons-controller

# Module: controllers/persons-controller

## Table of contents

### Functions

- [getProfile](controllers_persons_controller.md#getprofile)
- [signUp](controllers_persons_controller.md#signup)
- [updateProfile](controllers_persons_controller.md#updateprofile)

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

[src/controllers/persons-controller.ts:64](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/persons-controller.ts#L64)

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

[src/controllers/persons-controller.ts:14](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/persons-controller.ts#L14)

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

[src/controllers/persons-controller.ts:71](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/controllers/persons-controller.ts#L71)
