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

// Віддавати index.html при відкритті http://localhost:3000/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Обробка запитів на partial-файли (для HTMX)
app.get("/:partial", (req, res) => {
  const partialPath = path.join(__dirname, req.params.partial + ".html");

  if (fs.existsSync(partialPath)) {
    res.sendFile(partialPath);
  } else {
    res.status(404).send("Partial not found");
  }
});

// Якщо файлу коментарів немає — створюємо його
if (!fs.existsSync(COMMENTS_FILE)) {
  fs.writeFileSync(COMMENTS_FILE, "const comments = [];\n", "utf8");
}

app.post("/add-comment", (req, res) => {
    console.log("Запит на додавання коментаря:", req.body);
  
    fs.readFile(COMMENTS_FILE, "utf8", (err, data) => {
      if (err) {
        console.error("Помилка читання файлу:", err);
        return res.status(500).json({ success: false, message: "Помилка читання файлу" });
      }
  
      let commentsArray = [];
      try {
        // Виправлений парсинг JSON
        const jsonData = data.replace(/const comments =|\s*;/g, "").trim();
        commentsArray = JSON.parse(jsonData || "[]");
      } catch (error) {
        console.error("❌ Помилка парсингу JSON! Очищуємо файл...");
        fs.writeFileSync(COMMENTS_FILE, "const comments = [];\n", "utf8");
        return res.status(500).json({ success: false, message: "Файл коментарів було пошкоджено. Він очищений, спробуйте ще раз!" });
      }
  
      commentsArray.push(req.body);
  
      const updatedContent = `const comments = ${JSON.stringify(commentsArray, null, 2)};`;
  
      fs.writeFile(COMMENTS_FILE, updatedContent, "utf8", (err) => {
        if (err) {
          console.error("Помилка запису у файл:", err);
          return res.status(500).json({ success: false, message: "Помилка запису у файл" });
        }
        console.log("✅ Коментар успішно збережено!");
        res.json({ success: true, message: "Коментар збережено!" });
      });
    });
  });
  
  // RESERVATION
  const RESERVATIONS_FILE = "reservation.json"; // Файл змінено на JSON формат

  // Якщо файлу бронювання немає — створюємо його
  if (!fs.existsSync(RESERVATIONS_FILE)) {
    fs.writeFileSync(RESERVATIONS_FILE, "[]", "utf8");
  }
  


  
  // Middleware для парсингу JSON
  app.use(express.json());
  app.use(express.static(path.join(__dirname, '/')));
  app.use(cors());

// Отримання всіх бронювань
app.get("/get-reservations", (req, res) => {
  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
      if (err) {
          console.error("Помилка читання файлу:", err);
          return res.status(500).json({ success: false, message: "Не вдалося отримати резервування" });
      }
      try {
          const reservations = JSON.parse(data);
          res.json({ success: true, reservations });
      } catch (parseError) {
          console.error("Помилка парсингу JSON:", parseError);
          res.status(500).json({ success: false, message: "Невірний формат JSON у файлі" });
      }
  });
});


// Функція для перевірки конфліктів бронювання
function isConflict(newStartTime, newEndTime, existingStartTime, existingEndTime) {
  return (newStartTime < existingEndTime && newEndTime > existingStartTime);
}

  // Створити нове бронювання
  app.post("/book-computer", (req, res) => {
    const { selectedComputers, userName, userPhone, startTime, endTime } = req.body;

    console.log("Отримані дані:", req.body);  // ✅ ДОДАНО ЛОГУВАННЯ
    // Перевіряємо, чи не заброньовано вже ці комп'ютери на цей час
    fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
      if (err) {
        console.error("Помилка читання файлу бронювань:", err);
        return res.status(500).json({ success: false, message: "Помилка читання файлу" });
      }
  
      let reservations = JSON.parse(data || "[]");

  
      // Перевірка на конфлікти з існуючими бронюваннями
      for (const reservation of reservations) {
        if (selectedComputers.includes(reservation.computerId) &&
            isConflict(startTime, endTime, reservation.startTime, reservation.endTime)) {
          return res.status(400).json({ success: false, message: `Комп'ютер ${reservation.computerId} зайнятий у вибраний час.` });
        }
      }
  
    // Додаємо нові бронювання
    const newReservations = selectedComputers.map(computerId => ({
      computerId,
      userName,
      userPhone,
      startTime,  // ✅ ГОДИНА ПОЧАТКУ
      endTime     // ✅ ГОДИНА КІНЦЯ
    }));

    console.log("Нові бронювання:", newReservations); // ✅ ЛОГУЄМО ЩО ЗАПИСУЄМО

    reservations.push(...newReservations);
  
    fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), "utf8", (err) => {
      if (err) {
        console.error("Помилка запису у файл бронювань:", err);
        return res.status(500).json({ success: false, message: "Помилка запису у файл бронювань" });
      }
      res.json({ success: true, message: "Бронювання успішно створено!" });
    });
  });
});
  


  // Запуск сервера
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущено: http://localhost:${PORT}`);
  });