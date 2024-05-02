-- View: public.claims_view

DROP VIEW public.claims_view;

CREATE OR REPLACE VIEW public.claims_view
 AS
 SELECT cl.uid,
    cl.account_id,
    cl.state,
    st.label AS state_descr,
    pe.full_name AS applicant,
    pe.uid AS applicant_uid,
    cm.name AS community,
    cm.uid AS community_uid,
    pl.uid AS plan_uid,
    pl.name AS plan,
    cl.created_utc,
    cl.updated_utc,
    cl.positive_votes,
    cl.negative_votes,
    cl.ignored_votes,
  	cl.evidence_data
   FROM claims cl,
    persons pe,
    communities cm,
    plans pl,
    states st
  WHERE cl.applicant_uid = pe.uid AND cl.community_uid = cm.uid AND cl.state = st.id AND cl.plan_uid = pl.uid;

ALTER TABLE public.claims_view
    OWNER TO postgres;

/*
SELECT uid, account_id, state, full_name, description, image, email, phone, telegram, preferences, created_utc, updated_utc, approved_utc
	FROM public.persons;
	
SELECT uid, account_id, admin_uid, state, name, description, image, created_utc, updated_utc, approved_utc, xadmins
	FROM public.communities;	
*/