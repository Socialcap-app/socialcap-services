/**
 * A LMDB KeyValue store for saving Sequencer states, such as 
 * SendersPool and Queues states.
 */
import 'dotenv/config';
import { open } from "lmdb" ;

export { KVS }


class KVS {
  
  private static _DB: any = null;

  public static get(key: string): any | null {
    const db = KVS.openDb();
    const data = db.get(key) || null;
    return data;
  }
  
  public static put(key: string, data: any) {
    const db = KVS.openDb();
    db.transaction(() => {
      db.put(key, data);
    });
  }

  private static openDb() {
    if (KVS._DB) return KVS._DB;
    const db = open({
      path: process.env.LMDB_PATH,
      // any options go here
      encoding: 'msgpack',
      sharedStructuresKey: Symbol.for('sharedstructures'),
      cache: true,
      // compression: true,
    });
    KVS._DB = db;
    return KVS._DB;
  }
}
