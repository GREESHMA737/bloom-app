export const GENZ_QUOTES = [
  { text: "Grow at your own pace. The flowers don't compare themselves to each other; they just bloom.", author: "Aesthetic Mind" },
  { text: "You don't have to be perfect to be amazing. Small steps count.", author: "Soft Reminders" },
  { text: "Make peace with your screen time, and romanticize your real life today.", author: "Offline Vibe" },
  { text: "Healing isn't linear, but neither is growth. Keep watering your garden.", author: "Self Care Club" },
  { text: "No filters. No judgment. Just let yourself exist.", author: "Dump Thoughts" },
  { text: "You are the artist of your own energy. Protect your peace.", author: "Vibe Check" },
  { text: "Slow progress is still progress. Be gentle with your timeline.", author: "Mindfulness" },
  { text: "Your potential is like a seed. It takes time, patience, and a little rain to grow.", author: "Garden Whispers" }
];

export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * GENZ_QUOTES.length);
  return GENZ_QUOTES[index];
};
