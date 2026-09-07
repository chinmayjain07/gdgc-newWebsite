# Blackout Asset Pipeline

The BLACKOUT experience is **fully procedural** — it needs none of these
files to work. Every texture is generated on canvas, every sound is
synthesized via Web Audio, and the cinematic intro is rendered as a
live canvas sequence.

This directory exists so **real assets can be dropped in later without
touching code** (except the two integration points noted below).

## Layout

```
public/blackout/
  video/
    blackout-intro.mp4          # desktop cinematic (H.264, 1920x1080, <=20MB)
    blackout-intro-mobile.mp4   # mobile cinematic (H.264, 960x540, <=8MB)
  models/
    facility/                   # GLB props (drop-in requires code hook)
    props/
    clues/
  textures/
    concrete/                   # *_albedo.jpg, *_normal.jpg, *_roughness.jpg
    metal/
    glass/
    screens/
  audio/
    ambience/                   # facility-loop.ogg (loopable, <=2MB)
    effects/
    music/
  images/
    loading/
    posters/
```

## Integration points

1. **Video intro** — `CinematicIntro.jsx` renders the procedural cinematic.
   To use real footage: replace the canvas with the `<video>` element
   (already present but hidden) pointing at `/blackout/video/blackout-intro.mp4`,
   and fire `onComplete` on the video `ended` event. The last shot must
   end zooming into a doorway to match the game's opening corridor.

2. **Textures** — pass loaded `THREE.TextureLoader` results into
   `Facility`'s materials where `getConcreteTexture()` etc. are used
   in `Textures.js`.

3. **Audio** — replace `blackoutAudio` synth calls in `Ambience.js`
   with buffer playback from `/blackout/audio/...`.

## AI video generation prompts

Use these with any video-generation system. All facilities depicted are
completely fictional.

PROMPT 1 (exterior):
"Photorealistic cinematic establishing shot of a completely fictional
underground high-security research facility at night, remote mountainous
environment, light rain, realistic concrete and steel architecture,
subtle fog, security lights, cinematic 35mm camera, physically realistic
lighting, volumetric atmosphere, realistic materials, high dynamic range,
serious cyber-thriller tone, slow camera movement, no people, no logos,
no recognizable real-world facility identifiers."

PROMPT 2 (corridor):
"Photorealistic cinematic interior of a fictional underground research
facility corridor, industrial concrete walls, steel doors, pipes,
ventilation ducts, cables, fluorescent ceiling lights, subtle
condensation, realistic dirt and wear, emergency red lights beginning
to activate, atmospheric fog, cinematic depth of field, realistic
shadows, AAA game environment quality, slow tracking camera,
cyber-thriller atmosphere."

PROMPT 3 (server room):
"Photorealistic fictional underground server room, hundreds of modern
server racks, blinking LEDs, cooling systems, realistic metal and
concrete materials, subtle volumetric haze, cinematic lighting, several
systems suddenly shutting down, emergency lighting activating, realistic
reflections, high-end cinematic science-fiction thriller, no real
company logos."

PROMPT 4 (control room):
"Photorealistic fictional control room inside an underground research
facility, multiple computer monitors, industrial desks, realistic cables
and equipment, security displays, one monitor showing an abstract
fictional data-transfer warning, cinematic dark lighting, subtle screen
glow illuminating nearby surfaces, realistic materials, film-quality
cyber-thriller cinematography."

## Safety

- The facility is fictional ("SUBTERRA-7"). Do not model or film any
  real-world sensitive facility.
- No real security procedures, no real infrastructure layouts.
