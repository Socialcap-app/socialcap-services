import { merkleStorage } from "../global.js";
import { IDispatcherEntry, addDispatcher } from "./all-dispatchers.js";
import { SequencerLogger as log } from "./logs.js";
import { Sequencer } from "./sequencer.js";

const INTERVAL = 10000; // everyu 10 secs


export function setupSequencer(params: {
  dispatchers: IDispatcherEntry[]
}) {
  (params.dispatchers || []).forEach((t) => {
    addDispatcher(t.name, t.dispatcher);
  })
}


export async function runSequencer() {
  // run it ...
  let activeQueuesNames = await Sequencer.refreshQueues();
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
  merkleStorage.startup();
  
  // we need the Db to be ready before we can do anything
  // so we make it wait for INTERVAL secs before running
  setTimeout(async () => {
    runSequencer()
  }, INTERVAL);
}
