const express = require('express');
const app = express();

const mongoose = require('mongoose');

app.use(express.json());

require('dotenv').config();
const PORT = 5001;


app.listen(PORT,()=>{
    console.log(`Server is runnig at port no. ${PORT}`)
})

mongoose.connect(process.env.DB_URL)
    .then( () =>{
        console.log("Db connected successfully...");
    })
    .catch( (error) => {
        console.log("Db is facing Issue");
        console.log(error);
    });

const StudentSchema = new mongoose.Schema({
    id:{
        type: String,
        required: true,
        unique: true,
    },
    sem1: {
        type: Number,
        required: true,
    },
    sem2: {
        type: Number,
        required: true,
    },
    cgpa: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
      },
});

const Students = mongoose.model("Students",StudentSchema);

app.get("/", (req,res) => {
    res.send("This is your Task1");
})

app.get("/students", (req, res) => {
    Students.find({})
        .then((students) => {
            res.json(students);
        })
        .catch((error) => {
            console.error("Error fetching students:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});


app.post("/students", (req, res) => {
    const { id, sem1, sem2, cgpa } = req.body;

    // Create a new student instance
    const newStudent = new Students({
        id,
        sem1,
        sem2,
        cgpa,
    });

    // Save the new student to the database
    newStudent.save()
        .then(() => {
            res.status(201).json({ message: "Student added successfully" });
        })
        .catch((error) => {
            console.error("Error adding student:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.put("/students/:id", (req, res) => {
    const studentId = req.params.id;
    const { sem1, sem2, cgpa } = req.body;

    Students.findOneAndUpdate(
        { id: studentId },
        { $set: { sem1, sem2, cgpa, updatedAt: Date.now() } },
        { new: true, upsert: true } 
    )
        .then((updatedStudent) => {
            res.json(updatedStudent);
        })
        .catch((error) => {
            console.error("Error updating student:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.patch("/students/:id", (req, res) => {
    const studentId = req.params.id;
    const { sem1, sem2, cgpa } = req.body;

    Students.findOneAndUpdate(
        { id: studentId },
        { $set: { sem1, sem2, cgpa, updatedAt: Date.now() } },
        { new: true } 
    )
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json(updatedStudent);
        })
        .catch((error) => {
            console.error("Error updating student:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});

app.delete("/students/:id", (req, res) => {
    const studentId = req.params.id;

    Students.findOneAndDelete({ id: studentId })
        .then((deletedStudent) => {
            if (!deletedStudent) {
                return res.status(404).json({ error: "Student not found" });
            }
            res.json({ message: "Student deleted successfully" });
        })
        .catch((error) => {
            console.error("Error deleting student:", error);
            res.status(500).json({ error: "Internal Server Error" });
        });
});
