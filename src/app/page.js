"use client";
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data));
  }, []);

  const deleteItem = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const modifyItem = (project) => {
    const studioMap = {
      'Video-Studio': '/text-to-video',
      'Text-to-Video': '/text-to-video',
      'Talking Avatar': '/talking-avatar',
      'Image-to-Video': '/image-to-video',
      'Image-Studio': '/image-studio',
      'Audio-Studio': '/audio-studio',
      'Creative-Suite': '/creative-suite'
    };
    const path = studioMap[project.type] || '/';
    window.location.href = `${path}?id=${project.id}`;
  };

  const getIcon = (type) => {
    switch(type) {
      case 'Video-Studio':
      case 'Text-to-Video': return '🎬';
      case 'Talking Avatar': return '👤';
      case 'Image-to-Video': return '🎞';
      case 'Image-Studio': return '🎨';
      case 'Audio-Studio': return '🔊';
      case 'Thumbnail-Generation':
      case 'Creative-Suite': return '✨';
      default: return '🌄';
    }
  };

  return (
    <div className="animate-fade-in">
      <header className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Welcome back, Rathin</h1>
          <p className={styles.subtitle}>You have 1 video processing and 3 ready for export.</p>
        </div>
      </header>

      <section className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Projects</span>
          <span className={styles.statValue}>{projects.length}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Storage Used</span>
          <span className={styles.statValue}>2.4 GB</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Credits Left</span>
          <span className={styles.statValue}>Unlimited</span>
        </div>
      </section>

      <section className={styles.projectsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Projects</h2>
          <button className={styles.viewAll}>View All</button>
        </div>

        <div className={styles.projectGrid}>
          {projects.map((project) => (
            <div key={project.id} className={styles.projectCard}>
              <div className={styles.projectActions}>
                <button className={styles.iconBtn} title="Modify" onClick={() => modifyItem(project)}>✏️</button>
                <button className={styles.iconBtn} title="Delete" onClick={() => deleteItem(project.id)}>🗑️</button>
              </div>
              <div className={styles.thumbnail}>
                {project.thumbnailUrl ? (
                  <img src={project.thumbnailUrl} alt={project.title} className={styles.previewImg} />
                ) : getIcon(project.type)}
              </div>
              <div className={styles.projectInfo}>
                <h3 className={styles.projectTitle}>{project.title}</h3>
                <div className={styles.projectMeta}>
                  <span>{project.type}</span>
                  <span className={styles.dot}>•</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={`${styles.status} ${styles.completed}`}>
                  Completed
                </div>
              </div>
            </div>
          ))}
          
          <div className={styles.addProjectCard}>
            <span className={styles.plusIcon}>+</span>
            <span>Create New</span>
          </div>
        </div>
      </section>
    </div>
  );
}
