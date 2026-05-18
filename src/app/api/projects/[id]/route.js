import { NextResponse } from 'next/server';
import { getProjects, deleteProject } from '@/lib/db';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const projects = getProjects();
    const project = projects.find(p => p.id === parseInt(id));
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const projects = deleteProject(id);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
