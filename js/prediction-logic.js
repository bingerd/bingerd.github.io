/**
 * Pure computation functions for ML playground predictions.
 * No DOM access — these are testable in isolation.
 */

export function thermalComfortIndex(temp, humidity, wind) {
  const windFactor = -0.5 * wind;
  return temp - 0.55 * (1 - humidity / 100) * (temp - 14) + windFactor;
}

export function shouldWearShorts(temp, humidity, wind, condition) {
  const tci = thermalComfortIndex(temp, humidity, wind);
  const badWeather = ['rainy', 'storm', 'snow'].includes(condition.toLowerCase());
  const wear = tci >= 20 && !badWeather;
  return {
    tci,
    message: wear
      ? `TCI: ${tci.toFixed(1)}\u00B0C \u2192 Shorts! \uD83D\uDE0E`
      : `TCI: ${tci.toFixed(1)}\u00B0C \u2192 Maybe pants \uD83E\uDD76`
  };
}

export function coffeeNeedScore(heartRate, sleepHours, mood, hour) {
  const score = (80 - heartRate) / 10 + (8 - sleepHours) * 1.5 + (mood === 'Tired' ? 2 : 0) + (hour > 10 ? 1 : 0);
  return {
    score,
    message: score > 2 ? '\u2615 Triple espresso time!' : '\uD83D\uDE0C No coffee needed yet.'
  };
}

export function generateMemeText(stress, framework) {
  const memes = [
    `When ${framework} finally trains without exploding \uD83E\uDD2F`,
    `Debugging ${framework} at 3am \uD83E\uDDBE`,
    `${framework} model is hallucinating again \uD83C\uDF00`,
    `Me trying to vectorize my ${framework} code...`
  ];
  return memes[Math.floor(Math.random() * memes.length)];
}

export function predictOutfitText(zoomCalls, coffeeCups, weather) {
  let outfit = 'Pajamas all day \uD83E\uDE73';
  if (zoomCalls > 0) outfit = 'Business top, pajama bottom \uD83D\uDC54\uD83E\uDE73';
  if (weather.toLowerCase().includes('rain')) outfit += ' + Raincoat \uD83C\uDF27\uFE0F';
  return outfit;
}

export function motivationScore(sleepHours, meetings, day) {
  const score = sleepHours - meetings * 0.5 + (day.toLowerCase().includes('mon') ? -1 : 0);
  if (score > 5) return 'High motivation \u26A1';
  if (score > 3) return 'Moderate motivation \uD83D\uDE42';
  return 'Low motivation \uD83D\uDECC';
}

export function randomPizzaTopping() {
  const toppings = ['Pepperoni', 'Mushroom', 'Pineapple', 'Jalape\u00F1o', 'Extra cheese', 'Olives'];
  const choice = toppings[Math.floor(Math.random() * toppings.length)];
  return `Pizza topping for your mood: ${choice} \uD83C\uDF55`;
}

export function llmSanityCheck(promptLength, temperature, tokenCount) {
  const score = promptLength * 0.01 + temperature * 5 + tokenCount * 0.001;
  return score > 10 ? 'LLM is hallucinating \uD83C\uDF00' : 'LLM stable \u2705';
}

export function petReactionText(petType) {
  const reactions = ['Judgment intensifies \uD83D\uDE3E', 'Confused \uD83D\uDC36', 'Excited \uD83D\uDC15', 'Indifferent \uD83D\uDE3C'];
  const idx = Math.floor(Math.random() * reactions.length);
  return `${petType} reaction: ${reactions[idx]}`;
}

export function marathonPerformance(distance, playlist) {
  const pace = 5 + Math.random();
  const time = pace * distance;
  return `You'll run ${distance}km in ${time.toFixed(1)} min (~${pace.toFixed(1)} min/km) while listening to ${playlist} \uD83C\uDFB5`;
}

export function chaosLevel(coffee, commitHour, music) {
  const chaos = Math.min(10, coffee + Math.random() * 3 + (commitHour > 20 ? 1 : 0));
  return `Perf mode chaos level: ${chaos.toFixed(1)}/10 \uD83C\uDF08\uD83D\uDD25 (music: ${music})`;
}
