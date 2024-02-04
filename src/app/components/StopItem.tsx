import Stop from "@/types/Stop"




const StopItem = (props: { stop: Stop, onDelete: Function, index:Number}) => {




    return (
        
        <div className={'nm-flat-white-lg flex flex-col s p-5 m-2 rounded-lg'}>
            <div className="flex justify-end w-auto text-red-500 cursor-pointer" onClick={()=>{props.onDelete(props.index)}}> 
                <a>x</a>
           
            </div>
            <div className="flex flex-col">
              <p className={'text-xl'}>{+props.stop.code}</p>
              <p>{props.stop.name}</p>
            </div>
              

              <div className={'flex flex-col gap-2'}>
                {props.stop.nextBuses.map((bus, busIndex) => (
                  <div key={busIndex} className={'flex nm-inset-gray-50-sm rounded-md p-2 gap-4'}>
                    <p className={'text-red-700 mr-2 text-xl'}>{bus.kind}</p>
                    <p>{bus.direction}</p>
                    <p>{+bus.min == 0 ? "AHORA" : +bus.min + " min"}</p>
                  </div>
                ))}
              </div>


        </div>
        
    )
}


export default StopItem