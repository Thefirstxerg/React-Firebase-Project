import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { deleteProject } from '../utils/firestore';
import Navbar from '../components/Navbar';
import EditProjectModal from '../components/EditProjectModal';
import { v4 as uuidv4 } from 'uuid';

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('createdAt'); // 'createdAt', 'alphabetical', 'completed'

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "projects", projectId),
      (doc) => {
        if (doc.exists()) {
          setProject({ id: doc.id, ...doc.data() });
        } else {
          setError('Project not found');
        }
        setLoading(false);
      },
      (err) => {
        setError('Failed to load project: ' + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task = {
      taskId: uuidv4(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    try {
      await updateDoc(doc(db, "projects", projectId), {
        tasks: arrayUnion(task)
      });
      setNewTask('');
    } catch (err) {
      setError('Failed to add task: ' + err.message);
    }
  };

  const handleToggleTask = async (taskId) => {
    const updatedTasks = project.tasks.map(task => {
      if (task.taskId === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    try {
      await updateDoc(doc(db, "projects", projectId), {
        tasks: updatedTasks
      });
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    try {
      await updateDoc(doc(db, "projects", projectId), {
        tasks: arrayRemove(taskToDelete)
      });
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete project: ' + err.message);
      }
    }
  };

  const sortTasks = (tasks) => {
    return [...tasks].sort((a, b) => {
      switch (sortOrder) {
        case 'alphabetical':
          return a.text.localeCompare(b.text);
        case 'completed':
          return (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
        case 'createdAt':
        default:
          return a.createdAt > b.createdAt ? -1 : 1;
      }
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mt-4 text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-danger">{error}</div>
        </div>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <div className="container mt-4">
          <div className="alert alert-warning">Project not found</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <button 
          className="btn btn-outline-primary mb-3"
          onClick={() => navigate('/dashboard')}
        >
          ← Back to Dashboard
        </button>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>{project.title}</h1>
          <div>
            <button 
              className="btn btn-primary me-2"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Project
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleDeleteProject}
            >
              Delete Project
            </button>
          </div>
        </div>

        <p className="lead mb-4">{project.description}</p>

        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="card-title mb-0">Tasks</h5>
              <select 
                className="form-select w-auto"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="createdAt">Sort by Date</option>
                <option value="alphabetical">Sort Alphabetically</option>
                <option value="completed">Sort by Completion</option>
              </select>
            </div>

            <form onSubmit={handleAddTask} className="mb-3">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add a new task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">Add Task</button>
              </div>
            </form>

            <ul className="list-group">
              {sortTasks(project.tasks).map(task => (
                <li 
                  key={task.taskId}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.taskId)}
                      id={task.taskId}
                    />
                    <label 
                      className="form-check-label"
                      style={{ textDecoration: task.completed ? 'line-through' : 'none' }}
                      htmlFor={task.taskId}
                    >
                      {task.text}
                    </label>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <EditProjectModal 
        project={project}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
}

export default ProjectDetail;
