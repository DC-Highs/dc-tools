import { ipcMain, net } from "electron"

export interface HttpRequestOptions {
    url: string
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    headers?: Record<string, string>
    body?: any
}

export interface HttpResponse<T = any> {
    status: number
    headers: Record<string, string | string[]>
    data: T
}

ipcMain.handle("http-request", async (_event, options: HttpRequestOptions): Promise<HttpResponse> => {
    const { url, method = "GET", headers = {}, body } = options

    return new Promise((resolve, reject) => {
        const request = net.request({
            method,
            url,
        })

        // headers
        Object.entries(headers).forEach(([key, value]) => {
            request.setHeader(key, value)
        })

        request.on("response", (response) => {
            const chunks: Buffer[] = []

            response.on("data", (chunk) => {
                chunks.push(chunk)
            })

            response.on("end", () => {
                const buffer = Buffer.concat(chunks)
                const contentType = response.headers["content-type"]?.toString() || ""

                let data: any

                if (contentType.includes("application/octet-stream") || contentType.includes("shockwave-flash")) {
                    data = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength)
                } else {
                    const text = buffer.toString("utf-8")
                    data = contentType.includes("application/json") ? JSON.parse(text) : text
                }

                resolve({
                    status: response.statusCode ?? 0,
                    headers: response.headers,
                    data,
                })
            })
        })

        request.on("error", (err) => {
            reject(err)
        })

        // body
        if (body) {
            const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body)

            request.write(payload)
        }

        request.end()
    })
})
