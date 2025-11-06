'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { Task } from '@/types/task'

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  // 🟢 Fetch tasks
  async function fetchTasks() {
    console.log('📡 Fetching tasks for user:', userId)
    setLoading(true)
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) console.error('❌ Fetch error:', error)
    else console.log('✅ Fetched tasks:', data)

    setTasks(data || [])
    setLoading(false)
  }

  // 🟢 Add task
  async function addTask(task: Omit<Task, 'id' | 'created_at'>) {
    console.log('🟢 Adding task:', task)
    const { data, error } = await supabase.from('tasks').insert(task).select('*')
    if (error) console.error('❌ Add error:', error)
    else console.log('✅ Task added:', data)
    await fetchTasks()
  }

// 🟡 Update task
async function updateTask(id: string, updates: Partial<Task>) {
  console.log("✏️ Updating task", id, "with", updates)
  const { error } = await supabase.from('tasks').update(updates).eq('id', id)
  if (error) {
    console.error('❌ Update error:', error)
    return
  }

  console.log("✅ Task updated on Supabase. Updating local state...")
  setTasks(prev =>
    prev.map(t => (t.id === id ? { ...t, ...updates } : t))
  )
}


  // 🔴 Delete task
  async function deleteTask(id: string) {
    console.log('🗑 Deleting task:', id)
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (error) console.error('❌ Delete error:', error)
    else console.log('✅ Task deleted')
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  useEffect(() => {
    if (userId) fetchTasks()
  }, [userId])

  return { tasks, loading, addTask, updateTask, deleteTask, fetchTasks }
}
