import { createContext } from "react"
import { Record, SpecialRecord, Extra } from "../App";

//record
type recordType = {
    records: Record[],
    setRecords: React.Dispatch<React.SetStateAction<Record[]>>
}

const recordState = {
    records: [],
    setRecords: () => {}
}

export const recordsContext = createContext<recordType>(recordState)

//special record
type specialRecordType = {
    special_records: SpecialRecord[],
    setSpecialRecords: React.Dispatch<React.SetStateAction<SpecialRecord[]>>
}

const specialRecordState = {
    special_records: [],
    setSpecialRecords: () => {}
}

export const specialRecordsContext = createContext<specialRecordType>(specialRecordState)

//extra
type extraType = {
    extras: Extra[],
    setExtras: React.Dispatch<React.SetStateAction<Extra[]>>
}

const extraState = {
    extras: [],
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

//connect
type connectType = {
    is_connected: boolean,
    setConnected: React.Dispatch<React.SetStateAction<boolean>>
}

const connectState = {
    is_connected: false,
    setConnected: () => {}
}

export const connectContext = createContext<connectType>(connectState)