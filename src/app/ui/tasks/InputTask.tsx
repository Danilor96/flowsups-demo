'use client';

export function InputTask({
  action,
  task,
  setTask,
  taskTitle,
  setTaskTitle,
}: {
  action: any;
  task: any;
  setTask: any;
  taskTitle: any;
  setTaskTitle: any;
}) {
  return (
    <form
      action={action}
      className="flex flex-col items-center justify-center gap-2 p-2 border border-gray-300 rounded"
    >
      <label htmlFor="title" className="w-full">
        Title:
      </label>
      <input
        type="text"
        id="title"
        placeholder="Close windows"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        className="w-full p-1 border border-blue-200 outline-none"
      />
      <label htmlFor="descr" className="w-full">
        Description:
      </label>
      <input
        type="text"
        id="descr"
        placeholder="Close red and yellow window"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className="w-full p-1 border border-blue-200 outline-none"
      />
      <button type="submit" className="p-1 border border-blue-200 rounded w-fit">
        Send task
      </button>
    </form>
  );
}
