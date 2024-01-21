'use client'
import { useState, useEffect } from 'react';
import Stop from '@/types/Stop';
import Image from 'next/image';

export const dynamic = "force-dynamic";
export default function Home() {
  
  const [inputValue, setInputValue] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);

  useEffect(() => {
    const storedStops = localStorage.getItem('stops');
    if (storedStops) {
      setStops(JSON.parse(storedStops));
      update(JSON.parse(storedStops))
    }
  }, []);

  const  update = async (ss:Stop[]) => {
    try {
      const updatedStops = await Promise.all(
        ss.map(async (stop) => {
          const response = await fetch(`api/info?q=${stop.code}`);
          const stopData = await response.json();
          const newStop: Stop = {
            name: stopData.name,
            customName: stopData.customName,
            code: stopData.code,
            nextBuses: stopData.nextBuses || [],
          };
          return newStop;
        })
      );
        console.log(updatedStops)
      setStops(updatedStops);
    } catch (error) {
      console.error('Error updating stops:', error);
    }

  }


  const save = () => {
    localStorage.setItem('stops', JSON.stringify(stops))
    console.log("saved")
  }

  const handleAdd = async () => {
    if (inputValue.trim() !== '') {
      try {
        const response = await fetch(`api/info?q=${inputValue}`);
        const stopData = await response.json();

        const newStop: Stop = {
          name: stopData.name,
          customName: stopData.customName,
          code: stopData.code,
          nextBuses: stopData.nextBuses || [],
        };

        setStops((prevStops) => [...prevStops, newStop])
        setInputValue('');

  
      } catch (error) {
        console.error('Error fetching stop information:', error);
      }
    }
  };

  const handleSave = () => {
    save()
  }

  const handleUpdate = () => {
    update(stops)
  }

  return (
    <main className='flex items-center justify-center flex-col w-screen h-screen bg-gray-100 text-black'>
      <div>
        <h1 className='text-5xl'>Alicante bus 🚌</h1>
      </div>
      <div className={'flex-grow flex justify-start flex-col'}>
        {stops.map((stop, index) => (
          <div key={index} className={'w-[100%] nm-flat-white-lg s p-5 m-2 rounded-lg'}>
            <p>{stop.name}</p>
            <p>{"" + stop.code}</p>
            <div className={'flex flex-col gap-2'}>
              {stop.nextBuses.map((bus, busIndex) => (
                <div key={busIndex} className={'flex nm-inset-gray-50-sm rounded-md p-2 gap-4'}>
                  <p className={'text-red-700 mr-2 border-2 border-black'}>{bus.kind}</p>
                  <p>{bus.direction}</p>
                  <p>{"" + bus.min}min</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={'nm-flat-white-lg p-5 flex flex-col rounded-md m-2 shadow-lg'}>
        <p>Código parada:</p>
        <div className='nm-inset-white p-2 my-2 rounded'>
          
          <input
            className=''
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className={'flex text-2xl justify-evenly'}>
          
          <button className='p-2 w-10 h-10 rounded-full nm-convex-white active:nm-inset-white' onClick={handleAdd}>➕</button>
          <button className='p-2 w-10 h-10 rounded-full nm-convex-white active:nm-inset-white' onClick={handleSave}>💾</button>
          <button className='p-2 w-10 h-10 rounded-full nm-convex-white active:nm-inset-white' onClick={handleUpdate}>🔄</button>
        </div>
        
      </div>
    </main>
  );
}
