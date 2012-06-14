var WebAppLoader={};
(function(){var t=[],r={},i={},v={sharingDenied:0,sharingAllowed:1},d=true,x=false,w=v.sharingAllowed;
r={name:"",source:null,bin:null,added:false,loaded:false,unloaded:false,isPlugin:false,isShared:false,hasEvents:false,plugins:[],sharedModules:[],getPlugin:function(B){var A=this.plugins.some(function(C){return C===B
});
return(A)?this.loader.getPlugin(B):null
},getSharedModule:function(B){var A=this.sharedModules.some(function(C){return C===B
});
return(A)?this.loader.getSharedModule(B):null
},getEventManager:function(){return(this.hasEvents)?this.loader.getEventManager():null
},getConsole:function(){return this.loader.getConsole()
},loader:{}};
function y(B,A){var C=(A)?" - "+A+" exception! ":"";
if(!x){throw (C+B)
}}function n(D,C){function A(F,G,E){return(typeof F===G)?F:E
}function B(F,E){return(Array.isArray(F))?F:E
}switch(C){case"boolean":return A(D,"boolean",false);
case"b":return A(D,"boolean",false);
case"string":return A(D,"string","");
case"s":return A(D,"string","");
case"number":return A(D,"number",0);
case"n":return A(D,"number",0);
case"object":return A(D,"object",{});
case"o":return A(D,"object",{});
case"array":return B(D,[]);
case"a":return B(D,[]);
default:return D
}}var e=(function(){var A={},B={};
function D(G,F){B[G]=F
}function E(G){var F=Array.prototype.slice.call(arguments,1);
if(B[G]){B[G].apply(null,F)
}}function C(F){F.on=D;
F.raiseEvent=E
}A.on=D;
A.raiseEvent=E;
A.init=C;
return A
})();
var c=(function(){var A={},B=(d)?function(){}:function(){console.log.apply(console,arguments)
};
A.log=B;
return A
})();
function s(A){t.some(function(B){return B.name===A
})
}function m(B,C){var A={};
A=t.filter(function(D){switch(C){case"plugin":return D.name===B&&D.isPlugin;
case"shared":return D.name===B&&D.isShared;
case"extension":return D.name===B&&D.isExtension;
default:return D.name===B
}})[0]||null;
return A
}function b(A,K){var H=n(A.name,"string"),C=n(A.hasEvents,"boolean"),E=n(A.isShared,"boolean"),D=n(A.isPlugin,"boolean"),I=n(A.plugins,"array"),J=n(A.sharedModules,"array"),B="",F="";
if(!s(H)){F=(E&&J.length>0)&&(w===v.sharingDenied);
if(F){B+='"'+H+'" is a shared module and cannot load any other shared modules. ';
B+='Set "isShared" to false or remove "sharedModules" to solve the problem.';
y(B,"addModule")
}var G=Object.create(r);
G.source=K;
G.isPlugin=D;
G.name=H;
G.isShared=E;
G.hasEvents=C;
G.plugins=I;
G.sharedModules=J;
G.added=true;
if(G.isPlugin){G.getConsole=j;
G.getEventManager=k
}else{g(A,G)
}t.push(G)
}}function p(A,C){var B;
B=m(A,C);
if(!B){return B
}if(!B.loaded){if(B.isExtension){B.bin=B.source(r);
i[A]=B.bin
}else{B.bin=B.source()
}B.loaded=true;
B.unloaded=false;
if(B.hasEvents){B.bin.on=e.on
}}h(B);
return(B.loaded)?B.bin:null
}function z(A){var B,C=false;
B=m(A);
if(B){B.bin=null;
B.loaded=false;
B.unloaded=true;
C=true
}return C
}function u(A){if(z(A)){return p(A)
}}function l(F){var E=[],G=[],H=[],I=[],D="",B="\n";
if(n(F,"boolean")){B="</br>"
}E=t.filter(function(J){return(J.isPlugin==false&&J.isShared==false)
});
G=t.filter(function(J){return(J.isPlugin==true)
});
H=t.filter(function(J){return(J.isShared==true)
});
function A(J){D+=(n(J,"string"))+B
}function C(N,J){var M=null,O="",L=0;
L=N.length;
A(J+"("+L+")");
A();
for(var K=0;
K<L;
K+=1){M=N[K];
if(M.loaded){O="loaded"
}if(M.unloaded){O="unloaded"
}if(M.added&&(!M.loaded&&!M.unloaded)){O="added"
}A("- "+O.toUpperCase()+":\t"+M.name+": ")
}A()
}A("TOTAL NUMBER MODULES: "+t.length);
A();
C(E,"STANDARD MODULES");
C(G,"PLUGINS");
C(H,"SHARED MODULES");
return D
}function q(A){return p(A,"shared")
}function k(){return e
}function j(){return c
}function f(A,B){WebAppLoader[A]=B()
}function o(){alert("INIT!")
}function a(A,G){var D=n(A.name,"string"),B=n(A.hasEvents,"boolean"),E=n(A.plugins,"array"),F=n(A.sharedModules,"array");
if(!s(D)){var C=Object.create(r);
C.source=G;
C.name=D;
C.isExtension=true;
C.plugins=E;
C.sharedModules=F;
C.added=true;
C.hasEvents=B;
t.push(C);
p(D,"extension")
}}function g(A,C){var D=C;
for(var B in i){if(i[B].extendAddModule){i[B].extendAddModule(A,C)
}}}function h(C){var B=C;
for(var A in i){if(i[A].extendLoadModule){i[A].extendLoadModule(C)
}}}r.loader=(function(){var E={};
function C(F){return p(F,"plugin")
}function D(F){return p(F,"shared")
}function B(){return e
}function A(){return c
}E.getPlugin=C;
E.getSharedModule=D;
E.getEventManager=B;
E.getConsole=A;
return E
})();
WebAppLoader.addModule=b;
WebAppLoader.loadModule=p;
WebAppLoader.unloadModule=z;
WebAppLoader.getSharedModule=q;
WebAppLoader.getEventManager=k;
WebAppLoader.getConsole=j;
WebAppLoader.getInfo=l;
WebAppLoader.reloadModule=u;
WebAppLoader.addExtension=a;
WebAppLoader.init=o
})();
WebAppLoader.addModule({name:"base64",isPlugin:true},function(){var a={},d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function f(i){i=i.replace(/\r\n/g,"\n");
var j="";
for(var h=0;
h<i.length;
h++){var g=i.charCodeAt(h);
if(g<128){j+=String.fromCharCode(g)
}else{if((g>127)&&(g<2048)){j+=String.fromCharCode((g>>6)|192);
j+=String.fromCharCode((g&63)|128)
}else{j+=String.fromCharCode((g>>12)|224);
j+=String.fromCharCode(((g>>6)&63)|128);
j+=String.fromCharCode((g&63)|128)
}}}return j
}function e(k){var j="";
var h=0;
var g=c1=c2=0;
while(h<k.length){g=k.charCodeAt(h);
if(g<128){j+=String.fromCharCode(g);
h++
}else{if((g>191)&&(g<224)){c2=k.charCodeAt(h+1);
j+=String.fromCharCode(((g&31)<<6)|(c2&63));
h+=2
}else{c2=k.charCodeAt(h+1);
c3=k.charCodeAt(h+2);
j+=String.fromCharCode(((g&15)<<12)|((c2&63)<<6)|(c3&63));
h+=3
}}}return j
}function c(p){var q="";
var g,h,j,k,l,m,n;
var o=0;
p=f(p);
while(o<p.length){g=p.charCodeAt(o++);
h=p.charCodeAt(o++);
j=p.charCodeAt(o++);
k=g>>2;
l=((g&3)<<4)|(h>>4);
m=((h&15)<<2)|(j>>6);
n=j&63;
if(isNaN(h)){m=n=64
}else{if(isNaN(j)){n=64
}}q+=d.charAt(k)+d.charAt(l)+d.charAt(m)+d.charAt(n)
}return q
}function b(p){var q="";
var g,h,j;
var k,l,m,n;
var o=0;
p=p.replace(/[^A-Za-z0-9\+\/\=]/g,"");
while(o<p.length){k=d.indexOf(p.charAt(o++));
l=d.indexOf(p.charAt(o++));
m=d.indexOf(p.charAt(o++));
n=d.indexOf(p.charAt(o++));
g=(k<<2)|(l>>4);
h=((l&15)<<4)|(m>>2);
j=((m&3)<<6)|n;
q=q+String.fromCharCode(g);
if(m!=64){q=q+String.fromCharCode(h)
}if(n!=64){q=q+String.fromCharCode(j)
}}q=e(q);
return q
}a.encode=c;
a.decode=b;
return a
});
WebAppLoader.addModule({name:"helper",isPlugin:true},function(){var i={};
function a(m){return m.charAt(0).toUpperCase()+m.slice(1)
}function l(n,m){return n.indexOf(m)===0
}function c(m,n){return m.match(n+"$")==n
}function g(p,o){function m(r,s,q){return(typeof r===s)?r:q
}function n(r,q){return(Array.isArray(r))?r:q
}switch(o){case"boolean":return m(p,"boolean",false);
case"b":return m(p,"boolean",false);
case"string":return m(p,"string","");
case"s":return m(p,"string","");
case"number":return m(p,"number",0);
case"n":return m(p,"number",0);
case"object":return m(p,"object",{});
case"o":return m(p,"object",{});
case"array":return n(p,[]);
case"a":return n(p,[]);
default:return p
}}function e(p){var o={"undefined":"undefined",number:"number","boolean":"boolean",string:"string","[object Function]":"function","[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date","[object Error]":"error"},m=Object.prototype.toString;
function n(q){return o[typeof q]||o[m.call(q)]||(q?"object":"null")
}return n(p)
}function h(m){return(m!=undefined&&m!=null)
}function b(){return"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(m){var n=Math.random()*16|0,o=m=="x"?n:(n&3|8);
return o.toString(16)
})
}function k(m,o,q){var p=null;
for(var n=m.length-1;
n>=0;
n--){if(m[n]&&m[n][o]===q){p=m.splice(n,1);
break
}}return p
}function d(m,p,q){var o=null;
for(var n=m.length-1;
n>=0;
n--){if(m[n]&&m[n][p]===q){o=m[n];
break
}}return o
}function f(m){var n=decodeURIComponent((location.search.match(RegExp("[?|&]"+m+"=(.+?)(&|$)"))||[,null])[1]);
return(n==="null")?null:n
}function j(n){var m=document.createElement("div");
m.innerHTML=n;
return m.childNodes[0].nodeValue
}i.capitaliseFirstLetter=a;
i.getValueAs=g;
i.startsWith=l;
i.endsWith=c;
i.getType=e;
i.hasValue=h;
i.createUUID=b;
i.removeObjectFromArray=k;
i.getURLParameter=f;
i.getObjectFromArray=d;
i.htmlDecode=j;
return i
});
WebAppLoader.addModule({name:"storage",plugins:["helper"],hasEvents:true,isPlugin:true},function(){var n={},i=this.getConsole(),c=this.getEventManager(),g=this.getPlugin("helper"),k="Revolution";
usedSpace=0;
function f(){return JSON.stringify(localStorage).length
}function e(o,p){var q=null;
if(o&&(typeof o==="string")){q=(p||k)+g.capitaliseFirstLetter(o)
}return q
}function m(o,p){localStorage.setItem(o,p);
i.log("Storage - setItem:",o,p)
}function d(o){return localStorage.getItem(o)
}function h(p,r){var q=e(p,r),s=d(q),t=null;
if(s){if(g.startsWith(s,'{"')){try{t=JSON.parse(s)
}catch(o){i.log("Storage - failed to parse stored item:",key,t)
}}else{t=s
}}return t
}function l(o,p,r){var q=e(o,r),s="";
if(q&&g.hasValue(p)){s=(typeof p==="object")?JSON.stringify(p):p;
m(q,s)
}else{i.log("Storage - cannot save item.",o,p)
}}function j(o,q){var p=e(o,q);
if(p){localStorage.removeItem(p);
i.log("Storage - removed item.",p)
}}function b(){i.log("count()",localStorage.length)
}function a(){localStorage.clear();
i.log("clearAll()")
}n.load=h;
n.save=l;
n.remove=j;
n.count=b;
n.clearAll=a;
n.getUsedSpace=f;
return n
});
WebAppLoader.addExtension({name:"dataObject",plugins:["helper","storage"],hasEvents:true},function(h){var e={},g=h.loader,i=this.getConsole(),b=this.getEventManager(),j=this.getPlugin("storage"),f=this.getPlugin("helper");
dataObjects={};
var a=(function(){var k={};
function l(s){this.data={};
this.defaults={};
for(var t in s){this.data[t]=s[t];
this.defaults[t]=s[t]
}}function m(s){return this.data[s]
}function q(s,t){this.data[s]=t
}function p(s){j.save(this.privateId,this.data,s)
}function o(s){return this.data=j.load(this.privateId,s)||this.defaults||null
}function n(){return this.data||{}
}function r(s){return this.data=s
}k.define=l;
k.get=m;
k.set=q;
k.getData=n;
k.setData=r;
k.saveData=p;
k.loadData=o;
return k
})();
function c(k,m){var l=f.getValueAs(k.dataObjects,"array");
m.dataObjects=l
}function d(k){if(k.dataObjects&&k.dataObjects.length>0){k.bin.getData=function(l){return dataObjects[l].getData()
};
k.bin.saveData=function(l,m){return dataObjects[l].saveData(m)
};
k.bin.loadData=function(l,m){return dataObjects[l].loadData(m)
};
k.bin.getDataObject=function(l){return this[l]
}
}}h.getDataObject=function(m){var k=this.dataObjects.some(function(n){return n===m
});
var l=null;
if(k){if(!dataObjects[m]){l=Object.create(a);
l.privateId=m;
dataObjects[m]=l
}else{throw ('Data object "'+m+'" already exists.')
}}return l
};
e.extendAddModule=c;
e.extendLoadModule=d;
return e
});
WebAppLoader.addModule({name:"portfoliosList",plugins:[],sharedModules:["settings","pageElements","ajaxManager"],hasEvents:true},function(){var f={},e=this.getConsole(),c=this.getEventManager(),g=this.getSharedModule("settings"),b=this.getSharedModule("pageElements"),a=this.getSharedModule("ajaxManager");
$(document).on("click",b.portfolioAnalysisLink,d);
function d(h){var i=$(this).attr("data-link");
a.post(g.siteUrls.analysis,{uri:i},function(j){c.raiseEvent("onDataReceived",j)
});
return false
}return f
});
WebAppLoader.addModule({name:"scroll"},function(){var d={},b;
document.addEventListener("touchmove",function(f){f.preventDefault()
},false);
function c(e,f){var h="div#"+e+" #wrapper",g=f||{};
g.useTransform=false;
g.onBeforeScrollStart=function(i){var j=i.target;
while(j.nodeType!=1){j=j.parentNode
}if(j.tagName!="SELECT"&&j.tagName!="INPUT"&&j.tagName!="TEXTAREA"){i.preventDefault()
}};
if(b){b.destroy();
b=null
}if($(h).get(0)){setTimeout(function(){b=new iScroll($(h).get(0),g)
},25)
}}function a(){try{b.scrollTo(0,0,200)
}catch(f){}}d.rebuild=c;
d.goUp=a;
return d
});
WebAppLoader.addModule({name:"spinningWheel",plugins:["helper"],hasEvents:true},function(){var g={},f=[],e={},b=this.getEventManager(),d=this.getPlugin("helper");
function c(h){if(typeof h=="string"){h=e[h]
}return f[h]
}function a(h){$.each(h.items,function(j,l){var k=d.capitaliseFirstLetter(l.id);
e[l.id]=j;
f[j]={id:l.id,repository:l.repository,lastItemSelected:"",onDoneHandler:"on"+k+"Done",onCancelHandler:"on"+k+"Cancel",onSlotCancel:function(){SpinningWheel.close();
b.raiseEvent(f[j].onCancelHandler)
},onSlotDone:function(){var i,n,m;
m=SpinningWheel.getSelectedValues();
i=m.keys[0]||"";
n=m.values[0]||"";
f[j].lastItemSelected=i;
SpinningWheel.close();
b.raiseEvent(f[j].onDoneHandler,i,n)
},show:function(i){function m(n){SpinningWheel.addSlot(n,"",i||f[j].lastItemSelected);
SpinningWheel.setCancelAction(f[j].onSlotCancel);
SpinningWheel.setDoneAction(f[j].onSlotDone);
SpinningWheel.open()
}this.repository.getData(m)
}}
})
}g.create=a;
g.getSlot=c;
return g
});
WebAppLoader.addModule({name:"swipeButton",plugins:["helper"],sharedModules:["settings","pageElements","ajaxManager"],hasEvents:true},function(){var f={},e=this.getConsole(),d=this.getPlugin("helper"),c=this.getEventManager(),b=this.getSharedModule("pageElements");
function a(j,k,i,g,h){$(j+" li").swipeDelete({btnLabel:k,btnClass:h,click:function(l){l.preventDefault();
if(g){$(this).parents("li").remove()
}e.log("swipe");
i($(this))
}})
}f.addTo=a;
return f
});
WebAppLoader.addModule({name:"tabbar",plugins:["helper"],hasEvents:true},function(){var j={},h=this.getConsole(),d=this.getEventManager(),f=this.getPlugin("helper"),k="",b=[],a={},l=true;
function g(){h.log("tabbar.hide()");
$(k).css({opacity:0});
l=false
}function i(){$(k).css({opacity:1});
l=true;
h.log("tabbar.show()")
}function e(m){if(typeof m=="string"){m=a[m]
}return b[m]
}function c(o){var n=o.buttonPrefix||"tabbar_btn",m="tabbar_badge",p=this;
k=o.tabbarId||"nav#tabbar";
l=(typeof o.visible=="boolean")?o.visible:true;
$.each(o.items,function(r,u){var s=f.capitaliseFirstLetter(u.id),t=o.items.length||1,q=100/t;
a[u.id]=r;
b[r]={id:u.id,linkId:n+s,badgeId:m+s,title:u.title,btnClass:u.btnClass,highlight:u.highlight||false,eventHandler:"on"+s+"Tap",isHighlighted:false,isDisabled:false,setHighlight:function(v){var w=$("#"+this.linkId);
if(this.highlight){this.isHighlighted=!v;
if(this.isHighlighted){$("#tabbar a").removeClass("current");
$("#tabbar div").removeClass("current");
this.isHighlighted=false
}else{$("#tabbar a").addClass("current").not(w).removeClass("current");
$("#tabbar div").addClass("current").not(w).removeClass("current");
this.isHighlighted=true
}}},toggleHighlighted:function(){if(this.highlight){this.setHighlight(!this.isHighlighted)
}},setDisabled:function(w){var x=(w)?0.2:1,v=(w)?"#333":"#f00";
this.isDisabled=w;
$("#"+this.linkId).css({opacity:x});
$("#"+this.badgeId).css({backgroundColor:v})
},setBadgeText:function(x){var v=$("#"+this.badgeId),w=true;
if(x){v.html(x);
v.show()
}else{v.hide()
}}};
$(k+" ul").append($("<li>").css("width",q+"%").append($("<a>").attr("id",b[r].linkId).append($("<small>").attr({id:b[r].badgeId,"class":"badge right",style:"display: none;"})).append($("<strong>").append(b[r].title)).append($("<div>").attr("class",b[r].btnClass))))
});
$(k+" ul li a").each(function(q){$(this).on("click",function(){if(l){if(!b[q].isDisabled){h.log(b[q].title+" was tapped");
b[q].toggleHighlighted();
d.raiseEvent(b[q].eventHandler,b[q])
}else{h.log(b[q].title+" is disabled")
}}})
});
if(!l){$(k).css({opacity:0})
}else{$(k).css({opacity:1})
}}j.create=c;
j.hide=g;
j.show=i;
j.buttons=b;
j.getButton=e;
return j
});
WebAppLoader.addModule({name:"toolbar",plugins:["helper"],sharedModules:["pageElements"],hasEvents:true},function(){var m={},k=this.getConsole(),h=this.getEventManager(),l=this.getSharedModule("settings"),g=this.getSharedModule("pageElements"),j=this.getPlugin("helper"),n="",c=[],a={},o=true,e=30,b=5,d=0;
$(g.toolbar).click(function(){h.raiseEvent("onTap");
k.log("toolbar tapped!")
});
$("#jqt .toolbar > h1").width(300).css("margin","1px 0 0 -150px");
function i(p){if(typeof p=="string"){p=a[p]
}return c[p]
}function f(q){var p=q.buttonPrefix||"toolbar_btn",r=this;
n=q.toolbarId||".toolbar";
o=j.getValueAs(q.visible,"boolean");
$.each(q.items,function(s,v){var t=j.capitaliseFirstLetter(v.id),u=q.items.length||1;
a[v.id]=s;
c[s]={id:v.id,buttonId:p+t,title:v.title,btnClass:v.btnClass,eventHandler:"on"+t+"Tap",isDisabled:false,isSelected:false,select:function(){var w=$("#"+c[s].buttonId),y=c[s].btnClass+"_on",x=c[s].btnClass+"_off";
w.removeClass(x);
w.addClass(y);
this.isSelected=true
},deselect:function(){var w=$("#"+c[s].buttonId),y=c[s].btnClass+"_on",x=c[s].btnClass+"_off";
w.removeClass(y);
w.addClass(x);
this.isSelected=false
}};
$(n).append($("<div>").addClass("toolbar_button "+c[s].btnClass+"_off").attr({id:c[s].buttonId,style:"right: "+(d*e+b)+"px;"}).on("click",function(y){var z=c[s].isSelected,x=c[s].btnClass+"_on",w=c[s].btnClass+"_off";
k.log("toolbar button tapped!");
if(z){z=false;
$(this).removeClass(x);
$(this).addClass(w)
}else{z=true;
$(this).removeClass(w);
$(this).addClass(x)
}c[s].isSelected=z;
h.raiseEvent(c[s].eventHandler,z);
y.stopPropagation()
}));
d+=1
})
}m.create=f;
m.getButton=i;
return m
});
WebAppLoader.addModule({name:"ajaxManager",plugins:["helper"],hasEvents:true,isShared:true},function(){var a={},f=this.getConsole(),b=this.getEventManager(),e=this.getPlugin("helper"),i="";
function d(){return i
}function h(j){i=j||null
}function g(q,m,k,o){var p="",l={},n=o,j=k||null;
p=q;
if(typeof m!=="function"){l=m||{};
if(i&&!l.token){l.token=i
}}else{j=m;
n=k
}$.post(p,l,j,n)
}function c(){}a.post=g;
a.getToken=d;
a.setToken=h;
a.get=c;
return a
});
WebAppLoader.addModule({name:"chartComponents",plugins:["helper"],sharedModules:["chartManager","localizationManager"],dataObjects:["charts"],hasEvents:true,isShared:true},function(){var a={},j=this.getConsole(),f=this.getEventManager(),g=this.getPlugin("helper"),b=this.getSharedModule("chartManager"),h=this.getSharedModule("localizationManager").getLanguage()||{},e={},d=this.getDataObject("charts"),c=null;
d.define({performance_bar:{chartId:"performance_bar",title:h.chart.performanceBarTitle,chartType:"BarChart",include:"childSegments",measures:["rp"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Return"}}},risk_bar:{chartId:"risk_bar",title:h.chart.riskBarTitle,chartType:"BarChart",include:"childSegments",measures:["wp","contributionvar"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Return"}}},allocation_bar:{chartId:"allocation_bar",title:h.chart.allocationbarTitle,chartType:"BarChart",include:"childSegments",measures:["wover"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Excess Weight %"}}},contribution_bar:{chartId:"contribution_bar",title:h.chart.contributionBarTitle,chartType:"BarChart",include:"securities",measures:["ctp"],includeMeasuresFor:["securities"],options:{hAxis:{title:"Contribution"}}},attribution_bar:{chartId:"attribution_bar",title:h.chart.attributionBarTitle,chartType:"BarChart",include:"childSegments",measures:["wendover","etotal"],includeMeasuresFor:["childSegments"]},fixedIncomeContribution_bar:{chartId:"fixedIncomeContribution_bar",title:h.chart.fixedIncomeContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpyc","ctpspread","ctpcur"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#FF6600","#CC0000","#FFCC00"]}},carryContribution_bar:{chartId:"carryContribution_bar",title:h.chart.carryContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpsystcarry","ctpspeccarry"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#336600","#990000"]}},yieldCurveContribution_bar:{chartId:"yieldCurveContribution_bar",title:h.chart.yieldCurveContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpshift","ctptwist","ctpbutterfly","ctprolldown"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#CD66CD","#339900","#FF9900","#660000"]}},riskNumbers_bar:{chartId:"riskNumbers_bar",title:h.chart.riskNumbersBarTitle,chartType:"BarChart",include:"none",measures:["ytmpend","mdpend"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#336699","#530066"]}},performance_bubble:{chartId:"performance_bubble",title:h.chart.performanceBubbleTitle,chartType:"BubbleChart",include:"childSegments",measures:["stddevann","returnannifgtyr","wpabsolute"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Annualized Volatility"},vAxis:{title:"Annualized Return"}}},risk_bubble:{chartId:"risk_bubble",title:h.chart.riskBubbleTitle,chartType:"BubbleChart",include:"childSegments",measures:["valueatriskpercent","rp","wpabsolute"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"% Value at Risk"},vAxis:{title:"Return"}}},contribution_column:{chartId:"contribution_column",title:h.chart.contributionColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["ctp","ctb"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Return %"}}},interestRatesExposure_column:{chartId:"interestRatesExposure_column",title:h.chart.interestRatesExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["interestratesdown100percent","interestratesdown50percent","interestratesup50percent","interestratesup100percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#CC0000","#CD66CD","#FFCC00","#3399CC"]}},creditSpreadsExposure_column:{chartId:"creditSpreadsExposure_column",title:h.chart.creditSpreadsExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["creditspreadsdown100percent","creditspreadsdown50percent","creditspreadsup50percent","creditspreadsup100percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#CC0000","#CD66CD","#FFCC00","#3399CC"]}},dv01Exposure_column:{chartId:"dv01Exposure_column",title:h.chart.dv01ExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["interestratesdv01percent","creditspreadsdv01percent","inflationratesdv01percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#3399CC","#336699","#003366"]}},attribution_column:{chartId:"attribution_column",title:h.chart.attributionColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["etotal","ealloc","eselecinter"],includeMeasuresFor:["childSegments"],options:{colors:["#003366","#FF6600","#990066"]}},allocation_pie:{chartId:"allocation_pie",title:h.chart.allocationPieTitle,chartType:"PieChart",include:"childSegments",measures:["wpabsoluteend"],includeMeasuresFor:["childSegments"]},contribution_pie:{chartId:"contribution_pie",title:h.chart.contributionPieTitle,chartType:"PieChart",include:"childSegments",isHeatMap:true,isGradientReversed:false,measures:["wpabsoluteend","ctp"],includeMeasuresFor:["childSegments"]},risk_pie:{chartId:"risk_pie",title:h.chart.riskPietitle,chartType:"PieChart",include:"childSegments",isHeatMap:true,isGradientReversed:true,measures:["wpabsoluteend","contributionvar"],includeMeasuresFor:["childSegments"]},performance_grid:{chartId:"performance_grid",title:h.chart.performanceGridTitle,chartType:"Table",include:"none",measures:["rp","returnann","stddevann","relr","periodaverage","oneperiodhigh","oneperiodlow","maxloss","percentpositiveperiods","correlation","alpha","beta","rsquared","sharperatio","treynorratio","inforatioxs"],includeMeasuresFor:["segment"]},attribution_grid:{chartId:"attribution_grid",title:h.chart.attributionGridTitle,chartType:"Table",include:"childSegments",measures:["ctp","ctb","ealloclocal","eselecinterlocal","etotalc","etotalmca"],includeMeasuresFor:["segment","childSegments"]},fixedIncome_grid:{chartId:"fixedIncome_grid",title:h.chart.fixedIncomeGridTitle,chartType:"Table",include:"childSegments",measures:["ttmpend","ytmpend","mdpend","durwpend","spreadpend"],includeMeasuresFor:["segment","childSegments"]},fixedIncomeContribution_grid:{chartId:"fixedIncomeContribution_grid",title:h.chart.fixedIncomeContributionGridTitle,chartType:"Table",include:"childSegments",measures:["ctp","ctpyc","ctpcarry","ctpspread","ctpcur","ctpother","ctpresidual"],includeMeasuresFor:["segment","childSegments"]},fixedIncomeExposure_grid:{chartId:"fixedIncomeExposure_grid",title:h.chart.fixedIncomeExposureGridTitle,chartType:"Table",include:"childSegments",measures:["wpend","interestratesdv01percent","creditspreadsdv01percent","inflationratesdv01percent"],includeMeasuresFor:["segment","childSegments"]},performanceTopTen_grid:{chartId:"performanceTopTen_grid",title:h.chart.performanceTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","rp","ctp"],oData:{orderby:"wpend-Earliest desc",top:10},includeMeasuresFor:["securities"]},contributionTopTen_grid:{chartId:"contributionTopTen_grid",title:h.chart.contributionTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","rp","ctp"],oData:{orderby:"ctp-Earliest desc",top:10},includeMeasuresFor:["securities"]},riskTopTen_grid:{chartId:"riskTopTen_grid",title:h.chart.riskTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","expectedshortfallpercent","valueatriskpercent","expectedvolatilitypercent"],oData:{orderby:"valueatriskpercent-Earliest desc",top:10},includeMeasuresFor:["securities"]},performance_treemap:{chartId:"performance_treemap",title:h.chart.performanceTreemapTitle,chartType:"TreeMap",include:"securities",measures:["wpabsoluteend","rp"],includeMeasuresFor:["segment","securities"]},risk_treemap:{chartId:"risk_treemap",title:h.chart.riskTreemapTitle,chartType:"TreeMap",include:"childSegments",measures:["wpabsoluteend","contributionvar"],includeMeasuresFor:["segment","childSegments"]},performance_line:{chartId:"performance_line",title:h.chart.performanceLineTitle,chartType:"LineChart",measures:["rp","rb"],seriesType:"cumulativeIndexed"},fi_contribution_group:{chartId:"fi_contribution_group",title:h.chart.fixedIncomeContributionsGroupTitle,chartType:"Group",charts:[{chartId:"fixedIncomeContribution_bar",width:"50%",height:"100%"},{chartId:"carryContribution_bar",width:"50%",height:"100%"},{chartId:"yieldCurveContribution_bar",width:"50%",height:"100%"},{chartId:"riskNumbers_bar",width:"50%",height:"100%"}]},fi_exposures_group:{chartId:"fi_exposures_group",title:h.chart.fixedIncomeExposuresGroupTitle,chartType:"Group",charts:[{chartId:"interestRatesExposure_column",width:"50%",height:"100%"},{chartId:"creditSpreadsExposure_column",width:"50%",height:"100%"},{chartId:"dv01Exposure_column",width:"50%",height:"100%"}]},fi_gridRiskNumber_group:{chartId:"fi_gridRiskNumber_group",title:h.chart.fixedIncomeRiskNumbersGroupTitle,chartType:"Group",charts:[{chartId:"fixedIncome_grid",width:"100%",height:"100%"},{chartId:"fixedIncomeContribution_grid",width:"100%",height:"100%"}]}});
c=d.getData();
function i(m){var n,l,q,p=true;
for(var o=0;
o<m.length;
o++){l=m[o].chartId;
q=m[o].timePeriodId;
if(e[l]){n=e[l]
}else{n=b.create(c[l]);
e[l]=n
}if(q){n.timePeriods=q
}b.load(n,p);
if(n){p=false
}}}function k(p,v){var q=[],s="";
function u(w){s="";
s+='<div class="analysisSummarySection">    <h2>'+w+'</h2>    <div class="analysisComponentContainer">'
}function l(w,x){s+='        <div id="'+w.chartId+'" class="'+x+'"></div>'
}function n(w){s+='        <div id="'+w.chartId+'" class="halfSizeChart" style="width: '+w.width+";height: "+w.height+';"></div>'
}function r(){s+='        <div style="clear: both;"></div>    </div></div>'
}function o(){$(v).append($(s))
}function m(x){var w=[],A=false,y;
if(!x){j.log("addChartToChartsToRender: Skipped empty chart");
return
}if(x.chartType==="Group"){w=x.charts;
A=true
}else{w.push(x)
}if(A){u(x.title)
}y=(x.chartType==="Table")?"":"chartContainer";
for(var z=0;
z<w.length;
z++){chart=c[w[z].chartId]||null;
q.push(chart);
if(chart){if(A){n(w[z])
}else{u(chart.title);
l(w[z],y);
r();
o()
}}}if(A){r();
o()
}}for(var t=0;
t<p.length;
t++){m(c[p[t].chartId]||null)
}i(q)
}b.on("onAnalysisLoaded",function(){f.raiseEvent("onAllChartsLoaded")
});
b.on("onAnalysisLoading",function(l,m){f.raiseEvent("onChartsLoading",l,m)
});
a.load=i;
a.render=k;
return a
});
WebAppLoader.addModule({name:"chartDefaults",isShared:true},function(){var d={},f={},a={},b={},e={},g={},h={},i={},k={},l={},j=this.getConsole();
f={forceIFrame:false,labelFontName:"HelveticaNeue-Light",labelFontSize:12,titleFontName:"HelveticaNeue-Bold",titleFontSize:25};
b={chartArea:{left:80,top:35,width:"70%",height:"80%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,hAxis:{titleTextStyle:{fontName:f.titleFontName,fontSize:f.titleFontSize}},sizeAxis:{maxSize:100,maxValue:100,minSize:1,minValue:1},vAxis:{titleTextStyle:{fontName:f.titleFontName,fontSize:f.titleFontSize}}};
a={chartArea:{left:"20%",width:"60%",height:"80%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,vAxis:{titleTextStyle:{fontName:f.titleFontName,fontSize:f.titleFontSize}}};
e={chartArea:{left:"10%",width:"70%",height:"75%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,vAxis:{titleTextStyle:{fontName:f.titleFontName,fontSize:f.titleFontSize}}};
g={forceIFrame:f.forceIFrame,height:250,greenFrom:0,greenTo:4,yellowFrom:4,yellowTo:6,redFrom:6,redTo:20,max:20,minorTicks:5};
h={allowHtml:true,alternatingRowStyle:true,forceIFrame:f.forceIFrame,cssClassNames:{headerRow:"headerRow",tableRow:"tableRow",oddTableRow:"oddTableRow",selectedTableRow:"selectedTableRow",hoverTableRow:"hoverTableRow"}};
i={chartArea:{left:80,top:35,width:"75%",height:"80%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame};
k={chartArea:{left:80,width:"75%",height:"80%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,is3D:true};
l={fontFamily:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,headerHeight:25,minColor:"#cc0000",midColor:"#ffffff",maxColor:"#6699cc",maxDepth:3};
function c(m,n){f[m]=n;
j.log("change setting")
}d.BarChart=a;
d.BubbleChart=b;
d.ColumnChart=e;
d.Gauge=g;
d.LineChart=i;
d.PieChart=k;
d.Table=h;
d.TreeMap=l;
d.set=c;
return d
});
WebAppLoader.addModule({name:"chartManager",sharedModules:["settings","chartDefaults","colorManager","localizationManager","ajaxManager"],isShared:true,hasEvents:true},function(){var b={},e=[],i=this.getEventManager(),d=this.getSharedModule("chartDefaults"),p=this.getSharedModule("settings").siteUrls,g=this.getSharedModule("colorManager"),k=this.getSharedModule("localizationManager").getLanguage()||{},a=this.getSharedModule("ajaxManager"),n=this.getConsole(),c=0,f=0,j=false;
function o(){c=0;
f=0;
j=false
}function q(){o();
j=true
}function r(){o()
}function m(t){var s;
if(j){c+=1;
i.raiseEvent("onAnalysisLoading",c,f);
if(c===f){r();
i.raiseEvent("onAnalysisLoaded")
}}if(t&&t.id){s=google.visualization.errors.getContainer(t.id);
$("#"+s.id).html(k.errors.chartFailedText)
}}function h(t){if(!t){n.log("Config is not specified.");
return
}var v=t.chartId||null,x=t.chartType||null,w=t.options||{},u={},s=null;
if(!v||!x){n.log("Chart ID or type is not specified.");
return
}u=(d&&d[x])?d[x]:{};
w=$.extend({},u,w);
s=new google.visualization.ChartWrapper({chartType:x,options:w,containerId:v});
s.endDate=t.endDate;
s.include=t.include;
s.includeMeasuresFor=t.includeMeasuresFor;
s.isGradientReversed=t.isGradientReversed;
s.isHeatMap=t.isHeatMap;
s.measures=t.measures;
s.oData=t.oData;
s.seriesType=t.seriesType;
s.startDate=t.startDate;
s.timePeriods=t.timePeriods;
google.visualization.events.addListener(s,"ready",m);
google.visualization.events.addListener(s,"error",m);
return s
}function l(s,u){var x,w,y,t;
if(!s){return
}if(u){q()
}f++;
x=s.getChartType();
t=new google.visualization.NumberFormat({decimalSymbol:k.shared.decimalSymbol,fractionDigits:3,groupingSymbol:k.shared.groupingSymbol,negativeColor:"#cc0000",negativeParens:false});
w={type:x};
if(s.endDate){w.endDate=s.endDate
}if(s.include){w.include=s.include
}if(s.includeMeasuresFor){w.includeMeasuresFor=s.includeMeasuresFor
}if(s.measures){w.measures=s.measures
}if(s.oData){w.oData=s.oData
}if(s.startDate){w.startDate=s.startDate
}if(s.seriesType){w.seriesType=s.seriesType
}if(s.timePeriods){w.timePeriods=s.timePeriods
}y=(x==="LineChart")?p.timeSeries:p.segmentsTreeNode;
function v(z){var A,B,D,C,F=[],E=[];
n.log(z);
A=new google.visualization.DataTable(z);
for(B=0;
B<A.getNumberOfColumns();
B++){if(A.getColumnType(B)==="number"){t.format(A,B)
}}if(x==="PieChart"&&s.isHeatMap){for(B=0;
B<A.getNumberOfRows();
B++){F.push(A.getValue(B,2))
}D=Math.min.apply(Math,F);
C=Math.max.apply(Math,F);
if(Math.abs(D)>Math.abs(C)){C=Math.abs(D);
D=-(Math.abs(D))
}else{C=Math.abs(C);
D=-(Math.abs(C))
}for(B=0;
B<F.length;
B++){E.push({color:g.getColorInRange(F[B],D,C,s.isGradientReversed)})
}s.setOption("slices",E)
}s.setDataTable(A);
s.draw();
$(document).on("orientationchange",function(G){s.draw()
})
}a.post(y,w,v,"text")
}b.create=h;
b.load=l;
return b
});
WebAppLoader.addModule({name:"colorManager",isShared:true},function(){var a={},i=this.getConsole();
function b(l){return(l.charAt(0)=="#")?l.substring(1,7):l
}function k(m){var l="0123456789ABCDEF";
m=parseInt(m,10);
if(isNaN(m)){return"00"
}m=Math.max(0,Math.min(m,255));
return l.charAt((m-m%16)/16)+l.charAt(m%16)
}function j(n,m,l){return"#"+k(n)+k(m)+k(l)
}function g(l){return parseInt((b(l)).substring(0,2),16)
}function f(l){return parseInt((b(l)).substring(2,4),16)
}function e(l){return parseInt((b(l)).substring(4,6),16)
}function c(l){return parseInt(l,10)&255
}function h(m,l,n){return c(c(m)*(1-n)+c(l)*n)
}function d(z,s,r,x){var m=[],w="#cc0000",A="#ffff00",n="#339900",q,l,v,u,y,o,t;
if(z<s){return w
}if(z>r){return n
}if(x){if(z>0){m.push([0,A]);
m.push([r,w])
}else{m.push([s,n]);
m.push([0,A])
}}else{if(z>0){m.push([r,n]);
m.push([0,A])
}else{m.push([0,A]);
m.push([s,w])
}}y=[0,A];
for(o=0;
o<m.length;
o++){q=m[o][0];
if(q>=z){l=m[o][1];
v=y[0];
u=y[1];
t=((z-v)/(q-v));
return j(h(g(u),g(l),t),h(f(u),f(l),t),h(e(u),e(l),t))
}y=m[o]
}return A
}a.getColorInRange=d;
return a
});
WebAppLoader.addModule({name:"loadingMaskManager",sharedModules:["pageElements"],plugins:["helper"],hasEvents:true,isShared:true},function(){var e={},h=this.getConsole(),b=this.getEventManager(),a=this.getSharedModule("pageElements"),c=this.getPlugin("helper"),f=null,g={};
f=$(a.loadingText);
g.ajax={name:"ajax",enabled:true,el:a.loadingMask};
g.analysis={name:"analysis",enabled:true,el:a.chartLoadingMask};
g["default"]=g.ajax;
$(a.loadingMask).click(function(){d("ajax")
});
$(a.chartLoadingMask).click(function(){d("analysis")
});
function i(l){var k=g[l||"default"]||null;
if(k&&k.enabled){$(k.el).hide();
$(k.el).show()
}}function d(l){var k=g[l||"default"]||null;
if(k){$(k.el).css("display","none")
}}function j(k){f.html(k)
}e.show=i;
e.hide=d;
e.updateAnalysisText=j;
return e
});
WebAppLoader.addModule({name:"localizationManager",isShared:true},function(a){var e={},f=this.getConsole(),d=require("language");
e.sayHello=function(){f.log(d.hello)
};
function b(h){var g=d[h]||"";
return g
}function c(){return d
}e.get=b;
e.getLanguage=c;
return e
});
WebAppLoader.addModule({name:"localStorageManager",sharedModules:[],plugins:["helper"],hasEvents:true,isShared:true},function(){var i={},j=this.getConsole(),d=this.getEventManager(),g=this.getPlugin("helper"),l="Revolution";
function f(o,p){var q=null;
if(o&&(typeof o==="string")){q=(p||l)+g.capitaliseFirstLetter(o)
}return q
}function n(o,p){localStorage.setItem(o,p);
j.log("Local Storage Manager - setItem:",o,p)
}function e(o){return localStorage.getItem(o)
}function h(p,r){var q=f(p,r),s=e(q),t=null;
if(s){if(g.startsWith(s,'{"')){try{t=JSON.parse(s)
}catch(o){j.log("Local Storage Manager - failed to parse stored item:",key,t)
}}else{t=s
}}return t
}function m(o,p,r){var q=f(o,r),s="";
if(q&&g.hasValue(p)){s=(typeof p==="object")?JSON.stringify(p):p;
n(q,s)
}else{j.log("Local Storage Manager - cannot save item.",o,p)
}}function k(o,q){var p=f(o,q);
if(p){localStorage.removeItem(p);
j.log("Local Storage Manager - removed item.",p)
}}function c(){j.log("count()",localStorage.length)
}function a(){localStorage.clear();
j.log("clearAll()")
}function b(p){for(var o in localStorage){if(g.startsWith(o,p)){localStorage.removeItem(o)
}}}i.load=h;
i.save=m;
i.remove=k;
i.count=c;
i.clearAll=a;
i.clearUserSettings=b;
return i
});
WebAppLoader.addModule({name:"pageElements",isShared:true},function(){var a={};
a={blankPage:"#blank_page",dashboardPage:"#dashboard",homePage:"#home",portfoliosPage:"#portfolios",portfolioAnalysisPage:"#portfolioAnalysis",analysisPage:"#analysis",eulaPage:"#eula",settingsPage:"#settings",loginPage:"#login",startupPage:"#startup",chartSettingsPage:"#chartSettings",themesPage:"#themes",languageSettingsPages:"#languageSettings",errorPage:"#error",portfolioAnalysisLink:".defaultAnalysisLink",toolbar:".toolbar",loginButton:"#loginButton",loginErrorText:"#loginErrorText",loadingMask:"#myloading",chartLoadingMask:"#myLoadingCharts",userNameTextbox:"#userNameTextbox",passwordTextbox:"#passwordTextbox",tabbar:"nav#tabbar",listAnalysisSettingsDefaultPages:"#listAnalysisSettingsDefaultPages",listAnalysisSettingsUserPages:"#listAnalysisSettingsUserPages",chartsSelectbox:"#chartsSelectbox",analysisPageNameTextbox:"#analysisPageNameTextbox",saveChartSettings:"#saveChartSettings",addNewAnalysisPage:"#addNewAnalysisPage",analysisTitle:"#analysisTitle",loadingText:"#loadingText",listLanguagesPages:"#listLanguagesPages",timePeriodStartDateText:"#timePeriodStartDateText",timePeriodEndDateText:"#timePeriodEndDateText",errorMessageText:"#errorMessageText",stayLoggedCheckbox:"#stayLoggedCheckbox",userEmailLabel:"#userEmailLabel",summaryTitleName:"#summaryTitleName",summaryTitleBenchmarkName:"#summaryTitleBenchmarkName",resetCurrentSettingsButton:"#resetCurrentSettingsButton",resetAllSettingsButton:"#resetAllSettingsButton",reloadAppButton:"#reloadAppButton"};
return a
});
WebAppLoader.addModule({name:"settings",dataObjects:["appSettings","userSettings"],isShared:true},function(){var h={},a={},i={},f=[],g=this.getConsole(),j=this.getDataObject("userSettings"),b=this.getDataObject("appSettings");
j.define({automaticLogin:false,username:"asa.fama@statpro.com",password:"StatPro123",language:"en-US",lastUsedLanguage:"none"});
b.define({lastLoggedOnUser:"asa.fama@statpro.com"});
a={loadPortfoliosSlotDataOnce:true};
i={portfolios:"/portfolios",authenticate:"/authenticate",index:"/index",portfolioAnalysis:"/portfolioAnalysis",analysis:"/analysis",segmentsTreeNode:"/segmentsTreeNode",timeSeries:"/timeSeries",eula:"/eula"};
f=[{id:"en-US",value:"en-US",name:"English"},{id:"it-IT",value:"it-IT",name:"Italiano"}];
function c(k,l){a[k]=l;
g.log("change setting")
}function d(k){return a[k]
}function e(){return"1.0"
}h.changeSetting=c;
h.set=c;
h.get=d;
h.getVersion=e;
h.appSettings=a;
h.siteUrls=i;
h.languages=f;
return h
});
WebAppLoader.addModule({name:"analysisManager",plugins:["helper"],sharedModules:[],dataObjects:["analysisPages"],hasEvents:true},function(){var a={},i=this.getConsole(),f=this.getEventManager(),g=this.getPlugin("helper"),c=this.getDataObject("analysisPages"),e=[],b={};
c.define({items:[{name:"Performance",id:"performance",order:1,userDefined:false,charts:[{chartId:"performance_line",order:1},{chartId:"performance_grid",order:2},{chartId:"performance_bubble",order:3},{chartId:"performance_bar",order:4},{chartId:"performance_treemap",order:5},{chartId:"performanceTopTen_grid",order:6}]},{name:"Risk",id:"risk",order:2,userDefined:false,charts:[{chartId:"risk_treemap",order:1},{chartId:"risk_bar",order:2},{chartId:"risk_bubble",order:3},{chartId:"risk_pie",order:4},{chartId:"riskTopTen_grid",order:5}]},{name:"Asset Allocation",id:"assetAllocation",order:3,userDefined:false,charts:[{chartId:"allocation_pie",order:1},{chartId:"allocation_bar",order:2}]},{name:"Contribution",id:"contribution",order:4,userDefined:false,charts:[{chartId:"contribution_pie",order:1},{chartId:"contribution_column",order:2},{chartId:"contribution_bar",order:3},{chartId:"contributionTopTen_grid",order:4}]},{name:"Attribution",id:"attribution",order:5,userDefined:false,charts:[{chartId:"attribution_column",order:1},{chartId:"attribution_bar",order:2},{chartId:"attribution_grid",order:3}]},{name:"Fixed Income",id:"fixedIncome",order:6,userDefined:false,charts:[{title:"Bar Charts of Fixed Income Contributions:",chartId:"",order:1},{chartId:"fixedIncomeContribution_bar",order:2},{chartId:"carryContribution_bar",order:3},{chartId:"yieldCurveContribution_bar",order:4},{chartId:"riskNumbers_bar",order:5},{title:"Column Charts of Fixed Income Exposures:",chartId:"",order:6},{chartId:"interestRatesExposure_column",order:7},{chartId:"creditSpreadsExposure_column",order:8},{chartId:"dv01Exposure_column",order:9},{title:"Grid of Risk Numbers:",chartId:"",order:10},{chartId:"fixedIncome_grid",order:11},{chartId:"fixedIncomeContribution_grid",order:12},{title:"Grid of FI Exposure",chartId:"",order:13},{chartId:"fixedIncomeExposure_grid",order:14}]},{name:"User Defined Test Page",id:"test1",order:100,userDefined:true,charts:[{chartId:"fi_contribution_group",order:1}]}]});
function j(){b=c.getData()
}function d(){f.raiseEvent("onUpdated",c.getData())
}function h(k){var l;
if(k){c.loadData(k)
}d()
}a.init=h;
a.update=h;
return a
});
WebAppLoader.addModule({name:"auth",plugins:["base64"],sharedModules:["ajaxManager"],hasEvents:true},function(){var b={},h=this.getConsole(),e=this.getEventManager(),c=this.getPlugin("base64"),a=this.getSharedModule("ajaxManager"),g="";
function d(m,i,l){var j,k;
g="";
k=c.encode(m+":"+i);
j="Basic "+k;
a.post(l,{email:m,token:j},function(n){if(n.authenticated){g=k;
e.raiseEvent("onLoginSuccess",j)
}else{e.raiseEvent("onLoginFailed",n.message)
}},"json")
}function f(){return g
}b.doLogin=d;
b.getHash=f;
return b
});
WebAppLoader.addModule({name:"favouritesManager",plugins:["helper"],sharedModules:[],dataObjects:["favourites"],hasEvents:true},function(){var f={},l=this.getConsole(),b=this.getEventManager(),j=this.getPlugin("helper"),e=this.getDataObject("favourites"),d={};
e.define({items:[]});
function a(m){var o=null,n=m;
if(n.portfolioId&&n.analysisId&&n.timePeriodId){o=n.portfolioId+n.analysisId+n.timePeriodId
}return o
}function i(m){var n={};
n.title=m.portfolioName+" - "+m.analysisName+" - "+m.timePeriodName;
n.favouriteId=m.portfolioId+m.analysisId+m.timePeriodId;
n.portfolioId=m.portfolioId;
n.analysisId=m.analysisId;
n.timePeriodId=m.timePeriodId;
return n
}function h(o){var p=e.getData(),m=null,n={};
for(var q=0;
q<p.items.length;
q++){n=p.items[q];
if(n.favouriteId===o){m={};
m.portfolioId=n.portfolioId;
m.analysisId=n.analysisId;
m.timePeriodId=n.timePeriodId;
return m
}}return m
}function c(m){var n=e.getData()
}function g(){b.raiseEvent("onFavouritesUpdated",e.getData())
}function k(n){var m;
if(n){e.loadData(n)
}g()
}f.init=k;
f.update=k;
f.createIdFromAnalysisDataObject=a;
f.getFavourteFromAnalysisDataObject=i;
f.favouriteExists=c;
f.getAnalysisDataObjectFromFavourte=h;
return f
});
WebAppLoader.addModule({name:"nav",hasEvents:true},function(){var c={},a=this.getEventManager();
function d(f){window.location=f
}function b(g,f){jQT.goTo($(g),f||"fade")
}function e(f){var g=f||"";
window.location="./"+g;
return false
}c.goToPage=b;
c.reloadApp=e;
return c
});
WebAppLoader.addModule({name:"pageEventsManager",plugins:["helper"],sharedModules:["pageElements","loadingMaskManager"],hasEvents:true},function(){var h={},b=this.getEventManager(),g=this.getConsole(),c=this.getPlugin("helper"),a=this.getSharedModule("pageElements"),d=this.getSharedModule("loadingMaskManager");
$("div[data-pageEvents]").each(function(){var i="";
switch($(this).attr("data-pageEvents")){case"start":$(this).on("pageAnimationStart",function(j,k){if(k.direction==="in"){b.raiseEvent("on"+c.capitaliseFirstLetter(this.id)+"Start")
}});
break;
case"end":$(this).on("pageAnimationEnd",function(j,k){if(k.direction==="in"){b.raiseEvent("on"+c.capitaliseFirstLetter(this.id)+"End")
}});
break;
case"both":$(this).on("pageAnimationStart",function(j,k){if(k.direction==="in"){b.raiseEvent("on"+c.capitaliseFirstLetter(this.id)+"Start")
}});
$(this).on("pageAnimationEnd",function(j,k){if(k.direction==="in"){b.raiseEvent("on"+c.capitaliseFirstLetter(this.id)+"End")
}});
break;
case"none":break;
default:}});
$(document).on("ajaxStart",f);
$(document).on("ajaxComplete",e);
function f(i,j,k){d.show("ajax");
g.log("ajaxStart",i,j,k)
}function e(j,l,m){d.hide("ajax");
var k={};
try{k=JSON.parse(l.response)
}catch(i){}g.log("ajaxComplete",j,l,m,k)
}return h
});
WebAppLoader.addModule({name:"portfolioManager",plugins:[],sharedModules:["settings","ajaxManager","localizationManager"],dataObjects:["portfolio"],hasEvents:true},function(){var k={},i=this.getConsole(),b=this.getEventManager(),l=this.getSharedModule("settings"),j=this.getDataObject("portfolio"),d=this.getSharedModule("localizationManager").getLanguage()||{},a=this.getSharedModule("ajaxManager"),e="",f={};
j.define({code:"",name:"",type:"",analysisLink:"",currency:"",version:"",timeStamp:"",timePeriods:[]});
function h(p,m){function n(){m(f)
}function o(q){c(q,n)
}g(p,o)
}function g(u,m){var n,t={code:"",type:"",analysisLink:"",currency:"",version:"",timeStamp:"",timePeriods:[]};
function o(){if(u){return u
}else{return""
}}e=t.code=o();
q(s);
function q(v){var x={},w=null;
if(t.code){x.filter="Code eq '"+t.code+"'"
}else{x.start=0;
x.top=1
}a.post(l.siteUrls.portfolios,{oData:x,datatype:"json"},function(y){if(!y||!y.items||y.items.length<1){b.raiseEvent("onFailed",d.errors.portfolioNotFoundText);
return
}t.code=y.items[0].code;
w=y.items[0].links.defaultAnalysis.href;
v({defaultAnalysisLink:w})
},"json")
}function s(v){if(v.defaultAnalysisLink){t.analysisLink=v.defaultAnalysisLink;
p(v.defaultAnalysisLink,r)
}}function p(w,v){a.post(l.siteUrls.portfolioAnalysis,{uri:w,datatype:"json"},function(x){if(!x||!x.analysis){b.raiseEvent("onFailed",d.errors.analysisFailedText);
return
}t.name=x.name||"";
t.type=x.type||"";
t.currency=x.analysis.currency||"";
t.version=x.analysis.version||"";
if(x.analysis.results){t.timeStamp=x.analysis.results.timeStamp||"";
t.timePeriods=x.analysis.results.timePeriods||[]
}v()
},"json")
}function r(){j.setData(t);
f=t;
b.raiseEvent("onPortfolioLoaded",t);
b.raiseEvent("onTimePeriodsLoaded",t.timePeriods);
m(t.analysisLink)
}}function c(n,m){a.post(l.siteUrls.analysis,{uri:n,datatype:"json"},function(o){if(!o){b.raiseEvent("onFailed",d.errors.analysisFailedText);
return
}b.raiseEvent("onAnalysisLoaded",o);
m()
},"json")
}k.loadPortfolio=g;
k.getAnalysis=c;
k.loadPortfolioAnalysis=h;
return k
});
WebAppLoader.addModule({name:"repositories",sharedModules:["settings","localizationManager","ajaxManager"],hasEvents:true},function(){var e={},b=this.getEventManager(),d=this.getConsole(),f=this.getSharedModule("settings"),a=this.getSharedModule("ajaxManager"),c=this.getSharedModule("localizationManager").getLanguage()||{};
e.portfoliosSlot=(function(){var k={},j=null;
b.init(this);
function h(){return j
}function l(m){j=m;
b.raiseEvent("onItemsChanged",m)
}function i(m){var n={};
a.post(f.siteUrls.portfolios,{datatype:"json"},function(o){if(o){$.each(o.items,function(p,q){n[q.code]=q.name
})
}else{n.err=c.spinningWheel.noPortfolioSlotAvailable
}l(n);
m(n)
},"json")
}function g(m){if(f.appSettings.loadPortfoliosSlotDataOnce){if(!h()){i(function(n){m(n)
})
}else{m(h())
}}else{i(function(n){m(n)
})
}}k.getData=g;
k.on=on;
return k
})();
e.analysisSlot=(function(){var j={},g=null;
b.init(this);
function h(){return g;
return(g)?g:{err:c.spinningWheel.noAnalysisSlotAvailable}
}function k(m){g=m;
b.raiseEvent("onItemsChanged",m)
}function l(m){var n={};
$.each(m,function(o,p){n[p.code]=p.name
});
k(n)
}function i(m){var n=h();
m(n)
}j.getData=i;
j.setData=l;
j.on=on;
return j
})();
e.timePeriodsSlot=(function(){var i={},l=null;
b.init(this);
function h(){return(l)?l:{err:c.spinningWheel.noTimePeriodSlotAvailable}
}function k(m){l=m;
b.raiseEvent("onItemsChanged",m)
}function j(n){var m=null;
if(n&&n.length>0){m={};
$.each(n,function(o,p){m[p.code]=p.name
})
}k(m)
}function g(m){var n=h();
m(n)
}i.getData=g;
i.setData=j;
i.on=on;
return i
})();
e.favouritesSlot=(function(){var j={},g=null;
b.init(this);
function i(){return(g)?g:{err:c.spinningWheel.noFavouritesSlotAvailable}
}function l(m){g=m;
b.raiseEvent("onItemsChanged",m)
}function k(m){var n=null;
if(m&&m.length>0){n={};
$.each(m,function(o,p){n[p.code]=p.name
})
}l(n)
}function h(m){var n=i();
m(n)
}j.getData=h;
j.setData=k;
j.on=on;
return j
})();
return e
});
WebAppLoader.addModule({name:"test",plugins:["base64"],sharedModules:["settings","localizationManager"]},function(a){var g={},d=this.getConsole(),f=this.getSharedModule("settings"),c=this.getSharedModule("localizationManager"),b=Date.now();
function e(){d.log("sayHello at "+b)
}g.sayHello=e;
return g
});
WebAppLoader.addModule({name:"themesManager",plugins:["helper"],sharedModules:["pageElements"],dataObjects:["theme"],hasEvents:true},function(){var i={},c=this.getEventManager(),f=this.getConsole(),d=this.getPlugin("helper"),b=this.getSharedModule("pageElements"),h=this.getDataObject("theme"),a="Awesome";
h.define({name:a});
$(b.themesPage+" ul li a").on("click",e);
function e(j){var k=$(this).attr("data-title")||null;
c.raiseEvent("onThemeChanged",k)
}function g(k){var j=null;
if(typeof k==="object"&&k.name){j=k.name
}else{j=k
}jQT.switchStyle(j||a)
}i.switchStyle=g;
return i
});
WebAppLoader.addModule({name:"analysisSettingsPage",plugins:["helper"],sharedModules:["settings","pageElements","localizationManager"],hasEvents:true},function(){var a={},i=this.getConsole(),d=this.getEventManager(),e=this.getPlugin("helper"),j=this.getSharedModule("settings"),f=this.getSharedModule("localizationManager").getLanguage()||{},c=this.getSharedModule("pageElements");
function g(){var k=$(this).data("link");
if(k){d.raiseEvent("onClick",k)
}return false
}function h(){var k=e.createUUID();
d.raiseEvent("onClick",k);
return false
}function b(l){var k,o,q,p,m;
$(c.listAnalysisSettingsUserPages).html("");
$(c.listAnalysisSettingsDefaultPages).html("");
for(var n=0;
n<l.length;
n++){k=l[n];
q=k.name;
p=k.id;
o=k.userDefined;
m=(o)?c.listAnalysisSettingsUserPages:c.listAnalysisSettingsDefaultPages;
if(o){$(m).append($("<li>").attr("class","arrow").append($("<a>").attr({href:"#","data-link":p,"data-swipe":true}).html(q).on("click",g)))
}else{$(m).append($("<li>").attr("class","").append($("<a>").attr({href:"#","data-link":p}).html(q)))
}}$(m).append($("<li>").attr("class","arrow").append($("<a>").attr({href:"#","data-link":p}).html(f.chartTexts.addNewPage).on("click",h)));
d.raiseEvent("onPageLoaded")
}a.create=b;
return a
});
WebAppLoader.addModule({name:"chartSettingsPage",plugins:["helper"],sharedModules:["settings","pageElements","localizationManager"],hasEvents:true},function(){var b={},i=this.getConsole(),e=this.getEventManager(),g=this.getPlugin("helper"),h=this.getSharedModule("localizationManager").getLanguage()||{},j=this.getSharedModule("settings"),d=this.getSharedModule("pageElements"),a="";
function c(l){var m;
for(var n=0;
n<l.length;
n++){m="("+h.chartTypes[l[n].chartType]+") ";
$(d.chartsSelectbox).append($("<option>").attr("value",l[n].chartId).html(m+l[n].chartTitle))
}}function k(l){$(d.chartsSelectbox).children("option:selected").removeAttr("selected");
$(d.chartsSelectbox).attr("selectedIndex","-1");
for(var m=0;
m<l.charts.length;
m++){$(d.chartsSelectbox+' [value="'+l.charts[m].chartId+'"]').attr("selected","selected")
}$(d.analysisPageNameTextbox).val(l.name);
a=l.id
}function f(){var m={name:"",id:"",order:new Date().getTime(),userDefined:true,charts:[]},l=1;
m.name=$(d.analysisPageNameTextbox).val();
m.id=a;
$(d.chartsSelectbox).children("option:selected").each(function(n){m.charts.push({chartId:$(this).val(),order:l});
l+=1
});
return m
}$(d.saveChartSettings).on("click",function(){e.raiseEvent("onSettingsChanged",f())
});
b.create=c;
b.update=k;
b.getSettings=f;
return b
});
WebAppLoader.addModule({name:"languageSettingsPage",plugins:["helper"],sharedModules:["settings","pageElements"],hasEvents:true},function(){var g={},i=this.getConsole(),c=this.getEventManager(),d=this.getPlugin("helper"),f=this.getSharedModule("settings").languages,b=this.getSharedModule("pageElements"),e=false;
function h(){var j=JSON.parse($(this).data("link"));
if(j){c.raiseEvent("onLanguageSelected",j)
}return false
}function a(){for(var j=0;
j<f.length;
j++){$(b.listLanguagesPages).append($("<li>").attr("class","forward").append($("<a>").attr({href:"#","data-link":JSON.stringify(f[j])}).html(f[j].name).on("click",h)))
}}g.create=a;
return g
});
var jQT=new $.jQTouch({addGlossToIcon:true,themeSelectionSelector:"#jqt #themes ul",useFastTouch:true,statusBar:"default",hoverDelay:10,pressDelay:10,preloadImages:["images/sw-slot-border.png","images/sw-alpha.png","images/sw-button-cancel.png","images/sw-button-done.png","images/sw-header.png"]});
Zepto(function(a){var k={},f=WebAppLoader,g=f.getConsole(),c=f.getEventManager(),d=f.loadModule("helper"),h=f.getSharedModule("settings").siteUrls,b=f.getSharedModule("pageElements"),e=f.getSharedModule("localizationManager").getLanguage()||{};
g.log("Hello from Dan & Asa!");
k.lastUsernameUsed="";
k.lastPasswordUsed="";
k.lastFavouriteSelected="";
k.lastAnalysisObjectUsed={portfolioId:"",portfolioName:"",analysisId:"performance",analysisName:"Performance",timePeriodId:"Earliest",timePeriodName:"Earliest",chartId:"performance_bar",timeStamp:""};
k.repositories=f.loadModule("repositories");
k.scroll=f.loadModule("scroll");
k.nav=f.loadModule("nav");
k.mask=f.loadModule("loadingMaskManager");
k.settings=f.loadModule("settings");
k.swipeView=f.loadModule("swipeView");
k.analysisSettingsPage=f.loadModule("analysisSettingsPage");
k.chartSettingsPage=f.loadModule("chartSettingsPage");
k.chartComponents=f.loadModule("chartComponents");
k.ajaxManager=f.loadModule("ajaxManager");
k.swipeButton=f.loadModule("swipeButton");
k.getLastAnalysisObjectUsed=function(){return k.lastAnalysisObjectUsed
};
k.setLastAnalysisObjectUsed=function(m){for(var n in m){if(k.lastAnalysisObjectUsed.hasOwnProperty(n)){k.lastAnalysisObjectUsed[n]=m[n]
}}};
k.tryToChangeLanguage=function(n){var m=d.getURLParameter("lang")||"en-US";
if(n&&m&&(n.toLowerCase()!==m.toLowerCase())){k.nav.reloadApp("?lang="+n)
}};
k.startHere=function(){var m=k.settings.loadData("appSettings"),r={},o="",n="",q="",p="";
o=(m&&m.lastLoggedOnUser)?m.lastLoggedOnUser.toLowerCase():null;
if(o){k.settings.loadData("userSettings",o);
r=k.settings.getData("userSettings");
q=r.username||"";
p=r.password||"";
n=r.language||"";
if(q!==""){k.tryToChangeLanguage(n)
}Date.CultureInfo=e.cultureInfo;
if(r.automaticLogin){if(q&&p){k.doLogin(q,p)
}else{k.goToLoginPage(q||o)
}}else{k.goToLoginPage(q||o)
}}else{k.goToLoginPage()
}};
k.doLogin=function(n,m){k.lastUsernameUsed=n.toLowerCase();
k.lastPasswordUsed=m;
k.auth.doLogin(n,m,h.authenticate)
};
k.goToLoginPage=function(m){k.tabbar.hide();
a(b.userNameTextbox).val(m||"");
setTimeout(function(){k.nav.goToPage(a(b.loginPage),"dissolve")
},1000)
};
k.init=function(){var q="",o=false,m={};
k.nav.goToPage(a(b.startupPage),"dissolve");
k.tabbar.show();
var n=k.settings.loadData("appSettings"),s=k.settings.loadData("userSettings",k.lastUsernameUsed);
q=(n&&n.lastLoggedOnUser)?n.lastLoggedOnUser.toLowerCase():null;
n.lastLoggedOnUser=k.lastUsernameUsed;
k.settings.saveData("appSettings");
s.username=k.lastUsernameUsed;
s.password=k.lastPasswordUsed;
k.settings.saveData("userSettings",k.lastUsernameUsed);
o=d.getValueAs(s.automaticLogin,"boolean");
var r=k.themesManager.loadData("theme",k.lastUsernameUsed);
k.themesManager.switchStyle(r);
var p=s.lastAnalysisObjectUsed||null;
k.updateSettingsPage({email:k.lastUsernameUsed,automaticLogin:o});
k.analysisManager.update(k.lastUsernameUsed);
k.favouritesManager.update(k.lastUsernameUsed);
k.updateAnalysisPage(p)
};
k.updateAnalysisPage=function(n){var m=n||k.getLastAnalysisObjectUsed();
k.tabbar.getButton("settings").setHighlight(false);
k.nav.goToPage(a(b.analysisPage),"dissolve");
k.mask.show("analysis");
function p(w){var u=[],s={},q={},x=w.code,y=w.name,r=null,t="",v;
s=k.analysisManager.getData("analysisPages");
q=jLinq.from(s.items).equals("id",m.analysisId).select();
if(q[0]&&q[0].charts){r=q[0].charts;
t=q[0].name
}else{r=s.items[0].charts;
t=s.items[0].name
}u=jLinq.from(r).sort("order").select();
a(b.analysisTitle).html(t);
a.each(u,function(A,z){z.timePeriodId=m.timePeriodId
});
a.each(w.timePeriods,function(A,B){var C,z;
if(B.code===m.timePeriodId){C=Date.parse(B.startDate);
z=Date.parse(B.endDate);
a(b.timePeriodStartDateText).html(C.toString("MMM d, yyyy"));
a(b.timePeriodEndDateText).html(z.toString("MMM d, yyyy"));
return false
}});
k.setLastAnalysisObjectUsed(m);
k.setLastAnalysisObjectUsed({portfolioId:x,portfolioName:y});
k.tabbar.getButton("settings").setHighlight(false);
k.saveLastAnalysisObjectUsed();
k.synchronizeFavouriteButton();
k.chartComponents.render(u,"#analysis_partial")
}function o(q){p(q)
}k.portfolioManager.loadPortfolioAnalysis(m.portfolioId,o)
};
k.saveLastAnalysisObjectUsed=function(){var m=k.settings.loadData("userSettings",k.lastUsernameUsed);
m.lastAnalysisObjectUsed=k.getLastAnalysisObjectUsed();
k.settings.saveData("userSettings",k.lastUsernameUsed)
};
k.chartComponents.on("onAllChartsLoaded",function(){k.scroll.rebuild("analysis");
k.mask.updateAnalysisText(" ");
k.mask.hide("analysis")
});
k.chartComponents.on("onChartsLoading",function(m,n){k.mask.updateAnalysisText("Loading "+m+" of "+n)
});
k.showAnalysisSettingsPage=function(){var n={},m;
n=k.analysisManager.getData("analysisPages");
m=jLinq.from(n.items).sort("order","userDefined").select(function(o){return{name:o.name,id:o.id,userDefined:o.userDefined}
});
k.analysisSettingsPage.create(m)
};
k.analysisSettingsPage.on("onClick",function(m){k.nav.goToPage(b.chartSettingsPage,"slideup");
k.showChartSettingsPage(m)
});
k.analysisSettingsPage.on("onPageLoaded",function(){k.swipeButton.addTo("#listAnalysisSettingsUserPages","Delete",k.onUserPageDeleted,true)
});
k.onUserPageDeleted=function(m){var o=m.parent().parent().data("link")||null,n;
n=k.analysisManager.getData("analysisPages");
if(d.removeObjectFromArray(n.items,"id",o)){k.analysisManager.saveData("analysisPages",k.lastUsernameUsed);
k.updateAnalysisSlot(n)
}};
k.showChartSettingsPage=function(m){var o={},q={},n={},r=k.showChartSettingsPage.charts;
if(!m){return
}o=k.analysisManager.getData("analysisPages");
q=k.chartComponents.getData("charts");
n=jLinq.from(o.items).equals("id",m).select(function(s){return{name:s.name,id:s.id,charts:s.charts}
})[0]||null;
if(!n){n={name:"",id:m,charts:[]}
}if(r.length===0){for(var p in q){r.push({chartId:q[p].chartId,chartType:q[p].chartType,chartTitle:q[p].title})
}k.chartSettingsPage.create(r)
}k.chartSettingsPage.update(n)
};
k.chartSettingsPage.on("onSettingsChanged",function(o){var m,n;
o.name=o.name||"Untitled";
n=k.analysisManager.getData("analysisPages");
m=jLinq.from(n.items).equals("id",o.id).select()[0]||null;
if(m){a.extend(m,o)
}else{n.items.push(o)
}k.analysisManager.saveData("analysisPages",k.lastUsernameUsed);
k.updateAnalysisSlot(n);
k.setLastAnalysisObjectUsed({analysisId:o.id,analysisName:o.name});
k.updateAnalysisPage()
});
k.showChartSettingsPage.charts=[];
k.updateSettingsPage=function(o){var n=o.email||null,m=o.automaticLogin||false;
if(n){a(b.userEmailLabel).html(k.lastUsernameUsed)
}if(m){a(b.stayLoggedCheckbox).attr("checked",true)
}else{a(b.stayLoggedCheckbox).removeAttr("checked")
}};
k.languageSettingsPage=f.loadModule("languageSettingsPage");
k.languageSettingsPage.create();
k.languageSettingsPage.on("onLanguageSelected",function(m){var n=k.settings.loadData("userSettings",k.lastUsernameUsed);
n.language=m.value;
k.settings.saveData("userSettings",k.lastUsernameUsed);
g.log("onLanguageSelected",m);
k.nav.reloadApp("?lang="+m.value)
});
k.portfolioManager=f.loadModule("portfolioManager");
k.portfolioManager.on("onPortfolioLoaded",function(m){k.repositories.timePeriodsSlot.setData(m.timePeriods);
g.log("Loaded portfolio:",m)
});
k.portfolioManager.on("onAnalysisLoaded",function(m){k.scroll.rebuild("analysis");
k.updateAnalysisInfo(m);
k.mask.hide("analysis");
k.tabbar.show()
});
k.portfolioManager.on("onFailed",function(m){k.scroll.rebuild("error");
a(b.errorMessageText).html(m);
k.nav.goToPage(a(b.errorPage));
k.mask.hide("analysis")
});
k.updateAnalysisInfo=function(o){var p,n,m;
if(o){if(o.name.indexOf(" ")===-1){a(b.summaryTitleName).attr("style","word-break: break-all;")
}else{a(b.summaryTitleName).attr("style","word-break: normal;")
}a(b.summaryTitleName).html(o.name);
m=a(b.summaryTitleBenchmarkName);
m.html("");
n=o.analysis.benchmarks||[];
for(p=0;
p<n.length;
p++){if(p>0){m.append(", ")
}m.append(n[p].name)
}a(b.analysisPage+"_partial").html("")
}};
var l={toolbarId:"#analysis .toolbar",buttonPrefix:"toolbar_btn",visible:true,items:[{id:"favourite",title:e.tabbar.favourites,btnClass:"favourite"}]};
k.toolbar=f.loadModule("toolbar");
k.toolbar.create(l);
k.toolbar.on("onTap",function(){k.scroll.goUp()
});
k.toolbar.on("onFavouriteTap",function(m){if(m){k.addToFavourites()
}else{k.removeFromFavourites()
}});
var j={tabbarId:b.tabbar,buttonPrefix:"tabbar_btn",visible:false,items:[{id:"favourites",title:e.tabbar.favourites,btnClass:"favourites"},{id:"portfolios",title:e.tabbar.portfolios,btnClass:"portfolios"},{id:"analysis",title:e.tabbar.analysis,btnClass:"analysis"},{id:"timePeriods",title:e.tabbar.timePeriods,btnClass:"timeperiods"},{id:"settings",title:e.tabbar.settings,btnClass:"settings",highlight:true}]};
k.tabbar=f.loadModule("tabbar");
k.tabbar.create(j);
k.tabbar.on("onFavouritesTap",function(){k.spinningWheel.getSlot("favourites").show(k.lastFavouriteSelected)
});
k.tabbar.on("onPortfoliosTap",function(){k.spinningWheel.getSlot("portfolios").show(k.getLastAnalysisObjectUsed().portfolioId)
});
k.tabbar.on("onAnalysisTap",function(){k.spinningWheel.getSlot("analysis").show(k.getLastAnalysisObjectUsed().analysisId)
});
k.tabbar.on("onTimePeriodsTap",function(){k.spinningWheel.getSlot("timePeriods").show(k.getLastAnalysisObjectUsed().timePeriodId)
});
k.tabbar.on("onSettingsTap",function(m){if(m.isHighlighted){k.nav.goToPage(a(b.settingsPage))
}else{k.nav.goToPage(a(b.analysisPage))
}});
var i={items:[{id:"favourites",repository:k.repositories.favouritesSlot},{id:"portfolios",repository:k.repositories.portfoliosSlot},{id:"analysis",repository:k.repositories.analysisSlot},{id:"timePeriods",repository:k.repositories.timePeriodsSlot}]};
k.spinningWheel=f.loadModule("spinningWheel");
k.spinningWheel.create(i);
k.spinningWheel.on("onPortfoliosDone",function(m,n){k.setLastAnalysisObjectUsed({portfolioId:m,portfolioName:n});
k.updateAnalysisPage()
});
k.spinningWheel.on("onAnalysisDone",function(m,n){k.setLastAnalysisObjectUsed({analysisId:m,analysisName:n});
k.updateAnalysisPage()
});
k.spinningWheel.on("onTimePeriodsDone",function(m,n){k.setLastAnalysisObjectUsed({timePeriodId:m,timePeriodName:n});
k.updateAnalysisPage()
});
k.spinningWheel.on("onFavouritesDone",function(n,o){var m=k.favouritesManager.getAnalysisDataObjectFromFavourte(n);
if(m){k.setLastAnalysisObjectUsed(m);
k.updateAnalysisPage()
}});
k.auth=f.loadModule("auth");
a(b.loginButton).on("click",function(){var n,m;
n=a(b.userNameTextbox).val();
m=a(b.passwordTextbox).val();
k.doLogin(n,m)
});
k.auth.on("onLoginSuccess",function(m){k.ajaxManager.setToken(m);
k.init()
});
k.auth.on("onLoginFailed",function(m){a(b.loginErrorText).html(m);
g.log("onLoginFailed response: ",m)
});
k.pageEventsManager=f.loadModule("pageEventsManager");
k.pageEventsManager.on("onStartupStart",function(){g.log("onStartupEnd")
});
k.pageEventsManager.on("onLoginStart",function(){k.tabbar.hide();
g.log("onLoginStart")
});
k.pageEventsManager.on("onHomeStart",function(){g.log("onHomeStart")
});
k.pageEventsManager.on("onHomeEnd",function(){k.tabbar.show();
k.scroll.rebuild("home");
g.log("onHomeEnd")
});
k.pageEventsManager.on("onEulaEnd",function(){a.get(h.eula,function(m){k.scroll.rebuild("eula");
a(b.eulaPage+"_partial").append('<div class="genericContainer">'+d.htmlDecode(m)+"</div>")
});
g.log("onEulaEnd")
});
k.pageEventsManager.on("onAnalysisEnd",function(){k.scroll.rebuild("analysis");
k.tabbar.getButton("settings").setHighlight(false);
g.log("onAnalysisEnd")
});
k.pageEventsManager.on("onSettingsStart",function(){k.scroll.rebuild("settings");
g.log("onSettingsStart")
});
k.pageEventsManager.on("onSettingsEnd",function(){g.log("onSettingsEnd")
});
k.pageEventsManager.on("onAnalysisSettingsEnd",function(){k.scroll.rebuild("analysisSettings");
g.log("onAnalysisSettingsEnd")
});
k.pageEventsManager.on("onAnalysisPagesSettingsStart",function(){k.scroll.rebuild("analysisPagesSettings");
k.showAnalysisSettingsPage();
g.log("onAnalysisPagesSettingsStart")
});
k.pageEventsManager.on("onChartSettingsEnd",function(){setTimeout(function(){a(b.analysisPageNameTextbox).focus()
},200);
g.log("onChartSettingsStart")
});
a(b.reloadAppButton).on("click",function(){k.nav.reloadApp()
});
a(b.resetAllSettingsButton).on("click",function(){k.localStorage.clearAll();
k.nav.reloadApp()
});
a(b.resetCurrentSettingsButton).on("click",function(){k.localStorage.clearUserSettings(k.lastUsernameUsed);
k.nav.goToPage(a(b.settingsPage))
});
a(b.stayLoggedCheckbox).on("click",function(){var m=a(b.stayLoggedCheckbox+":checked").val()?true:false,n=k.settings.loadData("userSettings",k.lastUsernameUsed);
n.automaticLogin=m;
k.settings.saveData("userSettings",k.lastUsernameUsed);
g.log(m)
});
k.analysisManager=f.loadModule("analysisManager");
k.analysisManager.on("onUpdated",function(m){k.updateAnalysisSlot(m)
});
k.updateAnalysisSlot=function(m){var n=jLinq.from(m.items).sort("order").select(function(o){return{name:o.name,code:o.id}
});
k.repositories.analysisSlot.setData(n)
};
k.favouritesManager=f.loadModule("favouritesManager");
k.favouritesManager.on("onFavouritesUpdated",function(m){k.updateFavouritesSlot(m)
});
k.updateFavouritesSlot=function(m){var n=jLinq.from(m.items).sort("order").select(function(o){return{name:o.title,code:o.favouriteId}
});
k.repositories.favouritesSlot.setData(n)
};
k.analysisDataObjectToFavourite=function(m){var n=null;
n=k.favouritesManager.getFavourteFromAnalysisDataObject(m);
return n||null
};
k.favouriteExists=function(m){var n=k.getFavouriteById(m);
return(n&&true)
};
k.getFavouriteById=function(n){var m=null,p=null,o=k.favouritesManager.getData("favourites");
if(!n){m=k.analysisDataObjectToFavourite(k.lastAnalysisObjectUsed);
n=m.favouriteId
}p=jLinq.from(o.items).equals("favouriteId",n).select()[0]||null;
return(p)
};
k.addToFavourites=function(){var n={},m=null;
n=k.analysisDataObjectToFavourite(k.lastAnalysisObjectUsed);
if(n){if(!k.favouriteExists(n.favouriteId)){m=k.favouritesManager.getData("favourites");
m.items.push(n);
k.favouritesManager.saveData("favourites",k.lastUsernameUsed);
k.favouritesManager.update(k.lastUsernameUsed);
k.setLastFavouriteSelected(n.favouriteId)
}}};
k.removeFromFavourites=function(){var n={},m=null;
n=k.analysisDataObjectToFavourite(k.lastAnalysisObjectUsed);
if(n){if(k.favouriteExists(n.favouriteId)){m=k.favouritesManager.getData("favourites");
if(d.removeObjectFromArray(m.items,"favouriteId",n.favouriteId)){k.favouritesManager.saveData("favourites",k.lastUsernameUsed);
k.favouritesManager.update(k.lastUsernameUsed)
}}}};
k.synchronizeFavouriteButton=function(o){var m=k.getFavouriteById(o),n=k.toolbar.getButton("favourite");
if(m&&n){k.setLastFavouriteSelected(m.favouriteId);
n.select()
}else{n.deselect()
}};
k.setLastFavouriteSelected=function(m){k.lastFavouriteSelected=m
};
k.themesManager=f.loadModule("themesManager");
k.themesManager.on("onThemeChanged",function(n){var m=k.themesManager.getData("theme")||null;
if(m){m.name=n;
k.themesManager.saveData("theme",k.lastUsernameUsed)
}g.log("onThemeChanged",n)
});
k.portfoliosList=f.loadModule("portfoliosList");
k.portfoliosList.on("onDataReceived",function(m){a(b.analysisPage+"_partial").html(m)
});
f.unloadModule("repositories");
f.unloadModule("scroll");
f.unloadModule("tabbar");
f.unloadModule("spinningWheel");
k.startHere()
});