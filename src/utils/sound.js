// Simplified Web Audio API synthesizer with boosted volume and clean code logic
let isMuted = localStorage.getItem('tv_sound_muted') === 'true';
let sharedCtx = null;

export const isSoundMuted = () => isMuted;

export const setSoundMuted = (muted) => {
  isMuted = muted;
  localStorage.setItem('tv_sound_muted', String(muted));
};

const getAudioContext = () => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    
    if (!sharedCtx) {
      sharedCtx = new AudioContextClass();
    }
    
    // Automatically resume context if it is suspended by browser autoplay policies
    if (sharedCtx && sharedCtx.state === 'suspended') {
      sharedCtx.resume().catch(() => {});
    }
    return sharedCtx;
  } catch (e) {
    return null;
  }
};

export const playTactileSound = (type = 'click') => {
  console.log(`🔊 [playTactileSound] Called with type: "${type}". Global isMuted:`, isMuted);
  if (isMuted) {
    console.log("🔊 [playTactileSound] Sound is globally muted. Exiting.");
    return;
  }
  
  const ctx = getAudioContext();
  if (!ctx) {
    console.warn("🔊 [playTactileSound] Failed to initialize AudioContext.");
    return;
  }
  
  console.log(`🔊 [playTactileSound] AudioContext state: "${ctx.state}", currentTime: ${ctx.currentTime.toFixed(3)}`);

  try {
    if (type === 'tick') {
      // High, crisp tick for minor navigation links and hovers (added attack ramp to prevent pop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.003); // Soft 3ms attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06); // Exponential decay
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'clack') {
      // Hollow, woody snap sound for selectors and close buttons (added attack ramp to prevent pop)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.20, ctx.currentTime + 0.004); // Soft 4ms attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08); // Exponential decay
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } else {
      // Solid mechanical click for primary buttons (added 5ms attack ramp to smooth click thud)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(550, ctx.currentTime); // Pitch adjusted slightly higher for clean feedback
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.005); // Smooth 5ms attack
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12); // Smooth exponential decay
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    }
  } catch (e) {
    console.error("🔊 [playTactileSound] Error inside synthesizer:", e);
  }
};
