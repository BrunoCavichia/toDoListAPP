import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Todo = {
  id: number
  title: string
  completed: boolean
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/todo')
      .then(res => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)
        return res.json()
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTodos(data)
          setError(null)
        } else {
          throw new Error('La respuesta no es un array')
        }
      })
      .catch(() => {
        setError('No se pudieron cargar las tareas')
        setTodos([])
      })
  }, [])

  const addTodo = async () => {
    if (!newTodo.trim()) return
    try {
      const response = await fetch('/api/todo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo, isCompleted: false }),
      })
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      const created = await response.json()
      setTodos(prev => [...prev, created])
      setNewTodo('')
      setError(null)
    } catch {
      setError('No se pudo agregar la tarea')
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`/api/todo/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      setTodos(prev => prev.filter(todo => todo.id !== id))
      setError(null)
    } catch {
      setError('No se pudo borrar la tarea')
    }
  }

  const toggleCompleted = async (id: number) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: todo.id,
          title: todo.title,
          isCompleted: !todo.completed,
        }),
      })
      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`)
      setTodos(prev =>
        prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
      setError(null)
    } catch {
      setError('No se pudo actualizar la tarea')
    }
  }

  return (
<div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 flex items-center justify-center px-4 font-sans">
  <motion.main
    initial={{ opacity: 0, y: -30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    className="backdrop-blur-xl bg-white/80 border border-gray-200 text-black w-full max-w-2xl rounded-3xl shadow-2xl p-10"
  >
    <h1 className="text-5xl font-normal text-center tracking-tight mb-8 text-blue-800">
      Lista de Tareas
    </h1>

    {error && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
        role="alert"
      >
        <strong className="font-bold">¡Error!</strong>{' '}
        <span>{error}</span>
      </motion.div>
    )}

    <section className="flex gap-4 mb-10">
      <input
        type="text"
        placeholder="Agrega una nueva tarea..."
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
        className="flex-grow px-4 py-3 bg-white border border-gray-300 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={addTodo}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
      >
        Agregar
      </motion.button>
    </section>

    <ul className="space-y-4">
      {todos.length === 0 ? (
        <motion.li
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-500 italic"
        >
          <div className="text-4xl mb-2">🧘‍♂️</div>
          Nada por hacer... Relájate.
        </motion.li>
      ) : (
        <AnimatePresence>
          {todos.map(todo => (
            <motion.li
              key={todo.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <label className="flex items-center gap-4 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo.id)}
                  className="h-5 w-5 accent-blue-600"
                />
                <span
                  className={`text-lg ${
                    todo.completed
                      ? 'line-through text-gray-400'
                      : 'text-gray-800'
                  }`}
                >
                  {todo.title}
                </span>
              </label>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700 text-xl ml-4 transition"
              >
                🗑️
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      )}
    </ul>
  </motion.main>
</div>

  )
}

export default App
