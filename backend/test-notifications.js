const fs = require('fs');

async function testNotifications() {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRmYmI3OWI5LWE2MDItNDA0MC05ZmI3LTQyNjdhODkwNzZkZiIsImVtYWlsIjoidGVzdDIwMjZAdGVzdC5jb20iLCJyb2xlIjoiQ0FORElEQVRFIiwiaWF0IjoxNzgwODY4NjYzLCJleHAiOjE3ODA5NTUwNjN9.OzYGWwcrLSFq1sZywVyKEwQ1YCoHyi03OYxTx78Gef4";
    const res = await fetch("http://localhost:3000/api/notifications?role=student", {
      headers: { Authorization: "Bearer " + token }
    });
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Data:", data);
  } catch (err) {
    console.error("Error:", err);
  }
}

testNotifications();
