-- LOE v1.2 §2 — nested service taxonomy.
--
-- Replaces the flat `services.category` text column with a real categories
-- table. Categories are navigation only, never bookable: the client picks a
-- category, then a sub-category, then a date. Price, duration and description
-- live on the sub-category, which is a row in `services`.
--
-- Sub-category names are NOT globally unique. "Stitch braids" exists under both
-- Cornrows and Men at different prices, as does "Box braids". Uniqueness is on
-- (category_id, name).
--
-- Nothing is deleted. 39 bookings reference 9 services under `on delete
-- restrict`, so obsolete rows are deactivated rather than removed. Bash can
-- reactivate or re-price anything from the admin panel.
--
-- The legacy `services.category` text column is kept in sync deliberately so
-- the current UI keeps working between this migration and the front-end
-- rewrite. Drop it in a follow-up once nothing reads it.

begin;

-- ── Categories ──────────────────────────────────────────────────────────────

create table categories (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  description   text,
  image_url     text,
  display_order integer not null default 0,
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

create index categories_active_idx on categories(active);
create index categories_order_idx  on categories(display_order);

alter table categories enable row level security;

-- The booking flow and landing page read categories with the anon key.
create policy "Public read active categories"
  on categories for select
  using (active = true);

insert into categories (name, slug, description, display_order) values
  ('Braids',      'braids',     'Protective braided styles, from box braids to mermaid braids.',       1),
  ('Twists',      'twists',     'Two-strand and knotless twists in every size.',                       2),
  ('Locs',        'locs',       'Microlocs, sister locs and instant locs — installs and maintenance.',  3),
  ('Faux Locs',   'faux-locs',  'The loc look without the commitment.',                                4),
  ('Cornrows',    'cornrows',   'Fulani, ponytail, stitch and wig-prep cornrows.',                     5),
  ('Men',         'men',        'Braids, twists and locs styled for men.',                             6),
  ('Kids (5–14)', 'kids',       'Gentle protective styling for ages 5 to 14.',                         7),
  ('Other',       'other',      'Crochet, weave sew-ins and Bantu knots.',                             8);

-- ── Link services to categories ─────────────────────────────────────────────

alter table services
  add column category_id uuid references categories(id) on delete restrict;

create index services_category_id_idx on services(category_id);

-- ── Re-home the 12 existing services that map onto the new taxonomy ─────────
-- Names are normalised to the LOE wording. Prices and durations are untouched:
-- these are Bash's real numbers.

update services set name = 'French curls',    category = 'Braids',    category_id = (select id from categories where slug = 'braids')    where name = 'French Curls';
update services set name = 'Boho braids',     category = 'Braids',    category_id = (select id from categories where slug = 'braids')    where name = 'Medium Boho Braids';
update services set name = 'Knotless braids', category = 'Braids',    category_id = (select id from categories where slug = 'braids')    where name = 'Medium Knotless Braids';
update services set name = 'Knotless twists', category = 'Twists',    category_id = (select id from categories where slug = 'twists')    where name = 'Knotless Twist';
update services set name = 'Stitch braids',   category = 'Cornrows',  category_id = (select id from categories where slug = 'cornrows')  where name = 'Stitch Cornrows';
update services set name = 'Microlocs',       category = 'Locs',      category_id = (select id from categories where slug = 'locs')      where name = 'Microlocs Install';
update services set name = 'Faux locs',       category = 'Faux Locs', category_id = (select id from categories where slug = 'faux-locs') where name = 'Faux Locs';
update services set name = 'Temporary locs',  category = 'Men',       category_id = (select id from categories where slug = 'men')       where name = 'Temporary Locs';
update services set name = 'Braids',          category = 'Kids',      category_id = (select id from categories where slug = 'kids')      where name = 'Kids Braids';
update services set name = 'Crochet',         category = 'Other',     category_id = (select id from categories where slug = 'other')     where name = 'Crochet method Retwist';

-- Two live services have no home in the LOE list. Neither is dropped — each is
-- filed under its closest category as an extra sub-category, so Bash can move
-- or hide them from the admin panel rather than losing them here.
--   Palmroll Twist  — a real $120 service, simply absent from the new list.
--   Free Loc Consult — she has confirmed it stays free; note it is unbookable
--                      at $0 (Stripe cannot charge a deposit under 50c).
update services set name = 'Palmroll twists',  category = 'Twists', category_id = (select id from categories where slug = 'twists') where name = 'Palmroll Twist';
update services set name = 'Free loc consult', category = 'Locs',   category_id = (select id from categories where slug = 'locs')   where name = 'Free Loc Consult';

-- ── Retire the junk rows ────────────────────────────────────────────────────
-- Filed under Other and hidden. Kept because bookings may reference them.
--   'kids Braids'      — case-duplicate of 'Kids Braids'
--   'Microlocs Retwist' — overlaps 'Microlocs Install', now 'Microlocs'
--   'Added New', 'Test Braid' — test rows
update services
set active      = false,
    category    = 'Other',
    category_id = (select id from categories where slug = 'other')
where name in ('kids Braids', 'Microlocs Retwist', 'Added New', 'Test Braid');

-- ── Insert the 21 remaining sub-categories ──────────────────────────────────
-- Prices and durations are placeholders chosen to sit sensibly alongside Bash's
-- existing numbers. She will adjust them in the admin panel. Every duration is
-- under the 780-minute open day, so all are bookable on day one.

insert into services (name, description, price, deposit_percentage, duration_minutes, category, category_id, active) values
  -- Braids
  ('Box braids',          'Classic box braids in your choice of size and length.',                   26000, 20, 420, 'Braids',    (select id from categories where slug = 'braids'),    true),
  ('Goddess braids',      'Braids finished with soft curly pieces for a romantic look.',              27000, 20, 480, 'Braids',    (select id from categories where slug = 'braids'),    true),
  ('Mermaid braids',      'Long, flowing braids with a wavy finish.',                                 29000, 20, 540, 'Braids',    (select id from categories where slug = 'braids'),    true),

  -- Twists
  ('Regular twists',      'Two-strand twists, neat and low maintenance.',                             18000, 20, 300, 'Twists',    (select id from categories where slug = 'twists'),    true),
  ('Kinky twists',        'Textured twists with a natural, coily finish.',                            20000, 20, 360, 'Twists',    (select id from categories where slug = 'twists'),    true),
  ('Mini twist',          'Fine, densely packed twists — long lasting and versatile.',                32000, 20, 600, 'Twists',    (select id from categories where slug = 'twists'),    true),
  ('Boho twists',         'Twists with wispy curly ends for an effortless look.',                     28000, 20, 480, 'Twists',    (select id from categories where slug = 'twists'),    true),

  -- Locs
  ('Sister locs',         'Fine, uniform locs installed with precision. A full-day service.',         50000, 30, 600, 'Locs',      (select id from categories where slug = 'locs'),      true),
  ('Instant locs',        'Locs formed and set in a single sitting.',                                 35000, 30, 420, 'Locs',      (select id from categories where slug = 'locs'),      true),

  -- Faux Locs
  ('Faux loc twists',     'Faux locs finished with a twisted texture.',                               26000, 20, 420, 'Faux Locs', (select id from categories where slug = 'faux-locs'), true),

  -- Cornrows
  ('Fulani braids',       'Cornrows in the Fulani tradition, with beads on request.',                 12000, 20, 180, 'Cornrows',  (select id from categories where slug = 'cornrows'),  true),
  ('Ponytail cornrows',   'Cornrows gathered into a sleek ponytail.',                                  9000, 20, 120, 'Cornrows',  (select id from categories where slug = 'cornrows'),  true),
  ('Cornrows for wigs',   'Flat, even braid-down to prepare for a wig install.',                        6000, 20,  90, 'Cornrows',  (select id from categories where slug = 'cornrows'),  true),

  -- Men
  ('Stitch braids',       'Clean stitch braids with crisp parts.',                                     6000, 20,  90, 'Men',       (select id from categories where slug = 'men'),       true),
  ('Box braids/Twists',   'Box braids or two-strand twists, your choice on the day.',                  8000, 20, 150, 'Men',       (select id from categories where slug = 'men'),       true),

  -- Kids (5–14)
  ('Cornrows',            'Neat cornrows sized and styled for children.',                              6000, 20, 120, 'Kids',      (select id from categories where slug = 'kids'),      true),
  ('Half cornrows styles','Cornrows at the front with the rest left loose or styled.',                  7000, 20, 150, 'Kids',      (select id from categories where slug = 'kids'),      true),
  ('Twists',              'Gentle two-strand twists for younger hair.',                                 9000, 20, 210, 'Kids',      (select id from categories where slug = 'kids'),      true),
  ('Locs',                'Loc maintenance and styling for children.',                                 10000, 20, 240, 'Kids',      (select id from categories where slug = 'kids'),      true),

  -- Other
  ('Weave sew-in',        'Full sew-in weave install with a braided foundation.',                      15000, 20, 180, 'Other',     (select id from categories where slug = 'other'),     true),
  ('Bantu knots',         'Coiled Bantu knots — wear as knots or unravel for a knot-out.',              7000, 20, 120, 'Other',     (select id from categories where slug = 'other'),     true);

-- ── Constraints, applied once the data is clean ─────────────────────────────

alter table services
  add constraint services_category_name_unique unique (category_id, name);

commit;
