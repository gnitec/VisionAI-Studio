"use client";
import { useState, useEffect } from 'react';
import styles from './storyboard.module.css';

export default function StoryboardStudio() {
  const [concept, setConcept] = useState('');
  const [scenes, setScenes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);

  const generateStoryboard = async () => {
    setIsGenerating(true);
    // Mocking the AI Storyboard generation
    setTimeout(() => {
      const mockScenes = [
        { id: 1, title: "Opening Shot", description: "Wide shot of the landscape", prompt: "Cinematic wide shot of a futuristic city at sunset", thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800" },
        { id: 2, title: "Character Intro", description: "Close up of the protagonist", prompt: "Cyberpunk character looking at the camera, neon lighting", thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800" },
        { id: 3, title: "The Conflict", description: "Fast paced action sequence", prompt: "High speed car chase through neon streets", thumbnail: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800" },
      ];
      setScenes(mockScenes);
      setSelectedScene(mockScenes[0]);
      setIsGenerating(false);
    }, 2000);
  };

  const addScene = () => {
    const newScene = {
      id: Date.now(),
      title: `Scene ${scenes.length + 1}`,
      description: "Enter scene description...",
      prompt: "Enter AI visual prompt...",
      thumbnail: "https://via.placeholder.com/800x450/1e293b/94a3b8?text=New+Scene"
    };
    setScenes([...scenes, newScene]);
    setSelectedScene(newScene);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Storyboard Studio</h1>
            <p className={styles.subtitle}>Plan your cinematic vision, frame by frame.</p>
          </div>
          <div className={styles.actions}>
            <button className={styles.secondaryBtn}>Export PDF</button>
            <button className={styles.primaryBtn}>Generate Video</button>
          </div>
        </div>

        <div className={styles.conceptBar}>
          <input 
            type="text" 
            placeholder="Describe your story idea... (e.g. A futuristic heist in Neo-Tokyo)" 
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className={styles.conceptInput}
          />
          <button 
            className={styles.genBtn} 
            onClick={generateStoryboard}
            disabled={isGenerating || !concept}
          >
            {isGenerating ? 'AI Planning...' : 'Generate Storyboard'}
          </button>
        </div>
      </header>

      <main className={styles.workspace}>
        {/* Main Canvas Area */}
        <div className={styles.canvasArea}>
          {selectedScene ? (
            <div className={styles.activeFrame}>
              <div className={styles.framePreview}>
                <img src={selectedScene.thumbnail} alt="Scene Preview" />
                <div className={styles.frameOverlay}>
                  <button className={styles.actionIcon}>📸 Regenerate</button>
                  <button className={styles.actionIcon}>🎨 Style</button>
                </div>
              </div>
              
              <div className={styles.frameDetails}>
                <div className={styles.inputGroup}>
                  <label>SCENE TITLE</label>
                  <input 
                    value={selectedScene.title}
                    onChange={(e) => {
                      const updated = scenes.map(s => s.id === selectedScene.id ? {...s, title: e.target.value} : s);
                      setScenes(updated);
                      setSelectedScene({...selectedScene, title: e.target.value});
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>DESCRIPTION & ACTION</label>
                  <textarea 
                    value={selectedScene.description}
                    onChange={(e) => {
                      const updated = scenes.map(s => s.id === selectedScene.id ? {...s, description: e.target.value} : s);
                      setScenes(updated);
                      setSelectedScene({...selectedScene, description: e.target.value});
                    }}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>VISUAL AI PROMPT</label>
                  <textarea 
                    className={styles.promptArea}
                    value={selectedScene.prompt}
                    onChange={(e) => {
                      const updated = scenes.map(s => s.id === selectedScene.id ? {...s, prompt: e.target.value} : s);
                      setScenes(updated);
                      setSelectedScene({...selectedScene, prompt: e.target.value});
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>📋</span>
              <h3>No Scene Selected</h3>
              <p>Start by entering your concept and generating an AI storyboard.</p>
            </div>
          )}
        </div>

        {/* Horizontal Timeline at the Bottom */}
        <footer className={styles.timelineArea}>
          <div className={styles.timelineHeader}>
            <span className={styles.timelineLabel}>FILM STRIP / TIMELINE</span>
            <button className={styles.addSceneBtn} onClick={addScene}>+ Add Scene</button>
          </div>
          
          <div className={styles.filmStrip}>
            {scenes.map((scene, index) => (
              <div 
                key={scene.id} 
                className={`${styles.stripItem} ${selectedScene?.id === scene.id ? styles.activeStrip : ''}`}
                onClick={() => setSelectedScene(scene)}
              >
                <div className={styles.stripThumb}>
                  <img src={scene.thumbnail} alt={`Scene ${index + 1}`} />
                  <span className={styles.stripIndex}>{index + 1}</span>
                </div>
                <span className={styles.stripTitle}>{scene.title}</span>
              </div>
            ))}
            {scenes.length === 0 && !isGenerating && (
              <div className={styles.timelineEmpty}>Enter a concept to see your timeline here...</div>
            )}
            {isGenerating && (
              <div className={styles.timelineLoading}>Generating Storyboard...</div>
            )}
          </div>
        </footer>
      </main>
    </div>
  );
}
