DROP VIEW tasks_view;

CREATE OR REPLACE VIEW tasks_view AS 
SELECT 
	ta.uid,ta.claim_uid, ta.state, st.label as state_descr, 
	elec.full_name as elector, elec.uid as elector_uid, 
	apli.full_name as claimer, apli.uid as claimer_uid, 
	cm.name as community, cm.uid as community_uid,
	ta.assigned_utc, ta.completed_utc,
	ta.result
FROM 
	tasks ta, persons apli, persons elec, communities cm, states st, claims cl
WHERE
ta.assignee_uid=elec.uid 
AND ta.claim_uid=cl.uid
AND cl.community_uid=cm.uid 
AND  cl.applicant_uid=apli.uid 
AND ta.state=st.id;
