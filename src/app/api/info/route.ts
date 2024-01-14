import { NextRequest, NextResponse } from "next/server";
import { parse } from 'node-html-parser';
import Stop from '../../../types/Stop'
import NextBus from "@/types/NextBus";

const BASE = "https://qr.vectalia.es/Alicante/consulta.aspx?p=";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const num = req.nextUrl.searchParams.get('q');
    const url = BASE + num;
    if (num==null) {
        return new Response(JSON.stringify({"error":"unexpected"}), { status: 200, headers: [['content-type', 'application/json']] });
    }
    const headers = new Headers({
      'User-Agent': "Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1",
    });
    
    const response = await fetch(url, { headers });



    const htmlBody = await response.text();
    const root = parse(htmlBody);
    
    let raw = root.text


    let name = raw.split(num)[1].split(" \r\n\t\t\t\t\t\r\n\t\t\t\t\r\n")[0].replace("\r\n\t\t\t\t\t\t", "")
    
    let rawbus = raw.split("text =")[1].split("\"\";")[0]

    let busLines = rawbus.split("Linea")
    busLines.shift();
    
    const nextBuses: NextBus[] = busLines.map(busLine => {
        let kind = busLine.split(" ")[1]
        let min = busLine.split("min")[0].split(": ")[1].trim()
        
        let nextBus : NextBus = {
            kind: kind,
            min: +min
        }
        return nextBus;
      });


    let stop : Stop = {
        name: name,
        customName: "",
        code: +num??0,
        nextBuses: nextBuses
    }
    



    return new Response(JSON.stringify(stop), { status: 200, headers: [['content-type', 'application/json']] });
  } catch (error) {

    console.log('An error occurred:', error);
    return new Response(JSON.stringify(error), { status: 200, headers: [['content-type', 'application/json']] });
  }
}
