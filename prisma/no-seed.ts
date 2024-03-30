import { PrismaClient } from "@prisma/client";
import { updateEntity } from "../src/dbs/any-entity-helpers.js";
import { OffchainMerkleStorage } from "../src/dbs/index.js";

const prisma = new PrismaClient();

// we need the Db to be ready before using it
const merkleStorage = OffchainMerkleStorage ;
merkleStorage.startup();


/// DATA ///

const communities = [{
  uid: "70ed0f69af174c399b1958c01dc191c0",
  adminUid: "ec3c6e254d0b42debd939d9a7bd7dddd",
  accountId: "",
  state: "INITIAL",
  name: "MINA Navigators",
  description: "Would give it a try",
  image: "https://raw.githubusercontent.com/Identicon-Dao/socialcap/mina-navigators-program/assets/mina-navigators/MINA-Navigators-community-logo.jpeg",
  createdUTC: "2023-07-27T01:52:16.003Z",
  updatedUTC: "2023-07-27T01:52:16.003Z",
  approvedUTC: null, 
  xadmins: "ec3c6e254d0b42debd939d9a7bd70010,ec3c6e254d0b42debd939d9a7bd70011,ec3c6e254d0b42debd939d9a7bd70012"
 }
];

const members = [
  {
    uid: "",
    communityUid: "70ed0f69af174c399b1958c01dc191c0",
    personUid: "ec3c6e254d0b42debd939d9a7bd7cacc",
    role: "1",
    createdUTC: "2023-07-27T01:52:16.003Z",
    approvedUTC: "2023-07-27T01:52:16.003Z",
  },
  {
    uid: "",
    communityUid: "70ed0f69af174c399b1958c01dc191c0",
    personUid: "ec3c6e254d0b42debd939d9a7bd7dddd",
    role: "1",
    createdUTC: "2023-07-27T01:52:16.003Z",
    approvedUTC: "2023-07-27T01:52:16.003Z",
  },
  {
    uid: "",
    communityUid: "70ed0f69af174c399b1958c01dc191c0",
    personUid: "ec3c6e254d0b42debd939d9a7bd70010",
    role: "1",
    createdUTC: "2023-07-27T01:52:16.003Z",
    approvedUTC: "2023-07-27T01:52:16.003Z",
  },
  {
    uid: "",
    communityUid: "70ed0f69af174c399b1958c01dc191c0",
    personUid: "ec3c6e254d0b42debd939d9a7bd70011",
    role: "1",
    createdUTC: "2023-07-27T01:52:16.003Z",
    approvedUTC: "2023-07-27T01:52:16.003Z",
  },
  {
    uid: "",
    communityUid: "70ed0f69af174c399b1958c01dc191c0",
    personUid: "ec3c6e254d0b42debd939d9a7bd70012",
    role: "1",
    createdUTC: "2023-07-27T01:52:16.003Z",
    approvedUTC: "2023-07-27T01:52:16.003Z",
  },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70013",
  //   role: "2",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70014",
  //   role: "2",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70015",
  //   role: "2",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70016",
  //   role: "2",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70017",
  //   role: "3",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
  // {
  //   uid: "",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   personUid: "ec3c6e254d0b42debd939d9a7bd70018",
  //   role: "3",
  //   createdUTC: "2023-07-27T01:52:16.003Z",
  //   approvedUTC: "2023-07-27T01:52:16.003Z",
  // },
]


const users = [
  {
    uid: "ec3c6e254d0b42debd939d9a7bd7cacc",
    email: "leomanzanal@gmail.com",
    fullName: "Leandro Manzanal",
    state: "PENDING",
    accountId: "B62qixo7ZaNjibjRh3dhU1rNLVzNUqDtgwyUB6n9xxYFrHEHmfJXbBf",
  },
  {
    uid: "ec3c6e254d0b42debd939d9a7bd7dddd",
    email: "mazito.v2@gmail.com",
    fullName: "Mario Zito",
    state: "PENDING",
    accountId: "B62qrhGAwwXF8kXEbLAywaohFs7sk59h3Cid87D3Ah32UB3Dd3eWQ3S",
  },
  {
    uid: "ec3c6e254d0b42debd939d9a7bd70010",
    email: "yasin.yesilyurt@minaprotocol.com",
    fullName: "Yasin Yesilyurt",
    state: "PENDING",
    accountId: "B62qpffbtmeU3L2xt2k6X4WPP54uA4fSkkqsV99ZD39Y8nJ8N6eRgUa",
  },
  {
    uid: "ec3c6e254d0b42debd939d9a7bd70011",
    email: "metegergin@outlook.com",
    fullName: "Mete Gergin",
    state: "PENDING",
    accountId: "B62qpH9Z7wA4FWYEbhf48PNhjKgeYhboVmBZNKd1tLSkFuZUoEiqYAm",
  },
  {
    uid: "ec3c6e254d0b42debd939d9a7bd70012",
    email: "will.cove@minaprotocol.com",
    fullName: "Will Cove",
    state: "PENDING",
    accountId: "B62qrv52UvPq6m3VWszbSmF4i6bTzkFVymr769dVBGoTbUcEgkEUdjS",
  },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70013",
  //   email: "mazito.v2+04@gmail.com",
  //   fullName: "Test +04",
  //   state: "PENDING",
  //   accountId: "B62qnN5uL2D9KRCrriFB8pphJNX94FQP46a6NAvYqtJX7DH1vEq7DHy",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70014",
  //   email: "mazito.v2+05@gmail.com",
  //   fullName: "Test +05",
  //   state: "PENDING",
  //   accountId: "B62qmTfY9auDwpm4bjTV7jdzcmv9xTThAwK6j9f1B37vhchH96HFH5Z",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70015",
  //   email: "mazito.v2+06@gmail.com",
  //   fullName: "Test +06",
  //   state: "PENDING",
  //   accountId: "B62qmVuwdMgnTxpLPGd1kjcMTyof9XUcqAhQZ6TYaT3U6mrMNxkjQgY",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70016",
  //   email: "mazito.v2+07@gmail.com",
  //   fullName: "Test +07",
  //   state: "PENDING",
  //   accountId: "B62qqERvHPvDuMjQ9XZCjvAYEBus6AfWteihzq2zybBPZCmvTRvfhjG",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70017",
  //   email: "mazito.v2+08@gmail.com",
  //   fullName: "Test +08",
  //   state: "PENDING",
  //   accountId: "B62qpbqLB1pabZUu4oaDKFmv72DtHWnFxGK8aucNZHxS1cDmmsrrpVp",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70018",
  //   email: "mazito.v2+09@gmail.com",
  //   fullName: "Test +09",
  //   state: "PENDING",
  //   accountId: "B62qoZJnJWyAv2NngczJBAZgAaYLU6kjyj5poJc96QDbdqX1kZH6e9y",
  // },
  // {
  //   uid: "ec3c6e254d0b42debd939d9a7bd70020",
  //   email: "mazito.v2+20@gmail.com",
  //   fullName: "First time user +20",
  //   state: "PENDING",
  //   accountId: "",
  // },
]

//const credentials = [
  // {
  //   uid: "caaaaff63a48400a9ce57f3ad6960001",
  //   // the MINA account where this credential "lives"
  //   accountId: "B62x...01234", //
  //   // this are the other related MINA account ids
  //   applicantId: "B62qixo7ZaNjibjRh3dhU1rNLVzNUqDtgwyUB6n9xxYFrHEHmfJXbBf",
  //   claimId: "B62qoNJskZVfQVwf7jQ2vohCV1TzBgzaeTs1sayYb1ZDq6weLwV5CXP",
  //   // the source references (redundant by useful for querying)
  //   applicantUid: "ec3c6e254d0b42debd939d9a7bd7cacc",
  //   communityUid: "70ed0f69af174c399b1958c01dc191c0",
  //   claimUid: "fc2f96d6214b4b5696bf3a00eed12215",
  //   // type & description data
  //   type: "Community Active Help",
  //   description: "Rewarding those who helped others in a distingished form",
  //   community: "My first DAO",
  //   image: "https://fleek.ipfs.io/ipfs/bafybeig22bhtszvqbmenyekv7qb55hjqehriz6wmx7unsqygjieqxsc6dy",
  //   alias: "Manza",
  //   stars: 5,
  //   revocable: false,
  //   metadata: "{}",
  //   issuedUTC: "2023-08-01T15:00:00.000Z",
  //   expiresUTC: "2024-08-01T15:00:00.000Z",
  // }
//]
let strategyData = {"title":"","variant":"RandomAnonyomusValidators","selection":"ValidatorsSet","minValidators":3,"minVotes":3,"minPositives":2,"minAuditors":1,"auditFrequency":10};
let evidenceData = [{"sid":"fullName","required":true,"label":"Full name","description":"Please include your full name (names and surnames)","type":"text","extras":{"max":240,"allowed":null,"options":null}},{"sid":"githubProfileLink","required":true,"label":"Your Github profile","description":"Add a link to your Github profile","type":"links","extras":{"max":0,"allowed":null,"options":null}},{"sid":"discordHandle","required":true,"label":"Your Discord handle","description":"Full discord handle, for example \"pepe2#0001\" ","type":"text","extras":{"max":120,"allowed":null,"options":null}},{"sid":"teammates","required":true,"label":"Your teammates","description":"Your teammates full names, separated by comas please. Input \"NA\" if not applicable.","type":"note","extras":{"max":600,"allowed":null,"options":null}},{"sid":"projectName","required":false,"label":"The project name","description":"","type":"text","extras":{"max":240,"allowed":null,"options":null}},{"sid":"projectDescription","required":false,"label":"Project description","description":"","type":"note","extras":{"max":2048,"allowed":null,"options":null}},{"sid":"projectArchitecture","required":false,"label":"Project Architecture","description":"","type":"note","extras":{"max":2048,"allowed":null,"options":null}},{"sid":"milestones","required":false,"label":"Milestones","description":"Some context","type":"note","extras":{"max":2048,"allowed":null,"options":null}},{"sid":"demoLink","required":false,"label":"Demo or video","description":"","type":"links","extras":{"max":0,"allowed":null,"options":null}},{"sid":"zkigniteParticipation","required":false,"label":"zkIgnite participation","description":"If you have been funded in zkIgnite cohort 1 or 2, you are eligible to apply ! Please indicate which cohort did you have funded.","type":"radio","extras":{"max":0,"allowed":null,"options":"Not a participant, Cohort 1, Cohort 2, Not funded"}},{"sid":"zkIgniteProjectName","required":true,"label":"Name of the funded project","description":"If you were funded, what is the name of the funded project ?","type":"text","extras":{"max":240,"allowed":null,"options":null}},{"sid":"","required":false,"label":"","description":"Thse are some additional remarks to be included as **free markdown text** anywhere in the form.","type":"remark","extras":{"max":0,"allowed":null,"options":null}}];

const plans = [{
  uid: "8a940b4b26404391ac416429a27df64c",
  communityUid: "70ed0f69af174c399b1958c01dc191c0",
  state: 1,
  name: "MINA Navigators Hackaton", 
  alias: "",
  description: "MINA Navigators Hackaton",
  image: "https://raw.githubusercontent.com/Identicon-Dao/socialcap/mina-navigators-program/assets/mina-navigators/MINA-Navigators-community-logo.jpeg",
  template: "",
  evidence: JSON.stringify(evidenceData),
  strategy: JSON.stringify(strategyData),
  createdUTC : "2023-11-01T15:54:13.000Z",
  updatedUTC: "2023-11-01T15:54:13.000Z",
  fee: 0,
  rewardsShare: 70,
  communityShare: 20,
  protocolShare: 10,
  total: 0,
  available: 500,
  expiration: 365,
  revocable: false,
  startsUTC: "2023-10-10T00:00:00.000Z",
  endsUTC: "2023-11-10T00:00:00.000Z",
}]

const merkle_map_data = [
  {
    id: 1,
    name: "persons",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 2,
    name: "communities",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 3,
    name: "members",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 4,
    name: "plans",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 5,
    name: "claims",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 6,
    name: "tasks",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 7,
    name: "credentials",
    root: "0",
    size: 0,
    height: 256,
  },
  {
    id: 8,
    name: "nullifier",
    root: "0",
    size: 0,
    height: 256,
  },
];

const merkle_map_leaf_data: any[] = [];


/// MAIN RUN ///

async function main() {
  // first insert the MerkleMaps  
  for (let j=0; j < merkle_map_data.length; j++) {
    const map = merkle_map_data[j];
    const mm = await prisma.merkleMap.upsert({
      where: { id: map.id },
      update: {},
      create: {
        id: map.id,
        name: map.name,
        root: BigInt(map.root),
        height: map.height,
        size: map.size,
      },
    })
    console.log(mm)
  }

  for (let j=0; j < merkle_map_leaf_data.length; j++) {
    const leaf = merkle_map_leaf_data[j];
    const mml = await prisma.merkleMapLeaf.upsert({
      where: { uid: leaf.uid },
      update: {},
      create: {
        uid: leaf.uid,
        mapId: leaf.merkleMapId,
        index: leaf.index,
        key: leaf.key,
        hash: leaf.hash,
        data: JSON.stringify(leaf.data),
      },
    })
    console.log(mml)
  }

  // Now we can insert the people
  for (let j=0; j < users.length; j++) {
    const u = users[j];
    let uu = await prisma.person.upsert({
      where: { email: u.email },
      update: {},
      create: u
    });
    console.log("Inserted ", uu);

    await updateEntity("person", u.uid, u);
    console.log("Updated entity", uu);
  }

  // Add community
  for (let j=0; j < communities.length; j++) {
    const cm = communities[j];
    let cmm = await prisma.community.upsert({
      where: { uid: cm.uid },
      update: {},
      create: cm
    });
    console.log("Inserted ", cmm);

    await updateEntity("community", cm.uid, cm);
    console.log("Updated entity", cm);
  }

  // Join to community
  for (let j=0; j < members.length; j++) {
    const m = members[j];
    m.uid = m.communityUid+m.personUid;
    let mm = await prisma.members.upsert({
      where: { uid: m.uid },
      update: {},
      create: m
    });
    console.log("Inserted ", mm);

    let mmm = await updateEntity("members", m.uid, m);
    console.log("Updated entity", mmm);
  }

  // Add Plans
  for (let j=0; j < plans.length; j++) {
    const crd = plans[j];
    let crdp = await prisma.plan.upsert({
      where: { uid: crd.uid },
      update: {},
      create: crd
    });
    console.log("Inserted ", crdp);

    let mmm = await updateEntity("plan", crdp.uid, crdp);
    console.log("Updated entity", mmm);
  }
}

setTimeout(async () => {
  await main();
}, 10000); 

/*
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
*/