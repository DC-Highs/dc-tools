import { ipcMain, net } from "electron"
import AdmZip from "adm-zip"

export function registerZipHandler() {
    ipcMain.handle("zip:list", async (_event, url: string) => {
        return new Promise((resolve, reject) => {
            const request = net.request(url)

            request.on("response", (response) => {
                const chunks: Buffer[] = []

                response.on("data", (chunk) => {
                    chunks.push(chunk)
                })

                response.on("end", () => {
                    try {
                        const buffer = Buffer.concat(chunks)
                        const zip = new AdmZip(buffer)
                        
                        const entries = zip.getEntries().map((entry) => ({
                            name: entry.entryName,
                            size: entry.header.size,
                            isDirectory: entry.isDirectory,
                        }))

                        resolve(entries)
                    } catch (error) {
                        reject(error)
                    }
                })
            })

            request.on("error", (err) => {
                reject(err)
            })

            request.end()
        })
    })
}
