import express from "express"
import cors from "cors"

import { cacheDir, staticServerPort } from "./constants"

const app = express()

app.use(cors())
app.use(express.static(cacheDir))

app.listen(staticServerPort, () => {
    console.log(`Static server running on http://localhost:${staticServerPort}`)
})