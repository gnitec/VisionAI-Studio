"use client";
import { useState } from 'react';
import styles from './image-to-video.module.css';

export default function ImageToVideo() {
  const [image, setImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Image-to-Video', prompt: 'Animated image' })
      });
      const data = await response.json();
      if (data.success) {
        // Animation success
      }
    } catch (err) {
      console.error("Animation failed", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Anim Studio</h1>
        <p className={styles.subtitle}>Animate static images into dynamic scenes.</p>
      </header>

      <div className={styles.container}>
        <div className={styles.editor}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Source Image</label>
            <div className={styles.uploadZone}>
              <span className={styles.uploadIcon}>🖼️</span>
              <p>Upload the image you want to animate</p>
            </div>
          </div>

          <div className={styles.settingsGroup}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Motion Strength</label>
              <input type="range" className={styles.range} min="1" max="10" defaultValue="5" />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Seed (Optional)</label>
              <input type="text" className={styles.input} placeholder="Random seed..." />
            </div>
          </div>

          <button 
            className={styles.generateBtn} 
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Animating...' : 'Generate Animation'}
          </button>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewPlaceholder}>
            {isGenerating ? (
              <div className={styles.loader}></div>
            ) : (
              <>
                <span className={styles.previewIcon}>🎞️</span>
                <p>Animated preview will appear here</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
