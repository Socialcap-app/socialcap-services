import { Field, PublicKey } from "o1js";
import { merkleStorage, prisma } from "../global.js";
import { delay } from "./test-helpers.js";
import { UID, ASSIGNED, sliced, DONE } from "@socialcap/contracts-lib";
import { ClaimElectorNullifier, ClaimElectorNullifierLeaf } from "@socialcap/claim-voting";
import { saveJSON, getJSON } from "../dbs/nullifier-helpers.js";
import { getTasksByPlan } from "../dbs/task-helpers.js";
import { getPersonsWithAccount } from "../dbs/person-helpers.js";

// the test plan in testdb0
// MINA Navigators
const TEST_PLAN_UID = '8a940b4b26404391ac416429a27df64c';

async function run(planUid: string) {

  let tasks = await getTasksByPlan(planUid, { states: [DONE]});

  const claimsNullifierUid= `claim-elector-nullifier-${planUid}`;
  let claimsNullifier = await getJSON<ClaimElectorNullifier>(
    claimsNullifierUid, 
    new ClaimElectorNullifier()
  );

  const electorsDictio: any = {}; 
  const electors = await getPersonsWithAccount();
  (electors).forEach((t) => {
    electorsDictio[t.uid] = t.accountId;
    console.log(" elector=", t.uid, " | ", electorsDictio[t.uid]);
  })

  for (let j=0; j < tasks.length ; j++) {
    let task: any = tasks[j];

    console.log("\nj=", j, " elector=", task.assigneeUid, " | ", electorsDictio[task.assigneeUid]);
    if (!electorsDictio[task.assigneeUid])
      continue;

    let electorPuk = PublicKey.fromBase58(electorsDictio[task.assigneeUid]);

    const key = ClaimElectorNullifierLeaf.key(
      electorPuk, 
      UID.toField(task.claimUid)
    );
    const value = Field(ASSIGNED);

    // update Nullifier to avoid invalid/double voting 
    claimsNullifier.addLeafs([{ key: key, value: value }]); 
    console.log(`leaf uid=${sliced(planUid)} key=${sliced(key.toString())} value=${value}`);

    let root = claimsNullifier.root();
    let witness = claimsNullifier.witness(key);
    const [witnessRoot, witnessKey] = witness.computeRootAndKey(
      Field(ASSIGNED) /* WAS ASSIGNED BUT NOT VOTED YET */
    );
    console.log(`assertRoot=${root.toString() === witnessRoot.toString()} root=${sliced(root.toString())} ==? ${sliced(witnessRoot.toString())}`);
    console.log(`assertKey=${key.toString() === witnessKey.toString()} key=${sliced(key.toString())} ==? ${sliced(witnessKey.toString())}`);

    await delay(1000);
  }

  await saveJSON<ClaimElectorNullifier>(claimsNullifierUid, claimsNullifier);
}

// start the Db
merkleStorage.startup();

// we need the Db to be ready before we can do anything
// so we make it wait for 10000 secs before running
setTimeout(async () => {
  await run(TEST_PLAN_UID); 
}, 5000);
