import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const [showJobs, setShowJobs] = useState(false);
  const [showGrades, setShowGrades] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // preload effect
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="App">
        <h2>Loading portfolio...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Josh Park</h1>
        <p>Computer Science Student at [Your University]</p>
        <p>GPA: 3.87</p>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => setShowGrades(!showGrades)}
            className="dropdown-button"
          >
            {showGrades ? "Hide Classes & Grades" : "Show Classes & Grades"}
          </button>
          {showGrades && (
            <div className="dropdown">
              <ul>
                <li>CS 323: A</li>
                <li>CS 214: A</li>
                <li>Math 428: A</li>
                <li>CS 352: A</li>
              </ul>
            </div>
          )}

          <button
            onClick={() => setShowJobs(!showJobs)}
            className="dropdown-button"
          >
            {showJobs ? "Hide Work Experience" : "Show Work Experience"}
          </button>
          {showJobs && (
            <div className="dropdown">
              <ul>
                <li>Software Intern @ TechCorp (Summer 2024)</li>
                <li>IT Assistant @ University (2023–2024)</li>
                <li>Freelance Developer (2022–Present)</li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
