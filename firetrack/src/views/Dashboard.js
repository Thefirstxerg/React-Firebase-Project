import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import CreateProjectModal from '../components/CreateProjectModal';
import { deleteProject } from '../utils/firestore';
import DataImporter from '../dataImporter';


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const projectsQuery = query(
      collection(db, "projects"),
      where("ownerId", "==", currentUser.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (err) => {
      setError('Failed to load projects: ' + err.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (err) {
        setError('Failed to delete project: ' + err.message);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>My Projects</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            New Project
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row">
            {projects.length === 0 ? (
              <div className="col-12 text-center">
                <p>No projects yet. Create your first project!</p>
              </div>
            ) : (
              projects.map(project => (
                <div key={project.id} className="col-md-6 col-lg-4 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{project.title}</h5>
                      <p className="card-text">{project.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <Link 
                          to={`/project/${project.id}`} 
                          className="btn btn-primary"
                        >
                          View Details
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <DataImporter />  

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

export default Dashboard;
