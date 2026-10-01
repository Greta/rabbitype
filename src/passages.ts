import type { Settings } from './session';

const WORDS =
  'rabbit meadow little garden morning quiet window gentle paper pencil color story wonder silver cloud light forest river wander listen bloom golden leaves honey velvet dream sunlight book moss soft trail acorn lantern moon pebble wild cozy drift shade steady playful bright find make grow time small warm open kind still green lift sweet rest walk learn smile begin hello today place world calm field heart home fresh rhythm around together simple clear'.split(
    ' ',
  );
const HOME_ROW =
  'as sad lad lads salad salads flask flasks fall falls lass half hall halls ash dash ask glass glad flag flags add dad has had all shall'.split(
    ' ',
  );

export function generatePassage(settings: Settings, random = Math.random): string {
  const bank = settings.mode === 'home-row' ? HOME_ROW : WORDS;
  const words: string[] = [];
  for (let index = 0; index < settings.duration * 6; index++) {
    let pick = Math.min(bank.length - 1, Math.floor(random() * bank.length));
    if (bank[pick] === words.at(-1)) pick = (pick + 1) % bank.length;
    words.push(bank[pick]);
  }
  return words.join(' ');
}
