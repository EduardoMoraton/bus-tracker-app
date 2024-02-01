import Stop from "@/types/Stop"




const StopItem = (props: { stop: Stop, onDelete: Function, index:Number}) => {




    return (
        
        <div className={'nm-flat-white-lg s p-5 m-2 rounded-lg flex'}>
            <div className="flex justify-end text-red-500 cursor-pointer" onClick={()=>{props.onDelete(props.index)}}> 
                <a>x</a>
            </div>
            <div className="flex">
            <p>{props.stop.name}</p>
            <p>{": " + props.stop.code}</p>
            </div>

              <div className={'flex flex-col gap-2'}>
                {props.stop.nextBuses.map((bus, busIndex) => (
                  <div key={busIndex} className={'flex flex-col nm-inset-gray-50-sm rounded-md p-2 gap-4'}>
                    <p className={'text-red-700 mr-2 border-2 border-black'}>{bus.kind}</p>
                    <p>{bus.direction}</p>
                    <p>{"" + bus.min}min</p>
                  </div>
                ))}
              </div>


        </div>
        
    )
}


export default StopItem