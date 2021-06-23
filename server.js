const express = require('express')
const app = express()
const port = 3000
const students = require('./students.json')
const users = []

app.use(express.json())

// GET /students - returns a list of all students
// this endpoint, optionally, accepts query parameters
// GET /students?search=<query> - returns a list of students filtered on name matching the given query
app.get('/students', (req, res) => {
  let studentName = Object.values(req.query)
  let result = []
  if (studentName.length > 0) {
    result = students.filter(student => student.name.toLowerCase() === studentName[0].toLowerCase());

  }
  if (result.length > 0) {
    return res.status(200).send(result)
  }
  return res.status(200).send(students)
})

// GET /students/:studentId - returns details of a specific student by student id
app.get('/students/:studentId', (req, res) => {
  students.forEach((student) => {
    if (student.id === Number(req.params.studentId)) {
      return res.status(200).send(student)
    }
  })
  return res.status(200).send('Not a valid Id')
})


// GET /grades/:studentId - returns all grades for a given student by student id
app.get('/grades/:studentId', (req, res) => {
  students.forEach((student) => {
    if (student.id === Number(req.params.studentId)) {
      return res.status(200).send(student.grades)
    }
  })
  return res.status(200).send('Not a valid Id')
})

// POST /grades - records a new grade, returns success status in JSON response 
// (meaning you do not need to actually store the grade in a database. You do need to validate 
// that the user supplied at least a grade, and a studentId)
app.post('/grades', (req, res) => {
  let newGrade = req.body

  if (!("grade" in newGrade) || !("studentId" in newGrade) || (newGrade.studentId === "") || (newGrade.grade === "")) {
    return res.status(400).send("missing data")
  }

  students.forEach((student) => {
    if (student.id === newGrade.studentId) {
      student.grades.push(newGrade.grade)
    }
  })
  res.status(200).send('Added student')
})

// POST /register - creates a new user, returns success status in JSON response 
// (meaning you do not need to actually store the user info in a database. You do need 
//  to validate that the user supplied username and email)
app.post('/register', (req, res) => {
  let newUser = req.body
  if (!("username" in newUser) || !("email" in newUser) || (newUser.username === "") || (newUser.email === "")) {
    return res.status(400).send("missing data")
  }
  users.push(newUser)
  return res.status(200).send('User Added')
})


app.get('/', (req, res) => {
  return res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})