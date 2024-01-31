'use client'
import { useState, useEffect } from 'react';
import Stop from '@/types/Stop';
import Image from 'next/image';
import StopItem from './components/StopItem';

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

  const handleDelete = (index:Number) => {
    setStops(stops.filter((stop, i)=>i!=index))
  }

  return (
    <main>
        <div className='flex items-center justify-center flex-col w-screen h-screen bg-gray-100 text-black p-10'>
      <div>
        <h1 className='text-5xl'>Alicante bus 🚌</h1>
      </div>
      <div className={'flex-grow w-[100%] flex justify-start flex-col overflow-y-scroll'}>
        {stops.map((stop, index) => (
          <StopItem key={index} stop={stop} onDelete={handleDelete} index={index}></StopItem>
        ))}
      </div>
      <div className={'nm-flat-white-lg w-[100%] p-5 flex flex-col rounded-md m-2 shadow-lg'}>
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

      </div>
      <footer className={'flex w-screen h-11 gap-8  justify-center items-center bg-black'}>

              <a className={'hover:text-pink-400 transition-all'} href='https://portfolio-eduardomoraton.vercel.app/'>Eduardo Moraton</a>
              <a className={'hover:text-pink-400 transition-all'} href='https://www.linkedin.com/in/eduardo-moraton-moyano/'>LN</a>
              <a className={'hover:text-pink-400 transition-all'} href='mailto:moraton.eduardo@gmail.com'>Mail</a>
              <a className={'hover:text-pink-400 transition-all'}  href='https://github.com/EduardoMoraton/bus-tracker-app'>Code for this project</a>
              <p>2024</p>
      </footer>
    </main>
    

  );
}
