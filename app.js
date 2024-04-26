var express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  var formdets = [];
  fs.readdir("./files", function (err, files) {
    files.forEach((files) => {
      var filedesc = fs.readFileSync(
        `./files/${files}`,
        "utf-8",
        function (err, files) {}
      );
      formdets.push({ head: files, desc: filedesc });
    });
    res.render("index", { formdets });
  });
});

app.post("/create", (req, res) => {
  const title = req.body.head.split(" ").join("") + ".txt";
  fs.writeFile(`./files/${title}`, req.body.desc, (err) => {
    if (err) return err;
    else res.redirect("/");
  });
});
app.get("/read/:filehead", (req, res) => {
  fs.readFile(`./files/${req.params.filehead}`, "utf-8", function (err, files) {
    res.render("read", { head: req.params.filehead, desc: files });
  });
});
app.get("/update/:filehead", (req, res) => {
  fs.readFile(`./files/${req.params.filehead}`, "utf-8", function (err, files) {
    res.render("edit", { head: req.params.filehead, desc: files });
  });
});

app.post("/update/:filehead", (req, res) => {
      fs.writeFile(`./files/${req.params.filehead}`, req.body.desc, (err) => {
        if (err) return err;
      });
       res.redirect("/");
    });

app.get("/delete/:filename", (req, res) => {
  fs.unlink(`./files/${req.params.filename}`, (err) => {
    res.redirect("/");
  });
});

const port = 3200;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
