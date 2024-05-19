-- View: public.credentials_view

-- DROP VIEW public.credentials_view;

CREATE OR REPLACE VIEW public.credentials_view
 AS
 SELECT cl.uid,
    cl.account_id,
    cl.applicant,
    cl.applicant_uid,
    pe.full_name,
    cl.community,
    cl.community_uid,
    cm.image AS community_image,
    cl.updated_utc AS issued_utc,
    pl.expiration,
    pl.image,
    pl.name,
    pl.description
   FROM claims_view cl,
    persons pe,
    plans pl,
    communities cm
  WHERE cl.state_descr ~~* 'APP%'::text AND cl.applicant_uid = pe.uid AND cl.community_uid = cm.uid AND cl.plan_uid = pl.uid;

ALTER TABLE public.credentials_view
    OWNER TO postgres;
