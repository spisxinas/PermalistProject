import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "12345",
  port: 5432
});

db.connect();

async function getItems(){

  const result = await db.query("SELECT * FROM items ORDER BY id");
  let records=result.rows;
  //console.log(records);
  return records;

}

app.get("/", async (req, res) => { 

  let Items = await getItems();
  
  //console.log(Items);
  
  res.render("index.ejs",{listTitle: "Today",listItems: Items});

  });
  

app.post("/add", (req, res) => {

  console.log(req.body);
  
  db.query("INSERT INTO items (item_name) VALUES ($1)",[req.body.newItem]);
  
  res.redirect("/");

});

app.post("/edit", (req, res) => {

  //console.log(req.body);
  db.query("UPDATE items SET item_name=($1) WHERE id=($2)",[req.body.updatedItemTitle,req.body.updatedItemId]);
  res.redirect('/');

});

app.post("/delete", (req, res) => {

  //console.log(req.body);

  db.query("DELETE FROM items WHERE id=($1) ",[req.body.deleteItemId]);

  res.redirect("/");

});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
