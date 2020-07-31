(this["webpackJsonpairtime-calculator"]=this["webpackJsonpairtime-calculator"]||[]).push([[0],{109:function(e,t,a){},193:function(e,t,a){},195:function(e,t,a){},197:function(e,t,a){},198:function(e,t,a){},200:function(e,t,a){},201:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(16),c=a.n(r),o=a(48),i=a.n(o),s=a(70),u=a(7),m=a(71),d=a.n(m),f=a(10),p=a(83),E=a(17),h=a(72),v=a.n(h),g=a(81),b=a(6),y=(a(109),a(21)),w=a(80),R=a(49),z=a.n(R),j=a(76),S=a(77),x=a(11),k=a(207),C=[{name:"LinkCheckReq",size:0},{name:"LinkAdrAns",size:1},{name:"DutyCycleAns",size:0},{name:"RXParamSetupAns",size:1},{name:"DevStatusAns",size:2},{name:"NewChannelAns",size:1},{name:"DlChannelAns",size:1},{name:"RXTimingSetupAns",size:0},{name:"TxParamSetupAns",size:0}],O=[{name:"LinkCheckAns",size:2},{name:"LinkAdrReq",size:4},{name:"DutyCycleReq",size:1},{name:"RXParamSetupReq",size:4},{name:"DevStatusReq",size:0},{name:"NewChannelReq",size:5},{name:"DlChannelReq",size:4},{name:"RXTimingSetupReq",size:1},{name:"TxParamSetupReq",size:1}],N=a(84),A=a(74),D=a(73);a(193);function T(e){var t=e.content,a=e.showIcon,r=void 0!==a&&a,c=e.placement,o=void 0===c?"auto-end":c,i=e.children,s=Object(n.useState)((function(){return Object(D.uniqueId)("HelpTooltip-")})),m=Object(u.a)(s,1)[0];return t?l.a.createElement(N.a,{placement:o,overlay:l.a.createElement(A.a,{id:m},t)},l.a.createElement("div",null,i,r&&l.a.createElement("sup",null,l.a.createElement("small",{className:"text-muted"},"\u24d8")))):l.a.createElement(l.a.Fragment,null,i)}function F(e){return{value:""+e.value,onChange:function(t){var a=t.currentTarget;e.setValue("number"===typeof e.value?+a.value:a.value)}}}var L=a(34),M=a(36);a(195);function I(e){var t=e.min,a=void 0===t?0:t,r=e.value,c=e.setValue;return Object(n.useEffect)((function(){c(r)}),[r,c]),l.a.createElement(M.a,null,l.a.createElement(M.a.Prepend,null,l.a.createElement(y.a,{onClick:function(){r>a&&c(r-1)},variant:"outline-secondary","aria-label":"Decrease"},"-")),l.a.createElement(L.a,Object.assign({},F({value:r,setValue:c}),{type:"number",className:"NumberInput",min:a,placeholder:"Enter number"})),l.a.createElement(M.a.Append,null,l.a.createElement(y.a,{onClick:function(){c((function(e){return e+1}))},variant:"outline-secondary","aria-label":"Increase"},"+")))}var P=a(85),q=a(52),W=a(75),B={payloadSize:12,headerSize:13,codingRate:"4/5"};function _(e){function t(e){var t=Object(n.useState)(e),a=Object(u.a)(t,2);return{value:a[0],setValue:a[1]}}var a=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",a={},n=t.split(",").map((function(e){return e.trim()})),l=Object(W.a)(n);try{var r=function(){var t=e.value;if(""===t)return"continue";if(/^\d+$/.test(t))return a.payloadSize?a.headerSize?console.warn("Ignored numeric value ".concat(t,"; already parsed both payloadSize and headerSize")):a.headerSize=+t:a.payloadSize=+t,"continue";if(/^cr4[5678]$/i.test(t))return a.codingRate?console.warn("Ignored string value ".concat(t,"; already parsed codingRate")):a.codingRate=t.substr(2).split("").join("/"),"continue";var n=t.toLowerCase(),l=C.concat(O).find((function(e){return e.name.toLowerCase()===n}));l?a.macCommands=(a.macCommands||[]).concat(l):console.warn("Ignored string value ".concat(t,"; no matching MAC command found"))};for(l.s();!(e=l.n()).done;)r()}catch(c){l.e(c)}finally{l.f()}return Object(q.a)(Object(q.a)({},B),a)}(e.userConfig),r=t(a.payloadSize),c=t(a.headerSize),o=t(a.codingRate),i=t(a.macCommands);function s(e){var t;i.setValue((i.value||[]).concat(e)),t=e.size+1,c.setValue((function(e){return e+t}))}Object(n.useEffect)((function(){e.setPacketSize(c.value+r.value)}),[e,c.value,r.value]),Object(n.useEffect)((function(){e.setCodingRate(o.value)}),[e,o.value]),Object(n.useEffect)((function(){e.setUserConfig(function(e,t,a,n){var l=[];return e===B.payloadSize&&t===B.headerSize||l.push(e),t!==B.headerSize&&l.push(t),a&&a!==B.codingRate&&l.push("cr"+a.replace("/","")),n&&l.push.apply(l,Object(P.a)(n.map((function(e){return e.name})))),l.join(",")}(r.value,c.value,o.value,i.value))}),[e,c.value,r.value,o.value,i.value]);var m=C.map((function(e,t){return l.a.createElement("div",{key:t},l.a.createElement(j.a,{onClick:function(){return s(e)},pill:!0,variant:a.macCommands&&a.macCommands.includes(e)?"primary":"secondary"},e.name," ",e.size),"\xa0")}));return l.a.createElement(l.a.Fragment,null,l.a.createElement(x.a,null,l.a.createElement(x.a.Row,{className:"justify-content-center"},l.a.createElement(x.a.Group,{as:f.a,xs:4,sm:3,lg:2,controlId:"formHeaderSize"},l.a.createElement(x.a.Label,null,l.a.createElement(T,{showIcon:!0,content:"For an uplink and downlink, the overhead is at least 13 bytes: MHDR (1), DevAddr (4), FCtrl (1), FCnt (2), FPort (1) and MIC (4). Also, FOpts may include MAC commands."},"overhead size")),l.a.createElement(I,Object.assign({},c,{min:13}))),l.a.createElement(x.a.Group,{as:f.a,xs:4,sm:3,lg:2,controlId:"formApplicationPayloadSize"},l.a.createElement(x.a.Label,null,l.a.createElement(T,{showIcon:!0,content:"The application payload size. May be empty for a simple ACK or if the packet only includes MAC commands."},"payload size")),l.a.createElement(I,r)),"4/5"!==o.value&&l.a.createElement(x.a.Group,{as:f.a,xs:4,sm:3,lg:2,controlId:"formCodingRate"},l.a.createElement(x.a.Label,null,l.a.createElement(T,{showIcon:!0,content:"The coding rate (CR) used for forward error correction (FEC). Always 4/5 for LoRaWAN."},"coding rate")),l.a.createElement(x.a.Control,Object.assign({as:"select"},F(o)),l.a.createElement("option",{value:"4/5"},"4/5"),l.a.createElement("option",{value:"4/6"},"4/6"),l.a.createElement("option",{value:"4/7"},"4/7"),l.a.createElement("option",{value:"4/8"},"4/8"))),l.a.createElement(x.a.Group,{as:f.a,xs:1,controlId:"formCopy"},l.a.createElement(x.a.Label,null,l.a.createElement(T,{showIcon:!0,content:"If any text is selected, copy that. Otherwise, when a tooltip is active, copy its text. (Use the keyboard on a desktop browser.) Or else, copy the results."},"copy")),l.a.createElement("div",null,l.a.createElement(y.a,{variant:"outline-secondary","aria-label":"Copy",onClick:function(e){document.execCommand("copy"),e.currentTarget.blur()}},l.a.createElement(k.a,{size:"1em"}))))),a.macCommands&&l.a.createElement(l.a.Fragment,null,l.a.createElement(x.a.Row,{className:"justify-content-md-center"},l.a.createElement(f.a,{md:"8"},l.a.createElement(x.a.Label,null,"MAC command"),l.a.createElement(S.a,{"aria-label":"MAC commands"},m))),l.a.createElement("br",null))))}var H=a(78),U=a(79),V=function(){function e(){Object(H.a)(this,e)}return Object(U.a)(e,null,[{key:"calculate",value:function(e,t,a){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"4/5",l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"auto",r=!(arguments.length>5&&void 0!==arguments[5])||arguments[5],c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:8,o=Math.pow(2,t)/(1e3*a)*1e3,i=(c+4.25)*o,s=r?0:1,u="auto"===l&&125===+a&&+t>=11||!0===l?1:0,m=+n[2]-4,d=8+Math.max(Math.ceil((8*e-4*t+28+16-20*s)/(4*(t-2*u)))*(m+4),0),f=d*o;return i+f}}]),e}();function G(e,t){return e.toLocaleString("en-US",{minimumFractionDigits:t,maximumFractionDigits:t})}function X(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.reduce((function(e,t){return t?e+(e&&"."!==e.slice(-1)?". ":e?" ":"")+t+(e&&"."!==t.slice(-1)?".":""):e}),"")||void 0}function $(e){var t,a=e.region,n=e.dr,r=e.size,c=e.airtime,o=e.maxPhyPayloadSize,i=c/.01/1e3,s=3e4/c,u=86400/s,m=a.maxDwellTime||0,d=m>0&&c>m,f=n.maxMacPayloadSize&&r>o;return l.a.createElement(l.a.Fragment,null,l.a.createElement(T,{content:X(n.notes,n.maxMacPayloadSize&&(f?"The total payload of ".concat(r," bytes exceeds the maximum packet size of ").concat(o," bytes for ").concat(a.label," SF").concat(n.sf,"BW").concat(n.bw):"For ".concat(a.label," SF").concat(n.sf,"BW").concat(n.bw," the maximum total packet size is ").concat(o," bytes")))},l.a.createElement("div",{className:"Result-datarate ".concat(f?"Result-has-warning":n.notes?"Result-has-note":""),role:"cell"},l.a.createElement("div",{className:"Result-dr"},n.name),l.a.createElement("div",null,"\u200b\u200b",l.a.createElement("span",{className:"Result-sf"},"SF",n.sf),"\u200b\u200b",l.a.createElement("span",{className:"Result-unit Result-unit-bw"},"BW",l.a.createElement("br",null),n.bw)),f&&l.a.createElement("div",{className:"Result-datarate-warning"},"\u200b\u200bmax size exceeded"))),l.a.createElement(T,{content:l.a.createElement(l.a.Fragment,null,"On SF",n.sf,"BW",n.bw,", a total packet size of ",r," bytes"," ",l.a.createElement("a",{href:document.location.href},"needs ",G(c,2)," milliseconds time on air"),".",d&&l.a.createElement(l.a.Fragment,null," ","This exceeds the maximum dwell time of ",m," milliseconds for"," ",a.label,"."))},l.a.createElement("div",{className:"Result-airtime ".concat(d?"Result-has-warning":""),role:"cell"},l.a.createElement("div",null,G(c,1),"\u200b",l.a.createElement("span",{className:"Result-unit"},"ms")),d&&l.a.createElement("div",{className:"Result-airtime-warning"},"\u200b\u200bmax dwell time exceeded"))),l.a.createElement(T,{content:l.a.createElement(l.a.Fragment,null,"If regional legal or LoRaWAN maximum duty cycles apply, then a 1% maximum duty cycle needs a ",l.a.createElement("em",null,"minimum")," of ",G(i,2)," seconds between ",l.a.createElement("em",null,"any")," subsequent packet starts in the same subband.")},l.a.createElement("div",{className:"Result-dutycycle",role:"cell"},l.a.createElement("div",null,G(i,1),"\u200b",l.a.createElement("span",{className:"Result-unit"},"sec"),"\u200b\u200b"),l.a.createElement("div",null,G(Math.floor(3600/i),0),"\u200b",l.a.createElement("span",{className:"Result-unit"},"msg",l.a.createElement("br",null),"/hour")))),l.a.createElement(T,{content:l.a.createElement(l.a.Fragment,null,l.a.createElement("p",null,"The ",l.a.createElement("a",{href:"https://www.thethingsnetwork.org/forum/t/1300"},"TTN Fair Access Policy")," ","allows for at most 30 seconds time on air per device, per 24 hours. So, an"," ",l.a.createElement("a",{href:document.location.href},"airtime of ",G(c,1)," milliseconds for ",r," bytes on SF",n.sf,"BW",n.bw)," ","imposes a limit of ",G(s,1)," messages per day."),"\n\n",l.a.createElement("p",null,"When transmitting all day, ",l.a.createElement("strong",null,"on average")," this needs a minimum of"," ",(t=u,t>=120.05?"".concat(G(t/60,1)," minutes"):"".concat(G(t,1)," seconds"))," between the starts of two uplinks, or a maximum of"," ",G(s/24,1),"\xa0messages per hour."))},l.a.createElement("div",{className:"Result-fairaccess",role:"cell"},l.a.createElement("div",{className:"Result-fairaccess-messages"},G(86400/s,1),"\u200b",l.a.createElement("span",{className:"Result-unit"},"sec\u200b",l.a.createElement("br",null),"(avg)"),"\u200b\u200b"),l.a.createElement("div",null,l.a.createElement("span",{className:"Result-fairaccess-messages-per-hour"},G(s/24,1)),"\u200b",l.a.createElement("span",{className:"Result-unit Result-unit-hour"},"avg",l.a.createElement("br",null),"/hour"),"\u200b\u200b"),l.a.createElement("div",{className:"Result-fairaccess-messages-per-day"},G(Math.floor(s),0),"\u200b",l.a.createElement("span",{className:"Result-unit"},"msg",l.a.createElement("br",null),"/24h")))))}function J(e){var t=e.region,a=e.packetSize,n=e.codingRate;if(!n)return null;var r=t.dataRates.map((function(e,r){var c=V.calculate(a,e.sf,e.bw,n),o=e.maxMacPayloadSize+5,i=t.maxDwellTime&&c>t.maxDwellTime||e.maxMacPayloadSize&&a>o,s="Results-result-".concat(r%2?"odd":"even"),u="Results-result-highlight-".concat(i?"warning":e.highlight||"none");return l.a.createElement("div",{key:e.name,className:"Results-result ".concat(s," ").concat(u),role:"row"},l.a.createElement($,{size:a,region:t,dr:e,airtime:c,maxPhyPayloadSize:o}))}));return l.a.createElement(l.a.Fragment,null,l.a.createElement("div",{className:"Results-grid Results-grid-".concat(r.length),role:"table","data-label":"Time on air and limitations for a full LoRaWAN packet of ".concat(a," bytes in ").concat(t.label,":")},l.a.createElement("div",{role:"rowgroup"},l.a.createElement("div",{className:"Results-legend",role:"row"},l.a.createElement("div",{role:"columnheader"},"data rate"),l.a.createElement("div",{role:"columnheader"},"airtime"),l.a.createElement("div",{role:"columnheader"},"1%\xa0max duty\xa0cycle"),l.a.createElement("div",{role:"columnheader"},"fair access policy"))),l.a.createElement("div",{role:"rowgroup"},r)))}a(197);function K(e){var t=e.children,a=Object(n.useRef)(null),r=Object(n.useState)(!1),c=Object(u.a)(r,2),o=c[0],i=c[1],s=Object(n.useState)(!1),m=Object(u.a)(s,2),d=m[0],f=m[1],p=Object(n.useState)({width:-1,height:-1}),E=Object(u.a)(p,1)[0],h=function(e){var t=a.current;t&&t.scrollBy(e,0)};return Object(n.useEffect)((function(){var e=a.current,t=function(){if(e){var t=e.scrollLeft>0,a=e.scrollWidth-e.offsetWidth>e.scrollLeft+1;i(t),f(a)}else console.log("No scroll element")};if(e)return t(),window.addEventListener("resize",t),e.addEventListener("scroll",t),function(){e.removeEventListener("scroll",t),window.removeEventListener("resize",t)}}),[E]),l.a.createElement("div",{className:"d-flex justify-content-center align-items-center horizontal-scroll"+(o?" horizontal-scroll--overflow-left":"")+(d?" horizontal-scroll--overflow-right":"")},l.a.createElement("div",{className:"horizontal-scroll__button"+(o?" horizontal-scroll__button--enabled":""),onClick:function(){h(-40)}},"\u2039"),l.a.createElement("div",{className:"horizontal-scroll__content table-responsive",ref:a},t),l.a.createElement("div",{className:"horizontal-scroll__button"+(d?" horizontal-scroll__button--enabled":""),onClick:function(){h(40)}},"\u203a"))}function Y(e,t,a){var n=t.pathname.split("/"),l=Object(u.a)(n,4),r=l[1],c=l[2],o=l[3],i=a.networks.find((function(e){return e.name===r})),s=i?i.regions.find((function(e){return e.name===c})):void 0;return{network:i,region:s,parameters:o}}function Q(e,t,a,n,l,r){var c=Y(0,t,a),o=void 0===r?c.parameters:r,i="/"+n.name+"/"+l.name+(o?"/"+o:"");t.pathname!==i?e.replace(i):console.log("No URL change needed; ".concat(i))}function Z(e){var t=Object(n.useState)(null),a=Object(u.a)(t,2),r=a[0],c=a[1],o=Object(n.useState)(null),i=Object(u.a)(o,2),s=i[0],m=i[1],d=Q.bind(null,e.history,e.location,e.config),p=Y(e.history,e.location,e.config),h=p.network,v=p.region,g=p.parameters;if(!h){var b=e.config.networks[0],R=b.regions.find((function(e){return e.name===b.defaultRegion}));return d(b,R),null}if(!v){var j=h.regions.find((function(e){return e.name===h.defaultRegion}));return d(h,j),null}return l.a.createElement(l.a.Fragment,null,l.a.createElement(E.a,null,l.a.createElement(f.a,null,l.a.createElement(K,null,l.a.createElement(w.a,null,h.regions.map((function(e){return l.a.createElement(y.a,{variant:"outline-primary",size:"sm",active:e.name===v.name,disabled:!e.dataRates,key:e.name,onClick:function(){return function(e){console.log("region",e),d(h,e)}(e)}},e.label)})))))),l.a.createElement(E.a,null,l.a.createElement("hr",null)),l.a.createElement(E.a,{className:"justify-content-sm-center"},l.a.createElement(f.a,null,l.a.createElement("h3",null,v.title))),l.a.createElement(E.a,{className:"justify-content-center"},l.a.createElement(f.a,null,l.a.createElement(_,{userConfig:g,setUserConfig:function(e){console.log("URL",e),d(h,v,e)},setPacketSize:function(e){console.log("packet size",r,e),c(e)},setCodingRate:function(e){console.log("coding rate",s,e),m(e)}}))),l.a.createElement(E.a,{className:"justify-content-center"},l.a.createElement(f.a,null,l.a.createElement(J,{region:v,packetSize:r,codingRate:s}),l.a.createElement("hr",null))),l.a.createElement(E.a,{className:"justify-content-md-center"},l.a.createElement(f.a,{md:"8"},v.limitations&&l.a.createElement(z.a,{source:v.limitations}))),l.a.createElement(E.a,{className:"justify-content-md-center"},l.a.createElement(f.a,{md:"8"},v.countries&&l.a.createElement(z.a,{source:v.countries}))))}var ee=a(37);a(198);function te(e){var t=e.notification,a=Object(n.useState)(0),r=Object(u.a)(a,2),c=r[0],o=r[1],i=Object(n.useState)(0),s=Object(u.a)(i,2),m=s[0],d=s[1],f=Object(n.useRef)(0);Object(n.useEffect)((function(){if(t){var e=ae(t.title)+ae(t.content),a=Math.max(3e3,70*e.length);o(Date.now()+a)}}),[t]),Object(n.useEffect)((function(){f.current&&window.clearTimeout(f.current),c-m>0&&(f.current=window.setTimeout((function(){f.current=null,d(Date.now())}),1e3))}),[c,m]);var p=function(){o(Date.now())},E=(c-Date.now())/1e3;return E<=0||!t?null:l.a.createElement(ee.a,{className:"Toast",onClose:p,onClick:p},l.a.createElement(ee.a.Header,null,l.a.createElement("strong",{className:"mr-auto header"},t.title),l.a.createElement("small",null,E.toFixed(0))),t.content?l.a.createElement(ee.a.Body,null,t.content):null)}function ae(e){if(!e)return"";if("string"===typeof e)return e;var t=e.props&&e.props.children;return t instanceof Array?t.map(ae).join(""):ae(t)}function ne(){var e=Object(n.useState)(),t=Object(u.a)(e,2),a=t[0],r=t[1];return Object(n.useEffect)((function(){var e=function(e){return function(t){if(window.getSelection&&t instanceof ClipboardEvent&&t.clipboardData)return function(){if(window.getSelection){var e=window.getSelection();return null!==e&&""!==e.toString()}return!1}()?void e({title:l.a.createElement(l.a.Fragment,null,"The selected text was copied"),content:l.a.createElement(l.a.Fragment,null,null!==le()?l.a.createElement(l.a.Fragment,null,l.a.createElement("p",null,l.a.createElement("strong",null,"Did you intend to copy the tooltip?")," Then ensure no text is selected when copying.")):l.a.createElement("p",null,"To copy a tooltip, ensure no text is selected. (And use the keyboard on a desktop browser.)"),l.a.createElement("p",null,"To copy the result grid, make sure no text is selected and no tooltip is shown."))}):function(e){if(!e.clipboardData)return!1;var t=le();if(t)return t instanceof HTMLElement&&t.innerHTML&&(console.log("text/html"),e.clipboardData.setData("text/html",t.innerHTML)),t&&t.textContent&&e.clipboardData.setData("text/plain",t.textContent),e.preventDefault(),!0;return!1}(t)?void e({title:"The tooltip text was copied",content:"To copy the result grid, make sure no tooltip is shown while copying."}):void(function(e){if(!e.clipboardData)return!1;var t=document.querySelector('[role="table"]');if(t){var a=t.getAttribute("data-label"),n=re(t,"rowgroup"),l=re(n[0],"columnheader"),r=re(n[1],"row"),c="<thead>\n<tr>".concat(l.map((function(e){return"<th>".concat(e.textContent,"</th>")})).join(""),"</tr>\n</thead>"),o="<tbody>\n".concat(r.map((function(e){return re(e,"cell")})).map((function(e){return"<tr>".concat(e.map((function(e){return"<td>".concat(e.textContent,"</td>")})).join(""),"</tr>")})).join("\n"),"\n</tbody>"),i="<table>\n".concat(c,"\n").concat(o,"\n</table>").replace(/\u200B\u200B/g,"&lt;br>").replace(/\u200B/g," "),s="<p>".concat(a,"</p>\n")+i+'\n<p>See <a href="'.concat(document.location.href,'">the airtime calculator</a> for interactive results.</p>');return e.clipboardData.setData("text/html",s),e.clipboardData.setData("text/plain","See ".concat(document.location.href," for formatted results.")),e.preventDefault(),!0}return!1}(t)&&e({title:"The result grid was copied",content:l.a.createElement(l.a.Fragment,null,l.a.createElement("p",null,"To copy a tooltip, make sure it's shown while copying. (And use the keyboard on a desktop browser.)"))}));e({title:"Unsupported browser",content:"Your browser does not support the enhanced copy function to copy the tooltip or result grid."})}}(r);return window.addEventListener("copy",e),function(){window.removeEventListener("copy",e)}}),[]),{notification:a}}function le(){return document.querySelector('[role="tooltip"] .tooltip-inner')}function re(e,t){return Array.from(e.querySelectorAll('[role="'.concat(t,'"]')))}function ce(){var e="/airtime-calculator/config.json",t=Object(n.useState)("Loading configuration..."),a=Object(u.a)(t,2),r=a[0],c=a[1],o=Object(n.useState)({}),m=Object(u.a)(o,2),h=m[0],y=m[1];Object(n.useEffect)((function(){var t=!1;return function(){var a=Object(s.a)(i.a.mark((function a(){var n;return i.a.wrap((function(a){for(;;)switch(a.prev=a.next){case 0:return a.prev=0,a.next=3,d.a.get(e);case 3:n=a.sent.data,t||(c(null),y(n)),a.next=10;break;case 7:a.prev=7,a.t0=a.catch(0),c("Failed to load configuration ".concat("/airtime-calculator"," ").concat(e,": ").concat(a.t0));case 10:case"end":return a.stop()}}),a,null,[[0,7]])})));return function(){return a.apply(this,arguments)}}()(),function(){t=!0}}),[e]);var w=ne().notification;return l.a.createElement(g.a,{basename:"/airtime-calculator"},l.a.createElement(p.a,{fluid:!0,className:"App"},l.a.createElement(te,{notification:w}),l.a.createElement(E.a,null,l.a.createElement(f.a,null,l.a.createElement("h1",null,"Airtime calculator for LoRaWAN"),l.a.createElement("p",null,r))),h.networks&&l.a.createElement(b.a,{render:function(e){return l.a.createElement(Z,Object.assign({},e,{config:h}))}}),l.a.createElement(v.a,{href:"https://github.com/avbentem/airtime-calculator"})))}a(200),Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(l.a.createElement(ce,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},86:function(e,t,a){e.exports=a(201)}},[[86,1,2]]]);
//# sourceMappingURL=main.7ad008c6.chunk.js.map