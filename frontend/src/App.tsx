import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteTodoByIdMutation,
  getTodoOptions,
  postTodoMutation,
  putTodoByIdMutation,
} from "./client/@tanstack/react-query.gen";
import { putTodoToggleAll, type TodoItem } from "./client";

function App() {
  const queryClient = useQueryClient();
  const [newTodo, setNewTodo] = useState("");

  const getTodosOptions = getTodoOptions();
  const getTodosOptionsQueryKey = getTodosOptions.queryKey;

  // FETCH: Obtener todos los todos
  const {
    data: todos = [],
    isLoading,
    error,
  } = useQuery({
    ...getTodosOptions,
  });

  const addTodoMutation = useMutation({
    //creamos una constante llamada addTodoMutation que va a contener la llamada a useMutation

    ...postTodoMutation(), //con el spread obtenemos la llamada al metodo creado por heyapi
    onSuccess: () =>
      //en caso de exito, lo que hacemos es obtener la key especifica de esta task e invlaidamos las queries para forzar a que si hay un cambio se refresque.
      queryClient.invalidateQueries({ queryKey: getTodosOptionsQueryKey }),
  });

  const deleteTodoMutation = useMutation({
    ...deleteTodoByIdMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getTodosOptionsQueryKey }),
  });

  // MUTATION: Toggle completado
  const toggleTodoMutation = useMutation({
    ...putTodoByIdMutation(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getTodosOptionsQueryKey }),
  });

  const toggleAllTodoMutation = useMutation({
    mutationFn: (options: { body: boolean }) => putTodoToggleAll(options),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: getTodosOptionsQueryKey }),
  });

  const handleAdd = () => {
    //creamos una constante llamada HandleAdd
    const newTodoItem: TodoItem = {
      //dentro tendra otra constante llamada newTodoiTEM QUE SERA UN Objeto de la clase todoItem, dentro le pasamos los campos de dicha clase
      title: newTodo,
      isCompleted: false,
    };

    if (!newTodo.trim()) return; //si  no hay espacios return
    addTodoMutation.mutate({
      // sino llamamos a la constante que creamos arriba con el metodo mutate, dentro le pasamos el body y seteamos el new todo con "" (vacio);
      body: newTodoItem,
    });
    setNewTodo("");
  };

  const handleUpdate = (todo: TodoItem) => {
    const todoId = todo.id ?? 0;

    if (!todoId) return;

    const todoItemToUpdate: TodoItem = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };

    toggleTodoMutation.mutate({
      path: {
        id: todoId,
      },
      body: todoItemToUpdate,
    });
  };

  const handleDelete = (id: TodoItem["id"]) => {
    if (!id) return;
    deleteTodoMutation.mutate({
      path: {
        id,
      },
    });
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = todos.some((todo) => !todo.isCompleted);

    toggleAllTodoMutation.mutate({ body: shouldCompleteAll });
  };

  // Definición de la mutación usando el cliente generado

  if (isLoading) return <p className="text-center mt-10">Cargando...</p>;
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {(error as Error).message}
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-blue-100 flex items-center justify-center px-4 font-sans">
      <motion.main
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="backdrop-blur-xl bg-white/80 border border-gray-200 text-black w-full max-w-2xl rounded-3xl shadow-2xl p-10"
      >
        <h1 className="text-5xl font-normal text-center tracking-tight mb-8 text-blue-800">
          Lista de Tareas
        </h1>

        {addTodoMutation.isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
            role="alert"
          >
            <strong className="font-bold">¡Error!</strong>{" "}
            <span>No se pudo agregar la tarea</span>
          </motion.div>
        )}

        <section className="flex gap-4 mb-10">
          <input
            type="text"
            placeholder="Agrega una nueva tarea..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-grow px-4 py-3 bg-white border border-gray-300 text-gray-800 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg shadow transition"
          >
            Agregar
          </motion.button>
        </section>

        <label className="flex items-center gap-4 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={todos.every((todo) => todo.isCompleted)}
            onChange={() => handleToggleAll()}
            className="h-5 w-5 accent-blue-600"
          />
          <span className="text-lg font-medium">
            {todos.every((todo) => todo.isCompleted)
              ? "Desmarcar todos"
              : "Marcar todos"}
          </span>
        </label>

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
              {todos.map((todo) => (
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
                      checked={todo.isCompleted}
                      onChange={() => handleUpdate(todo)}
                      className="h-5 w-5 accent-blue-600"
                    />
                    <span
                      className={`text-lg ${
                        todo.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </span>
                  </label>

                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(todo.id)}
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
  );
}

export default App;
