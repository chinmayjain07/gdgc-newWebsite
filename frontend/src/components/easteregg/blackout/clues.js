/**
 * Predefined fictional story data for BLACKOUT.
 * All content is predefined — no AI/API calls happen inside the game.
 * The facility is entirely fictional. No real-world facility is represented.
 */

export const KEYPAD_CODE = '0243';

export const CLUES = [
  {
    id: 'access-log',
    code: '01',
    title: 'Corrupted Access Log',
    location: 'Security Checkpoint',
    detail:
      'LOG FRAGMENT RECOVERED:\n02:13 CARD #7741 GRANTED — MAIN GATE\n02:15 POWER BUS A :: TRIPPED\n02:17 LIGHTS FAILURE — SUB-LEVEL 3\n02:17 ENTRY — NO CARD ON RECORD',
  },
  {
    id: 'access-card',
    code: '02',
    title: 'Discarded Access Card',
    location: 'Security Checkpoint',
    detail:
      'ID BADGE:\nR. VEER — FACILITIES & MAINTENANCE\nLAST USE: 02:17:41 — NODE 43\nSTATUS: FLAGGED',
  },
  {
    id: 'note',
    code: '03',
    title: 'Handwritten Note',
    location: 'Research Laboratory',
    detail:
      '"Breaker tripped again. Restore it from the LAB PANEL before the maglocks drain the reserve.\n\nControl room override = hour of the failure + node. You know both by now."\n\n— V',
  },
  {
    id: 'camera',
    code: '04',
    title: 'Camera Timestamp',
    location: 'Main Corridor — CAM 04',
    detail:
      'CAM 04 :: NODE 43\nRECORDING 02:18:31\n\nThe feed loops every 90 seconds.\nTimestamp jumps from 02:18:31 back to 02:17:00.\nSomeone is overwriting the archive.',
  },
  {
    id: 'message',
    code: '05',
    title: 'Terminal Message',
    location: 'Research Laboratory',
    detail:
      'DRAFT — NEVER SENT:\n\n"They told us to keep the lights on.\nNobody said anything about the data."\n\nOUTBOX: EMPTY. DRAFTS: PURGED.',
  },
  {
    id: 'data-drive',
    code: '06',
    title: 'Data Drive',
    location: 'Storage',
    detail:
      'PARTIAL DUMP — 76%\nROUTED THROUGH NODE 43\nORIGIN: INTERNAL SUBNET\nDESTINATION: UNKNOWN',
  },
  {
    id: 'server-log',
    code: '07',
    title: 'Damaged Server Log',
    location: 'Server Room',
    detail:
      'RACK B-7 :: SCORCHED\n02:17:43 CONNECT UNKNOWN\nROUTE ESTABLISHED :: NODE 43\nPHYSICAL ACCESS DETECTED — BAY 2',
  },
  {
    id: 'archive',
    code: '08',
    title: 'Security Recording',
    location: 'Control Room',
    detail:
      'ARCHIVE PLAYBACK — 02:17:43\n\nA figure stands at NODE 43 in Bay 2.\nBadge raised: R. VEER.\nACCESS GRANTED 02:17:41.\n\nThe figure looks directly into CAM 04.\nThen the feed loops.',
  },
];

export const CAMERAS = {
  cam04: {
    id: 'cam04',
    label: 'CAM 04',
    time: '02:18:31',
    node: 'NODE 43',
    lines: [
      'FEED: MAIN CORRIDOR — SOUTH',
      'LOOP DETECTED — 90s CYCLE',
      'ARCHIVE BUFFER: OVERWRITTEN',
    ],
  },
  archive: {
    id: 'archive',
    label: 'ARCHIVE 02:17:43',
    time: '02:17:43',
    node: 'NODE 43 — BAY 2',
    lines: [
      'FIGURE AT NODE 43',
      'BADGE: R. VEER',
      'ACCESS GRANTED 02:17:41',
      'FEED TERMINATES',
    ],
  },
};

export const ENDING_SEQUENCE = [
  { text: 'DATA EXTRACTION SOURCE IDENTIFIED', delay: 0, hold: 2200 },
  { text: 'SOURCE: NODE 43 — INTERNAL', delay: 2200, hold: 2000 },
  { text: 'TRACE COMPLETE', delay: 4200, hold: 1800 },
  { text: 'DATA BREACH CONTAINED', delay: 6000, hold: 2000 },
  { text: 'BLACKOUT PROTOCOL COMPLETE', delay: 8000, hold: 2200 },
];

export const FINAL_TITLE = ['YOU FOUND WHAT', "WASN'T MEANT TO BE FOUND."];

export const FINAL_BRAND = 'GDGC PCCOE';

export const FACILITY_NAME = 'SUBTERRA-7 RESEARCH ANNEX';

export const AREA_LABELS = {
  checkpoint: 'SECURITY CHECKPOINT',
  corridor: 'MAIN CORRIDOR — SUB-LEVEL 3',
  lab: 'RESEARCH LABORATORY',
  storage: 'STORAGE',
  maintenance: 'MAINTENANCE TUNNEL',
  datacenter: 'DATA CENTER',
  serverroom: 'SERVER ROOM',
  controlroom: 'CONTROL ROOM',
  finalchamber: 'FINAL SERVER CHAMBER',
};

export function areaAt(x, z) {
  if (x >= -5 && x <= 5 && z >= 15 && z <= 25) return 'checkpoint';
  if (x >= -3 && x <= 3 && z >= -16 && z <= 15) return 'corridor';
  if (x >= -17 && x <= -3 && z >= 2 && z <= 12) return 'lab';
  if (x >= -17 && x <= -3 && z >= -12 && z <= -2) return 'storage';
  if (x >= 3 && x <= 9 && z >= -4 && z <= 10) return 'maintenance';
  if (x >= 3 && x <= 15 && z >= -14 && z <= -4) return 'datacenter';
  if (x >= -3 && x <= 9 && z >= -26 && z <= -16) return 'serverroom';
  if (x >= 9 && x <= 19 && z >= -26 && z <= -16) return 'controlroom';
  if (x >= -13 && x <= -3 && z >= -26 && z <= -16) return 'finalchamber';
  return 'corridor';
}
