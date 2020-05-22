const express = require("express")
const path = require("path")
const app = express()

// Serve static files....
app.use(express.static(__dirname + "/dist/front"))

// Send all requests to index.html
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/front/index.html"))
})

// default Heroku PORT
app.listen(process.env.PORT || 8080,() =>{
    console.log("App server is running...")
})