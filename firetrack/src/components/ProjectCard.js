import React from 'react';

function ProjectCard({ project, onDelete }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title">{project.title}</h5>
          <button 
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(project.id)}
          >
            Delete
          </button>
        </div>
        <p className="card-text">{project.description}</p>
        <div className="mt-3">
          <h6>Tasks:</h6>
          <ul className="list-group">
            {project.tasks.map(task => (
              <li key={task.taskId} className="list-group-item d-flex justify-content-between align-items-center">
                <span style={{ 
                  textDecoration: task.completed ? 'line-through' : 'none' 
                }}>
                  {task.text}
                </span>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={task.completed}
                    onChange={() => {
                      // Task completion toggle will be implemented later
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
