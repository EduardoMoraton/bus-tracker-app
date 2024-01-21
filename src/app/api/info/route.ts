import { NextRequest, NextResponse } from "next/server";
import { parse } from 'node-html-parser';
import Stop from '../../../types/Stop'
import NextBus from "@/types/NextBus";

const BASE = "https://qr.vectalia.es/Alicante/consulta.aspx?p=";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const num = req.nextUrl.searchParams.get('q');
    const url = BASE + num;
    if (num==null) {
        return new Response(JSON.stringify({"error":"unexpected"}), { status: 200, headers: [['content-type', 'application/json']] });
    }

    
    const response = await fetch(url);



    const raw = await response.text();

    const regex1 = /<span\s+id="parada_desc">([^<]+)<\/span>/;

    const match1 = raw.match(regex1);

    const stopName = match1 ? match1[1].trim() : "Unknown Stop";
    
    const regex2 = /var text = "(.*?)";/s;


    const match2 = raw.match(regex2);


    const extractedText = match2 ? match2[1] : "";
    
    const nextBuses: NextBus[] = [];
    const lines = extractedText.split("\\n");
    lines.forEach(line => {
        console.log(line)
        
        if (line.includes("Linea")) {
            const lineNumber = line.split("Linea")[1].split(" ")[1]
            const min = line.split(":")[1].split(" ")[1]
            const direction = line.split("Linea")[1].split(":")[0].substring(4)

            const nextBus: NextBus = {
                kind: lineNumber,
                direction:direction,
                min: Number(min)
            };
            nextBuses.push(nextBus);
        }
    });



    let stop : Stop = {
        name: stopName,
        customName: "",
        code: +num??0,
        nextBuses: nextBuses
    }
    



    return new Response(JSON.stringify(stop), { status: 200, headers: [['content-type', 'application/json']] });
  } catch (error) {

    console.log('An error occurred:', error);
    return new Response(JSON.stringify(error), { status: 500, headers: [['content-type', 'application/json']] });
  }
}


