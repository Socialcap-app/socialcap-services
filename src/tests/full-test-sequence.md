# End to end testing for the voting process

## Prepare Level 0 database (testdb-L0)

We need to prepare the starting point Db that will be used for testing.

**1. Prepare claim data for TEST_PLAN_UID='8a940b4b26404391ac416429a27df64c'**
~~~
SELECT uid, state, state_descr, applicant, applicant_uid, community, community_uid, plan_uid, plan, created_utc, updated_utc, positive_votes, negative_votes, ignored_votes
FROM claims_view
where plan_uid='8a940b4b26404391ac416429a27df64c' ;

-- first IGNORE all pending drafts
update claims 
set state=11
where plan_uid='8a940b4b26404391ac416429a27df64c' and (state=0 or state=1);

-- now reset all not IGNORED to DRAFT
update claims 
set state=1
where plan_uid='8a940b4b26404391ac416429a27df64c' and state != 11;

-- reduce it to just 12 projects ?
--manually done

-- count 
select count(*) 
from claims_view
where plan_uid='8a940b4b26404391ac416429a27df64c' and state=1;
~~~
> 75

**2. Prepare judges data (3 judges)**
~~~
-- Change all wallet account_id on persons except the known test wallets
-- Change name of persons and reasign test wallets to some of them (7)
-- Assign the judges roles to this 3 testers
SELECT email, uid, account_id, state, full_name, description
FROM public.persons
where account_id != ''
order by email;
~~~
> email, uid, account_id, state, full_name, description
> "leomanzanal@gmail.com"	"ec3c6e254d0b42debd939d9a7bd7cacc"	"B62qixo7ZaNjibjRh3dhU1rNLVzNUqDtgwyUB6n9xxYFrHEHmfJXbBf"	"PENDING"	"Leandro Manzanal"	
> "mazito.v2+030@gmail.com"	"6df4f40a781347daa13d82b7e67c55a7"	"B62qpH9Z7wA4FWYEbhf48PNhjKgeYhboVmBZNKd1tLSkFuZUoEiqYAm"	"INITIAL"	"App Test2"	
> "mazito.v2+031@gmail.com"	"b7055c0ce3fd4d1bb610bd54192f8f93"	"B62qrv52UvPq6m3VWszbSmF4i6bTzkFVymr769dVBGoTbUcEgkEUdjS"	"INITIAL"	"App Test3"	
> "mazito.v2+032@gmail.com"	"4910371c60634d65803510f2a07c2247"	"B62qnN5uL2D9KRCrriFB8pphJNX94FQP46a6NAvYqtJX7DH1vEq7DHy"	"INITIAL"	"App Test4"	
> "mazito.v2@gmail.com"	"ec3c6e254d0b42debd939d9a7bd7dddd"	"B62qiTKpEPjGTSHZrtM8uXiKgn8So916pLmNJKDhKeyBQL9TDb3nvBG"	"PENDING"	"Mario Zito"	

**3. Assure strategy for this master plan has 3 judges**

This has to be done manually using the app.

**4. Dump the prepared Db to testdb-L0**
~~~
$ sudo login socialcap
$ ./run/dump-testdb.sh L0
~~~


## Level 1 testing

Tests Claim submissions and creation of ClaimVotingAccounts.

Uses: `testdb-L0`

**1. Restore the testdb-L0 for testing**
~~~
$ sudo login socialcap
$ ./run/restore-testdb.sh L0
~~~

**2. Start need processes**
~~~
./run-api.sh
./run-sequencer.sh
./run-dispatchers.sh
~~~




**2. Run the tests: Submit claims for each user**
~~~
node build/src/tests/run-submit-claims.ts
~~~

**3. Dump the prepared Db to testdb-L1** 
~~~
$ sudo login socialcap
./run/dump-testdb.sh L1
~~~



## Level 2:


Testing the start the voting process and assign judges to it

Requires L0 testing has been done and final results ar available in testdb-L1.

3. Start voting and assign judges
~~~
node build/src/tests/run-start-and-assign-judges.ts
~~~

4. Submit voting batches by judges 
~~~
node build/src/tests/run-submit-batches-form-judges.ts
~~~

5. Stop voting and dispatch votes
~~~
node build/src/tests/run-stop-voting-dispatch-votes.ts
~~~