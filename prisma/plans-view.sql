DROP VIEW public.plans_view;

CREATE OR REPLACE VIEW public.plans_view
 AS
 SELECT pl.*,
    '' AS banner,
    st.label AS state_descr,
    cm.name AS community,
    cm.image AS community_image,
    concat(cm.xadmins, ',', cm.admin_uid) AS admins
  FROM communities cm,
    plans pl,
    states st
  WHERE pl.state = st.id AND cm.uid = pl.community_uid;

ALTER TABLE public.plans_view
    OWNER TO postgres;