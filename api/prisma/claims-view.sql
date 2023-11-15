DROP VIEW claims_view;

CREATE OR REPLACE VIEW claims_view AS 
SELECT 
	cl.uid, cl.state, st.label as state_descr, 
	pe.full_name as applicant, pe.uid as applicant_uid, 
	cm.name as community, cm.uid as community_uid,
	cl.created_utc, cl.updated_utc,
  cl.positive_votes, cl.negative_votes, cl.ignored_votes
FROM public.claims cl, persons pe, communities cm, states st
WHERE
	cl.applicant_uid=pe.uid AND cl.community_uid=cm.uid AND cl.state=st.id;

/*
SELECT uid, account_id, state, full_name, description, image, email, phone, telegram, preferences, created_utc, updated_utc, approved_utc
	FROM public.persons;
	
SELECT uid, account_id, admin_uid, state, name, description, image, created_utc, updated_utc, approved_utc, xadmins
	FROM public.communities;	
*/