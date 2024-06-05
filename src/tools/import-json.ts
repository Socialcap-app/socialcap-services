import { PrismaClient } from "@prisma/client";
import fs from "fs";
import readline from "readline";
  
const prisma = new PrismaClient();

/* Mappings */
let prismaTable: any = {
  'claim': prisma.claim,
  'community': prisma.community,
  'person': prisma.person,
  'member': prisma.members,
  'plan': prisma.plan,
  'session': prisma.session,
  'credential': prisma.credential,
  'task': prisma.task,
  'batch': prisma.batch,
  'transactionQueue': prisma.transactionQueue,
  'state': prisma.state,
  'merkleMap': prisma.merkleMap,
  'merkeMapLeaf': prisma.merkleMapLeaf,
  'transactionEvent': prisma.transactionEvent,
  'kvStore': prisma.kVStore,
}

/**
 * Imports a JSON file and inserts it into the Prisma table.
 * The JSON file must be a JSON format file, where each line is a JSON obj.
 * 
 * @param path -  full path to the x.json file, ex: '/tmp/claims.json'
 * @param prismaTable - the Prisma table, ex: 'prisma.claim'
 */
async function importJsonFile(
  path: string,
  tableName: string 
) {
  console.log(`\n\nImporting table: '${tableName}' from: '${path}'`);
  if (!prismaTable[tableName]) {
    console.log(`Error: No such table name: ${tableName}`)
    return; 
  }

  try {
    const rl = readline.createInterface({
      input: fs.createReadStream(path, 'utf8')
    });

    let j = 0;
    rl.on('line', async (line) => {
      j++;
      // console.log(`Analyzing ${j}: ${line}\n\n`);
      let data = JSON.parse(line);

      if (data['signed_signature']) 
        console.log(`Analyzing ${j}: ${line} ERROR contains signed_signature\n\n`);

      // the received 'data' has its props in snakeCase, 
      // and also '_utc' needs to be converted to '_UTC',
      // as Prisma needs camelCase we need to convert keys. 
      let obj: any = {};
      Object.keys(data).map((key) => {
        let value = data[key];

        // UTC fields need to be converted from string to DateTime
        if (key.includes('_utc')) value = (new Date(value));
          
        obj[toCamelCase(key)] = value;
      })

      // push it to the Db
      await prismaTable[tableName].create({ 
        data: obj 
      })

      console.log(`Inserted row: ${j} into table: '${tableName}'`)
    });
  } catch (error) {
    console.log(error)
  }
}

function toCamelCase(str: string): string {
  str = str
    .replaceAll('_utc', '_UTC')
    .replaceAll('_', ' ');
  // Using replace method with regEx
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index == 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

async function main(args: string[]) {
  if (!args.length) {
    console.log(
      `Usage:\n`,
      `       import-json /full-path/to/file.json prismaName\n`
    )
    process.exit(1);
  }
  await importJsonFile(args[0], args[1]);
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error);
});
