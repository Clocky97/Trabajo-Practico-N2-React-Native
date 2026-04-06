const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

const charactersRoutes = require("./routes/characters")

app.use("/api/characters", charactersRoutes)

const PORT = 5000
app.listen(PORT, () => {
  console.log("Servidor en puerto " + PORT)
})