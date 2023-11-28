import { fetchAccount, PublicKey } from "o1js";
import { SequencerLogger as log } from "./logs.js";

export { 
  waitForAccount,
  loopUntilAccountExists 
}

const MAX_RETRIES = 200;


async function waitForAccount(
  address: string
): Promise<any> {
  // wait for account ...
  await fetchAccount({ publicKey: address });

  let counter = 0;

  let response = await loopUntilAccountExists({
    account: PublicKey.fromBase58(address),
    eachTimeNotExist: () => {
      counter = counter+5; // every 5 secs
      log.waitingAccount(`addr=${address} ... ${counter} secs`);
    },
    isZkAppAccount: true,
    maxRetries: MAX_RETRIES
  });

  return response;
}


async function loopUntilAccountExists({
  account,
  eachTimeNotExist,
  isZkAppAccount,
  maxRetries
}: {
  account: PublicKey;
  eachTimeNotExist: () => void;
  isZkAppAccount: boolean;
  maxRetries: number
}) {
  let counter = 0;

  for (;;) {
    if (counter > maxRetries) {
      // break here and return
      return null;
    }

    let response = await fetchAccount({ publicKey: account });
    let accountExists = response.account !== undefined;
    //console.log(response.account);

    if (isZkAppAccount) {
      // CHANGED: accountExists = response.account?.appState !== undefined;
      accountExists = response.account?.zkapp?.appState !== undefined;
    }

    if (!accountExists) {
      eachTimeNotExist();
      counter++;
      await new Promise((resolve) => setTimeout(resolve, 5000));
    } 
    else {
      // break here and return
      return accountExists;
    }
  }
}
