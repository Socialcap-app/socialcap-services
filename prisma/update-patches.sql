-- Fix members table column names
-- @MAZ - 2024-04-17
ALTER TABLE IF EXISTS public.members RENAME "communityUid" TO community_uid;
ALTER TABLE IF EXISTS public.members RENAME "personUid" TO person_uid;
ALTER TABLE IF EXISTS public.members RENAME "approvedUTC" TO approved_utc;        

ALTER TABLE IF EXISTS public.credentials RENAME "communityUid" TO community_uid;        
ALTER TABLE IF EXISTS public.credentials RENAME "applicantUid" TO applicant_uid;        
ALTER TABLE IF EXISTS public.credentials RENAME "claimUid" TO claim_uid;        
