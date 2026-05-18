"use client";
import { useState, useEffect } from 'react';
import styles from './text-to-video.module.css';

export default function TextToVideo() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
      fetch(`/api/projects/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.prompt) setPrompt(data.prompt);
          if (data.videoUrl) setVideoUrl(data.videoUrl);
        })
        .catch(err => console.error("Failed to load project", err));
    }
  }, []);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setVideoUrl(null);
    
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Video-Studio',
          prompt,
          style: 'Cinematic', 
          aspectRatio: '16:9'
        })
      });

      const data = await response.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Something went wrong. Is the server running?");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Video Studio</h1>
        <p className={styles.subtitle}>Transform your ideas into cinematic reality.</p>
      </header>

      <div className={styles.container}>
        <div className={styles.editor}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Prompt</label>
            <textarea 
              className={styles.textarea} 
              placeholder="Describe the video you want to create in detail..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className={styles.settingsGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Style</label>
              <select className={styles.select}>
                <option>Cinematic</option>
                <option>Anime</option>
                <option>Photorealistic</option>
                <option>3D Render</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Aspect Ratio</label>
              <select className={styles.select}>
                <option>16:9 (Landscape)</option>
                <option>9:16 (Portrait)</option>
                <option>1:1 (Square)</option>
              </select>
            </div>
          </div>

          <button 
            className={styles.generateBtn} 
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate Video'}
          </button>
        </div>

        <div className={styles.preview}>
          <div className={styles.previewPlaceholder}>
            {isGenerating ? (
              <div className={styles.loader}></div>
            ) : videoUrl ? (
              <video src={videoUrl} controls className={styles.videoPlayer} autoPlay />
            ) : (
              <>
                <span className={styles.previewIcon}>🎬</span>
                <p>Generated video will appear here</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
