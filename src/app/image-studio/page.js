"use client";
import { useState } from 'react';
import styles from './image-studio.module.css';

export default function ImageStudio() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [activeTool, setActiveTool] = useState('generate'); // generate, edit, upscale

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await response.json();
      if (data.success) {
        setImageUrl(data.imageUrl);
      }
    } catch (err) {
      alert("Image generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.header}>
        <h1 className={styles.title}>Image Studio</h1>
        <p className={styles.subtitle}>Craft high-end artistic assets and edits.</p>
      </header>

      <div className={styles.layout}>
        <aside className={styles.toolbar}>
          <button 
            className={`${styles.tool} ${activeTool === 'generate' ? styles.active : ''}`}
            onClick={() => setActiveTool('generate')}
          >🎨 Generate</button>
          <button 
            className={`${styles.tool} ${activeTool === 'edit' ? styles.active : ''}`}
            onClick={() => setActiveTool('edit')}
          >✂️ AI Edit</button>
          <button 
            className={`${styles.tool} ${activeTool === 'upscale' ? styles.active : ''}`}
            onClick={() => setActiveTool('upscale')}
          >🔍 Upscale</button>
          <button 
            className={styles.tool}
            onClick={() => setImageUrl(null)}
          >🧹 Clear</button>
        </aside>

        <main className={styles.canvasContainer}>
          <div className={styles.canvas}>
            {isGenerating ? (
              <div className={styles.loader}>
                <div className={styles.spinner}></div>
                <p>Developing your masterpiece...</p>
              </div>
            ) : imageUrl ? (
              <div className={styles.imagePreview}>
                <img src={imageUrl} alt="Generated" className={styles.mainImage} />
                <div className={styles.imageActions}>
                  <button className={styles.actionBtn}>⬇️ Download</button>
                  <button className={styles.actionBtn}>✨ Edit Background</button>
                </div>
              </div>
            ) : (
              <div className={styles.emptyCanvas}>
                <span>🖼️</span>
                <p>Your creation will appear on this canvas</p>
              </div>
            )}
          </div>

          <div className={styles.promptBar}>
            <input 
              type="text" 
              className={styles.promptInput} 
              placeholder="Describe what you want to create (e.g. 'Cyberpunk forest in 4k')..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button 
              className={styles.genBtn}
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
            >
              {isGenerating ? 'Generating...' : '✨ Generate'}
            </button>
          </div>
        </main>

        <aside className={styles.assets}>
          <h3 className={styles.assetsTitle}>My Assets</h3>
          <div className={styles.assetGrid}>
             <div className={styles.assetThumb}></div>
             <div className={styles.assetThumb}></div>
             <div className={styles.assetThumb}></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
