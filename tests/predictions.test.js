import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  thermalComfortIndex,
  shouldWearShorts,
  coffeeNeedScore,
  llmSanityCheck,
  motivationScore,
  predictOutfitText,
  marathonPerformance,
  chaosLevel,
  petReactionText,
  randomPizzaTopping,
  generateMemeText
} from '../js/prediction-logic.js';

describe('thermalComfortIndex', () => {
  it('returns higher TCI for warmer temperatures', () => {
    const hot = thermalComfortIndex(35, 50, 2);
    const cold = thermalComfortIndex(10, 50, 2);
    assert.ok(hot > cold, `Expected ${hot} > ${cold}`);
  });

  it('returns lower TCI with higher wind', () => {
    const calm = thermalComfortIndex(25, 50, 0);
    const windy = thermalComfortIndex(25, 50, 10);
    assert.ok(calm > windy, `Expected ${calm} > ${windy}`);
  });

  it('returns a number', () => {
    const result = thermalComfortIndex(23, 40, 2);
    assert.equal(typeof result, 'number');
    assert.ok(!isNaN(result));
  });
});

describe('shouldWearShorts', () => {
  it('recommends shorts in warm dry weather', () => {
    const result = shouldWearShorts(30, 40, 1, 'Sunny');
    assert.ok(result.message.includes('Shorts'));
  });

  it('does not recommend shorts in rain', () => {
    const result = shouldWearShorts(30, 40, 1, 'Rainy');
    assert.ok(result.message.includes('pants'));
  });

  it('does not recommend shorts when cold', () => {
    const result = shouldWearShorts(5, 80, 5, 'Sunny');
    assert.ok(result.message.includes('pants'));
  });
});

describe('coffeeNeedScore', () => {
  it('returns high need for sleep-deprived tired person', () => {
    const result = coffeeNeedScore(70, 3, 'Tired', 14);
    assert.ok(result.score > 2, `Expected score > 2, got ${result.score}`);
    assert.ok(result.message.includes('espresso'));
  });

  it('returns low need for well-rested person', () => {
    const result = coffeeNeedScore(80, 9, 'Happy', 8);
    assert.ok(result.score <= 2, `Expected score <= 2, got ${result.score}`);
  });
});

describe('llmSanityCheck', () => {
  it('marks high temperature + long prompts as hallucinating', () => {
    const result = llmSanityCheck(500, 2.0, 4096);
    assert.ok(result.includes('hallucinating'));
  });

  it('marks low temperature as stable', () => {
    const result = llmSanityCheck(50, 0.1, 100);
    assert.ok(result.includes('stable'));
  });
});

describe('motivationScore', () => {
  it('returns high motivation with sleep and few meetings', () => {
    const result = motivationScore(9, 0, 'Wednesday');
    assert.ok(result.includes('High'));
  });

  it('returns low motivation on Monday with many meetings', () => {
    const result = motivationScore(4, 8, 'Monday');
    assert.ok(result.includes('Low'));
  });
});

describe('predictOutfitText', () => {
  it('includes business top when zoom calls present', () => {
    const result = predictOutfitText(3, 1, 'Sunny');
    assert.ok(result.includes('Business top'));
  });

  it('adds raincoat for rainy weather', () => {
    const result = predictOutfitText(1, 1, 'Rainy');
    assert.ok(result.includes('Raincoat'));
  });

  it('returns pajamas with no zoom calls', () => {
    const result = predictOutfitText(0, 2, 'Sunny');
    assert.ok(result.includes('Pajamas'));
  });
});

describe('output format', () => {
  it('marathonPerformance returns a string with km', () => {
    const result = marathonPerformance(10, 'Beyonce');
    assert.ok(result.includes('km'));
    assert.ok(result.includes('min'));
  });

  it('chaosLevel returns a string with /10', () => {
    const result = chaosLevel(2, 23, 'Lo-fi');
    assert.ok(result.includes('/10'));
  });

  it('petReactionText includes the pet type', () => {
    const result = petReactionText('Dog');
    assert.ok(result.includes('Dog'));
  });

  it('randomPizzaTopping returns a pizza string', () => {
    const result = randomPizzaTopping();
    assert.ok(result.includes('Pizza'));
  });

  it('generateMemeText includes the framework', () => {
    const result = generateMemeText(5, 'TensorFlow');
    assert.ok(result.includes('TensorFlow'));
  });
});
