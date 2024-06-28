var express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure the 'files' directory exists
const filesDir = path.join(__dirname, "files");
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

app.get("/", (req, res) => {
  var formdets = [];
  fs.readdir(filesDir, function (err, files) {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Error reading directory");
    }
    if (!files.length) {
      return res.render("index", { formdets });
    }
    files.forEach((file) => {
      var filedesc = fs.readFileSync(path.join(filesDir, file), "utf-8", function (err) {
        if (err) {
          console.error("Error reading file:", err);
        }
      });
      formdets.push({ head: file, desc: filedesc });
    });
    res.render("index", { formdets });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.head.split(" ").join("") + ".txt";
  fs.writeFile(path.join(filesDir, title), req.body.desc, (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).send("Error writing file");
    }
    res.redirect("/");
  });
});

app.get("/read/:filehead", (req, res) => {
  fs.readFile(path.join(filesDir, req.params.filehead), "utf-8", function (err, files) {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }
    res.render("read", { head: req.params.filehead, desc: files });
  });
});

app.get("/update/:filehead", (req, res) => {
  fs.readFile(path.join(filesDir, req.params.filehead), "utf-8", function (err, files) {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).send("Error reading file");
    }
    res.render("edit", { head: req.params.filehead, desc: files });
  });
});

app.post("/update/:filehead", (req, res) => {
  fs.writeFile(path.join(filesDir, req.params.filehead), req.body.desc, (err) => {
    if (err) {
      console.error("Error updating file:", err);
      return res.status(500).send("Error updating file");
    }
    res.redirect("/");
  });
});

app.get("/delete/:filename", (req, res) => {
  fs.unlink(path.join(filesDir, req.params.filename), (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return res.status(500).send("Error deleting file");
    }
    res.redirect("/");
  });
});

const port = 3200;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
