/* ==========================================================================
   SOUND SYNTHESIZER MODULE (Web Audio API)
   ========================================================================== */
class SoundSynth {
  constructor() {
    this.ctx = null;
    this.bgmPlaying = false;
    this.soundEnabled = true;
    this.bgmTimeout = null;
    this.bgmStep = 0;
    
    // Retro pentatonic chord loop (frequencies for BGM)
    // C Major Pentatonic: C4, D4, E4, G4, A4, C5, A4, G4, E4, D4...
    this.bgmNotes = [
      261.63, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63,
      293.66, 329.63, 392.00, 523.25, 587.33, 523.25, 392.00, 293.66
    ];
  }
  
  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }
  
  resume() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    if (!enabled) {
      this.stopBGM();
    }
  }

  playHitSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  playGoldHitSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    
    // Sparkly upward arpeggio
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = now + idx * 0.04;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(noteTime);
      osc.stop(noteTime + 0.18);
    });
  }

  playBombSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(25, now + 0.45);
    
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.exponentialRampToValueAtTime(40, now + 0.45);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.55);
  }

  playMissSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.18);
    
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.22);
  }

  playStartSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.08;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.2);
    });
  }

  playGameOverSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    // Sad minor descending run
    const notes = [523.25, 466.16, 415.30, 349.23, 293.66, 261.63]; // C5, Bb4, Ab4, F4, D4, C4
    
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + idx * 0.12;
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.12, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.3);
    });
  }

  playTickSound() {
    this.resume();
    if (!this.ctx || !this.soundEnabled) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.06);
  }

  startBGM() {
    this.resume();
    if (!this.ctx || this.bgmPlaying || !this.soundEnabled) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;
    
    const tempo = 140; // BPM
    const noteLength = 60 / tempo / 2; // 8th notes
    
    const scheduleNextNotes = () => {
      if (!this.bgmPlaying) return;
      
      const now = this.ctx.currentTime;
      // Schedule a block of 4 notes ahead
      for (let i = 0; i < 4; i++) {
        const noteTime = now + i * noteLength;
        const noteIndex = (this.bgmStep + i) % this.bgmNotes.length;
        const freq = this.bgmNotes[noteIndex];
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        
        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.03, noteTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + noteLength - 0.02);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(noteTime);
        osc.stop(noteTime + noteLength);
      }
      
      this.bgmStep += 4;
      this.bgmTimeout = setTimeout(scheduleNextNotes, noteLength * 4 * 1000 - 30);
    };
    
    scheduleNextNotes();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimeout) {
      clearTimeout(this.bgmTimeout);
      this.bgmTimeout = null;
    }
  }
}

const soundSynth = new SoundSynth();

/* ==========================================================================
   GAME ENGINE & STATE MANAGEMENT
   ========================================================================== */
const GameConfig = {
  easy: {
    name: '簡單',
    spawnInterval: 1200, // ms between spawns
    stayDuration: 1550,  // ms mole stays up
    normalProb: 1.0,
    goldenProb: 0.0,
    bombProb: 0.0,
    maxConcurrent: 1
  },
  medium: {
    name: '中等',
    spawnInterval: 900,
    stayDuration: 1150,
    normalProb: 0.80,
    goldenProb: 0.10,
    bombProb: 0.10,
    maxConcurrent: 1
  },
  hard: {
    name: '困難',
    spawnInterval: 650,
    stayDuration: 850,
    normalProb: 0.65,
    goldenProb: 0.15,
    bombProb: 0.20,
    maxConcurrent: 2
  },
  insane: {
    name: '地獄',
    spawnInterval: 450,
    stayDuration: 550,
    normalProb: 0.60,
    goldenProb: 0.10,
    bombProb: 0.30,
    maxConcurrent: 3
  }
};

class WhackAMole {
  constructor() {
    // State Variables
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeMax = 30; // 30 seconds
    this.timeLeft = this.timeMax;
    
    this.currentDifficulty = 'medium';
    this.soundEnabled = true;
    
    this.gameActive = false;
    this.isPaused = false;
    
    // Core Timers
    this.gameTimerInterval = null;
    this.spawnTimerTimeout = null;
    
    // Board status
    // Array tracking active moles in each hole: null or { type: 'normal'|'golden'|'bomb', timeoutId, element }
    this.holesState = Array(9).fill(null);
    
    // DOM Cache
    this.initDOM();
    
    // Load high scores
    this.loadHighScores();
    this.renderLeaderboard(this.currentDifficulty);
    
    // Wire up events
    this.bindEvents();
    this.initParticlesBackground();
  }
  
  initDOM() {
    this.dom = {
      startScreen: document.getElementById('start-screen'),
      gameScreen: document.getElementById('game-screen'),
      gameOverModal: document.getElementById('game-over-modal'),
      pauseModal: document.getElementById('pause-modal'),
      
      btnStart: document.getElementById('btn-start-game'),
      btnPause: document.getElementById('btn-pause'),
      btnQuit: document.getElementById('btn-quit'),
      btnResume: document.getElementById('btn-resume'),
      btnPauseMenu: document.getElementById('btn-pause-menu'),
      btnRestart: document.getElementById('btn-restart'),
      btnMainMenu: document.getElementById('btn-main-menu'),
      btnSaveScore: document.getElementById('btn-save-score'),
      
      scoreDisplay: document.getElementById('score-display'),
      heartsContainer: document.getElementById('hearts-container'),
      timerDisplay: document.getElementById('timer-display'),
      timerBar: document.getElementById('timer-bar'),
      comboContainer: document.getElementById('combo-container'),
      comboCount: document.getElementById('combo-count'),
      hudDiffTag: document.getElementById('hud-diff-tag'),
      
      startSoundToggle: document.getElementById('start-sound-toggle'),
      gameSoundToggle: document.getElementById('game-sound-toggle'),
      soundIconStart: document.getElementById('sound-icon-start'),
      soundIconGame: document.getElementById('sound-icon-game'),
      
      leaderboardList: document.getElementById('leaderboard-list'),
      leaderboardTabs: document.querySelectorAll('.leaderboard-panel .tab'),
      difficultyButtons: document.querySelectorAll('.difficulty-selector .btn-diff'),
      
      gameOverReason: document.getElementById('game-over-reason'),
      finalScoreDisplay: document.getElementById('final-score-display'),
      newRecordBadge: document.getElementById('new-record-badge'),
      recordInputSection: document.getElementById('record-input-section'),
      playerNameInput: document.getElementById('player-name-input'),
      
      holes: document.querySelectorAll('.hole-wrapper'),
      customHammer: document.getElementById('custom-hammer')
    };
  }

  bindEvents() {
    // 1. Difficulty Buttons
    this.dom.difficultyButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.dom.difficultyButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDifficulty = btn.dataset.difficulty;
        this.renderLeaderboard(this.currentDifficulty);
        soundSynth.playHitSound();
      });
    });

    // 2. Leaderboard Tabs
    this.dom.leaderboardTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.dom.leaderboardTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.renderLeaderboard(tab.dataset.tab);
        soundSynth.playHitSound();
      });
    });

    // 3. Sound Toggles
    const toggleSound = () => {
      this.soundEnabled = !this.soundEnabled;
      soundSynth.setSoundEnabled(this.soundEnabled);
      this.updateSoundIcons();
      if (this.soundEnabled && this.gameActive && !this.isPaused) {
        soundSynth.startBGM();
      }
      soundSynth.playHitSound();
    };
    this.dom.startSoundToggle.addEventListener('click', toggleSound);
    this.dom.gameSoundToggle.addEventListener('click', toggleSound);

    // 4. Game Controls
    this.dom.btnStart.addEventListener('click', () => this.startGame());
    this.dom.btnPause.addEventListener('click', () => this.pauseGame());
    this.dom.btnResume.addEventListener('click', () => this.resumeGame());
    this.dom.btnPauseMenu.addEventListener('click', () => this.quitToMainMenu());
    this.dom.btnQuit.addEventListener('click', () => this.quitToMainMenu());
    this.dom.btnRestart.addEventListener('click', () => {
      this.dom.gameOverModal.classList.remove('active');
      this.startGame();
    });
    this.dom.btnMainMenu.addEventListener('click', () => {
      this.dom.gameOverModal.classList.remove('active');
      this.quitToMainMenu();
    });
    this.dom.btnSaveScore.addEventListener('click', () => this.saveHighScore());

    // 5. Mole Interaction
    this.dom.holes.forEach(holeWrapper => {
      const holeIndex = parseInt(holeWrapper.dataset.hole);
      const moles = holeWrapper.querySelectorAll('.mole');
      
      moles.forEach(moleEl => {
        const triggerHit = (e) => {
          if (!this.gameActive || this.isPaused) return;
          e.stopPropagation();
          
          // Double check if this mole is actually up
          if (moleEl.classList.contains('up') && !moleEl.classList.contains('hit')) {
            const moleType = moleEl.classList.contains('normal') ? 'normal' :
                             moleEl.classList.contains('golden') ? 'golden' : 'bomb';
            this.hitMole(holeIndex, moleType, e);
          }
        };

        // Desktop and Mobile events
        moleEl.addEventListener('mousedown', triggerHit);
        moleEl.addEventListener('touchstart', (e) => {
          e.preventDefault(); // Prevents double firing with mousedown
          triggerHit(e);
        });
      });

      // Click on hole background (Miss / Blank hit)
      const handleMiss = (e) => {
        if (!this.gameActive || this.isPaused) return;
        this.registerMiss(e);
      };
      
      holeWrapper.querySelector('.hole').addEventListener('mousedown', handleMiss);
      holeWrapper.querySelector('.hole').addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleMiss(e);
      });
    });

    // 6. Custom Hammer Cursor (Desktop)
    document.addEventListener('mousemove', (e) => {
      this.dom.customHammer.style.left = `${e.clientX}px`;
      this.dom.customHammer.style.top = `${e.clientY}px`;
    });

    document.addEventListener('mousedown', () => {
      this.dom.customHammer.classList.add('smash');
    });

    document.addEventListener('mouseup', () => {
      this.dom.customHammer.classList.remove('smash');
    });

    // Trigger visual hit effect at cursor for click feedback
    document.addEventListener('click', (e) => {
      if (this.gameActive && !this.isPaused) {
        this.spawnSmashFX(e.clientX, e.clientY);
      }
    });
    
    // Prevent context menu to keep clicking seamless
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /* ==========================================================================
     PARTICLES BACKGROUND SYSTEM
     ========================================================================== */
  initParticlesBackground() {
    const container = document.getElementById('bg-particles');
    const pCount = 15;
    for (let i = 0; i < pCount; i++) {
      const p = document.createElement('div');
      p.className = 'bg-particle';
      
      // Random coordinates and sizes
      const size = Math.random() * 6 + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      
      // Random timings
      p.style.animationDuration = `${10 + Math.random() * 15}s`;
      p.style.animationDelay = `-${Math.random() * 15}s`;
      
      container.appendChild(p);
    }
  }

  /* ==========================================================================
     UI / ICON UPDATES
     ========================================================================== */
  updateSoundIcons() {
    const enabledPath = "M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z";
    const disabledPath = "M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.21.05-.42.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z";
    
    const pathStart = this.dom.soundIconStart.querySelector('path');
    const pathGame = this.dom.soundIconGame.querySelector('path');
    
    if (this.soundEnabled) {
      pathStart.setAttribute('d', enabledPath);
      pathGame.setAttribute('d', enabledPath);
    } else {
      pathStart.setAttribute('d', disabledPath);
      pathGame.setAttribute('d', disabledPath);
    }
  }

  /* ==========================================================================
     GAME LIFECYCLE
     ========================================================================== */
  startGame() {
    soundSynth.resume();
    soundSynth.playStartSound();
    
    // Switch screens
    this.dom.startScreen.classList.remove('active');
    this.dom.gameScreen.classList.add('active');
    document.body.classList.add('game-playing');
    
    // Reset states
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeLeft = this.timeMax;
    this.gameActive = true;
    this.isPaused = false;
    
    // Set config
    this.config = GameConfig[this.currentDifficulty];
    this.dom.hudDiffTag.textContent = `難度: ${this.config.name}`;
    
    // Apply styling tags for difficulty colors
    this.dom.hudDiffTag.style.borderColor = `var(--color-${this.currentDifficulty})`;
    this.dom.hudDiffTag.style.color = `var(--color-${this.currentDifficulty})`;
    
    // Reset board UI
    this.clearAllHoles();
    this.updateHUD();
    
    // Start loop timers
    this.startTimers();
    
    // Start BGM
    if (this.soundEnabled) {
      soundSynth.startBGM();
    }
  }

  startTimers() {
    // 1. Core Timer Tick (100ms interval for precision .0s visual countdown)
    this.gameTimerInterval = setInterval(() => {
      if (this.isPaused) return;
      
      this.timeLeft = Math.max(0, this.timeLeft - 0.1);
      this.updateTimerUI();
      
      // Heartbeat warning chime at <= 5.0 seconds
      if (this.timeLeft <= 5.0 && this.timeLeft > 0 && Math.abs((this.timeLeft * 10) % 10) < 0.1) {
        soundSynth.playTickSound();
      }
      
      if (this.timeLeft <= 0) {
        this.endGame('timeup');
      }
    }, 100);

    // 2. Spawn Loop Timeout
    this.scheduleNextSpawn();
  }

  stopTimers() {
    clearInterval(this.gameTimerInterval);
    clearTimeout(this.spawnTimerTimeout);
  }

  pauseGame() {
    if (!this.gameActive || this.isPaused) return;
    this.isPaused = true;
    
    // Show Modal
    this.dom.pauseModal.classList.add('active');
    document.body.classList.remove('game-playing');
    
    soundSynth.stopBGM();
    soundSynth.playHitSound();
  }

  resumeGame() {
    if (!this.gameActive || !this.isPaused) return;
    this.isPaused = false;
    
    // Hide Modal
    this.dom.pauseModal.classList.remove('active');
    document.body.classList.add('game-playing');
    
    soundSynth.playHitSound();
    if (this.soundEnabled) {
      soundSynth.startBGM();
    }
  }

  quitToMainMenu() {
    this.gameActive = false;
    this.isPaused = false;
    this.stopTimers();
    this.clearAllHoles();
    soundSynth.stopBGM();
    soundSynth.playHitSound();
    
    // Hide all modals
    this.dom.pauseModal.classList.remove('active');
    this.dom.gameOverModal.classList.remove('active');
    
    // Switch screens
    this.dom.gameScreen.classList.remove('active');
    this.dom.startScreen.classList.add('active');
    document.body.classList.remove('game-playing');
    
    // Reload main menu leaderboard
    this.renderLeaderboard(this.currentDifficulty);
  }

  endGame(reason) {
    this.gameActive = false;
    this.stopTimers();
    this.clearAllHoles();
    
    soundSynth.stopBGM();
    soundSynth.playGameOverSound();
    document.body.classList.remove('game-playing');
    
    // Set score UI
    this.dom.finalScoreDisplay.textContent = this.score;
    
    if (reason === 'timeup') {
      this.dom.gameOverReason.textContent = "時間到！你的最終得分為：";
    } else {
      this.dom.gameOverReason.textContent = "生命值歸零！你的最終得分為：";
    }

    // Check high score
    const isNewHigh = this.checkIfHighScore(this.currentDifficulty, this.score);
    if (isNewHigh) {
      this.dom.newRecordBadge.style.display = 'inline-block';
      this.dom.recordInputSection.style.display = 'flex';
      this.dom.playerNameInput.focus();
    } else {
      this.dom.newRecordBadge.style.display = 'none';
      this.dom.recordInputSection.style.display = 'none';
    }

    // Display modal
    this.dom.gameOverModal.classList.add('active');
  }

  /* ==========================================================================
     SPAWN LOGIC
     ========================================================================== */
  scheduleNextSpawn() {
    if (!this.gameActive) return;
    
    const interval = this.config.spawnInterval;
    this.spawnTimerTimeout = setTimeout(() => {
      if (this.isPaused) {
        this.scheduleNextSpawn();
        return;
      }
      
      this.spawnMoles();
      this.scheduleNextSpawn();
    }, interval + (Math.random() * 200 - 100)); // slight jitter
  }

  spawnMoles() {
    // Determine how many moles to spawn based on difficulty config
    const currentActiveCount = this.holesState.filter(h => h !== null).length;
    if (currentActiveCount >= this.config.maxConcurrent) return;

    // Pick how many to spawn: from 1 up to (maxConcurrent - currentActiveCount)
    const emptyHoleIndices = this.getEmptyHoles();
    if (emptyHoleIndices.length === 0) return;
    
    const spawnLimit = Math.min(
      emptyHoleIndices.length, 
      this.config.maxConcurrent - currentActiveCount
    );
    const countToSpawn = Math.floor(Math.random() * spawnLimit) + 1;

    for (let i = 0; i < countToSpawn; i++) {
      const vacantIndices = this.getEmptyHoles();
      if (vacantIndices.length === 0) break;
      
      const randomVacantIndex = vacantIndices[Math.floor(Math.random() * vacantIndices.length)];
      this.spawnMole(randomVacantIndex);
    }
  }

  spawnMole(holeIndex) {
    // 1. Choose mole type based on difficulty distribution
    const rand = Math.random();
    let type = 'normal';
    
    if (rand < this.config.bombProb) {
      type = 'bomb';
    } else if (rand < this.config.bombProb + this.config.goldenProb) {
      type = 'golden';
    }

    // 2. Visual pop up
    const holeWrapper = this.dom.holes[holeIndex];
    const moleEl = holeWrapper.querySelector(`.mole.${type}`);
    moleEl.classList.add('up');
    moleEl.classList.remove('hit');

    // 3. Set automatic pull-down timer
    const autoRetractTimeout = setTimeout(() => {
      if (this.gameActive && !this.isPaused && this.holesState[holeIndex]) {
        this.retractMole(holeIndex, false);
      }
    }, this.config.stayDuration);

    // 4. Update memory state
    this.holesState[holeIndex] = {
      type,
      element: moleEl,
      timeoutId: autoRetractTimeout
    };
  }

  retractMole(holeIndex, isWhacked) {
    const mole = this.holesState[holeIndex];
    if (!mole) return;

    clearTimeout(mole.timeoutId);
    
    mole.element.classList.remove('up');
    if (isWhacked) {
      mole.element.classList.add('hit');
    }

    this.holesState[holeIndex] = null;
  }

  clearAllHoles() {
    this.holesState.forEach((mole, index) => {
      if (mole) {
        clearTimeout(mole.timeoutId);
        mole.element.classList.remove('up');
        mole.element.classList.remove('hit');
      }
    });
    this.holesState.fill(null);
  }

  getEmptyHoles() {
    const indices = [];
    this.holesState.forEach((state, idx) => {
      if (state === null) indices.push(idx);
    });
    return indices;
  }

  /* ==========================================================================
     HIT & MISS LOGIC
     ========================================================================== */
  hitMole(holeIndex, moleType, event) {
    const moleState = this.holesState[holeIndex];
    if (!moleState) return;

    const rect = moleState.element.getBoundingClientRect();
    const hitX = event.clientX || (event.touches && event.touches[0].clientX) || (rect.left + rect.width / 2);
    const hitY = event.clientY || (event.touches && event.touches[0].clientY) || (rect.top + rect.height / 2);

    let pointDelta = 0;
    
    if (moleType === 'normal') {
      pointDelta = 10;
      this.combo++;
      soundSynth.playHitSound();
      this.spawnFloatText(hitX, hitY, `+${pointDelta}`, 'plus');
      this.spawnParticles(hitX, hitY, '#d97706'); // brown/orange sparks
    } else if (moleType === 'golden') {
      pointDelta = 30;
      this.combo++;
      soundSynth.playGoldHitSound();
      this.spawnFloatText(hitX, hitY, `+${pointDelta}`, 'plus-gold');
      this.spawnParticles(hitX, hitY, '#fbbf24', 12); // bright gold sparkles
    } else if (moleType === 'bomb') {
      pointDelta = -20;
      this.combo = 0; // Break combo
      this.lives = Math.max(0, this.lives - 1);
      soundSynth.playBombSound();
      this.spawnFloatText(hitX, hitY, `${pointDelta}`, 'minus');
      this.spawnParticles(hitX, hitY, '#ef4444', 16); // red blast particles
      this.triggerScreenShake();
      
      if (this.lives <= 0) {
        this.endGame('bomb');
      }
    }

    // Apply combo bonus factor to positive scores
    if (pointDelta > 0 && this.combo >= 5) {
      const multiplier = 1 + Math.floor(this.combo / 5) * 0.1;
      pointDelta = Math.round(pointDelta * multiplier);
    }

    this.score = Math.max(0, this.score + pointDelta);
    this.retractMole(holeIndex, true);
    
    this.updateHUD();
  }

  registerMiss(event) {
    // Break combo on miss (click grass/empty hole)
    if (this.combo > 0) {
      this.combo = 0;
      this.updateHUD();
    }
    
    soundSynth.playMissSound();
    
    const clickX = event.clientX || (event.touches && event.touches[0].clientX);
    const clickY = event.clientY || (event.touches && event.touches[0].clientY);
    if (clickX && clickY) {
      this.spawnFloatText(clickX, clickY, 'MISS', 'minus');
    }
  }

  /* ==========================================================================
     EFFECTS (FLOAT TEXT, PARTICLES, SCREEN SHAKE, SMASH FX)
     ========================================================================== */
  spawnFloatText(x, y, text, typeClass) {
    const el = document.createElement('div');
    el.className = `floating-text ${typeClass}`;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.textContent = text;
    
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  spawnParticles(x, y, colorHex, count = 8) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.backgroundColor = colorHex;
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;

      // Set random movement vectors for particle physics animation
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 80;
      const dx = `${Math.cos(angle) * velocity}px`;
      const dy = `${Math.sin(angle) * velocity}px`;
      
      p.style.setProperty('--dx', dx);
      p.style.setProperty('--dy', dy);
      
      // Randomize sizes slightly
      const size = 4 + Math.random() * 5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      document.body.appendChild(p);
      setTimeout(() => p.remove(), 500);
    }
  }

  spawnSmashFX(x, y) {
    // 1. Particle ripple effect
    const fx = document.createElement('div');
    fx.className = 'smash-fx';
    fx.style.left = `${x}px`;
    fx.style.top = `${y}px`;
    
    document.body.appendChild(fx);
    setTimeout(() => fx.remove(), 300);

    // 2. Spawn a temporary wooden mallet animation on touch devices (where there is no custom hover cursor)
    if (window.matchMedia('(hover: none)').matches) {
      const mallet = document.createElement('div');
      mallet.className = 'mobile-mallet';
      mallet.style.left = `${x}px`;
      mallet.style.top = `${y}px`;
      
      document.body.appendChild(mallet);
      setTimeout(() => mallet.remove(), 220);
    }
  }

  triggerScreenShake() {
    const board = document.querySelector('.board-3d-wrapper');
    board.classList.add('shake');
    
    // Write dynamic inline style for instant shake class cleanup
    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.textContent = `
        .board-3d-wrapper.shake {
          animation: shakeAnimation 0.4s ease;
        }
        @keyframes shakeAnimation {
          0%, 100% { transform: translateX(0); }
          15%, 45%, 75% { transform: translateX(-8px) rotate(-1deg); }
          30%, 60%, 90% { transform: translateX(8px) rotate(1deg); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => board.classList.remove('shake'), 400);
  }

  /* ==========================================================================
     HUD SYNCHRONIZATION
     ========================================================================== */
  updateHUD() {
    // 1. Score padding to 4 digits (e.g. 0080)
    const paddedScore = String(this.score).padStart(4, '0');
    this.dom.scoreDisplay.textContent = paddedScore;
    
    // Visual score pop trigger
    this.dom.scoreDisplay.classList.remove('score-pop');
    void this.dom.scoreDisplay.offsetWidth; // force reflow
    this.dom.scoreDisplay.classList.add('score-pop');

    // 2. Hearts Update
    const hearts = this.dom.heartsContainer.querySelectorAll('.heart');
    hearts.forEach((heart, index) => {
      if (index < this.lives) {
        heart.classList.remove('broken');
      } else {
        heart.classList.add('broken');
      }
    });

    // 3. Combo UI Update
    if (this.combo >= 5) {
      this.dom.comboContainer.classList.add('active');
      this.dom.comboCount.textContent = this.combo;
      
      // Spark combo scale pop effect
      this.dom.comboCount.style.transform = 'scale(1.2)';
      setTimeout(() => this.dom.comboCount.style.transform = 'scale(1)', 100);
    } else {
      this.dom.comboContainer.classList.remove('active');
    }
  }

  updateTimerUI() {
    this.dom.timerDisplay.textContent = `${this.timeLeft.toFixed(1)}s`;
    
    const percentage = (this.timeLeft / this.timeMax) * 100;
    this.dom.timerBar.style.width = `${percentage}%`;

    // Red warning colors at critical timer
    if (this.timeLeft <= 8.0) {
      this.dom.timerBar.classList.add('warning');
    } else {
      this.dom.timerBar.classList.remove('warning');
    }
  }

  /* ==========================================================================
     LEADERBOARD / STORAGE SYSTEM
     ========================================================================== */
  loadHighScores() {
    const scores = localStorage.getItem('whackamole_highscores');
    if (scores) {
      try {
        this.highScores = JSON.parse(scores);
      } catch (e) {
        this.resetHighScoresObject();
      }
    } else {
      this.resetHighScoresObject();
    }
  }

  resetHighScoresObject() {
    this.highScores = {
      easy: [
        { name: "地鼠剋星", score: 150 },
        { name: "手速超人", score: 100 },
        { name: "實習園丁", score: 50 }
      ],
      medium: [
        { name: "地鼠剋星", score: 180 },
        { name: "手速超人", score: 120 },
        { name: "打鼠先鋒", score: 80 }
      ],
      hard: [
        { name: "地鼠剋星", score: 200 },
        { name: "點擊大師", score: 140 },
        { name: "音速小丑", score: 90 }
      ],
      insane: [
        { name: "修羅神手", score: 220 },
        { name: "神之反應", score: 160 },
        { name: "殘影指法", score: 100 }
      ]
    };
    this.saveHighScoresToStorage();
  }

  saveHighScoresToStorage() {
    localStorage.setItem('whackamole_highscores', JSON.stringify(this.highScores));
  }

  renderLeaderboard(difficulty) {
    this.dom.leaderboardList.innerHTML = '';
    const records = this.highScores[difficulty] || [];
    
    if (records.length === 0) {
      const li = document.createElement('div');
      li.className = 'leaderboard-empty';
      li.textContent = '暫無紀錄，快來挑戰！';
      this.dom.leaderboardList.appendChild(li);
      return;
    }

    records.forEach((record, index) => {
      const li = document.createElement('li');
      li.className = 'leaderboard-item';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'player-name';
      nameSpan.textContent = `${index + 1}. ${record.name}`;
      
      const scoreSpan = document.createElement('span');
      scoreSpan.className = 'player-score';
      scoreSpan.textContent = `${record.score} 分`;
      
      li.appendChild(nameSpan);
      li.appendChild(scoreSpan);
      this.dom.leaderboardList.appendChild(li);
    });
  }

  checkIfHighScore(difficulty, score) {
    const list = this.highScores[difficulty] || [];
    if (list.length < 5) return true;
    // Check if score is higher than the lowest on board
    return score > list[list.length - 1].score;
  }

  saveHighScore() {
    const name = this.dom.playerNameInput.value.trim() || '無名英雄';
    const record = { name, score: this.score };
    const list = this.highScores[this.currentDifficulty] || [];
    
    list.push(record);
    // Sort descending
    list.sort((a, b) => b.score - a.score);
    // Keep top 5
    this.highScores[this.currentDifficulty] = list.slice(0, 5);
    
    this.saveHighScoresToStorage();
    this.renderLeaderboard(this.currentDifficulty);
    
    // Update active tab matching current difficulty
    this.dom.leaderboardTabs.forEach(t => {
      if (t.dataset.tab === this.currentDifficulty) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    // Hide input group
    this.dom.recordInputSection.style.display = 'none';
    soundSynth.playGoldHitSound();
  }
}

// Instantiate engine when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.gameEngine = new WhackAMole();
});
