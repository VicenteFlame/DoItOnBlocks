import React, { useState, useEffect } from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid';

function DailySchedule() {
  // Estado inicial desde localStorage o array vacío
  const [tasks, setTasks] = useState(() => {
    // Obtener la fecha actual en formato YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    
    // Intentar obtener las tareas del día actual
    const savedTasks = localStorage.getItem('daily-tasks');
    if (savedTasks) {
      const { date, tasks: storedTasks } = JSON.parse(savedTasks);
      // Si las tareas son del día actual, usarlas; si no, empezar con array vacío
      return date === today ? storedTasks : [];
    }
    return [];
  });

  // Efecto para guardar en localStorage y limpiar tareas viejas
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    // Guardar las tareas actuales con la fecha
    localStorage.setItem('daily-tasks', JSON.stringify({
      date: today,
      tasks: tasks
    }));
  }, [tasks]);

  // Generar slots de tiempo para las 24 horas
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, '0')}:00`;
  });

  // Función para marcar tarea completada
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Función para obtener tarea de un tiempo específico
  const getTaskForTime = (time) => {
    return tasks.find(task => task.time === time);
  };

  // Función para agregar nueva tarea
  const addTask = (time, title) => {
    const newTask = {
      id: Date.now(),
      time,
      title,
      completed: false
    };
    setTasks([...tasks, newTask]);
  };

  // Función para eliminar tarea
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">Mi Agenda del Día</h1>
      
      <div className="space-y-2">
        {timeSlots.map((time) => {
          const task = getTaskForTime(time);
          
          return (
            <div key={time} className="flex items-center">
              <div className="w-16 text-sm text-gray-500 mr-4">{time}</div>
              
              {task ? (
                <div className="flex-grow">
                  <div 
                    className={`flex justify-between items-center p-2 rounded-lg ${
                      task.completed 
                        ? 'bg-green-100' 
                        : 'bg-blue-100'
                    }`}
                  >
                    <div 
                      className="flex-grow cursor-pointer"
                      onClick={() => toggleTask(task.id)}
                    >
                      <span>{task.title}</span>
                      {task.completed && (
                        <CheckIcon className="h-5 w-5 text-green-600 inline ml-2" />
                      )}
                    </div>
                    {!task.completed && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => {
                    const title = prompt(`Agregar tarea para ${time}`);
                    if (title) addTask(time, title);
                  }}
                  className="flex-grow p-2 border-2 border-dashed border-gray-300 text-center rounded-lg hover:border-blue-300 cursor-pointer"
                >
                  + Agregar tarea
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailySchedule;