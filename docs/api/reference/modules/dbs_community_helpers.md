[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/community-helpers

# Module: dbs/community-helpers

## Table of contents

### Functions

- [findCommunityByName](dbs_community_helpers.md#findcommunitybyname)
- [getCommunityClaims](dbs_community_helpers.md#getcommunityclaims)
- [getCommunityCounters](dbs_community_helpers.md#getcommunitycounters)

## Functions

### findCommunityByName

▸ **findCommunityByName**(`name`): `Promise`\<``null`` \| `GetResult`\<\{ `accountId`: ``null`` \| `string` ; `adminUid`: `string` ; `approvedUTC`: ``null`` \| `Date` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `image`: ``null`` \| `string` ; `name`: `string` ; `state`: `string` ; `uid`: `string` ; `updatedUTC`: `Date` ; `xadmins`: ``null`` \| `string`  }, `unknown`, `never`\> & {}\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`\<``null`` \| `GetResult`\<\{ `accountId`: ``null`` \| `string` ; `adminUid`: `string` ; `approvedUTC`: ``null`` \| `Date` ; `createdUTC`: `Date` ; `description`: ``null`` \| `string` ; `image`: ``null`` \| `string` ; `name`: `string` ; `state`: `string` ; `uid`: `string` ; `updatedUTC`: `Date` ; `xadmins`: ``null`` \| `string`  }, `unknown`, `never`\> & {}\>

#### Defined in

[src/dbs/community-helpers.ts:53](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/community-helpers.ts#L53)

___

### getCommunityClaims

▸ **getCommunityClaims**(`uid`, `members`, `states?`): `Promise`\<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |
| `members` | [`CommunityMembers`](../classes/dbs_members_helper.CommunityMembers.md) |
| `states?` | `number`[] |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/dbs/community-helpers.ts:6](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/community-helpers.ts#L6)

___

### getCommunityCounters

▸ **getCommunityCounters**(`uid`): `Promise`\<\{ `countClaims`: `number` ; `countCredentials`: `number` ; `countMembers`: `number`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uid` | `string` |

#### Returns

`Promise`\<\{ `countClaims`: `number` ; `countCredentials`: `number` ; `countMembers`: `number`  }\>

#### Defined in

[src/dbs/community-helpers.ts:32](https://github.com/Identicon-Dao/socialcap-services/blob/50fabe6c/src/dbs/community-helpers.ts#L32)
