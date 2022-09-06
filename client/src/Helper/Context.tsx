import { createContext } from "react"
import { Record, SpecialRecord, Extra } from "../App";

//record
type recordType = {
    setRecords: React.Dispatch<React.SetStateAction<Record[]>>
}

const recordState = {
   setRecords: () => {}
}

export const recordsContext = createContext<recordType>(recordState)

//special record
type specialRecordType = {
    setSpecialRecords: React.Dispatch<React.SetStateAction<SpecialRecord[]>>
}

const specialRecordState = {
    setSpecialRecords: () => {}
}

export const specialRecordsContext = createContext<specialRecordType>(specialRecordState)

//extra
type extraType = {
    setExtras: React.Dispatch<React.SetStateAction<Extra[]>>
}

const extraState = {
    setExtras: () => {}
}

export const extrasContext = createContext<extraType>(extraState)

//change the user id
type userIdType = {
    setUserId: React.Dispatch<React.SetStateAction<string>>
}

const userIdState = {
    setUserId: () => {}
}

export const userIdContext = createContext<userIdType>(userIdState)