import { Mina, Field } from "o1js";
import { ClaimVotingContract } from "@socialcap/contracts";
import { Payers } from "./payers.js"
import { DEPLOY_TX_FEE } from "./standard-fees.js";
import { 
  RawTxnData,
  AnyDispatcher,
  TRY_SEND_TRANSACTION_EXCEPTION,
  hasException 
} from "../sequencer/index.js"

export { SetupClaimVotingAccountDispatcher };


class SetupClaimVotingAccountDispatcher extends AnyDispatcher {

  /**
   * Creates a new zkApp account for the given claim.
   * 
   * @param txData {
   *  accountId: the accountId created and which we want to setup
   *  claimUid: the Uid of the Claim binded to this account
   *  strategy: {requiredVotes,requiredPositives...} params for voting
   */
  async dispatch(txData: RawTxnData) {
    let { accountId, claimUid, strategy } = txData.data;
    
    let deployer = Payers.DEPLOYER;

    let pendingTxn: any = null;
    try {
      await ClaimVotingContract.compile();
   
      let zkApp = new ClaimVotingContract(accountId);
    
      let txn = await Mina.transaction(
        { sender: deployer.publicKey, fee: DEPLOY_TX_FEE }, () => {
        zkApp.setup(
          claimUid, 
          strategy.requiredVotes, 
          strategy.requiredPositives
        );
      });
      await txn.prove();
      
      pendingTxn = await txn
        .sign([deployer.privateKey])
        .send();
    }
    catch (except: any) {
      // this can happen for a number of reasons such as not enough funds
      // for creating the account, some error in the code, etc. So we just
      // catch it and report it 
      this.onFailure({
        error: hasException(TRY_SEND_TRANSACTION_EXCEPTION, except)
      })
    }
  
    // now wait till transaction is included in block
    this.reportErrorOrWait(pendingTxn, {});

    return;
  }
}
