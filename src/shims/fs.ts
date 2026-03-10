export const readFile = () => {
    throw new Error("fs.readFile is not supported in the renderer.")
}
export const readFileSync = () => {
    throw new Error("fs.readFileSync is not supported in the renderer.")
}
export const writeFile = () => {
    throw new Error("fs.writeFile is not supported in the renderer.")
}
export const writeFileSync = () => {
    throw new Error("fs.writeFileSync is not supported in the renderer.")
}
export const promises = {
    readFile: () => Promise.reject(new Error("fs.promises.readFile is not supported in the renderer.")),
    writeFile: () => Promise.reject(new Error("fs.promises.writeFile is not supported in the renderer.")),
}
export const existsSync = () => false
export const lstatSync = () => {
    throw new Error("fs.lstatSync is not supported in the renderer.")
}
export const statSync = () => {
    throw new Error("fs.statSync is not supported in the renderer.")
}
export const readdirSync = () => []

export default {
    readFile,
    readFileSync,
    writeFile,
    writeFileSync,
    promises,
    existsSync,
    lstatSync,
    statSync,
    readdirSync,
}
