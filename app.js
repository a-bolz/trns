const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.redirect('https://app.teamleader.eu/oauth2/authorize?client_id=0aca3ed99ff613f3c1c6b1efcb055812&response_type=code&redirect_uri=https://www.example.com'))

app.get('/postit', (req, res) => {
  console.log(req);
  res.send('posted something')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
// lol
