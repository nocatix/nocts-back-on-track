import { alcoholAddiction } from './alcohol';
import { cannabisAddiction } from './cannabis';
import { hardDrugsAddiction } from './hardDrugs';
import { nicotineAddiction } from './nicotine';
import { gamblingAddiction } from './gambling';
import { socialMediaAddiction } from './socialMedia';
import { doomscrollingAddiction } from './doomscrolling';
import { videoGamesAddiction } from './videoGames';
import { pornographyAddiction } from './pornography';
import { shoppingAddiction } from './shopping';
import { sugarAddiction } from './sugar';
import { coffeeAddiction } from './coffee';
import { overeatingAddiction } from './overeating';
import { otherAddiction } from './other';

export const addictionDatabase = {
  '🍺 Alcohol': alcoholAddiction,
  '🌿 Cannabis': cannabisAddiction,
  '💉 Hard Drugs': hardDrugsAddiction,
  '🚬 Nicotine': nicotineAddiction,
  '🎰 Gambling': gamblingAddiction,
  '📱 Social Media': socialMediaAddiction,
  '📰 Doomscrolling': doomscrollingAddiction,
  '🎮 Video Games': videoGamesAddiction,
  '🔞 Pornography': pornographyAddiction,
  '🛍️ Shopping': shoppingAddiction,
  '🍬 Sugar': sugarAddiction,
  '☕ Coffee': coffeeAddiction,
  '🍽️ Overeating': overeatingAddiction,
  '❓ Other': otherAddiction,
};

export const getAddictionData = (addictionName) => {
  return addictionDatabase[addictionName];
};

export const getWithdrawalTips = (addictionName, dayNum) => {
  const addiction = getAddictionData(addictionName);
  if (!addiction) return null;
  
  const dayKey = dayNum <= 1 ? 'day1' : dayNum <= 3 ? 'day3' : dayNum <= 7 ? 'day7' : dayNum <= 14 ? 'day14' : dayNum <= 30 ? 'day30' : dayNum <= 60 ? 'day60' : dayNum <= 90 ? 'day90' : 'day365';
  
  return addiction.withdrawalTimeline[dayKey];
};
