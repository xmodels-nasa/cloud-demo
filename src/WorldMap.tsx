import {useRef,useState} from 'react';
import type {Bounds,Track} from './data';
export interface View {x:number;y:number;w:number;h:number}
interface Props {image:string|null;bounds:Bounds;coast:number[][][];opacity:number;point:[number,number]|null;track:Track|null;view:View;onView:(v:View)=>void;onPoint:(p:[number,number])=>void;label:string;subtitle:string}
export const world:View={x:0,y:0,w:360,h:180};
export function zoomView(view:View,factor:number):View {const w=Math.min(360,Math.max(12,view.w*factor)),h=w/2;return {x:Math.max(0,Math.min(360-w,view.x+(view.w-w)/2)),y:Math.max(0,Math.min(180-h,view.y+(view.h-h)/2)),w,h}}
export default function WorldMap(p:Props){const svg=useRef<SVGSVGElement>(null);const drag=useRef<{x:number;y:number;sx:number;sy:number;view:View}|null>(null);const [hover,setHover]=useState<[number,number]|null>(null);
 const coords=(event:React.PointerEvent<SVGSVGElement>)=>{const node=svg.current!;const pt=node.createSVGPoint();pt.x=event.clientX;pt.y=event.clientY;const t=pt.matrixTransform(node.getScreenCTM()!.inverse());return {x:Math.max(0,Math.min(360,t.x)),y:Math.max(0,Math.min(180,t.y))}};
 const [w,s,e,n]=p.bounds;
 const paths=p.coast.map(segment=>segment.map(([lon,lat],i)=>`${i?'L':'M'}${(lon+180).toFixed(2)},${(90-lat).toFixed(2)}`).join(''));
 return <div className="map-panel"><div className="map-label"><span className="status-dot"/><div><strong>{p.label}</strong><small>{p.subtitle}</small></div></div><svg ref={svg} viewBox={`${p.view.x} ${p.view.y} ${p.view.w} ${p.view.h}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${p.label}. Use map controls to zoom; click to inspect a location, or drag to pan.`}
 onPointerDown={event=>{if(event.button!==0)return;const c=coords(event);drag.current={...c,sx:event.clientX,sy:event.clientY,view:p.view};event.currentTarget.setPointerCapture(event.pointerId)}}
 onPointerMove={event=>{const c=coords(event);setHover([90-c.y,c.x-180]);const d=drag.current;if(!d)return;const scale=d.view.w/(svg.current!.getBoundingClientRect().width);p.onView({...d.view,x:Math.max(0,Math.min(360-d.view.w,d.view.x-(event.clientX-d.sx)*scale)),y:Math.max(0,Math.min(180-d.view.h,d.view.y-(event.clientY-d.sy)*scale))})}}
 onPointerUp={event=>{const d=drag.current;drag.current=null;if(!d)return;const c=coords(event);if(Math.hypot(event.clientX-d.sx,event.clientY-d.sy)<6)p.onPoint([90-c.y,c.x-180])}}
 onPointerCancel={()=>{drag.current=null}} onPointerLeave={()=>setHover(null)}>
 <defs><pattern id={'grid-'+p.label.replace(/\W/g,'')} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" fill="none" stroke="#b8d9dd" strokeOpacity=".13" strokeWidth=".18"/></pattern></defs>
 <rect width="360" height="180" fill="#102431"/>{p.image&&<image href={p.image} x={w+180} y={90-n} width={e-w} height={n-s} opacity={p.opacity} preserveAspectRatio="none" style={{imageRendering:'pixelated'}}/>}
 <rect width="360" height="180" fill={`url(#grid-${p.label.replace(/\W/g,'')})`} pointerEvents="none"/>
 {paths.map((d,i)=><path key={i} d={d} fill="none" stroke="#d3e3df" strokeOpacity=".58" strokeWidth=".25" vectorEffect="non-scaling-stroke" pointerEvents="none"/>)}
 <line x1="0" y1="90" x2="360" y2="90" stroke="#c9e3e1" strokeOpacity=".3" strokeDasharray="1 2" strokeWidth=".25"/>
 {[[-135,37,'NORTH AMERICA'],[-65,-20,'SOUTH AMERICA'],[18,7,'AFRICA'],[90,50,'ASIA'],[135,-27,'AUSTRALIA']].map(([lon,lat,label])=><text key={label} x={Number(lon)+180} y={90-Number(lat)} fill="#e3eeeb" opacity=".55" fontSize="2.5" textAnchor="middle" letterSpacing=".5" pointerEvents="none">{label}</text>)}
 {p.track&&p.track.lat.map((lat,i)=>i%2===0&&<circle key={i} cx={p.track!.lon[i]+180} cy={90-lat} r=".45" fill="#e3fcb2" pointerEvents="none"/>)}

 {p.point&&<g pointerEvents="none" transform={`translate(${p.point[1]+180} ${90-p.point[0]})`}><circle r="2.2" fill="none" stroke="#fff7cc" strokeWidth=".4"/><circle r=".6" fill="#fff7cc"/><path d="M-3.5 0H-1 M1 0H3.5 M0-3.5V-1 M0 1V3.5" stroke="#fff7cc" strokeWidth=".35"/></g>}
 </svg><div className="map-coordinates">{hover?`${Math.abs(hover[0]).toFixed(2)}°${hover[0]>=0?'N':'S'}  /  ${Math.abs(hover[1]).toFixed(2)}°${hover[1]>=0?'E':'W'}`:'180°W                         0°                         180°E'}</div><div className="map-credit">ERA5 land-sea mask · geographic projection</div></div>
}
