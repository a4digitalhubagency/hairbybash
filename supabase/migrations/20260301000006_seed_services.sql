-- Migration 6: Seed real services with categories, pricing, and duration
-- Run after migration 2 (tables must exist)
-- Prices stored in cents. Duration in minutes (midpoint used for ranges).

insert into services (name, description, price, deposit_percentage, duration_minutes, category, image_url, active) values

-- ============ BRAIDS ============
(
  'French Curls',
  'Elegant knotless braids styled into beautiful French curls. A timeless protective style that combines braids with a curly finish for a luxurious look.',
  25000,
  20,
  540,  -- 8-10 hrs (midpoint ~9hrs)
  'Braids',
  '/images/services/FrenchCurls.webp',
  true
),
(
  'Medium Knotless Braids',
  'Classic medium-sized knotless braids. Lightweight, natural-looking and long-lasting. Price is for waist length — longer lengths have additional fees.',
  28000,
  20,
  360,  -- 5-7 hrs (midpoint ~6hrs)
  'Braids',
  '/images/services/MediumKnotlessBraids.webp',
  true
),
(
  'Medium Boho Braids',
  'Medium knotless braids with a bohemian finish — curly ends and wispy pieces for a free-spirited, effortless look that turns heads.',
  28000,
  20,
  480,  -- 8 hrs
  'Braids',
  '/images/services/MediumBohoBraids.webp',
  true
),

-- ============ LOCS ============
(
  'Microlocs Retwist',
  'Professional retwist service for your microlocs. Keeps your locs neat, defined, and healthy. Styling add-ons start at $30.',
  18000,
  20,
  120,  -- approx 2 hrs
  'Locs',
  '/images/services/MicroLocsRetwist.webp',
  true
),
(
  'Temporary Locs',
  'Get the loc look without the commitment. Beautiful temporary locs installed for a stunning protective style you can rock for months.',
  15000,
  20,
  240,  -- 4 hrs
  'Locs',
  '/images/services/TemporaryLocs.webp',
  true
),
(
  'Faux Locs',
  'Gorgeous faux locs that mimic the look of real locs. A versatile protective style that is lightweight and low maintenance.',
  25000,
  20,
  420,  -- 7 hrs
  'Locs',
  '/images/services/FauxLox.webp',
  true
),
(
  'Crochet Retwist',
  'Crochet technique used to retwist and refresh your locs efficiently. Leaves your locs looking fresh, defined, and beautifully maintained.',
  20000,
  20,
  240,  -- 4 hrs
  'Locs',
  '/images/services/CrotchetRetwist.webp',
  true
),

-- ============ TWISTS ============
(
  'Knotless Twist',
  'Large, statement knotless twists that are gentle on your scalp and edges. A bold and beautiful protective style with lasting results.',
  35000,
  20,
  540,  -- 8-10 hrs (midpoint ~9hrs)
  'Twists',
  '/images/services/KnotlessTwist.webp',
  true
),
(
  'Palmroll Twist',
  'Neat and polished palmroll twists that give a clean, defined finish. Ideal for maintaining and styling natural hair textures.',
  12000,
  20,
  180,  -- 3 hrs
  'Twists',
  '/images/services/PalmrollTwist.webp',
  true
),

-- ============ CORNROWS ============
(
  'Stitch Cornrows',
  'Clean and precise stitch cornrows with crisp lines and neat parts. A classic protective style that keeps your edges laid and your hair healthy.',
  8000,
  20,
  90,   -- 1 hr 30 mins
  'Cornrows',
  '/images/services/StitchCornrows.webp',
  true
);
