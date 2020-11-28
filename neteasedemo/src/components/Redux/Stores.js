import { createStore } from "redux";
import addReducers from "./Reducers";
let myStore = createStore(addReducers);
export default myStore;