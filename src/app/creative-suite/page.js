"use client";
import { useState } from 'react';
import styles from './creative-suite.module.css';

export default function CreativeSuite() {
  const [activeTab, setActiveTab] = useState('Intro');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    theme: 'Modern',
    duration: '5'
  });

  const tabs = ['Intro', 'Outro', 'Thumbnail'];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/generate/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'Creative-Suite',
          prompt: `${activeTab}: ${formData.title} - ${formData.subtitle}`,
          style: formData.theme,
          aspectRatio: activeTab === 'Thumbnail' ? '16:9' : '16:9'
        })
      });

      const data = await response.json();
      if (data.videoUrl || data.thumbnailUrl) {
        setResult(data.videoUrl || data.thumbnailUrl);
      }
    } catch (error) {
      console.error("Creative generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Creative Suite</h1>
        <p className={styles.subtitle}>Professional intros, outros, and thumbnails in seconds.</p>
      </header>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button 
            key={tab} 
            className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.editor}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>{activeTab} Title</label>
            <input 
              className={styles.input} 
              placeholder="e.g. My Amazing Travel Vlog"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Subtitle / Call to Action</label>
            <input 
              className={styles.input} 
              placeholder={activeTab === 'Outro' ? "e.g. Don't forget to subscribe!" : "e.g. Episode 1"}
              value={formData.subtitle}
              onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Visual Theme</label>
            <select 
              className={styles.select}
              value={formData.theme}
              onChange={(e) => setFormData({...formData, theme: e.target.value})}
            >
              <option>Modern</option>
              <option>Gamer / RGB</option>
              <option>Minimalist</option>
              <option>Cinematic</option>
            </select>
          </div>

          <button 
            className={styles.generateBtn} 
            onClick={handleGenerate}
            disabled={!formData.title || isGenerating}
          >
            {isGenerating ? 'Generating...' : `Generate ${activeTab}`}
          </button>
        </div>

        <div className={styles.preview}>
          <div className={styles.placeholder}>
            {isGenerating ? (
              <div className="loader"></div>
            ) : result ? (
              activeTab === 'Thumbnail' ? (
                <img src={result} alt="Thumbnail Preview" style={{width: '100%', borderRadius: '12px'}} />
              ) : (
                <video src={result} controls style={{width: '100%', borderRadius: '12px'}} autoPlay />
              )
            ) : (
              <>
                <span>{activeTab === 'Thumbnail' ? '🖼️' : '🎬'}</span>
                <p>{activeTab} preview will appear here</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
