import { DragonPhase, DragonSpriteQuality, type StaticFileUrlPlatformPrefix } from "@dchighs/dc-core"
import dcAssets from "@dchighs/dc-assets"

function createSpriteFiles(
    imageName: string,
    platformPrefix: StaticFileUrlPlatformPrefix,
    qualities: DragonSpriteQuality[],
    phases: DragonPhase[],
    skins: number[],
): DragonStaticFile[] {
    const files: DragonStaticFile[] = []

    qualities.forEach((quality) => {
        phases.forEach((phase) => {
            const label = `Sprite of ${getPhaseName(phase)} (quality ${quality})`

            const value = dcAssets.dragons.sprite({
                imageName: imageName,
                phase: phase,
                platformPrefix: platformPrefix,
                imageQuality: quality,
            }).url

            files.push({ label, value })
        })

        skins.forEach((skin) => {
            const phase = 3
            const label = `Sprite of ${getPhaseName(phase)}${skin > 0 ? ` skin ${skin}` : ""} (quality ${quality})`
            const adjustedSkin = `_skin${skin}`

            const value = dcAssets.dragons.sprite({
                imageName: imageName,
                phase: phase,
                platformPrefix: platformPrefix,
                imageQuality: quality,
                skin: adjustedSkin,
            }).url

            files.push({ label, value })
        })
    })

    return files
}

function createThumbFiles(
    imageName: string,
    platformPrefix: StaticFileUrlPlatformPrefix,
    phases: number[],
    skinIndexes: number[],
): DragonStaticFile[] {
    const files: DragonStaticFile[] = []

    phases.forEach((phase) => {
        const label = `Thumbnail of ${getPhaseName(phase)}`

        const value = dcAssets.dragons.thumbnail({
            imageName: imageName,
            phase: phase,
            platformPrefix: platformPrefix,
        }).url

        files.push({ label, value })
    })

    skinIndexes.forEach((skinIndex) => {
        const phase = 3
        const label = `Thumbnail of ${getPhaseName(phase)}${skinIndex > 0 ? ` skin ${skinIndex}` : ""}`

        const value = dcAssets.dragons.thumbnail({
            imageName: imageName,
            phase: phase,
            platformPrefix: platformPrefix,
            skin: skinIndex ? `_skin${skinIndex}` : undefined,
        }).url

        files.push({ label, value })
    })

    return files
}

function createAnimationFiles(
    imageName: string,
    platformPrefix: StaticFileUrlPlatformPrefix,
    phases: DragonPhase[],
    skinIndexes: number[],
    animationType: string,
): DragonStaticFile[] {
    const files: DragonStaticFile[] = []

    phases.forEach((phase) => {
        const label = `${animationType.charAt(0).toUpperCase() + animationType.slice(1)} Animation of ${getPhaseName(phase)}`

        const value =
            animationType === "flash"
                ? dcAssets.dragons.animations.flash({
                      imageName: imageName,
                      phase: phase,
                      platformPrefix: platformPrefix,
                  }).url
                : dcAssets.dragons.animations.spine({
                      imageName: imageName,
                      phase: phase,
                      platformPrefix: platformPrefix,
                  }).url

        files.push({ label, value })
    })

    skinIndexes.forEach((skinIndex) => {
        const phase = 3
        const label = `${animationType.charAt(0).toUpperCase() + animationType.slice(1)} Animation of ${getPhaseName(phase)}${skinIndex > 0 ? ` skin ${skinIndex}` : ""}`
        const adjustedSkin = skinIndex ? `_skin${skinIndex}` : undefined

        const value =
            animationType === "flash"
                ? dcAssets.dragons.animations.flash({
                      imageName: imageName,
                      phase: phase,
                      platformPrefix: platformPrefix,
                      skin: adjustedSkin,
                  }).url
                : dcAssets.dragons.animations.spine({
                      imageName,
                      phase,
                      platformPrefix: platformPrefix,
                      skin: adjustedSkin,
                  }).url

        files.push({ label, value })
    })

    return files
}

export type DragonStaticFile = {
    label: string
    value: string
}

function getPhaseName(phase: number) {
    switch (phase) {
        case 0:
            return "Egg"
        case 1:
            return "Baby"
        case 2:
            return "Young"
        case 3:
            return "Adult"
    }
}

export async function findDragonStaticFileUrls(
    imageName: string,
    platformPrefix: StaticFileUrlPlatformPrefix,
): Promise<DragonStaticFile[]> {
    const qualities = [DragonSpriteQuality.Normal, DragonSpriteQuality.Large]
    const phases = [DragonPhase.Egg, DragonPhase.Baby, DragonPhase.Young, DragonPhase.Adult]
    const skinIndexes = [1, 2, 3, 4]

    const spriteFiles = createSpriteFiles(imageName, platformPrefix, qualities, phases, skinIndexes)
    const thumbFiles = createThumbFiles(imageName, platformPrefix, phases, skinIndexes)
    const flashAnimationFiles = createAnimationFiles(imageName, platformPrefix, phases, skinIndexes, "flash")
    const spineAnimationFiles = createAnimationFiles(imageName, platformPrefix, phases, skinIndexes, "spine")

    const allStaicFileUrls = [...spriteFiles, ...thumbFiles, ...flashAnimationFiles, ...spineAnimationFiles]

    const filteredStaticFileUrls: DragonStaticFile[] = []

    for (const staticFileUrl of allStaicFileUrls) {
        try {
            const response = await window.electronAPI.request({
                url: staticFileUrl.value,
            })

            if (response.status === 200) {
                filteredStaticFileUrls.push(staticFileUrl)
            }
        } catch (error) {}
    }

    return filteredStaticFileUrls
}
