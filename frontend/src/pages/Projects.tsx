import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { organizationService } from '../services/organization.service';
import type { OrganizationResponse } from '../services/organization.service';
import { projectService } from '../services/project.service';
import type { ProjectResponse } from '../services/project.service';

export default function Projects() {
  const [organizations, setOrganizations] = useState<OrganizationResponse[]>([]);
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showOrgForm, setShowOrgForm] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectKey, setNewProjectKey] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const orgs = await organizationService.getUserOrganizations();
      setOrganizations(orgs);
      
      if (orgs.length > 0) {
        const projs = await projectService.getOrganizationProjects(orgs[0].id);
        setProjects(projs);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await organizationService.createOrganization({ name: newOrgName, description: 'Default org' });
      setShowOrgForm(false);
      setNewOrgName('');
      fetchData();
    } catch (error) {
      console.error('Failed to create org', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (organizations.length === 0) return;
    try {
      await projectService.createProject({
        name: newProjectName,
        key: newProjectKey.toUpperCase(),
        description: 'New Project',
        organizationId: organizations[0].id
      });
      setShowProjectForm(false);
      setNewProjectName('');
      setNewProjectKey('');
      fetchData();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {organizations.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to DevTrack!</h2>
          <p className="text-gray-500 mb-8">To get started, you need to create an Organization.</p>
          
          {!showOrgForm ? (
            <button 
              onClick={() => setShowOrgForm(true)}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              Create My Organization
            </button>
          ) : (
            <form onSubmit={handleCreateOrg} className="max-w-md mx-auto glass p-6 rounded-2xl animate-slide-up">
              <input
                type="text"
                required
                placeholder="Organization Name"
                className="w-full mb-4 rounded-xl border border-gray-200 bg-white/50 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
              <button type="submit" className="w-full rounded-xl bg-brand-600 py-3 text-white font-semibold hover:bg-brand-700 transition-colors">
                Create
              </button>
            </form>
          )}
        </div>
      ) : (
        <>
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500 mt-1">Organization: {organizations[0].name}</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button 
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 sm:w-auto"
              >
                {showProjectForm ? 'Cancel' : 'Create Project'}
              </button>
            </div>
          </div>

          {showProjectForm && (
            <form onSubmit={handleCreateProject} className="glass p-6 rounded-2xl animate-slide-up flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Project Name</label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Project Key</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  placeholder="e.g. PAY"
                  className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2.5 text-gray-900 uppercase focus:ring-2 focus:ring-brand-500/20 outline-none"
                  value={newProjectKey}
                  onChange={(e) => setNewProjectKey(e.target.value)}
                />
              </div>
              <button type="submit" className="rounded-xl bg-brand-600 px-6 py-2.5 text-white font-semibold hover:bg-brand-700 transition-colors h-[46px]">
                Save
              </button>
            </form>
          )}
          
          {projects.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl border border-dashed border-gray-300">
              <p className="text-gray-500">No projects yet. Create one above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, index) => (
                <div key={project.id} className="relative flex flex-col space-x-3 rounded-2xl glass px-6 py-5 hover:border-brand-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up cursor-pointer group" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="min-w-0 flex-1">
                    <Link to={`/projects/${project.id}`} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{project.name}</p>
                        <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded">{project.key}</span>
                      </div>
                      <p className="truncate text-sm text-gray-500">{project.description}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
