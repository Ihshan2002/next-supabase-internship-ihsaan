interface TaskItemProps {
  title: string
  completed?: boolean
}

export default function TaskItem({ title, completed }: TaskItemProps) {
  return (
    <div className="flex items-center justify-between border p-3 rounded bg-white">
      <span className={completed ? 'line-through text-gray-400' : ''}>{title}</span>
      <input type="checkbox" checked={completed} readOnly />
    </div>
  )
}
