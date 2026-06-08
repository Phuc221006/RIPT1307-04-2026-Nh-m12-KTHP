const fs = require('fs');

async function testSubmit() {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYmI3OWI5LWE2MDItNDA0MC05ZmI3LTQyNjdhODkwNzZkZiIsImVtYWlsIjoidGVzdDIwMjZAdGVzdC5jb20iLCJyb2xlIjoiQ0FORElEQVRFIiwiaWF0IjoxNzgwODY4NjYzLCJleHAiOjE3ODA5NTUwNjN9.OzYGWwcrLSFq1sZywVyKEwQ1YCoHyi03OYxTx78Gef4";
    const res = await fetch("http://localhost:3000/api/v1/applications", {
      method: "POST",
      headers: { 
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        universityId: "123",
        majorId: "123",
        combinationId: "123",
        scoreSubject1: 1,
        scoreSubject2: 2,
        scoreSubject3: 3,
        totalScore: 6,
        priorityObject: "NONE"
      })
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testSubmit();
