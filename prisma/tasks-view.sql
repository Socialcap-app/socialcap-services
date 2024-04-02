-- View: public.tasks_view

DROP VIEW public.tasks_view;

CREATE OR REPLACE VIEW public.tasks_view
 AS
 SELECT ta.uid,
    ta.claim_uid,
    ta.assignee_uid as assignee_uid,
    ta.state,
    st.label AS state_descr,
    elec.full_name AS elector,
    elec.uid AS elector_uid,
    apli.full_name AS claimer,
    apli.uid AS claimer_uid,
    cm.name AS community,
    cm.uid AS community_uid,
    ta.assigned_utc,
    ta.completed_utc,
    ta.result,
    cl.evidence_data as claim_evidence_data,
    cl.account_id as claim_account_id,
    cl.positive_votes as claim_positive_votes,
    cl.negative_votes as claim_negative_votes,
    cl.ignored_votes as claim_ignored_votes,
    cl.required_votes as claim_required_votes,
    cl.required_positives as claim_required_positives,
    pl.uid as plan_uid,
    pl.name as plan,
    pl.image as plan_image
   FROM tasks ta,
    persons apli,
    persons elec,
    communities cm,
    states st,
    claims cl,
    plans pl
  WHERE ta.assignee_uid = elec.uid 
    AND ta.claim_uid = cl.uid 
    AND cl.community_uid = cm.uid 
    AND cl.applicant_uid = apli.uid 
    AND ta.state = st.id
    AND cl.plan_uid = pl.uid;

ALTER TABLE public.tasks_view
    OWNER TO postgres;
