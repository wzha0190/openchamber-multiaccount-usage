(()=>{var Ko=Object.defineProperty;var Wo=(e,r,s)=>r in e?Ko(e,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[r]=s;var Ie=(e,r,s)=>Wo(e,typeof r!="symbol"?r+"":r,s);var E="openchamber.sdk";var xe="data-oc-scrolling",ze=`
:root {
  /* Quiet at rest like the app's own thumbs; hover gives a clear grab target. */
  --oc-scrollbar-thumb: color-mix(in srgb, var(--oc-muted, currentColor) 18%, transparent);
  --oc-scrollbar-thumb-hover: color-mix(in srgb, var(--oc-muted, currentColor) 36%, transparent);
  scrollbar-gutter: stable;
}
* {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}
:hover, [${xe}] {
  scrollbar-color: var(--oc-scrollbar-thumb) transparent;
}
/* Chromium's standard scrollbar properties otherwise override its pseudo-elements. */
@supports selector(::-webkit-scrollbar) {
  *, :hover, [${xe}] { scrollbar-width: auto; scrollbar-color: auto; }
  ::-webkit-scrollbar { width: 6px; height: 6px; background: transparent; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: transparent;
    border-radius: 999px;
    min-width: 24px;
    min-height: 24px;
  }
  :hover::-webkit-scrollbar-thumb, [${xe}]::-webkit-scrollbar-thumb { background: var(--oc-scrollbar-thumb); }
  ::-webkit-scrollbar-thumb:hover { background: var(--oc-scrollbar-thumb-hover); }
  ::-webkit-scrollbar-corner { background: transparent; }
  ::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
}
@media (forced-colors: active) {
  *, :hover, [${xe}] { scrollbar-color: auto; }
  ::-webkit-scrollbar-thumb, ::-webkit-scrollbar-thumb:hover { background: CanvasText; }
}
`;function qt(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let s=new WeakMap;e.addEventListener("scroll",i=>{let _=i.target===e?r:i.target;if(!(_ instanceof Element))return;_.hasAttribute("data-oc-scrolling")||_.setAttribute("data-oc-scrolling","");let f=s.get(_);f!==void 0&&clearTimeout(f),s.set(_,setTimeout(()=>{s.delete(_),_.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var jo=`(${qt.toString()})(document);`;var Zt=/^[a-z][a-z0-9-]{0,39}$/;var Yt=e=>Object(e)===e&&!Array.isArray(e),qe=(e,r)=>Object.keys(e).every(s=>r.includes(s)),Jt=e=>String(e)===e&&e.length>=1&&e.length<=60,Qt=e=>String(e)===e&&e.length>=1&&e.length<=80,eo=e=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let s of e){if(!Yt(s)||!Zt.test(s.id)||!Jt(s.label)||s.disabled!==void 0&&s.disabled!==!0&&s.disabled!==!1||r.has(s.id))return!1;if(r.add(s.id),s.kind==="button"){if(!qe(s,["kind","id","label","disabled"]))return!1;continue}if(s.kind!=="select"||!qe(s,["kind","id","label","value","options","disabled"])||!Qt(s.value)||!Array.isArray(s.options)||s.options.length<1||s.options.length>16)return!1;let i=new Set;for(let _ of s.options){if(!Yt(_)||!qe(_,["value","label"])||!Qt(_.value)||!Jt(_.label)||i.has(_.value))return!1;i.add(_.value)}if(!i.has(s.value))return!1}return!0};var qo=1024*1024;var to=["{id}","{segment}","{segments+}"];var vr=new Set(to);var oo=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Pr=new Set(oo);var Ye=e=>"bytes"in e?e.bytes.byteLength:e.content.length,ro=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let s=0;s<e.bytes.byteLength;s+=1)if(e.bytes[s]!==r.bytes[s])return!1;return!0};var no=/^[A-Za-z0-9_-]{1,80}$/;var so=["left","right","top","bottom"];var io=(e,r=0,s={remaining:16e3})=>{if(--s.remaining<0||r>=32)return!1;if(e===null)return!0;let i=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let _ of i)if(!io(_,r+1,s))return!1;return!0},Je=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(r=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(Je);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(Je)}return String(e)===e||Number.isFinite(e)},Qe=e=>{try{return String(e.id)!==e.id||!no.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!so.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!io(e.data)||!Je(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var et=2e3;var co=["file","directory","other","missing"],tt=e=>!!(e&&"sessionId"in e),ot=e=>!!(e&&"sent"in e&&!("sessionId"in e));var lo=/^[0-9a-f]{7,64}$/i,rt=e=>lo.test(e),ge=500,be=32e3,po=16e3,uo=128,_o=200,Eo=2e3,To=16e3,So=80,fo=200,Ao=16e3;var Oo=2e3;var nt=2e4,ke=1024,Ce=2e6;var Ue=64e3,Me=8e3,st=4e3;var it=96e4,Yo=60*6e4;var Ro=999,ho=1e4,_e=500,mo=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],Io=["stopped","starting","ready","failed"],Jo=new Set(mo),xo=e=>Jo.has(e),go=e=>e&&xo(e)?e:"HOST_REJECTED",oe=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(oe):Object(e)===e?Object.values(e).every(oe):!1,bo=e=>oe(e)&&JSON.stringify(e).length<=Ao,ao=e=>e?.trim().slice(0,fo)??"",re=e=>{let r=e.id.trim().slice(0,uo),s=e.title.trim().slice(0,_o),i=e.url.trim().slice(0,Eo),_=e.text?.trim().slice(0,To),f=e.author?.trim().slice(0,So),G=e.kind==="pull"?"pull":"issue",b={providerId:e.providerId.trim(),id:r,title:s||r,url:i,kind:G};if(_&&(b.text=_),f&&(b.author=f),G==="pull"){let H=ao(e.branches?.head),$=ao(e.branches?.base);H&&$&&(b.branches={head:H,base:$})}return bo(e.data)&&(b.data=e.data),b},at=e=>{let r=re(e);return e.projectId&&(r.projectId=e.projectId),e.navigation&&(r.navigation=e.navigation),e.worktree&&(r.worktree=e.worktree),r},ct=e=>{let r={text:e.text.trim().slice(0,po)};return e.send&&(r.send=!0),r},dt=e=>e===null||!Number.isFinite(e)?null:Math.min(Ro,Math.max(0,Math.round(e))),lt=e=>Number.isFinite(e)?Math.min(ho,Math.max(0,Math.ceil(e))):0;var ne=e=>e.length>0&&e.length<=ke&&!e.includes("\0")&&!e.includes("\\");var ye=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>Oo?!1:!e.split("/").some(s=>s==="."||s===".."),Qo=new Set(Io),pt=e=>!!(e&&"status"in e&&Qo.has(String(e.status))&&!("body"in e)),Ne=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),ut=e=>!!(e&&"content"in e&&String(e.content)===e.content),_t=e=>!!(e&&"written"in e&&e.written===!0),Et=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Zo=new Set(co),Tt=e=>!!(e&&"kind"in e&&"size"in e&&Zo.has(String(e.kind))&&Number.isFinite(e.size)),St=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),er=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),tr=e=>Object(e)===e?e:null,Ze=e=>String(e)===e&&e.length>0,or=e=>{if(!Ze(e.id))return null;if(e.ok===!0){let r={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(r.payload=e.payload),r}return e.ok===!1&&Ze(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:go(Ze(e.code)?e.code:void 0)}:null},ft=e=>{let r=tr(e);return!r||r.channel!==E||r.v!==1?null:r.type==="result"?or(r):!er.has(String(r.type))||Object(r.payload)!==r.payload?null:r};var ko=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,rr=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",l=class extends Error{constructor(s,i){super(i);Ie(this,"code");this.name="HostRequestError",this.code=s}},Co=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ve=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${ke} characters without NUL or backslash.`)),Le=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new l("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},u=e=>(e.value+=1,`oc-${e.value}`),mt=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let s=e.acceptSource??(t=>t===r.parent),i=e.requestTimeoutMs??nt,_=new Set,f=new Set,G=new Set,b=new Set,H=new Set,$=new Set,S=new Set,U=new Set,N=new Set,J=new Set,Q=new Set,z=new Set,Fe=[],ae=null,ce=null,Ae=new Set,Oe=new Set,de=null,le=null,Be=!1,Z=new Map,ee=new Map,te=new Map,F=!1,p={value:0},d=null,B=null,pe=!1,ue=!1,Dt=null,Gt=t=>t?{sessionId:t.id,phase:t.busy?"started":"completed"}:null,w=t=>{r.parent.postMessage(t,"*")},Xt=()=>{F||r.parent===r||z.size===0||d?.features?.lateGenerateResults!==!0||w({channel:E,v:1,type:"generate-late-listen"})},h=(t,o)=>{for(let a of t)try{a(o)}catch(c){console.error(c)}},Ht=t=>{if(!(t instanceof MessageEvent)||!s(t.source))return;let o=ft(t.data);if(!o)return;if(o.type==="workspace"){let c=ee.get(o.payload.subscriptionId);c&&h([c],o.payload.snapshot);return}if(o.type==="shells"){let c=te.get(o.payload.subscriptionId);c&&h([c],o.payload.snapshot);return}if(o.type==="ready"){d=o.payload,B=Gt(o.payload.session),h(_,o.payload),h(f,o.payload.directory),h(G,o.payload.session),B&&h(b,B),h(H,o.payload.connection),h($,o.payload.settings),h(S,o.payload.item),o.payload.block&&h(U,o.payload.block),Xt();return}if(o.type==="service-event"){h(N,o.payload);return}if(o.type==="generate-late"){z.size===0?Fe.push(o.payload):h(z,o.payload);return}if(o.type==="directory"){d&&(d={...d,directory:o.payload.directory}),h(f,o.payload.directory);return}if(o.type==="session"){d&&(d={...d,session:o.payload.session}),o.payload.session?B?.sessionId!==o.payload.session.id&&(B=Gt(o.payload.session)):B=null,h(G,o.payload.session);return}if(o.type==="session-lifecycle"){B=o.payload,h(b,o.payload);return}if(o.type==="connection"){d&&(d={...d,connection:o.payload.connection}),h(H,o.payload.connection);return}if(o.type==="settings"){d&&(d={...d,settings:o.payload.settings}),h($,o.payload.settings);return}if(o.type==="item"){d&&(d={...d,item:o.payload.item}),h(S,o.payload.item);return}if(o.type==="status-control-event"){h(J,o.payload);return}if(o.type==="popover-closed"){h(Q,o.payload);return}if(o.type==="action"){let c=A=>{F||w({channel:E,v:1,type:"action-result",id:o.id,payload:A})},O=ce;if(!O){c({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>O(o.payload)).then(()=>c({ok:!0}),A=>{let C=(A instanceof Error?A.message:String(A)).trim();c({ok:!1,error:(C||"Action failed.").slice(0,_e)})});return}if(o.type==="file-open"){let c=o.payload;if(le&&ro(le,c))return;le=c,h(Ae,o.payload);return}if(o.type==="file-saved"){h(Oe,o.payload.version);return}if(o.type==="file-snapshot"){let c=C=>{F||w({channel:E,v:1,type:"file-snapshot-result",id:o.id,payload:C})},O=C=>c({error:(C.trim()||"Could not read the edited file.").slice(0,_e)}),A=de;if(!A){O("This extension does not edit files.");return}Promise.resolve().then(()=>A(o.payload.purpose)).then(C=>{if(Ye(C)>2e7){O(`The file is over ${2e7} ${"bytes"in C?"bytes":"characters"}.`);return}if(C.version.length>256){O(`The snapshot version is over ${256} characters.`);return}c({snapshot:"bytes"in C?{bytes:C.bytes,version:C.version}:{content:C.content,version:C.version}})},C=>O(C instanceof Error?C.message:String(C)));return}if(o.type==="resolve"){let c=A=>{w({channel:E,v:1,type:"resolve-result",id:o.id,payload:A})},O=ae;if(!O){c({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>O(o.payload)).then(A=>c({item:A?re(A):null}),A=>{let C=(A instanceof Error?A.message:String(A)).trim();c({error:(C||"Command failed.").slice(0,_e)})});return}let a=Z.get(o.id);if(a){if(clearTimeout(a.timer),Z.delete(o.id),o.ok){a.resolve(o.payload);return}a.reject(new l(o.code,o.error))}};r.addEventListener("message",Ht),w({channel:E,v:1,type:"hello"});let M=(t,o=i)=>F||r.parent===r?Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((a,c)=>{let O=setTimeout(()=>{Z.delete(t.id),c(new l("HOST_TIMEOUT","Host did not answer in time."))},o);Z.set(t.id,{resolve:a,reject:c,timer:O}),w(t)}),g=t=>M(t).then(()=>{}),k={channel:E,v:1},Ke=t=>{!F&&r.parent!==r&&w(t)},$t=()=>Ke({...k,type:"file-save"}),Vt=t=>{!ko(t)||!rr(t)||(t.preventDefault(),$t())},Ft=t=>{!ko(t)||t.key!=="Escape"||d?.surface!=="popover"||!d.popover||(t.preventDefault(),jt(d.popover.id,"escape").catch(()=>{}))},Re=()=>{let t=d?.surface==="popover"?d.popover:void 0;if(!t)return;let o=pe||ue;Dt!==o&&(Dt=o,zt(t.id,o).catch(()=>{}))},he=()=>{d?.surface!=="popover"||pe||(pe=!0,Re())},Bt=t=>{d?.surface!=="popover"||t.relatedTarget!==null||!pe||(pe=!1,Re())},Kt=()=>{d?.surface!=="popover"||ue||(ue=!0,Re())},Wt=()=>{d?.surface!=="popover"||!ue||(ue=!1,Re())},V=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new l("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},We=async t=>{t.kind!=="projects"&&V(t.projectId);let o=await M({...k,type:"workspace-read",id:u(p),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return o},je=async(t,o)=>{t.kind!=="projects"&&V(t.projectId);let a=u(p);ee.set(a,o);try{await g({...k,type:"workspace-subscribe",id:u(p),payload:{subscriptionId:a,query:t}})}catch(c){throw ee.delete(a),F||w({...k,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:a}}),c}return()=>{!ee.delete(a)||F||w({...k,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:a}})}},Bo=async(t,o)=>{t.kind==="session"&&V(t.sessionId),t.kind==="project"&&V(t.projectId);let a=u(p);te.set(a,o);try{await g({...k,type:"shells-subscribe",id:u(p),payload:{subscriptionId:a,scope:t}})}catch(c){throw te.delete(a),F||w({...k,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:a}}),c}return()=>{!te.delete(a)||F||w({...k,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:a}})}},me=async t=>{if("key"in t&&(t.key.length===0||t.key.length>128))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!oe(t.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>65536)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&d?.features?.deviceStorage!==!0)throw new l("UNSUPPORTED","This host does not support device storage.");let o=await M({...k,type:"storage",id:u(p),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new l("HOST_REJECTED","Host did not return storage data.");return o},jt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):g({...k,type:"popover-close",id:u(p),payload:o?{id:t,reason:o}:{id:t}}),zt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):g({...k,type:"popover-anchor",id:u(p),payload:{id:t,active:o}});return r.addEventListener("keydown",Ft,!0),r.addEventListener("pointerover",he),r.addEventListener("pointermove",he),r.addEventListener("pointerout",Bt),r.addEventListener("focus",Kt),r.addEventListener("blur",Wt),{onAction:t=>(ce=t,()=>{ce===t&&(ce=null)}),listProjects:async()=>{let t=await We({kind:"projects"});if(t.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return t},listWorktrees:async t=>{let o=await We({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return o},listSessions:async t=>{let o=await We({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return o},onProjects:t=>je({kind:"projects"},o=>{o.kind==="projects"&&t(o)}),onWorktrees:(t,o)=>je({kind:"worktrees",projectId:t},a=>{a.kind==="worktrees"&&o(a)}),onSessions:(t,o)=>je({kind:"sessions",projectId:t},a=>{a.kind==="sessions"&&o(a)}),onRunningShells:(t,o)=>Bo(t,o),readShellOutput:async(t,o)=>{V(t,128);let a=o?.cursor;if(a!==void 0&&(!Number.isInteger(a)||a<0))throw new l("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let c=o?.tailBytes;if(c!==void 0&&(!Number.isInteger(c)||c<1||c>65536))throw new l("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let A=await M({...k,type:"shell-output",id:u(p),payload:{shellId:t,cursor:a,tailBytes:c}});if(!A||typeof A.output!="string"||!Number.isFinite(A.cursor))throw new l("HOST_REJECTED","Host did not return shell output.");return A},stopShell:async t=>{if(V(t,128),(await M({...k,type:"shell-stop",id:u(p),payload:{shellId:t}}))?.stopped!==!0)throw new l("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async t=>{V(t),await g({...k,type:"open-session",id:u(p),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let a=Le(o),c={op:"get",key:t};a&&(c.scope=a);let O=await me(c);return O.op==="get"&&O.found?O.value:void 0},set:async(t,o,a)=>{let c=Le(a),O={op:"set",key:t,value:o};c&&(O.scope=c),await me(O)},delete:async(t,o)=>{let a=Le(o),c={op:"delete",key:t};a&&(c.scope=a),await me(c)},keys:async t=>{let o=Le(t),a={op:"keys"};o&&(a.scope=o);let c=await me(a);if(c.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return c.keys}},onReady:t=>(_.add(t),d&&t(d),()=>{_.delete(t)}),onDirectory:t=>(f.add(t),d&&t(d.directory),()=>{f.delete(t)}),onSession:t=>(G.add(t),d&&t(d.session),()=>{G.delete(t)}),onSessionLifecycle:t=>(b.add(t),B&&t(B),()=>{b.delete(t)}),onConnection:t=>(H.add(t),d&&t(d.connection),()=>{H.delete(t)}),onSettings:t=>($.add(t),d&&t(d.settings),()=>{$.delete(t)}),onItem:t=>(S.add(t),d&&t(d.item),()=>{S.delete(t)}),onBlock:t=>(U.add(t),d?.block&&t(d.block),()=>{U.delete(t)}),onServiceEvent:t=>(N.add(t),()=>{N.delete(t)}),onStatusControl:t=>(J.add(t),()=>{J.delete(t)}),onPopoverClosed:t=>(Q.add(t),()=>{Q.delete(t)}),setStatusControls:t=>d?.features?.statusControls!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support status controls.")):eo(t)?g({...k,type:"status-controls",id:u(p),payload:{controls:t}}):Promise.reject(new l("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:t=>d?.features?.popovers!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):Qe(t)?g({...k,type:"popover-open",id:u(p),payload:t}):Promise.reject(new l("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:jt,setPopoverAnchorActive:zt,onResolve:t=>(ae=t,()=>{ae===t&&(ae=null)}),toast:t=>{let o=t.message.trim();return!o||o.length>ge?Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${ge} characters.`)):t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>be)?Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${be} characters.`)):g({channel:E,v:1,type:"toast",id:u(p),payload:{...t,message:o}})},openUrl:t=>g({channel:E,v:1,type:"open-url",id:u(p),payload:{url:t}}),openCommit:t=>rt(t)?g({channel:E,v:1,type:"open-commit",id:u(p),payload:{sha:t}}):Promise.reject(new l("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:t=>g({channel:E,v:1,type:"block-answer",id:u(p),payload:{text:t.trim().slice(0,et)}}),openSurface:t=>g({channel:E,v:1,type:"open-surface",id:u(p),payload:{surfaceId:t}}),writeClipboard:t=>g({channel:E,v:1,type:"clipboard-write",id:u(p),payload:{text:t}}),compose:t=>g({channel:E,v:1,type:"compose",id:u(p),payload:t}),attach:t=>g({channel:E,v:1,type:"attach",id:u(p),payload:re(t)}),startSession:async t=>{t.projectId!==void 0&&V(t.projectId);let o=t.worktree;o&&o!==!0&&(o.kind==="existing"?V(o.directory):(o.name!==void 0&&V(o.name,200),o.baseBranch!==void 0&&V(o.baseBranch,200)));let a=await M({channel:E,v:1,type:"start-session",id:u(p),payload:at(t)},e.requestTimeoutMs??18e4);if(!tt(a))throw new l("HOST_REJECTED","Host did not return a session.");return a},prompt:t=>M({channel:E,v:1,type:"prompt",id:u(p),payload:ct(t)}).then(o=>{if(!ot(o))throw new l("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:t=>g({channel:E,v:1,type:"session-link",id:u(p),payload:re(t)}),close:()=>g({channel:E,v:1,type:"close",id:u(p)}),oauthStart:()=>g({channel:E,v:1,type:"oauth-start",id:u(p)}),oauthDisconnect:()=>g({channel:E,v:1,type:"oauth-disconnect",id:u(p)}),request:t=>(ye(t.path)?M({channel:E,v:1,type:"request",id:u(p),payload:t}):Co()).then(o=>{if(!Ne(o))throw new l("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:t=>(ye(t.path)?M({channel:E,v:1,type:"service-request",id:u(p),payload:t}):Co()).then(o=>{if(!Ne(o))throw new l("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>M({channel:E,v:1,type:"service-status",id:u(p)}).then(t=>{if(!pt(t))throw new l("HOST_REJECTED","Host did not return service status.");return t}),readFile:t=>(ne(t)?M({channel:E,v:1,type:"file-read",id:u(p),payload:{path:t}}):ve()).then(o=>{if(!ut(o))throw new l("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>ne(t)?o.length>Ce?Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ce} characters.`)):M({channel:E,v:1,type:"file-write",id:u(p),payload:{path:t,content:o}}).then(a=>{if(!_t(a))throw new l("HOST_REJECTED","Host did not confirm the write.");return a}):ve(),listDir:t=>(ne(t)?M({channel:E,v:1,type:"file-list",id:u(p),payload:{path:t}}):ve()).then(o=>{if(!Et(o))throw new l("HOST_REJECTED","Host did not return directory entries.");return o}),stat:t=>(ne(t)?M({channel:E,v:1,type:"file-stat",id:u(p),payload:{path:t}}):ve()).then(o=>{if(!Tt(o))throw new l("HOST_REJECTED","Host did not return file status.");return o}),generate:t=>{let o=t.prompt.trim(),a=t.system?.trim();if(o.length===0||o.length>Ue)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${Ue} characters.`));if(a!==void 0&&(a.length===0||a.length>Me))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${Me} characters.`));let c=t.maxOutputTokens===void 0?void 0:Math.min(st,Math.max(1,Math.floor(t.maxOutputTokens)));if(c!==void 0&&!Number.isFinite(c))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let O={prompt:o};return a!==void 0&&(O.system=a),c!==void 0&&(O.maxOutputTokens=c),M({channel:E,v:1,type:"generate",id:u(p),payload:O},e.requestTimeoutMs??it).then(A=>{if(!St(A))throw new l("HOST_REJECTED","Host did not return generated text.");return A})},onLateGenerateResult:t=>{z.add(t);for(let o of Fe.splice(0))h([t],o);return Xt(),()=>{z.delete(t)}},setBadge:t=>g({channel:E,v:1,type:"badge",id:u(p),payload:{count:dt(t)}}),setHeight:t=>g({channel:E,v:1,type:"resize",id:u(p),payload:{height:lt(t)}}),onFileOpen:t=>(Ae.add(t),Be||(Be=!0,r.addEventListener("keydown",Vt,!0)),le&&t(le),()=>{Ae.delete(t)}),onFileSnapshot:t=>(de=t,()=>{de===t&&(de=null)}),onFileSaved:t=>(Oe.add(t),()=>{Oe.delete(t)}),reportFileChange:t=>Ke({...k,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:$t,reportFileUnsupported:()=>Ke({...k,type:"file-unsupported"}),dispose:()=>{for(let t of ee.keys())w({...k,type:"workspace-unsubscribe",id:u(p),payload:{subscriptionId:t}});ee.clear();for(let t of te.keys())w({...k,type:"shells-unsubscribe",id:u(p),payload:{subscriptionId:t}});te.clear(),F=!0,ae=null,ce=null,de=null,Ae.clear(),Oe.clear(),Be&&r.removeEventListener("keydown",Vt,!0),r.removeEventListener("message",Ht),r.removeEventListener("keydown",Ft,!0),r.removeEventListener("pointerover",he),r.removeEventListener("pointermove",he),r.removeEventListener("pointerout",Bt),r.removeEventListener("focus",Kt),r.removeEventListener("blur",Wt);for(let t of Z.values())clearTimeout(t.timer),t.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));Z.clear(),_.clear(),f.clear(),G.clear(),b.clear(),H.clear(),$.clear(),S.clear(),U.clear(),N.clear(),J.clear(),Q.clear(),z.clear(),Fe.length=0}}};var yo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Zr=new Set(yo);var nr=10*6e4;var sr=10*6e4;var ir=10*6e4;var ar=10*6e4;var No=["none","agent","user"];var on=new Set(No);var cr=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],dr=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],vo=(e,r)=>{r.style.colorScheme=e.mode;for(let[s,i]of cr)r.style.setProperty(s,e.tokens[i]);for(let[s,i,_]of dr){let f=e.tokens[_]??"";r.style.setProperty(s,f),r.style.setProperty(i,f)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},It=(e,r)=>{vo(e.theme,r),r.dataset&&(r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode)};var lr={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},R=(e,r)=>`var(--${e}, var(--oc-${lr[e]}, ${r}))`,W=R("surface-background","transparent"),we=R("surface-elevated","transparent"),se=R("surface-elevated-foreground","inherit"),D=R("surface-foreground","inherit"),m=R("surface-muted-foreground","gray"),pr=R("surface-muted","transparent"),q=R("interactive-border","currentColor"),v=R("interactive-hover","transparent"),Y=R("interactive-active","transparent"),xt=R("interactive-selection","transparent"),gt=R("interactive-selection-foreground","inherit"),K=R("primary","currentColor"),bt=R("primary-text","inherit"),kt=R("error-text","inherit"),ur=R("font-sans","inherit"),Ct=R("font-mono","monospace"),Do=R("radius","9px"),Ut=`calc(${Do} - 2px)`,Lo=`calc(${Do} - 4px)`,I=(e,r,s="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${s})`,Po=`background-image: linear-gradient(${v}, ${v});`,Mt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,yt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",wo="box-shadow: var(--oc-sdk-lit);",Nt=`inset 0 0.5px 0 0 ${I(D,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,_r=`
:root {
  --oc-sdk-edge: ${I(D,16)};
  --oc-sdk-field-bg: ${we};
  --oc-sdk-raised-bg: ${W};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${I(D,14)};
  --oc-sdk-field-bg: ${I(W,50,we)};
  --oc-sdk-raised-bg: ${we};
  --oc-sdk-field-lift: ${Nt};
  --oc-sdk-raised-lift: ${Nt};
  --oc-sdk-lit: ${Nt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Pe=e=>{let r=R(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${R(`${e}-text`,"inherit")}; }`},n=e=>`calc(${e}rem / 14)`,Er=`
.oc-sdk { box-sizing: border-box; font-size: 0.875rem; line-height: 1.45; }
.oc-sdk *, .oc-sdk *::before, .oc-sdk *::after { box-sizing: border-box; }
/* :where() keeps the reset at zero specificity so every primitive class below overrides it. */
:where(.oc-sdk) :where(button, input, textarea), :where(button.oc-sdk, input.oc-sdk, textarea.oc-sdk) { font: inherit; color: inherit; margin: 0; }
:where(.oc-sdk) :where(button), :where(button.oc-sdk) { cursor: pointer; background: none; border: 0; padding: 0; }
.oc-sdk button:disabled, button.oc-sdk:disabled, .oc-sdk[aria-disabled="true"], .oc-sdk [aria-disabled="true"] { opacity: .5; pointer-events: none; }

.oc-sdk-btn { display: inline-flex; align-items: center; justify-content: center; gap: ${n(8)}; height: ${n(32)}; padding: 0 ${n(12)}; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; line-height: 1; white-space: nowrap; }
.oc-sdk-btn[data-size="sm"] { gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; font-size: 0.8125rem; }
.oc-sdk-btn[data-size="xs"] { gap: ${n(4)}; height: ${n(24)}; padding: 0 ${n(8)}; font-size: 0.75rem; }
.oc-sdk-btn[data-loading="true"] { opacity: .5; pointer-events: none; }
.oc-sdk-btn > .oc-sdk-spinner-ring { width: ${n(14)}; height: ${n(14)}; }

.oc-sdk-field { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-field-label { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-field-note { font-size: 0.75rem; }
.oc-sdk-input { display: block; width: 100%; min-width: 0; height: ${n(32)}; padding: 0 ${n(10)}; border: 0; font-size: 0.875rem; line-height: 1.45; appearance: none; }
textarea.oc-sdk-input { height: auto; padding: ${n(8)} ${n(10)}; resize: vertical; }

.oc-sdk-search { position: relative; min-width: 0; }
.oc-sdk-search .oc-sdk-input { padding-left: ${n(34)}; padding-right: ${n(34)}; }
.oc-sdk-search-icon { position: absolute; left: ${n(11)}; top: 50%; transform: translateY(-50%); pointer-events: none; }
.oc-sdk-search-clear { position: absolute; right: ${n(6)}; top: 50%; transform: translateY(-50%); display: none; align-items: center; justify-content: center; width: ${n(24)}; height: ${n(24)}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-clear { display: inline-flex; }

.oc-sdk-select { position: relative; display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-trigger { display: inline-flex; align-items: center; gap: ${n(6)}; align-self: flex-start; width: auto; max-width: 100%; min-width: 0; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; text-align: left; }
.oc-sdk-trigger-value { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-trigger-chevron { flex: 0 0 auto; }
.oc-sdk-popup { position: fixed; z-index: 50; display: flex; flex-direction: column; gap: ${n(2)}; min-width: ${n(160)}; max-width: calc(100vw - ${n(16)}); max-height: min(${n(320)}, calc(100vh - ${n(16)})); overflow: auto; padding: ${n(4)}; border: 1px solid transparent; }
.oc-sdk-popup-search { flex: 0 0 auto; padding: ${n(2)} ${n(2)} ${n(4)}; }
.oc-sdk-popup-search .oc-sdk-input { height: ${n(28)}; font-size: 0.8125rem; }
.oc-sdk-option { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; font-size: 0.8125rem; text-align: left; }
.oc-sdk-option-label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-option-hint { flex: 0 0 auto; font-size: 0.75rem; }
.oc-sdk-option-check { flex: 0 0 auto; display: inline-flex; width: ${n(14)}; visibility: hidden; }
.oc-sdk-option[aria-selected="true"] > .oc-sdk-option-check { visibility: visible; }
.oc-sdk-popup-empty { padding: ${n(8)}; font-size: 0.8125rem; }

.oc-sdk-check { display: inline-flex; align-items: flex-start; gap: ${n(8)}; width: 100%; text-align: left; }
.oc-sdk-check-box { flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; width: ${n(14)}; height: ${n(14)}; margin-top: ${n(3)}; border: 1px solid transparent; }
.oc-sdk-check-box > svg { display: none; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box > svg { display: block; }
.oc-sdk-check-thumb { flex: 0 0 auto; position: relative; width: ${n(36)}; height: ${n(20)}; --oc-sdk-thumb-travel: ${n(16)}; }
.oc-sdk-check-thumb::after { content: ""; position: absolute; top: ${n(2)}; left: ${n(2)}; width: ${n(16)}; height: ${n(16)}; }
.oc-sdk-check-text { display: flex; flex-direction: column; min-width: 0; }
.oc-sdk-check-label { font-size: 0.875rem; }
.oc-sdk-check-desc { font-size: 0.75rem; }

.oc-sdk-tabs { display: inline-flex; gap: ${n(2)}; padding: ${n(2)}; max-width: 100%; overflow: auto; }
.oc-sdk-tab { display: inline-flex; align-items: center; gap: ${n(6)}; height: ${n(28)}; padding: 0 ${n(10)}; border: 1px solid transparent; font-size: 0.8125rem; font-weight: 500; white-space: nowrap; }
.oc-sdk-tab-count { font-size: 0.75rem; font-variant-numeric: tabular-nums; }

.oc-sdk-badge { display: inline-flex; align-items: center; padding: ${n(1)} ${n(6)}; font-size: ${n(11)}; font-weight: 500; line-height: ${n(16)}; white-space: nowrap; }

.oc-sdk-list { display: flex; flex-direction: column; gap: 1px; min-width: 0; }
.oc-sdk-row { display: flex; align-items: center; gap: ${n(8)}; width: 100%; padding: ${n(6)} ${n(8)}; text-align: left; }
.oc-sdk-row-lead { flex: 0 0 auto; width: ${n(64)}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; }
.oc-sdk-row-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.oc-sdk-row-sub { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.75rem; }
.oc-sdk-row-meta { flex: 0 0 auto; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-list-empty { padding: ${n(16)} ${n(8)}; text-align: center; font-size: 0.8125rem; }

.oc-sdk-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: ${n(4)}; padding: ${n(40)} ${n(16)}; text-align: center; }
.oc-sdk-empty-title { margin: 0; font-size: 0.8125rem; font-weight: 600; }
.oc-sdk-empty-body { margin: 0; max-width: 32rem; font-size: 0.8125rem; }
.oc-sdk-empty-action { margin-top: ${n(12)}; }

@keyframes oc-sdk-spin { to { transform: rotate(360deg); } }
.oc-sdk-spinner { display: inline-flex; align-items: center; gap: ${n(8)}; font-size: 0.8125rem; }
.oc-sdk-spinner-ring { width: ${n(16)}; height: ${n(16)}; border: 2px solid transparent; animation: oc-sdk-spin .8s linear infinite; }
.oc-sdk-spinner[data-size="sm"] .oc-sdk-spinner-ring { width: ${n(12)}; height: ${n(12)}; }

.oc-sdk-banner { display: flex; align-items: flex-start; gap: ${n(12)}; padding: ${n(8)} ${n(12)}; border: 1px solid transparent; }
.oc-sdk-banner-text { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: ${n(2)}; }
.oc-sdk-banner-title { font-size: 0.8125rem; font-weight: 500; }
.oc-sdk-banner-body { font-size: 0.8125rem; }
.oc-sdk-banner-action { flex: 0 0 auto; }

.oc-sdk-separator { display: flex; align-items: center; gap: ${n(8)}; width: 100%; margin: ${n(8)} 0; font-size: 0.75rem; }
.oc-sdk-separator::before, .oc-sdk-separator::after { content: ""; flex: 1 1 auto; height: 1px; }
.oc-sdk-separator[data-labeled="false"]::after { display: none; }
.oc-sdk-popup > .oc-sdk-separator { margin: ${n(4)} 0; }

.oc-sdk-progress { display: flex; flex-direction: column; gap: ${n(4)}; min-width: 0; }
.oc-sdk-progress-label { display: flex; justify-content: space-between; font-size: 0.75rem; font-variant-numeric: tabular-nums; }
.oc-sdk-progress-track { height: ${n(6)}; overflow: hidden; }
.oc-sdk-progress-fill { height: 100%; transform-origin: left; transition: transform 200ms ease-out; }
.oc-sdk-progress-value { display: inline-flex; align-items: center; gap: ${n(2)}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { font-weight: 600; }

.oc-sdk-menu { position: relative; display: inline-flex; }

.oc-sdk-text { white-space: pre-wrap; overflow-wrap: anywhere; }
.oc-sdk-text img { display: block; max-width: 100%; margin: ${n(8)} 0; }

/* Under a finger the controls reach the app's touch sizes: rows and options 44px like its sheets, every other
   control at least 36px. Inputs keep 16px text, below which iOS zooms the page on focus. */
@media (pointer: coarse) {
  .oc-sdk-btn, .oc-sdk-input { height: ${n(40)}; }
  .oc-sdk-btn[data-size="sm"], .oc-sdk-btn[data-size="xs"], .oc-sdk-trigger, .oc-sdk-tab, .oc-sdk-popup-search .oc-sdk-input { height: ${n(36)}; }
  .oc-sdk-input, .oc-sdk-popup-search .oc-sdk-input { font-size: max(16px, 0.875rem); }
  .oc-sdk-search-clear { width: ${n(36)}; height: ${n(36)}; right: 0; }
  .oc-sdk-row, .oc-sdk-option { min-height: ${n(44)}; }
  .oc-sdk-check { min-height: ${n(36)}; padding: ${n(8)} 0; }
}
`,Go=`${_r}
.oc-sdk { color: ${D}; font-family: ${ur}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Po} }
.oc-sdk-mono { font-family: ${Ct}; }
.oc-sdk-muted { color: ${m}; }
${Pe("success")}${Pe("warning")}${Pe("error")}${Pe("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${K}; --oc-sdk-tone-text: ${bt}; }

.oc-sdk-btn { border-radius: ${Ut}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${Lo}; }
.oc-sdk-btn[data-variant="default"] { color: ${bt}; background: ${I(K,10,W)}; border-color: ${I(K,12)}; ${wo} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${I(K,16,W)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${I(K,22,W)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${pr}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${Y}, ${Y}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${se}; ${yt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${Y}, ${Y}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${v}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${Y}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${R("status-error","red")}; color: ${kt}; background: ${I("var(--oc-sdk-tone)",7,W)}; border-color: ${I("var(--oc-sdk-tone)",12)}; ${wo} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${I("var(--oc-sdk-tone)",9,W)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${I("var(--oc-sdk-tone)",11,W)}; box-shadow: none; }

.oc-sdk-field-note { color: ${m}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${kt}; }
.oc-sdk-input { border-radius: ${Ut}; background: var(--oc-sdk-field-bg); color: ${se}; ${Mt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${m}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Mt(I(D,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Mt(R("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Ct}; }

.oc-sdk-search-icon { color: ${m}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${K}; }
.oc-sdk-search-clear { border-radius: ${Lo}; color: ${m}; }
.oc-sdk-search-clear:hover { background: ${v}; color: ${D}; }

.oc-sdk-trigger { border-radius: ${Ut}; background: var(--oc-sdk-raised-bg); color: ${se}; ${yt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${v}, ${v}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${Y}, ${Y}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${m}; }
.oc-sdk-trigger-chevron { color: ${m}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${se}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${we}; background-clip: padding-box; color: ${se}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${v}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${xt}; color: ${gt}; }
.oc-sdk-option-check { color: ${D}; }
.oc-sdk-option[data-destructive="true"] { color: ${kt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${I(R("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${m}; }
.oc-sdk-popup-empty { color: ${m}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${q}; border-radius: 4px; color: ${D}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${I(D,60,q)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${q}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${W}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${K}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Po} }
.oc-sdk-check-desc { color: ${m}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${I(D,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${m}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${D}; }
.oc-sdk-tab[aria-selected="true"] { color: ${gt}; background: ${xt}; border-color: ${q}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${se}; background: var(--oc-sdk-raised-bg); ${yt} }
.oc-sdk-tab-count { color: ${m}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${I(D,6)}; color: ${m}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${I("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${v}; }
.oc-sdk-row[aria-selected="true"] { background: ${xt}; color: ${gt}; }
.oc-sdk-row-lead { font-family: ${Ct}; color: ${m}; }
.oc-sdk-row-sub { color: ${m}; }
.oc-sdk-row-meta { color: ${m}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${m}; }

.oc-sdk-empty-body { color: ${m}; }

.oc-sdk-spinner { color: ${m}; }
.oc-sdk-spinner-ring { border-color: ${q}; border-top-color: ${K}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${I("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${m}; }

.oc-sdk-separator { color: ${m}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${I(q,40)}; }

.oc-sdk-progress-label { color: ${m}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${I(D,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${K}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${R("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${R("success-text","inherit")}; }

.oc-sdk-text a { color: ${bt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${I(q,60)}; }
`,y=`
${ze}
${Er}
${Go}`;var Or=3e4,fe=mt(),X=document.getElementById("root"),Xo=!1,$o=!1,Vo=null,Te=null,$e=null,Se=null,Fo={codex:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6l6 6-6 6M12 18h8"/></svg>',claude:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>',zen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M8 4H5v16h3M16 4h3v16h-3"/></svg>'};Fo.custom='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M14.5 9.5c-.5-1-1.4-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.6 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1.1 0-2-.5-2.5-1.5M12 6.5V8m0 8v1.5"/></svg>';var Rr={codex:"Codex",claude:"Claude",zen:"OpenCode Zen"},x=(e,r,s)=>{let i=document.createElement(e);return r&&(i.className=r),s!==void 0&&(i.textContent=s),i},hr=e=>e.includes("@")?e.split("@")[0]:e,Ho=e=>{if(!e)return"";let r=new Date(e);if(Number.isNaN(r.getTime()))return"";let s=r.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});return e-Date.now()<24*3600*1e3?s:`${r.toLocaleDateString(void 0,{weekday:"short"})} ${s}`},mr=e=>e==null?"":e>=90?"hot":e>=70?"warm":"",Lt=(e,r,s,i,_)=>{let f=x("div","row");return f.append(x("span","lab",e)),r&&f.append(x("span","sub",r)),f.append(x("span",`val ${i||""}`.trim(),s)),_&&(f.title=_),f},Pt=()=>{if(X.classList.remove("compact"),X.replaceChildren(),!$e){X.append(x("div","empty",Se??"Loading accounts\u2026")),wt();return}let e=$e.accounts??[];e.length===0&&X.append(x("div","empty","No Codex or Claude accounts found."));let r=["claude","codex","zen","custom"],s=[...e].sort((i,_)=>r.indexOf(i.provider)-r.indexOf(_.provider)||i.label.localeCompare(_.label,void 0,{numeric:!0,sensitivity:"base"}));for(let i of s){let _=x("section","acct"),f=x("div","head");f.title=i.label;let G=x("span","ic");if(G.innerHTML=Fo[i.provider]??"",i.provider==="custom"?f.append(G,x("span","name",i.label)):(f.append(G,x("span","name",Rr[i.provider]??i.provider)),f.append(x("span","who",`\xB7 ${hr(i.label)}`))),i.active&&f.append(x("span","badge","active")),i.resets){let{available:S,usable:U}=i.resets,N=x("span",`resets ${U>0?"usable":""}`.trim(),U>0?`\u21BA ${U} usable`:`\u21BA ${S}`);N.title=`${S} usage reset${S===1?"":"s"} on this account. `+(U>0?`${U} can be used now, since the account has hit its limit.`:"A reset can only be used once the account hits its limit."),f.append(N)}_.append(f);let b=x("div","body");for(let S of i.windows??[]){let U=S.usedPercent,N=S.resetAt?new Date(S.resetAt).toLocaleString():"";if(S.resetAt&&S.resetAt<=Date.now()){b.append(Lt(S.label,"reset","\u2014","",`Reset ${N}; waiting for a fresh reading`));continue}let J=S.valueLabel??(U===null?"\u2014":`${Math.round(U)}%`),Q=S.sub??Ho(S.resetAt),z=N?`Resets ${N}`:S.label==="Cost"&&i.pricedAs?`Estimated from OpenCode's token counts, priced as ${i.pricedAs}`:"";b.append(Lt(S.label,Q,J,mr(U),z))}i.credits&&b.append(Lt("Credits","",i.credits)),i.note&&b.append(x("div","note",i.note));let H=i.retryAt?` \xB7 next try ${Ho(i.retryAt)}`:"",$="Anthropic limits how often an account\u2019s usage can be read, shared by every app that reads it (Claude Code, OpenChamber\u2019s Claude card, other devices). This does not affect using Claude.";if(i.stale&&i.updatedAt&&i.source!=="replies"){let S=Math.max(1,Math.round((Date.now()-i.updatedAt)/6e4)),U=S<90?`${S} min`:`${Math.round(S/60)} h`,N=x("div","note",`Updated ${U} ago${H}`);N.title=$,b.append(N)}if(i.waiting){let S=x("div","note",`Usage reads are rate-limited${H}`);S.title=$,b.append(S)}if(i.error){let S=x("div",`note ${i.windows?.length?"":"bad"}`.trim(),i.error);S.title=i.error,b.append(S)}_.append(b),X.append(_)}for(let i of $e.problems??[])X.append(x("div","note bad",i));if(Se&&X.append(x("div","note bad",Se)),!$o){let i=x("button","refresh","Refresh");i.type="button",i.addEventListener("click",()=>Ve(!0)),X.append(i)}X.getBoundingClientRect().height>480&&X.classList.add("compact"),wt()},wt=()=>{let e=Math.ceil(X.getBoundingClientRect().height);fe.setHeight(Math.max(24,e)).catch(()=>{})},Ve=(e=!1)=>{if(Te&&!e)return Te;let r=fe.serviceRequest({method:"GET",path:"/accounts",...e?{query:{force:"1"}}:{}}).then(s=>{let i=typeof s.body=="string"?JSON.parse(s.body||"{}"):s.body;if(s.status!==200)throw new Error(i?.error??`Service answered HTTP ${s.status}`);$e=i,Se=null}).catch(s=>{let i=s?.code;Se=i==="NO_SERVICE"||i==="DISABLED"?"Approve this extension\u2019s local service in Settings \u2192 Extensions.":`Could not read accounts: ${s?.message??s}`}).finally(()=>{Te===r&&(Te=null),Pt()});return Te=r,r};fe.onStatusControl(e=>{e.id==="refresh"&&Ve(!0)});fe.onReady(e=>{It(e,document.documentElement),Xo||(Xo=!0,e.features?.statusControls&&fe.setStatusControls([{kind:"button",id:"refresh",label:"Refresh"}]).then(()=>{$o=!0,Pt()}).catch(()=>{}),Ve(),Vo=setInterval(()=>Ve(),Or)),Pt()});new ResizeObserver(wt).observe(X);window.addEventListener("unload",()=>clearInterval(Vo));})();
