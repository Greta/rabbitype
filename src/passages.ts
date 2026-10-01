import type { Mode, Settings } from './session';

const WORDS =
  'rabbit meadow little garden morning quiet window gentle paper pencil color story wonder silver cloud light forest river wander listen bloom golden leaves honey velvet dream sunlight book moss soft trail acorn lantern moon pebble wild cozy drift shade steady playful bright find make grow time small warm open kind still green lift sweet rest walk learn smile begin hello today place world calm field heart home fresh rhythm around together simple clear'.split(
    ' ',
  );
const HOME_ROW =
  'as sad lad lads salad salads flask flasks fall falls lass half hall halls ash dash ask glass glad flag flags add dad has had all shall'.split(
    ' ',
  );
const TOP_ROW =
  'we were you your our out to too two try retry type writer typewriter quiet quite quote query queue power tower upper outer route wire tire trip ripe rope pore pour pure peer pier pie poet poetry pepper poppy puppy pretty proper property require'.split(
    ' ',
  );
// The bottom letter row has no vowels, so use short key drills instead of words.
const BOTTOM_ROW =
  'zx xc cv vb bn nm mz xz vc bv nb mn zxc xcv cvb vbn bnm mnb nbv bvc vcx cxz zxcv xcvb cvbn vbnm mnbv nbvc bvcx vcxz zxcvb xcvbn cvbnm mnbvc nbvcx bvcxz'.split(
    ' ',
  );
const WORD_BANKS: Record<Mode, string[]> = {
  words: WORDS,
  'home-row': HOME_ROW,
  'top-row': TOP_ROW,
  'bottom-row': BOTTOM_ROW,
};

export function generatePassage(settings: Settings, random = Math.random): string {
  const bank = WORD_BANKS[settings.mode];
  const words: string[] = [];
  for (let index = 0; index < settings.duration * 6; index++) {
    let pick = Math.min(bank.length - 1, Math.floor(random() * bank.length));
    if (bank[pick] === words.at(-1)) pick = (pick + 1) % bank.length;
    words.push(bank[pick]);
  }
  return words.join(' ');
}
