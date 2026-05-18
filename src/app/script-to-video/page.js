"use client";
import { useState } from 'react';
import styles from './script-to-video.module.css';

export default function ScriptToVideo() {
  const [view, setView] = useState('launchpad'); // launchpad, studio, preview
  const [idea, setIdea] = useState('');
  const [scenes, setScenes] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeScene, setActiveScene] = useState(null);

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/script/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea })
      });
      const data = await response.json();
      if (data.success) {
        setScenes(data.storyboard);
        setView('studio');
      }
    } catch (err) {
      alert("Analysis failed. Try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateScene = (id, field, value) => {
    setScenes(scenes.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <div className="animate-fade-in">
      {view === 'launchpad' && (
        <div className={styles.launchpad}>
          <header className={styles.header}>
            <h1 className={styles.title}>Project Genie</h1>
            <p className={styles.subtitle}>What vision do you want to bring to life today?</p>
          </header>
          <div className={styles.ideaBox}>
            <textarea 
              className={styles.ideaTextarea} 
              placeholder="Describe your story, world, or project concept..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <button 
              className={styles.magicBtn} 
              onClick={startAnalysis}
              disabled={!idea || isAnalyzing}
            >
              {isAnalyzing ? 'Genie is dreaming...' : '✨ Generate Storyboard'}
            </button>
          </div>
        </div>
      )}

      {view === 'studio' && (
        <div className={styles.studioLayout}>
          <aside className={styles.sidebar}>
            <h3 className={styles.sidebarTitle}>Scene List</h3>
            <div className={styles.sceneList}>
              {scenes.map((scene, idx) => (
                <div 
                  key={scene.id} 
                  className={`${styles.sceneThumb} ${activeScene?.id === scene.id ? styles.active : ''}`}
                  onClick={() => setActiveScene(scene)}
                >
                  <span className={styles.sceneIdx}>{idx + 1}</span>
                  <p>{scene.title}</p>
                </div>
              ))}
              <button className={styles.addSceneBtn}>+ Add Scene</button>
            </div>
          </aside>

          <main className={styles.workspace}>
            <div className={styles.workspaceHeader}>
              <h2>{activeScene ? activeScene.title : 'Select a scene to edit'}</h2>
              <button className={styles.assembleBtn} onClick={() => setView('preview')}>Assemble Video</button>
            </div>

            {activeScene ? (
              <div className={styles.editorGrid}>
                <div className={styles.sceneDetails}>
                  <div className={styles.inputGroup}>
                    <label>Script / Dialogue</label>
                    <textarea 
                      value={activeScene.script} 
                      onChange={(e) => updateScene(activeScene.id, 'script', e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Visual Prompt (Flow FX)</label>
                    <textarea 
                      value={activeScene.visualPrompt} 
                      onChange={(e) => updateScene(activeScene.id, 'visualPrompt', e.target.value)}
                    />
                  </div>
                  <div className={styles.settingsRow}>
                    <div className={styles.inputGroup}>
                      <label>Camera</label>
                      <select value={activeScene.camera} onChange={(e) => updateScene(activeScene.id, 'camera', e.target.value)}>
                        <option>Wide Shot</option>
                        <option>Close Up</option>
                        <option>Tracking</option>
                        <option>Aerial</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.visualCanvas}>
                  <div className={styles.canvasPlaceholder}>
                    <span>🎬</span>
                    <p>Click to generate scene visual</p>
                    <button className={styles.genSceneBtn}>Generate Clip</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Welcome to Storyboard Studio. Select a scene on the left to start directing.</p>
              </div>
            )}
          </main>
        </div>
      )}

      {view === 'preview' && (
        <div className={styles.fullPreview}>
          <header className={styles.previewHeader}>
            <button onClick={() => setView('studio')}>← Back to Studio</button>
            <h1>Final Assembly</h1>
            <button className={styles.exportBtn}>Export Project</button>
          </header>
          <div className={styles.previewContainer}>
             <div className={styles.bigVideo}>
                <p>Assembling scenes into a seamless narrative...</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
