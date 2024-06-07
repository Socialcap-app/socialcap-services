-- Fix members table column names
-- @MAZ - 2024-04-17
ALTER TABLE IF EXISTS public.members RENAME "communityUid" TO community_uid;
ALTER TABLE IF EXISTS public.members RENAME "personUid" TO person_uid;
ALTER TABLE IF EXISTS public.members RENAME "approvedUTC" TO approved_utc;        

ALTER TABLE IF EXISTS public.credentials RENAME "communityUid" TO community_uid;        
ALTER TABLE IF EXISTS public.credentials RENAME "applicantUid" TO applicant_uid;        
ALTER TABLE IF EXISTS public.credentials RENAME "claimUid" TO claim_uid;        

-- Add columns to Plan table
ALTER TABLE IF EXISTS public.plans ADD COLUMN payed_by integer DEFAULT 1;
COMMENT ON COLUMN public.plans.payed_by IS '1: Applicant 2: Community 3: Socialcap';
ALTER TABLE IF EXISTS public.plans ADD COLUMN voting_starts_utc timestamp without time zone;
ALTER TABLE IF EXISTS public.plans ADD COLUMN voting_ends_utc timestamp without time zone;

-- Rename columns in Batch
ALTER TABLE IF EXISTS public.batches RENAME "signed_signature" TO signature_field;        
ALTER TABLE IF EXISTS public.batches RENAME "signed_scalar" TO signature_scalar;      


