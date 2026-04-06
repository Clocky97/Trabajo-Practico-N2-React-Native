const express = require("express")
const axios = require("axios")
const fs = require("fs")

const router = express.Router()
const DB_PATH = "./data/favoritos.json"

const readData = () => {
  if (!fs.existsSync(DB_PATH)) return []
  return JSON.parse(fs.readFileSync(DB_PATH))
}

const writeData = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

router.get("/external", async (req, res) => {
  try {
    const page = req.query.page

    if (page) {
      const response = await axios.get(`https://www.demonslayer-api.com/api/v1/characters?page=${page}`)
      const data = response.data
      return res.json({
        content: Array.isArray(data?.content) ? data.content : [],
        pagination: data?.pagination || null
      })
    }

    const allCharacters = []
    let url = "https://www.demonslayer-api.com/api/v1/characters"
    let currentPage = 0

    while (url && currentPage < 20) {
      const response = await axios.get(url)
      const data = response.data
      if (Array.isArray(data?.content)) {
        allCharacters.push(...data.content)
      }
      url = data?.pagination?.nextPage || null
      currentPage += 1
    }

    res.json({ content: allCharacters })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "error" })
  }
})

router.get("/", (req, res) => {
  const data = readData()
  res.json(data)
})

router.get("/:id", (req, res) => {
  const data = readData()
  const item = data.find((c) => c.id == req.params.id)

  if (!item) return res.status(404).json({ error: "no encontrado" })

  res.json(item)
})

router.post("/", (req, res) => {
  const data = readData()

  if (!req.body.name) {
    return res.status(400).json({ error: "nombre requerido" })
  }

  const newItem = {
    id: Date.now(),
    name: req.body.name
  }

  data.push(newItem)
  writeData(data)

  res.status(201).json(newItem)
})

router.put("/:id", (req, res) => {
  let data = readData()
  const index = data.findIndex((c) => c.id == req.params.id)

  if (index === -1) {
    return res.status(404).json({ error: "no encontrado" })
  }

  data[index].name = req.body.name || data[index].name
  writeData(data)

  res.json(data[index])
})

router.delete("/:id", (req, res) => {
  let data = readData()
  const newData = data.filter((c) => c.id != req.params.id)

  writeData(newData)

  res.json({ message: "ok" })
})

module.exports = router