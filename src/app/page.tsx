'use client'
import { useState, useEffect } from 'react';
import Stop from '@/types/Stop';
import Image from 'next/image';
import StopItem from './components/StopItem';
import moment from 'moment';

import { Icon } from '@iconify/react';

export const dynamic = "force-dynamic";
export default function Home() {
  
  const [inputValue, setInputValue] = useState('');
  const [stops, setStops] = useState<Stop[]>([]);
  const [updated, setUpdated] = useState<number>(0);
  const [timeSinceLastUpdate, setTimeSinceLastUpdate] = useState<number>(0);

  useEffect(() => {
    const storedStops = localStorage.getItem('stops');
    if (storedStops) {
      setStops(JSON.parse(storedStops));
      update(JSON.parse(storedStops))

      window.setInterval(()=> {
        update(JSON.parse(storedStops))
        setUpdated(Date.now())
        return true;
      }, 16000)

    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeDifferenceInSeconds = Math.floor((Date.now() - updated) / 1000);
      setTimeSinceLastUpdate(timeDifferenceInSeconds);
    }, 1000); // Update time every second
  
    return () => clearInterval(intervalId);
  }, [updated]);

  const  update = async (ss:Stop[]) => {
    if(!ss) 
      return;
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
      console.log("updated")
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
        save()
  
      } catch (error) {
        console.error('Error fetching stop information:', error);
      }
    }
    save()
  };

  const handleSave = () => {
    save()
  }

  const handleUpdate = () => {
    update(stops)
  }

  const handleDelete = (index:Number) => {
    setStops(stops.filter((stop, i)=>i!=index))
    save()
  }

  return (
    <main className={"font-bebas"}>
      
        <div className='flex items-center justify-center flex-col w-screen h-screen bg-black text-white p-10'>
      <div>
        <h1 className='text-6xl text-red'>Alicante bus</h1>
      </div>
      <div>
        <p>Updated:</p>
        {timeSinceLastUpdate} seconds ago
      </div>
      <div className={'flex-grow w-[100%] gap-5 flex justify-start flex-col overflow-y-scroll'}>
        {stops.map((stop, index) => (
          <StopItem key={index} stop={stop} onDelete={handleDelete} index={index}></StopItem>
        ))}
      </div>
      <div className={'bg-card p-5 rounded-lg'}>
        <p className={'text-yellow text-2xl'}>CODIGO PARADA</p>

          
          <input
            className={'bg-card p-2 rounded-lg my-4'}
            type='text'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        <div className={'flex text-2xl justify-center'}>
          <button className='bg-card h-10 w-10 flex justify-center items-center rounded-l-full cursor-pointer hover:bg-blue transition-all' onClick={handleAdd}>
            <Icon icon={'material-symbols:add'}></Icon>
          </button>
          <button className='bg-card h-10 w-9 flex justify-center items-center cursor-pointer hover:bg-blue transition-all' onClick={handleSave}>
            <Icon icon={"material-symbols:save"}></Icon>
          </button>
          <button className='bg-card h-10 w-11 flex justify-center items-center text-center rounded-r-full ursor-pointer hover:bg-blue transition-all' onClick={handleUpdate}>
            <Icon icon={"material-symbols:update-rounded"}></Icon>
          </button>
        </div>
        
      </div>

      </div>
      <footer className={'flex w-screen h-11 gap-8  justify-center items-center bg-black text-white'}>
              <a className={'hover:text-pink-400 transition-all'} href='https://portfolio-eduardomoraton.vercel.app/'>Eduardo Moraton</a>
              <a className={'hover:text-pink-400 transition-all'} href='https://www.linkedin.com/in/eduardo-moraton-moyano/'>LN</a>
              <a className={'hover:text-pink-400 transition-all'} href='mailto:moraton.eduardo@gmail.com'>Mail</a>
              <a className={'hover:text-pink-400 transition-all'}  href='https://github.com/EduardoMoraton/bus-tracker-app'>Code for this project</a>
              <p>c 2024</p>
      </footer>
    </main>
    

  );
}
