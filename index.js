let cool = require("cool-ascii-faces");
let express = require("express");

let app = express();
//Puerto en el que se despliega
app.listen(8080);

console.log(cool());