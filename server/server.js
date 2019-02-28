const express = require("express");
const path = require('path')//to jest budowane nie trzeba instalowac
const publicPath = path.join(__dirname,'../public') // dirname to folder w którym jest ten glowny plik
const port = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));
app.get("/",(req,res)=>{
    res.send("index.html")
})


app.listen(port,()=>{
    console.log(`server is up on port ${port}`);
});