# Parlo Illustration Style Guide

## Purpose

Illustrations establish a communicative situation before instruction begins. They should clarify place, relationship, time, and action without decorating every screen or replacing accessible text.

## Canonical visual language

- Polished flat 2D editorial illustration for adults.
- Rounded geometric forms, clean expressive linework, and restrained paper grain.
- Warm cream environments with Parlo purple (`#6d28d9`) used as an accent rather than a full background.
- Supporting palette: muted teal, mustard, coral, lavender, navy, and warm neutral skin tones.
- Natural expressions and realistic adult proportions; never childish mascots or exaggerated caricatures.
- Calm compositions that remain legible in a card and permit responsive center-cropping.
- No embedded instructional text, speech bubbles, flags, logos, or decorative stereotypes.

## Recurring Unit 1 characters

### Sofia

- Young adult woman with medium-brown skin and dark, curly shoulder-length hair.
- Mustard jacket, navy trousers, coral tote, and purple notebook.
- Curious, confident, friendly body language.

### Ira

- Indian woman in her late twenties with a light warm-brown skin tone, warm golden undertones, warm brown eyes, and long dark hair in a loose low braid.
- Muted-teal overshirt, cream top, charcoal trousers, and navy notebook.
- Warm, attentive, relaxed body language.

### Camille

- French woman in her early thirties with fair warm skin, hazel eyes, and a neat chin-length chestnut-brown bob.
- Lavender knit top, navy trousers, and small simple earrings.
- Patient, observant, encouraging body language.

### Maya

- North African–French woman in her late twenties with warm olive-brown skin, dark brown eyes, a longer angular face, straight eyebrows, and shoulder-length dark wavy hair worn loose with a clean side part.
- Muted coral cardigan, cream top, and charcoal trousers.
- Small geometric gold earrings and a slightly tall, angular silhouette.
- Curious, expressive, attentive body language.

### Ana

- Latin American woman in her early thirties with medium warm tan skin, dark almond-shaped eyes, a softly rounded face, and a sleek jaw-length black bob tucked behind one ear.
- Muted teal wrap-style blouse, warm beige trousers, and small coral stud earrings.
- Energetic, considerate body language.

### Sam

- Indian man in his early thirties with medium warm-brown skin and golden undertones, dark brown eyes, a long rectangular face, short neatly textured black hair, and a close-trimmed beard and moustache.
- Mustard overshirt, navy crew-neck shirt, and charcoal trousers.
- Calm, welcoming body language.

### Alex

- French man in his late twenties with fair neutral skin, light freckles, blue-grey eyes, an oval face, short tousled sandy-blond hair, and thin round navy glasses.
- Muted rust sweater over a pale blue collared shirt and dark teal trousers.
- Thoughtful, slightly tentative body language.

### Morgan

- French non-binary adult in their early thirties with medium neutral-brown skin, dark eyes, a defined angular face, and short tight dark curls with neatly tapered sides.
- Soft lavender overshirt, mustard T-shirt, charcoal trousers, and a slim watch.
- Calm, grounded, encouraging body language.

Recurring characters' appearance and wardrobe remain stable throughout Unit 1. New scenes change pose, expression, props, and setting—not identity-defining features.

## Scene template

Every generation brief records:

1. Learning function and exact communicative moment.
2. Named recurring characters and locked appearance details.
3. Environment, time of day, and only pedagogically relevant props.
4. Canonical style, palette, framing, and crop-safe region.
5. Explicit exclusions: text, logos, watermark, stereotypes, photorealism, and childish styling.
6. Accessibility description and content review status.

## Asset rules

- Landscape lesson scenes use a 3:2 master and must survive a one-column mobile crop.
- Filenames are stable and versioned: `{lesson}-{moment}-v{revision}.png`.
- Each asset receives a stable media ID and is referenced by activities through the content bundle.
- Published images require linguistic, pedagogical, and accessibility approval plus an accessibility description.
- Visual meaning is repeated in dialogue, instructions, or alt text; answering never depends only on seeing an image.

## Canonical Lesson 1 prompt

The approved scene uses the `illustration-story` prompt family: Sofia and Ira arriving outside a neighborhood language school in soft morning light, rendered in the canonical editorial style and palette. It is stored as `public/images/course/a1/unit-01/greetings-arrival-v3.png` and registered as `media.image.a1.u01.l01.arrival.v3`.

## Lesson 3 prompt record

The Lesson 3 scene uses the `illustration-story` prompt family: Camille models a French sound with a picture card while Maya listens and mirrors the mouth shape in a bright neighborhood language-school classroom. The scene follows the canonical editorial style and palette, keeps both characters crop-safe, and contains no instructional text. The revised Maya design is stored as `public/images/course/a1/unit-01/core-sound-workshop-v2.png` and registered as `media.image.a1.u01.l03.sound-workshop.v2`.

## Lesson 4 prompt record

The Lesson 4 scene uses the `illustration-story` prompt family: Ana arrives at a neighborhood language-school classroom and politely receives a handout from Sam. The centered handout exchange establishes the communicative purpose without embedded text. The approved, subtly lighter Sam design is stored as `public/images/course/a1/unit-01/courtesy-handout-v2.png` and registered as `media.image.a1.u01.l04.handout.v2`.

## Lesson 5 prompt record

The Lesson 5 scene uses the `illustration-story` prompt family: Alex pauses to ask for clarification while Morgan responds with an open, reassuring gesture. It frames communication repair as normal and welcome. It is stored as `public/images/course/a1/unit-01/classroom-repair-v1.png` and registered as `media.image.a1.u01.l05.classroom-repair.v1`.
