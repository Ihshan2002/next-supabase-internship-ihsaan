'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/hooks/useTasks'
import { supabase } from '@/lib/supabaseClient'

interface EditState {
  [taskId: string]: {
    isEditing: boolean
    title: string
    description: string
  }
}

export default function DashboardPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)

  const { tasks, addTask, updateTask, deleteTask, loading } = useTasks(userId || undefined)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [editState, setEditState] = useState<EditState>({})

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

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setUserId(null)
        setUserEmail(null)
        router.push('/login')
      } else {
        setUserId(session.user.id)
        setUserEmail(session.user.email ?? '')
      }
    })

    return () => {
      subscription?.subscription?.unsubscribe?.()
    }
  }, [router])

  const handleAdd = async () => {
    if (!title.trim() || !userId) return
    await addTask({ title, description, completed: false, user_id: userId })
    setTitle('')
    setDescription('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUserId(null)
    setUserEmail(null)
    router.push('/login')
  }

  if (loadingUser) return <p>Loading user...</p>

  const startEditing = (taskId: string, title: string, description: string) => {
    setEditState(prev => ({
      ...prev,
      [taskId]: { isEditing: true, title, description }
    }))
  }

  const cancelEditing = (taskId: string) => {
    setEditState(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], isEditing: false }
    }))
  }

  const saveEditing = async (taskId: string) => {
    const state = editState[taskId]
    if (state) {
      await updateTask(taskId, { title: state.title, description: state.description })
      cancelEditing(taskId)
    }
  }

  if (!tasks) return null

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-8 space-y-6">
      {/* Header */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{userEmail ?? 'User'}'s Tasks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Add Task */}
      <div className="w-full max-w-3xl bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-6 space-y-3">
        <input
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border p-3 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="w-full max-w-3xl space-y-4">
        {loading && <p className="text-gray-600">Loading tasks...</p>}
        {!loading && tasks.length === 0 && <p className="text-gray-600">No tasks yet.</p>}

        {tasks.map(task => {
          const editing = editState[task.id]?.isEditing
          const editTitle = editState[task.id]?.title ?? task.title
          const editDescription = editState[task.id]?.description ?? task.description

          return (
            <div key={task.id} className="bg-white/90 backdrop-blur-md shadow-md rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                {editing ? (
                  <input
                    value={editTitle}
                    onChange={e =>
                      setEditState(prev => ({
                        ...prev,
                        [task.id]: { ...prev[task.id], title: e.target.value }
                      }))
                    }
                    className="border p-1 rounded w-2/3"
                  />
                ) : (
                  <h3 className={`font-semibold text-lg ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                )}
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => updateTask(task.id, { completed: !task.completed })}
                />
              </div>

              {editing ? (
                <textarea
                  value={editDescription}
                  onChange={e =>
                    setEditState(prev => ({
                      ...prev,
                      [task.id]: { ...prev[task.id], description: e.target.value }
                    }))
                  }
                  className="border p-1 rounded w-full mt-1"
                />
              ) : (
                <p className="text-gray-700">{task.description}</p>
              )}

              <div className="flex gap-3 mt-2">
                {editing ? (
                  <>
                    <button
                      onClick={() => saveEditing(task.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-colors text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => cancelEditing(task.id)}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded shadow hover:bg-gray-400 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEditing(task.id, task.title, task.description)}
                    className="bg-blue-500 text-white px-3 py-1 rounded shadow hover:bg-blue-600 transition-colors text-sm"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded shadow hover:bg-red-600 transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
