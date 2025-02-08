const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3000;
const COMMENTS_FILE = "comments.js";

app.use(express.json()); // Парсимо JSON
app.use(cors()); // Дозволяємо крос-доменні запити

// Віддаємо всі статичні файли (CSS, JS, IMG) прямо з кореневої папки
app.use(express.static(__dirname));

app.get("/", (req, res) => {// Віддавати index.html при відкритті http://localhost:3000/
  res.sendFile(path.join(__dirname, "index.html"));
});

// Якщо файлу коментарів немає — створюємо його
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, "const comments = [];\n", "utf8");
}

app.post("/add-comment", (req, res) => {
  
    fs.readFile(COMMENTS_FILE, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return res.status(500).json({ success: false, message: "Error reading file" });
      }
  
      let commentsArray = [];
      try {
        const jsonData = data.replace(/const comments =|\s*;/g, "").trim();
        commentsArray = JSON.parse(jsonData || "[]");
      } catch (error) {
        console.error("❌ JSON parsing error! We clean the file...");
        fs.writeFileSync(COMMENTS_FILE, "const comments = [];\n", "utf8");
        return res.status(500).json({ success: false, message: "The comments file was corrupted. It's cleared, try again!" });
      }
  
      commentsArray.push(req.body);
      const updatedContent = `const comments = ${JSON.stringify(commentsArray, null, 2)};`;
  
      fs.writeFile(COMMENTS_FILE, updatedContent, "utf8", (err) => {
        if (err) {
          console.error("Error writing to file:", err);
          return res.status(500).json({ success: false, message: "Error writing to file" });
        }
        res.json({ success: true, message: "Comment saved!" });
      });
    });
  });
  
  // RESERVATION
  const RESERVATIONS_FILE = "reservation.json";
  // Якщо файлу бронювання немає — створюємо його
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    fs.writeFileSync(RESERVATIONS_FILE, "[]", "utf8");
  }
  
  app.get("/reservations", (req, res) => {
    fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(500).json({ message: "Error reading reservations" });
        }
        let reservations = [];
        try {
            reservations = JSON.parse(data || "[]"); // Коректний парсинг JSON
        } catch (error) {
            console.error("❌ JSON parsing error in reservations file:", error);
            return res.status(500).json({ message: "Error processing reservation file" });
        }
        res.json(reservations);
    });
});

app.get("/:partial", (req, res) => {
  const partialPath = path.join(__dirname, req.params.partial + ".html");

  if (fs.existsSync(partialPath)) {
      res.sendFile(partialPath);
  } else {
      res.status(404).send("Partial not found");
  }
});

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '/')));
  app.use(cors());

// Функція перевірки конфлікту за часом
function isConflict(start1, end1, start2, end2) {
  return !(end1 <= start2 || start1 >= end2);
}

app.post("/book-computer", (req, res) => {
  const { selectedComputers, userName, userPhone, startTime, endTime } = req.body;

  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
      if (err) {
          console.error("Error reading file:", err);
          return res.status(500).json({ success: false, message: "Error reading file" });
      }

      let reservations = [];
      try {
          reservations = JSON.parse(data || "[]");
      } catch (error) {
          console.error("❌ JSON injured! We drop the file...");
          fs.writeFileSync(RESERVATIONS_FILE, "[]", "utf8");
          return res.status(500).json({ success: false, message: "The reservation file is corrupted, please try again." });
      }

      for (const reservation of reservations) {// Перевірка на конфлікти
          if (selectedComputers.includes(reservation.computerId) &&
              isConflict(startTime, endTime, reservation.startTime, reservation.endTime)) {
              return res.status(400).json({ 
                  success: false, 
                  message: ` Computer ${reservation.computerId} is busy from ${reservation.startTime} to ${reservation.endTime}!` 
              });
          }
      }

      const newReservations = selectedComputers.map(computerId => ({
          computerId,
          userName,
          userPhone,
          startTime,
          endTime
      }));

      reservations.push(...newReservations);

      fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf8", (err) => {
          if (err) {
              return res.status(500).json({ success: false, message: "Error writing to file" });
          }
          res.json({ success: true, message: "Reservation successfully created!" });
      });
  });
});

  app.listen(PORT, () => {
    console.log(`🚀 The server is running: http://localhost:${PORT}`);
  });