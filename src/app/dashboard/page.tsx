'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/useTasks'
import { supabase } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const { tasks, addTask, updateTask, deleteTask, loading } = useTasks(userId || undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // ✅ Check if user is logged in
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error || !data?.user) {
        router.push('/login')
        return
      }

      setUserId(data.user.id)
      setUserEmail(data.user.email ?? '')
      setLoadingUser(false)
    }

    fetchUser()

    // ✅ Listen for auth changes (login/logout)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        // Logged out
        setUserId(null)
        setUserEmail(null)
        router.push('/login')
      } else {
        // Logged in
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? '')
      }
    })

    return () => {
      subscription?.subscription?.unsubscribe?.()
    }
  }, [router])

  // ✅ Add task
  const handleAdd = async () => {
    if (!title.trim() || !userId) return
    await addTask({ title, description, completed: false, user_id: userId })
    setTitle('')
    setDescription('')
  }

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserId(null)
    setUserEmail(null)
    router.push('/login')
  }

  if (loadingUser) return <p>Loading user...</p>

  // ✅ Dashboard UI
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">✅ {userEmail ?? 'User'}'s Tasks</h1>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
      <div className="flex flex-col gap-2 bg-white p-4 rounded shadow">
        <input
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="grid gap-3">
        {loading && <p>Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p>No tasks yet.</p>}

        {tasks.map(task => (
          <div key={task.id} className="border p-4 rounded bg-white">
            <div className="flex justify-between items-center">
              <h3
                className={`font-semibold text-lg ${
                  task.completed ? 'line-through text-gray-400' : ''
                }`}
              >
                {task.title}
              </h3>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  updateTask(task.id, { completed: !task.completed })
                }
              />
            </div>

            <p className="text-gray-700">{task.description}</p>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateTask(task.id, { title: task.title + ' ✏️' })}
                className="text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
