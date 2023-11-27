INSERT INTO public.states(id, label) VALUES (0, 'NONE');
INSERT INTO public.states(id, label) VALUES (1, 'DRAFT');
INSERT INTO public.states(id, label) VALUES (2, 'CANCELED');
INSERT INTO public.states(id, label) VALUES (3, 'REVISION');
INSERT INTO public.states(id, label) VALUES (4, 'CLAIMED');
INSERT INTO public.states(id, label) VALUES (6, 'VOTING');
INSERT INTO public.states(id, label) VALUES (7, 'ASSIGNED');
INSERT INTO public.states(id, label) VALUES (8, 'ACTIVE');
INSERT INTO public.states(id, label) VALUES (9, 'WAITING');
INSERT INTO public.states(id, label) VALUES (10, 'DONE');
INSERT INTO public.states(id, label) VALUES (11, 'IGNORED');
INSERT INTO public.states(id, label) VALUES (12, 'UNPAID');
INSERT INTO public.states(id, label) VALUES (19, 'REJECTED');
INSERT INTO public.states(id, label) VALUES (20, 'APPROVED');
	
/*
  0, "NONE",
  1, "DRAFT",   
  2, "CANCELED",   
  3, "REVISION",    
  4, "CLAIMED",   
  6, "VOTING",
  7, "ASSIGNED",
  8, "ACTIVE",
  9, "WAITING",
  10, "DONE",
  11, "IGNORED", // will not do this 
  12, "UNPAID", // payment transaction failed, reamins unpaid
  19, "REJECTED",   
  20, "APPROVED"
*/