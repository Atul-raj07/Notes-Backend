var express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    var formdets = []
    fs.readdir("./files",function(err,files){
        files.forEach(files => {
           var filedesc = fs.readFileSync(`./files/${files}`,"utf-8",function(err,files){
        })
        var fn = files
        formdets.push({head:fn,desc:filedesc})
    })
        res.render("index",{formdets});

    })
});

app.post('/create', (req, res) => {
    const title = req.body.head.split(' ').join('') + '.txt';
        fs.writeFile(`./files/${title}`, req.body.desc, (err, data) => {
            if(err) return err
            else res.redirect('/')
        })

});

const port = 3100;
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});
