'use client'
import Stop from "@/types/Stop"



const StopItem = (props: { stop: Stop, onDelete: Function, index:Number}) => {




    return (
        
        <div className={'bg-card rounded-xl p-2'}>

            <div className="flex">
              <p className={'text-4xl text-yellow'}>{+props.stop.code}</p>
              <p className={'grow ml-4'}>{props.stop.name}</p>
              <div className="text-red" onClick={()=>{props.onDelete(props.index)}}> 
                x
              </div>  
            </div>
              
              <div className={'flex flex-col rounded-lg gap-2 m-2 p-2 bg-card'}>
                {props.stop.nextBuses.map((bus, busIndex) => (
                  <div key={busIndex} className={'flex'}>
                    <p className={' grow-0'}>{bus.kind}</p>
                    <p className={'ml-2 grow'}>{bus.direction}</p>
                    <p className={`${+bus.min == 0 ? 'text-blue' : 'text-white'}`}>{+bus.min == 0 ? "AHORA" : +bus.min + " min"}</p>
                  </div>
                ))}
              </div>


        </div>
        
    )
}


export default StopItem