import { Mina } from "o1js";
import { merkleStorage } from "../../global.js";
import { SequencerLogger as log } from "./logs.js";
import { Sender, SendersPool } from "./senders-pool.js";
import { Sequencer } from "./sequencer.js";

const INTERVAL = 5000; // every 5 secs


export function setupSequencer(params: {
  dispatchers: any[],
  workers: any[]
}) {
  log.info("Run Sequencer over Mina.Berkeley");
  const 
    BERKELEY_URL = 'https://proxy.berkeley.minaexplorer.com/graphql',
    ARCHIVE_URL = 'https://archive.berkeley.minaexplorer.com/';
  
  const Berkeley = Mina.Network({
    mina: BERKELEY_URL, 
    archive: ARCHIVE_URL
  });
  
  Mina.setActiveInstance(Berkeley);
  
  log.info("Setting dispatchers");
  (params.dispatchers || []).forEach((dispatcher) => {
    const name = dispatcher.name();
    Sequencer.addDispatcher(name);
    log.info(`Added dispatcher ${name}`)
  })

  log.info("Setting worker sender accounts");
  (params.workers || []).forEach((sender) => {
    SendersPool.addSender(sender.accountId, sender.secretKey, sender.workerUrl);
    log.info(`Added sender ${sender.accountId} ${sender.workerUrl}`)
  })
}


export async function runSequencer() {
  // restore state
  let activeQueuesNames = await Sequencer.refreshQueues();

  // run first 
  await Sequencer.run();
  log.running(activeQueuesNames);

  // reschedule for next INTERVAL
  let timer = setTimeout(async () => {
    clearTimeout(timer);
    runSequencer();
  }, INTERVAL) 
}


export function startSequencer() {
  // start the Db storage
  console.log("\n");
  merkleStorage.startup();
  SendersPool.restorePoolState();
  
  // we need the Db to be ready before we can do anything
  // so we make it wait for INTERVAL secs before running
  let to = setTimeout(async () => {
    runSequencer();
    clearTimeout(to);
  }, INTERVAL);
}
