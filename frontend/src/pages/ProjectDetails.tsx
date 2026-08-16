import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { projectService } from '../services/project.service';
import type { ProjectResponse } from '../services/project.service';
import { issueService } from '../services/issue.service';
import type { IssueResponse, IssueStatus, IssueType, IssuePriority } from '../services/issue.service';
import IssueModal from '../components/IssueModal';

interface KanbanData {
  columns: {
    [key in IssueStatus]: {
      id: IssueStatus;
      title: string;
      issueIds: number[];
    }
  };
  issues: {
    [id: number]: IssueResponse;
  };
  columnOrder: IssueStatus[];
}

const initialData: KanbanData = {
  columns: {
    'TODO': { id: 'TODO', title: 'TO DO', issueIds: [] },
    'IN_PROGRESS': { id: 'IN_PROGRESS', title: 'IN PROGRESS', issueIds: [] },
    'IN_REVIEW': { id: 'IN_REVIEW', title: 'IN REVIEW', issueIds: [] },
    'TESTING': { id: 'TESTING', title: 'TESTING', issueIds: [] },
    'DONE': { id: 'DONE', title: 'DONE', issueIds: [] },
    'CLOSED': { id: 'CLOSED', title: 'CLOSED', issueIds: [] },
  },
  issues: {},
  columnOrder: ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'TESTING', 'DONE', 'CLOSED'],
};

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  
  const [project, setProject] = useState<ProjectResponse | null>(null);
  const [data, setData] = useState<KanbanData | null>(initialData);
  const [loading, setLoading] = useState(true);
  
  const [selectedIssue, setSelectedIssue] = useState<IssueResponse | null>(null);

  const [showIssueForm, setShowIssueForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<IssueType>('TASK');
  const [newPriority, setNewPriority] = useState<IssuePriority>('MEDIUM');

  useEffect(() => {
    if (projectId) {
      fetchProjectData();
    }
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const proj = await projectService.getProject(projectId);
      setProject(proj);

      const fetchedIssues = await issueService.getProjectIssues(projectId);
      
      const newData = JSON.parse(JSON.stringify(initialData)) as KanbanData;
      
      fetchedIssues.forEach(issue => {
        newData.issues[issue.id] = issue;
        if (newData.columns[issue.status]) {
          newData.columns[issue.status].issueIds.push(issue.id);
        } else {
          // fallback if status is somehow missing
          newData.columns['TODO'].issueIds.push(issue.id);
        }
      });

      setData(newData);
    } catch (error) {
      console.error('Failed to fetch project data', error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!data) return;
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId as IssueStatus];
    const finishColumn = data.columns[destination.droppableId as IssueStatus];

    if (startColumn === finishColumn) {
      const newIssueIds = Array.from(startColumn.issueIds);
      newIssueIds.splice(source.index, 1);
      newIssueIds.splice(destination.index, 0, Number(draggableId));

      const newColumn = { ...startColumn, issueIds: newIssueIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving from one column to another
    const startIssueIds = Array.from(startColumn.issueIds);
    startIssueIds.splice(source.index, 1);
    const newStart = { ...startColumn, issueIds: startIssueIds };

    const finishIssueIds = Array.from(finishColumn.issueIds);
    finishIssueIds.splice(destination.index, 0, Number(draggableId));
    const newFinish = { ...finishColumn, issueIds: finishIssueIds };

    // Optimistically update UI
    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });

    // Call API to update backend
    try {
      await issueService.updateIssueStatus(Number(draggableId), newFinish.id as IssueStatus);
    } catch (error) {
      console.error("Failed to update status, reverting...");
      fetchProjectData(); // revert on fail
    }
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    try {
      await issueService.createIssue({
        projectId,
        title: newTitle,
        description: '',
        type: newType,
        priority: newPriority
      });
      setShowIssueForm(false);
      setNewTitle('');
      fetchProjectData();
    } catch (err: any) {
      console.error("Failed to create issue", err);
      alert(err.response?.data?.message || err.message || 'Failed to create issue');
    }
  };

  if (loading) return <div className="p-8 text-gray-500 animate-pulse">Loading Project...</div>;
  if (!project || !data) return <div className="p-8 text-red-500">Project not found</div>;

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Project: {project.name}</h1>
          <span className="text-sm font-medium text-gray-500 bg-white/50 px-2 py-1 rounded border border-gray-200 shadow-sm mt-1 inline-block">Key: {project.key}</span>
        </div>
        <button 
          onClick={() => setShowIssueForm(!showIssueForm)}
          className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
        >
          {showIssueForm ? 'Cancel' : 'Create Issue'}
        </button>
      </div>

      {showIssueForm && (
        <form onSubmit={handleCreateIssue} className="glass p-5 rounded-2xl animate-slide-up flex gap-3 items-end mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Issue Title</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-brand-500/20 outline-none"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2 text-gray-900 outline-none"
              value={newType}
              onChange={(e) => setNewType(e.target.value as IssueType)}
            >
              <option value="TASK">Task</option>
              <option value="BUG">Bug</option>
              <option value="STORY">Story</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <select
              className="w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2 text-gray-900 outline-none"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as IssuePriority)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <button type="submit" className="rounded-xl bg-brand-600 px-6 py-2 text-white font-semibold hover:bg-brand-700 transition-colors h-[42px]">
            Save
          </button>
        </form>
      )}

      <div className="flex-1 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full space-x-4 items-start min-h-[500px]">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const issues = column.issueIds.map((issueId) => data.issues[issueId]);

              return (
                <div key={column.id} className="flex flex-col w-80 glass rounded-2xl flex-shrink-0 max-h-full animate-slide-in-right border border-white/40" style={{ animationDelay: `${data.columnOrder.indexOf(columnId) * 100}ms` }}>
                  <div className="px-5 py-4 border-b border-gray-200/50 flex justify-between items-center bg-white/40 rounded-t-2xl">
                    <h3 className="text-sm font-bold text-gray-800 tracking-wide">
                      {column.title}
                    </h3>
                    <span className="bg-white/60 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                      {issues.length}
                    </span>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 p-3 overflow-y-auto min-h-[150px]"
                      >
                        {issues.map((issue, index) => (
                          <Draggable key={String(issue.id)} draggableId={String(issue.id)} index={index}>
                            {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => setSelectedIssue(issue)}
                                  className="p-4 mb-3 rounded-xl glass border border-white/10 hover:border-brand-500/50 shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded shadow-sm">{issue.issueKey}</div>
                                    <div className="flex gap-2">
                                      {issue.priority === 'CRITICAL' && <span className="w-2 h-2 rounded-full bg-red-500 mt-1"></span>}
                                      {issue.priority === 'HIGH' && <span className="w-2 h-2 rounded-full bg-orange-400 mt-1"></span>}
                                      {issue.type === 'BUG' && <span className="text-xs font-bold text-red-500">BUG</span>}
                                    </div>
                                  </div>
                                  <div className="text-sm font-semibold text-gray-800 leading-snug mb-3">{issue.title}</div>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">{issue.type}</span>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 border border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-gray-500">
                                      {issue.assigneeName ? issue.assigneeName.charAt(0).toUpperCase() : '?'}
                                    </div>
                                  </div>
                                </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
      {selectedIssue && (
        <IssueModal 
          issue={selectedIssue} 
          onClose={() => setSelectedIssue(null)} 
          onUpdate={() => {
            fetchProjectData();
            setSelectedIssue(null);
          }} 
        />
      )}
    </div>
  );
}
