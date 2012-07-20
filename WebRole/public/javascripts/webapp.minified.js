(function(a){if(String.prototype.trim===a){String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")
}
}if(Array.prototype.reduce===a){Array.prototype.reduce=function(c){if(this===void 0||this===null){throw new TypeError()
}var f=Object(this),e=f.length>>>0,d=0,b;
if(typeof c!="function"){throw new TypeError()
}if(e==0&&arguments.length==1){throw new TypeError()
}if(arguments.length>=2){b=arguments[1]
}else{do{if(d in f){b=f[d++];
break
}if(++d>=e){throw new TypeError()
}}while(true)
}while(d<e){if(d in f){b=c.call(a,b,f[d],d,f)
}d++
}return b
}
}})();
var Zepto=(function(){var N,C,a,e,p=[],G=p.slice,m=window.document,n={},d={},v=m.defaultView.getComputedStyle,j={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},t=/^\s*<(\w+|!)[^>]*>/,o=[1,3,8,9,11],b=["after","prepend","before","append"],H=m.createElement("table"),I=m.createElement("tr"),i={tr:m.createElement("tbody"),tbody:H,thead:H,tfoot:H,td:I,th:I,"*":m.createElement("div")},F=/complete|loaded|interactive/,g=/^\.([\w-]+)$/,w=/^#([\w-]+)$/,J=/^[\w-]+$/,L=({}).toString,P={},c,O,K=m.createElement("div");
P.matches=function(Q,U){if(!Q||Q.nodeType!==1){return false
}var S=Q.webkitMatchesSelector||Q.mozMatchesSelector||Q.oMatchesSelector||Q.matchesSelector;
if(S){return S.call(Q,U)
}var R,T=Q.parentNode,V=!T;
if(V){(T=K).appendChild(Q)
}R=~P.qsa(T,U).indexOf(Q);
V&&K.removeChild(Q);
return R
};
function z(Q){return L.call(Q)=="[object Function]"
}function A(Q){return Q instanceof Object
}function B(S){var R,Q;
if(L.call(S)!=="[object Object]"){return false
}Q=(z(S.constructor)&&S.constructor.prototype);
if(!Q||!hasOwnProperty.call(Q,"isPrototypeOf")){return false
}for(R in S){}return R===N||hasOwnProperty.call(S,R)
}function y(Q){return Q instanceof Array
}function D(Q){return typeof Q.length=="number"
}function h(Q){return Q.filter(function(R){return R!==N&&R!==null
})
}function s(Q){return Q.length>0?[].concat.apply([],Q):Q
}c=function(Q){return Q.replace(/-+(.)?/g,function(S,R){return R?R.toUpperCase():""
})
};
function k(Q){return Q.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()
}O=function(Q){return Q.filter(function(S,R){return Q.indexOf(S)==R
})
};
function f(Q){return Q in d?d[Q]:(d[Q]=new RegExp("(^|\\s)"+Q+"(\\s|$)"))
}function E(Q,R){return(typeof R=="number"&&!j[k(Q)])?R+"px":R
}function l(S){var R,Q;
if(!n[S]){R=m.createElement(S);
m.body.appendChild(R);
Q=v(R,"").getPropertyValue("display");
R.parentNode.removeChild(R);
Q=="none"&&(Q="block");
n[S]=Q
}return n[S]
}P.fragment=function(R,S){if(S===N){S=t.test(R)&&RegExp.$1
}if(!(S in i)){S="*"
}var Q=i[S];
Q.innerHTML=""+R;
return a.each(G.call(Q.childNodes),function(){Q.removeChild(this)
})
};
P.Z=function(Q,R){Q=Q||[];
Q.__proto__=arguments.callee.prototype;
Q.selector=R||"";
return Q
};
P.isZ=function(Q){return Q instanceof P.Z
};
P.init=function(S,Q){if(!S){return P.Z()
}else{if(z(S)){return a(m).ready(S)
}else{if(P.isZ(S)){return S
}else{var R;
if(y(S)){R=h(S)
}else{if(B(S)){R=[a.extend({},S)],S=null
}else{if(o.indexOf(S.nodeType)>=0||S===window){R=[S],S=null
}else{if(t.test(S)){R=P.fragment(S.trim(),RegExp.$1),S=null
}else{if(Q!==N){return a(Q).find(S)
}else{R=P.qsa(m,S)
}}}}}return P.Z(R,S)
}}}};
a=function(R,Q){return P.init(R,Q)
};
a.extend=function(Q){G.call(arguments,1).forEach(function(R){for(C in R){if(R[C]!==N){Q[C]=R[C]
}}});
return Q
};
P.qsa=function(Q,S){var R;
return(Q===m&&w.test(S))?((R=Q.getElementById(RegExp.$1))?[R]:p):(Q.nodeType!==1&&Q.nodeType!==9)?p:G.call(g.test(S)?Q.getElementsByClassName(RegExp.$1):J.test(S)?Q.getElementsByTagName(S):Q.querySelectorAll(S))
};
function q(Q,R){return R===N?a(Q):a(Q).filter(R)
}function u(R,Q,S,T){return z(Q)?Q.call(R,S,T):Q
}a.isFunction=z;
a.isObject=A;
a.isArray=y;
a.isPlainObject=B;
a.inArray=function(R,Q,S){return p.indexOf.call(Q,R,S)
};
a.trim=function(Q){return Q.trim()
};
a.uuid=0;
a.map=function(R,Q){var U,V=[],S,T;
if(D(R)){for(S=0;
S<R.length;
S++){U=Q(R[S],S);
if(U!=null){V.push(U)
}}}else{for(T in R){U=Q(R[T],T);
if(U!=null){V.push(U)
}}}return s(V)
};
a.each=function(R,Q){var S,T;
if(D(R)){for(S=0;
S<R.length;
S++){if(Q.call(R[S],S,R[S])===false){return R
}}}else{for(T in R){if(Q.call(R[T],T,R[T])===false){return R
}}}return R
};
a.fn={forEach:p.forEach,reduce:p.reduce,push:p.push,indexOf:p.indexOf,concat:p.concat,map:function(Q){return a.map(this,function(R,S){return Q.call(R,S,R)
})
},slice:function(){return a(G.apply(this,arguments))
},ready:function(Q){if(F.test(m.readyState)){Q(a)
}else{m.addEventListener("DOMContentLoaded",function(){Q(a)
},false)
}return this
},get:function(Q){return Q===N?G.call(this):this[Q]
},toArray:function(){return this.get()
},size:function(){return this.length
},remove:function(){return this.each(function(){if(this.parentNode!=null){this.parentNode.removeChild(this)
}})
},each:function(Q){this.forEach(function(R,S){Q.call(R,S,R)
});
return this
},filter:function(Q){return a([].filter.call(this,function(R){return P.matches(R,Q)
}))
},add:function(R,Q){return a(O(this.concat(a(R,Q))))
},is:function(Q){return this.length>0&&P.matches(this[0],Q)
},not:function(S){var R=[];
if(z(S)&&S.call!==N){this.each(function(T){if(!S.call(this,T)){R.push(this)
}})
}else{var Q=typeof S=="string"?this.filter(S):(D(S)&&z(S.item))?G.call(S):a(S);
this.forEach(function(T){if(Q.indexOf(T)<0){R.push(T)
}})
}return a(R)
},eq:function(Q){return Q===-1?this.slice(Q):this.slice(Q,+Q+1)
},first:function(){var Q=this[0];
return Q&&!A(Q)?Q:a(Q)
},last:function(){var Q=this[this.length-1];
return Q&&!A(Q)?Q:a(Q)
},find:function(R){var Q;
if(this.length==1){Q=P.qsa(this[0],R)
}else{Q=this.map(function(){return P.qsa(this,R)
})
}return a(Q)
},closest:function(S,Q){var R=this[0];
while(R&&!P.matches(R,S)){R=R!==Q&&R!==m&&R.parentNode
}return a(R)
},parents:function(S){var Q=[],R=this;
while(R.length>0){R=a.map(R,function(T){if((T=T.parentNode)&&T!==m&&Q.indexOf(T)<0){Q.push(T);
return T
}})
}return q(Q,S)
},parent:function(Q){return q(O(this.pluck("parentNode")),Q)
},children:function(Q){return q(this.map(function(){return G.call(this.children)
}),Q)
},siblings:function(Q){return q(this.map(function(S,R){return G.call(R.parentNode.children).filter(function(T){return T!==R
})
}),Q)
},empty:function(){return this.each(function(){this.innerHTML=""
})
},pluck:function(Q){return this.map(function(){return this[Q]
})
},show:function(){return this.each(function(){this.style.display=="none"&&(this.style.display=null);
if(v(this,"").getPropertyValue("display")=="none"){this.style.display=l(this.nodeName)
}})
},replaceWith:function(Q){return this.before(Q).remove()
},wrap:function(Q){return this.each(function(){a(this).wrapAll(a(Q)[0].cloneNode(false))
})
},wrapAll:function(Q){if(this[0]){a(this[0]).before(Q=a(Q));
Q.append(this)
}return this
},unwrap:function(){this.parent().each(function(){a(this).replaceWith(a(this).children())
});
return this
},clone:function(){return a(this.map(function(){return this.cloneNode(true)
}))
},hide:function(){return this.css("display","none")
},toggle:function(Q){return(Q===N?this.css("display")=="none":Q)?this.show():this.hide()
},prev:function(){return a(this.pluck("previousElementSibling"))
},next:function(){return a(this.pluck("nextElementSibling"))
},html:function(Q){return Q===N?(this.length>0?this[0].innerHTML:null):this.each(function(R){var S=this.innerHTML;
a(this).empty().append(u(this,Q,R,S))
})
},text:function(Q){return Q===N?(this.length>0?this[0].textContent:null):this.each(function(){this.textContent=Q
})
},attr:function(Q,S){var R;
return(typeof Q=="string"&&S===N)?(this.length==0||this[0].nodeType!==1?N:(Q=="value"&&this[0].nodeName=="INPUT")?this.val():(!(R=this[0].getAttribute(Q))&&Q in this[0])?this[0][Q]:R):this.each(function(T){if(this.nodeType!==1){return
}if(A(Q)){for(C in Q){this.setAttribute(C,Q[C])
}}else{this.setAttribute(Q,u(this,S,T,this.getAttribute(Q)))
}})
},removeAttr:function(Q){return this.each(function(){if(this.nodeType===1){this.removeAttribute(Q)
}})
},prop:function(Q,R){return(R===N)?(this[0]?this[0][Q]:N):this.each(function(S){this[Q]=u(this,R,S,this[Q])
})
},data:function(R,S){var Q=this.attr("data-"+k(R),S);
return Q!==null?Q:N
},val:function(Q){return(Q===N)?(this.length>0?this[0].value:N):this.each(function(R){this.value=u(this,Q,R,this.value)
})
},offset:function(){if(this.length==0){return null
}var Q=this[0].getBoundingClientRect();
return{left:Q.left+window.pageXOffset,top:Q.top+window.pageYOffset,width:Q.width,height:Q.height}
},css:function(R,S){if(S===N&&typeof R=="string"){return(this.length==0?N:this[0].style[c(R)]||v(this[0],"").getPropertyValue(R))
}var Q="";
for(C in R){if(typeof R[C]=="string"&&R[C]==""){this.each(function(){this.style.removeProperty(k(C))
})
}else{Q+=k(C)+":"+E(C,R[C])+";"
}}if(typeof R=="string"){if(S==""){this.each(function(){this.style.removeProperty(k(R))
})
}else{Q=k(R)+":"+E(R,S)
}}return this.each(function(){this.style.cssText+=";"+Q
})
},index:function(Q){return Q?this.indexOf(a(Q)[0]):this.parent().children().indexOf(this[0])
},hasClass:function(Q){if(this.length<1){return false
}else{return f(Q).test(this[0].className)
}},addClass:function(Q){return this.each(function(S){e=[];
var R=this.className,T=u(this,Q,S,R);
T.split(/\s+/g).forEach(function(U){if(!a(this).hasClass(U)){e.push(U)
}},this);
e.length&&(this.className+=(R?" ":"")+e.join(" "))
})
},removeClass:function(Q){return this.each(function(R){if(Q===N){return this.className=""
}e=this.className;
u(this,Q,R,e).split(/\s+/g).forEach(function(S){e=e.replace(f(S)," ")
});
this.className=e.trim()
})
},toggleClass:function(Q,R){return this.each(function(S){var T=u(this,Q,S,this.className);
(R===N?!a(this).hasClass(T):R)?a(this).addClass(T):a(this).removeClass(T)
})
}};
["width","height"].forEach(function(Q){a.fn[Q]=function(T){var S,R=Q.replace(/./,function(U){return U[0].toUpperCase()
});
if(T===N){return this[0]==window?window["inner"+R]:this[0]==m?m.documentElement["offset"+R]:(S=this.offset())&&S[Q]
}else{return this.each(function(V){var U=a(this);
U.css(Q,u(this,T,V,U[Q]()))
})
}}
});
function x(R,T,Q){var S=(R%2)?T:T.parentNode;
S?S.insertBefore(Q,!R?T.nextSibling:R==1?S.firstChild:R==2?T:null):a(Q).remove()
}function M(S,Q){Q(S);
for(var R in S.childNodes){M(S.childNodes[R],Q)
}}b.forEach(function(Q,R){a.fn[Q]=function(){var U=a.map(arguments,function(W){return A(W)?W:P.fragment(W)
});
if(U.length<1){return this
}var V=this.length,S=V>1,T=R<2;
return this.each(function(X,Z){for(var W=0;
W<U.length;
W++){var Y=U[T?U.length-W-1:W];
M(Y,function(aa){if(aa.nodeName!=null&&aa.nodeName.toUpperCase()==="SCRIPT"&&(!aa.type||aa.type==="text/javascript")){window["eval"].call(window,aa.innerHTML)
}});
if(S&&X<V-1){Y=Y.cloneNode(true)
}x(R,Z,Y)
}})
};
a.fn[(R%2)?Q+"To":"insert"+(R?"Before":"After")]=function(S){a(S)[Q](this);
return this
}
});
P.Z.prototype=a.fn;
P.camelize=c;
P.uniq=O;
a.zepto=P;
return a
})();
window.Zepto=Zepto;
"$" in window||(window.$=Zepto);
(function(a){var b=a.zepto.qsa,j={},c=1,p={};
p.click=p.mousedown=p.mouseup=p.mousemove="MouseEvents";
function q(s){return s._zid||(s._zid=c++)
}function h(s,t,u,w){t=l(t);
if(t.ns){var v=k(t.ns)
}return(j[q(s)]||[]).filter(function(x){return x&&(!t.e||x.e==t.e)&&(!t.ns||v.test(x.ns))&&(!u||q(x.fn)===q(u))&&(!w||x.sel==w)
})
}function l(s){var t=(""+s).split(".");
return{e:t[0],ns:t.slice(1).sort().join(" ")}
}function k(s){return new RegExp("(?:^| )"+s.replace(" "," .* ?")+"(?: |$)")
}function f(s,t,u){if(a.isObject(s)){a.each(s,u)
}else{s.split(/\s/).forEach(function(v){u(v,t)
})
}}function d(t,u,v,y,w,s){s=!!s;
var x=q(t),z=(j[x]||(j[x]=[]));
f(u,v,function(C,D){var B=w&&w(D,C),A=B||D;
var F=function(G){var H=A.apply(t,[G].concat(G.data));
if(H===false){G.preventDefault()
}return H
};
var E=a.extend(l(C),{fn:D,proxy:F,sel:y,del:B,i:z.length});
z.push(E);
t.addEventListener(E.e,F,s)
})
}function m(s,t,u,w){var v=q(s);
f(t||"",u,function(x,y){h(s,x,y,w).forEach(function(z){delete j[v][z.i];
s.removeEventListener(z.e,z.proxy,false)
})
})
}a.event={add:d,remove:m};
a.proxy=function(t,s){if(a.isFunction(t)){var u=function(){return t.apply(s,arguments)
};
u._zid=q(t);
return u
}else{if(typeof s=="string"){return a.proxy(t[s],t)
}else{throw new TypeError("expected function")
}}};
a.fn.bind=function(t,s){return this.each(function(){d(this,t,s)
})
};
a.fn.unbind=function(t,s){return this.each(function(){m(this,t,s)
})
};
a.fn.one=function(t,s){return this.each(function(v,u){d(this,t,s,null,function(w,x){return function(){var y=w.apply(u,arguments);
m(u,x,w);
return y
}
})
})
};
var o=function(){return true
},n=function(){return false
},g={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};
function e(s){var t=a.extend({originalEvent:s},s);
a.each(g,function(u,v){t[u]=function(){this[v]=o;
return s[u].apply(s,arguments)
};
t[v]=n
});
return t
}function i(s){if(!("defaultPrevented" in s)){s.defaultPrevented=false;
var t=s.preventDefault;
s.preventDefault=function(){this.defaultPrevented=true;
t.call(this)
}
}}a.fn.delegate=function(v,u,s){var t=false;
if(u=="blur"||u=="focus"){if(a.iswebkit){u=u=="blur"?"focusout":u=="focus"?"focusin":u
}else{t=true
}}return this.each(function(x,w){d(w,u,s,v,function(y){return function(z){var A,B=a(z.target).closest(v,w).get(0);
if(B){A=a.extend(e(z),{currentTarget:B,liveFired:w});
return y.apply(B,[A].concat([].slice.call(arguments,1)))
}}
},t)
})
};
a.fn.undelegate=function(u,t,s){return this.each(function(){m(this,t,s,u)
})
};
a.fn.live=function(t,s){a(document.body).delegate(this.selector,t,s);
return this
};
a.fn.die=function(t,s){a(document.body).undelegate(this.selector,t,s);
return this
};
a.fn.on=function(t,u,s){return u==undefined||a.isFunction(u)?this.bind(t,u):this.delegate(u,t,s)
};
a.fn.off=function(t,u,s){return u==undefined||a.isFunction(u)?this.unbind(t,u):this.undelegate(u,t,s)
};
a.fn.trigger=function(t,s){if(typeof t=="string"){t=a.Event(t)
}i(t);
t.data=s;
return this.each(function(){if("dispatchEvent" in this){this.dispatchEvent(t)
}})
};
a.fn.triggerHandler=function(u,s){var t,v;
this.each(function(x,w){t=e(typeof u=="string"?a.Event(u):u);
t.data=s;
t.target=w;
a.each(h(w,u.type||u),function(z,y){v=y.proxy(t);
if(t.isImmediatePropagationStopped()){return false
}})
});
return v
};
("focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error").split(" ").forEach(function(s){a.fn[s]=function(t){return this.bind(s,t)
}
});
["focus","blur"].forEach(function(s){a.fn[s]=function(t){if(t){this.bind(s,t)
}else{if(this.length){try{this.get(0)[s]()
}catch(u){}}}return this
}
});
a.Event=function(w,v){var t=document.createEvent(p[w]||"Events"),s=true;
if(v){for(var u in v){(u=="bubbles")?(s=!!v[u]):(t[u]=v[u])
}}t.initEvent(w,s,true,null,null,null,null,null,null,null,null,null,null,null,null);
return t
}
})(Zepto);
(function(a){function b(l){var i=this.os={},e=this.browser={},m=l.match(/WebKit\/([\d.]+)/),c=l.match(/(Android)\s+([\d.]+)/),f=l.match(/(iPad).*OS\s([\d_]+)/),g=!f&&l.match(/(iPhone\sOS)\s([\d_]+)/),n=l.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),k=n&&l.match(/TouchPad/),h=l.match(/Kindle\/([\d.]+)/),j=l.match(/Silk\/([\d._]+)/),d=l.match(/(BlackBerry).*Version\/([\d.]+)/);
if(e.webkit=!!m){e.version=m[1]
}if(c){i.android=true,i.version=c[2]
}if(g){i.ios=i.iphone=true,i.version=g[2].replace(/_/g,".")
}if(f){i.ios=i.ipad=true,i.version=f[2].replace(/_/g,".")
}if(n){i.webos=true,i.version=n[2]
}if(k){i.touchpad=true
}if(d){i.blackberry=true,i.version=d[2]
}if(h){i.kindle=true,i.version=h[1]
}if(j){e.silk=true,e.version=j[1]
}if(!j&&i.android&&l.match(/Kindle Fire/)){e.silk=true
}}b.call(a,navigator.userAgent);
a.__detect=b
})(Zepto);
(function(a,l){var i="",g,f,e,m={Webkit:"webkit",Moz:"",O:"o",ms:"MS"},c=window.document,k=c.createElement("div"),j=/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,b={};
function d(n){return n.toLowerCase()
}function h(n){return g?g+n:d(n)
}a.each(m,function(o,n){if(k.style[o+"TransitionProperty"]!==l){i="-"+d(o)+"-";
g=n;
return false
}});
b[i+"transition-property"]=b[i+"transition-duration"]=b[i+"transition-timing-function"]=b[i+"animation-name"]=b[i+"animation-duration"]="";
a.fx={off:(g===l&&k.style.transitionProperty===l),cssPrefix:i,transitionEnd:h("TransitionEnd"),animationEnd:h("AnimationEnd")};
a.fn.animate=function(q,o,p,n){if(a.isObject(o)){p=o.easing,n=o.complete,o=o.duration
}if(o){o=o/1000
}return this.anim(q,o,p,n)
};
a.fn.anim=function(u,p,q,n){var w,o={},t,v=this,x,s=a.fx.transitionEnd;
if(p===l){p=0.4
}if(a.fx.off){p=0
}if(typeof u=="string"){o[i+"animation-name"]=u;
o[i+"animation-duration"]=p+"s";
s=a.fx.animationEnd
}else{for(t in u){if(j.test(t)){w||(w=[]);
w.push(t+"("+u[t]+")")
}else{o[t]=u[t]
}}if(w){o[i+"transform"]=w.join(" ")
}if(!a.fx.off&&typeof u==="object"){o[i+"transition-property"]=Object.keys(u).join(", ");
o[i+"transition-duration"]=p+"s";
o[i+"transition-timing-function"]=(q||"linear")
}}x=function(y){if(typeof y!=="undefined"){if(y.target!==y.currentTarget){return
}a(y.target).unbind(s,arguments.callee)
}a(this).css(b);
n&&n.call(this)
};
if(p>0){this.bind(s,x)
}setTimeout(function(){v.css(o);
if(p<=0){setTimeout(function(){v.each(function(){x.call(this)
})
},0)
}},0);
return this
};
k=null
})(Zepto);
(function($){var jsonpID=0,isObject=$.isObject,document=window.document,key,name,rscript=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,scriptTypeRE=/^(?:text|application)\/javascript/i,xmlTypeRE=/^(?:text|application)\/xml/i,jsonType="application/json",htmlType="text/html",blankRE=/^\s*$/;
function triggerAndReturn(context,eventName,data){var event=$.Event(eventName);
$(context).trigger(event,data);
return !event.defaultPrevented
}function triggerGlobal(settings,context,eventName,data){if(settings.global){return triggerAndReturn(context||document,eventName,data)
}}$.active=0;
function ajaxStart(settings){if(settings.global&&$.active++===0){triggerGlobal(settings,null,"ajaxStart")
}}function ajaxStop(settings){if(settings.global&&!(--$.active)){triggerGlobal(settings,null,"ajaxStop")
}}function ajaxBeforeSend(xhr,settings){var context=settings.context;
if(settings.beforeSend.call(context,xhr,settings)===false||triggerGlobal(settings,context,"ajaxBeforeSend",[xhr,settings])===false){return false
}triggerGlobal(settings,context,"ajaxSend",[xhr,settings])
}function ajaxSuccess(data,xhr,settings){var context=settings.context,status="success";
settings.success.call(context,data,status,xhr);
triggerGlobal(settings,context,"ajaxSuccess",[xhr,settings,data]);
ajaxComplete(status,xhr,settings)
}function ajaxError(error,type,xhr,settings){var context=settings.context;
settings.error.call(context,xhr,type,error);
triggerGlobal(settings,context,"ajaxError",[xhr,settings,error]);
ajaxComplete(type,xhr,settings)
}function ajaxComplete(status,xhr,settings){var context=settings.context;
settings.complete.call(context,xhr,status);
triggerGlobal(settings,context,"ajaxComplete",[xhr,settings]);
ajaxStop(settings)
}function empty(){}$.ajaxJSONP=function(options){var callbackName="jsonp"+(++jsonpID),script=document.createElement("script"),abort=function(){$(script).remove();
if(callbackName in window){window[callbackName]=empty
}ajaxComplete("abort",xhr,options)
},xhr={abort:abort},abortTimeout;
if(options.error){script.onerror=function(){xhr.abort();
options.error()
}
}window[callbackName]=function(data){clearTimeout(abortTimeout);
$(script).remove();
delete window[callbackName];
ajaxSuccess(data,xhr,options)
};
serializeData(options);
script.src=options.url.replace(/=\?/,"="+callbackName);
$("head").append(script);
if(options.timeout>0){abortTimeout=setTimeout(function(){xhr.abort();
ajaxComplete("timeout",xhr,options)
},options.timeout)
}return xhr
};
$.ajaxSettings={type:"GET",beforeSend:empty,success:empty,error:empty,complete:empty,context:null,global:true,xhr:function(){return new window.XMLHttpRequest()
},accepts:{script:"text/javascript, application/javascript",json:jsonType,xml:"application/xml, text/xml",html:htmlType,text:"text/plain"},crossDomain:false,timeout:0};
function mimeToDataType(mime){return mime&&(mime==htmlType?"html":mime==jsonType?"json":scriptTypeRE.test(mime)?"script":xmlTypeRE.test(mime)&&"xml")||"text"
}function appendQuery(url,query){return(url+"&"+query).replace(/[&?]{1,2}/,"?")
}function serializeData(options){if(isObject(options.data)){options.data=$.param(options.data)
}if(options.data&&(!options.type||options.type.toUpperCase()=="GET")){options.url=appendQuery(options.url,options.data)
}}$.ajax=function(options){var settings=$.extend({},options||{});
for(key in $.ajaxSettings){if(settings[key]===undefined){settings[key]=$.ajaxSettings[key]
}}ajaxStart(settings);
if(!settings.crossDomain){settings.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(settings.url)&&RegExp.$2!=window.location.host
}var dataType=settings.dataType,hasPlaceholder=/=\?/.test(settings.url);
if(dataType=="jsonp"||hasPlaceholder){if(!hasPlaceholder){settings.url=appendQuery(settings.url,"callback=?")
}return $.ajaxJSONP(settings)
}if(!settings.url){settings.url=window.location.toString()
}serializeData(settings);
var mime=settings.accepts[dataType],baseHeaders={},protocol=/^([\w-]+:)\/\//.test(settings.url)?RegExp.$1:window.location.protocol,xhr=$.ajaxSettings.xhr(),abortTimeout;
if(!settings.crossDomain){baseHeaders["X-Requested-With"]="XMLHttpRequest"
}if(mime){baseHeaders.Accept=mime;
if(mime.indexOf(",")>-1){mime=mime.split(",",2)[0]
}xhr.overrideMimeType&&xhr.overrideMimeType(mime)
}if(settings.contentType||(settings.data&&settings.type.toUpperCase()!="GET")){baseHeaders["Content-Type"]=(settings.contentType||"application/x-www-form-urlencoded")
}settings.headers=$.extend(baseHeaders,settings.headers||{});
xhr.onreadystatechange=function(){if(xhr.readyState==4){clearTimeout(abortTimeout);
var result,error=false;
if((xhr.status>=200&&xhr.status<300)||xhr.status==304||(xhr.status==0&&protocol=="file:")){dataType=dataType||mimeToDataType(xhr.getResponseHeader("content-type"));
result=xhr.responseText;
try{if(dataType=="script"){(1,eval)(result)
}else{if(dataType=="xml"){result=xhr.responseXML
}else{if(dataType=="json"){result=blankRE.test(result)?null:JSON.parse(result)
}}}}catch(e){error=e
}if(error){ajaxError(error,"parsererror",xhr,settings)
}else{ajaxSuccess(result,xhr,settings)
}}else{ajaxError(null,"error",xhr,settings)
}}};
var async="async" in settings?settings.async:true;
xhr.open(settings.type,settings.url,async);
for(name in settings.headers){xhr.setRequestHeader(name,settings.headers[name])
}if(ajaxBeforeSend(xhr,settings)===false){xhr.abort();
return false
}if(settings.timeout>0){abortTimeout=setTimeout(function(){xhr.onreadystatechange=empty;
xhr.abort();
ajaxError(null,"timeout",xhr,settings)
},settings.timeout)
}xhr.send(settings.data?settings.data:null);
return xhr
};
$.get=function(url,success){return $.ajax({url:url,success:success})
};
$.post=function(url,data,success,dataType){if($.isFunction(data)){dataType=dataType||success,success=data,data=null
}return $.ajax({type:"POST",url:url,data:data,success:success,dataType:dataType})
};
$.getJSON=function(url,success){return $.ajax({url:url,success:success,dataType:"json"})
};
$.fn.load=function(url,success){if(!this.length){return this
}var self=this,parts=url.split(/\s/),selector;
if(parts.length>1){url=parts[0],selector=parts[1]
}$.get(url,function(response){self.html(selector?$(document.createElement("div")).html(response.replace(rscript,"")).find(selector).html():response);
success&&success.call(self)
});
return this
};
var escape=encodeURIComponent;
function serialize(params,obj,traditional,scope){var array=$.isArray(obj);
$.each(obj,function(key,value){if(scope){key=traditional?scope:scope+"["+(array?"":key)+"]"
}if(!scope&&array){params.add(value.name,value.value)
}else{if(traditional?$.isArray(value):isObject(value)){serialize(params,value,traditional,key)
}else{params.add(key,value)
}}})
}$.param=function(obj,traditional){var params=[];
params.add=function(k,v){this.push(escape(k)+"="+escape(v))
};
serialize(params,obj,traditional);
return params.join("&").replace("%20","+")
}
})(Zepto);
(function(a){a.fn.serializeArray=function(){var c=[],b;
a(Array.prototype.slice.call(this.get(0).elements)).each(function(){b=a(this);
var d=b.attr("type");
if(this.nodeName.toLowerCase()!="fieldset"&&!this.disabled&&d!="submit"&&d!="reset"&&d!="button"&&((d!="radio"&&d!="checkbox")||this.checked)){c.push({name:b.attr("name"),value:b.val()})
}});
return c
};
a.fn.serialize=function(){var b=[];
this.serializeArray().forEach(function(c){b.push(encodeURIComponent(c.name)+"="+encodeURIComponent(c.value))
});
return b.join("&")
};
a.fn.submit=function(b){if(b){this.bind("submit",b)
}else{if(this.length){var c=a.Event("submit");
this.eq(0).trigger(c);
if(!c.defaultPrevented){this.get(0).submit()
}}}return this
}
})(Zepto);
(function(a){var h={},i;
function f(j){return"tagName" in j?j:j.parentNode
}function g(j,k,m,n){var l=Math.abs(j-k),o=Math.abs(m-n);
return l>=o?(j-k>0?"Left":"Right"):(m-n>0?"Up":"Down")
}var d=750,e;
function c(){e=null;
if(h.last){h.el.trigger("longTap");
h={}
}}function b(){if(e){clearTimeout(e)
}e=null
}a(document).ready(function(){var k,j;
a(document.body).bind("touchstart",function(l){k=Date.now();
j=k-(h.last||k);
h.el=a(f(l.touches[0].target));
i&&clearTimeout(i);
h.x1=l.touches[0].pageX;
h.y1=l.touches[0].pageY;
if(j>0&&j<=250){h.isDoubleTap=true
}h.last=k;
e=setTimeout(c,d)
}).bind("touchmove",function(l){b();
h.x2=l.touches[0].pageX;
h.y2=l.touches[0].pageY
}).bind("touchend",function(l){b();
if(h.isDoubleTap){h.el.trigger("doubleTap");
h={}
}else{if((h.x2&&Math.abs(h.x1-h.x2)>30)||(h.y2&&Math.abs(h.y1-h.y2)>30)){h.el.trigger("swipe")&&h.el.trigger("swipe"+(g(h.x1,h.x2,h.y1,h.y2)));
h={}
}else{if("last" in h){h.el.trigger("tap");
i=setTimeout(function(){i=null;
h.el.trigger("singleTap");
h={}
},250)
}}}}).bind("touchcancel",function(){if(i){clearTimeout(i)
}if(e){clearTimeout(e)
}e=i=null;
h={}
})
});
["swipe","swipeLeft","swipeRight","swipeUp","swipeDown","doubleTap","tap","singleTap","longTap"].forEach(function(j){a.fn[j]=function(k){return this.bind(j,k)
}
})
})(Zepto);
(function(){jQTouchCore=function(x){var a=x.framework,b,d=a("head"),s=[],w=0,v={},c="",y="portrait",K=[],A={},I=150,k=jQTouchCore.prototype.extensions,g=[],p="",i={addGlossToIcon:true,backSelector:".back, .cancel, .goback",cacheGetRequests:true,debug:true,defaultAnimation:"slideleft",fixedViewport:true,formSelector:"form",fullScreen:true,fullScreenClass:"fullscreen",icon:null,icon4:null,preloadImages:false,startupScreen:null,statusBar:"default",submitSelector:".submit",touchSelector:"a, .touch",trackScrollPositions:true,useAnimations:true,useFastTouch:true,useTouchScroll:true,animations:[{name:"cubeleft",selector:".cubeleft, .cube",is3d:true},{name:"cuberight",selector:".cuberight",is3d:true},{name:"dissolve",selector:".dissolve"},{name:"fade",selector:".fade"},{name:"flipleft",selector:".flipleft, .flip",is3d:true},{name:"flipright",selector:".flipright",is3d:true},{name:"pop",selector:".pop",is3d:true},{name:"swapleft",selector:".swap",is3d:true},{name:"slidedown",selector:".slidedown"},{name:"slideright",selector:".slideright"},{name:"slideup",selector:".slideup"},{name:"slideleft",selector:".slideleft, .slide, #jqt > * > ul li a"}]};
function M(N){if(window.console!==undefined&&v.debug===true){console.warn(N)
}}function e(N){if(typeof(N.selector)==="string"&&typeof(N.name)==="string"){g.push(N)
}}function f(O,N){s.unshift({page:O,animation:N,hash:"#"+O.attr("id"),id:O.attr("id")})
}function h(O){var N=a(O.target);
if(!N.is(K.join(", "))){N=a(O.target).closest(K.join(", "))
}if(N&&N.attr("href")&&!N.isExternalLink()){O.preventDefault()
}else{}if(a.support.touch){}else{a(O.target).trigger("tap",O)
}}function j(P,U,N,Q){Q=Q?Q:false;
if(U===undefined||U.length===0){a.fn.unselect();
return false
}if(U.hasClass("current")){a.fn.unselect();
return false
}a(":focus").trigger("blur");
P.trigger("pageAnimationStart",{direction:"out",back:Q});
U.trigger("pageAnimationStart",{direction:"in",back:Q});
if(a.support.animationEvents&&N&&v.useAnimations){if(!a.support.transform3d&&N.is3d){N.name=v.defaultAnimation
}var O=N.name,R=N.is3d?"animating3d":"";
if(Q){O=O.replace(/left|right|up|down|in|out/,B)
}P.bind("webkitAnimationEnd",T);
b.addClass("animating "+R);
var S=window.pageYOffset;
if(v.trackScrollPositions===true){U.css("top",window.pageYOffset-(U.data("lastScroll")||0))
}U.addClass(O+" in current");
P.addClass(O+" out");
if(v.trackScrollPositions===true){P.data("lastScroll",S);
a(".scroll",P).each(function(){a(this).data("lastScroll",this.scrollTop)
})
}}else{U.addClass("current in");
T()
}function T(W){var V=I;
if(a.support.animationEvents&&N&&v.useAnimations){P.unbind("webkitAnimationEnd",T);
P.removeClass("current "+O+" out");
U.removeClass(O);
b.removeClass("animating animating3d");
if(v.trackScrollPositions===true){U.css("top",-U.data("lastScroll"));
setTimeout(function(){U.css("top",0);
window.scroll(0,U.data("lastScroll"));
a(".scroll",U).each(function(){this.scrollTop=-a(this).data("lastScroll")
})
},0)
}}else{P.removeClass(O+" out current");
I+=201
}setTimeout(function(){U.removeClass("in")
},I);
c=U;
if(Q){s.shift()
}else{f(c,N)
}P.unselect();
D(c.attr("id"));
U.trigger("pageAnimationEnd",{direction:"in",animation:N});
P.trigger("pageAnimationEnd",{direction:"out",animation:N})
}return true
}function B(N){var O={up:"down",down:"up",left:"right",right:"left","in":"out",out:"in"};
return O[N]||N
}function m(){return y
}function n(){if(s.length<1){}if(s.length===1){window.history.go(-1)
}var N=s[0],O=s[1];
if(j(N.page,O.page,N.animation,true)){return A
}else{return false
}}function o(S,N){var O=s[0].page;
if(typeof N==="string"){for(var P=0,Q=g.length;
P<Q;
P++){if(g[P].name===N){N=g[P];
break
}}}if(typeof S==="string"){var R=a(S);
if(R.length<1){E(S,{animation:N});
return
}else{S=R
}}if(j(O,S,N)){return A
}else{return false
}}function q(N){if(location.hash===s[0].hash){return true
}else{if(location.hash===""){n();
return true
}else{if((s[1]&&location.hash===s[1].hash)){n();
return true
}else{o(a(location.hash),v.defaultAnimation)
}}}}function t(O){v=a.extend({},i,O);
if(v.preloadImages){for(var N=v.preloadImages.length-1;
N>=0;
N--){(new Image()).src=v.preloadImages[N]
}}var P=(v.addGlossToIcon)?"":"-precomposed";
if(v.icon){p+='<link rel="apple-touch-icon'+P+'" href="'+v.icon+'" />'
}if(v.icon4){p+='<link rel="apple-touch-icon'+P+'" sizes="114x114" href="'+v.icon4+'" />'
}if(v.startupScreen){p+='<link rel="apple-touch-startup-image" href="'+v.startupScreen+'" />'
}if(v.fixedViewport){p+='<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>'
}if(v.fullScreen){p+='<meta name="apple-mobile-web-app-capable" content="yes" />';
if(v.statusBar){p+='<meta name="apple-mobile-web-app-status-bar-style" content="'+v.statusBar+'" />'
}}if(p){d.prepend(p)
}}function l(O){var N;
for(var P=0,Q=g.length;
P<Q;
P++){if(O.is(g[P].selector)){N=g[P];
break
}}if(!N){N=v.defaultAnimation
}return N
}function u(P,N){var Q=null;
var O=document.createElement("div");
O.innerHTML=P;
a(O).children().each(function(S,T){var R=a(this);
if(!R.attr("id")){R.attr("id","page-"+(++w))
}a("#"+R.attr("id")).remove();
b.append(R);
b.trigger("pageInserted",{page:R});
if(R.hasClass("current")||!Q){Q=R
}});
if(Q!==null){o(Q,N);
return Q
}else{return false
}}function z(){b.css("minHeight",1000);
scrollTo(0,0);
var N=window.innerHeight;
b.css("minHeight",N);
y=Math.abs(window.orientation)==90?"landscape":"portrait";
b.removeClass("portrait landscape").addClass(y).trigger("turn",{orientation:y})
}function D(N){location.hash="#"+N.replace(/^#/,"")
}function E(O,P){var N={data:null,method:"GET",animation:null,callback:null,$referrer:null};
var Q=a.extend({},N,P);
if(O!="#"){a.ajax({url:O,data:Q.data,type:Q.method,success:function(R){var S=u(R,Q.animation);
if(S){if(Q.method=="GET"&&v.cacheGetRequests===true&&Q.$referrer){Q.$referrer.attr("href","#"+S.attr("id"))
}if(Q.callback){Q.callback(true)
}}},error:function(R){if(Q.$referrer){Q.$referrer.unselect()
}if(Q.callback){Q.callback(false)
}}})
}else{if(Q.$referrer){Q.$referrer.unselect()
}}}function F(P,O){a(":focus").trigger("blur");
P.preventDefault();
var N=(typeof(P)==="string")?a(P).eq(0):(P.target?a(P.target):a(P));
if(N.length&&N.is(v.formSelector)&&N.attr("action")){E(N.attr("action"),{data:N.serialize(),method:N.attr("method")||"POST",animation:l(N),callback:O});
return false
}return true
}function G(N){var O=N.closest("form");
if(O.length===0){}else{O.trigger("submit");
return false
}return true
}function H(){var P,N,R,O,Q;
P=document.getElementsByTagName("head")[0];
N=document.body;
R=document.createElement("style");
R.textContent="@media (transform-3d),(-o-transform-3d),(-moz-transform-3d),(-webkit-transform-3d){#jqt-3dtest{height:3px}}";
O=document.createElement("div");
O.id="jqt-3dtest";
P.appendChild(R);
N.appendChild(O);
Q=O.offsetHeight===3;
R.parentNode.removeChild(R);
O.parentNode.removeChild(O);
return Q
}function L(O){var N=a(O.target),P=K.join(", ");
if(!N.is(P)){N=N.closest(P)
}if(N.length&&N.attr("href")){N.addClass("active")
}N.on(a.support.touch?"touchmove":"mousemove",function(){N.removeClass("active")
});
N.on("touchend",function(){N.unbind("touchmove mousemove")
})
}function J(P){var N=a(P.target);
if(!N.is(K.join(", "))){N=N.closest(K.join(", "))
}if(!N.length||!N.attr("href")){return false
}var S=N.attr("target"),Q=N.prop("hash"),R=N.attr("href"),O=null;
if(N.isExternalLink()){N.unselect();
return true
}else{if(N.is(v.backSelector)){n(Q)
}else{if(N.is(v.submitSelector)){G(N)
}else{if(S==="_webapp"){window.location=R;
return false
}else{if(R==="#"){N.unselect();
return true
}else{O=l(N);
if(Q&&Q!=="#"){N.addClass("active");
o(a(Q).data("referrer",N),O,N.hasClass("reverse"));
return false
}else{N.addClass("loading active");
E(N.attr("href"),{animation:O,callback:function(){N.removeClass("loading");
setTimeout(a.fn.unselect,250,N)
},$referrer:N});
return false
}}}}}}}t(x);
a(document).ready(function C(){if(!a.support){a.support={}
}a.support.animationEvents=(typeof window.WebKitAnimationEvent!="undefined");
a.support.touch=(typeof window.TouchEvent!="undefined")&&(window.navigator.userAgent.indexOf("Mobile")>-1)&&v.useFastTouch;
a.support.transform3d=H();
a.support.ios5=/OS (5(_\d+)*) like Mac OS X/i.test(window.navigator.userAgent);
if(!a.support.touch){}if(!a.support.transform3d){}a.fn.isExternalLink=function(){var V=a(this);
return(V.attr("target")=="_blank"||V.attr("rel")=="external"||V.is('a[href^="http://maps.google.com"], a[href^="mailto:"], a[href^="tel:"], a[href^="javascript:"], a[href*="youtube.com/v"], a[href*="youtube.com/watch"]'))
};
a.fn.makeActive=function(){return a(this).addClass("active")
};
a.fn.unselect=function(V){if(V){V.removeClass("active")
}else{a(".active").removeClass("active")
}};
for(var Q=0,S=k.length;
Q<S;
Q++){var P=k[Q];
if(a.isFunction(P)){a.extend(A,P(A))
}}for(var R=0,T=i.animations.length;
R<T;
R++){var O=i.animations[R];
if(v[O.name+"Selector"]!==undefined){O.selector=v[O.name+"Selector"]
}e(O)
}K.push(v.touchSelector);
K.push(v.backSelector);
K.push(v.submitSelector);
a(K.join(", ")).css("-webkit-touch-callout","none");
b=a("#jqt");
var N=[];
if(b.length===0){b=a(document.body).attr("id","jqt")
}if(a.support.transform3d){N.push("supports3d")
}if(a.support.ios5&&v.useTouchScroll){N.push("touchscroll")
}if(v.fullScreenClass&&window.navigator.standalone===true){N.push(v.fullScreenClass,v.statusBar)
}b.addClass(N.join(" ")).bind("click",h).bind("orientationchange",z).bind("submit",F).bind("tap",J).bind(a.support.touch?"touchstart":"mousedown",L).trigger("orientationchange");
a(window).bind("hashchange",q);
var U=location.hash;
if(a("#jqt > .current").length===0){c=a("#jqt > *:first-child").addClass("current")
}else{c=a("#jqt > .current")
}D(c.attr("id"));
f(c);
if(a(U).length===1){o(U)
}});
A={addAnimation:e,animations:g,getOrientation:m,goBack:n,insertPages:u,goTo:o,history:s,settings:v,submitForm:F};
return A
};
jQTouchCore.prototype.extensions=[];
if(!!window.Zepto){(function(a){a.jQTouch=function(b){b.framework=a;
return jQTouchCore(b)
};
a.fn.prop=a.fn.attr;
a.jQTouch.addExtension=function(b){jQTouchCore.prototype.extensions.push(b)
}
})(Zepto)
}})();
(function(a){if(a.jQTouch){var b=a("script").last().attr("src").split("?")[0].split("/").slice(0,-1).join("/")+"/";
a.jQTouch.addExtension(function c(k){var e,l,q={},f={themeStyleSelector:'link[rel="stylesheet"][title]',themeIncluded:[{title:"Awesome",href:b+"../themes/css/mobile-dark.css"},{title:"Apple",href:b+"../themes/css/apple.css"},{title:"Boring",href:b+"../themes/css/jqtouch.css"}]},m=a.extend({},f,k.settings);
function n(s,t){var i=a(s);
if(i.attr("title")===t){s.disabled=false;
i.removeAttr("disabled")
}else{s.disabled=true;
i.attr("disabled",true)
}}function j(i,s){if(!e){e=s
}n(i,e)
}function o(i){e=i;
a(m.themeStyleSelector).each(function(s,t){n(t,i)
})
}a(m.themeStyleSelector).each(function(t,u){var s=a(u);
var v=s.attr("title");
q[v]=true;
j(u,v)
});
for(var h=0;
h<m.themeIncluded.length;
h++){var g=m.themeIncluded[h];
if(!(g.title in q)){l=a('<link title="'+g.title+'" href="'+g.href+'" rel="stylesheet">');
a("head").append(a(l));
q[g.title]=true;
j(l,g.title)
}}if(m.themeSelectionSelector){for(var p in q){var d=a('<li><a href="#" data-title="'+p+'">'+p+"</a></li>");
a(m.themeSelectionSelector).append(d)
}a(m.themeSelectionSelector).delegate("* > a","tap",function(){var i=a(this).closest("a");
o(i.attr("data-title"));
setTimeout(function(){i.addClass("active")
},0)
});
a(m.themeSelectionSelector).closest("#jqt > *").bind("pageAnimationEnd",function(s,i){if(i.direction==="in"){a(m.themeSelectionSelector).find('a[data-title="'+e+'"]').addClass("active")
}})
}return{switchStyle:o}
})
}})($);
/*
 * iScroll v4.1.9 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){var n=Math,p=function(m){return m>>0
},w=(/webkit/i).test(navigator.appVersion)?"webkit":(/firefox/i).test(navigator.userAgent)?"Moz":(/trident/i).test(navigator.userAgent)?"ms":"opera" in window?"O":"",h=(/android/gi).test(navigator.appVersion),j=(/iphone|ipad/gi).test(navigator.appVersion),k=(/playbook/gi).test(navigator.appVersion),l=(/hp-tablet/gi).test(navigator.appVersion),d="WebKitCSSMatrix" in window&&"m11" in new WebKitCSSMatrix(),e="ontouchstart" in window&&!l,f=w+"Transform" in document.documentElement.style,g=j||k,q=(function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(m){return setTimeout(m,1)
}
})(),b=(function(){return window.cancelRequestAnimationFrame||window.webkitCancelAnimationFrame||window.webkitCancelRequestAnimationFrame||window.mozCancelRequestAnimationFrame||window.oCancelRequestAnimationFrame||window.msCancelRequestAnimationFrame||clearTimeout
})(),s="onorientationchange" in window?"orientationchange":"resize",t=e?"touchstart":"mousedown",o=e?"touchmove":"mousemove",c=e?"touchend":"mouseup",a=e?"touchcancel":"mouseup",x=w=="Moz"?"DOMMouseScroll":"mousewheel",v="translate"+(d?"3d(":"("),u=d?",0)":")",i=function(y,A){var B=this,m=document,z;
B.wrapper=typeof y=="object"?y:m.getElementById(y);
B.wrapper.style.overflow="hidden";
B.scroller=B.wrapper.children[0];
B.options={hScroll:true,vScroll:true,x:0,y:0,bounce:true,bounceLock:false,momentum:true,lockDirection:true,useTransform:true,useTransition:false,topOffset:0,checkDOMChanges:false,hScrollbar:true,vScrollbar:true,fixedScrollbar:h,hideScrollbar:j,fadeScrollbar:j&&d,scrollbarClass:"",zoom:false,zoomMin:1,zoomMax:4,doubleTapZoom:2,wheelAction:"scroll",snap:false,snapThreshold:1,onRefresh:null,onBeforeScrollStart:function(C){C.preventDefault()
},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:null,onBeforeScrollEnd:null,onScrollEnd:null,onTouchEnd:null,onDestroy:null,onZoomStart:null,onZoom:null,onZoomEnd:null};
for(z in A){B.options[z]=A[z]
}B.x=B.options.x;
B.y=B.options.y;
B.options.useTransform=f?B.options.useTransform:false;
B.options.hScrollbar=B.options.hScroll&&B.options.hScrollbar;
B.options.vScrollbar=B.options.vScroll&&B.options.vScrollbar;
B.options.zoom=B.options.useTransform&&B.options.zoom;
B.options.useTransition=g&&B.options.useTransition;
if(B.options.zoom&&h){v="translate(";
u=")"
}B.scroller.style[w+"TransitionProperty"]=B.options.useTransform?"-"+w.toLowerCase()+"-transform":"top left";
B.scroller.style[w+"TransitionDuration"]="0";
B.scroller.style[w+"TransformOrigin"]="0 0";
if(B.options.useTransition){B.scroller.style[w+"TransitionTimingFunction"]="cubic-bezier(0.33,0.66,0.66,1)"
}if(B.options.useTransform){B.scroller.style[w+"Transform"]=v+B.x+"px,"+B.y+"px"+u
}else{B.scroller.style.cssText+=";position:absolute;top:"+B.y+"px;left:"+B.x+"px"
}if(B.options.useTransition){B.options.fixedScrollbar=true
}B.refresh();
B._bind(s,window);
B._bind(t);
if(!e){B._bind("mouseout",B.wrapper);
if(B.options.wheelAction!="none"){B._bind(x)
}}if(B.options.checkDOMChanges){B.checkDOMTime=setInterval(function(){B._checkDOMChanges()
},500)
}};
i.prototype={enabled:true,x:0,y:0,steps:[],scale:1,currPageX:0,currPageY:0,pagesX:[],pagesY:[],aniTime:null,wheelZoomCount:0,handleEvent:function(m){var y=this;
switch(m.type){case t:if(!e&&m.button!==0){return
}y._start(m);
break;
case o:y._move(m);
break;
case c:case a:y._end(m);
break;
case s:y._resize();
break;
case x:y._wheel(m);
break;
case"mouseout":y._mouseout(m);
break;
case"webkitTransitionEnd":y._transitionEnd(m);
break
}},_checkDOMChanges:function(){if(this.moved||this.zoomed||this.animating||(this.scrollerW==this.scroller.offsetWidth*this.scale&&this.scrollerH==this.scroller.offsetHeight*this.scale)){return
}this.refresh()
},_scrollbar:function(y){var A=this,z=document,m;
if(!A[y+"Scrollbar"]){if(A[y+"ScrollbarWrapper"]){if(f){A[y+"ScrollbarIndicator"].style[w+"Transform"]=""
}A[y+"ScrollbarWrapper"].parentNode.removeChild(A[y+"ScrollbarWrapper"]);
A[y+"ScrollbarWrapper"]=null;
A[y+"ScrollbarIndicator"]=null
}return
}if(!A[y+"ScrollbarWrapper"]){m=z.createElement("div");
if(A.options.scrollbarClass){m.className=A.options.scrollbarClass+y.toUpperCase()
}else{m.style.cssText="position:absolute;z-index:100;"+(y=="h"?"height:7px;bottom:1px;left:2px;right:"+(A.vScrollbar?"7":"2")+"px":"width:7px;bottom:"+(A.hScrollbar?"7":"2")+"px;top:2px;right:1px")
}m.style.cssText+=";pointer-events:none;-"+w+"-transition-property:opacity;-"+w+"-transition-duration:"+(A.options.fadeScrollbar?"350ms":"0")+";overflow:hidden;opacity:"+(A.options.hideScrollbar?"0":"1");
A.wrapper.appendChild(m);
A[y+"ScrollbarWrapper"]=m;
m=z.createElement("div");
if(!A.options.scrollbarClass){m.style.cssText="position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);-"+w+"-background-clip:padding-box;-"+w+"-box-sizing:border-box;"+(y=="h"?"height:100%":"width:100%")+";-"+w+"-border-radius:3px;border-radius:3px"
}m.style.cssText+=";pointer-events:none;-"+w+"-transition-property:-"+w+"-transform;-"+w+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);-"+w+"-transition-duration:0;-"+w+"-transform:"+v+"0,0"+u;
if(A.options.useTransition){m.style.cssText+=";-"+w+"-transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"
}A[y+"ScrollbarWrapper"].appendChild(m);
A[y+"ScrollbarIndicator"]=m
}if(y=="h"){A.hScrollbarSize=A.hScrollbarWrapper.clientWidth;
A.hScrollbarIndicatorSize=n.max(p(A.hScrollbarSize*A.hScrollbarSize/A.scrollerW),8);
A.hScrollbarIndicator.style.width=A.hScrollbarIndicatorSize+"px";
A.hScrollbarMaxScroll=A.hScrollbarSize-A.hScrollbarIndicatorSize;
A.hScrollbarProp=A.hScrollbarMaxScroll/A.maxScrollX
}else{A.vScrollbarSize=A.vScrollbarWrapper.clientHeight;
A.vScrollbarIndicatorSize=n.max(p(A.vScrollbarSize*A.vScrollbarSize/A.scrollerH),8);
A.vScrollbarIndicator.style.height=A.vScrollbarIndicatorSize+"px";
A.vScrollbarMaxScroll=A.vScrollbarSize-A.vScrollbarIndicatorSize;
A.vScrollbarProp=A.vScrollbarMaxScroll/A.maxScrollY
}A._scrollbarPos(y,true)
},_resize:function(){var m=this;
setTimeout(function(){m.refresh()
},h?200:0)
},_pos:function(m,z){m=this.hScroll?m:0;
z=this.vScroll?z:0;
if(this.options.useTransform){this.scroller.style[w+"Transform"]=v+m+"px,"+z+"px"+u+" scale("+this.scale+")"
}else{m=p(m);
z=p(z);
this.scroller.style.left=m+"px";
this.scroller.style.top=z+"px"
}this.x=m;
this.y=z;
this._scrollbarPos("h");
this._scrollbarPos("v")
},_scrollbarPos:function(m,y){var B=this,z=m=="h"?B.x:B.y,A;
if(!B[m+"Scrollbar"]){return
}z=B[m+"ScrollbarProp"]*z;
if(z<0){if(!B.options.fixedScrollbar){A=B[m+"ScrollbarIndicatorSize"]+p(z*3);
if(A<8){A=8
}B[m+"ScrollbarIndicator"].style[m=="h"?"width":"height"]=A+"px"
}z=0
}else{if(z>B[m+"ScrollbarMaxScroll"]){if(!B.options.fixedScrollbar){A=B[m+"ScrollbarIndicatorSize"]-p((z-B[m+"ScrollbarMaxScroll"])*3);
if(A<8){A=8
}B[m+"ScrollbarIndicator"].style[m=="h"?"width":"height"]=A+"px";
z=B[m+"ScrollbarMaxScroll"]+(B[m+"ScrollbarIndicatorSize"]-A)
}else{z=B[m+"ScrollbarMaxScroll"]
}}}B[m+"ScrollbarWrapper"].style[w+"TransitionDelay"]="0";
B[m+"ScrollbarWrapper"].style.opacity=y&&B.options.hideScrollbar?"0":"1";
B[m+"ScrollbarIndicator"].style[w+"Transform"]=v+(m=="h"?z+"px,0":"0,"+z+"px")+u
},_start:function(A){var D=this,C=e?A.touches[0]:A,B,E,F,m,z;
if(!D.enabled){return
}if(D.options.onBeforeScrollStart){D.options.onBeforeScrollStart.call(D,A)
}if(D.options.useTransition||D.options.zoom){D._transitionTime(0)
}D.moved=false;
D.animating=false;
D.zoomed=false;
D.distX=0;
D.distY=0;
D.absDistX=0;
D.absDistY=0;
D.dirX=0;
D.dirY=0;
if(D.options.zoom&&e&&A.touches.length>1){m=n.abs(A.touches[0].pageX-A.touches[1].pageX);
z=n.abs(A.touches[0].pageY-A.touches[1].pageY);
D.touchesDistStart=n.sqrt(m*m+z*z);
D.originX=n.abs(A.touches[0].pageX+A.touches[1].pageX-D.wrapperOffsetLeft*2)/2-D.x;
D.originY=n.abs(A.touches[0].pageY+A.touches[1].pageY-D.wrapperOffsetTop*2)/2-D.y;
if(D.options.onZoomStart){D.options.onZoomStart.call(D,A)
}}if(D.options.momentum){if(D.options.useTransform){B=getComputedStyle(D.scroller,null)[w+"Transform"].replace(/[^0-9-.,]/g,"").split(",");
E=B[4]*1;
F=B[5]*1
}else{E=getComputedStyle(D.scroller,null).left.replace(/[^0-9-]/g,"")*1;
F=getComputedStyle(D.scroller,null).top.replace(/[^0-9-]/g,"")*1
}if(E!=D.x||F!=D.y){if(D.options.useTransition){D._unbind("webkitTransitionEnd")
}else{b(D.aniTime)
}D.steps=[];
D._pos(E,F)
}}D.absStartX=D.x;
D.absStartY=D.y;
D.startX=D.x;
D.startY=D.y;
D.pointX=C.pageX;
D.pointY=C.pageY;
D.startTime=A.timeStamp||Date.now().getTime();
if(D.options.onScrollStart){D.options.onScrollStart.call(D,A)
}D._bind(o);
D._bind(c);
D._bind(a)
},_move:function(B){var G=this,E=e?B.touches[0]:B,z=E.pageX-G.pointX,A=E.pageY-G.pointY,C=G.x+z,D=G.y+A,m,y,F,H=B.timeStamp||Date.now().getTime();
if(G.options.onBeforeScrollMove){G.options.onBeforeScrollMove.call(G,B)
}if(G.options.zoom&&e&&B.touches.length>1){m=n.abs(B.touches[0].pageX-B.touches[1].pageX);
y=n.abs(B.touches[0].pageY-B.touches[1].pageY);
G.touchesDist=n.sqrt(m*m+y*y);
G.zoomed=true;
F=1/G.touchesDistStart*G.touchesDist*this.scale;
if(F<G.options.zoomMin){F=0.5*G.options.zoomMin*Math.pow(2,F/G.options.zoomMin)
}else{if(F>G.options.zoomMax){F=2*G.options.zoomMax*Math.pow(0.5,G.options.zoomMax/F)
}}G.lastScale=F/this.scale;
C=this.originX-this.originX*G.lastScale+this.x,D=this.originY-this.originY*G.lastScale+this.y;
this.scroller.style[w+"Transform"]=v+C+"px,"+D+"px"+u+" scale("+F+")";
if(G.options.onZoom){G.options.onZoom.call(G,B)
}return
}G.pointX=E.pageX;
G.pointY=E.pageY;
if(C>0||C<G.maxScrollX){C=G.options.bounce?G.x+(z/2):C>=0||G.maxScrollX>=0?0:G.maxScrollX
}if(D>G.minScrollY||D<G.maxScrollY){D=G.options.bounce?G.y+(A/2):D>=G.minScrollY||G.maxScrollY>=0?G.minScrollY:G.maxScrollY
}G.distX+=z;
G.distY+=A;
G.absDistX=n.abs(G.distX);
G.absDistY=n.abs(G.distY);
if(G.absDistX<6&&G.absDistY<6){return
}if(G.options.lockDirection){if(G.absDistX>G.absDistY+5){D=G.y;
A=0
}else{if(G.absDistY>G.absDistX+5){C=G.x;
z=0
}}}G.moved=true;
G._pos(C,D);
G.dirX=z>0?-1:z<0?1:0;
G.dirY=A>0?-1:A<0?1:0;
if(H-G.startTime>300){G.startTime=H;
G.startX=G.x;
G.startY=G.y
}if(G.options.onScrollMove){G.options.onScrollMove.call(G,B)
}},_end:function(A){if(e&&A.touches.length!=0){return
}var L=this,H=e?A.changedTouches[0]:A,K,B,C={dist:0,time:0},D={dist:0,time:0},z=(A.timeStamp||Date.now().getTime())-L.startTime,F=L.x,G=L.y,m,y,E,J,I;
L._unbind(o);
L._unbind(c);
L._unbind(a);
if(L.options.onBeforeScrollEnd){L.options.onBeforeScrollEnd.call(L,A)
}if(L.zoomed){I=L.scale*L.lastScale;
I=Math.max(L.options.zoomMin,I);
I=Math.min(L.options.zoomMax,I);
L.lastScale=I/L.scale;
L.scale=I;
L.x=L.originX-L.originX*L.lastScale+L.x;
L.y=L.originY-L.originY*L.lastScale+L.y;
L.scroller.style[w+"TransitionDuration"]="200ms";
L.scroller.style[w+"Transform"]=v+L.x+"px,"+L.y+"px"+u+" scale("+L.scale+")";
L.zoomed=false;
L.refresh();
if(L.options.onZoomEnd){L.options.onZoomEnd.call(L,A)
}return
}if(!L.moved){if(e){if(L.doubleTapTimer&&L.options.zoom){clearTimeout(L.doubleTapTimer);
L.doubleTapTimer=null;
if(L.options.onZoomStart){L.options.onZoomStart.call(L,A)
}L.zoom(L.pointX,L.pointY,L.scale==1?L.options.doubleTapZoom:1);
if(L.options.onZoomEnd){setTimeout(function(){L.options.onZoomEnd.call(L,A)
},200)
}}else{L.doubleTapTimer=setTimeout(function(){L.doubleTapTimer=null;
K=H.target;
while(K.nodeType!=1){K=K.parentNode
}if(K.tagName!="SELECT"&&K.tagName!="INPUT"&&K.tagName!="TEXTAREA"){B=document.createEvent("MouseEvents");
B.initMouseEvent("click",true,true,A.view,1,H.screenX,H.screenY,H.clientX,H.clientY,A.ctrlKey,A.altKey,A.shiftKey,A.metaKey,0,null);
B._fake=true;
K.dispatchEvent(B)
}},L.options.zoom?250:0)
}}L._resetPos(200);
if(L.options.onTouchEnd){L.options.onTouchEnd.call(L,A)
}return
}if(z<300&&L.options.momentum){C=F?L._momentum(F-L.startX,z,-L.x,L.scrollerW-L.wrapperW+L.x,L.options.bounce?L.wrapperW:0):C;
D=G?L._momentum(G-L.startY,z,-L.y,(L.maxScrollY<0?L.scrollerH-L.wrapperH+L.y-L.minScrollY:0),L.options.bounce?L.wrapperH:0):D;
F=L.x+C.dist;
G=L.y+D.dist;
if((L.x>0&&F>0)||(L.x<L.maxScrollX&&F<L.maxScrollX)){C={dist:0,time:0}
}if((L.y>L.minScrollY&&G>L.minScrollY)||(L.y<L.maxScrollY&&G<L.maxScrollY)){D={dist:0,time:0}
}}if(C.dist||D.dist){E=n.max(n.max(C.time,D.time),10);
if(L.options.snap){m=F-L.absStartX;
y=G-L.absStartY;
if(n.abs(m)<L.options.snapThreshold&&n.abs(y)<L.options.snapThreshold){L.scrollTo(L.absStartX,L.absStartY,200)
}else{J=L._snap(F,G);
F=J.x;
G=J.y;
E=n.max(J.time,E)
}}L.scrollTo(p(F),p(G),E);
if(L.options.onTouchEnd){L.options.onTouchEnd.call(L,A)
}return
}if(L.options.snap){m=F-L.absStartX;
y=G-L.absStartY;
if(n.abs(m)<L.options.snapThreshold&&n.abs(y)<L.options.snapThreshold){L.scrollTo(L.absStartX,L.absStartY,200)
}else{J=L._snap(L.x,L.y);
if(J.x!=L.x||J.y!=L.y){L.scrollTo(J.x,J.y,J.time)
}}if(L.options.onTouchEnd){L.options.onTouchEnd.call(L,A)
}return
}L._resetPos(200);
if(L.options.onTouchEnd){L.options.onTouchEnd.call(L,A)
}},_resetPos:function(A){var z=this,m=z.x>=0?0:z.x<z.maxScrollX?z.maxScrollX:z.x,y=z.y>=z.minScrollY||z.maxScrollY>0?z.minScrollY:z.y<z.maxScrollY?z.maxScrollY:z.y;
if(m==z.x&&y==z.y){if(z.moved){z.moved=false;
if(z.options.onScrollEnd){z.options.onScrollEnd.call(z)
}}if(z.hScrollbar&&z.options.hideScrollbar){if(w=="webkit"){z.hScrollbarWrapper.style[w+"TransitionDelay"]="300ms"
}z.hScrollbarWrapper.style.opacity="0"
}if(z.vScrollbar&&z.options.hideScrollbar){if(w=="webkit"){z.vScrollbarWrapper.style[w+"TransitionDelay"]="300ms"
}z.vScrollbarWrapper.style.opacity="0"
}return
}z.scrollTo(m,y,A||0)
},_wheel:function(A){var B=this,C,D,y,z,m;
if("wheelDeltaX" in A){C=A.wheelDeltaX/12;
D=A.wheelDeltaY/12
}else{if("wheelDelta" in A){C=D=A.wheelDelta/12
}else{if("detail" in A){C=D=-A.detail*3
}else{return
}}}if(B.options.wheelAction=="zoom"){m=B.scale*Math.pow(2,1/3*(D?D/Math.abs(D):0));
if(m<B.options.zoomMin){m=B.options.zoomMin
}if(m>B.options.zoomMax){m=B.options.zoomMax
}if(m!=B.scale){if(!B.wheelZoomCount&&B.options.onZoomStart){B.options.onZoomStart.call(B,A)
}B.wheelZoomCount++;
B.zoom(A.pageX,A.pageY,m,400);
setTimeout(function(){B.wheelZoomCount--;
if(!B.wheelZoomCount&&B.options.onZoomEnd){B.options.onZoomEnd.call(B,A)
}},400)
}return
}y=B.x+C;
z=B.y+D;
if(y>0){y=0
}else{if(y<B.maxScrollX){y=B.maxScrollX
}}if(z>B.minScrollY){z=B.minScrollY
}else{if(z<B.maxScrollY){z=B.maxScrollY
}}B.scrollTo(y,z,0)
},_mouseout:function(m){var y=m.relatedTarget;
if(!y){this._end(m);
return
}while(y=y.parentNode){if(y==this.wrapper){return
}}this._end(m)
},_transitionEnd:function(m){var y=this;
if(m.target!=y.scroller){return
}y._unbind("webkitTransitionEnd");
y._startAni()
},_startAni:function(){var D=this,A=D.x,B=D.y,z=Date.now().getTime(),C,y,m;
if(D.animating){return
}if(!D.steps.length){D._resetPos(400);
return
}C=D.steps.shift();
if(C.x==A&&C.y==B){C.time=0
}D.animating=true;
D.moved=true;
if(D.options.useTransition){D._transitionTime(C.time);
D._pos(C.x,C.y);
D.animating=false;
if(C.time){D._bind("webkitTransitionEnd")
}else{D._resetPos(0)
}return
}m=function(){var G=Date.now().getTime(),E,F;
if(G>=z+C.time){D._pos(C.x,C.y);
D.animating=false;
if(D.options.onAnimationEnd){D.options.onAnimationEnd.call(D)
}D._startAni();
return
}G=(G-z)/C.time-1;
y=n.sqrt(1-G*G);
E=(C.x-A)*y+A;
F=(C.y-B)*y+B;
D._pos(E,F);
if(D.animating){D.aniTime=q(m)
}};
m()
},_transitionTime:function(m){m+="ms";
this.scroller.style[w+"TransitionDuration"]=m;
if(this.hScrollbar){this.hScrollbarIndicator.style[w+"TransitionDuration"]=m
}if(this.vScrollbar){this.vScrollbarIndicator.style[w+"TransitionDuration"]=m
}},_momentum:function(y,G,A,z,E){var m=0.0006,F=n.abs(y)/G,B=(F*F)/(2*m),C=0,D=0;
if(y>0&&B>A){D=E/(6/(B/F*m));
A=A+D;
F=F*A/B;
B=A
}else{if(y<0&&B>z){D=E/(6/(B/F*m));
z=z+D;
F=F*z/B;
B=z
}}B=B*(y<0?-1:1);
C=F/m;
return{dist:B,time:p(C)}
},_offset:function(m){var y=-m.offsetLeft,z=-m.offsetTop;
while(m=m.offsetParent){y-=m.offsetLeft;
z-=m.offsetTop
}if(m!=this.wrapper){y*=this.scale;
z*=this.scale
}return{left:y,top:z}
},_snap:function(F,G){var D=this,m,z,A,E,B,C;
A=D.pagesX.length-1;
for(m=0,z=D.pagesX.length;
m<z;
m++){if(F>=D.pagesX[m]){A=m;
break
}}if(A==D.currPageX&&A>0&&D.dirX<0){A--
}F=D.pagesX[A];
B=n.abs(F-D.pagesX[D.currPageX]);
B=B?n.abs(D.x-F)/B*500:0;
D.currPageX=A;
A=D.pagesY.length-1;
for(m=0;
m<A;
m++){if(G>=D.pagesY[m]){A=m;
break
}}if(A==D.currPageY&&A>0&&D.dirY<0){A--
}G=D.pagesY[A];
C=n.abs(G-D.pagesY[D.currPageY]);
C=C?n.abs(D.y-G)/C*500:0;
D.currPageY=A;
E=p(n.max(B,C))||200;
return{x:F,y:G,time:E}
},_bind:function(z,y,m){(y||this.scroller).addEventListener(z,this,!!m)
},_unbind:function(z,y,m){(y||this.scroller).removeEventListener(z,this,!!m)
},destroy:function(){var m=this;
m.scroller.style[w+"Transform"]="";
m.hScrollbar=false;
m.vScrollbar=false;
m._scrollbar("h");
m._scrollbar("v");
m._unbind(s,window);
m._unbind(t);
m._unbind(o);
m._unbind(c);
m._unbind(a);
if(!m.options.hasTouch){m._unbind("mouseout",m.wrapper);
m._unbind(x)
}if(m.options.useTransition){m._unbind("webkitTransitionEnd")
}if(m.options.checkDOMChanges){clearInterval(m.checkDOMTime)
}if(m.options.onDestroy){m.options.onDestroy.call(m)
}},refresh:function(){var D=this,A,y,z,m,C=0,B=0;
if(D.scale<D.options.zoomMin){D.scale=D.options.zoomMin
}D.wrapperW=D.wrapper.clientWidth||1;
D.wrapperH=D.wrapper.clientHeight||1;
D.minScrollY=-D.options.topOffset||0;
D.scrollerW=p(D.scroller.offsetWidth*D.scale);
D.scrollerH=p((D.scroller.offsetHeight+D.minScrollY)*D.scale);
D.maxScrollX=D.wrapperW-D.scrollerW;
D.maxScrollY=D.wrapperH-D.scrollerH+D.minScrollY;
D.dirX=0;
D.dirY=0;
if(D.options.onRefresh){D.options.onRefresh.call(D)
}D.hScroll=D.options.hScroll&&D.maxScrollX<0;
D.vScroll=D.options.vScroll&&(!D.options.bounceLock&&!D.hScroll||D.scrollerH>D.wrapperH);
D.hScrollbar=D.hScroll&&D.options.hScrollbar;
D.vScrollbar=D.vScroll&&D.options.vScrollbar&&D.scrollerH>D.wrapperH;
A=D._offset(D.wrapper);
D.wrapperOffsetLeft=-A.left;
D.wrapperOffsetTop=-A.top;
if(typeof D.options.snap=="string"){D.pagesX=[];
D.pagesY=[];
m=D.scroller.querySelectorAll(D.options.snap);
for(y=0,z=m.length;
y<z;
y++){C=D._offset(m[y]);
C.left+=D.wrapperOffsetLeft;
C.top+=D.wrapperOffsetTop;
D.pagesX[y]=C.left<D.maxScrollX?D.maxScrollX:C.left*D.scale;
D.pagesY[y]=C.top<D.maxScrollY?D.maxScrollY:C.top*D.scale
}}else{if(D.options.snap){D.pagesX=[];
while(C>=D.maxScrollX){D.pagesX[B]=C;
C=C-D.wrapperW;
B++
}if(D.maxScrollX%D.wrapperW){D.pagesX[D.pagesX.length]=D.maxScrollX-D.pagesX[D.pagesX.length-1]+D.pagesX[D.pagesX.length-1]
}C=0;
B=0;
D.pagesY=[];
while(C>=D.maxScrollY){D.pagesY[B]=C;
C=C-D.wrapperH;
B++
}if(D.maxScrollY%D.wrapperH){D.pagesY[D.pagesY.length]=D.maxScrollY-D.pagesY[D.pagesY.length-1]+D.pagesY[D.pagesY.length-1]
}}}D._scrollbar("h");
D._scrollbar("v");
if(!D.zoomed){D.scroller.style[w+"TransitionDuration"]="0";
D._resetPos(200)
}},scrollTo:function(E,F,D,A){var C=this,B=E,m,z;
C.stop();
if(!B.length){B=[{x:E,y:F,time:D,relative:A}]
}for(m=0,z=B.length;
m<z;
m++){if(B[m].relative){B[m].x=C.x-B[m].x;
B[m].y=C.y-B[m].y
}C.steps.push({x:B[m].x,y:B[m].y,time:B[m].time||0})
}C._startAni()
},scrollToElement:function(m,A){var z=this,y;
m=m.nodeType?m:z.scroller.querySelector(m);
if(!m){return
}y=z._offset(m);
y.left+=z.wrapperOffsetLeft;
y.top+=z.wrapperOffsetTop;
y.left=y.left>0?0:y.left<z.maxScrollX?z.maxScrollX:y.left;
y.top=y.top>z.minScrollY?z.minScrollY:y.top<z.maxScrollY?z.maxScrollY:y.top;
A=A===undefined?n.max(n.abs(y.left)*2,n.abs(y.top)*2):A;
z.scrollTo(y.left,y.top,A)
},scrollToPage:function(m,z,B){var A=this,C,D;
B=B===undefined?400:B;
if(A.options.onScrollStart){A.options.onScrollStart.call(A)
}if(A.options.snap){m=m=="next"?A.currPageX+1:m=="prev"?A.currPageX-1:m;
z=z=="next"?A.currPageY+1:z=="prev"?A.currPageY-1:z;
m=m<0?0:m>A.pagesX.length-1?A.pagesX.length-1:m;
z=z<0?0:z>A.pagesY.length-1?A.pagesY.length-1:z;
A.currPageX=m;
A.currPageY=z;
C=A.pagesX[m];
D=A.pagesY[z]
}else{C=-A.wrapperW*m;
D=-A.wrapperH*z;
if(C<A.maxScrollX){C=A.maxScrollX
}if(D<A.maxScrollY){D=A.maxScrollY
}}A.scrollTo(C,D,B)
},disable:function(){this.stop();
this._resetPos(0);
this.enabled=false;
this._unbind(o);
this._unbind(c);
this._unbind(a)
},enable:function(){this.enabled=true
},stop:function(){if(this.options.useTransition){this._unbind("webkitTransitionEnd")
}else{b(this.aniTime)
}this.steps=[];
this.moved=false;
this.animating=false
},zoom:function(C,D,z,B){var A=this,m=z/A.scale;
if(!A.options.useTransform){return
}A.zoomed=true;
B=B===undefined?200:B;
C=C-A.wrapperOffsetLeft-A.x;
D=D-A.wrapperOffsetTop-A.y;
A.x=C-C*m+A.x;
A.y=D-D*m+A.y;
A.scale=z;
A.refresh();
A.x=A.x>0?0:A.x<A.maxScrollX?A.maxScrollX:A.x;
A.y=A.y>A.minScrollY?A.minScrollY:A.y<A.maxScrollY?A.maxScrollY:A.y;
A.scroller.style[w+"TransitionDuration"]=B+"ms";
A.scroller.style[w+"Transform"]=v+A.x+"px,"+A.y+"px"+u+" scale("+z+")";
A.zoomed=false
},isReady:function(){return !this.moved&&!this.zoomed&&!this.animating
}};
if(typeof exports!=="undefined"){exports.iScroll=i
}else{window.iScroll=i
}})();
(function(a){if(a.os.ios){var b={},c;
function d(e){return"tagName" in e?e:e.parentNode
}a(document).bind("gesturestart",function(g){var h=Date.now().getTime(),f=h-(b.last||h);
b.target=d(g.target);
c&&clearTimeout(c);
b.e1=g.scale;
b.last=h
}).bind("gesturechange",function(f){b.e2=f.scale
}).bind("gestureend",function(f){if(b.e2>0){Math.abs(b.e1-b.e2)!=0&&a(b.target).trigger("pinch")&&a(b.target).trigger("pinch"+(b.e1-b.e2>0?"In":"Out"));
b.e1=b.e2=b.last=0
}else{if("last" in b){b={}
}}});
["pinch","pinchIn","pinchOut"].forEach(function(e){a.fn[e]=function(f){return this.bind(e,f)
}
})
}})(Zepto);
(function(a){var h=a.zepto,d=h.qsa,c=h.matches;
function g(i){i=a(i);
return !!(i.width()||i.height())&&i.css("display")!=="none"
}var b=h.cssFilters={visible:function(){if(g(this)){return this
}},hidden:function(){if(!g(this)){return this
}},selected:function(){if(this.selected){return this
}},checked:function(){if(this.checked){return this
}},parent:function(){return this.parentNode
},first:function(i){if(i===0){return this
}},last:function(i,j){if(i===j.length-1){return this
}},eq:function(j,i,k){if(j===k){return this
}},contains:function(j,i,k){if(a(this).text().indexOf(k)>-1){return this
}},has:function(j,i,k){if(h.qsa(this,k).length){return this
}}};
var f=new RegExp("(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*");
function e(n,k){var j,i,l=n.match(f);
if(l&&l[2] in b){var j=b[l[2]],i=l[3];
n=l[1];
if(i){var m=Number(i);
if(isNaN(m)){i=i.replace(/^["']|["']$/g,"")
}else{i=m
}}}return k(n,j,i)
}h.qsa=function(i,j){return e(j,function(o,m,k){try{if(!o&&m){o="*"
}var n=d(i,o)
}catch(l){console.error("error performing selector: %o",j);
throw l
}return !m?n:h.uniq(a.map(n,function(q,p){return m.call(q,p,n,k)
}))
})
};
h.matches=function(i,j){return e(j,function(m,l,k){return(!m||c(i,m))&&(!l||l.call(i,null,k)===i)
})
}
})(Zepto);
var SpinningWheel={cellHeight:44,friction:0.003,slotData:[],handleEvent:function(a){if(a.type=="touchstart"){this.lockScreen(a);
if(a.currentTarget.id=="sw-cancel"||a.currentTarget.id=="sw-done"){this.tapDown(a)
}else{if(a.currentTarget.id=="sw-frame"){this.scrollStart(a)
}}}else{if(a.type=="touchmove"){this.lockScreen(a);
if(a.currentTarget.id=="sw-cancel"||a.currentTarget.id=="sw-done"){this.tapCancel(a)
}else{if(a.currentTarget.id=="sw-frame"){this.scrollMove(a)
}}}else{if(a.type=="touchend"){if(a.currentTarget.id=="sw-cancel"||a.currentTarget.id=="sw-done"){this.tapUp(a)
}else{if(a.currentTarget.id=="sw-frame"){this.scrollEnd(a)
}}}else{if(a.type=="webkitTransitionEnd"){if(a.target.id=="sw-wrapper"){this.destroy()
}else{this.backWithinBoundaries(a)
}}else{if(a.type=="orientationchange"){this.onOrientationChange(a)
}else{if(a.type=="scroll"){this.onScroll(a)
}}}}}}},onOrientationChange:function(a){window.scrollTo(0,0);
this.swWrapper.style.top=window.innerHeight+window.pageYOffset+"px";
this.calculateSlotsWidth()
},onScroll:function(a){this.swWrapper.style.top=window.innerHeight+window.pageYOffset+"px"
},lockScreen:function(a){a.preventDefault();
a.stopPropagation()
},reset:function(){this.slotEl=[];
this.activeSlot=null;
this.swWrapper=undefined;
this.swSlotWrapper=undefined;
this.swSlots=undefined;
this.swFrame=undefined
},calculateSlotsWidth:function(){var a=this.swSlots.getElementsByTagName("div");
for(var b=0;
b<a.length;
b+=1){this.slotEl[b].slotWidth=a[b].offsetWidth
}},create:function(){var b,c,d,e,a;
this.reset();
a=document.createElement("div");
a.id="sw-wrapper";
a.style.top=window.innerHeight+window.pageYOffset+"px";
a.style.webkitTransitionProperty="-webkit-transform";
a.innerHTML='<div id="sw-header"><div id="sw-cancel">Cancel</div><div id="sw-done">Done</div></div><div id="sw-slots-wrapper"><div id="sw-slots"></div></div><div id="sw-frame"></div>';
document.body.appendChild(a);
this.swWrapper=a;
this.swSlotWrapper=document.getElementById("sw-slots-wrapper");
this.swSlots=document.getElementById("sw-slots");
this.swFrame=document.getElementById("sw-frame");
for(c=0;
c<this.slotData.length;
c+=1){e=document.createElement("ul");
d="";
for(b in this.slotData[c].values){d+="<li>"+this.slotData[c].values[b]+"</li>"
}e.innerHTML=d;
a=document.createElement("div");
a.className=this.slotData[c].style;
a.appendChild(e);
this.swSlots.appendChild(a);
e.slotPosition=c;
e.slotYPosition=0;
e.slotWidth=0;
e.slotMaxScroll=this.swSlotWrapper.clientHeight-e.clientHeight-86;
e.style.webkitTransitionTimingFunction="cubic-bezier(0, 0, 0.2, 1)";
this.slotEl.push(e);
if(this.slotData[c].defaultValue){this.scrollToValue(c,this.slotData[c].defaultValue)
}}this.calculateSlotsWidth();
document.addEventListener("touchstart",this,false);
document.addEventListener("touchmove",this,false);
window.addEventListener("orientationchange",this,true);
window.addEventListener("scroll",this,true);
document.getElementById("sw-cancel").addEventListener("touchstart",this,false);
document.getElementById("sw-done").addEventListener("touchstart",this,false);
this.swFrame.addEventListener("touchstart",this,false)
},open:function(){this.create();
this.swWrapper.style.webkitTransitionTimingFunction="ease-out";
this.swWrapper.style.webkitTransitionDuration="400ms";
this.swWrapper.style.webkitTransform="translate3d(0, -260px, 0)"
},destroy:function(){this.swWrapper.removeEventListener("webkitTransitionEnd",this,false);
this.swFrame.removeEventListener("touchstart",this,false);
document.getElementById("sw-cancel").removeEventListener("touchstart",this,false);
document.getElementById("sw-done").removeEventListener("touchstart",this,false);
document.removeEventListener("touchstart",this,false);
document.removeEventListener("touchmove",this,false);
window.removeEventListener("orientationchange",this,true);
window.removeEventListener("scroll",this,true);
this.slotData=[];
this.cancelAction=function(){return false
};
this.cancelDone=function(){return true
};
this.reset();
document.body.removeChild(document.getElementById("sw-wrapper"))
},close:function(){if(this&&this.swWrapper){this.swWrapper.style.webkitTransitionTimingFunction="ease-in";
this.swWrapper.style.webkitTransitionDuration="400ms";
this.swWrapper.style.webkitTransform="translate3d(0, 0, 0)";
this.swWrapper.addEventListener("webkitTransitionEnd",this,false)
}},addSlot:function(e,d,a){if(!d){d=""
}d=d.split(" ");
for(var b=0;
b<d.length;
b+=1){d[b]="sw-"+d[b]
}d=d.join(" ");
var c={values:e,style:d,defaultValue:a};
this.slotData.push(c)
},getSelectedValues:function(){var c,a,b,e,d=[],f=[];
for(b in this.slotEl){this.slotEl[b].removeEventListener("webkitTransitionEnd",this,false);
this.slotEl[b].style.webkitTransitionDuration="0";
if(this.slotEl[b].slotYPosition>0){this.setPosition(b,0)
}else{if(this.slotEl[b].slotYPosition<this.slotEl[b].slotMaxScroll){this.setPosition(b,this.slotEl[b].slotMaxScroll)
}}c=-Math.round(this.slotEl[b].slotYPosition/this.cellHeight);
a=0;
for(e in this.slotData[b].values){if(a==c){d.push(e);
f.push(this.slotData[b].values[e]);
break
}a+=1
}}return{keys:d,values:f}
},setPosition:function(b,a){this.slotEl[b].slotYPosition=a;
this.slotEl[b].style.webkitTransform="translate3d(0, "+a+"px, 0)"
},scrollStart:function(a){var f=a.targetTouches[0].clientX-this.swSlots.offsetLeft;
var c=0;
for(var b=0;
b<this.slotEl.length;
b+=1){c+=this.slotEl[b].slotWidth;
if(f<c){this.activeSlot=b;
break
}}if(this.slotData[this.activeSlot].style.match("readonly")){this.swFrame.removeEventListener("touchmove",this,false);
this.swFrame.removeEventListener("touchend",this,false);
return false
}this.slotEl[this.activeSlot].removeEventListener("webkitTransitionEnd",this,false);
this.slotEl[this.activeSlot].style.webkitTransitionDuration="0";
var d=window.getComputedStyle(this.slotEl[this.activeSlot]).webkitTransform;
d=new WebKitCSSMatrix(d).m42;
if(d!=this.slotEl[this.activeSlot].slotYPosition){this.setPosition(this.activeSlot,d)
}this.startY=a.targetTouches[0].clientY;
this.scrollStartY=this.slotEl[this.activeSlot].slotYPosition;
this.scrollStartTime=a.timeStamp;
this.swFrame.addEventListener("touchmove",this,false);
this.swFrame.addEventListener("touchend",this,false);
return true
},scrollMove:function(a){var b=a.targetTouches[0].clientY-this.startY;
if(this.slotEl[this.activeSlot].slotYPosition>0||this.slotEl[this.activeSlot].slotYPosition<this.slotEl[this.activeSlot].slotMaxScroll){b/=2
}this.setPosition(this.activeSlot,this.slotEl[this.activeSlot].slotYPosition+b);
this.startY=a.targetTouches[0].clientY;
if(a.timeStamp-this.scrollStartTime>80){this.scrollStartY=this.slotEl[this.activeSlot].slotYPosition;
this.scrollStartTime=a.timeStamp
}},scrollEnd:function(a){this.swFrame.removeEventListener("touchmove",this,false);
this.swFrame.removeEventListener("touchend",this,false);
if(this.slotEl[this.activeSlot].slotYPosition>0||this.slotEl[this.activeSlot].slotYPosition<this.slotEl[this.activeSlot].slotMaxScroll){this.scrollTo(this.activeSlot,this.slotEl[this.activeSlot].slotYPosition>0?0:this.slotEl[this.activeSlot].slotMaxScroll);
return false
}var f=this.slotEl[this.activeSlot].slotYPosition-this.scrollStartY;
if(f<this.cellHeight/1.5&&f>-this.cellHeight/1.5){if(this.slotEl[this.activeSlot].slotYPosition%this.cellHeight){this.scrollTo(this.activeSlot,Math.round(this.slotEl[this.activeSlot].slotYPosition/this.cellHeight)*this.cellHeight,"100ms")
}return false
}var g=a.timeStamp-this.scrollStartTime;
var b=(2*f/g)/this.friction;
var d=(this.friction/2)*(b*b);
if(b<0){b=-b;
d=-d
}var c=this.slotEl[this.activeSlot].slotYPosition+d;
if(c>0){c/=2;
b/=3;
if(c>this.swSlotWrapper.clientHeight/4){c=this.swSlotWrapper.clientHeight/4
}}else{if(c<this.slotEl[this.activeSlot].slotMaxScroll){c=(c-this.slotEl[this.activeSlot].slotMaxScroll)/2+this.slotEl[this.activeSlot].slotMaxScroll;
b/=3;
if(c<this.slotEl[this.activeSlot].slotMaxScroll-this.swSlotWrapper.clientHeight/4){c=this.slotEl[this.activeSlot].slotMaxScroll-this.swSlotWrapper.clientHeight/4
}}else{c=Math.round(c/this.cellHeight)*this.cellHeight
}}this.scrollTo(this.activeSlot,Math.round(c),Math.round(b)+"ms");
return true
},scrollTo:function(c,a,b){this.slotEl[c].style.webkitTransitionDuration=b?b:"100ms";
this.setPosition(c,a?a:0);
if(this.slotEl[c].slotYPosition>0||this.slotEl[c].slotYPosition<this.slotEl[c].slotMaxScroll){this.slotEl[c].addEventListener("webkitTransitionEnd",this,false)
}},scrollToValue:function(c,d){var e,a,b;
this.slotEl[c].removeEventListener("webkitTransitionEnd",this,false);
this.slotEl[c].style.webkitTransitionDuration="0";
a=0;
for(b in this.slotData[c].values){if(b==d){e=a*this.cellHeight;
this.setPosition(c,e);
break
}a-=1
}},backWithinBoundaries:function(a){a.target.removeEventListener("webkitTransitionEnd",this,false);
this.scrollTo(a.target.slotPosition,a.target.slotYPosition>0?0:a.target.slotMaxScroll,"150ms");
return false
},tapDown:function(a){a.currentTarget.addEventListener("touchmove",this,false);
a.currentTarget.addEventListener("touchend",this,false);
a.currentTarget.className="sw-pressed"
},tapCancel:function(a){a.currentTarget.removeEventListener("touchmove",this,false);
a.currentTarget.removeEventListener("touchend",this,false);
a.currentTarget.className=""
},tapUp:function(a){this.tapCancel(a);
if(a.currentTarget.id=="sw-cancel"){this.cancelAction()
}else{this.doneAction()
}this.close()
},setCancelAction:function(a){this.cancelAction=a
},setDoneAction:function(a){this.doneAction=a
},cancelAction:function(){return false
},cancelDone:function(){return true
}};
var jLinq;
var jlinq;
var jl;
(function(){var a={command:{query:0,select:1,action:2},exp:{get_path:/\./g,escape_regex:/[\-\[\]\{\}\(\)\*\+\?\.\,\\\^\$\|\#\s]/g},type:{nothing:-1,undefined:0,string:1,number:2,array:3,regex:4,bool:5,method:6,datetime:7,object:99},library:{commands:{},types:{},addType:function(c,b){a.library.types[c]=b
},extend:function(b){if(!a.util.isType(a.type.array,b)){b=[b]
}a.util.each(b,function(c){a.library.commands[c.name]=c
})
},query:function(b,c){if(!a.util.isType(a.type.array,b)){throw"jLinq can only query arrays of objects."
}b=c.clone||(c.clone==null&&jLinq.alwaysClone)?a.util.clone(b):b;
var d={instance:{ignoreCase:jLinq.ignoreCase,not:false,lastCommand:null,lastField:null,records:b,removed:[],or:function(){d.startNewCommandSet()
},query:{}},canRepeatCommand:function(e){return d.instance.lastCommand!=null&&e.length==(d.instance.lastCommand.method.length+1)&&a.util.isType(a.type.string,e[0])
},commands:[[]],execute:function(){var e=[];
var f=d.instance;
a.util.each(d.instance.records,function(g){f.record=g;
if(d.evaluate(f)){e.push(g)
}else{d.instance.removed.push(g)
}});
d.instance.records=e
},findValue:a.util.findValue,evaluate:function(h){for(var e=0,f=d.commands.length;
e<f;
e++){var g=d.commands[e];
if(d.evaluateSet(g,h)){return true
}}return false
},evaluateSet:function(j,k){for(var h in j){if(!j.hasOwnProperty(h)){continue
}var f=j[h];
k.value=d.findValue(k.record,f.path);
k.compare=function(e){return a.util.compare(k.value,e,k)
};
k.when=function(e){return a.util.when(k.value,e,k)
};
try{var i=f.method.apply(k,f.args);
if(f.not){i=!i
}if(!i){return false
}}catch(g){return false
}}return true
},repeat:function(e){if(!d.instance.lastCommand||e==null){return
}e=a.util.toArray(e);
if(d.canRepeatCommand(e)){d.instance.lastField=e[0];
e=a.util.select(e,null,1,null)
}d.queue(d.instance.lastCommand,e)
},queue:function(f,e){d.instance.lastCommand=f;
var g={name:f.name,method:f.method,field:d.instance.lastField,count:f.method.length,args:e,not:d.not};
if(g.args.length>f.method.length){g.field=g.args[0];
g.args=a.util.remaining(g.args,1);
d.instance.lastField=g.field
}g.path=g.field;
d.commands[d.commands.length-1].push(g);
d.not=false
},startNewCommandSet:function(){d.commands.push([])
},setNot:function(){d.not=!d.not
}};
a.util.each(a.library.commands,function(f){if(f.type==a.command.query){var e=function(){d.queue(f,arguments);
return d.instance.query
};
d.instance.query[f.name]=e;
var g=a.util.operatorName(f.name);
d.instance.query["or"+g]=function(){d.startNewCommandSet();
return e.apply(null,arguments)
};
d.instance.query["orNot"+g]=function(){d.startNewCommandSet();
d.setNot();
return e.apply(null,arguments)
};
d.instance.query["and"+g]=function(){return e.apply(null,arguments)
};
d.instance.query["andNot"+g]=function(){d.setNot();
return e.apply(null,arguments)
};
d.instance.query["not"+g]=function(){d.setNot();
return e.apply(null,arguments)
}
}else{if(f.type==a.command.select){d.instance.query[f.name]=function(){d.execute();
var h=d.instance;
h.compare=function(j,i){return a.util.compare(j,i,h)
};
h.when=function(j,i){return a.util.when(j,i,h)
};
return f.method.apply(h,arguments)
}
}else{if(f.type==a.command.action){d.instance.query[f.name]=function(){var h=d.instance;
h.compare=function(j,i){return a.util.compare(j,i,h)
};
h.when=function(j,i){return a.util.when(j,i,h)
};
f.method.apply(h,arguments);
return d.instance.query
}
}}}});
d.instance.query.or=function(){d.startNewCommandSet();
d.repeat(arguments);
return d.instance.query
};
d.instance.query.and=function(){d.repeat(arguments);
return d.instance.query
};
d.instance.query.not=function(){d.setNot();
d.repeat(arguments);
return d.instance.query
};
d.instance.query.andNot=function(){d.setNot();
d.repeat(arguments);
return d.instance.query
};
d.instance.query.orNot=function(){d.startNewCommandSet();
d.setNot();
d.repeat(arguments);
return d.instance.query
};
return d.instance.query
}},util:{trim:function(b){b=b==null?"":b;
b=b.toString();
return b.replace(/^\s*|\s*$/g,"")
},cloneArray:function(b){var c=[];
a.util.each(b,function(d){c.push(a.util.clone(d))
});
return c
},clone:function(d){if(a.util.isType(a.type.array,d)){return a.util.cloneArray(d)
}else{if(a.util.isType(a.type.object,d)){var b={};
for(var c in d){if(d.hasOwnProperty(c)){b[c]=a.util.clone(d[c])
}}return b
}else{return d
}}},invoke:function(f,b){b=b.concat();
var h=b[0];
var d=a.util.findValue(f,h);
b=a.util.select(b,null,1,null);
h=h.replace(/\..*$/,"");
var g=a.util.findValue(f,h);
f=g===d?f:g;
try{var i=d.apply(f,b);
return i
}catch(c){return null
}},getPath:function(b){return a.util.toString(b).split(a.exp.get_path)
},findValue:function(c,d){if(a.util.isType(a.type.array,d)){return a.util.invoke(c,d)
}else{if(a.util.isType(a.type.string,d)){d=a.util.getPath(d);
var b=0;
while(c!=null&&b<d.length){c=c[d[b++]]
}return c
}else{return c
}}},elementAt:function(b,c){return b&&b.length>0&&c<b.length&&c>=0?b[c]:null
},regexEscape:function(b){return(b?b:"").toString().replace(a.exp.escape_regex,"\\$&")
},regexMatch:function(b,d,c){if(a.util.isType(a.type.regex,b)){b=b.source
}b=new RegExp(a.util.toString(b),c?"gi":"g");
return a.util.toString(d).match(b)!=null
},operatorName:function(b){return b.replace(/^\w/,function(c){return c.toUpperCase()
})
},compare:function(e,d,c){var b=a.util.when(e,d,c);
return b==true?b:false
},when:function(g,f,d){var c=a.util.getType(g);
for(var b in f){if(!f.hasOwnProperty(b)){continue
}var e=a.type[b];
if(e==c){return f[b].apply(d,[g])
}}if(f.other){return f.other.apply(d,[g])
}return null
},each:function(c,b){var d=0;
for(var e in c){if(c.hasOwnProperty(e)){b(c[e],d++)
}}},grab:function(c,b){var d=[];
a.util.each(c,function(e){d.push(b(e))
});
return d
},until:function(c,b){for(var d=0,e=c.length;
d<e;
d++){var f=b(c[d],d+1);
if(f===true){return true
}}return false
},isType:function(b,c){return a.util.getType(c)==b
},getType:function(c){if(c==null){return a.type.nothing
}for(var b in a.library.types){if(a.library.types[b](c)){return b
}}return a.type.object
},remaining:function(b,c){var d=[];
for(;
c<b.length;
c++){d.push(b[c])
}return d
},apply:function(d,c){for(var b in c){if(c.hasOwnProperty(b)){d[b]=c[b]
}}return d
},reorder:function(b,c,d){return a.util._performSort(b,c,d)
},_performSort:function(b,e,g){var d=e.splice(0,1);
if(d.length==0){return b
}d=d[0];
var h=a.util.isType(a.type.array,d);
var i=(h?d[0]:d);
var c=i.match(/^\-/);
i=c?i.substr(1):i;
if(c){if(h){d[0]=i
}else{d=i
}}var j=function(o,p){var l=a.util.findValue(o,d);
var m=a.util.findValue(p,d);
if(l==null&&m==null){l=0;
m=0
}else{if(l==null&&m!=null){l=0;
m=1
}else{if(l!=null&&m==null){l=1;
m=0
}else{if(g&&a.util.isType(a.type.string,l)&&a.util.isType(a.type.string,m)){l=l.toLowerCase();
m=m.toLowerCase()
}else{if(l.length&&m.length){l=l.length;
m=m.length
}}}}}var n=(l<m)?-1:(l>m)?1:0;
return c?-n:n
};
b.sort(j);
if(e.length>0){var k=[];
var f=a.util.group(b,d,g);
a.util.each(f,function(l){var m=e.slice();
var n=a.util._performSort(l,m,g);
k=k.concat(n)
});
b=k
}return b
},group:function(i,c,e){var d={};
for(var f=0,g=i.length;
f<g;
f++){var h=i[f];
var b=a.util.toString(a.util.findValue(h,c));
b=e?b.toUpperCase():b;
if(!d[b]){d[b]=[h]
}else{d[b].push(h)
}}return d
},equals:function(c,d,b){return a.util.when(c,{string:function(){return a.util.regexMatch("^"+a.util.regexEscape(d)+"$",c,b)
},other:function(){return(c==null&&d==null)||(c===d)
}})
},toArray:function(e){var d=[];
if(e.length){for(var b=0;
b<e.length;
b++){d.push(e[b])
}}else{for(var c in e){if(e.hasOwnProperty(c)){d.push(e[c])
}}}return d
},toString:function(b){return b==null?"":b.toString()
},skipTake:function(c,b,d,e){d=d==null?0:d;
e=e==null?c.length:e;
if(d>=c.length||e==0){return[]
}return a.util.select(c,b,d,d+e)
},select:function(c,b,j,d){j=j==null?0:j;
d=d==null?c.length:d;
var h=c.slice(j,d);
if(jLinq.util.isType(jLinq.type.object,b)){var f=b;
b=function(l){var i={};
for(var k in f){if(!f.hasOwnProperty(k)){continue
}i[k]=l[k]?l[k]:f[k]
}return i
}
}if(jLinq.util.isType(jLinq.type.method,b)){for(var e=0;
e<h.length;
e++){var g=h[e];
h[e]=b.apply(g,[g])
}}return h
}}};
a.library.addType(a.type.nothing,function(b){return b==null
});
a.library.addType(a.type.array,function(b){return b instanceof Array
});
a.library.addType(a.type.string,function(b){return b.substr&&b.toLowerCase
});
a.library.addType(a.type.number,function(b){return b.toFixed&&b.toExponential
});
a.library.addType(a.type.regex,function(b){return b instanceof RegExp
});
a.library.addType(a.type.bool,function(b){return b==true||b==false
});
a.library.addType(a.type.method,function(b){return b instanceof Function
});
a.library.addType(a.type.datetime,function(b){return b instanceof Date
});
a.library.extend([{name:"ignoreCase",type:a.command.action,method:function(){this.ignoreCase=true
}},{name:"reverse",type:a.command.action,method:function(){this.records.reverse()
}},{name:"useCase",type:a.command.action,method:function(){this.ignoreCase=false
}},{name:"each",type:a.command.action,method:function(b){jLinq.util.each(this.records,function(c){b(c)
})
}},{name:"attach",type:a.command.action,method:function(c,b){this.when(b,{method:function(){jLinq.util.each(this.records,function(d){d[c]=b(d)
})
},other:function(){jLinq.util.each(this.records,function(d){d[c]=b
})
}})
}},{name:"join",type:a.command.action,method:function(e,b,d,c){jLinq.util.each(this.records,function(f){f[b]=jLinq.from(e).equals(c,f[d]).select()
})
}},{name:"assign",type:a.command.action,method:function(f,b,e,d,c){jLinq.util.each(this.records,function(g){g[b]=jLinq.from(f).equals(d,g[e]).first(c)
})
}},{name:"sort",type:a.command.action,method:function(){var b=jLinq.util.toArray(arguments);
this.records=jLinq.util.reorder(this.records,b,this.ignoreCase)
}},{name:"equals",type:a.command.query,method:function(b){return jLinq.util.equals(this.value,b,this.ignoreCase)
}},{name:"starts",type:a.command.query,method:function(b){return this.compare({array:function(){return jLinq.util.equals(this.value[0],b,this.ignoreCase)
},other:function(){return jLinq.util.regexMatch(("^"+jLinq.util.regexEscape(b)),this.value,this.ignoreCase)
}})
}},{name:"ends",type:a.command.query,method:function(b){return this.compare({array:function(){return jLinq.util.equals(this.value[this.value.length-1],b,this.ignoreCase)
},other:function(){return jLinq.util.regexMatch((jLinq.util.regexEscape(b)+"$"),this.value,this.ignoreCase)
}})
}},{name:"contains",type:a.command.query,method:function(b){return this.compare({array:function(){var c=this.ignoreCase;
return jLinq.util.until(this.value,function(d){return jLinq.util.equals(d,b,c)
})
},other:function(){return jLinq.util.regexMatch(jLinq.util.regexEscape(b),this.value,this.ignoreCase)
}})
}},{name:"match",type:a.command.query,method:function(b){return this.compare({array:function(){var c=this.ignoreCase;
return jLinq.util.until(this.value,function(d){return jLinq.util.regexMatch(b,d,c)
})
},other:function(){return jLinq.util.regexMatch(b,this.value,this.ignoreCase)
}})
}},{name:"type",type:a.command.query,method:function(b){return jLinq.util.isType(b,this.value)
}},{name:"greater",type:a.command.query,method:function(b){return this.compare({array:function(){return this.value.length>b
},string:function(){return this.value.length>b
},other:function(){return this.value>b
}})
}},{name:"greaterEquals",type:a.command.query,method:function(b){return this.compare({array:function(){return this.value.length>=b
},string:function(){return this.value.length>=b
},other:function(){return this.value>=b
}})
}},{name:"less",type:a.command.query,method:function(b){return this.compare({array:function(){return this.value.length<b
},string:function(){return this.value.length<b
},other:function(){return this.value<b
}})
}},{name:"lessEquals",type:a.command.query,method:function(b){return this.compare({array:function(){return this.value.length<=b
},string:function(){return this.value.length<=b
},other:function(){return this.value<=b
}})
}},{name:"between",type:a.command.query,method:function(c,b){return this.compare({array:function(){return this.value.length>c&&this.value.length<b
},string:function(){return this.value.length>c&&this.value.length<b
},other:function(){return this.value>c&&this.value<b
}})
}},{name:"betweenEquals",type:a.command.query,method:function(c,b){return this.compare({array:function(){return this.value.length>=c&&this.value.length<=b
},string:function(){return this.value.length>=c&&this.value.length<=b
},other:function(){return this.value>=c&&this.value<=b
}})
}},{name:"empty",type:a.command.query,method:function(){return this.compare({array:function(){return this.value.length==0
},string:function(){return jLinq.util.trim(this.value).length==0
},other:function(){return this.value==null
}})
}},{name:"is",type:a.command.query,method:function(){return this.compare({bool:function(){return this.value===true
},other:function(){return this.value!=null
}})
}},{name:"min",type:a.command.select,method:function(b){var c=jLinq.util.reorder(this.records,[b],this.ignoreCase);
return jLinq.util.elementAt(c,0)
}},{name:"max",type:a.command.select,method:function(b){var c=jLinq.util.reorder(this.records,[b],this.ignoreCase);
return jLinq.util.elementAt(c,c.length-1)
}},{name:"sum",type:a.command.select,method:function(b){var c;
jLinq.util.each(this.records,function(d){var e=jLinq.util.findValue(d,b);
c=c==null?e:(c+e)
});
return c
}},{name:"average",type:a.command.select,method:function(b){var c;
jLinq.util.each(this.records,function(d){var e=jLinq.util.findValue(d,b);
c=c==null?e:(c+e)
});
return c/this.records.length
}},{name:"skip",type:a.command.select,method:function(c,b){this.records=this.when(b,{method:function(){return jLinq.util.skipTake(this.records,b,c,null)
},object:function(){return jLinq.util.skipTake(this.records,b,c,null)
},other:function(){return jLinq.util.skipTake(this.records,null,c,null)
}});
return this.query
}},{name:"take",type:a.command.select,method:function(c,b){return this.when(b,{method:function(){return jLinq.util.skipTake(this.records,b,null,c)
},object:function(){return jLinq.util.skipTake(this.records,b,null,c)
},other:function(){return jLinq.util.skipTake(this.records,null,null,c)
}})
}},{name:"skipTake",type:a.command.select,method:function(c,d,b){return this.when(b,{method:function(){return jLinq.util.skipTake(this.records,b,c,d)
},object:function(){return jLinq.util.skipTake(this.records,b,c,d)
},other:function(){return jLinq.util.skipTake(this.records,null,c,d)
}})
}},{name:"select",type:a.command.select,method:function(b){return this.when(b,{method:function(){return jLinq.util.select(this.records,b)
},object:function(){return jLinq.util.select(this.records,b)
},other:function(){return this.records
}})
}},{name:"distinct",type:a.command.select,method:function(b){var c=jLinq.util.group(this.records,b,this.ignoreCase);
return jLinq.util.grab(c,function(d){return jLinq.util.findValue(d[0],b)
})
}},{name:"group",type:a.command.select,method:function(b){return jLinq.util.group(this.records,b,this.ignoreCase)
}},{name:"define",type:a.command.select,method:function(c){var b=this.when(c,{method:function(){return jLinq.util.select(this.records,c)
},object:function(){return jLinq.util.select(this.records,c)
},other:function(){return this.records
}});
return jLinq.from(b)
}},{name:"any",type:a.command.select,method:function(){return this.records.length>0
}},{name:"none",type:a.command.select,method:function(){return this.records.length==0
}},{name:"all",type:a.command.select,method:function(){return this.removed.length==0
}},{name:"first",type:a.command.select,method:function(b){var c=jLinq.util.elementAt(this.records,0);
return c==null?b:c
}},{name:"last",type:a.command.select,method:function(b){var c=jLinq.util.elementAt(this.records,this.records.length-1);
return c==null?b:c
}},{name:"at",type:a.command.select,method:function(c,b){var d=jLinq.util.elementAt(this.records,c);
return d==null?b:d
}},{name:"count",type:a.command.select,method:function(){return this.records.length
}},{name:"removed",type:a.command.select,method:function(b){return this.when(b,{method:function(){return jLinq.util.select(this.removed,b)
},object:function(){return jLinq.util.select(this.removed,b)
},other:function(){return this.removed
}})
}},{name:"where",type:a.command.select,method:function(b){var e=this;
var c=[];
jLinq.util.each(this.records,function(f){if(b.apply(e,[f])===true){c.push(f)
}});
var d=jLinq.from(c);
if(!this.ignoreCase){d.useCase()
}return d
}}]);
jLinq={alwaysClone:false,ignoreCase:true,command:a.command,type:a.type,extend:function(){a.library.extend.apply(null,arguments)
},query:function(b,c){return library.framework.query(b,c)
},from:function(b){return a.library.query(b,{clone:false})
},getCommands:function(){return a.util.grab(a.library.commands,function(b){return{name:b.name,typeId:b.type,type:b.type==a.command.select?"select":b.type==a.command.query?"query":b.type==a.command.action?"action":"unknown"}
})
},util:{trim:a.util.trim,findValue:a.util.findValue,elementAt:a.util.elementAt,regexEscape:a.util.regexEscape,regexMatch:a.util.regexMatch,equals:a.util.equals,group:a.util.group,reorder:a.util.reorder,when:a.util.when,toArray:a.util.toArray,each:a.util.each,grab:a.util.grab,until:a.util.until,isType:a.util.isType,getType:a.util.getType,apply:a.util.apply,select:a.util.select,skipTake:a.util.skipTake}};
jlinq=jLinq;
jl=jLinq
})();
/* jquery.swipeButton.js - v1.2.0 - 2012-05-31
* http://andymatthews.net/code/swipebutton/
* Copyright (c) 2012 andy matthews; Licensed MIT, GPL */
(function(a){a.fn.swipeDelete=function(b){b=a.extend({},a.fn.swipeDelete.defaults,b);
return a("[data-swipe]",this).each(function(f,e){var c=a(e);
var d=a(e).parent("ul");
c.on(b.direction,function(k){var g=a(this).parent(),j=a(".ui-btn",g).length,l=g.hasClass("arrow"),i=(b.btnClass==="redButton")?b.btnClass:"redButton";
if(l){g.removeClass("arrow")
}a("div.ui-btn > ."+i).animate({width:"0px"},100,"ease-in",function(m){a(this).parent().remove();
g.addClass("arrow");
a("a",g).data("link",g.data("link"))
});
if(!j){var h=a("<a>"+b.btnLabel+"</a>").attr({"class":i+" aSwipeBtn"}).on("click",b.click);
h.prependTo(g).wrap('<div class="ui-btn"></div>');
g.find(".ui-btn > ."+i).animate({width:"45px"},100);
g.data("link",a("a[data-link]",g).data("link"));
a("a[data-link]",g).data("link","");
a(g).on("tap",function(m){m.stopPropagation();
m.preventDefault();
return false
})
}})
})
};
a.fn.swipeDelete.defaults={direction:"swipeRight",btnLabel:"Delete",btnClass:"redButton",click:function(b){b.preventDefault();
a(this).parents("li").slideUp()
}}
}($));
Date.CultureInfo={name:"en-US",englishName:"English (United States)",nativeName:"English (United States)",dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],abbreviatedDayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],shortestDayNames:["Su","Mo","Tu","We","Th","Fr","Sa"],firstLetterDayNames:["S","M","T","W","T","F","S"],monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],abbreviatedMonthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],amDesignator:"AM",pmDesignator:"PM",firstDayOfWeek:0,twoDigitYearMax:2029,dateElementOrder:"mdy",formatPatterns:{shortDate:"M/d/yyyy",longDate:"dddd, MMMM dd, yyyy",shortTime:"h:mm tt",longTime:"h:mm:ss tt",fullDateTime:"dddd, MMMM dd, yyyy h:mm:ss tt",sortableDateTime:"yyyy-MM-ddTHH:mm:ss",universalSortableDateTime:"yyyy-MM-dd HH:mm:ssZ",rfc1123:"ddd, dd MMM yyyy HH:mm:ss GMT",monthDay:"MMMM dd",yearMonth:"MMMM, yyyy"},regexPatterns:{jan:/^jan(uary)?/i,feb:/^feb(ruary)?/i,mar:/^mar(ch)?/i,apr:/^apr(il)?/i,may:/^may/i,jun:/^jun(e)?/i,jul:/^jul(y)?/i,aug:/^aug(ust)?/i,sep:/^sep(t(ember)?)?/i,oct:/^oct(ober)?/i,nov:/^nov(ember)?/i,dec:/^dec(ember)?/i,sun:/^su(n(day)?)?/i,mon:/^mo(n(day)?)?/i,tue:/^tu(e(s(day)?)?)?/i,wed:/^we(d(nesday)?)?/i,thu:/^th(u(r(s(day)?)?)?)?/i,fri:/^fr(i(day)?)?/i,sat:/^sa(t(urday)?)?/i,future:/^next/i,past:/^last|past|prev(ious)?/i,add:/^(\+|after|from)/i,subtract:/^(\-|before|ago)/i,yesterday:/^yesterday/i,today:/^t(oday)?/i,tomorrow:/^tomorrow/i,now:/^n(ow)?/i,millisecond:/^ms|milli(second)?s?/i,second:/^sec(ond)?s?/i,minute:/^min(ute)?s?/i,hour:/^h(ou)?rs?/i,week:/^w(ee)?k/i,month:/^m(o(nth)?s?)?/i,day:/^d(ays?)?/i,year:/^y((ea)?rs?)?/i,shortMeridian:/^(a|p)/i,longMeridian:/^(a\.?m?\.?|p\.?m?\.?)/i,timezone:/^((e(s|d)t|c(s|d)t|m(s|d)t|p(s|d)t)|((gmt)?\s*(\+|\-)\s*\d\d\d\d?)|gmt)/i,ordinalSuffix:/^\s*(st|nd|rd|th)/i,timeContext:/^\s*(\:|a|p)/i},abbreviatedTimeZoneStandard:{GMT:"-000",EST:"-0400",CST:"-0500",MST:"-0600",PST:"-0700"},abbreviatedTimeZoneDST:{GMT:"-000",EDT:"-0500",CDT:"-0600",MDT:"-0700",PDT:"-0800"}};
Date.getMonthNumberFromName=function(d){var c=Date.CultureInfo.monthNames,b=Date.CultureInfo.abbreviatedMonthNames,e=d.toLowerCase();
for(var a=0;
a<c.length;
a++){if(c[a].toLowerCase()==e||b[a].toLowerCase()==e){return a
}}return -1
};
Date.getDayNumberFromName=function(d){var c=Date.CultureInfo.dayNames,b=Date.CultureInfo.abbreviatedDayNames,e=Date.CultureInfo.shortestDayNames,f=d.toLowerCase();
for(var a=0;
a<c.length;
a++){if(c[a].toLowerCase()==f||b[a].toLowerCase()==f){return a
}}return -1
};
Date.isLeapYear=function(a){return(((a%4===0)&&(a%100!==0))||(a%400===0))
};
Date.getDaysInMonth=function(b,a){return[31,(Date.isLeapYear(b)?29:28),31,30,31,30,31,31,30,31,30,31][a]
};
Date.getTimezoneOffset=function(b,a){return(a||false)?Date.CultureInfo.abbreviatedTimeZoneDST[b.toUpperCase()]:Date.CultureInfo.abbreviatedTimeZoneStandard[b.toUpperCase()]
};
Date.getTimezoneAbbreviation=function(c,a){var b=(a||false)?Date.CultureInfo.abbreviatedTimeZoneDST:Date.CultureInfo.abbreviatedTimeZoneStandard,d;
for(d in b){if(b[d]===c){return d
}}return null
};
Date.prototype.clone=function(){return new Date(this.getTime())
};
Date.prototype.compareTo=function(a){if(isNaN(this)){throw new Error(this)
}if(a instanceof Date&&!isNaN(a)){return(this>a)?1:(this<a)?-1:0
}else{throw new TypeError(a)
}};
Date.prototype.equals=function(a){return(this.compareTo(a)===0)
};
Date.prototype.between=function(b,a){var c=this.getTime();
return c>=b.getTime()&&c<=a.getTime()
};
Date.prototype.addMilliseconds=function(a){this.setMilliseconds(this.getMilliseconds()+a);
return this
};
Date.prototype.addSeconds=function(a){return this.addMilliseconds(a*1000)
};
Date.prototype.addMinutes=function(a){return this.addMilliseconds(a*60000)
};
Date.prototype.addHours=function(a){return this.addMilliseconds(a*3600000)
};
Date.prototype.addDays=function(a){return this.addMilliseconds(a*86400000)
};
Date.prototype.addWeeks=function(a){return this.addMilliseconds(a*604800000)
};
Date.prototype.addMonths=function(b){var a=this.getDate();
this.setDate(1);
this.setMonth(this.getMonth()+b);
this.setDate(Math.min(a,this.getDaysInMonth()));
return this
};
Date.prototype.addYears=function(a){return this.addMonths(a*12)
};
Date.prototype.add=function(a){if(typeof a=="number"){this._orient=a;
return this
}var b=a;
if(b.millisecond||b.milliseconds){this.addMilliseconds(b.millisecond||b.milliseconds)
}if(b.second||b.seconds){this.addSeconds(b.second||b.seconds)
}if(b.minute||b.minutes){this.addMinutes(b.minute||b.minutes)
}if(b.hour||b.hours){this.addHours(b.hour||b.hours)
}if(b.month||b.months){this.addMonths(b.month||b.months)
}if(b.year||b.years){this.addYears(b.year||b.years)
}if(b.day||b.days){this.addDays(b.day||b.days)
}return this
};
Date._validate=function(d,b,a,c){if(typeof d!="number"){throw new TypeError(d+" is not a Number.")
}else{if(d<b||d>a){throw new RangeError(d+" is not a valid value for "+c+".")
}}return true
};
Date.validateMillisecond=function(a){return Date._validate(a,0,999,"milliseconds")
};
Date.validateSecond=function(a){return Date._validate(a,0,59,"seconds")
};
Date.validateMinute=function(a){return Date._validate(a,0,59,"minutes")
};
Date.validateHour=function(a){return Date._validate(a,0,23,"hours")
};
Date.validateDay=function(b,c,a){return Date._validate(b,1,Date.getDaysInMonth(c,a),"days")
};
Date.validateMonth=function(a){return Date._validate(a,0,11,"months")
};
Date.validateYear=function(a){return Date._validate(a,1,9999,"seconds")
};
Date.prototype.set=function(a){var b=a;
if(!b.millisecond&&b.millisecond!==0){b.millisecond=-1
}if(!b.second&&b.second!==0){b.second=-1
}if(!b.minute&&b.minute!==0){b.minute=-1
}if(!b.hour&&b.hour!==0){b.hour=-1
}if(!b.day&&b.day!==0){b.day=-1
}if(!b.month&&b.month!==0){b.month=-1
}if(!b.year&&b.year!==0){b.year=-1
}if(b.millisecond!=-1&&Date.validateMillisecond(b.millisecond)){this.addMilliseconds(b.millisecond-this.getMilliseconds())
}if(b.second!=-1&&Date.validateSecond(b.second)){this.addSeconds(b.second-this.getSeconds())
}if(b.minute!=-1&&Date.validateMinute(b.minute)){this.addMinutes(b.minute-this.getMinutes())
}if(b.hour!=-1&&Date.validateHour(b.hour)){this.addHours(b.hour-this.getHours())
}if(b.month!==-1&&Date.validateMonth(b.month)){this.addMonths(b.month-this.getMonth())
}if(b.year!=-1&&Date.validateYear(b.year)){this.addYears(b.year-this.getFullYear())
}if(b.day!=-1&&Date.validateDay(b.day,this.getFullYear(),this.getMonth())){this.addDays(b.day-this.getDate())
}if(b.timezone){this.setTimezone(b.timezone)
}if(b.timezoneOffset){this.setTimezoneOffset(b.timezoneOffset)
}return this
};
Date.prototype.clearTime=function(){this.setHours(0);
this.setMinutes(0);
this.setSeconds(0);
this.setMilliseconds(0);
return this
};
Date.prototype.isLeapYear=function(){var a=this.getFullYear();
return(((a%4===0)&&(a%100!==0))||(a%400===0))
};
Date.prototype.isWeekday=function(){return !(this.is().sat()||this.is().sun())
};
Date.prototype.getDaysInMonth=function(){return Date.getDaysInMonth(this.getFullYear(),this.getMonth())
};
Date.prototype.moveToFirstDayOfMonth=function(){return this.set({day:1})
};
Date.prototype.moveToLastDayOfMonth=function(){return this.set({day:this.getDaysInMonth()})
};
Date.prototype.moveToDayOfWeek=function(a,c){var b=(a-this.getDay()+7*(c||+1))%7;
return this.addDays((b===0)?b+=7*(c||+1):b)
};
Date.prototype.moveToMonth=function(b,c){var a=(b-this.getMonth()+12*(c||+1))%12;
return this.addMonths((a===0)?a+=12*(c||+1):a)
};
Date.prototype.getDayOfYear=function(){return Math.floor((this-new Date(this.getFullYear(),0,1))/86400000)
};
Date.prototype.getWeekOfYear=function(e){var j=this.getFullYear(),f=this.getMonth(),a=this.getDate();
var c=e||Date.CultureInfo.firstDayOfWeek;
var g=7+1-new Date(j,0,1).getDay();
if(g==8){g=1
}var b=((Date.UTC(j,f,a,0,0,0)-Date.UTC(j,0,1,0,0,0))/86400000)+1;
var i=Math.floor((b-g+7)/7);
if(i===c){j--;
var h=7+1-new Date(j,0,1).getDay();
if(h==2||h==8){i=53
}else{i=52
}}return i
};
Date.prototype.isDST=function(){console.log("isDST");
return this.toString().match(/(E|C|M|P)(S|D)T/)[2]=="D"
};
Date.prototype.getTimezone=function(){return Date.getTimezoneAbbreviation(this.getUTCOffset,this.isDST())
};
Date.prototype.setTimezoneOffset=function(b){var a=this.getTimezoneOffset(),c=Number(b)*-6/10;
this.addMinutes(c-a);
return this
};
Date.prototype.setTimezone=function(a){return this.setTimezoneOffset(Date.getTimezoneOffset(a))
};
Date.prototype.getUTCOffset=function(){var a=this.getTimezoneOffset()*-10/6,b;
if(a<0){b=(a-10000).toString();
return b[0]+b.substr(2)
}else{b=(a+10000).toString();
return"+"+b.substr(1)
}};
Date.prototype.getDayName=function(a){return a?Date.CultureInfo.abbreviatedDayNames[this.getDay()]:Date.CultureInfo.dayNames[this.getDay()]
};
Date.prototype.getMonthName=function(a){return a?Date.CultureInfo.abbreviatedMonthNames[this.getMonth()]:Date.CultureInfo.monthNames[this.getMonth()]
};
Date.prototype._toString=Date.prototype.toString;
Date.prototype.toString=function(a){var c=this;
var b=function b(d){return(d.toString().length==1)?"0"+d:d
};
return a?a.replace(/dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?/g,function(d){switch(d){case"hh":return b(c.getHours()<13?c.getHours():(c.getHours()-12));
case"h":return c.getHours()<13?c.getHours():(c.getHours()-12);
case"HH":return b(c.getHours());
case"H":return c.getHours();
case"mm":return b(c.getMinutes());
case"m":return c.getMinutes();
case"ss":return b(c.getSeconds());
case"s":return c.getSeconds();
case"yyyy":return c.getFullYear();
case"yy":return c.getFullYear().toString().substring(2,4);
case"dddd":return c.getDayName();
case"ddd":return c.getDayName(true);
case"dd":return b(c.getDate());
case"d":return c.getDate().toString();
case"MMMM":return c.getMonthName();
case"MMM":return c.getMonthName(true);
case"MM":return b((c.getMonth()+1));
case"M":return c.getMonth()+1;
case"t":return c.getHours()<12?Date.CultureInfo.amDesignator.substring(0,1):Date.CultureInfo.pmDesignator.substring(0,1);
case"tt":return c.getHours()<12?Date.CultureInfo.amDesignator:Date.CultureInfo.pmDesignator;
case"zzz":case"zz":case"z":return""
}}):this._toString()
};
Date.now=function(){return new Date()
};
Date.today=function(){return Date.now().clearTime()
};
Date.prototype._orient=+1;
Date.prototype.next=function(){this._orient=+1;
return this
};
Date.prototype.last=Date.prototype.prev=Date.prototype.previous=function(){this._orient=-1;
return this
};
Date.prototype._is=false;
Date.prototype.is=function(){this._is=true;
return this
};
Number.prototype._dateElement="day";
Number.prototype.fromNow=function(){var a={};
a[this._dateElement]=this;
return Date.now().add(a)
};
Number.prototype.ago=function(){var a={};
a[this._dateElement]=this*-1;
return Date.now().add(a)
};
(function(){var a=Date.prototype,b=Number.prototype;
var e=("sunday monday tuesday wednesday thursday friday saturday").split(/\s/),n=("january february march april may june july august september october november december").split(/\s/),p=("Millisecond Second Minute Hour Day Week Month Year").split(/\s/),c;
var d=function(i){return function(){if(this._is){this._is=false;
return this.getDay()==i
}return this.moveToDayOfWeek(i,this._orient)
}
};
for(var g=0;
g<e.length;
g++){a[e[g]]=a[e[g].substring(0,3)]=d(g)
}var m=function(i){return function(){if(this._is){this._is=false;
return this.getMonth()===i
}return this.moveToMonth(i,this._orient)
}
};
for(var h=0;
h<n.length;
h++){a[n[h]]=a[n[h].substring(0,3)]=m(h)
}var f=function(i){return function(){if(i.substring(i.length-1)!="s"){i+="s"
}return this["add"+i](this._orient)
}
};
var o=function(i){return function(){this._dateElement=i;
return this
}
};
for(var l=0;
l<p.length;
l++){c=p[l].toLowerCase();
a[c]=a[c+"s"]=f(p[l]);
b[c]=b[c+"s"]=o(c)
}}());
Date.prototype.toJSONString=function(){return this.toString("yyyy-MM-ddThh:mm:ssZ")
};
Date.prototype.toShortDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortDatePattern)
};
Date.prototype.toLongDateString=function(){return this.toString(Date.CultureInfo.formatPatterns.longDatePattern)
};
Date.prototype.toShortTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.shortTimePattern)
};
Date.prototype.toLongTimeString=function(){return this.toString(Date.CultureInfo.formatPatterns.longTimePattern)
};
Date.prototype.getOrdinal=function(){switch(this.getDate()){case 1:case 21:case 31:return"st";
case 2:case 22:return"nd";
case 3:case 23:return"rd";
default:return"th"
}};
(function(){Date.Parsing={Exception:function(i){this.message="Parse error at '"+i.substring(0,10)+" ...'"
}};
var a=Date.Parsing;
var b=a.Operators={rtoken:function(i){return function(k){var j=k.match(i);
if(j){return([j[0],k.substring(j[0].length)])
}else{throw new a.Exception(k)
}}
},token:function(i){return function(j){return b.rtoken(new RegExp("^s*"+j+"s*"))(j)
}
},stoken:function(i){return b.rtoken(new RegExp("^"+i))
},until:function(i){return function(m){var k=[],l=null;
while(m.length){try{l=i.call(this,m)
}catch(j){k.push(l[0]);
m=l[1];
continue
}break
}return[k,m]
}
},many:function(i){return function(m){var l=[],k=null;
while(m.length){try{k=i.call(this,m)
}catch(j){return[l,m]
}l.push(k[0]);
m=k[1]
}return[l,m]
}
},optional:function(i){return function(l){var k=null;
try{k=i.call(this,l)
}catch(j){return[null,l]
}return[k[0],k[1]]
}
},not:function(i){return function(k){try{i.call(this,k)
}catch(j){return[null,k]
}throw new a.Exception(k)
}
},ignore:function(i){return i?function(k){var j=null;
j=i.call(this,k);
return[null,j[1]]
}:null
},product:function(){var k=arguments[0],l=Array.prototype.slice.call(arguments,1),m=[];
for(var j=0;
j<k.length;
j++){m.push(b.each(k[j],l))
}return m
},cache:function(k){var i={},j=null;
return function(m){try{j=i[m]=(i[m]||k.call(this,m))
}catch(l){j=i[m]=l
}if(j instanceof a.Exception){throw j
}else{return j
}}
},any:function(){var i=arguments;
return function(m){var l=null;
for(var k=0;
k<i.length;
k++){if(i[k]==null){continue
}try{l=(i[k].call(this,m))
}catch(j){l=null
}if(l){return l
}}throw new a.Exception(m)
}
},each:function(){var i=arguments;
return function(n){var m=[],l=null;
for(var k=0;
k<i.length;
k++){if(i[k]==null){continue
}try{l=(i[k].call(this,n))
}catch(j){throw new a.Exception(n)
}m.push(l[0]);
n=l[1]
}return[m,n]
}
},all:function(){var j=arguments,i=i;
return i.each(i.optional(j))
},sequence:function(k,j,i){j=j||b.rtoken(/^\s*/);
i=i||null;
if(k.length==1){return k[0]
}return function(v){var t=null,p=null;
var u=[];
for(var o=0;
o<k.length;
o++){try{t=k[o].call(this,v)
}catch(l){break
}u.push(t[0]);
try{p=j.call(this,t[1])
}catch(m){p=null;
break
}v=p[1]
}if(!t){throw new a.Exception(v)
}if(p){throw new a.Exception(p[1])
}if(i){try{t=i.call(this,t[1])
}catch(n){throw new a.Exception(t[1])
}}return[u,(t?t[1]:v)]
}
},between:function(j,l,k){k=k||j;
var i=b.each(b.ignore(j),l,b.ignore(k));
return function(n){var m=i.call(this,n);
return[[m[0][0],r[0][2]],m[1]]
}
},list:function(k,j,i){j=j||b.rtoken(/^\s*/);
i=i||null;
return(k instanceof Array?b.each(b.product(k.slice(0,-1),b.ignore(j)),k.slice(-1),b.ignore(i)):b.each(b.many(b.each(k,b.ignore(j))),px,b.ignore(i)))
},set:function(k,j,i){j=j||b.rtoken(/^\s*/);
i=i||null;
return function(B){var z=null,w=null,x=null,A=null,l=[[],B],v=false;
for(var t=0;
t<k.length;
t++){x=null;
w=null;
z=null;
v=(k.length==1);
try{z=k[t].call(this,B)
}catch(m){continue
}A=[[z[0]],z[1]];
if(z[1].length>0&&!v){try{x=j.call(this,z[1])
}catch(n){v=true
}}else{v=true
}if(!v&&x[1].length===0){v=true
}if(!v){var y=[];
for(var u=0;
u<k.length;
u++){if(t!=u){y.push(k[u])
}}w=b.set(y,j).call(this,x[1]);
if(w[0].length>0){A[0]=A[0].concat(w[0]);
A[1]=w[1]
}}if(A[1].length<l[1].length){l=A
}if(l[1].length===0){break
}}if(l[0].length===0){return l
}if(i){try{x=i.call(this,l[1])
}catch(o){throw new a.Exception(l[1])
}l[1]=x[1]
}return l
}
},forward:function(j,i){return function(k){return j[i].call(this,k)
}
},replace:function(j,i){return function(l){var k=j.call(this,l);
return[i,k[1]]
}
},process:function(j,i){return function(l){var k=j.call(this,l);
return[i.call(this,k[0]),k[1]]
}
},min:function(i,j){return function(l){var k=j.call(this,l);
if(k[0].length<i){throw new a.Exception(l)
}return k
}
}};
var c=function(i){return function(){var j=null,m=[];
if(arguments.length>1){j=Array.prototype.slice.call(arguments)
}else{if(arguments[0] instanceof Array){j=arguments[0]
}}if(j){for(var k=0,l=j.shift();
k<l.length;
k++){j.unshift(l[k]);
m.push(i.apply(null,j));
j.shift();
return m
}}else{return i.apply(null,arguments)
}}
};
var e="optional not ignore cache".split(/\s/);
for(var f=0;
f<e.length;
f++){b[e[f]]=c(b[e[f]])
}var d=function(i){return function(){if(arguments[0] instanceof Array){return i.apply(null,arguments[0])
}else{return i.apply(null,arguments)
}}
};
var h="each any all".split(/\s/);
for(var g=0;
g<h.length;
g++){b[h[g]]=d(b[h[g]])
}}());
(function(){var f=function(g){var k=[];
for(var j=0;
j<g.length;
j++){if(g[j] instanceof Array){k=k.concat(f(g[j]))
}else{if(g[j]){k.push(g[j])
}}}return k
};
Date.Grammar={};
Date.Translator={hour:function(g){return function(){this.hour=Number(g)
}
},minute:function(g){return function(){this.minute=Number(g)
}
},second:function(g){return function(){this.second=Number(g)
}
},meridian:function(g){return function(){this.meridian=g.slice(0,1).toLowerCase()
}
},timezone:function(g){return function(){var j=g.replace(/[^\d\+\-]/g,"");
if(j.length){this.timezoneOffset=Number(j)
}else{this.timezone=g.toLowerCase()
}}
},day:function(j){var g=j[0];
return function(){this.day=Number(g.match(/\d+/)[0])
}
},month:function(g){return function(){this.month=((g.length==3)?Date.getMonthNumberFromName(g):(Number(g)-1))
}
},year:function(g){return function(){var j=Number(g);
this.year=((g.length>2)?j:(j+(((j+2000)<Date.CultureInfo.twoDigitYearMax)?2000:1900)))
}
},rday:function(g){return function(){switch(g){case"yesterday":this.days=-1;
break;
case"tomorrow":this.days=1;
break;
case"today":this.days=0;
break;
case"now":this.days=0;
this.now=true;
break
}}
},finishExact:function(l){l=(l instanceof Array)?l:[l];
var j=new Date();
this.year=j.getFullYear();
this.month=j.getMonth();
this.day=1;
this.hour=0;
this.minute=0;
this.second=0;
for(var g=0;
g<l.length;
g++){if(l[g]){l[g].call(this)
}}this.hour=(this.meridian=="p"&&this.hour<13)?this.hour+12:this.hour;
if(this.day>Date.getDaysInMonth(this.year,this.month)){throw new RangeError(this.day+" is not a valid value for days.")
}var k=new Date(this.year,this.month,this.day,this.hour,this.minute,this.second);
if(this.timezone){k.set({timezone:this.timezone})
}else{if(this.timezoneOffset){k.set({timezoneOffset:this.timezoneOffset})
}}return k
},finish:function(p){p=(p instanceof Array)?f(p):[p];
if(p.length===0){return null
}for(var k=0;
k<p.length;
k++){if(typeof p[k]=="function"){p[k].call(this)
}}if(this.now){return new Date()
}var o=Date.today();
var l=null;
var g=!!(this.days!=null||this.orient||this.operator);
if(g){var j,m,n;
n=((this.orient=="past"||this.operator=="subtract")?-1:1);
if(this.weekday){this.unit="day";
j=(Date.getDayNumberFromName(this.weekday)-o.getDay());
m=7;
this.days=j?((j+(n*m))%m):(n*m)
}if(this.month){this.unit="month";
j=(this.month-o.getMonth());
m=12;
this.months=j?((j+(n*m))%m):(n*m);
this.month=null
}if(!this.unit){this.unit="day"
}if(this[this.unit+"s"]==null||this.operator!=null){if(!this.value){this.value=1
}if(this.unit=="week"){this.unit="day";
this.value=this.value*7
}this[this.unit+"s"]=this.value*n
}return o.add(this)
}else{if(this.meridian&&this.hour){this.hour=(this.hour<13&&this.meridian=="p")?this.hour+12:this.hour
}if(this.weekday&&!this.day){this.day=(o.addDays((Date.getDayNumberFromName(this.weekday)-o.getDay()))).getDate()
}if(this.month&&!this.day){this.day=1
}return o.set(this)
}}};
var a=Date.Parsing.Operators,h=Date.Grammar,i=Date.Translator,d;
h.datePartDelimiter=a.rtoken(/^([\s\-\.\,\/\x27]+)/);
h.timePartDelimiter=a.stoken(":");
h.whiteSpace=a.rtoken(/^\s*/);
h.generalDelimiter=a.rtoken(/^(([\s\,]|at|on)+)/);
var b={};
h.ctoken=function(l){var j=b[l];
if(!j){var g=Date.CultureInfo.regexPatterns;
var m=l.split(/\s+/),n=[];
for(var k=0;
k<m.length;
k++){n.push(a.replace(a.rtoken(g[m[k]]),m[k]))
}j=b[l]=a.any.apply(null,n)
}return j
};
h.ctoken2=function(g){return a.rtoken(Date.CultureInfo.regexPatterns[g])
};
h.h=a.cache(a.process(a.rtoken(/^(0[0-9]|1[0-2]|[1-9])/),i.hour));
h.hh=a.cache(a.process(a.rtoken(/^(0[0-9]|1[0-2])/),i.hour));
h.H=a.cache(a.process(a.rtoken(/^([0-1][0-9]|2[0-3]|[0-9])/),i.hour));
h.HH=a.cache(a.process(a.rtoken(/^([0-1][0-9]|2[0-3])/),i.hour));
h.m=a.cache(a.process(a.rtoken(/^([0-5][0-9]|[0-9])/),i.minute));
h.mm=a.cache(a.process(a.rtoken(/^[0-5][0-9]/),i.minute));
h.s=a.cache(a.process(a.rtoken(/^([0-5][0-9]|[0-9])/),i.second));
h.ss=a.cache(a.process(a.rtoken(/^[0-5][0-9]/),i.second));
h.hms=a.cache(a.sequence([h.H,h.mm,h.ss],h.timePartDelimiter));
h.t=a.cache(a.process(h.ctoken2("shortMeridian"),i.meridian));
h.tt=a.cache(a.process(h.ctoken2("longMeridian"),i.meridian));
h.z=a.cache(a.process(a.rtoken(/^(\+|\-)?\s*\d\d\d\d?/),i.timezone));
h.zz=a.cache(a.process(a.rtoken(/^(\+|\-)\s*\d\d\d\d/),i.timezone));
h.zzz=a.cache(a.process(h.ctoken2("timezone"),i.timezone));
h.timeSuffix=a.each(a.ignore(h.whiteSpace),a.set([h.tt,h.zzz]));
h.time=a.each(a.optional(a.ignore(a.stoken("T"))),h.hms,h.timeSuffix);
h.d=a.cache(a.process(a.each(a.rtoken(/^([0-2]\d|3[0-1]|\d)/),a.optional(h.ctoken2("ordinalSuffix"))),i.day));
h.dd=a.cache(a.process(a.each(a.rtoken(/^([0-2]\d|3[0-1])/),a.optional(h.ctoken2("ordinalSuffix"))),i.day));
h.ddd=h.dddd=a.cache(a.process(h.ctoken("sun mon tue wed thu fri sat"),function(g){return function(){this.weekday=g
}
}));
h.M=a.cache(a.process(a.rtoken(/^(1[0-2]|0\d|\d)/),i.month));
h.MM=a.cache(a.process(a.rtoken(/^(1[0-2]|0\d)/),i.month));
h.MMM=h.MMMM=a.cache(a.process(h.ctoken("jan feb mar apr may jun jul aug sep oct nov dec"),i.month));
h.y=a.cache(a.process(a.rtoken(/^(\d\d?)/),i.year));
h.yy=a.cache(a.process(a.rtoken(/^(\d\d)/),i.year));
h.yyy=a.cache(a.process(a.rtoken(/^(\d\d?\d?\d?)/),i.year));
h.yyyy=a.cache(a.process(a.rtoken(/^(\d\d\d\d)/),i.year));
d=function(){return a.each(a.any.apply(null,arguments),a.not(h.ctoken2("timeContext")))
};
h.day=d(h.d,h.dd);
h.month=d(h.M,h.MMM);
h.year=d(h.yyyy,h.yy);
h.orientation=a.process(h.ctoken("past future"),function(g){return function(){this.orient=g
}
});
h.operator=a.process(h.ctoken("add subtract"),function(g){return function(){this.operator=g
}
});
h.rday=a.process(h.ctoken("yesterday tomorrow today now"),i.rday);
h.unit=a.process(h.ctoken("minute hour day week month year"),function(g){return function(){this.unit=g
}
});
h.value=a.process(a.rtoken(/^\d\d?(st|nd|rd|th)?/),function(g){return function(){this.value=g.replace(/\D/g,"")
}
});
h.expression=a.set([h.rday,h.operator,h.value,h.unit,h.orientation,h.ddd,h.MMM]);
d=function(){return a.set(arguments,h.datePartDelimiter)
};
h.mdy=d(h.ddd,h.month,h.day,h.year);
h.ymd=d(h.ddd,h.year,h.month,h.day);
h.dmy=d(h.ddd,h.day,h.month,h.year);
h.date=function(g){return((h[Date.CultureInfo.dateElementOrder]||h.mdy).call(this,g))
};
h.format=a.process(a.many(a.any(a.process(a.rtoken(/^(dd?d?d?|MM?M?M?|yy?y?y?|hh?|HH?|mm?|ss?|tt?|zz?z?)/),function(g){if(h[g]){return h[g]
}else{throw Date.Parsing.Exception(g)
}}),a.process(a.rtoken(/^[^dMyhHmstz]+/),function(g){return a.ignore(a.stoken(g))
}))),function(g){return a.process(a.each.apply(null,g),i.finishExact)
});
var c={};
var e=function(g){return c[g]=(c[g]||h.format(g)[0])
};
h.formats=function(g){if(g instanceof Array){var k=[];
for(var j=0;
j<g.length;
j++){k.push(e(g[j]))
}return a.any.apply(null,k)
}else{return e(g)
}};
h._formats=h.formats(["yyyy-MM-ddTHH:mm:ss","ddd, MMM dd, yyyy H:mm:ss tt","ddd MMM d yyyy HH:mm:ss zzz","d"]);
h._start=a.process(a.set([h.date,h.time,h.expression],h.generalDelimiter,h.whiteSpace),i.finish);
h.start=function(k){try{var j=h._formats.call({},k);
if(j[1].length===0){return j
}}catch(g){}return h._start.call({},k)
}
}());
Date._parse=Date.parse;
Date.parse=function(c){var b=null;
if(!c){return null
}try{b=Date.Grammar.start.call({},c)
}catch(a){return null
}return((b[1].length===0)?b[0]:null)
};
Date.getParseFunction=function(b){var a=Date.Grammar.formats(b);
return function(f){var d=null;
try{d=a.call({},f)
}catch(c){return null
}return((d[1].length===0)?d[0]:null)
}
};
Date.parseExact=function(b,a){return Date.getParseFunction(a)(b)
};
/*
 * Add to Homescreen v1.0.8 ~ Copyright (c) 2011 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(){var s=navigator,h=(/iphone|ipod|ipad/gi).test(s.platform),j=(/ipad/gi).test(s.platform),k="devicePixelRatio" in window&&window.devicePixelRatio>1,m=s.appVersion.match(/Safari/gi),e="standalone" in s&&h,n=e&&s.standalone,u=s.appVersion.match(/OS \d+_\d+/g),v=s.platform.split(" ")[0],p=s.language.replace("-","_"),z=0,y=0,d="localStorage" in window&&typeof localStorage.getItem==="function"?localStorage.getItem("_addToHome"):null,A,b,c,f,o,t={animationIn:"drop",animationOut:"fade",startDelay:2000,lifespan:20000,bottomOffset:14,expire:0,message:"",disableLoading:false,touchIcon:false,arrow:true,iterations:100},g={ca_es:"Per instal·lar aquesta aplicació al vostre %device premeu %icon i llavors <strong>Afegir a pantalla d'inici</strong>.",da_dk:"Tilføj denne side til din %device: tryk på %icon og derefter <strong>Tilføj til hjemmeskærm</strong>.",de_de:"Installieren Sie diese App auf Ihrem %device: %icon antippen und dann <strong>Zum Home-Bildschirm</strong>.",el_gr:"Εγκαταστήσετε αυτήν την Εφαρμογή στήν συσκευή σας %device: %icon μετά πατάτε <strong>Προσθήκη σε Αφετηρία</strong>.",en_us:"Install this web app on your %device: tap %icon and then <strong>Add to Home Screen</strong>.",es_es:"Para instalar esta app en su %device, pulse %icon y seleccione <strong>Añadir a pantalla de inicio</strong>.",fi_fi:"Asenna tämä web-sovellus laitteeseesi %device: paina %icon ja sen jälkeen valitse <strong>Lisää Koti-valikkoon</strong>.",fr_fr:"Ajoutez cette application sur votre %device en cliquant sur %icon, puis <strong>Ajouter à l'écran d'accueil</strong>.",he_il:'<span dir="rtl">התקן אפליקציה זו על ה-%device שלך: הקש %icon ואז <strong>הוסף למסך הבית</strong>.</span>',hu_hu:"Telepítse ezt a web-alkalmazást az Ön %device-jára: nyomjon a %icon-ra majd a <strong>Főképernyőhöz adás</strong> gombra.",it_it:"Installa questa applicazione sul tuo %device: premi su %icon e poi <strong>Aggiungi a Home</strong>.",ja_jp:"このウェブアプリをあなたの%deviceにインストールするには%iconをタップして<strong>ホーム画面に追加</strong>を選んでください。",ko_kr:'%device에 웹앱을 설치하려면 %icon을 터치 후 "홈화면에 추가"를 선택하세요',nb_no:"Installer denne appen på din %device: trykk på %icon og deretter <strong>Legg til på Hjem-skjerm</strong>",nl_nl:"Installeer deze webapp op uw %device: tik %icon en dan <strong>Zet in beginscherm</strong>.",pt_br:"Instale este web app em seu %device: aperte %icon e selecione <strong>Adicionar à Tela Inicio</strong>.",pt_pt:"Para instalar esta aplicação no seu %device, prima o %icon e depois o <strong>Adicionar ao ecrã principal</strong>.",ru_ru:"Установите это веб-приложение на ваш %device: нажмите %icon, затем <strong>Добавить в «Домой»</strong>.",sv_se:"Lägg till denna webbapplikation på din %device: tryck på %icon och därefter <strong>Lägg till på hemskärmen</strong>.",th_th:"ติดตั้งเว็บแอพฯ นี้บน %device ของคุณ: แตะ %icon และ <strong>เพิ่มที่หน้าจอโฮม</strong>",tr_tr:"%device için bu uygulamayı kurduktan sonra %icon simgesine dokunarak <strong>Ev Ekranına Ekle</strong>yin.",zh_cn:"您可以将此应用程式安装到您的 %device 上。请按 %icon 然后点选<strong>添加至主屏幕</strong>。",zh_tw:"您可以將此應用程式安裝到您的 %device 上。請按 %icon 然後點選<strong>加入主畫面螢幕</strong>。"};
u=u?u[0].replace(/[^\d_]/g,"").replace("_",".")*1:0;
d=d=="null"?0:d*1;
if(window.addToHomeConfig){for(f in window.addToHomeConfig){t[f]=window.addToHomeConfig[f]
}}if(!t.expire||d<new Date().getTime()){d=0
}if(e&&!d&&!n&&m&&!t.disableLoading){document.addEventListener("DOMContentLoaded",w,false);
window.addEventListener("load",q,false)
}function w(){document.removeEventListener("DOMContentLoaded",w,false);
var l=document.createElement("div"),i,C=t.touchIcon?document.querySelectorAll("head link[rel=apple-touch-icon],head link[rel=apple-touch-icon-precomposed]"):[],D,E="";
l.id="addToHomeScreen";
l.style.cssText+="position:absolute;-webkit-transition-property:-webkit-transform,opacity;-webkit-transition-duration:0;-webkit-transform:translate3d(0,0,0);";
l.style.left="-9999px";
if(t.message in g){p=t.message;
t.message=""
}if(t.message==""){t.message=p in g?g[p]:g.en_us
}if(C.length){for(f=0,o=C.length;
f<o;
f++){D=C[f].getAttribute("sizes");
if(D){if(k&&D=="114x114"){E=C[f].href;
break
}}else{E=C[f].href
}}E='<span style="background-image:url('+E+')" class="touchIcon"></span>'
}l.className=(j?"ipad":"iphone")+(E?" wide":"");
l.innerHTML=E+t.message.replace("%device",v).replace("%icon",u>=4.2?'<span class="share"></span>':'<span class="plus">+</span>')+(t.arrow?'<span class="arrow"></span>':"")+'<span class="close">\u00D7</span>';
document.body.appendChild(l);
c=l;
i=c.querySelector(".close");
if(i){i.addEventListener("click",a,false)
}if(t.expire){localStorage.setItem("_addToHome",new Date().getTime()+t.expire*60*1000)
}}function q(){window.removeEventListener("load",q,false);
setTimeout(function(){var i;
z=j?window.scrollY:window.innerHeight+window.scrollY;
y=j?window.scrollX:Math.round((window.innerWidth-c.offsetWidth)/2)+window.scrollX;
c.style.top=j?z+t.bottomOffset+"px":z-c.offsetHeight-t.bottomOffset+"px";
c.style.left=j?y+(u>=5?160:208)-Math.round(c.offsetWidth/2)+"px":y+"px";
switch(t.animationIn){case"drop":if(j){i="0.6s";
c.style.webkitTransform="translate3d(0,"+-(window.scrollY+t.bottomOffset+c.offsetHeight)+"px,0)"
}else{i="0.9s";
c.style.webkitTransform="translate3d(0,"+-(z+t.bottomOffset)+"px,0)"
}break;
case"bubble":if(j){i="0.6s";
c.style.opacity="0";
c.style.webkitTransform="translate3d(0,"+(z+50)+"px,0)"
}else{i="0.6s";
c.style.webkitTransform="translate3d(0,"+(c.offsetHeight+t.bottomOffset+50)+"px,0)"
}break;
default:i="1s";
c.style.opacity="0"
}setTimeout(function(){c.style.webkitTransitionDuration=i;
c.style.opacity="1";
c.style.webkitTransform="translate3d(0,0,0)";
c.addEventListener("webkitTransitionEnd",B,false)
},0);
b=setTimeout(a,t.lifespan)
},t.startDelay)
}function B(){c.removeEventListener("webkitTransitionEnd",B,false);
c.style.webkitTransitionProperty="-webkit-transform";
c.style.webkitTransitionDuration="0.2s";
if(b){clearInterval(A);
A=setInterval(x,t.iterations)
}else{c.parentNode.removeChild(c)
}}function x(){var i=new WebKitCSSMatrix(window.getComputedStyle(c,null).webkitTransform),C=j?window.scrollY-z:window.scrollY+window.innerHeight-z,l=j?window.scrollX-y:window.scrollX+Math.round((window.innerWidth-c.offsetWidth)/2)-y;
if(C==i.m42&&l==i.m41){return
}clearInterval(A);
c.removeEventListener("webkitTransitionEnd",B,false);
setTimeout(function(){c.addEventListener("webkitTransitionEnd",B,false);
c.style.webkitTransform="translate3d("+l+"px,"+C+"px,0)"
},0)
}function a(){clearInterval(A);
clearTimeout(b);
b=null;
c.removeEventListener("webkitTransitionEnd",B,false);
var E=j?window.scrollY-z:window.scrollY+window.innerHeight-z,D=j?window.scrollX-y:window.scrollX+Math.round((window.innerWidth-c.offsetWidth)/2)-y,C="1",l="0",i=c.querySelector(".close");
if(i){i.removeEventListener("click",a,false)
}c.style.webkitTransitionProperty="-webkit-transform,opacity";
switch(t.animationOut){case"drop":if(j){l="0.4s";
C="0";
E=E+50
}else{l="0.6s";
E=E+c.offsetHeight+t.bottomOffset+50
}break;
case"bubble":if(j){l="0.8s";
E=E-c.offsetHeight-t.bottomOffset-50
}else{l="0.4s";
C="0";
E=E-50
}break;
default:l="0.8s";
C="0"
}c.addEventListener("webkitTransitionEnd",B,false);
c.style.opacity=C;
c.style.webkitTransitionDuration=l;
c.style.webkitTransform="translate3d("+D+"px,"+E+"px,0)"
}window.addToHomeClose=a
})();
var count=$("#tabbar li").length;
var pourcent=100/count;
$("#tabbar li").css("width",pourcent+"%");
var clickEventType=((document.ontouchstart!==null)?"click":"touchstart");
var WebAppLoader={};
(function(){var u=[],s={},i={},w={sharingDenied:0,sharingAllowed:1},d=true,y=false,x=w.sharingAllowed;
s={name:"",source:null,bin:null,added:false,loaded:false,unloaded:false,isPlugin:false,isShared:false,hasEvents:false,plugins:[],sharedModules:[],moduleEventManager:{},getPlugin:function(C){var B=this.plugins.some(function(D){return D===C
});
return(B)?this.loader.getPlugin(C):null
},getSharedModule:function(C){var B=this.sharedModules.some(function(D){return D===C
});
return(B)?this.loader.getSharedModule(C):null
},getEventManager:function(){if(this.hasEvents){this.moduleEventManager=this.loader.getEventManager();
return this.moduleEventManager
}else{return null
}},getConsole:function(){return this.loader.getConsole()
},loader:{}};
function z(C,B){var D=(B)?" - "+B+" exception! ":"";
if(!y){throw (D+C)
}}function n(E,D){function B(G,H,F){return(typeof G===H)?G:F
}function C(G,F){return(Array.isArray(G))?G:F
}switch(D){case"boolean":return B(E,"boolean",false);
case"b":return B(E,"boolean",false);
case"string":return B(E,"string","");
case"s":return B(E,"string","");
case"number":return B(E,"number",0);
case"n":return B(E,"number",0);
case"object":return B(E,"object",{});
case"o":return B(E,"object",{});
case"array":return C(E,[]);
case"a":return C(E,[]);
default:return E
}}var e=function(){var C={},D={},E={};
function F(I,H){if(E[I]){D[I]=H;
for(var J=0;
J<E[I].events.length;
J++){D[I].apply(null,E[I].events[J])
}delete E[I]
}else{D[I]=H
}}function G(I){var H=Array.prototype.slice.call(arguments,1);
if(D[I]){D[I].apply(null,H)
}else{if(!E[I]){E[I]={events:[]}
}E[I].events.push(H)
}}function B(I){var H=new e();
I.on=H.on;
I.raiseEvent=H.raiseEvent
}C.on=F;
C.raiseEvent=G;
C.attachTo=B;
return C
};
var c=(function(){var B={},C=(d)?function(){}:function(){console.log.apply(console,arguments)
};
B.log=C;
return B
})();
function t(B){u.some(function(C){return C.name===B
})
}function m(C,D){var B={};
B=u.filter(function(E){switch(D){case"plugin":return E.name===C&&E.isPlugin;
case"shared":return E.name===C&&E.isShared;
case"extension":return E.name===C&&E.isExtension;
default:return E.name===C
}})[0]||null;
return B
}function b(B,L){var I=n(B.name,"string"),D=n(B.hasEvents,"boolean"),F=n(B.isShared,"boolean"),E=n(B.isPlugin,"boolean"),J=n(B.plugins,"array"),K=n(B.sharedModules,"array"),C="",G="";
if(!t(I)){G=(F&&K.length>0)&&(x===w.sharingDenied);
if(G){C+='"'+I+'" is a shared module and cannot load any other shared modules. ';
C+='Set "isShared" to false or remove "sharedModules" to solve the problem.';
z(C,"addModule")
}var H=Object.create(s);
H.source=L;
H.isPlugin=E;
H.name=I;
H.isShared=F;
H.hasEvents=D;
H.plugins=J;
H.sharedModules=K;
H.added=true;
if(H.isPlugin){H.getConsole=j;
H.moduleEventManager=new e();
H.getEventManager=function(){return H.moduleEventManager
}
}else{g(B,H)
}u.push(H)
}}function p(B,D){var C;
C=m(B,D);
if(!C){return C
}if(!C.loaded){if(C.isExtension){C.bin=C.source(s);
i[B]=C.bin
}else{C.bin=C.source()
}C.loaded=true;
C.unloaded=false;
if(C.hasEvents){C.bin.on=C.moduleEventManager.on
}}h(C);
C.bin.__module__={};
C.bin.__module__.name=B;
return(C.loaded)?C.bin:null
}function A(B){var C,D=false;
C=m(B);
if(C){C.bin=null;
C.loaded=false;
C.unloaded=true;
D=true
}return D
}function v(B){if(A(B)){return p(B)
}}function l(G){var F=[],H=[],I=[],J=[],E="",C="\n";
if(n(G,"boolean")){C="</br>"
}F=u.filter(function(K){return(K.isPlugin==false&&K.isShared==false)
});
H=u.filter(function(K){return(K.isPlugin==true)
});
I=u.filter(function(K){return(K.isShared==true)
});
function B(K){E+=(n(K,"string"))+C
}function D(O,K){var N=null,P="",M=0;
M=O.length;
B(K+"("+M+")");
B();
for(var L=0;
L<M;
L+=1){N=O[L];
if(N.loaded){P="loaded"
}if(N.unloaded){P="unloaded"
}if(N.added&&(!N.loaded&&!N.unloaded)){P="added"
}B("- "+P.toUpperCase()+":\t"+N.name+": ")
}B()
}B("TOTAL NUMBER MODULES: "+u.length);
B();
D(F,"STANDARD MODULES");
D(H,"PLUGINS");
D(I,"SHARED MODULES");
return E
}function q(B){return p(B,"shared")
}function k(){return new e()
}function j(){return c
}function f(B,C){WebAppLoader[B]=C()
}function o(){alert("INIT!")
}function a(B,H){var E=n(B.name,"string"),C=n(B.hasEvents,"boolean"),F=n(B.plugins,"array"),G=n(B.sharedModules,"array");
if(!t(E)){var D=Object.create(s);
D.source=H;
D.name=E;
D.isExtension=true;
D.plugins=F;
D.sharedModules=G;
D.added=true;
D.hasEvents=C;
u.push(D);
p(E,"extension")
}}function g(B,D){var E=D;
for(var C in i){if(i[C].extendAddModule){i[C].extendAddModule(B,D)
}}}function h(D){var C=D;
for(var B in i){if(i[B].extendLoadModule){i[B].extendLoadModule(D)
}}}s.loader=(function(){var F={};
function D(G){return p(G,"plugin")
}function E(G){return p(G,"shared")
}function C(){return new e()
}function B(){return c
}F.getPlugin=D;
F.getSharedModule=E;
F.getEventManager=C;
F.getConsole=B;
return F
})();
WebAppLoader.addModule=b;
WebAppLoader.loadModule=p;
WebAppLoader.unloadModule=A;
WebAppLoader.getSharedModule=q;
WebAppLoader.getEventManager=k;
WebAppLoader.getConsole=j;
WebAppLoader.getInfo=l;
WebAppLoader.reloadModule=v;
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
WebAppLoader.addModule({name:"device",plugins:["helper"],isPlugin:true},function(){var a={},q=this.getConsole(),c=this.getPlugin("helper"),n=navigator;
function d(){return(/iphone|ipod|ipad/gi).test(n.platform)
}function e(){return(/ipad/gi).test(n.platform)
}function f(){return"devicePixelRatio" in window&&window.devicePixelRatio>1
}function g(){return n.appVersion.match(/Safari/gi)
}function b(){return"standalone" in n&&d
}function h(){return a.hasHomescreen&&n.standalone
}function p(){return n.appVersion.match(/OS \d+_\d+/g)
}function s(){return n.platform.split(" ")[0]
}function i(){return n.language.replace("-","_")
}function k(){var t=0;
if(d){if(e){t=1024
}else{t=960
}}return t
}function m(){return k()-20
}function j(){var t=0;
if(d){if(e){t=768
}else{t=640
}}return t
}function l(){return j()-20
}function o(){var t=Math.abs(window.orientation-90);
t=(t==180)?0:t;
if(t==90){return"portrait"
}else{return"landscape"
}}a.isIDevice=d;
a.isIPad=e;
a.isRetina=f;
a.isSafari=g;
a.hasHomescreen=b;
a.isStandalone=h;
a.OSVersion=p;
a.platform=s;
a.language=i;
a.maxWidth=k;
a.minWidth=l;
a.maxHeight=j;
a.minHeight=l;
a.orientation=o;
return a
});
WebAppLoader.addModule({name:"helper",isPlugin:true},function(){var i={};
function a(n){return n.charAt(0).toUpperCase()+n.slice(1)
}function m(o,n){return o.indexOf(n)===0
}function c(n,o){return n.match(o+"$")==o
}function g(q,p){function n(t,u,s){return(typeof t===u)?t:s
}function o(t,s){return(Array.isArray(t))?t:s
}switch(p){case"boolean":return n(q,"boolean",false);
case"b":return n(q,"boolean",false);
case"string":return n(q,"string","");
case"s":return n(q,"string","");
case"number":return n(q,"number",0);
case"n":return n(q,"number",0);
case"object":return n(q,"object",{});
case"o":return n(q,"object",{});
case"array":return o(q,[]);
case"a":return o(q,[]);
default:return q
}}function e(q){var p={"undefined":"undefined",number:"number","boolean":"boolean",string:"string","[object Function]":"function","[object RegExp]":"regexp","[object Array]":"array","[object Date]":"date","[object Error]":"error"},n=Object.prototype.toString;
function o(s){return p[typeof s]||p[n.call(s)]||(s?"object":"null")
}return o(q)
}function h(n){return(n!=undefined&&n!=null)
}function b(){return"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(n){var o=Math.random()*16|0,p=n=="x"?o:(o&3|8);
return p.toString(16)
})
}function k(n,p,s){var q=null;
for(var o=n.length-1;
o>=0;
o--){if(n[o]&&n[o][p]===s){q=n.splice(o,1);
break
}}return q
}function d(n,q,s){var p=null;
for(var o=n.length-1;
o>=0;
o--){if(n[o]&&n[o][q]===s){p=n[o];
break
}}return p
}function f(n){var o=decodeURIComponent((location.search.match(RegExp("[?|&]"+n+"=(.+?)(&|$)"))||[,null])[1]);
return(o==="null")?null:o
}function j(o){var n=document.createElement("div");
n.innerHTML=o;
return n.childNodes[0].nodeValue
}function l(q){var s={},p,n=[];
for(p in q){if(q.hasOwnProperty(p)){n.push(p)
}}n.sort();
for(p=0;
p<n.length;
p++){s[n[p]]=q[n[p]]
}return s
}i.capitaliseFirstLetter=a;
i.getValueAs=g;
i.startsWith=m;
i.endsWith=c;
i.getType=e;
i.hasValue=h;
i.createUUID=b;
i.removeObjectFromArray=k;
i.getURLParameter=f;
i.getObjectFromArray=d;
i.htmlDecode=j;
i.sortObject=l;
return i
});
WebAppLoader.addModule({name:"storage",plugins:["helper"],isPlugin:true},function(){var m={},h=this.getConsole(),f=this.getPlugin("helper"),j="Revolution";
usedSpace=0;
function e(){return JSON.stringify(localStorage).length
}function d(n,o){var p=null;
if(n&&(typeof n==="string")){p=(o||j)+f.capitaliseFirstLetter(n)
}return p
}function l(n,o){localStorage.setItem(n,o);
h.log("Storage - setItem:",n,o)
}function c(n){return localStorage.getItem(n)
}function g(o,q){var p=d(o,q),s=c(p),t=null;
if(s){if(f.startsWith(s,'{"')){try{t=JSON.parse(s)
}catch(n){h.log("Storage - failed to parse stored item:",key,t)
}}else{t=s
}}return t
}function k(n,o,q){var p=d(n,q),s="";
if(p&&f.hasValue(o)){s=(typeof o==="object")?JSON.stringify(o):o;
l(p,s)
}else{h.log("Storage - cannot save item.",n,o)
}}function i(n,p){var o=d(n,p);
if(o){localStorage.removeItem(o);
h.log("Storage - removed item.",o)
}}function b(){h.log("count()",localStorage.length)
}function a(){localStorage.clear();
h.log("clearAll()")
}m.load=g;
m.save=k;
m.remove=i;
m.count=b;
m.clearAll=a;
m.getUsedSpace=e;
return m
});
WebAppLoader.addExtension({name:"dataObject",plugins:["helper","storage"],hasEvents:true},function(h){var e={},g=h.loader,i=this.getConsole(),b=this.getEventManager(),j=this.getPlugin("storage"),f=this.getPlugin("helper");
dataObjects={};
var a=(function(){var k={};
function l(t){this.data={};
this.defaults={};
for(var u in t){this.data[u]=t[u];
this.defaults[u]=t[u]
}}function m(t){return this.data[t]
}function q(t,u){this.data[t]=u
}function p(t){j.save(this.privateId,this.data,t)
}function o(t){return this.data=j.load(this.privateId,t)||this.defaults||null
}function n(){return this.data||{}
}function s(t){return this.data=t
}k.define=l;
k.get=m;
k.set=q;
k.getData=n;
k.setData=s;
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
WebAppLoader.addModule({name:"scroll"},function(){var j={},e,h=[],c=0,d=0,b=false;
document.addEventListener("touchmove",function(m){m.preventDefault()
},false);
function i(){if(e){c=e.x;
d=e.y
}}function g(m,n){m=m||0;
n=n||0;
setTimeout(function(){try{e.scrollTo(c,d)
}catch(o){}},100)
}function l(o,p,q){var s=0,n=null;
try{n=$(o)
}catch(m){}if(!n){return
}setTimeout(function(){try{s=(n.offset().top*-1)+p||0;
s+=e.wrapperOffsetTop;
e.scrollTo(0,s,q+100)
}catch(t){}},100)
}function k(n,o,m){setTimeout(function(){try{e.scrollTo(n,o-e.wrapperOffsetTop,m||1000,true)
}catch(p){}},100)
}function f(n,m,o){if(b){alert("Prevent rebuilding");
return
}else{b=true
}var s="div#"+n+" #wrapper",p=o||{};
p.useTransform=false;
p.onBeforeScrollStart=function(t){var u=t.target;
while(u.nodeType!=1){u=u.parentNode
}if(m&&u.tagName!="SELECT"&&u.tagName!="INPUT"&&u.tagName!="TEXTAREA"){t.preventDefault()
}};
p.hScroll=false;
p.vScroll=true;
if(e){e.destroy();
e=null;
function q(t){function u(v){if(v.length>0){v.remove();
if(t.next().length>0){q(t.next())
}alert("removed!")
}}u(t.next())
}q($(s).find("#scroller"))
}if($(s).get(0)){setTimeout(function(){e=new iScroll($(s).get(0),p);
b=false
},25)
}}function a(){try{e.scrollTo(0,0,200)
}catch(m){}}j.rebuild=f;
j.goUp=a;
j.saveScrollPosition=i;
j.restoreScrollPosition=g;
j.scrollToElement=l;
j.scrollTo=k;
return j
});
WebAppLoader.addModule({name:"spinningWheel",plugins:["helper"],sharedModules:["localizationManager"],hasEvents:true},function(){var h={},g=[],f={},b=this.getEventManager(),d=this.getPlugin("helper"),e=this.getSharedModule("localizationManager").getLanguage()||{};
function c(i){if(typeof i=="string"){i=f[i]
}return g[i]
}function a(i){$.each(i.items,function(j,l){var k=d.capitaliseFirstLetter(l.id);
f[l.id]=j;
g[j]={id:l.id,repository:l.repository,lastItemSelected:"",isShown:false,onDoneHandler:"on"+k+"Done",onCancelHandler:"on"+k+"Cancel",onSlotCancel:function(){SpinningWheel.close();
g[j].isShown=false;
b.raiseEvent(g[j].onCancelHandler)
},onSlotDone:function(){var m,o,n;
n=SpinningWheel.getSelectedValues();
m=n.keys[0]||"";
o=n.values[0]||"";
g[j].lastItemSelected=m;
SpinningWheel.close();
g[j].isShown=false;
b.raiseEvent(g[j].onDoneHandler,m,o)
},show:function(m){function n(o){SpinningWheel.addSlot(o,"",m||g[j].lastItemSelected);
SpinningWheel.setCancelAction(g[j].onSlotCancel);
SpinningWheel.setDoneAction(g[j].onSlotDone);
SpinningWheel.open();
$("#sw-done").html(e.spinningWheel.done);
$("#sw-cancel").html(e.spinningWheel.cancel)
}if(!g[j].isShown){g[j].isShown=true;
this.repository.getData(n)
}}}
})
}h.create=a;
h.getSlot=c;
return h
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
$.each(o.items,function(s,v){var t=f.capitaliseFirstLetter(v.id),u=o.items.length||1,q=100/u;
a[v.id]=s;
b[s]={id:v.id,linkId:n+t,badgeId:m+t,title:v.title,btnClass:v.btnClass,highlight:v.highlight||false,eventHandler:"on"+t+"Tap",isHighlighted:false,isDisabled:false,setHighlight:function(w){var x=$("#"+this.linkId);
if(this.highlight){this.isHighlighted=!w;
if(this.isHighlighted){$("#tabbar a").removeClass("current");
$("#tabbar div").removeClass("current");
this.isHighlighted=false
}else{$("#tabbar a").addClass("current").not(x).removeClass("current");
$("#tabbar div").addClass("current").not(x).removeClass("current");
this.isHighlighted=true
}}},toggleHighlighted:function(){if(this.highlight){this.setHighlight(!this.isHighlighted)
}},setDisabled:function(x){var y=(x)?0.2:1,w=(x)?"#333":"#f00";
this.isDisabled=x;
$("#"+this.linkId).css({opacity:y});
$("#"+this.badgeId).css({backgroundColor:w})
},setBadgeText:function(y){var w=$("#"+this.badgeId),x=true;
if(y){w.html(y);
w.show()
}else{w.hide()
}}};
$(k+" ul").append($("<li>").css("width",q+"%").append($("<a>").attr("id",b[s].linkId).append($("<small>").attr({id:b[s].badgeId,"class":"badge right",style:"display: none;"})).append($("<strong>").append(b[s].title)).append($("<div>").attr("class",b[s].btnClass))))
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
}function f(q){var p=q.buttonPrefix||"toolbar_btn",s=this;
n=q.toolbarId||".toolbar";
o=j.getValueAs(q.visible,"boolean");
$.each(q.items,function(t,w){var u=j.capitaliseFirstLetter(w.id),v=q.items.length||1;
a[w.id]=t;
c[t]={id:w.id,buttonId:p+u,title:w.title,btnClass:w.btnClass,eventHandler:"on"+u+"Tap",isDisabled:false,isSelected:false,select:function(){var x=$("#"+c[t].buttonId),z=c[t].btnClass+"_on",y=c[t].btnClass+"_off";
x.removeClass(y);
x.addClass(z);
this.isSelected=true
},deselect:function(){var x=$("#"+c[t].buttonId),z=c[t].btnClass+"_on",y=c[t].btnClass+"_off";
x.removeClass(z);
x.addClass(y);
this.isSelected=false
}};
$(n).append($("<div>").addClass("toolbar_button "+c[t].btnClass+"_off").attr({id:c[t].buttonId,style:"right: "+(d*e+b)+"px;"}).on("click",function(z){var A=c[t].isSelected,y=c[t].btnClass+"_on",x=c[t].btnClass+"_off";
k.log("toolbar button tapped!");
if(A){A=false;
$(this).removeClass(y);
$(this).addClass(x)
}else{A=true;
$(this).removeClass(x);
$(this).addClass(y)
}c[t].isSelected=A;
h.raiseEvent(c[t].eventHandler,A);
z.stopPropagation()
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
WebAppLoader.addModule({name:"blackbird",plugins:["helper"],hasEvents:true,isShared:true},function(){var blackbird={},output=this.getConsole(),eventManager=this.getEventManager(),helper=this.getPlugin("helper"),initialized=false;
var NAMESPACE="iosLog";
var IE6_POSITION_FIXED=true;
var bbird;
var outputList;
var cache=[];
var state=getState();
var classes={};
var profiler={};
var IDs={blackbird:"blackbird",checkbox:"bbVis",filters:"bbFilters",controls:"bbControls",size:"bbSize"};
var messageTypes={debug:true,info:true,warn:true,error:true,profile:true};
function generateMarkup(){var spans=[];
for(type in messageTypes){spans.push(['<span class="',type,'" type="',type,'"></span>'].join(""))
}var newNode=document.createElement("DIV");
newNode.id=IDs.blackbird;
newNode.style.display="none";
newNode.style.marginTop="48px";
newNode.innerHTML=['<div class="header">','<div class="left">','<div id="',IDs.filters,'" class="filters" title="click to filter by message type">',spans.join(""),"</div>","</div>",'<div class="right">','<div id="',IDs.controls,'" class="controls">','<span id="',IDs.size,'" title="contract" op="resize"></span>','<span class="clear" title="clear" op="clear"></span>','<span class="close" title="close" op="close"></span>',"</div>","</div>","</div>",'<div class="main">','<div class="left"></div><div class="mainBody">','<ol id="scrollMe">',cache.join(""),"</ol>",'</div><div class="right"></div>',"</div>",'<div class="footer">','<div class="left"><label for="',IDs.checkbox,'"><input type="checkbox" id="',IDs.checkbox,'" />Visible on page load</label></div>','<div class="right"></div>',"</div>"].join("");
return newNode
}function backgroundImage(){var bodyTag=document.getElementsByTagName("BODY")[0];
if(bodyTag.currentStyle&&IE6_POSITION_FIXED){if(bodyTag.currentStyle.backgroundImage=="none"){bodyTag.style.backgroundImage="url(about:blank)"
}if(bodyTag.currentStyle.backgroundAttachment=="scroll"){bodyTag.style.backgroundAttachment="fixed"
}}}function addMessage(type,content){content=(content.constructor==Array)?content.join(""):content;
if(outputList){var newMsg=document.createElement("LI");
newMsg.className=type;
newMsg.innerHTML=['<span class="icon"></span>',content].join("");
outputList.appendChild(newMsg);
scrollToBottom()
}else{cache.push(['<li class="',type,'"><span class="icon"></span>',content,"</li>"].join(""))
}}function clear(){outputList.innerHTML=""
}function clickControl(evt){if(!evt){evt=window.event
}var el=(evt.target)?evt.target:evt.srcElement;
if(el.tagName=="SPAN"){switch(el.getAttributeNode("op").nodeValue){case"resize":resize();
break;
case"clear":clear();
break;
case"close":hide();
break
}}}function clickFilter(evt){if(!evt){evt=window.event
}var span=(evt.target)?evt.target:evt.srcElement;
if(span&&span.tagName=="SPAN"){var type=span.getAttributeNode("type").nodeValue;
if(evt.altKey){var filters=document.getElementById(IDs.filters).getElementsByTagName("SPAN");
var active=0;
for(entry in messageTypes){if(messageTypes[entry]){active++
}}var oneActiveFilter=(active==1&&messageTypes[type]);
for(var i=0;
filters[i];
i++){var spanType=filters[i].getAttributeNode("type").nodeValue;
filters[i].className=(oneActiveFilter||(spanType==type))?spanType:spanType+"Disabled";
messageTypes[spanType]=oneActiveFilter||(spanType==type)
}}else{messageTypes[type]=!messageTypes[type];
span.className=(messageTypes[type])?type:type+"Disabled"
}var disabledTypes=[];
for(type in messageTypes){if(!messageTypes[type]){disabledTypes.push(type)
}}disabledTypes.push("");
outputList.className=disabledTypes.join("Hidden ");
scrollToBottom()
}}function clickVis(evt){if(!evt){evt=window.event
}var el=(evt.target)?evt.target:evt.srcElement;
state.load=el.checked;
setState()
}function scrollToBottom(){outputList.scrollTop=outputList.scrollHeight
}function isVisible(){return(bbird.style.display=="block")
}function hide(){bbird.style.display="none"
}function show(){var body=document.getElementsByTagName("BODY")[0];
body.removeChild(bbird);
body.appendChild(bbird);
bbird.style.display="block"
}function reposition(position){if(position===undefined||position==null){position=(state&&state.pos===null)?1:(state.pos+1)%4
}switch(position){case 0:classes[0]="bbTopLeft";
break;
case 1:classes[0]="bbTopRight";
break;
case 2:classes[0]="bbBottomLeft";
break;
case 3:classes[0]="bbBottomRight";
break
}state.pos=position;
setState()
}function resize(size){if(size===undefined||size===null){size=(state&&state.size==null)?0:(state.size+1)%2
}classes[1]=(size===0)?"bbSmall":"bbLarge";
var span=document.getElementById(IDs.size);
span.title=(size===1)?"small":"large";
span.className=span.title;
state.size=size;
setState();
scrollToBottom()
}function setState(){var props=[];
for(entry in state){var value=(state[entry]&&state[entry].constructor===String)?'"'+state[entry]+'"':state[entry];
props.push(entry+":"+value)
}props=props.join(",");
var expiration=new Date();
expiration.setDate(expiration.getDate()+14);
document.cookie=["blackbird={",props,"}; expires=",expiration.toUTCString(),";"].join("");
var newClass=[];
for(word in classes){newClass.push(classes[word])
}bbird.className=newClass.join(" ")
}function getState(){var re=new RegExp(/blackbird=({[^;]+})(;|\b|$)/);
var match=re.exec(document.cookie);
return(match&&match[1])?eval("("+match[1]+")"):{pos:null,size:null,load:null}
}function readKey(evt){if(!evt){evt=window.event
}var code=113;
if(evt&&evt.keyCode==code){var visible=isVisible();
if(visible&&evt.shiftKey&&evt.altKey){clear()
}else{if(visible&&evt.shiftKey){reposition()
}else{if(!evt.shiftKey&&!evt.altKey){(visible)?hide():show()
}}}}}function addEvent(obj,type,fn){var obj=(obj.constructor===String)?document.getElementById(obj):obj;
if(obj.attachEvent){obj["e"+type+fn]=fn;
obj[type+fn]=function(){obj["e"+type+fn](window.event)
};
obj.attachEvent("on"+type,obj[type+fn])
}else{obj.addEventListener(type,fn,false)
}}function removeEvent(obj,type,fn){var obj=(obj.constructor===String)?document.getElementById(obj):obj;
if(obj.detachEvent){obj.detachEvent("on"+type,obj[type+fn]);
obj[type+fn]=null
}else{obj.removeEventListener(type,fn,false)
}}blackbird={toggle:function(){(isVisible())?hide():show()
},resize:function(){resize()
},clear:function(){clear()
},move:function(){reposition()
},debug:function(msg){addMessage("debug",msg)
},warn:function(msg){addMessage("warn",msg)
},info:function(msg){addMessage("info",msg)
},error:function(msg){addMessage("error",msg)
},profile:function(label){var currentTime=new Date();
if(label==undefined||label==""){addMessage("error","<b>ERROR:</b> Please specify a label for your profile statement")
}else{if(profiler[label]){addMessage("profile",[label,": ",currentTime-profiler[label],"ms"].join(""));
delete profiler[label]
}else{profiler[label]=currentTime;
addMessage("profile",label)
}}return currentTime
}};
function init(){if(initialized){return
}var body=document.getElementsByTagName("BODY")[0];
bbird=body.appendChild(generateMarkup());
outputList=bbird.getElementsByTagName("OL")[0];
backgroundImage();
addEvent(IDs.checkbox,"click",clickVis);
addEvent(IDs.filters,"click",clickFilter);
addEvent(IDs.controls,"click",clickControl);
addEvent(document,"keyup",readKey);
resize(state.size);
reposition(state.pos);
if(state.load){show();
document.getElementById(IDs.checkbox).checked=true
}scrollToBottom();
initialized=true;
addEvent(window,"unload",function(){removeEvent(IDs.checkbox,"click",clickVis);
removeEvent(IDs.filters,"click",clickFilter);
removeEvent(IDs.controls,"click",clickControl);
removeEvent(document,"keyup",readKey)
})
}function isTouchDevice(){if((navigator.userAgent.match(/android 3/i))||(navigator.userAgent.match(/honeycomb/i))){return false
}try{document.createEvent("TouchEvent");
return true
}catch(e){return true
}}function touchScroll(id){if(isTouchDevice()){var el=document.getElementById(id);
var scrollStartPosY=0;
var scrollStartPosX=0;
document.getElementById(id).addEventListener("touchstart",function(event){scrollStartPosY=this.scrollTop+event.touches[0].pageY;
scrollStartPosX=this.scrollLeft+event.touches[0].pageX;
event.preventDefault()
},false);
document.getElementById(id).addEventListener("touchmove",function(event){if((this.scrollTop<this.scrollHeight-this.offsetHeight&&this.scrollTop+event.touches[0].pageY<scrollStartPosY-5)||(this.scrollTop!=0&&this.scrollTop+event.touches[0].pageY>scrollStartPosY+5)){event.preventDefault()
}if((this.scrollLeft<this.scrollWidth-this.offsetWidth&&this.scrollLeft+event.touches[0].pageX<scrollStartPosX-5)||(this.scrollLeft!=0&&this.scrollLeft+event.touches[0].pageX>scrollStartPosX+5)){event.preventDefault()
}this.scrollTop=scrollStartPosY-event.touches[0].pageY;
this.scrollLeft=scrollStartPosX-event.touches[0].pageX
},false)
}}init();
touchScroll("scrollMe");
return blackbird
});
WebAppLoader.addModule({name:"chartComponents",plugins:["helper"],sharedModules:["chartManager","localizationManager"],dataObjects:["charts"],hasEvents:true,isShared:true},function(){var a={},j=this.getConsole(),f=this.getEventManager(),g=this.getPlugin("helper"),b=this.getSharedModule("chartManager"),h=this.getSharedModule("localizationManager").getLanguage()||{},e={},d=this.getDataObject("charts"),c=null;
d.define({performance_bar:{chartId:"performance_bar",title:h.chart.performanceBarTitle,chartType:"BarChart",include:"childSegments",measures:["rp"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Return"}}},risk_bar:{chartId:"risk_bar",title:h.chart.riskBarTitle,chartType:"BarChart",include:"childSegments",measures:["wp","contributionvar"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Return"}}},allocation_bar:{chartId:"allocation_bar",title:h.chart.allocationbarTitle,chartType:"BarChart",include:"childSegments",measures:["wover"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Excess Weight %"}}},contribution_bar:{chartId:"contribution_bar",title:h.chart.contributionBarTitle,chartType:"BarChart",include:"securities",measures:["ctp"],includeMeasuresFor:["securities"],options:{hAxis:{title:"Contribution"}}},attribution_bar:{chartId:"attribution_bar",title:h.chart.attributionBarTitle,chartType:"BarChart",include:"childSegments",measures:["wendover","etotal"],includeMeasuresFor:["childSegments"]},fixedIncomeContribution_bar:{chartId:"fixedIncomeContribution_bar",title:h.chart.fixedIncomeContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpyc","ctpspread","ctpcur"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#FF6600","#CC0000","#FFCC00"]}},carryContribution_bar:{chartId:"carryContribution_bar",title:h.chart.carryContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpsystcarry","ctpspeccarry"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#336600","#990000"]}},yieldCurveContribution_bar:{chartId:"yieldCurveContribution_bar",title:h.chart.yieldCurveContributionBarTitle,chartType:"BarChart",include:"none",measures:["ctpshift","ctptwist","ctpbutterfly","ctprolldown"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#CD66CD","#339900","#FF9900","#660000"]}},riskNumbers_bar:{chartId:"riskNumbers_bar",title:h.chart.riskNumbersBarTitle,chartType:"BarChart",include:"none",measures:["ytmpend","mdpend"],includeMeasuresFor:["segment"],options:{chartArea:{left:10,width:"60%",height:"80%"},colors:["#336699","#530066"]}},performance_bubble:{chartId:"performance_bubble",title:h.chart.performanceBubbleTitle,chartType:"BubbleChart",include:"childSegments",measures:["stddevann","returnannifgtyr","wpabsolute"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"Annualized Volatility"},vAxis:{title:"Annualized Return"}}},risk_bubble:{chartId:"risk_bubble",title:h.chart.riskBubbleTitle,chartType:"BubbleChart",include:"childSegments",measures:["valueatriskpercent","rp","wpabsolute"],includeMeasuresFor:["childSegments"],options:{hAxis:{title:"% Value at Risk"},vAxis:{title:"Return"}}},contribution_column:{chartId:"contribution_column",title:h.chart.contributionColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["ctp","ctb"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Return %"}}},interestRatesExposure_column:{chartId:"interestRatesExposure_column",title:h.chart.interestRatesExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["interestratesdown100percent","interestratesdown50percent","interestratesup50percent","interestratesup100percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#CC0000","#CD66CD","#FFCC00","#3399CC"]}},creditSpreadsExposure_column:{chartId:"creditSpreadsExposure_column",title:h.chart.creditSpreadsExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["creditspreadsdown100percent","creditspreadsdown50percent","creditspreadsup50percent","creditspreadsup100percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#CC0000","#CD66CD","#FFCC00","#3399CC"]}},dv01Exposure_column:{chartId:"dv01Exposure_column",title:h.chart.dv01ExposureColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["interestratesdv01percent","creditspreadsdv01percent","inflationratesdv01percent"],includeMeasuresFor:["childSegments"],options:{vAxis:{title:"Exposure %"},colors:["#3399CC","#336699","#003366"]}},attribution_column:{chartId:"attribution_column",title:h.chart.attributionColumnTitle,chartType:"ColumnChart",include:"childSegments",measures:["etotal","ealloc","eselecinter"],includeMeasuresFor:["childSegments"],options:{colors:["#003366","#FF6600","#990066"]}},allocation_pie:{chartId:"allocation_pie",title:h.chart.allocationPieTitle,chartType:"PieChart",include:"childSegments",measures:["wpabsoluteend"],includeMeasuresFor:["childSegments"]},contribution_pie:{chartId:"contribution_pie",title:h.chart.contributionPieTitle,chartType:"PieChart",include:"childSegments",isHeatMap:true,isGradientReversed:false,measures:["wpabsoluteend","ctp"],includeMeasuresFor:["childSegments"]},risk_pie:{chartId:"risk_pie",title:h.chart.riskPietitle,chartType:"PieChart",include:"childSegments",isHeatMap:true,isGradientReversed:true,measures:["wpabsoluteend","contributionvar"],includeMeasuresFor:["childSegments"]},performanceMaster_grid:{chartId:"performanceMaster_grid",title:h.chart.performanceMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","rp","rb","relr","ctp"],includeMeasuresFor:["segment","childSegments"]},contributionMaster_grid:{chartId:"contributionMaster_grid",title:h.chart.contributionMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","ctp","wb","ctb"],includeMeasuresFor:["segment","childSegments"]},attributionMaster_grid:{chartId:"attributionMaster_grid",title:h.chart.attributionMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","wb","ealloc","eselecinter","eallocc","etotal"],includeMeasuresFor:["segment","childSegments"]},fixedIncomeMaster_grid:{chartId:"fixedIncomeMaster_grid",title:h.chart.fixedIncomeMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","rp","rpyc","rpspread","ctp"],includeMeasuresFor:["segment","childSegments"]},allocationMaster_grid:{chartId:"allocationMaster_grid",title:h.chart.allocationMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","wpgross","shortexposureend","longexposureend","mvend"],includeMeasuresFor:["segment","childSegments"]},riskMaster_grid:{chartId:"riskMaster_grid",title:h.chart.riskMasterTitle,chartType:"Table",include:"childSegments",measures:["wp","valueatrisk","valueatriskpercent","contributionvar","expectedvolatilitypercent"],includeMeasuresFor:["segment","childSegments"]},performance_grid:{chartId:"performance_grid",title:h.chart.performanceGridTitle,chartType:"Table",include:"none",measures:["rp","returnann","stddevann","relr","periodaverage","oneperiodhigh","oneperiodlow","maxloss","percentpositiveperiods","correlation","alpha","beta","rsquared","sharperatio","treynorratio","inforatioxs"],includeMeasuresFor:["segment"]},attribution_grid:{chartId:"attribution_grid",title:h.chart.attributionGridTitle,chartType:"Table",include:"childSegments",measures:["ctp","ctb","ealloclocal","eselecinterlocal","etotalc","etotalmca"],includeMeasuresFor:["segment","childSegments"]},fixedIncome_grid:{chartId:"fixedIncome_grid",title:h.chart.fixedIncomeGridTitle,chartType:"Table",include:"childSegments",measures:["ttmpend","ytmpend","mdpend","durwpend","spreadpend"],includeMeasuresFor:["segment","childSegments"]},fixedIncomeContribution_grid:{chartId:"fixedIncomeContribution_grid",title:h.chart.fixedIncomeContributionGridTitle,chartType:"Table",include:"childSegments",measures:["ctp","ctpyc","ctpcarry","ctpspread","ctpcur","ctpother","ctpresidual"],includeMeasuresFor:["segment","childSegments"]},fixedIncomeExposure_grid:{chartId:"fixedIncomeExposure_grid",title:h.chart.fixedIncomeExposureGridTitle,chartType:"Table",include:"childSegments",measures:["wpend","interestratesdv01percent","creditspreadsdv01percent","inflationratesdv01percent"],includeMeasuresFor:["segment","childSegments"]},performanceTopTen_grid:{chartId:"performanceTopTen_grid",title:h.chart.performanceTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","rp","ctp"],oData:{orderby:"wpend-Earliest desc",top:10},includeMeasuresFor:["securities"]},contributionTopTen_grid:{chartId:"contributionTopTen_grid",title:h.chart.contributionTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","rp","ctp"],oData:{orderby:"ctp-Earliest desc",top:10},includeMeasuresFor:["securities"]},riskTopTen_grid:{chartId:"riskTopTen_grid",title:h.chart.riskTopTenGridTitle,chartType:"Table",include:"securities",measures:["wpend","expectedshortfallpercent","valueatriskpercent","expectedvolatilitypercent"],oData:{orderby:"valueatriskpercent-Earliest desc",top:10},includeMeasuresFor:["securities"]},performance_treemap:{chartId:"performance_treemap",title:h.chart.performanceTreemapTitle,chartType:"TreeMap",include:"securities",measures:["wpabsoluteend","rp"],includeMeasuresFor:["segment","securities"]},risk_treemap:{chartId:"risk_treemap",title:h.chart.riskTreemapTitle,chartType:"TreeMap",include:"childSegments",measures:["wpabsoluteend","contributionvar"],includeMeasuresFor:["segment","childSegments"]},performance_line:{chartId:"performance_line",title:h.chart.performanceLineTitle,chartType:"LineChart",measures:["rp","rb"],seriesType:"cumulativeIndexed"},fi_contribution_group:{chartId:"fi_contribution_group",title:h.chart.fixedIncomeContributionsGroupTitle,chartType:"Group",charts:[{chartId:"fixedIncomeContribution_bar",width:"50%",height:"100%"},{chartId:"carryContribution_bar",width:"50%",height:"100%"},{chartId:"yieldCurveContribution_bar",width:"50%",height:"100%"},{chartId:"riskNumbers_bar",width:"50%",height:"100%"}]},fi_exposures_group:{chartId:"fi_exposures_group",title:h.chart.fixedIncomeExposuresGroupTitle,chartType:"Group",charts:[{chartId:"interestRatesExposure_column",width:"50%",height:"100%"},{chartId:"creditSpreadsExposure_column",width:"50%",height:"100%"},{chartId:"dv01Exposure_column",width:"50%",height:"100%"}]},fi_gridRiskNumber_group:{chartId:"fi_gridRiskNumber_group",title:h.chart.fixedIncomeRiskNumbersGroupTitle,chartType:"Group",charts:[{chartId:"fixedIncome_grid",width:"100%",height:"100%"},{chartId:"fixedIncomeContribution_grid",width:"100%",height:"100%"}]}});
c=d.getData();
function i(n){var o,m,q=true;
for(var p=0;
p<n.length;
p++){m=n[p].chartId;
if(e[m]){o=e[m]
}else{o=b.create(c[m]);
e[m]=o
}b.load(o,q);
if(o){q=false
}}}function l(m,n){$.each(m,function(q,o){var p;
p=e[o.chartId]||c[o.chartId];
p.timePeriods=n.code;
p.startDate=n.startDate;
p.endDate=n.endDate
})
}function k(q,x){var s=[],u="";
function w(y,z){u="";
u+='<hr class = "snapper" style="visibility: hidden;" data-chartId="'+y+'" /><div class="analysisSummarySection">    <div class="analysisComponentContainer">       <div class="analysisComponentHeader">           <h2>'+z+'</h2>           <div class="analysisComponentFullScreenButton" data-chartId="'+y+'"></div>       </div>'
}function m(y,z){u+='        <div id="'+y.chartId+'" class="'+z+'"></div>'
}function o(y){u+='        <div id="'+y.chartId+'" class="halfSizeChart" style="width: '+y.width+";height: "+y.height+';"></div>'
}function t(){u+='        <div style="clear: both;"></div>    </div></div>'
}function p(){$(x).append($(u))
}function n(z){var y=[],C=false,A;
if(!z){j.log("addChartToChartsToRender: Skipped empty chart");
return
}if(z.chartType==="Group"){y=z.charts;
C=true
}else{y.push(z)
}if(C){w(z.chartId,z.title)
}A=(z.chartType==="Table")?"":"chartContainer";
for(var B=0;
B<y.length;
B++){chart=c[y[B].chartId]||null;
s.push(chart);
if(chart){if(C){o(y[B])
}else{w(chart.chartId,chart.title);
m(y[B],A);
t();
p()
}}}if(C){t();
p()
}}for(var v=0;
v<q.length;
v++){n(c[q[v].chartId]||null)
}i(s)
}b.on("onAnalysisLoaded",function(){f.raiseEvent("onAllChartsLoaded")
});
b.on("onAnalysisLoading",function(m,n){f.raiseEvent("onChartsLoading",m,n)
});
b.on("showMask",function(m){$("#"+m).parent().addClass("genericLoadingMask")
});
b.on("hideMask",function(m){$("#"+m).parent().removeClass("genericLoadingMask")
});
a.load=i;
a.render=k;
a.setTimePeriod=l;
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
k={chartArea:{left:80,width:"75%",height:"80%"},fontName:f.labelFontName,fontSize:f.labelFontSize,forceIFrame:f.forceIFrame,is3D:true,legend:{position:"none"},pieSliceText:"label"};
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
}function s(){o()
}function m(u){var t;
if(j){c+=1;
i.raiseEvent("onAnalysisLoading",c,f);
if(c===f){s();
i.raiseEvent("onAnalysisLoaded")
}}if(u&&u.chartId){i.raiseEvent("hideMask",u.chartId)
}if(u&&u.errorObj&&u.errorObj.id){t=google.visualization.errors.getContainer(u.errorObj.id);
$("#"+t.id).html(k.errors.chartFailedText)
}}function h(u){if(!u){n.log("Config is not specified.");
return
}var w=u.chartId||null,z=u.chartType||null,x=u.options||{},v={},t=null;
if(!w||!z){n.log("Chart ID or type is not specified.");
return
}v=(d&&d[z])?d[z]:{};
x=$.extend({},v,x);
x.backgroundColor={fill:"transparent"};
t=new google.visualization.ChartWrapper({chartType:z,options:x,containerId:w});
var y=t.clone();
y.setContainerId("testChart");
i.raiseEvent("showMask",u.chartId);
t.endDate=u.endDate;
t.include=u.include;
t.includeMeasuresFor=u.includeMeasuresFor;
t.isGradientReversed=u.isGradientReversed;
t.isHeatMap=u.isHeatMap;
t.measures=u.measures;
t.oData=u.oData;
t.seriesType=u.seriesType;
t.startDate=u.startDate;
t.timePeriods=u.timePeriods;
google.visualization.events.addListener(t,"ready",function(){m({chartId:t.getContainerId()})
});
google.visualization.events.addListener(t,"error",function(A){m({errorObj:A})
});
return t
}function l(t,v){var y,x,z,u;
if(!t){return
}if(v){q()
}f++;
y=t.getChartType();
u=new google.visualization.NumberFormat({decimalSymbol:k.shared.decimalSymbol,fractionDigits:3,groupingSymbol:k.shared.groupingSymbol,negativeColor:"#cc0000",negativeParens:false});
x={type:y};
if(t.endDate){x.endDate=t.endDate
}if(t.include){x.include=t.include
}if(t.includeMeasuresFor){x.includeMeasuresFor=t.includeMeasuresFor
}if(t.measures){x.measures=t.measures
}if(t.oData){x.oData=t.oData
}if(t.startDate){x.startDate=t.startDate
}if(t.seriesType){x.seriesType=t.seriesType
}if(t.timePeriods){x.timePeriods=t.timePeriods
}z=(y==="LineChart")?p.timeSeries:p.segmentsTreeNode;
i.raiseEvent("showMask",t.getContainerId());
function w(A){var B,C,E,D,G=[],F=[];
n.log(A);
B=new google.visualization.DataTable(A);
for(C=0;
C<B.getNumberOfColumns();
C++){if(B.getColumnType(C)==="number"){u.format(B,C)
}}if(y==="PieChart"&&t.isHeatMap){for(C=0;
C<B.getNumberOfRows();
C++){G.push(B.getValue(C,2))
}E=Math.min.apply(Math,G);
D=Math.max.apply(Math,G);
if(Math.abs(E)>Math.abs(D)){D=Math.abs(E);
E=-(Math.abs(E))
}else{D=Math.abs(D);
E=-(Math.abs(D))
}for(C=0;
C<G.length;
C++){F.push({color:g.getColorInRange(G[C],E,D,t.isGradientReversed)})
}t.setOption("slices",F)
}t.setDataTable(B);
t.draw();
$(document).on("orientationchange",function(H){})
}a.post(z,x,w,"text")
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
}function d(A,t,s,y){var m=[],x="#cc0000",B="#ffff00",n="#339900",q,l,w,v,z,o,u;
if(A<t){return x
}if(A>s){return n
}if(y){if(A>0){m.push([0,B]);
m.push([s,x])
}else{m.push([t,n]);
m.push([0,B])
}}else{if(A>0){m.push([s,n]);
m.push([0,B])
}else{m.push([0,B]);
m.push([t,x])
}}z=[0,B];
for(o=0;
o<m.length;
o++){q=m[o][0];
if(q>=A){l=m[o][1];
w=z[0];
v=z[1];
u=((A-w)/(q-w));
return j(h(g(v),g(l),u),h(f(v),f(l),u),h(e(v),e(l),u))
}z=m[o]
}return B
}a.getColorInRange=d;
return a
});
WebAppLoader.addModule({name:"loadingMaskManager",sharedModules:["pageElements"],plugins:["helper"],hasEvents:true,isShared:true},function(){var e={},h=this.getConsole(),b=this.getEventManager(),a=this.getSharedModule("pageElements"),c=this.getPlugin("helper"),f=null,g={};
f=$(a.loadingText);
g.ajax={name:"ajax",enabled:true,el:a.loadingMask};
g.analysis={name:"analysis",enabled:true,el:a.chartLoadingMask};
g.turn={name:"turn",enabled:true,el:a.turnLoadingMask};
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
}function h(p,s){var q=f(p,s),t=e(q),u=null;
if(t){if(g.startsWith(t,'{"')){try{u=JSON.parse(t)
}catch(o){j.log("Local Storage Manager - failed to parse stored item:",key,u)
}}else{u=t
}}return u
}function m(o,p,s){var q=f(o,s),t="";
if(q&&g.hasValue(p)){t=(typeof p==="object")?JSON.stringify(p):p;
n(q,t)
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
a={blankPage:"#blank_page",dashboardPage:"#dashboard",homePage:"#home",portfoliosPage:"#portfolios",portfolioAnalysisPage:"#portfolioAnalysis",analysisPage:"#analysis",eulaPage:"#eula",settingsPage:"#settings",loginPage:"#login",startupPage:"#startup",chartSettingsPage:"#chartSettings",themesPage:"#themes",languageSettingsPages:"#languageSettings",errorPage:"#error",fullScreenPage:"#fullScreenPage",portfolioAnalysisLink:".defaultAnalysisLink",toolbar:".toolbar",loginButton:"#loginButton",loginErrorText:"#loginErrorText",loadingMask:"#myloading",chartLoadingMask:"#myLoadingCharts",turnLoadingMask:"#turnLoadingMask",userNameTextbox:"#userNameTextbox",passwordTextbox:"#passwordTextbox",tabbar:"nav#tabbar",listAnalysisSettingsDefaultPages:"#listAnalysisSettingsDefaultPages",listAnalysisSettingsUserPages:"#listAnalysisSettingsUserPages",chartsSelectbox:"#chartsSelectbox",analysisPageNameTextbox:"#analysisPageNameTextbox",saveChartSettings:"#saveChartSettings",addNewAnalysisPage:"#addNewAnalysisPage",analysisTitle:"#analysisTitle",loadingText:"#loadingText",listLanguagesPages:"#listLanguagesPages",timePeriodStartDateText:"#timePeriodStartDateText",timePeriodEndDateText:"#timePeriodEndDateText",errorMessageText:"#errorMessageText",stayLoggedCheckbox:"#stayLoggedCheckbox",userEmailLabel:"#userEmailLabel",summaryTitleName:"#summaryTitleName",summaryTitleBenchmarkName:"#summaryTitleBenchmarkName",resetCurrentSettingsButton:"#resetCurrentSettingsButton",resetAllSettingsButton:"#resetAllSettingsButton",reloadAppButton:"#reloadAppButton",analysisComponentFullScreenButton:".analysisComponentFullScreenButton",fullScreenContainer:"#fullScreenContainer",minimizeButton:"#minimizeButton",fullScreenMask:"#fullScreenMask",turnIcon:"#turnIcon"};
return a
});
WebAppLoader.addModule({name:"settings",dataObjects:["appSettings","userSettings"],isShared:true},function(){var h={},a={},i={},f=[],g=this.getConsole(),j=this.getDataObject("userSettings"),b=this.getDataObject("appSettings");
j.define({automaticLogin:false,username:"",password:"",language:"en-US",lastUsedLanguage:"none"});
b.define({lastLoggedOnUser:""});
a={loadPortfoliosSlotDataOnce:true,automaticLanguageDetection:true,animatedChartResizing:true,automaticChartRepositioning:false};
i={portfolios:"/portfolios",authenticate:"/authenticate",index:"/index",portfolioAnalysis:"/portfolioAnalysis",analysis:"/analysis",segmentsTreeNode:"/segmentsTreeNode",timeSeries:"/timeSeries",eula:"/eula"};
f=[{id:"en-US",value:"en-US",name:"English"},{id:"it-IT",value:"it-IT",name:"Italiano"},{id:"pl-PL",value:"pl-PL",name:"Polski"}];
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
function d(n,j,m,i){var k,l;
g="";
l=c.encode(n+":"+j);
k="Basic "+l;
a.post(m,{email:n,token:k,lang:i},function(o){if(o.authenticated){g=l;
e.raiseEvent("onLoginSuccess",k)
}else{e.raiseEvent("onLoginFailed",o.message)
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
}function g(v,m){var n,u={code:"",type:"",analysisLink:"",currency:"",version:"",timeStamp:"",timePeriods:[]};
function o(){if(v){return v
}else{return""
}}e=u.code=o();
q(t);
function q(w){var y={},x=null;
if(u.code){y.filter="Code eq '"+u.code+"'"
}else{y.start=0;
y.top=1
}a.post(l.siteUrls.portfolios,{oData:y,datatype:"json"},function(z){if(!z||!z.items||z.items.length<1){b.raiseEvent("onFailed",d.errors.portfolioNotFoundText);
return
}u.code=z.items[0].code;
x=z.items[0].links.defaultAnalysis.href;
w({defaultAnalysisLink:x})
},"json")
}function t(w){if(w.defaultAnalysisLink){u.analysisLink=w.defaultAnalysisLink;
p(w.defaultAnalysisLink,s)
}}function p(x,w){a.post(l.siteUrls.portfolioAnalysis,{uri:x,datatype:"json"},function(y){if(!y||!y.analysis){b.raiseEvent("onFailed",d.errors.analysisFailedText);
return
}u.name=y.name||"";
u.type=y.type||"";
u.currency=y.analysis.currency||"";
u.version=y.analysis.version||"";
if(y.analysis.results){u.timeStamp=y.analysis.results.timeStamp||"";
u.timePeriods=y.analysis.results.timePeriods||[]
}w()
},"json")
}function s(){j.setData(u);
f=u;
b.raiseEvent("onPortfolioLoaded",u);
b.raiseEvent("onTimePeriodsLoaded",u.timePeriods);
m(u.analysisLink)
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
WebAppLoader.addModule({name:"presentationManager",plugins:["helper","device"],sharedModules:["pageElements"],hasEvents:true},function(){var j={},d=this.getEventManager(),i=this.getConsole(),g=this.getPlugin("helper"),a=this.getPlugin("device"),b=this.getSharedModule("pageElements"),f=false;
$(b.minimizeButton).on("click",function(l,m){e();
l.preventDefault()
});
function c(l){f=true;
k();
$(b.fullScreenPage).show();
$(b.fullScreenPage).animate({opacity:1},{duration:750,easing:"ease-out",complete:function(){}});
$("#testChart").append($("#"+l));
$("#"+l).css("-webkit-transform","scale(1)")
}function e(){f=false;
$(b.fullScreenPage).animate({opacity:0},{duration:750,easing:"ease-out",complete:function(){$(b.fullScreenPage).css({display:"none"})
}})
}function h(){return f
}function k(){var p=Math.abs(window.orientation-90),n="0",q="0",m="0",l=false;
p=(p==180)?0:p;
if(a.isIPad()){if(p==90){q="1004px";
m="768px";
n="768px";
l=true
}else{q="1024px";
m="748px";
n="0";
l=false
}}else{if(p==90){q="460px";
m="320px";
n="320px";
l=true
}else{q="480px";
m="310px";
n="0";
l=false
}}if(l){$(b.turnIcon).animate({opacity:1},{duration:250,easing:"ease-out",complete:function(){$(b.fullScreenMask).css({display:"block"})
}})
}else{$(b.turnIcon).animate({opacity:0},{duration:250,easing:"ease-out",complete:function(){$(b.fullScreenMask).css({display:"none"})
}})
}$(b.fullScreenContainer).css({width:q,height:m,"-webkit-transform-origin":"left top","-webkit-transform":"rotate("+p+"deg)",left:n})
}$("body").bind("turn",function(l,m){if(h()){k()
}});
j.enterPresentationMode=c;
j.exitPresentationMode=e;
j.isFullScreen=h;
return j
});
WebAppLoader.addModule({name:"repositories",sharedModules:["settings","localizationManager","ajaxManager"],hasEvents:true},function(){var e={},b=this.getEventManager(),d=this.getConsole(),f=this.getSharedModule("settings"),a=this.getSharedModule("ajaxManager"),c=this.getSharedModule("localizationManager").getLanguage()||{};
e.portfoliosSlot=(function(){var k={},j=null;
b.attachTo(k);
function h(){return j
}function l(m){j=m;
k.raiseEvent("onItemsChanged",m)
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
return k
})();
e.analysisSlot=(function(){var j={},g=null;
b.attachTo(j);
function h(){return g;
return(g)?g:{err:c.spinningWheel.noAnalysisSlotAvailable}
}function k(m){g=m;
j.raiseEvent("onItemsChanged",m)
}function l(m){var n={};
$.each(m,function(o,p){n[p.code]=p.name
});
k(n)
}function i(m){var n=h();
m(n)
}j.getData=i;
j.setData=l;
return j
})();
e.timePeriodsSlot=(function(){var i={},l=null;
b.attachTo(i);
function h(){return(l)?l:{err:c.spinningWheel.noTimePeriodSlotAvailable}
}function k(m){l=m;
i.raiseEvent("onItemsChanged",m)
}function j(n){var m=null;
if(n&&n.length>0){m={};
$.each(n,function(o,p){m[p.code]=p.name
})
}k(m)
}function g(m){var n=h();
m(n)
}i.getData=g;
i.setData=j;
return i
})();
e.favouritesSlot=(function(){var j={},g=null;
b.attachTo(j);
function i(){return(g)?g:{err:c.spinningWheel.noFavouritesSlotAvailable}
}function l(m){g=m;
j.raiseEvent("onItemsChanged",m)
}function k(m){var n=null;
if(m&&m.length>0){n={};
$.each(m,function(o,p){n[p.code]=p.name
})
}l(n)
}function h(m){var n=i();
m(n)
}j.getData=h;
j.setData=k;
return j
})();
return e
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
j++){$(b.listLanguagesPages).append($("<li>").append($("<a>").attr({href:"#","data-link":JSON.stringify(f[j])}).html(f[j].name).on("click",h)))
}}g.create=a;
return g
});
var jQT=new $.jQTouch({addGlossToIcon:true,themeSelectionSelector:"#jqt #themes ul",useFastTouch:true,statusBar:"default",hoverDelay:10,pressDelay:2,preloadImages:["images/sw-slot-border.png","images/sw-alpha.png","images/sw-button-cancel.png","images/sw-button-done.png","images/sw-header.png"]});
Zepto(function(a){var l={},g=WebAppLoader,h=g.getConsole(),d=g.getEventManager(),e=g.loadModule("helper"),b=g.loadModule("device"),i=g.getSharedModule("settings").siteUrls,c=g.getSharedModule("pageElements"),f=g.getSharedModule("localizationManager").getLanguage()||{};
h.log("Hello from Dan & Asa!");
l.lastUsernameUsed="";
l.lastPasswordUsed="";
l.lastFavouriteSelected="";
l.lastAnalysisObjectUsed={portfolioId:"",portfolioName:"",analysisId:"performance",analysisName:"Performance",timePeriodId:"Earliest",timePeriodName:"Earliest",chartId:"performance_bar",timeStamp:""};
l.defaultLanguage="en-US";
l.repositories=g.loadModule("repositories");
l.scroll=g.loadModule("scroll");
l.nav=g.loadModule("nav");
l.mask=g.loadModule("loadingMaskManager");
l.settings=g.loadModule("settings");
l.automaticLanguageDetection=l.settings.appSettings.automaticLanguageDetection;
l.swipeView=g.loadModule("swipeView");
l.analysisSettingsPage=g.loadModule("analysisSettingsPage");
l.chartSettingsPage=g.loadModule("chartSettingsPage");
l.chartComponents=g.loadModule("chartComponents");
l.ajaxManager=g.loadModule("ajaxManager");
l.swipeButton=g.loadModule("swipeButton");
l.localStorage=g.loadModule("localStorageManager");
l.presentationManager=g.loadModule("presentationManager");
l.getLastAnalysisObjectUsed=function(){return l.lastAnalysisObjectUsed
};
l.setLastAnalysisObjectUsed=function(n){for(var o in n){if(l.lastAnalysisObjectUsed.hasOwnProperty(o)){l.lastAnalysisObjectUsed[o]=n[o]
}}};
l.getLanguage=function(){return e.getURLParameter("lang")||l.defaultLanguage
};
l.tryToChangeLanguage=function(o){var n=l.getLanguage();
if(o&&n&&(o.toLowerCase()!==n.toLowerCase())){l.nav.reloadApp("?lang="+o);
return true
}return false
};
l.startHere=function(){var n=l.settings.loadData("appSettings"),t={},p="",o=b.language()||"",s="",q="";
p=(n&&n.lastLoggedOnUser)?n.lastLoggedOnUser.toLowerCase():null;
if(p){l.settings.loadData("userSettings",p);
t=l.settings.getData("userSettings");
s=t.username||"";
q=t.password||"";
o=t.language||"";
if(l.automaticLanguageDetection){if(s!==""&&l.tryToChangeLanguage(o)){return
}}else{if(s!==""){l.tryToChangeLanguage(o)
}}Date.CultureInfo=f.cultureInfo;
if(t.automaticLogin){if(s&&q){l.doLogin(s,q)
}else{l.goToLoginPage(s||p)
}}else{l.goToLoginPage(s||p)
}}else{if(l.automaticLanguageDetection){if(!l.tryToChangeLanguage(o)){l.goToLoginPage()
}}else{l.goToLoginPage()
}}};
l.doLogin=function(o,n){l.lastUsernameUsed=o.toLowerCase();
l.lastPasswordUsed=n;
l.auth.doLogin(o,n,i.authenticate,l.getLanguage())
};
l.goToLoginPage=function(n){l.tabbar.hide();
a(c.userNameTextbox).val(n||"");
setTimeout(function(){l.nav.goToPage(a(c.loginPage),"dissolve")
},1000)
};
l.init=function(){var s="",p=false,n={};
l.nav.goToPage(a(c.startupPage),"dissolve");
l.tabbar.show();
var o=l.settings.loadData("appSettings"),u=l.settings.loadData("userSettings",l.lastUsernameUsed);
s=(o&&o.lastLoggedOnUser)?o.lastLoggedOnUser.toLowerCase():null;
o.lastLoggedOnUser=l.lastUsernameUsed;
l.settings.saveData("appSettings");
u.username=l.lastUsernameUsed;
u.password=l.lastPasswordUsed;
if(u.lastUsedLanguage==="none"){u.language=l.getLanguage();
u.lastUsedLanguage=u.language
}l.settings.saveData("userSettings",l.lastUsernameUsed);
p=e.getValueAs(u.automaticLogin,"boolean");
var t=l.themesManager.loadData("theme",l.lastUsernameUsed);
l.themesManager.switchStyle(t);
var q=u.lastAnalysisObjectUsed||null;
l.updateSettingsPage({email:l.lastUsernameUsed,automaticLogin:p});
l.analysisManager.update(l.lastUsernameUsed);
l.favouritesManager.update(l.lastUsernameUsed);
l.updateAnalysisPage(q)
};
l.updateAnalysisPage=function(o){var n=o||l.getLastAnalysisObjectUsed();
l.tabbar.getButton("settings").setHighlight(false);
l.nav.goToPage(a(c.analysisPage),"dissolve");
function q(y){var w=[],u={},s={},z=y.code,A=y.name,t=null,v="",x;
u=l.analysisManager.getData("analysisPages");
s=jLinq.from(u.items).equals("id",n.analysisId).select();
if(s[0]&&s[0].charts){t=s[0].charts;
v=s[0].name
}else{t=u.items[0].charts;
v=u.items[0].name
}w=jLinq.from(t).sort("order").select();
a(c.analysisTitle).html(v);
a.each(y.timePeriods,function(C,D){var E,B;
if(D.code===n.timePeriodId){l.chartComponents.setTimePeriod(w,D);
E=Date.parse(D.startDate);
B=Date.parse(D.endDate);
a(c.timePeriodStartDateText).html(E.toString("MMM d, yyyy"));
a(c.timePeriodEndDateText).html(B.toString("MMM d, yyyy"));
return false
}});
l.setLastAnalysisObjectUsed(n);
l.setLastAnalysisObjectUsed({portfolioId:z,portfolioName:A});
l.tabbar.getButton("settings").setHighlight(false);
l.saveLastAnalysisObjectUsed();
l.synchronizeFavouriteButton();
l.chartComponents.render(w,"#analysis_partial");
l.synchronizeOrientation();
a(c.analysisComponentFullScreenButton).on("click",function(C,D){var B=a(this).attr("data-chartId");
l.presentationManager.enterPresentationMode(B)
})
}function p(s){q(s)
}l.portfolioManager.loadPortfolioAnalysis(n.portfolioId,p)
};
l.saveLastAnalysisObjectUsed=function(){var n=l.settings.loadData("userSettings",l.lastUsernameUsed);
n.lastAnalysisObjectUsed=l.getLastAnalysisObjectUsed();
l.settings.saveData("userSettings",l.lastUsernameUsed)
};
l.chartComponents.on("onAllChartsLoaded",function(){h.log("onAllChartsLoaded")
});
l.chartComponents.on("onChartsLoading",function(n,o){h.log("onChartsLoading",n,o)
});
l.showAnalysisSettingsPage=function(){var o={},n;
o=l.analysisManager.getData("analysisPages");
n=jLinq.from(o.items).sort("order","userDefined").select(function(p){return{name:p.name,id:p.id,userDefined:p.userDefined}
});
l.analysisSettingsPage.create(n)
};
l.analysisSettingsPage.on("onClick",function(n){l.nav.goToPage(c.chartSettingsPage,"slideup");
l.showChartSettingsPage(n)
});
l.analysisSettingsPage.on("onPageLoaded",function(){l.swipeButton.addTo("#listAnalysisSettingsUserPages","Delete",l.onUserPageDeleted,true)
});
l.onUserPageDeleted=function(n){var p=n.parent().parent().data("link")||null,o;
o=l.analysisManager.getData("analysisPages");
if(e.removeObjectFromArray(o.items,"id",p)){l.analysisManager.saveData("analysisPages",l.lastUsernameUsed);
l.updateAnalysisSlot(o)
}};
l.showChartSettingsPage=function(n){var p={},s={},o={},t=l.showChartSettingsPage.charts;
if(!n){return
}p=l.analysisManager.getData("analysisPages");
s=l.chartComponents.getData("charts");
o=jLinq.from(p.items).equals("id",n).select(function(u){return{name:u.name,id:u.id,charts:u.charts}
})[0]||null;
if(!o){o={name:"",id:n,charts:[]}
}if(t.length===0){for(var q in s){t.push({chartId:s[q].chartId,chartType:s[q].chartType,chartTitle:s[q].title})
}l.chartSettingsPage.create(t)
}l.chartSettingsPage.update(o)
};
l.chartSettingsPage.on("onSettingsChanged",function(p){var n,o;
p.name=p.name||"Untitled";
o=l.analysisManager.getData("analysisPages");
n=jLinq.from(o.items).equals("id",p.id).select()[0]||null;
if(n){a.extend(n,p)
}else{o.items.push(p)
}l.analysisManager.saveData("analysisPages",l.lastUsernameUsed);
l.updateAnalysisSlot(o);
l.setLastAnalysisObjectUsed({analysisId:p.id,analysisName:p.name});
l.updateAnalysisPage()
});
l.showChartSettingsPage.charts=[];
l.updateSettingsPage=function(p){var o=p.email||null,n=p.automaticLogin||false;
if(o){a(c.userEmailLabel).html(l.lastUsernameUsed)
}if(n){a(c.stayLoggedCheckbox).attr("checked",true)
}else{a(c.stayLoggedCheckbox).removeAttr("checked")
}};
l.languageSettingsPage=g.loadModule("languageSettingsPage");
l.languageSettingsPage.create();
l.languageSettingsPage.on("onLanguageSelected",function(n){var o=l.settings.loadData("userSettings",l.lastUsernameUsed);
o.language=n.value;
l.settings.saveData("userSettings",l.lastUsernameUsed);
h.log("onLanguageSelected",n);
l.nav.reloadApp("?lang="+n.value)
});
l.portfolioManager=g.loadModule("portfolioManager");
l.portfolioManager.on("onPortfolioLoaded",function(n){l.repositories.timePeriodsSlot.setData(n.timePeriods);
h.log("Loaded portfolio:",n)
});
l.portfolioManager.on("onAnalysisLoaded",function(n){l.updateAnalysisInfo(n);
l.tabbar.show()
});
l.portfolioManager.on("onFailed",function(n){l.scroll.rebuild("error");
a(c.errorMessageText).html(n);
l.nav.goToPage(a(c.errorPage))
});
l.updateAnalysisInfo=function(p){var q,o,n;
if(p){if(p.name.indexOf(" ")===-1){a(c.summaryTitleName).attr("style","word-break: break-all;")
}else{a(c.summaryTitleName).attr("style","word-break: normal;")
}a(c.summaryTitleName).html(p.name);
n=a(c.summaryTitleBenchmarkName);
n.html("");
o=p.analysis.benchmarks||[];
for(q=0;
q<o.length;
q++){if(q>0){n.append(", ")
}n.append(o[q].name)
}a(c.analysisPage+"_partial").html("")
}};
var m={toolbarId:"#analysis .toolbar",buttonPrefix:"toolbar_btn",visible:true,items:[{id:"favourite",title:f.tabbar.favourites,btnClass:"favourite"}]};
l.toolbar=g.loadModule("toolbar");
l.toolbar.create(m);
l.toolbar.on("onTap",function(){l.scroll.goUp()
});
l.toolbar.on("onFavouriteTap",function(n){if(n){l.addToFavourites()
}else{l.removeFromFavourites()
}});
l.toolbar.on("onTestTap",function(n){l.onTestApp()
});
l.toolbar.on("onTestEvent",function(){alert("toolbar")
});
var k={tabbarId:c.tabbar,buttonPrefix:"tabbar_btn",visible:false,items:[{id:"favourites",title:f.tabbar.favourites,btnClass:"favourites"},{id:"portfolios",title:f.tabbar.portfolios,btnClass:"portfolios"},{id:"analysis",title:f.tabbar.analysis,btnClass:"analysis"},{id:"timePeriods",title:f.tabbar.timePeriods,btnClass:"timeperiods"},{id:"settings",title:f.tabbar.settings,btnClass:"settings",highlight:true}]};
l.tabbar=g.loadModule("tabbar");
l.tabbar.create(k);
l.tabbar.on("onTestEvent",function(){alert("tabbar")
});
l.tabbar.on("onFavouritesTap",function(){l.spinningWheel.getSlot("favourites").show(l.lastFavouriteSelected)
});
l.tabbar.on("onPortfoliosTap",function(){l.spinningWheel.getSlot("portfolios").show(l.getLastAnalysisObjectUsed().portfolioId)
});
l.tabbar.on("onAnalysisTap",function(){l.spinningWheel.getSlot("analysis").show(l.getLastAnalysisObjectUsed().analysisId)
});
l.tabbar.on("onTimePeriodsTap",function(){l.spinningWheel.getSlot("timePeriods").show(l.getLastAnalysisObjectUsed().timePeriodId)
});
l.tabbar.on("onSettingsTap",function(n){if(n.isHighlighted){l.nav.goToPage(a(c.settingsPage))
}else{l.nav.goToPage(a(c.analysisPage))
}});
var j={items:[{id:"favourites",repository:l.repositories.favouritesSlot},{id:"portfolios",repository:l.repositories.portfoliosSlot},{id:"analysis",repository:l.repositories.analysisSlot},{id:"timePeriods",repository:l.repositories.timePeriodsSlot}]};
l.spinningWheel=g.loadModule("spinningWheel");
l.spinningWheel.create(j);
l.spinningWheel.on("onPortfoliosDone",function(n,o){l.setLastAnalysisObjectUsed({portfolioId:n,portfolioName:o});
l.updateAnalysisPage()
});
l.spinningWheel.on("onAnalysisDone",function(n,o){l.setLastAnalysisObjectUsed({analysisId:n,analysisName:o});
l.updateAnalysisPage()
});
l.spinningWheel.on("onTimePeriodsDone",function(n,o){l.setLastAnalysisObjectUsed({timePeriodId:n,timePeriodName:o});
l.updateAnalysisPage()
});
l.spinningWheel.on("onFavouritesDone",function(o,p){var n=l.favouritesManager.getAnalysisDataObjectFromFavourte(o);
if(n){l.setLastAnalysisObjectUsed(n);
l.updateAnalysisPage()
}});
l.auth=g.loadModule("auth");
a(c.loginButton).on("click",function(){var o,n;
o=a(c.userNameTextbox).val();
n=a(c.passwordTextbox).val();
l.doLogin(o,n)
});
l.auth.on("onLoginSuccess",function(n){l.ajaxManager.setToken(n);
l.init()
});
l.auth.on("onLoginFailed",function(n){a(c.loginErrorText).html(n);
h.log("onLoginFailed response: ",n)
});
l.pageEventsManager=g.loadModule("pageEventsManager");
l.pageEventsManager.on("onStartupStart",function(){h.log("onStartupEnd")
});
l.pageEventsManager.on("onLoginStart",function(){l.tabbar.hide();
h.log("onLoginStart")
});
l.pageEventsManager.on("onHomeStart",function(){h.log("onHomeStart")
});
l.pageEventsManager.on("onHomeEnd",function(){l.tabbar.show();
l.scroll.rebuild("home");
h.log("onHomeEnd")
});
l.pageEventsManager.on("onEulaEnd",function(){a.get(i.eula,function(n){l.scroll.rebuild("eula");
a(c.eulaPage+"_partial").append('<div class="genericContainer">'+e.htmlDecode(n)+"</div>")
});
h.log("onEulaEnd")
});
l.pageEventsManager.on("onAnalysisEnd",function(){l.scroll.rebuild("analysis");
l.tabbar.getButton("settings").setHighlight(false);
h.log("onAnalysisEnd")
});
l.pageEventsManager.on("onSettingsStart",function(){l.scroll.rebuild("settings",true);
h.log("onSettingsStart")
});
l.pageEventsManager.on("onSettingsEnd",function(){h.log("onSettingsEnd")
});
l.pageEventsManager.on("onAnalysisSettingsEnd",function(){l.scroll.rebuild("analysisSettings",true);
h.log("onAnalysisSettingsEnd")
});
l.pageEventsManager.on("onAnalysisPagesSettingsStart",function(){l.scroll.rebuild("analysisPagesSettings",true);
l.showAnalysisSettingsPage();
h.log("onAnalysisPagesSettingsStart")
});
l.pageEventsManager.on("onChartSettingsEnd",function(){setTimeout(function(){a(c.analysisPageNameTextbox).focus()
},200);
h.log("onChartSettingsStart")
});
l.pageEventsManager.on("onAboutEnd",function(){l.scroll.rebuild("about",true);
h.log("onAboutEnd")
});
l.pageEventsManager.on("onTestEnd",function(){l.scroll.rebuild("test");
h.log("onTestEnd")
});
l.pageEventsManager.on("onResetEnd",function(){l.scroll.rebuild("reset",true);
h.log("onResetEnd")
});
a(c.reloadAppButton).on("click",function(){l.nav.reloadApp()
});
a(c.resetAllSettingsButton).on("click",function(){l.localStorage.clearAll();
l.nav.reloadApp()
});
a(c.resetCurrentSettingsButton).on("click",function(){l.localStorage.clearUserSettings(l.lastUsernameUsed);
l.nav.goToPage(a(c.settingsPage))
});
a(c.stayLoggedCheckbox).on("click",function(){var n=a(c.stayLoggedCheckbox+":checked").val()?true:false,o=l.settings.loadData("userSettings",l.lastUsernameUsed);
o.automaticLogin=n;
l.settings.saveData("userSettings",l.lastUsernameUsed);
h.log(n)
});
l.analysisManager=g.loadModule("analysisManager");
l.analysisManager.on("onUpdated",function(n){l.updateAnalysisSlot(n)
});
l.updateAnalysisSlot=function(n){var o=jLinq.from(n.items).sort("order").select(function(p){return{name:p.name,code:p.id}
});
l.repositories.analysisSlot.setData(o)
};
l.favouritesManager=g.loadModule("favouritesManager");
l.favouritesManager.on("onFavouritesUpdated",function(n){l.updateFavouritesSlot(n)
});
l.updateFavouritesSlot=function(n){var o=jLinq.from(n.items).sort("order").select(function(p){return{name:p.title,code:p.favouriteId}
});
l.repositories.favouritesSlot.setData(o)
};
l.analysisDataObjectToFavourite=function(n){var o=null;
o=l.favouritesManager.getFavourteFromAnalysisDataObject(n);
return o||null
};
l.favouriteExists=function(n){var o=l.getFavouriteById(n);
return(o&&true)
};
l.getFavouriteById=function(o){var n=null,q=null,p=l.favouritesManager.getData("favourites");
if(!o){n=l.analysisDataObjectToFavourite(l.lastAnalysisObjectUsed);
o=n.favouriteId
}q=jLinq.from(p.items).equals("favouriteId",o).select()[0]||null;
return(q)
};
l.addToFavourites=function(){var o={},n=null;
o=l.analysisDataObjectToFavourite(l.lastAnalysisObjectUsed);
if(o){if(!l.favouriteExists(o.favouriteId)){n=l.favouritesManager.getData("favourites");
n.items.push(o);
l.favouritesManager.saveData("favourites",l.lastUsernameUsed);
l.favouritesManager.update(l.lastUsernameUsed);
l.setLastFavouriteSelected(o.favouriteId)
}}};
l.removeFromFavourites=function(){var o={},n=null;
o=l.analysisDataObjectToFavourite(l.lastAnalysisObjectUsed);
if(o){if(l.favouriteExists(o.favouriteId)){n=l.favouritesManager.getData("favourites");
if(e.removeObjectFromArray(n.items,"favouriteId",o.favouriteId)){l.favouritesManager.saveData("favourites",l.lastUsernameUsed);
l.favouritesManager.update(l.lastUsernameUsed)
}}}};
l.synchronizeFavouriteButton=function(p){var n=l.getFavouriteById(p),o=l.toolbar.getButton("favourite");
if(n&&o){l.setLastFavouriteSelected(n.favouriteId);
o.select()
}else{o.deselect()
}};
l.setLastFavouriteSelected=function(n){l.lastFavouriteSelected=n
};
l.themesManager=g.loadModule("themesManager");
l.themesManager.on("onThemeChanged",function(o){var n=l.themesManager.getData("theme")||null;
if(n){n.name=o;
l.themesManager.saveData("theme",l.lastUsernameUsed)
}h.log("onThemeChanged",o)
});
l.portfoliosList=g.loadModule("portfoliosList");
l.portfoliosList.on("onDataReceived",function(n){a(c.analysisPage+"_partial").html(n)
});
g.unloadModule("ajaxManager");
g.unloadModule("analysisManager");
g.unloadModule("analysisSettingsPage");
g.unloadModule("auth");
g.unloadModule("chartComponents");
g.unloadModule("chartSettingsPage");
g.unloadModule("device");
g.unloadModule("favouritesManager");
g.unloadModule("helper");
g.unloadModule("languageSettingsPage");
g.unloadModule("loadingMaskManager");
g.unloadModule("localStorageManager");
g.unloadModule("nav");
g.unloadModule("pageEventsManager");
g.unloadModule("portfoliosList");
g.unloadModule("portfolioManager");
g.unloadModule("repositories");
g.unloadModule("scroll");
g.unloadModule("tabbar");
g.unloadModule("settings");
g.unloadModule("spinningWheel");
g.unloadModule("swipeButton");
g.unloadModule("swipeView");
g.unloadModule("themesManager");
g.unloadModule("toolbar");
g.unloadModule("presentationManager");
l.startHere();
l.synchronizeOrientation=function(){var n=25,p=500,o=null;
if(l.presentationManager.isFullScreen()){return
}n=(l.settings.appSettings.animatedChartResizing)?500:25;
l.mask.show("turn");
if(b.orientation()==="landscape"){a(".analysisComponentContainer").animate({height:"500px"},{duration:n,easing:"ease-out",complete:function(){a(".chartContainer").css({"-webkit-transform":"scale(.93)","-webkit-transform-origin":"left top"})
}})
}else{a(".chartContainer").css({"-webkit-transform":"scale(.69)","-webkit-transform-origin":"left top"});
a(".analysisComponentContainer").animate({height:"375px"},{duration:n,easing:"ease-out",complete:function(){}})
}if(l.settings.appSettings.automaticChartRepositioning){l.synchronizeOrientation.pendingCount+=1;
setTimeout(function(){if(l.synchronizeOrientation.pendingCount>0){l.synchronizeOrientation.pendingCount-=1
}if(l.synchronizeOrientation.pendingCount===0){l.scroll.rebuild("analysis");
if(l.synchronizeOrientation.chartToDisplay!==""){l.scroll.scrollToElement("#"+l.synchronizeOrientation.chartToDisplay,75,25)
}l.mask.hide("turn")
}},n+p)
}else{setTimeout(function(){l.scroll.rebuild("analysis");
l.mask.hide("turn")
},n+p)
}};
l.synchronizeOrientation.pendingCount=0;
l.synchronizeOrientation.chartToDisplay="";
l.getCurrentChartDisplayedInViewport=function(){var n=75,q=0,p=[],o={},t=[],s=0;
q=(b.orientation()==="landscape")?(b.maxHeight())/2+n:(b.maxWidth())/2+n;
a(".snapper").each(function(){var u,v;
v=Math.abs(a(this).offset().top-n);
u=a(this).data("chartid");
v=(v>=q)?v-q:v;
t.push(v);
p.push({y:v,chartId:u})
});
s=Math.min.apply(Math,t);
o=e.getObjectFromArray(p,"y",s);
return o.chartId
};
a("body").bind("turn",function(n,o){l.synchronizeOrientation.chartToDisplay=l.getCurrentChartDisplayedInViewport();
l.synchronizeOrientation()
});
l.onTestApp=function(){};
l.blackbird=g.loadModule("blackbird");
l.blackbird.toggle();
l.blackbird.debug("Hey what's happened?");
l.blackbird.debug(JSON.stringify(l))
});