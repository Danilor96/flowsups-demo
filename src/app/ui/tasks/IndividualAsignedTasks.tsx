'use client';

export function IndividualAsignedTasks({ assignedTasks }: { assignedTasks: any }) {
  return (
    <ul>
      {assignedTasks != null
        ? assignedTasks.map((task: any) => (
            <li key={task.id}>
              <p>
                <b>{task.title}</b>
              </p>
              <p>{task.description}</p>
              <p>{task.created_at}</p>
              <p>{task.finished_at}</p>
              <p>{task.task_status.status}</p>
            </li>
          ))
        : 'No tasks assigned'}
    </ul>
  );
}
