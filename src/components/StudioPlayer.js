"use client";
import { useState, useRef, useEffect } from 'react';
import styles from './StudioPlayer.module.css';

export default function StudioPlayer({ src, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setProgress((current / dur) * 100);
    setCurrentTime(formatTime(current));
  };

  const onLoadedMetadata = () => {
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e) => {
    const time = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = time;
    setProgress(e.target.value);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = `${title || 'visionai_export'}.mp4`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || 'VisionAI Video',
        text: 'Check out this AI-generated video from VisionAI Studio!',
        url: src,
      });
    } else {
      alert("Sharing link: " + src);
    }
  };

  return (
    <div className={styles.playerWrapper}>
      <div className={styles.playerHeader}>
        <span className={styles.liveBadge}>PRO PLAYER</span>
        <span className={styles.videoTitle}>{title || "Untitled Masterpiece"}</span>
      </div>

      <div className={styles.videoContainer}>
        <video 
          ref={videoRef}
          src={src} 
          className={styles.video} 
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onClick={togglePlay}
        />
        
        {/* Big Play Overlay on Pause */}
        {!isPlaying && (
          <div className={styles.playOverlay} onClick={togglePlay}>
            <div className={styles.playIcon}>▶</div>
          </div>
        )}

        <div className={styles.customControls}>
          <div className={styles.timeInfo}>
             <span>{currentTime}</span>
             <div className={styles.progressBar}>
               <input 
                 type="range" 
                 min="0" 
                 max="100" 
                 step="0.1"
                 value={progress} 
                 onChange={handleSeek} 
                 className={styles.seekSlider}
               />
               <div className={styles.progressFill} style={{width: `${progress}%`}}></div>
             </div>
             <span>{duration}</span>
          </div>
          
          <div className={styles.mainControls}>
            <div className={styles.left}>
              <button className={styles.controlBtn} onClick={togglePlay}>
                {isPlaying ? '⏸' : '▶'}
              </button>
              <div className={styles.volumeBox}>
                <button className={styles.controlBtn} onClick={() => setVolume(volume === 0 ? 1 : 0)}>
                  {volume === 0 ? '🔇' : '🔊'}
                </button>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1" 
                  value={volume} 
                  onChange={(e) => {
                    videoRef.current.volume = e.target.value;
                    setVolume(e.target.value);
                  }}
                  className={styles.volumeSlider}
                />
              </div>
            </div>

            <div className={styles.center}>
               <div className={styles.speedPills}>
                 {[0.5, 1, 1.5, 2].map(s => (
                   <button 
                    key={s}
                    className={`${styles.speedPill} ${speed === s ? styles.activePill : ''}`}
                    onClick={() => {
                      videoRef.current.playbackRate = s;
                      setSpeed(s);
                    }}
                   >
                     {s}x
                   </button>
                 ))}
               </div>
            </div>

            <div className={styles.right}>
              <button className={styles.actionBtn} onClick={handleShare}>🔗 Share</button>
              <button className={styles.actionBtn} onClick={() => setShowEditor(true)}>✂️ Edit</button>
              <button className={styles.downloadBtn} onClick={handleDownload} title="Download">⬇️</button>
            </div>
          </div>
        </div>
      </div>

      {showEditor && (
        <div className={styles.editorOverlay}>
          <div className={styles.editorModal}>
            <div className={styles.modalHeader}>
              <h3>Pro-Grade AI Editor</h3>
              <button className={styles.closeBtn} onClick={() => setShowEditor(false)}>×</button>
            </div>
            <div className={styles.editContent}>
              <div className={styles.editSection}>
                 <label>AI ENHANCEMENT</label>
                 <div className={styles.toggleRow}>
                   <span>Upscale to 4K</span>
                   <input type="checkbox" defaultChecked />
                 </div>
                 <div className={styles.toggleRow}>
                   <span>Frame Interpolation (60fps)</span>
                   <input type="checkbox" />
                 </div>
              </div>
              <div className={styles.editSection}>
                 <label>FILTERS</label>
                 <div className={styles.filterGrid}>
                   <div className={styles.filterCard}>None</div>
                   <div className={styles.filterCard}>Cinematic</div>
                   <div className={styles.filterCard}>Vintage</div>
                   <div className={styles.filterCard}>Anime</div>
                 </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.secondaryBtn} onClick={() => setShowEditor(false)}>Cancel</button>
              <button className={styles.primaryBtn} onClick={() => setShowEditor(false)}>Apply & Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
