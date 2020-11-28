export const SONGER = "SONGER";
export function addSong(id,songSheetId,singerName,songerName,songImg) {
    return {
        type:SONGER,
        payload:{id,songSheetId,singerName,songerName,songImg}
    }
}