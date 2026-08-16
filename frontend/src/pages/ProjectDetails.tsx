import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialData = {
  columns: {
    'todo': { id: 'todo', title: 'TODO', issueIds: ['PAY-101', 'PAY-102'] },
    'in-progress': { id: 'in-progress', title: 'IN PROGRESS', issueIds: ['PAY-103'] },
    'done': { id: 'done', title: 'DONE', issueIds: [] },
  },
  issues: {
    'PAY-101': { id: 'PAY-101', content: 'Setup database schema' },
    'PAY-102': { id: 'PAY-102', content: 'Create Auth API' },
    'PAY-103': { id: 'PAY-103', content: 'Implement Stripe integration' },
  },
  columnOrder: ['todo', 'in-progress', 'done'],
};

export default function ProjectDetails() {
  const [data, setData] = useState(initialData);

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    if (startColumn === finishColumn) {
      const newIssueIds = Array.from(startColumn.issueIds);
      newIssueIds.splice(source.index, 1);
      newIssueIds.splice(destination.index, 0, draggableId);

      const newColumn = { ...startColumn, issueIds: newIssueIds };
      setData({ ...data, columns: { ...data.columns, [newColumn.id]: newColumn } });
      return;
    }

    // Moving from one column to another
    const startIssueIds = Array.from(startColumn.issueIds);
    startIssueIds.splice(source.index, 1);
    const newStart = { ...startColumn, issueIds: startIssueIds };

    const finishIssueIds = Array.from(finishColumn.issueIds);
    finishIssueIds.splice(destination.index, 0, draggableId);
    const newFinish = { ...finishColumn, issueIds: finishIssueIds };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Project: Payment Gateway</h1>
        <button className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200">
          Create Issue
        </button>
      </div>

      <div className="flex-1 overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full space-x-4 items-start">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId as keyof typeof data.columns];
              const issues = column.issueIds.map((issueId) => data.issues[issueId as keyof typeof data.issues]);

              return (
                <div key={column.id} className="flex flex-col w-80 glass rounded-2xl flex-shrink-0 max-h-full animate-slide-in-right border border-white/40" style={{ animationDelay: `${data.columnOrder.indexOf(columnId) * 100}ms` }}>
                  <div className="px-5 py-4 border-b border-gray-200/50 flex justify-between items-center">
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
                        className="flex-1 p-2 overflow-y-auto min-h-[150px]"
                      >
                        {issues.map((issue, index) => (
                          <Draggable key={issue.id} draggableId={issue.id} index={index}>
                            {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="p-4 mb-3 bg-white/90 backdrop-blur-sm border border-white/50 rounded-xl shadow-sm hover:shadow-md hover:border-brand-400 transition-all duration-200 group"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded text-brand-700">{issue.id}</div>
                                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 border border-white shadow-sm"></div>
                                  </div>
                                  <div className="text-sm font-semibold text-gray-800 leading-snug">{issue.content}</div>
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
    </div>
  );
}
