let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
const PORT = (process.env.PORT || 8080);


//Puerto en el que se despliega
app.listen(PORT);
app.get("/cool", (req,res)=>{
<<<<<<< HEAD
res.send(`<html><body><h1>${cool}</h1></body></html>`)
=======
    res.send("<html><body><h1> ${cool} </h1></body></html>")
>>>>>>> refs/remotes/origin/main
});
//console.log(cool());
console.log(`Server listening on port ${PORT}`);