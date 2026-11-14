(()=>{var Fo=Object.defineProperty;var Bo=(e,r,s)=>r in e?Fo(e,r,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[r]=s;var Ie=(e,r,s)=>Bo(e,typeof r!="symbol"?r+"":r,s);var E="openchamber.sdk";var xe="data-oc-scrolling",ze=`
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
`;function zt(e){let r=e.documentElement;if(r.hasAttribute("data-oc-scrollbar-activity"))return;r.setAttribute("data-oc-scrollbar-activity","");let s=new WeakMap;e.addEventListener("scroll",i=>{let u=i.target===e?r:i.target;if(!(u instanceof Element))return;u.hasAttribute("data-oc-scrolling")||u.setAttribute("data-oc-scrolling","");let S=s.get(u);S!==void 0&&clearTimeout(S),s.set(u,setTimeout(()=>{s.delete(u),u.removeAttribute("data-oc-scrolling")},1e3))},{capture:!0,passive:!0})}var Ko=`(${zt.toString()})(document);`;var Qt=/^[a-z][a-z0-9-]{0,39}$/;var qt=e=>Object(e)===e&&!Array.isArray(e),qe=(e,r)=>Object.keys(e).every(s=>r.includes(s)),Yt=e=>String(e)===e&&e.length>=1&&e.length<=60,Jt=e=>String(e)===e&&e.length>=1&&e.length<=80,Zt=e=>{if(!Array.isArray(e)||e.length>4)return!1;let r=new Set;for(let s of e){if(!qt(s)||!Qt.test(s.id)||!Yt(s.label)||s.disabled!==void 0&&s.disabled!==!0&&s.disabled!==!1||r.has(s.id))return!1;if(r.add(s.id),s.kind==="button"){if(!qe(s,["kind","id","label","disabled"]))return!1;continue}if(s.kind!=="select"||!qe(s,["kind","id","label","value","options","disabled"])||!Jt(s.value)||!Array.isArray(s.options)||s.options.length<1||s.options.length>16)return!1;let i=new Set;for(let u of s.options){if(!qt(u)||!qe(u,["value","label"])||!Jt(u.value)||!Yt(u.label)||i.has(u.value))return!1;i.add(u.value)}if(!i.has(s.value))return!1}return!0};var jo=1024*1024;var eo=["{id}","{segment}","{segments+}"];var vr=new Set(eo);var to=["turn-finished","turn-failed","permission-asked","question-asked","turn-started","session-created","session-archived","session-deleted"];var Pr=new Set(to);var Ye=e=>"bytes"in e?e.bytes.byteLength:e.content.length,oo=(e,r)=>{if(e.path!==r.path||e.readOnly!==r.readOnly)return!1;if(e.encoding==="text"||r.encoding==="text")return e.encoding==="text"&&r.encoding==="text"&&e.content===r.content;if(e.bytes.byteLength!==r.bytes.byteLength)return!1;for(let s=0;s<e.bytes.byteLength;s+=1)if(e.bytes[s]!==r.bytes[s])return!1;return!0};var ro=/^[A-Za-z0-9_-]{1,80}$/;var no=["left","right","top","bottom"];var so=(e,r=0,s={remaining:16e3})=>{if(--s.remaining<0||r>=32)return!1;if(e===null)return!0;let i=Array.isArray(e)?e:Object(e)===e?Object.values(e):[];for(let u of i)if(!so(u,r+1,s))return!1;return!0},Je=e=>{if(e===null||e===!0||e===!1)return!0;if(Array.isArray(e))return Object.keys(e).every(r=>/^(0|[1-9]\d*)$/.test(r)&&Number(r)<e.length)&&e.every(Je);if(Object(e)===e){let r=Object.getPrototypeOf(e);return(r===null||r===Object.prototype)&&Object.values(e).every(Je)}return String(e)===e||Number.isFinite(e)},Qe=e=>{try{return String(e.id)!==e.id||!ro.test(e.id)||!Number.isFinite(e.anchor.x)||Math.abs(e.anchor.x)>1e5||!Number.isFinite(e.anchor.y)||Math.abs(e.anchor.y)>1e5||!Number.isFinite(e.anchor.width)||!Number.isFinite(e.anchor.height)||e.anchor.width<=0||e.anchor.height<=0||e.anchor.width>1e5||e.anchor.height>1e5||!Number.isInteger(e.width)||e.width<160||e.width>640||!Number.isInteger(e.height)||e.height<48||e.height>480||e.side!==void 0&&!no.includes(e.side)||e.focus!==void 0&&e.focus!==!0&&e.focus!==!1||!so(e.data)||!Je(e.data)?!1:JSON.stringify(e.data).length<=16e3}catch{return!1}};var et=2e3;var ao=["file","directory","other","missing"],tt=e=>!!(e&&"sessionId"in e),ot=e=>!!(e&&"sent"in e&&!("sessionId"in e));var co=/^[0-9a-f]{7,64}$/i,rt=e=>co.test(e),ge=500,be=32e3,lo=16e3,_o=128,po=200,uo=2e3,Eo=16e3,To=80,So=200,fo=16e3;var Ao=2e3;var nt=2e4,ke=1024,Ce=2e6;var Ue=64e3,Me=8e3,st=4e3;var it=96e4,zo=60*6e4;var Oo=999,Ro=1e4,le=500,ho=["HOST_UNAVAILABLE","HOST_TIMEOUT","HOST_REJECTED","DISCONNECTED","DISABLED","BAD_PATH","NO_INTEGRATION","NO_SERVICE","SERVICE_FAILED","REQUEST_FAILED","RESPONSE_TOO_LARGE","NO_SESSION","SESSION_BUSY","NOT_GRANTED","NO_DIRECTORY","NOT_FOUND","FILE_TOO_LARGE","DENIED","NO_MODEL","MODEL_FAILED","UNSUPPORTED"],mo=["stopped","starting","ready","failed"],qo=new Set(ho),Io=e=>qo.has(e),xo=e=>e&&Io(e)?e:"HOST_REJECTED",Z=e=>e===void 0?!1:e===null||e===!0||e===!1||String(e)===e?!0:Number(e)===e?Number.isFinite(e):Array.isArray(e)?e.every(Z):Object(e)===e?Object.values(e).every(Z):!1,go=e=>Z(e)&&JSON.stringify(e).length<=fo,io=e=>e?.trim().slice(0,So)??"",ee=e=>{let r=e.id.trim().slice(0,_o),s=e.title.trim().slice(0,po),i=e.url.trim().slice(0,uo),u=e.text?.trim().slice(0,Eo),S=e.author?.trim().slice(0,To),D=e.kind==="pull"?"pull":"issue",C={providerId:e.providerId.trim(),id:r,title:s||r,url:i,kind:D};if(u&&(C.text=u),S&&(C.author=S),D==="pull"){let b=io(e.branches?.head),U=io(e.branches?.base);b&&U&&(C.branches={head:b,base:U})}return go(e.data)&&(C.data=e.data),C},at=e=>{let r=ee(e);return e.projectId&&(r.projectId=e.projectId),e.navigation&&(r.navigation=e.navigation),e.worktree&&(r.worktree=e.worktree),r},ct=e=>{let r={text:e.text.trim().slice(0,lo)};return e.send&&(r.send=!0),r},dt=e=>e===null||!Number.isFinite(e)?null:Math.min(Oo,Math.max(0,Math.round(e))),lt=e=>Number.isFinite(e)?Math.min(Ro,Math.max(0,Math.ceil(e))):0;var te=e=>e.length>0&&e.length<=ke&&!e.includes("\0")&&!e.includes("\\");var ye=e=>!e.startsWith("/")||e.includes("\0")||e.includes("\\")||e.includes("://")||e.length>Ao?!1:!e.split("/").some(s=>s==="."||s===".."),Yo=new Set(mo),_t=e=>!!(e&&"status"in e&&Yo.has(String(e.status))&&!("body"in e)),Ne=e=>!!(e&&"status"in e&&"body"in e&&Number.isInteger(e.status)),pt=e=>!!(e&&"content"in e&&String(e.content)===e.content),ut=e=>!!(e&&"written"in e&&e.written===!0),Et=e=>!!(e&&"entries"in e&&Array.isArray(e.entries)),Jo=new Set(ao),Tt=e=>!!(e&&"kind"in e&&"size"in e&&Jo.has(String(e.kind))&&Number.isFinite(e.size)),St=e=>!!(e&&"text"in e&&String(e.text)===e.text&&!("status"in e)),Qo=new Set(["workspace","shells","ready","directory","session","connection","settings","session-lifecycle","item","resolve","action","service-event","status-control-event","popover-closed","file-open","file-snapshot","file-saved","generate-late"]),Zo=e=>Object(e)===e?e:null,Ze=e=>String(e)===e&&e.length>0,er=e=>{if(!Ze(e.id))return null;if(e.ok===!0){let r={channel:E,v:1,type:"result",id:e.id,ok:!0};return Object(e.payload)===e.payload&&(r.payload=e.payload),r}return e.ok===!1&&Ze(e.error)?{channel:E,v:1,type:"result",id:e.id,ok:!1,error:e.error,code:xo(Ze(e.code)?e.code:void 0)}:null},ft=e=>{let r=Zo(e);return!r||r.channel!==E||r.v!==1?null:r.type==="result"?er(r):!Qo.has(String(r.type))||Object(r.payload)!==r.payload?null:r};var bo=e=>"key"in e&&"metaKey"in e&&"ctrlKey"in e,tr=e=>(e.metaKey||e.ctrlKey)&&!e.altKey&&!e.shiftKey&&e.key.toLowerCase()==="s",l=class extends Error{constructor(s,i){super(i);Ie(this,"code");this.name="HostRequestError",this.code=s}},ko=()=>Promise.reject(new l("BAD_PATH",'Request path must start with "/" and stay on the declared origin.')),ve=()=>Promise.reject(new l("BAD_PATH",`File path must be 1 to ${ke} characters without NUL or backslash.`)),Le=e=>{if(e!==void 0){if(Object(e)!==e||Array.isArray(e)||e.scope!==void 0&&e.scope!=="instance"&&e.scope!=="device")throw new l("HOST_REJECTED",'Storage scope must be "instance" or "device".');return e.scope==="device"?"device":void 0}},p=e=>(e.value+=1,`oc-${e.value}`),mt=(e={})=>{let r=e.target??("window"in globalThis?window:null);if(!r)throw new l("HOST_UNAVAILABLE","No window. connectHost runs in a browser frame.");let s=e.acceptSource??(t=>t===r.parent),i=e.requestTimeoutMs??nt,u=new Set,S=new Set,D=new Set,C=new Set,b=new Set,U=new Set,K=new Set,W=new Set,Te=new Set,Se=new Set,fe=new Set,q=new Set,Fe=[],ne=null,se=null,Ae=new Set,Oe=new Set,ie=null,ae=null,Be=!1,Y=new Map,J=new Map,Q=new Map,X=!1,_={value:0},d=null,H=null,ce=!1,de=!1,wt=null,Dt=t=>t?{sessionId:t.id,phase:t.busy?"started":"completed"}:null,P=t=>{r.parent.postMessage(t,"*")},Gt=()=>{X||r.parent===r||q.size===0||d?.features?.lateGenerateResults!==!0||P({channel:E,v:1,type:"generate-late-listen"})},R=(t,o)=>{for(let a of t)try{a(o)}catch(c){console.error(c)}},Xt=t=>{if(!(t instanceof MessageEvent)||!s(t.source))return;let o=ft(t.data);if(!o)return;if(o.type==="workspace"){let c=J.get(o.payload.subscriptionId);c&&R([c],o.payload.snapshot);return}if(o.type==="shells"){let c=Q.get(o.payload.subscriptionId);c&&R([c],o.payload.snapshot);return}if(o.type==="ready"){d=o.payload,H=Dt(o.payload.session),R(u,o.payload),R(S,o.payload.directory),R(D,o.payload.session),H&&R(C,H),R(b,o.payload.connection),R(U,o.payload.settings),R(K,o.payload.item),o.payload.block&&R(W,o.payload.block),Gt();return}if(o.type==="service-event"){R(Te,o.payload);return}if(o.type==="generate-late"){q.size===0?Fe.push(o.payload):R(q,o.payload);return}if(o.type==="directory"){d&&(d={...d,directory:o.payload.directory}),R(S,o.payload.directory);return}if(o.type==="session"){d&&(d={...d,session:o.payload.session}),o.payload.session?H?.sessionId!==o.payload.session.id&&(H=Dt(o.payload.session)):H=null,R(D,o.payload.session);return}if(o.type==="session-lifecycle"){H=o.payload,R(C,o.payload);return}if(o.type==="connection"){d&&(d={...d,connection:o.payload.connection}),R(b,o.payload.connection);return}if(o.type==="settings"){d&&(d={...d,settings:o.payload.settings}),R(U,o.payload.settings);return}if(o.type==="item"){d&&(d={...d,item:o.payload.item}),R(K,o.payload.item);return}if(o.type==="status-control-event"){R(Se,o.payload);return}if(o.type==="popover-closed"){R(fe,o.payload);return}if(o.type==="action"){let c=f=>{X||P({channel:E,v:1,type:"action-result",id:o.id,payload:f})},A=se;if(!A){c({ok:!1,error:"This extension does not handle background actions."});return}Promise.resolve().then(()=>A(o.payload)).then(()=>c({ok:!0}),f=>{let g=(f instanceof Error?f.message:String(f)).trim();c({ok:!1,error:(g||"Action failed.").slice(0,le)})});return}if(o.type==="file-open"){let c=o.payload;if(ae&&oo(ae,c))return;ae=c,R(Ae,o.payload);return}if(o.type==="file-saved"){R(Oe,o.payload.version);return}if(o.type==="file-snapshot"){let c=g=>{X||P({channel:E,v:1,type:"file-snapshot-result",id:o.id,payload:g})},A=g=>c({error:(g.trim()||"Could not read the edited file.").slice(0,le)}),f=ie;if(!f){A("This extension does not edit files.");return}Promise.resolve().then(()=>f(o.payload.purpose)).then(g=>{if(Ye(g)>2e7){A(`The file is over ${2e7} ${"bytes"in g?"bytes":"characters"}.`);return}if(g.version.length>256){A(`The snapshot version is over ${256} characters.`);return}c({snapshot:"bytes"in g?{bytes:g.bytes,version:g.version}:{content:g.content,version:g.version}})},g=>A(g instanceof Error?g.message:String(g)));return}if(o.type==="resolve"){let c=f=>{P({channel:E,v:1,type:"resolve-result",id:o.id,payload:f})},A=ne;if(!A){c({error:"This extension does not resolve commands."});return}Promise.resolve().then(()=>A(o.payload)).then(f=>c({item:f?ee(f):null}),f=>{let g=(f instanceof Error?f.message:String(f)).trim();c({error:(g||"Command failed.").slice(0,le)})});return}let a=Y.get(o.id);if(a){if(clearTimeout(a.timer),Y.delete(o.id),o.ok){a.resolve(o.payload);return}a.reject(new l(o.code,o.error))}};r.addEventListener("message",Xt),P({channel:E,v:1,type:"hello"});let M=(t,o=i)=>X||r.parent===r?Promise.reject(new l("HOST_UNAVAILABLE","No host frame. This page is not in an iframe.")):new Promise((a,c)=>{let A=setTimeout(()=>{Y.delete(t.id),c(new l("HOST_TIMEOUT","Host did not answer in time."))},o);Y.set(t.id,{resolve:a,reject:c,timer:A}),P(t)}),I=t=>M(t).then(()=>{}),x={channel:E,v:1},Ke=t=>{!X&&r.parent!==r&&P(t)},Ht=()=>Ke({...x,type:"file-save"}),$t=t=>{!bo(t)||!tr(t)||(t.preventDefault(),Ht())},Vt=t=>{!bo(t)||t.key!=="Escape"||d?.surface!=="popover"||!d.popover||(t.preventDefault(),Wt(d.popover.id,"escape").catch(()=>{}))},Re=()=>{let t=d?.surface==="popover"?d.popover:void 0;if(!t)return;let o=ce||de;wt!==o&&(wt=o,jt(t.id,o).catch(()=>{}))},he=()=>{d?.surface!=="popover"||ce||(ce=!0,Re())},Ft=t=>{d?.surface!=="popover"||t.relatedTarget!==null||!ce||(ce=!1,Re())},Bt=()=>{d?.surface!=="popover"||de||(de=!0,Re())},Kt=()=>{d?.surface!=="popover"||!de||(de=!1,Re())},G=(t,o=1024)=>{if(!t.trim()||t.length>o)throw new l("HOST_REJECTED",`Identity must contain 1 to ${o} characters.`)},We=async t=>{t.kind!=="projects"&&G(t.projectId);let o=await M({...x,type:"workspace-read",id:p(_),payload:t});if(!o||!("kind"in o)||!("state"in o)||o.kind!==t.kind)throw new l("HOST_REJECTED","Host did not return workspace data.");return o},je=async(t,o)=>{t.kind!=="projects"&&G(t.projectId);let a=p(_);J.set(a,o);try{await I({...x,type:"workspace-subscribe",id:p(_),payload:{subscriptionId:a,query:t}})}catch(c){throw J.delete(a),X||P({...x,type:"workspace-unsubscribe",id:p(_),payload:{subscriptionId:a}}),c}return()=>{!J.delete(a)||X||P({...x,type:"workspace-unsubscribe",id:p(_),payload:{subscriptionId:a}})}},Vo=async(t,o)=>{t.kind==="session"&&G(t.sessionId),t.kind==="project"&&G(t.projectId);let a=p(_);Q.set(a,o);try{await I({...x,type:"shells-subscribe",id:p(_),payload:{subscriptionId:a,scope:t}})}catch(c){throw Q.delete(a),X||P({...x,type:"shells-unsubscribe",id:p(_),payload:{subscriptionId:a}}),c}return()=>{!Q.delete(a)||X||P({...x,type:"shells-unsubscribe",id:p(_),payload:{subscriptionId:a}})}},me=async t=>{if("key"in t&&(t.key.length===0||t.key.length>128))throw new l("HOST_REJECTED","Storage key must contain 1 to 128 characters.");if(t.op==="set"&&!Z(t.value))throw new l("HOST_REJECTED","Storage values must be JSON.");if(t.op==="set"&&new TextEncoder().encode(JSON.stringify(t.value)).length>65536)throw new l("HOST_REJECTED","Storage value exceeds 64 KiB.");if(t.scope==="device"&&d?.features?.deviceStorage!==!0)throw new l("UNSUPPORTED","This host does not support device storage.");let o=await M({...x,type:"storage",id:p(_),payload:t});if(!o||!("storage"in o)||o.op!==t.op)throw new l("HOST_REJECTED","Host did not return storage data.");return o},Wt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):I({...x,type:"popover-close",id:p(_),payload:o?{id:t,reason:o}:{id:t}}),jt=(t,o)=>d?.features?.popovers!==!0&&!(d?.surface==="popover"&&d.popover?.id===t)?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):I({...x,type:"popover-anchor",id:p(_),payload:{id:t,active:o}});return r.addEventListener("keydown",Vt,!0),r.addEventListener("pointerover",he),r.addEventListener("pointermove",he),r.addEventListener("pointerout",Ft),r.addEventListener("focus",Bt),r.addEventListener("blur",Kt),{onAction:t=>(se=t,()=>{se===t&&(se=null)}),listProjects:async()=>{let t=await We({kind:"projects"});if(t.kind!=="projects")throw new l("HOST_REJECTED","Expected projects.");return t},listWorktrees:async t=>{let o=await We({kind:"worktrees",projectId:t});if(o.kind!=="worktrees")throw new l("HOST_REJECTED","Expected worktrees.");return o},listSessions:async t=>{let o=await We({kind:"sessions",projectId:t});if(o.kind!=="sessions")throw new l("HOST_REJECTED","Expected sessions.");return o},onProjects:t=>je({kind:"projects"},o=>{o.kind==="projects"&&t(o)}),onWorktrees:(t,o)=>je({kind:"worktrees",projectId:t},a=>{a.kind==="worktrees"&&o(a)}),onSessions:(t,o)=>je({kind:"sessions",projectId:t},a=>{a.kind==="sessions"&&o(a)}),onRunningShells:(t,o)=>Vo(t,o),readShellOutput:async(t,o)=>{G(t,128);let a=o?.cursor;if(a!==void 0&&(!Number.isInteger(a)||a<0))throw new l("HOST_REJECTED","Shell output cursor must be a non-negative integer.");let c=o?.tailBytes;if(c!==void 0&&(!Number.isInteger(c)||c<1||c>65536))throw new l("HOST_REJECTED",`Shell output tailBytes must be an integer between 1 and ${65536}.`);let f=await M({...x,type:"shell-output",id:p(_),payload:{shellId:t,cursor:a,tailBytes:c}});if(!f||typeof f.output!="string"||!Number.isFinite(f.cursor))throw new l("HOST_REJECTED","Host did not return shell output.");return f},stopShell:async t=>{if(G(t,128),(await M({...x,type:"shell-stop",id:p(_),payload:{shellId:t}}))?.stopped!==!0)throw new l("HOST_REJECTED","Host did not stop the shell.");return{stopped:!0}},openSession:async t=>{G(t),await I({...x,type:"open-session",id:p(_),payload:{sessionId:t}})},storage:{get:async(t,o)=>{let a=Le(o),c={op:"get",key:t};a&&(c.scope=a);let A=await me(c);return A.op==="get"&&A.found?A.value:void 0},set:async(t,o,a)=>{let c=Le(a),A={op:"set",key:t,value:o};c&&(A.scope=c),await me(A)},delete:async(t,o)=>{let a=Le(o),c={op:"delete",key:t};a&&(c.scope=a),await me(c)},keys:async t=>{let o=Le(t),a={op:"keys"};o&&(a.scope=o);let c=await me(a);if(c.op!=="keys")throw new l("HOST_REJECTED","Expected storage keys.");return c.keys}},onReady:t=>(u.add(t),d&&t(d),()=>{u.delete(t)}),onDirectory:t=>(S.add(t),d&&t(d.directory),()=>{S.delete(t)}),onSession:t=>(D.add(t),d&&t(d.session),()=>{D.delete(t)}),onSessionLifecycle:t=>(C.add(t),H&&t(H),()=>{C.delete(t)}),onConnection:t=>(b.add(t),d&&t(d.connection),()=>{b.delete(t)}),onSettings:t=>(U.add(t),d&&t(d.settings),()=>{U.delete(t)}),onItem:t=>(K.add(t),d&&t(d.item),()=>{K.delete(t)}),onBlock:t=>(W.add(t),d?.block&&t(d.block),()=>{W.delete(t)}),onServiceEvent:t=>(Te.add(t),()=>{Te.delete(t)}),onStatusControl:t=>(Se.add(t),()=>{Se.delete(t)}),onPopoverClosed:t=>(fe.add(t),()=>{fe.delete(t)}),setStatusControls:t=>d?.features?.statusControls!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support status controls.")):Zt(t)?I({...x,type:"status-controls",id:p(_),payload:{controls:t}}):Promise.reject(new l("HOST_REJECTED","Status controls must have unique bounded ids and valid selected options.")),openPopover:t=>d?.features?.popovers!==!0?Promise.reject(new l("UNSUPPORTED","This host does not support popovers.")):Qe(t)?I({...x,type:"popover-open",id:p(_),payload:t}):Promise.reject(new l("HOST_REJECTED","Popover requests need bounded geometry and JSON data.")),closePopover:Wt,setPopoverAnchorActive:jt,onResolve:t=>(ne=t,()=>{ne===t&&(ne=null)}),toast:t=>{let o=t.message.trim();return!o||o.length>ge?Promise.reject(new l("HOST_REJECTED",`Toast message must contain 1 to ${ge} characters.`)):t.copy&&t.copy!==!0&&(!t.copy.text.length||t.copy.text.length>be)?Promise.reject(new l("HOST_REJECTED",`Toast copy text must contain 1 to ${be} characters.`)):I({channel:E,v:1,type:"toast",id:p(_),payload:{...t,message:o}})},openUrl:t=>I({channel:E,v:1,type:"open-url",id:p(_),payload:{url:t}}),openCommit:t=>rt(t)?I({channel:E,v:1,type:"open-commit",id:p(_),payload:{sha:t}}):Promise.reject(new l("HOST_REJECTED","Commit id must be 7 to 64 hex characters.")),answerBlock:t=>I({channel:E,v:1,type:"block-answer",id:p(_),payload:{text:t.trim().slice(0,et)}}),openSurface:t=>I({channel:E,v:1,type:"open-surface",id:p(_),payload:{surfaceId:t}}),writeClipboard:t=>I({channel:E,v:1,type:"clipboard-write",id:p(_),payload:{text:t}}),compose:t=>I({channel:E,v:1,type:"compose",id:p(_),payload:t}),attach:t=>I({channel:E,v:1,type:"attach",id:p(_),payload:ee(t)}),startSession:async t=>{t.projectId!==void 0&&G(t.projectId);let o=t.worktree;o&&o!==!0&&(o.kind==="existing"?G(o.directory):(o.name!==void 0&&G(o.name,200),o.baseBranch!==void 0&&G(o.baseBranch,200)));let a=await M({channel:E,v:1,type:"start-session",id:p(_),payload:at(t)},e.requestTimeoutMs??18e4);if(!tt(a))throw new l("HOST_REJECTED","Host did not return a session.");return a},prompt:t=>M({channel:E,v:1,type:"prompt",id:p(_),payload:ct(t)}).then(o=>{if(!ot(o))throw new l("HOST_REJECTED","Host did not return a prompt result.");return o}),sessionLink:t=>I({channel:E,v:1,type:"session-link",id:p(_),payload:ee(t)}),close:()=>I({channel:E,v:1,type:"close",id:p(_)}),oauthStart:()=>I({channel:E,v:1,type:"oauth-start",id:p(_)}),oauthDisconnect:()=>I({channel:E,v:1,type:"oauth-disconnect",id:p(_)}),request:t=>(ye(t.path)?M({channel:E,v:1,type:"request",id:p(_),payload:t}):ko()).then(o=>{if(!Ne(o))throw new l("HOST_REJECTED","Host request result was empty.");return o}),serviceRequest:t=>(ye(t.path)?M({channel:E,v:1,type:"service-request",id:p(_),payload:t}):ko()).then(o=>{if(!Ne(o))throw new l("HOST_REJECTED","Host service request result was empty.");return o}),serviceStatus:()=>M({channel:E,v:1,type:"service-status",id:p(_)}).then(t=>{if(!_t(t))throw new l("HOST_REJECTED","Host did not return service status.");return t}),readFile:t=>(te(t)?M({channel:E,v:1,type:"file-read",id:p(_),payload:{path:t}}):ve()).then(o=>{if(!pt(o))throw new l("HOST_REJECTED","Host did not return file content.");return o}),writeFile:(t,o)=>te(t)?o.length>Ce?Promise.reject(new l("FILE_TOO_LARGE",`Content is over ${Ce} characters.`)):M({channel:E,v:1,type:"file-write",id:p(_),payload:{path:t,content:o}}).then(a=>{if(!ut(a))throw new l("HOST_REJECTED","Host did not confirm the write.");return a}):ve(),listDir:t=>(te(t)?M({channel:E,v:1,type:"file-list",id:p(_),payload:{path:t}}):ve()).then(o=>{if(!Et(o))throw new l("HOST_REJECTED","Host did not return directory entries.");return o}),stat:t=>(te(t)?M({channel:E,v:1,type:"file-stat",id:p(_),payload:{path:t}}):ve()).then(o=>{if(!Tt(o))throw new l("HOST_REJECTED","Host did not return file status.");return o}),generate:t=>{let o=t.prompt.trim(),a=t.system?.trim();if(o.length===0||o.length>Ue)return Promise.reject(new l("HOST_REJECTED",`Prompt must be 1 to ${Ue} characters.`));if(a!==void 0&&(a.length===0||a.length>Me))return Promise.reject(new l("HOST_REJECTED",`System prompt must be 1 to ${Me} characters.`));let c=t.maxOutputTokens===void 0?void 0:Math.min(st,Math.max(1,Math.floor(t.maxOutputTokens)));if(c!==void 0&&!Number.isFinite(c))return Promise.reject(new l("HOST_REJECTED","maxOutputTokens must be a number."));let A={prompt:o};return a!==void 0&&(A.system=a),c!==void 0&&(A.maxOutputTokens=c),M({channel:E,v:1,type:"generate",id:p(_),payload:A},e.requestTimeoutMs??it).then(f=>{if(!St(f))throw new l("HOST_REJECTED","Host did not return generated text.");return f})},onLateGenerateResult:t=>{q.add(t);for(let o of Fe.splice(0))R([t],o);return Gt(),()=>{q.delete(t)}},setBadge:t=>I({channel:E,v:1,type:"badge",id:p(_),payload:{count:dt(t)}}),setHeight:t=>I({channel:E,v:1,type:"resize",id:p(_),payload:{height:lt(t)}}),onFileOpen:t=>(Ae.add(t),Be||(Be=!0,r.addEventListener("keydown",$t,!0)),ae&&t(ae),()=>{Ae.delete(t)}),onFileSnapshot:t=>(ie=t,()=>{ie===t&&(ie=null)}),onFileSaved:t=>(Oe.add(t),()=>{Oe.delete(t)}),reportFileChange:t=>Ke({...x,type:"file-change",payload:{dirty:t.dirty,edited:t.edited}}),requestFileSave:Ht,reportFileUnsupported:()=>Ke({...x,type:"file-unsupported"}),dispose:()=>{for(let t of J.keys())P({...x,type:"workspace-unsubscribe",id:p(_),payload:{subscriptionId:t}});J.clear();for(let t of Q.keys())P({...x,type:"shells-unsubscribe",id:p(_),payload:{subscriptionId:t}});Q.clear(),X=!0,ne=null,se=null,ie=null,Ae.clear(),Oe.clear(),Be&&r.removeEventListener("keydown",$t,!0),r.removeEventListener("message",Xt),r.removeEventListener("keydown",Vt,!0),r.removeEventListener("pointerover",he),r.removeEventListener("pointermove",he),r.removeEventListener("pointerout",Ft),r.removeEventListener("focus",Bt),r.removeEventListener("blur",Kt);for(let t of Y.values())clearTimeout(t.timer),t.reject(new l("HOST_UNAVAILABLE","Host client was disposed."));Y.clear(),u.clear(),S.clear(),D.clear(),C.clear(),b.clear(),U.clear(),K.clear(),W.clear(),Te.clear(),Se.clear(),fe.clear(),q.clear(),Fe.length=0}}};var Mo=["browser.open","browser.snapshot","browser.click","browser.type","browser.select","browser.scroll","browser.back","browser.forward","browser.inspect","browser.capture","browser.resize","browser.close"];var Zr=new Set(Mo);var or=10*6e4;var rr=10*6e4;var nr=10*6e4;var sr=10*6e4;var yo=["none","agent","user"];var on=new Set(yo);var ir=[["--oc-bg","background"],["--oc-elevated","elevated"],["--oc-fg","foreground"],["--oc-muted","muted"],["--oc-subtle","subtle"],["--oc-border","border"],["--oc-hover","hover"],["--oc-selection","selection"],["--oc-focus","focus"],["--oc-primary","primary"],["--oc-muted-surface","mutedSurface"],["--oc-elevated-fg","elevatedForeground"],["--oc-active","active"],["--oc-selection-fg","selectionForeground"],["--oc-primary-fg","primaryForeground"],["--oc-primary-text","primaryText"],["--oc-success-text","successText"],["--oc-warning-text","warningText"],["--oc-error-text","errorText"],["--oc-info-text","infoText"],["--oc-success","success"],["--oc-warning","warning"],["--oc-error","error"],["--oc-info","info"],["--oc-font","font"],["--oc-mono","mono"],["--oc-radius","radius"],["--surface-background","background"],["--surface-elevated","elevated"],["--surface-foreground","foreground"],["--surface-muted-foreground","muted"],["--surface-subtle","subtle"],["--interactive-border","border"],["--interactive-hover","hover"],["--interactive-selection","selection"],["--interactive-focus-ring","focus"],["--primary","primary"],["--surface-muted","mutedSurface"],["--surface-elevated-foreground","elevatedForeground"],["--interactive-active","active"],["--interactive-selection-foreground","selectionForeground"],["--primary-foreground","primaryForeground"],["--primary-text","primaryText"],["--success-text","successText"],["--warning-text","warningText"],["--error-text","errorText"],["--info-text","infoText"],["--status-success","success"],["--status-warning","warning"],["--status-error","error"],["--status-info","info"],["--font-sans","font"],["--font-mono","mono"],["--radius","radius"]],ar=[["--oc-syntax-keyword","--syntax-keyword","syntaxKeyword"],["--oc-syntax-string","--syntax-string","syntaxString"],["--oc-syntax-number","--syntax-number","syntaxNumber"],["--oc-syntax-function","--syntax-function","syntaxFunction"],["--oc-syntax-type","--syntax-type","syntaxType"],["--oc-syntax-comment","--syntax-comment","syntaxComment"],["--oc-syntax-variable","--syntax-variable","syntaxVariable"],["--oc-syntax-operator","--syntax-operator","syntaxOperator"]],No=(e,r)=>{r.style.colorScheme=e.mode;for(let[s,i]of ir)r.style.setProperty(s,e.tokens[i]);for(let[s,i,u]of ar){let S=e.tokens[u]??"";r.style.setProperty(s,S),r.style.setProperty(i,S)}r.style.setProperty("font-family",e.tokens.font),r.style.setProperty("font-size",e.tokens.fontSize??"0.875rem"),r.style.setProperty("line-height","1.45"),r.style.setProperty("color",e.tokens.foreground)},It=(e,r)=>{No(e.theme,r),r.dataset&&(r.dataset.ocSurface=e.surface,r.dataset.ocTheme=e.theme.mode)};var cr={"surface-background":"bg","surface-elevated":"elevated","surface-elevated-foreground":"elevated-fg","surface-foreground":"fg","surface-muted-foreground":"muted","surface-muted":"muted-surface","surface-subtle":"subtle","interactive-border":"border","interactive-hover":"hover","interactive-active":"active","interactive-selection":"selection","interactive-selection-foreground":"selection-fg","interactive-focus-ring":"focus",primary:"primary","primary-foreground":"primary-fg","primary-text":"primary-text","success-text":"success-text","warning-text":"warning-text","error-text":"error-text","info-text":"info-text","status-success":"success","status-warning":"warning","status-error":"error","status-info":"info","font-sans":"font","font-mono":"mono",radius:"radius"},O=(e,r)=>`var(--${e}, var(--oc-${cr[e]}, ${r}))`,V=O("surface-background","transparent"),we=O("surface-elevated","transparent"),oe=O("surface-elevated-foreground","inherit"),w=O("surface-foreground","inherit"),h=O("surface-muted-foreground","gray"),dr=O("surface-muted","transparent"),j=O("interactive-border","currentColor"),N=O("interactive-hover","transparent"),z=O("interactive-active","transparent"),xt=O("interactive-selection","transparent"),gt=O("interactive-selection-foreground","inherit"),$=O("primary","currentColor"),bt=O("primary-text","inherit"),kt=O("error-text","inherit"),lr=O("font-sans","inherit"),Ct=O("font-mono","monospace"),wo=O("radius","9px"),Ut=`calc(${wo} - 2px)`,vo=`calc(${wo} - 4px)`,m=(e,r,s="transparent")=>`color-mix(in srgb, ${e} ${r}%, ${s})`,Lo=`background-image: linear-gradient(${N}, ${N});`,Mt=(e,r="0.5px")=>`box-shadow: inset 0 0 0 ${r} ${e}, var(--oc-sdk-field-lift);`,yt="border-color: var(--oc-sdk-edge); box-shadow: var(--oc-sdk-raised-lift);",Po="box-shadow: var(--oc-sdk-lit);",Nt=`inset 0 0.5px 0 0 ${m(w,8)}, 0 1px 2px 0 rgb(0 0 0 / 0.4)`,_r=`
:root {
  --oc-sdk-edge: ${m(w,16)};
  --oc-sdk-field-bg: ${we};
  --oc-sdk-raised-bg: ${V};
  --oc-sdk-field-lift: inset 0 1px 2px 0 rgb(0 0 0 / 0.04);
  --oc-sdk-raised-lift: 0 1px 1.5px 0 rgb(0 0 0 / 0.08);
  --oc-sdk-lit: inset 0 1px 0 0 rgb(255 255 255 / 0.2), 0 1px 1.5px 0 rgb(0 0 0 / 0.1);
  --oc-sdk-float-edge: rgb(0 0 0 / 0.14);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.7), 0 1px 2px -0.5px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.08), 0 12px 20px -4px rgb(0 0 0 / 0.06);
}
:root[data-oc-theme="dark"] {
  --oc-sdk-edge: ${m(w,14)};
  --oc-sdk-field-bg: ${m(V,50,we)};
  --oc-sdk-raised-bg: ${we};
  --oc-sdk-field-lift: ${Nt};
  --oc-sdk-raised-lift: ${Nt};
  --oc-sdk-lit: ${Nt};
  --oc-sdk-float-edge: rgb(0 0 0 / 0.55);
  --oc-sdk-float: inset 0 1px 0 0 rgb(255 255 255 / 0.04), inset 0 0 0 0.5px rgb(255 255 255 / 0.08), 0 8px 16px 0 rgb(0 0 0 / 0.25), 0 4px 8px 0 rgb(0 0 0 / 0.25);
}`,Pe=e=>{let r=O(`status-${e}`,"currentColor");return`
.oc-sdk[data-tone="${e}"], .oc-sdk [data-tone="${e}"] { --oc-sdk-tone: ${r}; --oc-sdk-tone-text: ${O(`${e}-text`,"inherit")}; }`},n=e=>`calc(${e}rem / 14)`,pr=`
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
`,Do=`${_r}
.oc-sdk { color: ${w}; font-family: ${lr}; }
.oc-sdk :focus-visible, .oc-sdk:focus-visible { outline: none; }
.oc-sdk :where(button, a[href], [role="button"], [role="tab"], [role="option"]):focus-visible, button.oc-sdk:focus-visible { ${Lo} }
.oc-sdk-mono { font-family: ${Ct}; }
.oc-sdk-muted { color: ${h}; }
${Pe("success")}${Pe("warning")}${Pe("error")}${Pe("info")}
.oc-sdk[data-tone="primary"], .oc-sdk [data-tone="primary"] { --oc-sdk-tone: ${$}; --oc-sdk-tone-text: ${bt}; }

.oc-sdk-btn { border-radius: ${Ut}; transition: background 150ms ease-out, color 150ms ease-out; }
.oc-sdk-btn[data-size="xs"] { border-radius: ${vo}; }
.oc-sdk-btn[data-variant="default"] { color: ${bt}; background: ${m($,10,V)}; border-color: ${m($,12)}; ${Po} }
.oc-sdk-btn[data-variant="default"]:hover { background: ${m($,16,V)}; }
.oc-sdk-btn[data-variant="default"]:active { background: ${m($,22,V)}; box-shadow: none; }
.oc-sdk-btn[data-variant="secondary"] { background: ${dr}; color: var(--oc-fg); }
.oc-sdk-btn[data-variant="secondary"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="secondary"]:active { background-image: linear-gradient(${z}, ${z}); }
.oc-sdk-btn[data-variant="outline"] { background: var(--oc-sdk-raised-bg); color: ${oe}; ${yt} }
.oc-sdk-btn[data-variant="outline"]:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-btn[data-variant="outline"]:active { background-image: linear-gradient(${z}, ${z}); box-shadow: none; }
.oc-sdk-btn[data-variant="ghost"] { background: transparent; }
.oc-sdk-btn[data-variant="ghost"]:hover { background: ${N}; }
.oc-sdk-btn[data-variant="ghost"]:active { background: ${z}; }
.oc-sdk-btn[data-variant="destructive"] { --oc-sdk-tone: ${O("status-error","red")}; color: ${kt}; background: ${m("var(--oc-sdk-tone)",7,V)}; border-color: ${m("var(--oc-sdk-tone)",12)}; ${Po} }
.oc-sdk-btn[data-variant="destructive"]:hover { background: ${m("var(--oc-sdk-tone)",9,V)}; }
.oc-sdk-btn[data-variant="destructive"]:active { background: ${m("var(--oc-sdk-tone)",11,V)}; box-shadow: none; }

.oc-sdk-field-note { color: ${h}; }
.oc-sdk-field[data-invalid="true"] .oc-sdk-field-note { color: ${kt}; }
.oc-sdk-input { border-radius: ${Ut}; background: var(--oc-sdk-field-bg); color: ${oe}; ${Mt("var(--oc-sdk-edge)")} transition: background 150ms ease-out; }
.oc-sdk-input::placeholder { color: ${h}; }
.oc-sdk-input:hover:not(:focus) { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-input:focus, .oc-sdk-input:focus-visible { ${Mt(m(w,26),"1px")} }
.oc-sdk-field[data-invalid="true"] .oc-sdk-input, .oc-sdk-field[data-invalid="true"] .oc-sdk-input:focus { ${Mt(O("status-error","red"),"1px")} }
.oc-sdk-input[data-mono="true"] { font-family: ${Ct}; }

.oc-sdk-search-icon { color: ${h}; }
.oc-sdk-search[data-active="true"] .oc-sdk-search-icon { color: ${$}; }
.oc-sdk-search-clear { border-radius: ${vo}; color: ${h}; }
.oc-sdk-search-clear:hover { background: ${N}; color: ${w}; }

.oc-sdk-trigger { border-radius: ${Ut}; background: var(--oc-sdk-raised-bg); color: ${oe}; ${yt} transition: background 150ms ease-out; }
.oc-sdk-trigger:hover { background-image: linear-gradient(${N}, ${N}); }
.oc-sdk-trigger[aria-expanded="true"] { background-image: linear-gradient(${z}, ${z}); }
.oc-sdk-trigger-value[data-empty="true"] { color: ${h}; }
.oc-sdk-trigger-chevron { color: ${h}; }
/* The app's floating level: the glass edge (a hairline ring and a lit top line, dark outside and light inside in dark themes) over soft shadows. The outer ring is the border, over the page like the app's. */
.oc-sdk-popup { --surface-foreground: ${oe}; border-color: var(--oc-sdk-float-edge); border-radius: 12px; background: ${we}; background-clip: padding-box; color: ${oe}; box-shadow: var(--oc-sdk-float); }
.oc-sdk-option { border-radius: 8px; }
.oc-sdk-option[data-active="true"] { background: ${N}; }
/* A selected option shows a check mark in the text colour, like the app's own pickers. Options without the mark come
   from bundles built before it existed and keep the selection fill as their only sign of the choice. */
.oc-sdk-option[aria-selected="true"]:not([data-mark]) { background: ${xt}; color: ${gt}; }
.oc-sdk-option-check { color: ${w}; }
.oc-sdk-option[data-destructive="true"] { color: ${kt}; }
.oc-sdk-option[data-destructive="true"][data-active="true"] { background: ${m(O("status-error","red"),10)}; }
.oc-sdk-option-hint { color: ${h}; }
.oc-sdk-popup-empty { color: ${h}; }

/* Checked stays neutral: the mark carries the state, and the primary colour stays with primary actions. */
.oc-sdk-check-box { border-color: ${j}; border-radius: 4px; color: ${w}; transition: border-color 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-box { border-color: ${m(w,60,j)}; }
.oc-sdk-check-thumb { border-radius: 9999px; background: ${j}; transition: background 150ms ease-out; }
.oc-sdk-check-thumb::after { border-radius: 9999px; background: ${V}; transition: transform 150ms ease-out; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb { background: ${$}; }
.oc-sdk-check[aria-checked="true"] .oc-sdk-check-thumb::after { transform: translateX(var(--oc-sdk-thumb-travel, 16px)); }
.oc-sdk-check:focus-visible { box-shadow: none; }
.oc-sdk-check:focus-visible .oc-sdk-check-box, .oc-sdk-check:focus-visible .oc-sdk-check-thumb { ${Lo} }
.oc-sdk-check-desc { color: ${h}; }

.oc-sdk-tabs { border-radius: 10px; }
.oc-sdk-tabs[data-track="true"] { background: ${m(w,4)}; box-shadow: inset 0 1px 2px 0 rgb(0 0 0 / 0.16); }
.oc-sdk-tab { border-radius: 8px; color: ${h}; transition: color 150ms ease-out, background 150ms ease-out; }
.oc-sdk-tab:hover { color: ${w}; }
.oc-sdk-tab[aria-selected="true"] { color: ${gt}; background: ${xt}; border-color: ${j}; }
.oc-sdk-tabs[data-track="true"] .oc-sdk-tab[aria-selected="true"] { color: ${oe}; background: var(--oc-sdk-raised-bg); ${yt} }
.oc-sdk-tab-count { color: ${h}; }

/* The app's neutral badge: a step of the text colour, the same in every theme. */
.oc-sdk-badge { border-radius: 9999px; background: ${m(w,6)}; color: ${h}; }
.oc-sdk-badge[data-tone] { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); background: ${m("var(--oc-sdk-tone)",15)}; }

.oc-sdk-row { border-radius: 6px; transition: background 120ms ease-out; }
.oc-sdk-row:hover, .oc-sdk-row[data-active="true"] { background: ${N}; }
.oc-sdk-row[aria-selected="true"] { background: ${xt}; color: ${gt}; }
.oc-sdk-row-lead { font-family: ${Ct}; color: ${h}; }
.oc-sdk-row-sub { color: ${h}; }
.oc-sdk-row-meta { color: ${h}; }
.oc-sdk-row[aria-selected="true"] .oc-sdk-row-lead, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-sub, .oc-sdk-row[aria-selected="true"] .oc-sdk-row-meta { color: inherit; opacity: .75; }
.oc-sdk-list-empty { color: ${h}; }

.oc-sdk-empty-body { color: ${h}; }

.oc-sdk-spinner { color: ${h}; }
.oc-sdk-spinner-ring { border-color: ${j}; border-top-color: ${$}; border-radius: 9999px; }

/* Set apart by its tint alone, like the app's banners. */
.oc-sdk-banner { border-color: transparent; border-radius: 8px; background: ${m("var(--oc-sdk-tone)",10)}; }
.oc-sdk-banner-title { color: var(--oc-sdk-tone-text, var(--oc-sdk-tone)); }
.oc-sdk-banner-body { color: ${h}; }

.oc-sdk-separator { color: ${h}; }
.oc-sdk-separator::before, .oc-sdk-separator::after { background: ${m(j,40)}; }

.oc-sdk-progress-label { color: ${h}; }
/* The app's progress: a groove a step of the text colour, green once done. Older bundles mark done only through aria-valuenow. */
.oc-sdk-progress-track { border-radius: 9999px; background: ${m(w,6)}; }
.oc-sdk-progress-fill { border-radius: 9999px; background: var(--oc-sdk-tone, ${$}); }
.oc-sdk-progress-track[aria-valuenow="100"] > .oc-sdk-progress-fill:not([data-tone]) { background: ${O("status-success","currentColor")}; }
.oc-sdk-progress[data-done="true"] .oc-sdk-progress-value { color: ${O("success-text","inherit")}; }

.oc-sdk-text a { color: ${bt}; text-decoration: underline; text-underline-offset: 2px; }
.oc-sdk-text img { border-radius: 8px; border: 1px solid ${m(j,60)}; }
`,y=`
${ze}
${pr}
${Do}`;var fr=6e4,Ee=mt(),B=document.getElementById("root"),Go=!1,Ho=!1,$o=null,pe=null,$e=null,ue=null,Ar={codex:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M4 6l6 6-6 6M12 18h8"/></svg>',claude:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/></svg>'},Or={codex:"Codex",claude:"Claude"},k=(e,r,s)=>{let i=document.createElement(e);return r&&(i.className=r),s!==void 0&&(i.textContent=s),i},Rr=e=>e.includes("@")?e.split("@")[0]:e,hr=e=>{if(!e)return"";let r=new Date(e);if(Number.isNaN(r.getTime()))return"";let s=r.toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"});return e-Date.now()<24*3600*1e3?s:`${r.toLocaleDateString(void 0,{weekday:"short"})} ${s}`},mr=e=>e==null?"":e>=90?"hot":e>=70?"warm":"",Xo=(e,r,s,i,u)=>{let S=k("div","row");return S.append(k("span","lab",e)),r&&S.append(k("span","sub",r)),S.append(k("span",`val ${i||""}`.trim(),s)),u&&(S.title=u),S},Lt=()=>{if(B.replaceChildren(),!$e){B.append(k("div","empty",ue??"Loading accounts\u2026")),Pt();return}let e=$e.accounts??[];e.length===0&&B.append(k("div","empty","No Codex or Claude accounts found."));let r=["claude","codex"],s=[...e].sort((i,u)=>r.indexOf(i.provider)-r.indexOf(u.provider)||Number(u.active)-Number(i.active));for(let i of s){let u=k("section","acct"),S=k("div","head");S.title=i.label;let D=k("span","ic");D.innerHTML=Ar[i.provider]??"",S.append(D,k("span","name",Or[i.provider]??i.provider)),S.append(k("span","who",`\xB7 ${Rr(i.label)}`)),i.active&&S.append(k("span","badge","active")),u.append(S);let C=k("div","body");for(let b of i.windows??[]){let U=b.usedPercent,K=U===null?"\u2014":`${Math.round(U)}%`,W=b.resetAt?new Date(b.resetAt).toLocaleString():"";C.append(Xo(b.label,hr(b.resetAt),K,mr(U),W&&`Resets ${W}`))}if(i.credits&&C.append(Xo("Credits","",i.credits)),i.stale&&i.updatedAt){let b=Math.max(1,Math.round((Date.now()-i.updatedAt)/6e4)),U=k("div","note",`Updated ${b} min ago`);U.title="Anthropic is rate-limiting usage reads; showing the last reading. This does not affect using Claude.",C.append(U)}if(i.error){let b=k("div",`note ${i.windows?.length?"":"bad"}`.trim(),i.error);b.title=i.error,C.append(b)}u.append(C),B.append(u)}for(let i of $e.problems??[])B.append(k("div","note bad",i));if(ue&&B.append(k("div","note bad",ue)),!Ho){let i=k("button","refresh","Refresh");i.type="button",i.addEventListener("click",()=>Ve(!0)),B.append(i)}Pt()},Pt=()=>{let e=Math.ceil(B.getBoundingClientRect().height);Ee.setHeight(Math.max(24,e)).catch(()=>{})},Ve=(e=!1)=>{if(pe&&!e)return pe;let r=Ee.serviceRequest({method:"GET",path:"/accounts",...e?{query:{force:"1"}}:{}}).then(s=>{let i=typeof s.body=="string"?JSON.parse(s.body||"{}"):s.body;if(s.status!==200)throw new Error(i?.error??`Service answered HTTP ${s.status}`);$e=i,ue=null}).catch(s=>{let i=s?.code;ue=i==="NO_SERVICE"||i==="DISABLED"?"Approve this extension\u2019s local service in Settings \u2192 Extensions.":`Could not read accounts: ${s?.message??s}`}).finally(()=>{pe===r&&(pe=null),Lt()});return pe=r,r};Ee.onStatusControl(e=>{e.id==="refresh"&&Ve(!0)});Ee.onReady(e=>{It(e,document.documentElement),Go||(Go=!0,e.features?.statusControls&&Ee.setStatusControls([{kind:"button",id:"refresh",label:"Refresh"}]).then(()=>{Ho=!0,Lt()}).catch(()=>{}),Ve(),$o=setInterval(()=>Ve(),fr)),Lt()});new ResizeObserver(Pt).observe(B);window.addEventListener("unload",()=>clearInterval($o));})();
