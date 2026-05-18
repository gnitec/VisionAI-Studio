"use client";
import { useState } from 'react';
import styles from './talking-avatar.module.css';
import StudioPlayer from '@/components/StudioPlayer';
import { VOICES } from '@/lib/voices';

export default function TalkingAvatar() {
  const [script, setScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0]);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVideoUrl(null);
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Talking-Avatar', script, voiceId: selectedVoice.id })
      });
      const data = await response.json();
      if (data.success) {
        setVideoUrl(data.videoUrl);
      } else {
        alert(data.error || "Generation failed");
      }
    } catch (err) {
      alert("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Avatar Studio</h1>
        <p className={styles.subtitle}>Bring your photos to life with AI lip-sync.</p>
      </header>

      <div className={styles.container}>
        <div className={styles.editor}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Avatar Image</label>
            <div className={styles.uploadZone}>
              <span>👤</span>
              <p>Upload Face Image</p>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Script</label>
            <textarea 
              className={styles.textarea} 
              placeholder="What should the avatar say?"
              value={script}
              onChange={(e) => setScript(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Voice Selection</label>
            <div className={styles.voiceGrid}>
              {VOICES.map((voice) => (
                <div 
                  key={voice.id} 
                  className={`${styles.voiceCard} ${selectedVoice.id === voice.id ? styles.selected : ''}`}
                  onClick={() => setSelectedVoice(voice)}
                >
                  <div className={styles.voiceInfo}>
                    <span className={styles.voiceName}>{voice.name}</span>
                    <span className={styles.voiceStyle}>{voice.style}</span>
                  </div>
                  <button className={styles.playBtn} onClick={(e) => {
                    e.stopPropagation();
                    new Audio(voice.preview).play();
                  }}>▶️</button>
                </div>
              ))}
            </div>
          </div>

          <button 
            className={styles.generateBtn} 
            onClick={handleGenerate}
            disabled={!script || isGenerating}
          >
            {isGenerating ? 'Synthesizing...' : 'Generate Avatar Video'}
          </button>
        </div>

        <div className={styles.preview}>
          {isGenerating ? (
            <div className={styles.loaderContainer}>
              <div className={styles.loader}></div>
              <p>Animating your avatar...</p>
            </div>
          ) : videoUrl ? (
            <StudioPlayer src={videoUrl} onEdit={() => alert('Edit mode opening...')} />
          ) : (
            <div className={styles.previewPlaceholder}>
              <span className={styles.previewIcon}>👤</span>
              <p>Your talking avatar will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
