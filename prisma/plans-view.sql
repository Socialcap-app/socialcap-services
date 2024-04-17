-- View: public.plans_view

DROP VIEW public.plans_view;

CREATE OR REPLACE VIEW public.plans_view
 AS
 SELECT pl.uid,
    pl.name,
    pl.description,
    pl.image,
    pl.alias,
    pl.state,
    st.label AS state_descr,
    pl.created_utc,
    pl.updated_utc,
    pl.approved_utc,
	pl.starts_utc,
	pl.ends_utc,
	pl.available,
	pl.total,
	pl.fee,
    cm.name AS community,
    cm.uid AS community_uid,
    concat(cm.xadmins, ',', cm.admin_uid) AS admins
   FROM communities cm,
    plans pl,
    states st
  WHERE pl.state = st.id AND cm.uid = pl.community_uid;

ALTER TABLE public.plans_view
    OWNER TO postgres;
