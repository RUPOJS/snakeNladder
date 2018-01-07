const express = require('express')
const path = require('path')
const port = process.env.PORT || 8686
const app = express()

app.use(express.static(__dirname + '/public'))

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.listen(port)
console.log("server started on port " + port)