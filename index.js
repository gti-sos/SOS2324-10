let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
const PORT = (process.env.PORT || 8080);

app.use("/static/",express.static("./public/index.html"))

//Funciones index-XXX.js
app.use("/samples/TLR",express.static("./index-TLR.js"))
app.use("/samples/MRF",express.static("./index-MRF.js"))
app.use("/samples/ASC",express.static("./index-ASC.js"))
app.use("/samples/ASB",express.static("./index-ASB.js"))

//Puerto en el que se despliega
app.listen(PORT);
app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`)
});

//console.log(cool());
console.log(`Server listening on port ${PORT}`);