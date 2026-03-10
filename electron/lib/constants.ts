import { app } from "electron"

import path from "node:path"
import fs from "node:fs"

export const tempDir = path.join(app.getPath("temp"), "dc-tools")

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
}

export const staticServerPort = 7273
