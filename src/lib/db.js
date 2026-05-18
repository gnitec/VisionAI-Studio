import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'projects.json');

export const getProjects = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
    return [];
  }
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
};

export const saveProject = (project) => {
  const projects = getProjects();
  const newProject = {
    ...project,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  projects.unshift(newProject);
  fs.writeFileSync(DB_PATH, JSON.stringify(projects, null, 2));
  return newProject;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== parseInt(id));
  fs.writeFileSync(DB_PATH, JSON.stringify(filtered, null, 2));
  return filtered;
};
