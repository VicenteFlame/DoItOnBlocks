import React, { useState, useEffect } from 'react';
import { CheckIcon, TrashIcon } from '@heroicons/react/24/solid';

function DailySchedule() {
  // Estado inicial desde localStorage o array vacío
  const [tasks, setTasks] = useState(() => {
    return loadTasks();
  });

  // Función para cargar tareas verificando la fecha
  function loadTasks() {
    const today = new Date().toISOString().split('T')[0];
    const savedData = localStorage.getItem('daily-tasks');
    
    if (savedData) {
      const { date, tasks: storedTasks } = JSON.parse(savedData);
      // Si las tareas son de un día diferente, retornar array vacío
      return date === today ? storedTasks : [];
    }
    return [];
  }

  // Efecto para guardar en localStorage
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('daily-tasks', JSON.stringify({
      date: today,
      tasks: tasks
    }));
  }, [tasks]);

  // Efecto para verificar cambio de día
  useEffect(() => {
    // Función para verificar la fecha
    const checkDate = () => {
      const currentTasks = loadTasks();
      setTasks(currentTasks);
    };

    // Verificar cada minuto si cambió el día
    const interval = setInterval(() => {
      checkDate();
    }, 60000); // Verificar cada minuto

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

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
      <div className="text-sm text-gray-500 mb-4">
        {new Date().toLocaleDateString()}
      </div>
      
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