import NextBus from "./NextBus"


type Stop ={
    name:String,
    customName: String,
    code:Number,
    nextBuses: NextBus[]
}

export default Stop