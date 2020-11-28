import { SONGER } from "./Actions";
let initialState = {
    songerSing:{
        ids:"",
        songSheetId:"",
        singerName:"",
        songerName:"",
        songImg:"",
    }
}
export default function (state=initialState,action) {
    SONGER:{
        return {
            songerSing:action.payload
        }
    }
}