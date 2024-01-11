/**
 * A very simple KeyValue store for storing JSON objects.
 * @MAZito 2023-12-15
 */
import { KVStore } from "@prisma/client";
import { logger, prisma } from "../global.js";
import { raiseError } from "../responses.js"

export {
  setValue,
  getValue,
  removeKey
}

/**
 * Inserts a new key-value if it does not exist or updates it if it exists.
 * NOTE that we only manage key string and key values. All serialization and 
 * deserialization must be done by the caller.
 * @param key string
 * @param value string
 * @returns the added or updated KVStore item
 */
async function setValue(key: string, value: string) {
  let kvitem = await prisma.kVStore.upsert({
    where: { key: key },
    update: { value: value },
    create: { key: key, value: value }
  })
  return kvitem;  
}

/**
 * Gets a value from the store, given its key.
 * @param key string to search
 * @returns the string value if the key exists, Null otherwise
 */
async function getValue(key: string): Promise<string | null>{
  let kvitem = await prisma.kVStore.findUnique({
    where: { key: key }
  })
  if (! kvitem)
    return null;
  return kvitem.value;
}

async function removeKey(key: string) {
  // implement latter  
}
