-- WIP --
/*  SELECT 
    (select count(*) from members where community_uid=cm.uid) as count_members,
    (select count(*) from claims where community_uid=cm.uid) as count_claims,
    (select count(*) from credentials where community_uid=cm.uid) as count_credentials,
    (select role from members where community_uid=cm.uid and person_uid='ec3c6e254d0b42debd939d9a7bd7dddd') as has_role,
	(CASE WHEN (cm.admin_uid = 'ec3c6e254d0b42debd939d9a7bd7dddd' OR cm.xadmins ilike '%ec3c6e254d0b42debd939d9a7bd7dddd%') THEN true ELSE false END) as is_admin,
    cm.*
  FROM communities cm;
  --WHERE cm.uid = ${uid}; 
*/
SELECT 
  COUNT(mem.uid) AS count_members,
  COUNT(clm.uid) AS count_claims,
  COUNT(cred.uid) AS count_credentials,
  MAX(CASE WHEN mem.person_uid = 'ec3c6e254d0b42debd939d9a7bd7dddd' THEN mem.role ELSE NULL END) AS has_role,
  (CASE WHEN (cm.admin_uid = 'ec3c6e254d0b42debd939d9a7bd7dddd' OR cm.xadmins ilike '%ec3c6e254d0b42debd939d9a7bd7dddd%') THEN true ELSE false END) as is_admin,
  cm.*
FROM communities cm
LEFT JOIN members mem ON cm.uid = mem.community_uid
LEFT JOIN claims clm ON cm.uid = clm.community_uid
LEFT JOIN credentials cred ON cm.uid = cred.community_uid
GROUP BY cm.uid; 