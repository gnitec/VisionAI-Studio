"use client";
import { useState } from 'react';
import styles from './audio-studio.module.css';

export default function AudioStudio() {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [mode, setMode] = useState('narration'); // narration, music, sfx

  const handleGenerate = async () => {
    setIsGenerating(true);
    setAudioUrl(null);
    try {
      const response = await fetch('/api/generate/audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text, mode })
      });
      const data = await response.json();
      if (data.success) {
        setAudioUrl(data.videoUrl);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      console.error("Audio generation failed", err);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Audio Studio</h1>
        <p className={styles.subtitle}>Produce cinematic narration and AI background scores.</p>
      </header>

      <div className={styles.container}>
        <div className={styles.controls}>
          <div className={styles.tabGroup}>
            <button className={`${styles.tab} ${mode === 'narration' ? styles.active : ''}`} onClick={() => setMode('narration')}>Narration</button>
            <button className={`${styles.tab} ${mode === 'music' ? styles.active : ''}`} onClick={() => setMode('music')}>AI Music</button>
            <button className={`${styles.tab} ${mode === 'sfx' ? styles.active : ''}`} onClick={() => setMode('sfx')}>Sound FX</button>
          </div>

          <div className={styles.inputGroup}>
            <label>{mode === 'music' ? 'Describe the mood/genre' : 'Script to synthesize'}</label>
            <textarea 
              className={styles.textarea}
              placeholder={mode === 'music' ? "e.g. 'Chill lo-fi hip hop with rainy mood'" : "Enter text for professional AI narration..."}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className={styles.settingsGrid}>
            <div className={styles.setting}>
              <label>Voice / Style</label>
              <select>
                <option>James (Authoritative)</option>
                <option>Sophie (Warm)</option>
                <option>Marcus (Deep)</option>
                <option>Elena (Bright)</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Pace / Speed</label>
              <input type="range" min="0.5" max="2" step="0.1" defaultValue="1" />
            </div>
          </div>

          <button 
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={!text || isGenerating}
          >
            {isGenerating ? 'Synthesizing Audio...' : `✨ Generate ${mode === 'music' ? 'Score' : 'Audio'}`}
          </button>
        </div>

        <div className={styles.waveformZone}>
          <div className={styles.visualizer}>
             {audioUrl ? (
               <div className={styles.audioPlayer}>
                 <div className={styles.waveMock}>
                    {[...Array(40)].map((_, i) => (
                      <div key={i} className={styles.bar} style={{ height: `${Math.random() * 100}%` }}></div>
                    ))}
                 </div>
                 <audio src={audioUrl} controls className={styles.realAudio} />
                 <div className={styles.audioActions}>
                    <button className={styles.actionBtn}>⬇️ Download WAV</button>
                    <button className={styles.actionBtn}>✂️ Trim Audio</button>
                 </div>
               </div>
             ) : (
               <div className={styles.emptyWave}>
                  <span>🔊</span>
                  <p>Generate audio to see the waveform visualizer</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
