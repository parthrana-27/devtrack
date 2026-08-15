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
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-6 sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Project: Payment Gateway</h1>
        <button className="mt-4 sm:mt-0 inline-flex items-center justify-center rounded-md border border-transparent bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700">
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
                <div key={column.id} className="flex flex-col w-80 bg-gray-100 rounded-lg flex-shrink-0 max-h-full">
                  <h3 className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-200 rounded-t-lg">
                    {column.title}
                  </h3>
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
                                className="p-4 mb-2 bg-white border border-gray-200 rounded shadow-sm hover:border-brand-500"
                              >
                                <div className="text-xs text-gray-500 mb-1">{issue.id}</div>
                                <div className="text-sm font-medium text-gray-900">{issue.content}</div>
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
