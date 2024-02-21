//let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
//Puerto en el que se despliega
app.listen(8080);
app.get("/cool", (req,res)=>{
res.send("<html><body><h1>Hola mundo</h1></body></html>")
});
//console.log(cool());
console.log("hola caracola");