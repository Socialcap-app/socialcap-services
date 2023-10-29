

<DetailPageHeader items={[
    { href: "/", text: 'Home'},
    { href: "/", text: 'Submit your vote'}
  ]} />

<DetailPageContent>
  <Section class="section-md text-start">

    <div class="d-flex align-items-center justify-content-start">
      <img src={data.plan.image} alt="Badge" width="22.5%" crossorigin/>

      <div class="ps-4 w-100">
        <div class="header">
          <p class="p-0 m-0 mb-1">Claim: {claimIdn}</p>
          <h3 class="text-black d-flex justify-content-between align-items-center">
            <span>{data.plan.name}</span>
            <span class="fs-5">
              <StateBadge state={data.state} />
            </span>
          </h3>
          <p class="fs-sm text-secondary lh-lg">
            {@html data.plan.description}
            <br>
            <b class="">{data.community.name}</b>
          </p>
          <p class="fs-6">
            Claimed by <b class="d-inline-block text-bg-gray py-1 px-2 rounded-2 fs-4">{data.claim.alias}</b>
          </p>
        </div>
  
        <div class="d-flex justify-content-start w-100">
          <p class="pe-2 w-25">
            <span class="fs-xs">Started</span>
            <br/><b class="fs-sm">{prettyDate(data.assignedUTC)}</b>
          </p>
          <p class="pe-4 w-25">
            <span class="fs-xs">Ends</span>
            <br/><b class="fs-sm">{prettyDate(data.dueUTC)}</b>
          </p>
          <p class="pe-4 w-25">
            <span class="fs-xs">Voting ...</span>
            <br/><b class="fs-sm">
              <!-- <pre>{JSON.stringify(data.claim,null,4)}</pre> -->
              {data.claim.positiveVotes+data.claim.negativeVotes+data.claim.ignoredVotes} 
              / {data.claim.requiredVotes}
          </p>
        </div>
      </div>
    </div>

    <hr>
  </Section>

  <Section class="section-sm m-auto text-center rounded-4 bg-white mt-3 d-flex justify-content-center">
    <Form>
      <div class="rounded-4">
        <FormGroup class="p-4 text-center d-flex flex-column">
          <Label for="alias"class="fs-1 text-bold text-black ps-1 ">Your vote</Label>
          <FormText color="ps-1 fs-2 text-black mb-4">
            Please submit your vote before ({data.dueUTC}).
          </FormText>
          <FormGroup>
            
            <div class=" d-flex justify-content-between gap-3 w-50">
              <div class="vote-container">
                <input type="radio" class="btn-check" name="vote" id="positive" autocomplete="off">
                  <label class="btn bg-light p-5 d-flex flex-column text-primary" for="positive"><Icon name="plus-circle-fill" class='fs-1 text-success' /> <span>Positive</span></label>    
              </div>
              <div class="vote-container">
              <input type="radio" class="btn-check" name="vote" id="negative" autocomplete="off">
              <label class="btn bg-light p-5 d-flex flex-column text-primary" for="negative">
                <Icon name="dash-circle-fill" class='fs-1 text-danger' /> Negative
              </label>
              </div>
              <input
              bind:value={vote} 
               type="radio" class="btn-check" name="vote" id="abstain" autocomplete="off">
              <label class="btn bg-light p-5 d-flex flex-column text-primary" for="abstain">
                <Icon name="slash-circle-fill" class='fs-1 text-warning' /> Abstain
              </label>

            <!-- <Input
              class="radio-button"
              id="r1"
              type="radio"
              bind:group={radioGroup}
              value="positive"
              label="Positive"
            />
            <div class="ratio-btn">
              <label for="Negative" class="radio-btn-label">Negative</label>

            </div> -->
            </div>



            
          </FormGroup>

          <!-- <Input 
            bind:value={vote} 
            type="select" name="vote" id="vote" 
            class="rounded-1 p-2 mb-1" style="width:12rem;">
            <option value="Y">Positive</option>
            <option value="N">Negative</option>
            <option value="A">Abstain</option>
           <option value="ND">Will not do</option>
          </Input>            -->

          
        </FormGroup>
        {#if vote}
          <SubmitButton
            on:click={() => voteNow()}
            color="primary" label="Submit it !" />
        {/if}
      </div>
      <p>
        Please submit your vote before <b>{prettyDate(data.dueUTC)}</b>.
      </p>

      {#if vote==="N" || vote==="A" || vote==="ND"}
      <div class="d-flex justify-content-center rounded-4">
        
        <FormGroup class="d-flex flex-column justify-content-center w-100">
         
          <Input 
          bind:value={data.reason} 
          type="select" name="vote" id="vote"
          class="rounded-2 p-3 mb-1 w-100">
          <option value="" class="text-danger" disabled>Please choose a reason</option>
          <option value="N1">Does not match requirements</option>
          <option value="N2">Not enough evidence</option>
          <option value="A1">Conflict of interests</option>
          <option value="A2">Can not evaluate</option>
          <option value="A2">Not my area</option>
          <option value="A4">Not enough time</option>
          <option value="A5">Not enough rewards</option>
          <option value="A6">Other</option>
        </Input>          
      </FormGroup>
      {/if}
    </Form>
  </Section>

  <Section class="section-sm text-start">
      <p class="mt-4 mb-2 pt-2 hl-base">
        <b>Here you can find the evidence provided by the claimer</b>. 
        This evidence will be deleted as soon as the claim has been approved.
      </p>
      {#each data.claim.evidenceData as field}
        <div class="d-flex justify-content-start align-items-start border-top mt-0 pt-3 pb-0">
          <p class="ps-0 py-0 fw-bold fs-sm w-25 text-start">{field.label}</p>
          <p class="px-2 py-0 fs-6 w-75 text-start">{field.value}</p>
        </div>
      {/each}

      <div class="mt-5 mb-5 px-2 d-flex justify-content-center align-items-center">
          <!-- <SubmitButton 
            on:click={() => saveDraft()}
            color="secondary" label="Save draft ..."/>
          &nbsp;&nbsp; -->
          <SubmitButton             
            on:click={() => voteNow()}
            color="primary" label="Submit your vote !" />
      </div>
  </Section>        

  <!-- <Filler n=40/> -->
</DetailPageContent>

<div>
  <Modal isOpen={open} {toggle} backdrop="static">
    <ModalHeader {toggle}>
      You need to confirm your vote 
    </ModalHeader>

    <ModalBody>
      <p class="p-2">
        Account: <b>
          {voterAccountId.slice(0,6)}...{voterAccountId.slice(-6)}
        </b>
      </p>
      {#if !$deployedVoting$}
        <p class="p-2"> 
          Please wait ... loading Snarky contracts ...
        </p>
      {/if}
      {#if $deployedVoting$}
        <p class="p-1">Snarky SocialcapContract is ready !</p>
      {/if}

      {#if $deployedVoting$ && !$auroWallet$?.connected}
        <p class="p-1">Connecting the wallet ...</p>
      {/if}

      {#if $deployedVoting$ && $auroWallet$?.connected && $auroWallet$?.publicKey && paymentStatus===0}
        <p class="p-1">AuroWallet is connected !</p>
        <p class="p-1">Account: {$auroWallet$?.publicKey.slice(0,6)}...{$auroWallet$?.publicKey.slice(-6)}</p>
        <p class="p-2">
          Are you ready to send your vote ?
        </p>
      {/if}

      {#if paymentStatus===1}
        <p class="p-2">
          {paymentMessage}
        </p>
      {/if}

      {#if paymentStatus===2}
        <p class="p-2 text-wrap">
          Vote was sent !
          <br>
          <br>Please wait for transaction to be included... it takes some time.
          <br>
          <br>Transaction Id: <a href={`${MINAExplorer}/transaction/${pendingTxn?.hash}`}>
              {pendingTxn?.hash}
            </a>
        </p>
      {/if}
    </ModalBody>

    <ModalFooter class="text-center">
      {#if canPayNow && paymentStatus===0}
        <Button color="primary" on:click={payNow}>Send it now !</Button>
      {/if}
      {#if paymentStatus!==2}
        <Button color="secondary" on:click={toggle}>Cancel</Button>
      {/if}
    </ModalFooter>
  </Modal>
</div>

<div>
  <Modal isOpen={openNoWalletDlg} toggle={toggleNoWalletDlg}>
    <ModalHeader toggle={toggleNoWalletDlg}>
      Auro wallet is not installed
    </ModalHeader>
    <ModalBody>
      Please install the Auro wallet for paying your claims,
    </ModalBody>
    <ModalFooter class="text-center">
      <Button color="secondary" on:click={toggle}>Cancel</Button>
    </ModalFooter>
  </Modal>
</div>


<script>
  import { onMount, tick } from "svelte";
  import { get } from "svelte/store";
  import { Breadcrumb, BreadcrumbItem, Icon, Badge, Form, FormGroup, FormText, Label, Input, Button } from 'sveltestrap';
  import { Modal, ModalBody,ModalFooter,ModalHeader } from 'sveltestrap';
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import Section from "@components/Section.svelte";
  import CloseButton from "@components/buttons/CloseButton.svelte";
  import SubmitButton from "@components/buttons/SubmitButton.svelte";
  import StateBadge from "@components/badges/StateBadge.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { prettyDate } from "@utilities/datetime";
  import { submitTask } from "@apis/mutations";
  import { getNullifier } from "@apis/queries";
  // import { NullifierProxy } from "@socialcap/contracts";


  import { 
    MINAExplorer, connectWallet, payForVoting,
    auroWallet$, deployedVoting$, loadVotingZkapp 
  } from "$lib/contracts/helpers";

  export let data; // this is the data for this Task

  let user ;
  let vote = null;
  let voterAccountId;
  let claimIdn = "";

  let open = false;
  const toggle = () => (open = !open);
  
  let openNoWalletDlg = false;
  const toggleNoWalletDlg = () => (openNoWalletDlg = !openNoWalletDlg);

  let paymentMessage = "", paymentStatus = 0, canPayNow = false;
  let pendingTxn;

  onMount(async () => {
    user = await getCurrentUser();
    voterAccountId = user.profile.accountId;
    claimIdn = data.claim.uid.slice(0,6)+'...'+data.claim.uid.slice(-6);
  })

  /**
   * First saves the draft and then asks for payment before submiting 
   * the claim to the API and starting the MINA transaction.
   * The Payer is the logged user who needs to pay for the Credential, and
   * is transfered to the Socialcap (main) account.
   * The new Claim deployment is payed by the SocialcapFeePayer account.
   */
   async function voteNow() {
    let confirmed = window.confirm("are you sure ? Once submited it can not be changed !");
    if (!confirmed) return;

    // await ready for payment
    canPayNow = await isReadyForPayment();
  }

  async function isReadyForPayment() {
    paymentStatus = 0;
    toggle(); // open dialog

    let isSnarkyLoaded = get(deployedVoting$) ;
    if (!isSnarkyLoaded) {
      isSnarkyLoaded = await loadVotingZkapp(data.claim.accountId);
    }

    let hasWallet = false;
    if (isSnarkyLoaded) {
      hasWallet = await connectWallet();
    }

    if (!hasWallet) {
      toggleNoWalletDlg();
    }

    return (hasWallet && isSnarkyLoaded) ;
  }

  async function payNow() {
    paymentMessage = "Starting voting transaction ..."; await tick();
    paymentStatus = 1; // started

    let result = await payForVoting(data, data.vote);

    if (!result.success) {
      paymentMessage= "Voting was not done: "+result.error; await tick();
      return;
    }
    pendingTxn = result.pendingTxn;
    paymentStatus = 2; // sent ;
    await tick();

    // we can now submit the Vote and continue the voting process
    let params = data.task;
    params.extras = {
      transaction: JSON.stringify(pendingTxn)
    };
    let updated = await submitTask(params);
    if (updated) 
      history.back();
  }

</script>




