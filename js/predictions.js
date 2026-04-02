/* ==== PREDICTION ENDPOINTS ==== */

/**
 * Generic prediction runner with input validation.
 * Reads DOM inputs, validates, calls predict function, writes output.
 */
const ENDPOINTS = {
  shorts: {
    inputs: [
      { id: 'shorts-temp', type: 'number', fallback: 23 },
      { id: 'shorts-humidity', type: 'number', fallback: 40 },
      { id: 'shorts-wind', type: 'number', fallback: 2 },
      { id: 'shorts-condition', type: 'text', fallback: 'Sunny' }
    ],
    output: 'shorts-output',
    predict: function (vals) {
      var temp = vals[0], humidity = vals[1], wind = vals[2], condition = vals[3];
      var tci = thermalComfortIndex(temp, humidity, wind);
      var badWeather = ['rainy', 'storm', 'snow'].indexOf(condition.toLowerCase()) !== -1;
      var wear = tci >= 20 && !badWeather;
      return wear
        ? 'TCI: ' + tci.toFixed(1) + '\u00B0C \u2192 Shorts! \uD83D\uDE0E'
        : 'TCI: ' + tci.toFixed(1) + '\u00B0C \u2192 Maybe pants \uD83E\uDD76';
    }
  },
  coffee: {
    inputs: [
      { id: 'coffee-hr', type: 'number', fallback: 70 },
      { id: 'coffee-sleep', type: 'number', fallback: 6 },
      { id: 'coffee-mood', type: 'text', fallback: 'Neutral' },
      { id: 'coffee-hour', type: 'number', fallback: 14 }
    ],
    output: 'coffee-output',
    predict: function (vals) {
      var hr = vals[0], sleep = vals[1], mood = vals[2], hour = vals[3];
      var score = (80 - hr) / 10 + (8 - sleep) * 1.5 + (mood === 'Tired' ? 2 : 0) + (hour > 10 ? 1 : 0);
      return score > 2 ? '\u2615 Triple espresso time!' : '\uD83D\uDE0C No coffee needed yet.';
    }
  },
  meme: {
    inputs: [
      { id: 'meme-stress', type: 'number', fallback: 5 },
      { id: 'meme-framework', type: 'text', fallback: 'PyTorch' }
    ],
    output: 'meme-output',
    predict: function (vals) {
      var fw = vals[1];
      var memes = [
        'When ' + fw + ' finally trains without exploding \uD83E\uDD2F',
        'Debugging ' + fw + ' at 3am \uD83E\uDDBE',
        fw + ' model is hallucinating again \uD83C\uDF00',
        'Me trying to vectorize my ' + fw + ' code...'
      ];
      return memes[Math.floor(Math.random() * memes.length)];
    }
  },
  outfit: {
    inputs: [
      { id: 'outfit-zoom', type: 'number', fallback: 2 },
      { id: 'outfit-coffee', type: 'number', fallback: 1 },
      { id: 'outfit-weather', type: 'text', fallback: 'Sunny' }
    ],
    output: 'outfit-output',
    predict: function (vals) {
      var zoom = vals[0], _coffee = vals[1], weather = vals[2];
      var outfit = 'Pajamas all day \uD83E\uDE73';
      if (zoom > 0) outfit = 'Business top, pajama bottom \uD83D\uDC54\uD83E\uDE73';
      if (weather.toLowerCase().indexOf('rain') !== -1) outfit += ' + Raincoat \uD83C\uDF27\uFE0F';
      return outfit;
    }
  },
  motivation: {
    inputs: [
      { id: 'motivation-day', type: 'text', fallback: 'Monday' },
      { id: 'motivation-sleep', type: 'number', fallback: 7 },
      { id: 'motivation-meetings', type: 'number', fallback: 2 }
    ],
    output: 'motivation-output',
    predict: function (vals) {
      var day = vals[0], sleep = vals[1], meetings = vals[2];
      var score = sleep - meetings * 0.5 + (day.toLowerCase().indexOf('mon') !== -1 ? -1 : 0);
      if (score > 5) return 'High motivation \u26A1';
      if (score > 3) return 'Moderate motivation \uD83D\uDE42';
      return 'Low motivation \uD83D\uDECC';
    }
  },
  pizza: {
    inputs: [
      { id: 'pizza-mood', type: 'text', fallback: 'Happy' },
      { id: 'pizza-hour', type: 'number', fallback: 19 },
      { id: 'pizza-weather', type: 'text', fallback: 'Sunny' }
    ],
    output: 'pizza-output',
    predict: function (_vals) {
      var toppings = ['Pepperoni', 'Mushroom', 'Pineapple', 'Jalape\u00F1o', 'Extra cheese', 'Olives'];
      var choice = toppings[Math.floor(Math.random() * toppings.length)];
      return 'Pizza topping for your mood: ' + choice + ' \uD83C\uDF55';
    }
  },
  llm: {
    inputs: [
      { id: 'llm-prompt', type: 'number', fallback: 100 },
      { id: 'llm-temp', type: 'number', fallback: 0.7 },
      { id: 'llm-tokens', type: 'number', fallback: 512 }
    ],
    output: 'llm-output',
    predict: function (vals) {
      var prompt = vals[0], temp = vals[1], tokens = vals[2];
      var score = prompt * 0.01 + temp * 5 + tokens * 0.001;
      return score > 10 ? 'LLM is hallucinating \uD83C\uDF00' : 'LLM stable \u2705';
    }
  },
  pet: {
    inputs: [
      { id: 'pet-type', type: 'text', fallback: 'Cat' },
      { id: 'pet-haircut', type: 'text', fallback: 'Short' },
      { id: 'pet-color', type: 'text', fallback: 'Brown' }
    ],
    output: 'pet-output',
    predict: function (vals) {
      var pet = vals[0];
      var reactions = ['Judgment intensifies \uD83D\uDE3E', 'Confused \uD83D\uDC36', 'Excited \uD83D\uDC15', 'Indifferent \uD83D\uDE3C'];
      return pet + ' reaction: ' + reactions[Math.floor(Math.random() * reactions.length)];
    }
  },
  marathon: {
    inputs: [
      { id: 'marathon-distance', type: 'number', fallback: 10 },
      { id: 'marathon-playlist', type: 'text', fallback: 'Beyonc\u00E9' },
      { id: 'marathon-hydration', type: 'number', fallback: 3 },
      { id: 'marathon-weather', type: 'text', fallback: 'Sunny' }
    ],
    output: 'marathon-output',
    predict: function (vals) {
      var dist = vals[0], playlist = vals[1];
      var pace = 5 + Math.random();
      var time = pace * dist;
      return "You'll run " + dist + 'km in ' + time.toFixed(1) + ' min (~' + pace.toFixed(1) + ' min/km) while listening to ' + playlist + ' \uD83C\uDFB5';
    }
  },
  chaos: {
    inputs: [
      { id: 'chaos-coffee', type: 'number', fallback: 2 },
      { id: 'chaos-commit', type: 'number', fallback: 23 },
      { id: 'chaos-music', type: 'text', fallback: 'Lo-fi' }
    ],
    output: 'chaos-output',
    predict: function (vals) {
      var coffee = vals[0], commit = vals[1], music = vals[2];
      var chaos = Math.min(10, coffee + Math.random() * 3 + (commit > 20 ? 1 : 0));
      return 'Perf mode chaos level: ' + chaos.toFixed(1) + '/10 \uD83C\uDF08\uD83D\uDD25 (music: ' + music + ')';
    }
  }
};

/* Shared TCI calculation */
function thermalComfortIndex(temp, humidity, wind) {
  var windFactor = -0.5 * wind;
  return temp - 0.55 * (1 - humidity / 100) * (temp - 14) + windFactor;
}

/**
 * Generic runner: reads inputs, validates, runs prediction, writes output.
 * @param {string} endpointId - Key in ENDPOINTS config
 */
// eslint-disable-next-line no-unused-vars -- called from HTML onclick handlers
function runPrediction(endpointId) {
  var endpoint = ENDPOINTS[endpointId];
  if (!endpoint) return;

  var vals = [];
  for (var i = 0; i < endpoint.inputs.length; i++) {
    var input = endpoint.inputs[i];
    var el = document.getElementById(input.id);
    if (!el) { vals.push(input.fallback); continue; }

    var raw = el.value;
    if (input.type === 'number') {
      var num = parseFloat(raw);
      if (isNaN(num) || raw.trim() === '') {
        num = input.fallback;
      }
      vals.push(num);
    } else {
      vals.push(raw || input.fallback);
    }
  }

  try {
    var result = endpoint.predict(vals);
    document.getElementById(endpoint.output).textContent = result;
  } catch (_e) {
    document.getElementById(endpoint.output).textContent = 'Something went wrong. Try again!';
  }
}
