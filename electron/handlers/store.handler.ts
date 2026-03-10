import { ipcMain } from "electron"

import { store } from "../lib/store"

export function registerStoreHandlers() {
    ipcMain.handle("store:get", (_, key: string) => {
        return store.get(key)
    })

    ipcMain.handle("store:set", (_, key: string, value: any) => {
        store.set(key, value)
    })

    ipcMain.handle("store:delete", (_, key: string) => {
        store.delete(key)
    })
}
