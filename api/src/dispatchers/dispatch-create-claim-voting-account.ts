import { Mina, AccountUpdate, PrivateKey, PublicKey } from "o1js";
import { ClaimVotingContract } from "@socialcap/contracts";
import { Payers } from "./payers.js"
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { 
  waitForAccount,
  RawTxnData,
  postTransaction,
  AnyDispatcher,
  TRY_SEND_TRANSACTION_EXCEPTION,
  CREATE_ACCOUNT_WAITING_TIME_EXCEEDED,
  hasException 
} from "../sequencer/index.js"

export { CreateClaimVotingAccountDispatcher };


class CreateClaimVotingAccountDispatcher extends AnyDispatcher {

  constructor(callbacks: {
    onDone: (result: any) => void,
    onFailure: (error: any) => void;
  }) {
    super(callbacks);
  }

  /**
   * Creates a new zkApp using the ClaimVotingContract. Each claim has 
   * its own zkApp account created just for doing the voting on it.
   *
   * @param txnData: 
   *  account: { id, publickKey, privateKey } keys of the account to create
   *  claimUid: the Uid of the Claim binded to this account
   *  strategy: {requiredVotes,requiredPositives...} params for voting
   * @returns 
   */
  async dispatch(txnData: RawTxnData) {
    // the 'account' keys SHOULD have been generated before 
    let { account, claimUid, strategy } = txnData.data;
    
    let deployer = Payers.DEPLOYER;

    let pendingTxn: any = null;

    try {
      // we ALWAYS compile it
      await ClaimVotingContract.compile();

      // we need to generate a new key pair for each deploy
      console.log(`zkApp instance address=${account.id}`);

      const accountPublicKey = PublicKey.fromBase58(account.publicKey);
      const accountPrivateKey = PrivateKey.fromBase58(account.privateKey);
      
      let zkApp = new ClaimVotingContract(accountPublicKey);
      console.log("zkApp instance created!");
      
      // deploy it 
      let txn = await Mina.transaction(
        { sender: deployer.publicKey, fee: DEPLOY_TX_FEE }, () => {
        // IMPORTANT: the deployer account must already be funded 
        // or this will fail miserably ughhh
        AccountUpdate.fundNewAccount(deployer.publicKey);
        zkApp.deploy();
      });
      await txn.prove();

      // this tx needs .sign(), because `deploy()` adds an account update 
      // that requires signature authorization
      pendingTxn = await txn
        .sign([deployer.privateKey, accountPrivateKey])
        .send();
      console.log("zkApp instance deployed !")

      // creating an account in MINA takes a lot of time (betwwen 3 to 10 mins)
      // before the account is ready, and we can't do anything until it has been
      // created, so we must wait !
      let createdAccount = await waitForAccount(account.id);
      if (! createdAccount) {
        // we report the error and finish here, we can not do anything more
        // except let the Sequencer retry this ... until it succeeds or fails
        await this.onFailure({
          MinaTxnId: `${pendingTxn.hash()}`,
          error: CREATE_ACCOUNT_WAITING_TIME_EXCEEDED
        });
        return;
      }

      // AFTER the account has been created, we need to setup the created 
      // account with the correct local vars, BEFORE we can start voting. We 
      // post a transaction to do this.
      postTransaction(`zkapp:${account.id}`, {
        type: 'SETUP_CLAIM_VOTING_ACCOUNT',
        data: {
          accountId: account.id,
          claimUid: claimUid,
          strategy: strategy
        }
      })        

      // this is done for cleanly closing the dispatch, and getting the full
      // transaction status, but it will not have to wait because the waiting 
      // has been done in the waitForAccount: if the account is ready, it means 
      // the transaction was already included in block. 
      this.reportErrorOrWait(pendingTxn, {});
      return;
    } 
    catch (except: any) {
      // this can happen for a number of reasons such as not enough funds
      // for creating the account, some error in the code, etc. So we just
      // catch it and report it 
      await this.onFailure({
        error: hasException(TRY_SEND_TRANSACTION_EXCEPTION, except.toString())
      })
      return;
    }
  }
}
