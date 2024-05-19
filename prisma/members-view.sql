-- View: public.members_view

-- DROP VIEW public.members_view;

CREATE OR REPLACE VIEW public.members_view
 AS
 SELECT me.uid,
    me.role,
        CASE
            WHEN me.role = '0'::text THEN 'PENDING'::text
            WHEN me.role = '1'::text THEN 'MEMBER'::text
            WHEN me.role = '2'::text THEN 'VALIDATOR'::text
            WHEN me.role = '3'::text THEN 'AUDITOR'::text
            ELSE NULL::text
        END AS role_descr,
        CASE
            WHEN cm.xadmins ~~* concat('%', pe.uid, '%') OR pe.uid = cm.admin_uid THEN true
            ELSE false
        END AS is_admin,
    pe.uid AS person_uid,
    pe.full_name,
    pe.account_id,
    cm.name AS community,
    cm.uid AS community_uid,
    me.created_utc,
    me.approved_utc
   FROM persons pe,
    members me,
    communities cm
  WHERE me.community_uid = cm.uid AND me.person_uid = pe.uid AND (me.role = ANY (ARRAY['0'::text, '1'::text, '2'::text, '3'::text]));

ALTER TABLE public.members_view
    OWNER TO postgres;

