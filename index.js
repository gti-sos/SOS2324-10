let cool = require("cool-ascii-faces");
let express = require("express");
const PORT = 8080;
let app = express();
//Puerto en el que se despliega
app.listen(PORT);
app.get("/cool", (req,res)=>{
res.send(`<html><body><h1>${cool}</h1></body></html>`)
});
//console.log(cool());
console.log("hola caracola");