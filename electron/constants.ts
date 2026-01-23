import { app } from "electron"
import path from "node:path"

export const tempDir = path.join(app.getPath("temp"))
export const staticServerPort = 7273
