import { useState, useEffect } from 'react'
import './App.css'

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
      setTodos([...todos, created])
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
      setTodos(todos.filter(todo => todo.id !== id))
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
      setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
      setError(null)
    } catch {
      setError('No se pudo actualizar la tarea')
    }
  }

  return (
    <div className="app-container">
      <main className="main-content">
        <h1>ToDo App</h1>

        {error && <p className="error-message">{error}</p>}

        <section className="todo-input-section">
          <input
            type="text"
            placeholder="Nueva tarea"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTodo()}
            aria-label="Nueva tarea"
            className="todo-input"
          />
          <button onClick={addTodo} className="btn btn-primary" aria-label="Agregar tarea">
            Agregar
          </button>
        </section>

        <ul className="todo-list" role="list">
          {todos.length === 0 && <li className="empty-message">No hay tareas todavía</li>}
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <label className="todo-label">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompleted(todo.id)}
                  className="todo-checkbox"
                  aria-checked={todo.completed}
                />
                <span className={todo.completed ? 'completed' : ''}>{todo.title}</span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="btn btn-danger"
                aria-label={`Borrar tarea ${todo.title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}

export default App
