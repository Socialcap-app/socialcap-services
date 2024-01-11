[Socialcap API](../README.md) / [Modules](../modules.md) / dbs/task-helpers

# Module: dbs/task-helpers

## Table of contents

### Functions

- [changeAssignedTasksStateByPlan](dbs_task_helpers.md#changeassignedtasksstatebyplan)

## Functions

### changeAssignedTasksStateByPlan

▸ **changeAssignedTasksStateByPlan**(`planUid`, `state`): `Promise`\<`number`\>

Change the state of all ASSIGNED tasks in the Plan that were not completed 
by the electors. We mark them as IGNORED becuase the elector just ignored
them and did not submit his vote.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `planUid` | `string` | the plan containing the tasks to change |
| `state` | `number` | the new state (default is IGNORED) |

#### Returns

`Promise`\<`number`\>

#### Defined in

src/dbs/task-helpers.ts:11
