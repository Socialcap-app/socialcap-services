[Socialcap API](../README.md) / [Exports](../modules.md) / sessions-controller

# Module: sessions-controller

## Table of contents

### Functions

- [login](sessions_controller.md#login)
- [requestOtp](sessions_controller.md#requestotp)

## Functions

### login

▸ **login**(`params`): `Promise`\<`ResultOrError`\>

login

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `Object` | Object: { session_key, otp } |
| `params.otp` | `string` | - |
| `params.session_key` | `string` | - |

#### Returns

`Promise`\<`ResultOrError`\>

MutationResult

#### Defined in

[sessions-controller.ts:75](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/sessions-controller.ts#L75)

___

### requestOtp

▸ **requestOtp**(`params`): `Promise`\<`ResultOrError`\>

requestOTP

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `params` | `object` | Object: { email } |

#### Returns

`Promise`\<`ResultOrError`\>

MutationResult

#### Defined in

[sessions-controller.ts:14](https://github.com/Identicon-Dao/socialcap-services/blob/21d5347d/src/controllers/sessions-controller.ts#L14)
