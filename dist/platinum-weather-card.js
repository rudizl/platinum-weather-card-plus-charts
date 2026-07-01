var t=function(e,i){return t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])},t(e,i)};function e(e,i){if("function"!=typeof i&&null!==i)throw new TypeError("Class extends value "+String(i)+" is not a constructor or null");function o(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(o.prototype=i.prototype,new o)}var i=function(){return i=Object.assign||function(t){for(var e,i=1,o=arguments.length;i<o;i++)for(var s in e=arguments[i])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t},i.apply(this,arguments)};function o(t,e,i,o){var s,n=arguments.length,a=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,o);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(e,i,a):s(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}function s(t){var e="function"==typeof Symbol&&Symbol.iterator,i=e&&t[e],o=0;if(i)return i.call(t);if(t&&"number"==typeof t.length)return{next:function(){return t&&o>=t.length&&(t=void 0),{value:t&&t[o++],done:!t}}};throw new TypeError(e?"Object is not iterable.":"Symbol.iterator is not defined.")}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n=window,a=n.ShadowRoot&&(void 0===n.ShadyCSS||n.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),l=new WeakMap;class c{constructor(t,e,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=l.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&l.set(e,t))}return t}toString(){return this.cssText}}const d=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new c("string"==typeof t?t:t+"",void 0,r))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var h;const u=window,p=u.trustedTypes,m=p?p.emptyScript:"",_=u.reactiveElementPolyfillSupport,f={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},g=(t,e)=>e!==t&&(e==e||t==t),v={attribute:!0,type:String,converter:f,reflect:!1,hasChanged:g},y="finalized";class b extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const o=this._$Ep(i,e);void 0!==o&&(this._$Ev.set(o,i),t.push(o))}),t}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const s=this[t];this[e]=o,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty(y))return!1;this[y]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(d(t))}else void 0!==t&&e.push(d(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{a?t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(e=>{const i=document.createElement("style"),o=n.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,t.appendChild(i)})})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=v){var o;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:f).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,e){var i;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:f;this._$El=s,this[s]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let o=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||g)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var x;b[y]=!0,b.elementProperties=new Map,b.elementStyles=[],b.shadowRootOptions={mode:"open"},null==_||_({ReactiveElement:b}),(null!==(h=u.reactiveElementVersions)&&void 0!==h?h:u.reactiveElementVersions=[]).push("1.6.3");const w=window,$=w.trustedTypes,E=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,S="?"+k,I=`<${S}>`,A=document,T=()=>A.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,R="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,D=/>/g,M=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,V=/"/g,z=/^(?:script|style|textarea|title)$/i,U=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),H=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),W=new WeakMap,j=A.createTreeWalker(A,129,null,!1);function q(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==E?E.createHTML(e):e}const G=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":"",a=L;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===L?"!--"===l[1]?a=N:void 0!==l[1]?a=D:void 0!==l[2]?(z.test(l[2])&&(s=RegExp("</"+l[2],"g")),a=M):void 0!==l[3]&&(a=M):a===M?">"===l[0]?(a=null!=s?s:L,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?M:'"'===l[3]?V:P):a===V||a===P?a=M:a===N||a===D?a=L:(a=M,s=void 0);const h=a===M&&t[e+1].startsWith("/>")?" ":"";n+=a===L?i+I:c>=0?(o.push(r),i.slice(0,c)+C+i.slice(c)+k+h):i+k+(-2===c?(o.push(void 0),e):h)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),o]};class X{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const a=t.length-1,r=this.parts,[l,c]=G(t,e);if(this.el=X.createElement(l,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(o=j.nextNode())&&r.length<a;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const e of o.getAttributeNames())if(e.endsWith(C)||e.startsWith(k)){const i=c[n++];if(t.push(e),void 0!==i){const t=o.getAttribute(i.toLowerCase()+C).split(k),e=/([.?@])?(.*)/.exec(i);r.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?J:"?"===e[1]?et:"@"===e[1]?it:Q})}else r.push({type:6,index:s})}for(const e of t)o.removeAttribute(e)}if(z.test(o.tagName)){const t=o.textContent.split(k),e=t.length-1;if(e>0){o.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],T()),j.nextNode(),r.push({type:2,index:++s});o.append(t[e],T())}}}else if(8===o.nodeType)if(o.data===S)r.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(k,t+1));)r.push({type:7,index:s}),t+=k.length-1}s++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,o){var s,n,a,r;if(e===H)return e;let l=void 0!==o?null===(s=i._$Co)||void 0===s?void 0:s[o]:i._$Cl;const c=O(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,o)),void 0!==o?(null!==(a=(r=i)._$Co)&&void 0!==a?a:r._$Co=[])[o]=l:i._$Cl=l),void 0!==l&&(e=Y(t,l._$AS(t,e.values),l,o)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:o}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(i,!0);j.currentNode=s;let n=j.nextNode(),a=0,r=0,l=o[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new Z(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new ot(n,this,t)),this._$AV.push(e),l=o[++r]}a!==(null==l?void 0:l.index)&&(n=j.nextNode(),a++)}return j.currentNode=A,s}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,o){var s;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cp=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==H&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>F(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&O(this._$AH)?this._$AA.nextSibling.data=t:this.$(A.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=X.createElement(q(o.h,o.h[0]),this.options)),o);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(i);else{const t=new K(s,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=W.get(t.strings);return void 0===e&&W.set(t.strings,e=new X(t)),e}T(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new Z(this.k(T()),this.k(T()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Q{constructor(t,e,i,o,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=Y(this,t,e,0),n=!O(t)||t!==this._$AH&&t!==H,n&&(this._$AH=t);else{const o=t;let a,r;for(t=s[0],a=0;a<s.length-1;a++)r=Y(this,o[i+a],e,a),r===H&&(r=this._$AH[a]),n||(n=!O(r)||r!==this._$AH[a]),r===B?t=B:t!==B&&(t+=(null!=r?r:"")+s[a+1]),this._$AH[a]=r}n&&!o&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class J extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const tt=$?$.emptyScript:"";class et extends Q{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,tt):this.element.removeAttribute(this.name)}}class it extends Q{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Y(this,t,e,0))&&void 0!==i?i:B)===H)return;const o=this._$AH,s=t===B&&o!==B||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,n=t!==B&&(o===B||s);s&&this.element.removeEventListener(this.name,this,o),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const st=w.litHtmlPolyfillSupport;null==st||st(X,Z),(null!==(x=w.litHtmlVersions)&&void 0!==x?x:w.litHtmlVersions=[]).push("2.8.0");const nt=window,at=nt.ShadowRoot&&(void 0===nt.ShadyCSS||nt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,rt=Symbol(),lt=new WeakMap;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ct{constructor(t,e,i){if(this._$cssResult$=!0,i!==rt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(at&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=lt.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&lt.set(e,t))}return t}toString(){return this.cssText}}const dt=t=>new ct("string"==typeof t?t:t+"",void 0,rt),ht=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new ct(i,t,rt)},ut=at?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return dt(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt;const mt=window,_t=mt.trustedTypes,ft=_t?_t.emptyScript:"",gt=mt.reactiveElementPolyfillSupport,vt={toAttribute(t,e){switch(e){case Boolean:t=t?ft:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},yt=(t,e)=>e!==t&&(e==e||t==t),bt={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:yt},xt="finalized";class wt extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const o=this._$Ep(i,e);void 0!==o&&(this._$Ev.set(o,i),t.push(o))}),t}static createProperty(t,e=bt){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const s=this[t];this[e]=o,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||bt}static finalize(){if(this.hasOwnProperty(xt))return!1;this[xt]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(ut(t))}else void 0!==t&&e.push(ut(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{at?t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):e.forEach(e=>{const i=document.createElement("style"),o=nt.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,t.appendChild(i)})})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=bt){var o;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:vt).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$El=null}}_$AK(t,e){var i;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:vt;this._$El=s,this[s]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let o=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||yt)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var $t,Et;wt[xt]=!0,wt.elementProperties=new Map,wt.elementStyles=[],wt.shadowRootOptions={mode:"open"},null==gt||gt({ReactiveElement:wt}),(null!==(pt=mt.reactiveElementVersions)&&void 0!==pt?pt:mt.reactiveElementVersions=[]).push("1.6.3");class Ct extends wt{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var o,s;const n=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:e;let a=n._$litPart$;if(void 0===a){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;n._$litPart$=a=new Z(e.insertBefore(T(),t),t,void 0,null!=i?i:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return H}}Ct.finalized=!0,Ct._$litElement$=!0,null===($t=globalThis.litElementHydrateSupport)||void 0===$t||$t.call(globalThis,{LitElement:Ct});const kt=globalThis.litElementPolyfillSupport;null==kt||kt({LitElement:Ct}),(null!==(Et=globalThis.litElementVersions)&&void 0!==Et?Et:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const St=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:o}=e;return{kind:i,elements:o,finisher(e){customElements.define(t,e)}}})(t,e),It=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function At(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):It(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Tt(t){return At({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=({finisher:t,descriptor:e})=>(i,o)=>{var s;if(void 0===o){const o=null!==(s=i.originalKey)&&void 0!==s?s:i.key,n=null!=e?{kind:"method",placement:"prototype",key:o,descriptor:e(i.key)}:{...i,key:o};return null!=t&&(n.finisher=function(e){t(e,o)}),n}{const s=i.constructor;void 0!==e&&Object.defineProperty(i,o,e(o)),null==t||t(s,o)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ft(t){return Ot({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Rt(t,e){return Ot({descriptor:i=>{const o={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;o.get=function(){var i,o;return void 0===this[e]&&(this[e]=null!==(o=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==o?o:null),this[e]}}return o}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Lt(t){return Ot({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var Nt;const Dt=null!=(null===(Nt=window.HTMLSlotElement)||void 0===Nt?void 0:Nt.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter(t=>t.nodeType===Node.ELEMENT_NODE);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Mt(t,e,i){let o,s=t;return"object"==typeof t?(s=t.slot,o=t):o={flatten:e},i?function(t){const{slot:e,selector:i}=null!=t?t:{};return Ot({descriptor:o=>({get(){var o;const s="slot"+(e?`[name=${e}]`:":not([name])"),n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(s),a=null!=n?Dt(n,t):[];return i?a.filter(t=>t.matches(i)):a},enumerable:!0,configurable:!0})})}({slot:s,flatten:e,selector:i}):Ot({descriptor:t=>({get(){var t,e;const i="slot"+(s?`[name=${s}]`:":not([name])"),n=null===(t=this.renderRoot)||void 0===t?void 0:t.querySelector(i);return null!==(e=null==n?void 0:n.assignedNodes(o))&&void 0!==e?e:[]},enumerable:!0,configurable:!0})})}var Pt,Vt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(Pt||(Pt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(Vt||(Vt={}));var zt=["closed","locked","off"],Ut=function(t,e,i,o){o=o||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===o.bubbles||o.bubbles,cancelable:Boolean(o.cancelable),composed:void 0===o.composed||o.composed});return s.detail=i,t.dispatchEvent(s),s},Ht=function(t){Ut(window,"haptic",t)},Bt=function(t,e,i,o){if(o||(o={action:"more-info"}),!o.confirmation||o.confirmation.exemptions&&o.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(Ht("warning"),confirm(o.confirmation.text||"Are you sure you want to "+o.action+"?")))switch(o.action){case"more-info":(i.entity||i.camera_image)&&Ut(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":o.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),Ut(window,"location-changed",{replace:i})}(0,o.navigation_path);break;case"url":o.url_path&&window.open(o.url_path);break;case"toggle":i.entity&&(function(t,e){(function(t,e,i){void 0===i&&(i=!0);var o,s=function(t){return t.substr(0,t.indexOf("."))}(e),n="group"===s?"homeassistant":s;switch(s){case"lock":o=i?"unlock":"lock";break;case"cover":o=i?"open_cover":"close_cover";break;default:o=i?"turn_on":"turn_off"}t.callService(n,o,{entity_id:e})})(t,e,zt.includes(t.states[e].state))}(e,i.entity),Ht("success"));break;case"call-service":if(!o.service)return void Ht("failure");var s=o.service.split(".",2);e.callService(s[0],s[1],o.service_data,o.target),Ht("success");break;case"fire-dom-event":Ut(t,"ll-custom",o)}},Wt=function(t,e,i,o){var s;"double_tap"===o&&i.double_tap_action?s=i.double_tap_action:"hold"===o&&i.hold_action?s=i.hold_action:"tap"===o&&i.tap_action&&(s=i.tap_action),Bt(t,e,i,s)};function jt(t){return void 0!==t&&"none"!==t.action}const qt=(t,e)=>t(`component.weather.entity_component._.state.${e}`)||e,Gt=t=>null!=t?t:B,Xt=1,Yt=2,Kt=3,Zt=4,Qt=t=>(...e)=>({_$litDirective$:t,values:e});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class Jt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class te extends Jt{constructor(t){if(super(t),this.et=B,t.type!==Yt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===B||null==t)return this.ft=void 0,this.et=t;if(t===H)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}te.directiveName="unsafeHTML",te.resultType=1;const ee=Qt(te);console.info("%c  PLATINUM-WEATHER-CARD-TL  \n%c  Version 2.0.0-preview          ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"platinum-weather-card-plus-charts",name:"Platinum Weather Card Plus Charts",description:"An fully customisable weather card with a GUI configuration"});let ie=class extends Ct{constructor(){super(...arguments),this._cardWidth=492,this._error=[],this._pHoldFired=!1,this._clickCount=0}static get properties(){return{_config:{},_forecastEvent:{},hass:{}}}static async getConfigElement(){return await Promise.resolve().then(function(){return ns}),document.createElement("platinum-weather-card-plus-charts-editor")}static getStubConfig(){return{}}getCardSize(){const t=16+this._getCardSizeOverviewSection()+this._getCardSizeExtendedSection()+this._getCardSizeSlotsSection()+this._getCardSizeDailyForecastSection();return Math.ceil(t/50)}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=/^[a-z0-9_]+\.[a-z0-9_]+$/,i=["weather_entity","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","entity_extended","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_following","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_update_time"];for(const o of i){const i=t[o];if(i&&"string"==typeof i&&!e.test(i))throw new Error(`platinum-weather-card-plus-charts: "${o}" has invalid entity ID format: "${i}". Expected format: domain.object_id (e.g. sensor.temperature).`)}const o=["overview","extended","slots","daily_forecast","charts"];if(t.section_order){if(!Array.isArray(t.section_order))throw new Error("platinum-weather-card: section_order must be an array.");for(const e of t.section_order)if(!o.includes(e))throw new Error(`platinum-weather-card-plus-charts: invalid section "${e}" in section_order. Valid values: ${o.join(", ")}.`)}if(void 0!==t.daily_forecast_days){const e=Number(t.daily_forecast_days);if(!Number.isInteger(e)||e<1||e>7)throw new Error(`platinum-weather-card-plus-charts: daily_forecast_days must be an integer between 1 and 7, got "${t.daily_forecast_days}".`)}t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({name:"Weather",forecast_type:"daily"},t)}_needForecastSubscription(){return this._config&&this._config.weather_entity&&this._config.forecast_type&&"legacy"!==this._config.forecast_type}_unsubscribeForecastEvents(){this._subscribed&&(this._subscribed.then(t=>t()),this._subscribed=void 0)}async _subscribeForecastEvents(){var t,e,i,o;(this._unsubscribeForecastEvents(),this.isConnected&&this.hass&&this._config&&this._needForecastSubscription())&&(this.hass&&this._config&&(this._subscribed=(t=this.hass,e=this._config.weather_entity,i=this._config.forecast_type,o=t=>{this._forecastEvent=t},t.connection.subscribeMessage(o,{type:"weather/subscribe_forecast",forecast_type:i,entity_id:e}))))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._config&&this.hass&&this._subscribeForecastEvents(),this.addEventListener("pointerdown",this._onPointerDown.bind(this)),this.addEventListener("pointercancel",this._onPointerCancel.bind(this)),this.addEventListener("click",this._onCardClick.bind(this))}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeForecastEvents(),clearTimeout(this._pHoldTimer),clearTimeout(this._clickTimer)}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config")||t.has("_forecastEvent"))return!0;if(t.has("hass"))return!0;const e=t.get("hass")||void 0;if(!e||e.themes!==this.hass.themes||e.locale!==this.hass.locale)return!0;if(!1===Object.keys(this._config).every(t=>null===t.match(/^entity_/)||e.states[this._config[t]]===this.hass.states[this._config[t]]))return!0;if(this._config.show_section_daily_forecast){const t=this._config.daily_forecast_days||5;for(const o of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1"])if(void 0!==this._config[o]&&null===this._config[o].match("^weather.")){const s=this._config[o].match(/(\d+)(?!.*\d)/g);if(s)for(var i=1;i<t;i++){const t=this._config[o].replace(/(\d+)(?!.*\d)/g,Number(s)+i);if(e.states[t]!==this.hass.states[t])return!0}}}return t.has("config")}updated(t){this.hass&&this._config&&(!t.has("_config")&&this._subscribed||this._subscribeForecastEvents())}firstUpdated(){this._resize(),this._attachObserver()}_attachObserver(){var t;this._resizeObserver||(this._resizeObserver=new ResizeObserver(function(t,e,i){var o;return void 0===i&&(i=!1),function(){var s=[].slice.call(arguments),n=this,a=i&&!o;clearTimeout(o),o=setTimeout(function(){o=null,i||t.apply(n,s)},e),a&&t.apply(n,s)}}(()=>this._resize(),250,!1)));(null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card"))&&this._resizeObserver.observe(this)}_resize(){var t;if(!this.isConnected)return;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card");e&&(this._cardWidth=e.getBoundingClientRect().width)}_checkForErrors(){this._error=[],Object.keys(this._config).forEach(t=>{null!==t.match(/^entity_/)&&void 0===this.hass.states[this._config[t]]&&this._error.push(`'${t}=${this._config[t]}' not found`)});for(const t of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1","entity_extended_1","entity_pop","entity_forecast_min","entity_forecast_max"])if(void 0!==this._config[t])if(this._config[t].match("^weather.")){if(void 0===this.hass.states[this._config.weather_entity]){this._error.push("'weather_entity needs to be defined (not found).");break}if(this._config[t]!==this._config.weather_entity){this._error.push(`'${t} needs to be the same as weather_entity.`);break}const e=this.forecast1;if(void 0!==e){const i=new Date;switch(i.setDate(i.getDate()+1),t){case"entity_forecast_icon_1":void 0===this._getForecastPropFromWeather(e,i,"condition")&&this._error.push(`'${t} attribute forecast[1].condition not found`);break;case"entity_forecast_min_1":void 0===this._getForecastPropFromWeather(e,i,"templow")&&this._error.push(`'${t} attribute forecast[1].templow not found`);break;case"entity_forecast_max_1":void 0===this._getForecastPropFromWeather(e,i,"temperature")&&this._error.push(`'${t} attribute forecast[1].temperature not found`);break;case"entity_pop_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation_probability")&&this._error.push(`'${t} attribute forecast[1].precipitation_probability not found`);break;case"entity_pos_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation")&&this._error.push(`'${t} attribute forecast[1].precipitation not found`)}}}else{this._config[t].match(/(\d+)(?!.*\d)/g)||this._error.push(`'${t}=${this._config[t]}' value needs to have a number`)}return void 0!==this._config.weather_entity&&(void 0!==this._config.forecast_type?["daily","hourly","twice_daily"].includes(this._config.forecast_type)||this._error.push("'forecast_type must be daily, hourly, or twice_daily"):this._error.push("'forecast_type needs to be configured.")),0!==this._error.length}_renderUpdateTime(){if(this._config.entity_update_time&&this.hass.states[this._config.entity_update_time]&&void 0!==this.hass.states[this._config.entity_update_time].state)if(!0===this._config.update_time_use_attr){if(void 0!==this._config.update_time_name_attr){const t=this._config.update_time_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[this._config.entity_update_time].attributes);if(void 0!==t){const e=new Date(`${t}`);switch(this.timeFormat){case"12hour":return U`${e.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(e)}`;case"24hour":return U`${e.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(e)}`;case"system":return U`${e.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(e)}`}}}}else{const t=new Date(this.hass.states[this._config.entity_update_time].state);switch(this.timeFormat){case"12hour":return U`${t.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(t)}`;case"24hour":return U`${t.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(t)}`;case"system":return U`${t.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(t)}`}}return U`---`}_renderCompleteOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const i=this._weatherIcon(this.forecastIcon),o=this._getIconUrl(i),s="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?U``:U`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=U`<div class="big-icon"><img src="${o}" width="100%" height="100%" title="${s}"></div>`,r=U`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,l=this.currentApparentTemperature,c=""!=l?U`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${l}</div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `:U``,d=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"",h=this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=U`<div class="forecast-text">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:U`<div class="forecast-text">---</div>`:U``;return U`
      <div class="overview-section section">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.text_card_title_2?U`<div class="card-header">${this._config.text_card_title_2}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:U``}
        <div class="overview-top">
          <div class="top-left">${a}${n}</div>
          <div class="currentTemps">${r}${c}</div>
        </div>
        ${h}
        ${d}
      </div>
    `}_renderObservationsOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const e=this._cardWidth>=344?" stacked":"",i=U`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,o=this.currentApparentTemperature,s=""!=o?U`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${o}</div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `:U``,n=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"";return U`
      <div class="overview-section section${e}">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.text_card_title_2?U`<div class="card-header">${this._config.text_card_title_2}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:U``}
      </div>
      <div class="overview-section section">
        <div class="overview-top">
          <div class="top-left-obs"></div>
          <div class="currentTemps">${i}${s}</div>
        </div>
        ${n}
      </div>
    `}_renderTitleOnlyOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const e=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"";return U`
      <div class="overview-section section">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.text_card_title_2?U`<div class="card-header">${this._config.text_card_title_2}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:U``}
        ${e}
      </div>
    `}_renderForecastOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const i=this._weatherIcon(this.forecastIcon),o=this._getIconUrl(i),s="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?U``:U`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=U`<div class="big-icon"><img src="${o}" width="100%" height="100%" title="${s}"></div>`,r=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"",l=this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=U`<div class="forecast-text-right">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:U`<div class="forecast-text-right">---</div>`:U``;return U`
      <div class="overview-section section">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.text_card_title_2?U`<div class="card-header">${this._config.text_card_title_2}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:U``}
        <div class="overview-top">
          <div class="top-left">${a}${n}</div>
          ${l}
        </div>
        ${r}
      </div>
    `}_getCardSizeOverviewSection(){var t=0;if(!1!==this._config.show_section_overview){if("observations"===this._config.overview_layout)return 76;t=16,t+=void 0!==this._config.text_card_title?20:0,t+=void 0!==this._config.text_card_title_2?20:0,t+=void 0!==this._config.entity_update_time?20:0,"title only"!==this._config.overview_layout&&(t+="forecast"!==this._config.overview_layout&&void 0!==this._config.entity_summary?145:120)}return t}_renderOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;switch(this._config.overview_layout||"complete"){case"observations":return this._renderObservationsOverviewSection();case"forecast":return this._renderForecastOverviewSection();case"title only":return this._renderTitleOnlyOverviewSection();default:return this._renderCompleteOverviewSection()}}_getCardSizeExtendedSection(){var t=0;return!1!==this._config.show_section_extended&&(t+=16,t+=this._config.entity_extended?40:0,t+=void 0!==this._config.entity_todays_uv_forecast||void 0!==this._config.entity_todays_fire_danger?20:0),t}_renderExtendedSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_extended)||void 0===this._config.entity_extended&&void 0===this._config.entity_todays_uv_forecast&&void 0===this._config.entity_todays_fire_danger)return U``;const i=this._config.entity_extended||"";var o=[];if(void 0!==this.hass.states[i])if(null===(e=this._config.entity_extended)||void 0===e?void 0:e.match("^weather.")){const t=this.forecast1;var s;if(void 0!==t)s=void 0,!0===this._config.extended_use_attr?void 0!==this._config.extended_name_attr&&(s=t[0][this._config.extended_name_attr]):s="extended_use_attr: - must be set to true when entity_extended is set to a weather entity",void 0!==s&&o.push(U`${s}`)}else if(!0===this._config.extended_use_attr){if(void 0!==this._config.extended_name_attr){const t=this._config.extended_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[i].attributes);void 0!==t&&o.push(U`${t}`)}}else if(void 0!==this.hass.states[i]){const t=this.hass.states[i].state;"unknown"!==t&&"unavailable"!==t&&o.push(U`${t}`)}return o.push(U`${this._config.entity_todays_uv_forecast&&this.hass.states[this._config.entity_todays_uv_forecast]&&"unknown"!==this.hass.states[this._config.entity_todays_uv_forecast].state?" "+this.hass.states[this._config.entity_todays_uv_forecast].state:""}`),o.push(U`${this._config.entity_todays_fire_danger&&this.hass.states[this._config.entity_todays_fire_danger]&&"unknown"!==this.hass.states[this._config.entity_todays_fire_danger].state?" "+this.hass.states[this._config.entity_todays_fire_danger].state:""}`),U`
      <div class="extended-section section">
        <div class="f-extended">
          ${o}
        </div>
      </div>
    `}_getCardSizeSlotsSection(){var t=0;if(!1!==this._config.show_section_slots){var e=("remove"!==this._config.slot_l1?1:0)+("remove"!==this._config.slot_l2?1:0)+("remove"!==this._config.slot_l3?1:0)+("remove"!==this._config.slot_l4?1:0)+("remove"!==this._config.slot_l5?1:0)+(void 0!==this._config.slot_l6&&"remove"!==this._config.slot_l6?1:0)+(void 0!==this._config.slot_l7&&"remove"!==this._config.slot_l7?1:0)+(void 0!==this._config.slot_l8&&"remove"!==this._config.slot_l8?1:0),i=("remove"!==this._config.slot_r1?1:0)+("remove"!==this._config.slot_r2?1:0)+("remove"!==this._config.slot_r3?1:0)+("remove"!==this._config.slot_r4?1:0)+("remove"!==this._config.slot_r5?1:0)+(void 0!==this._config.slot_r6&&"remove"!==this._config.slot_r6?1:0)+(void 0!==this._config.slot_r7&&"remove"!==this._config.slot_r7?1:0)+(void 0!==this._config.slot_r8&&"remove"!==this._config.slot_r8?1:0);t+=16+24*Math.max(e,i)}return t}_renderSlotsSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_slots))return U``;var e=!0===this._config.use_old_column_format?U`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list">${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}</ul>
          </li>
          <li>
            <ul class="slot-list">${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}</ul>
          </li>
        </ul>
      </div>
    `:U`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list">
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}
            </ul>
          </li>
          <li>
            <ul class="slot-list">
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}
            </ul>
          </li>
        </ul>
      </div>
    `;return U`
      <div class="slot-section section">${e}</div>
    `}_renderHorizontalDailyForecastSection(){var t,e,i,o,s,n,a,r,l,c,d,h;const u=[],p=this._config.daily_forecast_days||5;for(var m=0;m<p;m++){const k=new Date;var _,f,g;if(k.setDate(k.getDate()+m+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;var v;if(void 0!==this.forecast1&&(v=this._getForecastPropFromWeather(this.forecast1,k,"condition")),void 0===v)break;const e={href:this._getIconUrl(t&&v?this._weatherIcon(v):"unknown",!0)};_=U`<li class="f-slot-horiz-icon"><i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i></li>`}else{var y=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m)):void 0;if(void 0===t||void 0===this.hass.states[t])break;const e={href:this._getIconUrl(t&&this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};_=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i>`}(null===(e=this._config.entity_forecast_max_1)||void 0===e?void 0:e.match("^weather."))?void 0!==this.forecast1&&(f=this._getForecastPropFromWeather(this.forecast1,k,"temperature")):f=(y=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m))].state:void 0,(null===(i=this._config.entity_forecast_min_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(g=this._getForecastPropFromWeather(this.forecast1,k,"templow")):g=(y=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m))].state:void 0;const S=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,I=!0===this._config.old_daily_format?U`
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text highTemp">${f?Number(f).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${S}
            </span>
          </li>
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text lowTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${S}
            </span>
          </li>`:"highlow"===this._config.tempformat?U`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text highTemp">${f?Number(f).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text lowTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${S}
              </span>
            </li>`:U`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text lowTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text highTemp">${f?Number(f).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${S}
              </span>
            </li>
          `;var b,x,w;if(null===(o=this._config.entity_pop_1)||void 0===o?void 0:o.match("^weather.")){const t=this._config.entity_pop_1;var $;void 0!==this.forecast1&&($=this._getForecastPropFromWeather(this.forecast1,k,"precipitation_probability")),b=t&&!1!==this._config.option_show_forecast_pop?U`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${this.hass.states[t]&&void 0!==$?Math.round(Number($)):"---"}</div><div class="unit">%</div></span></li>`:U``}else{const t=(y=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m)):void 0;b=y&&!1!==this._config.option_show_forecast_pop?U`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></span></li>`:U``}if(null===(s=this._config.entity_pos_1)||void 0===s?void 0:s.match("^weather.")){const t=this._config.entity_pos_1;var E;void 0!==this.forecast1&&(E=this._getForecastPropFromWeather(this.forecast1,k,"precipitation")),x=t?U`<li class="f-slot-horiz-text"><span><div class="pos">${this.hass.states[t]&&void 0!==E?E:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:U``}else{const t=(y=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m)):void 0;x=y?U`<li class="f-slot-horiz-text"><span><div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:U``}if(null===(n=this._config.entity_summary_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_summary_1;var C;void 0!==this.forecast1&&(C=null!==(a=this._getForecastPropFromWeather(this.forecast1,k,"detailed_description"))&&void 0!==a?a:this._getForecastPropFromWeather(this.forecast1,k,"condition"));const e=(this._config.option_show_current_day?0:1)+m,i=this.forecast1&&this.forecast1[e],o={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},s=null==i?void 0:i.wind_bearing;let n=null;if(null!=s){const t=Number(s);n=isNaN(t)?null!==(r=o[String(s).toUpperCase().trim()])&&void 0!==r?r:null:t}const c=k?k.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",d=this.hass.states[t]&&void 0!==C?qt(this.hass.localize,C):"",h=this._config.entity?this.hass.states[this._config.entity]:null,u=this._buildTooltipRows({date:c,condition:d,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(l=null==h?void 0:h.attributes)||void 0===l?void 0:l.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});w=U`<div class="fcasttooltipblock" id="fcast-summary-${m}" style="width:${100*p}%;left:-${100*m}%;">${ee(u)}<span style="content:'';position:absolute;top:100%;left:${100/p/2+m*(100/p)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}else{const t=(y=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+m)):void 0,e=(this._config.option_show_current_day?0:1)+m,i=this.forecast1&&this.forecast1[e],o={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},s=null==i?void 0:i.wind_bearing;let n=null;if(null!=s){const t=Number(s);n=isNaN(t)?null!==(c=o[String(s).toUpperCase().trim()])&&void 0!==c?c:null:t}const a=k?k.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",r=this._config.option_tooltips&&t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?null!==(d=this.hass.states[t].attributes[this._config.summary_1_name_attr])&&void 0!==d?d:"":this.hass.states[t].state:"",l=this._config.entity?this.hass.states[this._config.entity]:null,u=this._buildTooltipRows({date:a,condition:r,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(h=null==l?void 0:l.attributes)||void 0===h?void 0:h.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});w=U`<div class="fcasttooltipblock" id="fcast-summary-${m}" style="width:${100*p}%;left:-${100*m}%;">${ee(u)}<span style="content:'';position:absolute;top:100%;left:${100/p/2+m*(100/p)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}u.push(U`
        <div class="day-horiz fcasttooltip">
          <ul class="f-slot-horiz">
            <li class="f-slot-horiz-text"><span class="dayname">${k?k.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</span></li>
            ${_}
            ${this._config.option_show_temperature_chart?U``:I}
            ${b}
            ${this._config.option_show_precipitation_chart?U``:x}
            ${!0===this._config.option_show_forecast_wind?(()=>{var t;const e=(this._config.option_show_current_day?0:1)+m,i=this.forecast1&&this.forecast1[e];if(!i||void 0===i.wind_speed)return U``;const o=Math.round(Number(i.wind_speed)),s={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337};let n=null;if(void 0!==i.wind_bearing&&null!==i.wind_bearing){const e=Number(i.wind_bearing);if(isNaN(e)){n=null!==(t=s[String(i.wind_bearing).toUpperCase().trim()])&&void 0!==t?t:null}else n=e}return U`<li class="f-slot-horiz-text"><span>${ee(null!==n?`<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10" style="transform:rotate(${(n+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:1px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:"")}${o}</span></li>`})():U``}

          </ul>
          ${w}
        </div>
      `)}return U`
      <div class="daily-forecast-horiz-section section">
        ${u}
      </div>
    `}_renderVerticalDailyForecastSection(){var t,e,i,o,s,n,a;const r=[],l=this._config.daily_forecast_days||5;for(var c=0;c<l;c++){const l=new Date;var d,h,u,p,m,_,f;if(l.setDate(l.getDate()+c+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;if(void 0!==this.forecast1&&(f=this._getForecastPropFromWeather(this.forecast1,l,"condition")),void 0===f)break;const e={href:this._getIconUrl(t&&f?this._weatherIcon(f):"unknown",!0)};d=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}else{var g=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=g&&this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0;if(!t||void 0===this.hass.states[t]||"unknown"===this.hass.states[t].state)break;const e={href:this._getIconUrl(void 0!==this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};d=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}if(null===(e=this._config.entity_summary_1)||void 0===e?void 0:e.match("^weather.")){void 0!==this.forecast1&&(f=this._getForecastPropFromWeather(this.forecast1,l,"condition"));var v=(g=!0)?U`
          <div class="f-summary-vert">${this.hass.states[this._config.entity_summary_1]?this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary_1],f):"---"}</div>`:""}else{const t=(g=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0,e=t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?this.hass.states[t].attributes[this._config.summary_1_name_attr]:this.hass.states[t].state:"---";v=g?U`
          <div class="f-summary-vert">${null!=e?e:"---"}</div>`:""}(null===(i=this._config.entity_forecast_max_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(h=this._getForecastPropFromWeather(this.forecast1,l,"temperature")):h=(g=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c))].state:void 0,(null===(o=this._config.entity_forecast_min_1)||void 0===o?void 0:o.match("^weather."))?void 0!==this.forecast1&&(u=this._getForecastPropFromWeather(this.forecast1,l,"templow")):u=(g=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c))].state:void 0;const E=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,C=u?U`
        <div class="f-slot-vert">
          <div class="temp-label">Min: </div>
          <div class="low-temp">${Number(u).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${E}
        </div>`:U`---`,k=h?U`
        <div class="f-slot-vert">
          <div class="temp-label">Max: </div>
          <div class="high-temp">${Number(h).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${E}
        </div>`:U`---`;if(null===(s=this._config.entity_pop_1)||void 0===s?void 0:s.match("^weather.")){const t=this._config.entity_pop_1;var y;void 0!==this.forecast1&&(y=this._getForecastPropFromWeather(this.forecast1,l,"precipitation_probability")),p=t?U`<div class="f-slot-vert"><div class="f-label">Chance of rain </div>
        <div class="pop">${this.hass.states[t]&&void 0!==y?Math.round(Number(y)):"---"}</div><div class="unit">%</div></div>`:U``}else{const t=(g=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0;p=g?U`
          <div class="f-slot-vert"><div class="f-label">Chance of rain </div>
          <div class="pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></div>`:U``}if(null===(n=this._config.entity_pos_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_pos_1;var b;void 0!==this.forecast1&&(b=this._getForecastPropFromWeather(this.forecast1,l,"precipitation")),m=t?U`<div class="f-slot-vert"><div class="f-label">Possible rain </div>
        <div class="pos">${this.hass.states[t]&&void 0!==b?b:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></div>`:U``}else{const t=(g=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0;m=g?U`
          <div class="f-slot-vert"><div class="f-label">Possible rain </div>
          <div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>
          <div class="unit">${this.getUOM("precipitation")}</div></div>`:U``}var x,w=U``;if(null===(a=this._config.entity_extended_1)||void 0===a?void 0:a.match("^weather.")){if(void 0!==this.forecast1)x=void 0,!0===this._config.daily_extended_use_attr?void 0!==this._config.daily_extended_name_attr&&(x=this._getForecastPropFromWeather(this.forecast1,l,this._config.daily_extended_name_attr)):x="daily_extended_use_attr: - must be set to true when entity_extended_1 is set to a weather entity",void 0!==x&&(w=x?U`<div class="f-extended">${x}</div>`:U``)}else if(g=!!(this._config.entity_extended_1&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g),c<(this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days:7))if(!0===this._config.daily_extended_use_attr){const t=(g=!!this._config.entity_extended_1&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):this._config.entity_extended_1;if(t&&void 0!==this.hass.states[t]){const e=null==(g=!!(this._config.daily_extended_name_attr&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.daily_extended_name_attr.match(/(\d+)(?!.*\d)/g))&&t&&this._config.daily_extended_name_attr?this.hass.states[t].attributes[this._config.daily_extended_name_attr]:g&&this._config.daily_extended_name_attr&&t?this._config.daily_extended_name_attr.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)).toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[t].attributes):void 0;w=e?U`<div class="f-extended">${e}</div>`:U``}}else{const t=g&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0;w=g?U`<div class="f-extended">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>`:U``}g=!!this._config.entity_fire_danger_1&&this._config.entity_fire_danger_1.match(/(\d+)(?!.*\d)/g),_=U``;const S=g&&this._config.entity_fire_danger_1?this._config.entity_fire_danger_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+c)):void 0;if(g&&S){var $=!1!==this._config.option_daily_color_fire_danger&&this.hass.states[S].attributes.color_fill?`background-color:${this.hass.states[S].attributes.color_fill}; color:${this.hass.states[S].attributes.color_text};`:"";!1===this._config.option_daily_color_fire_danger?_=g&&"unknown"!==this.hass.states[S].state?U`
          <div class="f-firedanger-vert">${S&&this.hass.states[S]?this.hass.states[S].state:"---"}</div>`:U``:(""===$&&($="font-weight:300;"),_=g&&"unknown"!==this.hass.states[S].state?U`
          <div class="f-firedanger-vert">
            <p class="fire-danger-text-color" style="${$}">${S&&this.hass.states[S]?this.hass.states[S].state.toUpperCase():"---"}</p>
          </div>`:U``)}r.push(U`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="dayname-vert">${l?l.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</div>
            ${v}
          </div>
          <div>
            ${_}
          </div>
          <div class="day-vert-middle">
            <div class="day-vert-dayicon">
              ${d}
            </div>
            <div class="day-vert-temps">
              ${C}
              ${k}
            </div>
            <div class="day-vert-rain">
              ${p}
              ${m}
            </div>
          </div>
          <div class="day-vert-bottom">
            ${w}
          </div>
        </div>
      `)}return U`
      <div class="daily-forecast-vert-section section">
        ${r}
      </div>
    `}_getForecastPropFromWeather(t,e,i){const o=e.toDateString(),s=t.filter(t=>new Date(t.datetime).toDateString()===o);if(1===s.length)return void 0!==s[0][i]?String(s[0][i]):void 0;if(2===s.length){const t=s.find(t=>!0===t.daytime),e=s.find(t=>!1===t.daytime);return"templow"===i?e&&void 0!==e.temperature?String(e.temperature):void 0:t&&void 0!==t[i]?String(t[i]):void 0}}_getCardSizeDailyForecastSection(){var t=0;return!1!==this._config.show_section_daily_forecast&&("vertical"!==this._config.daily_forecast_layout?t+=146:(t+=18+87*(this._config.daily_forecast_days||5),0!==this._config.daily_extended_forecast_days&&(t+=48*Math.min(this._config.daily_forecast_days||5,this._config.daily_extended_forecast_days||7)))),t}_getWindUnit(){var t,e,i,o,s,n;const a=this._config.entity?null===(e=null===(t=this.hass.states[this._config.entity])||void 0===t?void 0:t.attributes)||void 0===e?void 0:e.wind_speed_unit:void 0;if(a)return a;const r=null===(o=null===(i=this.hass.config)||void 0===i?void 0:i.unit_system)||void 0===o?void 0:o.wind_speed;return r&&"m/s"!==r?r:"km"===(null===(n=null===(s=this.hass.config)||void 0===s?void 0:s.unit_system)||void 0===n?void 0:n.length)?"km/h":"mph"}_localizeUnit(t){var e;if(((null===(e=this.hass)||void 0===e?void 0:e.language)||"en").toLowerCase().startsWith("bg")){return{"km/h":"км/ч",kph:"км/ч","m/s":"м/с",mph:"мph",mm:"мм",in:"инч",cm:"см"}[t]||t}return t}_buildTooltipRows(t){const{date:e,condition:i,maxT:o,minT:s,precip:n,windSpeed:a,windBearDeg:r,uomPrecip:l="",uomWind:c=""}=t;let d="";if(e&&(d+=`<div class="fcasttooltiptext" style="color:#fff;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:3px;margin-bottom:4px;">${e}</div>`),i&&(d+=`<div class="fcasttooltiptext" style="color:#fff;margin-bottom:2px;">${i}</div>`),null!=o&&(d+=`<div class="fcasttooltiptext" style="color:#fff;margin-top:2px;"><b style="color:#ef5350;">↑ ${Math.round(o)}°</b>&nbsp;&nbsp;<b style="color:#90caf9;">↓ ${null!=s?Math.round(s)+"°":"---"}</b></div>`),null!=n&&n>0&&(d+=`<div class="fcasttooltiptext" style="color:#fff;">💧 ${n.toFixed(1)} ${this._localizeUnit(l)}</div>`),null!=a){d+=`<div class="fcasttooltiptext" style="color:#fff;">${null!=r?`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" style="transform:rotate(${(r+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:2px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:""}${a} ${this._localizeUnit(c)}</div>`}return d}_renderChartSection(){var t,e,i,o,s,n;if(!1===this._config.show_section_charts)return U``;const a=!0===this._config.option_show_temperature_chart,r=!0===this._config.option_show_precipitation_chart;if(!a&&!r)return U``;if(!this.forecast1||0===this.forecast1.length)return U``;const l=Math.min(this._config.daily_forecast_days||5,this.forecast1.length),c=this._config.option_show_current_day?0:1,d={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},h=[];for(let a=0;a<l;a++){const r=this.forecast1[c+a];if(!r)break;const l=r.wind_bearing;let u=null;if(null!=l){const e=Number(l);u=isNaN(e)?null!==(t=d[String(l).toUpperCase().trim()])&&void 0!==t?t:null:e}h.push({maxT:Number(null!==(e=r.temperature)&&void 0!==e?e:0),minT:Number(null!==(o=null!==(i=r.templow)&&void 0!==i?i:r.temperature)&&void 0!==o?o:0),precip:Number(null!==(s=r.precipitation)&&void 0!==s?s:0),windSpeed:void 0!==r.wind_speed?Math.round(Number(r.wind_speed)):null,windBear:u,datetime:String(null!==(n=r.datetime)&&void 0!==n?n:"")})}if(0===h.length)return U``;const u=a?75:52,p=u+(r?16:0),m=a?h.flatMap(t=>[t.maxT,t.minT]):[],_=a?Math.max(...m):0,f=a?Math.min(...m):0,g=_-f||1,v=u-16,y=t=>16+(_-t)/g*(v-16),b=h.map(t=>{let e=y(t.maxT),i=y(t.minT);const o=i-e;if(o<18){const t=(18-o)/2;e-=t,i+=t}return{maxY:e,minY:i}}),x=100/h.length,w=t=>(t+.5)*x,$=a?(()=>{const t=b.map((t,e)=>`${w(e)},${t.maxY}`).join(" "),e=b.map((t,e)=>`${w(e)},${t.minY}`).join(" ");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${p}" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:${p}px;overflow:visible;pointer-events:none;"><polyline points="${t}" fill="none" stroke="rgba(255,152,0,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${e}" fill="none" stroke="rgba(90,150,210,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>`+(r?`<line x1="0" y1="${u}" x2="100" y2="${u}" stroke="rgba(115,198,239,0.2)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>`:"")+"</svg>"})():"",E=h.map((t,e)=>{var i,o,s,n,l;let d="";if(a){const i=b[e].maxY-6.5,o=b[e].minY-6.5;d+=`<div style="position:absolute;top:${i}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(255,152,0,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.maxT)}°</div>`,d+=`<div style="position:absolute;top:${o}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(90,150,210,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.minT)}°</div>`}if(r){const e=Math.max(...h.map(t=>t.precip),.1),i=.85*u;if(t.precip>0){const o=Math.max(t.precip/e*i,2),s=u-o,n=(t.precip%1==0?String(t.precip):t.precip.toFixed(1))+" мм";d=`<div style="position:absolute;top:${s}px;left:0;right:0;height:${o}px;background:rgba(151,230,255,0.50);border-radius:2px 2px 0 0;z-index:0;"></div>`+d,d+=`<div style="position:absolute;top:${u-6}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(115,198,239,0.85);border-radius:2.5px;background:rgba(10,14,24,0.9);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${n}</div>`}else d+=`<div style="position:absolute;top:${u-1}px;left:0;right:0;height:2px;background:rgba(151,230,255,0.15);border-radius:1px;"></div>`}const m=p,_=this._config.option_locale||"bg",f=t.datetime?new Date(t.datetime).toLocaleDateString(_,{weekday:"long",month:"short",day:"numeric"}):"",g=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g);let v="";if(null===(i=this._config.entity_summary_1)||void 0===i?void 0:i.match("^weather.")){const t=this.forecast1&&this.forecast1[c+e];v=t?String(null!==(s=null!==(o=t.detailed_description)&&void 0!==o?o:t.condition)&&void 0!==s?s:""):""}else if(g&&this._config.entity_summary_1){const t=this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+e));v=this.hass.states[t]?this.hass.states[t].state:""}const y=this._getWindUnit(),x=(this._config.entity?null===(l=null===(n=this.hass.states[this._config.entity])||void 0===n?void 0:n.attributes)||void 0===l?void 0:l.precipitation_unit:void 0)||this.getUOM("precipitation"),w=this._buildTooltipRows({date:f,condition:v,maxT:a?t.maxT:null,minT:a?t.minT:null,precip:t.precip,windSpeed:t.windSpeed,windBearDeg:t.windBear,uomPrecip:x,uomWind:y});return`<div class="day-horiz fcasttooltip" style="position:relative;height:${m}px;overflow:visible;">${`<div class="fcasttooltipblock" style="width:${100*h.length}%;left:-${100*e}%;">`+w+`<span style="position:absolute;top:100%;left:${100/h.length/2+e*(100/h.length)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}${d}</div>`}).join("");return U`<div class="daily-forecast-horiz-section section"
        style="position:relative;margin-top:4px;margin-bottom:4px;padding-top:0;padding-bottom:0;">
      ${ee($+E)}
    </div>`}_renderDailyForecastSection(){var t;return!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)?U``:"vertical"!==this._config.daily_forecast_layout?this._renderHorizontalDailyForecastSection():this._renderVerticalDailyForecastSection()}render(){var t,e;const i=[];this.hassExtended=this.hass;const o=((t,e)=>{var i,o;if(void 0===e){if(void 0!==(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(i=null==t?void 0:t.forecast)||void 0===i?void 0:i.length)>2)return{forecast:t.forecast,type:null==t?void 0:t.type};e="daily"}if(e===(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(o=null==t?void 0:t.forecast)||void 0===o?void 0:o.length)>2)return{forecast:t.forecast,type:e}})(this._forecastEvent,null===(t=this._config)||void 0===t?void 0:t.forecast_type);this.forecast1=this._config.weather_entity&&(null===(e=null==o?void 0:o.forecast)||void 0===e?void 0:e.length)?o.forecast.slice(0,this._config.daily_forecast_days?this._config.daily_forecast_days:5):void 0,this._checkForErrors()&&i.push(this._showConfigWarning(this._error));const s=[];return void 0!==this._config.section_order&&this._config.section_order.forEach(t=>{switch(t){case"overview":s.push(this._renderOverviewSection());break;case"extended":s.push(this._renderExtendedSection());break;case"slots":s.push(this._renderSlotsSection());break;case"daily_forecast":s.push(this._renderDailyForecastSection()),s.push(this._renderChartSection())}}),i.push(U`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card"
        tabindex=${Gt(jt(this._config.tap_action)?"0":void 0)}
        ><div class="content">
          ${s}
        </div>
      </ha-card>
    `),U`${i}`}_onPointerDown(t){var e;t.isPrimary&&(this._pHoldFired=!1,clearTimeout(this._pHoldTimer),this.hass&&this._config&&jt(null===(e=this._config)||void 0===e?void 0:e.hold_action)&&(this._pHoldTimer=window.setTimeout(()=>{this._pHoldFired=!0,this.hass&&this._config&&Wt(this,this.hass,this._config,"hold")},500)))}_onPointerCancel(){clearTimeout(this._pHoldTimer),this._pHoldFired=!1}_onCardClick(){var t,e;this._pHoldFired?this._pHoldFired=!1:this.hass&&this._config&&(jt(null===(t=this._config)||void 0===t?void 0:t.double_tap_action)?(this._clickCount++,1===this._clickCount?this._clickTimer=window.setTimeout(()=>{var t;this._clickCount=0,this.hass&&this._config&&jt(null===(t=this._config)||void 0===t?void 0:t.tap_action)&&Wt(this,this.hass,this._config,"tap")},250):(clearTimeout(this._clickTimer),this._clickCount=0,Wt(this,this.hass,this._config,"double_tap"))):jt(null===(e=this._config)||void 0===e?void 0:e.tap_action)&&Wt(this,this.hass,this._config,"tap"))}get slotL1(){return this.slotValue("l1",this._config.slot_l1)}get slotL2(){return this.slotValue("l2",this._config.slot_l2)}get slotL3(){return this.slotValue("l3",this._config.slot_l3)}get slotL4(){return this.slotValue("l4",this._config.slot_l4)}get slotL5(){return this.slotValue("l5",this._config.slot_l5)}get slotL6(){return this.slotValue("l6",this._config.slot_l6)}get slotL7(){return this.slotValue("l7",this._config.slot_l7)}get slotL8(){return this.slotValue("l8",this._config.slot_l8)}get slotR1(){return this.slotValue("r1",this._config.slot_r1)}get slotR2(){return this.slotValue("r2",this._config.slot_r2)}get slotR3(){return this.slotValue("r3",this._config.slot_r3)}get slotR4(){return this.slotValue("r4",this._config.slot_r4)}get slotR5(){return this.slotValue("r5",this._config.slot_r5)}get slotR6(){return this.slotValue("r6",this._config.slot_r6)}get slotR7(){return this.slotValue("r7",this._config.slot_r7)}get slotR8(){return this.slotValue("r8",this._config.slot_r8)}slotValue(t,e){switch(e){case"pop":return this.slotPop;case"popforecast":return this.slotPopForecast;case"possible_today":return this.slotPos;case"possible_tomorrow":return this.slotPossibleTomorrow;case"rainfall":return this.slotRainfall;case"humidity":return this.slotHumidity;case"pressure":return this.slotPressure;case"observed_max":return this.slotObservedMax;case"observed_min":return this.slotObservedMin;case"forecast_max":return this.slotForecastMax;case"forecast_min":return this.slotForecastMin;case"temp_next":return this.slotTempNext;case"temp_following":return this.slotTempFollowing;case"temp_maximums":return this.slotTempMaximums;case"temp_minimums":return this.slotTempMinimums;case"uv_summary":return this.slotUvSummary;case"fire_danger":return this.slotFireDanger;case"wind":return this.slotWind;case"wind_gust":return this.slotWindGust;case"wind_kt":return this.slotWindKt;case"visibility":return this.slotVisibility;case"sun_next":return this.slotSunNext;case"sun_following":return this.slotSunFollowing;case"moon":return this.slotMoon;case"custom1":return this.slotCustom1;case"custom2":return this.slotCustom2;case"custom3":return this.slotCustom3;case"custom4":return this.slotCustom4;case"empty":return this.slotEmpty;case"remove":return this.slotRemove}switch(t){case"l1":return this.slotForecastMax;case"l2":return this.slotForecastMin;case"l3":return this.slotWind;case"l4":return this.slotPressure;case"l5":return this.slotSunNext;case"l6":case"l7":case"l8":case"r6":case"r7":case"r8":return this.slotRemove;case"r1":return this.slotPopForecast;case"r2":return this.slotHumidity;case"r3":return this.slotUvSummary;case"r4":return this.slotMoon;case"r5":return this.slotSunFollowing}return this.slotEmpty}get slotEmpty(){return U`<li>&nbsp;</li>`}get slotRemove(){return U``}get slotPopForecast(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation_probability:void 0,e=this._config.entity_pop&&void 0!==this.hass.states[this._config.entity_pop]?null===this._config.entity_pop.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pop].state||"unavailable"===this.hass.states[this._config.entity_pop].state?"---":Math.round(Number(this.hass.states[this._config.entity_pop].state)):void 0!==t?Math.round(Number(t)):"---":"---",i="---"!==e?U`<div class="slot-text unit">%</div>`:U``,o=void 0!==this.forecast1?this.forecast1[0].precipitation:void 0,s=this._config.entity_pos&&void 0!==this.hass.states[this._config.entity_pos]?null===this._config.entity_pos.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pos].state||"unavailable"===this.hass.states[this._config.entity_pos].state?"---":this.hass.states[this._config.entity_pos].state:void 0!==o?o:"---":"---",n="---"!==s?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${e}</div>${i}<div class="slot-text">&nbsp;</div>
          <div class="slot-text pop-text-today">${s}</div>${n}
        </div>
      </li>
    `}get slotPop(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation_probability:void 0,e=this._config.entity_pop&&void 0!==this.hass.states[this._config.entity_pop]?null===this._config.entity_pop.match("^weather.")?Math.round(Number(this.hass.states[this._config.entity_pop].state)):void 0!==t?Math.round(Number(t)):"---":"---",i="---"!==e?U`<div class="slot-text unit">%</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${e}</div>${i}<div class="slot-text"></div>
        </div>
      </li>
    `}get slotPos(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation:void 0,e=this._config.entity_pos&&void 0!==this.hass.states[this._config.entity_pos]?null===this._config.entity_pos.match("^weather.")?this.hass.states[this._config.entity_pos].state:void 0!==t?t:"---":"---",i="---"!==e?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosToday}&nbsp;<div class="slot-text possible_today-text">${e}</div>${i}
        </div>
      </li>
    `}get slotPossibleTomorrow(){const t=void 0!==this.forecast1&&this.forecast1.length>1?this.forecast1[1].precipitation:void 0,e=this._config.entity_possible_tomorrow&&void 0!==this.hass.states[this._config.entity_possible_tomorrow]?null===this._config.entity_possible_tomorrow.match("^weather.")?this.hass.states[this._config.entity_possible_tomorrow].state:void 0!==t?t:"---":"---",i="---"!==e?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosTomorrow}&nbsp;<div class="slot-text possible_tomorrow-text">${e}</div>${i}
        </div>
      </li>
    `}get slotRainfall(){const t=this.currentRainfall,e="---"!==t?U`<div class="slot-text unit"></span>${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text rainfall-text">${t}</div>${e}
        </div>
      </li>
    `}get slotHumidity(){const t=this.currentHumidity,e="---"!==t?U`<div class="slot-text unit">%</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:water-percent"></ha-icon>
          </div>
          <div class="slot-text humidity-text">${t}</div>${e}
        </div>
      </li>`}get slotPressure(){const t="---"!==this.currentPressure?U`<div class="slot-text unit">${this._config.pressure_units?this._config.pressure_units:this.getUOM("air_pressure")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:gauge"></ha-icon>
          </div>
          <div class="slot-text pressure-text">${this.currentPressure}</div>${t}
        </div>
      </li>
    `}get slotObservedMax(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_max&&void 0!==this.hass.states[this._config.entity_observed_max]?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${i}
        </div>
      </li>
    `}get slotObservedMin(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_min&&void 0!==this.hass.states[this._config.entity_observed_min]?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${i}
        </div>
      </li>
    `}get slotForecastMax(){const t=void 0!==this.forecast1?this.forecast1[0].temperature:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?null===this._config.entity_forecast_max.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",o="---"!==i?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${o}
        </div>
      </li>
    `}get slotForecastMin(){const t=void 0!==this.forecast1?this.forecast1[0].templow:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?null===this._config.entity_forecast_min.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",o="---"!==i?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${o}
        </div>
      </li>
    `}get slotTempNext(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_next&&void 0!==this.hass.states[this._config.entity_temp_next]?Number(this.hass.states[this._config.entity_temp_next].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",o=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state:"",s="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${o} ${i}</div>
          ${s}
        </div>
      </li>
    `}get slotTempFollowing(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_following&&void 0!==this.hass.states[this._config.entity_temp_following]?Number(this.hass.states[this._config.entity_temp_following].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",o=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state:"",s="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${o} ${i}</div>
          ${s}
        </div>
      </li>
    `}get slotTempMaximums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_max&&void 0!==this.hass.states[this._config.entity_observed_max]?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",o="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${o}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${o}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotTempMinimums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_min&&void 0!==this.hass.states[this._config.entity_observed_min]?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",o="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${o}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${o}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotUvSummary(){const t=this._config.entity_uv_alert_summary&&void 0!==this.hass.states[this._config.entity_uv_alert_summary]?"unknown"!==this.hass.states[this._config.entity_uv_alert_summary].state?this.hass.states[this._config.entity_uv_alert_summary].state:"Not Applicable":"---";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-sunny"></ha-icon>
          </div>
          <div class="slot-text daytime-uv-text">${this.localeTextUVRating} ${t}</div>
        </div>
      </li>
    `}get slotFireDanger(){const t=this._config.entity_fire_danger,e=t&&void 0!==this.hass.states[t]?"unknown"!==this.hass.states[t].state?!1===this._config.option_color_fire_danger?this.hass.states[t].state:this.hass.states[t].state.toLocaleUpperCase():"Not Applicable":"---";var i=t&&!1!==this._config.option_color_fire_danger&&this.hass.states[t].attributes.color_fill?`background-color:${this.hass.states[t].attributes.color_fill}; color:${this.hass.states[t].attributes.color_text};`:"";return!1===this._config.option_color_fire_danger?U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text" style="${i}">${e} </div>
        </div>
      </li>`:(""===i&&(i="font-weight:300; padding-left:0px;"),U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text fire-danger-text">
            <p class="fire-danger-text-color" style="${i}">${e}</p>
          </div>
        </div>
      </li>`)}get slotWind(){const t=this._config.entity_wind_speed&&this._config.option_show_beaufort?U`<div class="slot-text">BFT: ${this.currentBeaufort} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`,o=this._config.entity_wind_speed?U`<div class="slot-text">${this.currentWindSpeed}</div>${i}&nbsp;`:"",s=this._config.entity_wind_gust&&!1!==this._config.option_show_gust_in_wind?U`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGust}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${o}${s}
        </div>
      </li>
    `}get slotWindGust(){if(!this._config.entity_wind_gust)return U``;const t=U`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy-variant"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextGust}&nbsp;</div>
          <div class="slot-text">${this.currentWindGust}</div>${t}
        </div>
      </li>
    `}get slotWindKt(){const t=this._config.entity_wind_speed_kt&&this._config.option_show_beaufort?U`<div class="slot-text">BFT: ${this.currentBeaufortKt} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">Kt</div>`,o=this._config.entity_wind_speed_kt?U`<div class="slot-text">${this.currentWindSpeedKt}</div>${i}&nbsp;`:"",s=this._config.entity_wind_gust_kt?U`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGustKt}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${o}${s}
        </div>
      </li>
    `}get slotVisibility(){const t=this.currentVisibility,e="---"!==t?this.getUOM("length"):"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-fog"></ha-icon>
          </div>
          <div class="slot-text visibility-text">${t}</div>
          <div class="slot-text unit">${e}</div>
        </div>
      </li>
    `}get slotSunNext(){return this._config.entity_sun?this.sunSet.next:U``}get slotSunFollowing(){return this._config.entity_sun?this.sunSet.following:U``}get slotMoon(){if(!this._config.entity_moon)return U``;const t=this.hass.states[this._config.entity_moon];if(!t)return U``;const e=t.state;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${this.moonPhaseIcon(e)}"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextMoonPhase(e)}</div>
        </div>
      </li>
    `}moonPhaseIcon(t){switch(t){case"new_moon":return"mdi:moon-new";case"waxing_crescent":return"mdi:moon-waxing-crescent";case"first_quarter":return"mdi:moon-first-quarter";case"waxing_gibbous":return"mdi:moon-waxing-gibbous";case"full_moon":default:return"mdi:moon-full";case"waning_gibbous":return"mdi:moon-waning-gibbous";case"last_quarter":return"mdi:moon-last-quarter";case"waning_crescent":return"mdi:moon-waning-crescent"}}localeTextMoonPhase(t){switch(this.locale){case"bg":switch(t){case"new_moon":return"Новолуние";case"waxing_crescent":return"Растящ полумесец";case"first_quarter":return"Първа четвърт";case"waxing_gibbous":return"Растяща луна";case"full_moon":return"Пълнолуние";case"waning_gibbous":return"Намаляваща луна";case"last_quarter":return"Последна четвърт";case"waning_crescent":return"Намаляващ полумесец"}break;case"ru":switch(t){case"new_moon":return"Новолуние";case"waxing_crescent":return"Растущий серп";case"first_quarter":return"Первая четверть";case"waxing_gibbous":return"Растущая луна";case"full_moon":return"Полнолуние";case"waning_gibbous":return"Убывающая луна";case"last_quarter":return"Последняя четверть";case"waning_crescent":return"Убывающий серп"}break;case"ua":switch(t){case"new_moon":return"Новий місяць";case"waxing_crescent":return"Молодий місяць";case"first_quarter":return"Перша чверть";case"waxing_gibbous":return"Зростаючий місяць";case"full_moon":return"Повний місяць";case"waning_gibbous":return"Спадаючий місяць";case"last_quarter":return"Остання чверть";case"waning_crescent":return"Старий місяць"}break;case"de":switch(t){case"new_moon":return"Neumond";case"waxing_crescent":return"Zunehmende Sichel";case"first_quarter":return"Erstes Viertel";case"waxing_gibbous":return"Zunehmender Mond";case"full_moon":return"Vollmond";case"waning_gibbous":return"Abnehmender Mond";case"last_quarter":return"Letztes Viertel";case"waning_crescent":return"Abnehmende Sichel"}break;case"fr":switch(t){case"new_moon":return"Nouvelle lune";case"waxing_crescent":return"Croissant";case"first_quarter":return"Premier quartier";case"waxing_gibbous":return"Lune croissante";case"full_moon":return"Pleine lune";case"waning_gibbous":return"Lune décroissante";case"last_quarter":return"Dernier quartier";case"waning_crescent":return"Dernier croissant"}break;case"it":switch(t){case"new_moon":return"Luna nuova";case"waxing_crescent":return"Luna crescente";case"first_quarter":return"Primo quarto";case"waxing_gibbous":return"Luna quasi piena";case"full_moon":return"Luna piena";case"waning_gibbous":return"Luna calante";case"last_quarter":return"Ultimo quarto";case"waning_crescent":return"Falce calante"}break;case"nl":switch(t){case"new_moon":return"Nieuwe maan";case"waxing_crescent":return"Wassende sikkel";case"first_quarter":return"Eerste kwartier";case"waxing_gibbous":return"Wassende maan";case"full_moon":return"Volle maan";case"waning_gibbous":return"Afnemende maan";case"last_quarter":return"Laatste kwartier";case"waning_crescent":return"Afnemende sikkel"}break;case"pl":switch(t){case"new_moon":return"Nów";case"waxing_crescent":return"Sierp rosnący";case"first_quarter":return"Pierwsza kwadra";case"waxing_gibbous":return"Rosnący księżyc";case"full_moon":return"Pełnia";case"waning_gibbous":return"Malejący księżyc";case"last_quarter":return"Ostatnia kwadra";case"waning_crescent":return"Sierp ubywający"}break;case"da":switch(t){case"new_moon":return"Nymåne";case"waxing_crescent":case"waxing_gibbous":return"Voksende måne";case"first_quarter":return"Første kvartal";case"full_moon":return"Fuldmåne";case"waning_gibbous":case"waning_crescent":return"Aftagende måne";case"last_quarter":return"Sidste kvartal"}break;case"es":switch(t){case"new_moon":return"Luna nueva";case"waxing_crescent":return"Creciente";case"first_quarter":return"Cuarto creciente";case"waxing_gibbous":return"Luna creciente";case"full_moon":return"Luna llena";case"waning_gibbous":return"Luna menguante";case"last_quarter":return"Cuarto menguante";case"waning_crescent":return"Menguante"}break;case"he":switch(t){case"new_moon":return"ירח חדש";case"waxing_crescent":return"סהר בגדילה";case"first_quarter":return"רבע ראשון";case"waxing_gibbous":return"ירח גדל";case"full_moon":return"ירח מלא";case"waning_gibbous":return"ירח קטן";case"last_quarter":return"רבע אחרון";case"waning_crescent":return"סהר בקטנה"}}return t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}get slotCustom1(){var t=this._config.custom1_icon?this._config.custom1_icon:"mdi:help-box",e=this._config.custom1_value&&void 0!==this.hass.states[this._config.custom1_value]?this.hass.states[this._config.custom1_value].state:"unknown",i=this._config.custom1_units?this._config.custom1_units:"",o=this._config.custom1_label?this._config.custom1_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${o?U`<div class="slot-text label-text">${o}</div>`:U``}
        <div class="slot-text custom-1-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom2(){var t=this._config.custom2_icon?this._config.custom2_icon:"mdi:help-box",e=this._config.custom2_value&&void 0!==this.hass.states[this._config.custom2_value]?this.hass.states[this._config.custom2_value].state:"unknown",i=this._config.custom2_units?this._config.custom2_units:"",o=this._config.custom2_label?this._config.custom2_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${o?U`<div class="slot-text label-text">${o}</div>`:U``}
        <div class="slot-text custom-2-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom3(){var t=this._config.custom3_icon?this._config.custom3_icon:"mdi:help-box",e=this._config.custom3_value&&void 0!==this.hass.states[this._config.custom3_value]?this.hass.states[this._config.custom3_value].state:"unknown",i=this._config.custom3_units?this._config.custom3_units:"",o=this._config.custom3_label?this._config.custom3_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${o?U`<div class="slot-text label-text">${o}</div>`:U``}
        <div class="slot-text custom-3-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom4(){var t=this._config.custom4_icon?this._config.custom4_icon:"mdi:help-box",e=this._config.custom4_value&&void 0!==this.hass.states[this._config.custom4_value]?this.hass.states[this._config.custom4_value].state:"unknown",i=this._config.custom4_units?this._config.custom4_units:"",o=this._config.custom4_label?this._config.custom4_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${o?U`<div class="slot-text label-text">${o}</div>`:U``}
        <div class="slot-text custom-4-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get forecastIcon(){const t=this._config.entity_forecast_icon;return t&&this.hass.states[t]?this.hass.states[t].state:"---"}get currentTemperature(){const t=this._config.entity_temperature,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.temperature?Number(this.hass.states[t].attributes.temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---"}get currentApparentTemperature(){const t=this._config.entity_apparent_temp,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.apparent_temperature?Number(this.hass.states[t].attributes.apparent_temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---":""}get currentHumidity(){const t=this._config.entity_humidity;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.humidity?Number(this.hass.states[t].attributes.humidity).toLocaleString(this.locale):"---":"---"}get currentRainfall(){const t=this._config.entity_rainfall,e=!0===this._config.option_today_rainfall_decimals?1:0;return t&&this.hass.states[t]?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---"}get currentPressure(){const t=this._config.entity_pressure;var e=this._config.option_pressure_decimals?Math.max(Math.min(this._config.option_pressure_decimals,3),0):0;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.pressure?Number(this.hass.states[t].attributes.pressure).toLocaleString(this.locale):"---":"---"}get currentVisibility(){const t=this._config.entity_visibility;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.visibility?Number(this.hass.states[t].attributes.visibility).toLocaleString(this.locale):"---":"---"}get currentWindBearing(){const t=this._config.entity_wind_bearing;return t&&this.hass.states[t]?null===t.match("^weather.")?isNaN(Number(this.hass.states[t].state))?this.hass.states[t].state:this.windDirections[Math.round(Number(this.hass.states[t].state)/360*16)]:void 0!==this.hass.states[t].attributes.wind_bearing?isNaN(Number(this.hass.states[t].attributes.wind_bearing))?this.hass.states[t].attributes.wind_bearing:this.windDirections[Math.round(Number(this.hass.states[t].attributes.wind_bearing)/360*16)]:"---":"---"}get currentWindSpeed(){const t=this._config.entity_wind_speed;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedUnit(){const t=this._config.entity_wind_speed;if(!t||!this.hass.states[t])return this.getUOM("length")+"/h";if(null!==t.match("^weather.")){const e=this.hass.states[t].attributes.wind_speed_unit;return void 0!==e?e:this.getUOM("length")+"/h"}return this.getUOM("length")+"/h"}get currentWindGust(){const t=this._config.entity_wind_gust;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_gust_speed?Math.round(Number(this.hass.states[t].attributes.wind_gust_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedKt(){const t=this._config.entity_wind_speed_kt;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindGustKt(){const t=this._config.entity_wind_gust_kt;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get windDirections(){const t=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],e=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],i=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],o=["N","NNO","NO","ONO","O","OZO","ZO","ZZO","Z","ZZW","ZW","WZW","W","WNW","NW","NNW","N"],s=["צפון","צ-צ-מז","צפון מזרח","מז-צ-מז","מזרח","מז-ד-מז","דרום מזרח","ד-ד-מז","דרום","ד-ד-מע","דרום מערב","מע-ד-מע","מערב","מע-צ-מע","צפון מערב","צ-צ-מע","צפון"],n=["N","NNØ","NØ","ØNØ","Ø","ØSØ","SØ","SSØ","S","SSV","SV","VSV","V","VNV","NV","NNV","N"],a=["С","ССВ","СВ","ВСВ","В","ВЮВ","ЮВ","ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"],r=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],l=["С","ССИ","СИ","ИСИ","И","ИЮИ","ЮИ","ЮЮИ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"];switch(this.locale){case"it":case"fr":return e;case"de":return i;case"nl":return o;case"es":return r;case"he":return s;case"ru":return a;case"da":return n;case"bg":return l;default:return t}}get currentBeaufort(){const t=this._config.entity_wind_speed;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);switch(this.hass.states[t].attributes.unit_of_measurement){case"mph":return e>=73?"12":e>=64?"11":e>=55?"10":e>=47?"9":e>=39?"8":e>=32?"7":e>=25?"6":e>=19?"5":e>=13?"4":e>=8?"3":e>=4?"2":e>=1?"1":"0";case"m/s":return e>=32.7?"12":e>=28.5?"11":e>=24.5?"10":e>=20.8?"9":e>=17.2?"8":e>=13.9?"7":e>=10.8?"6":e>=8?"5":e>=5.5?"4":e>=3.4?"3":e>=1.6?"2":e>=.5?"1":"0";default:return e>=118?"12":e>=103?"11":e>=89?"10":e>=75?"9":e>=62?"8":e>=50?"7":e>=39?"6":e>=29?"5":e>=20?"4":e>=12?"3":e>=6?"2":e>=2?"1":"0"}}return"---"}get currentBeaufortKt(){const t=this._config.entity_wind_speed_kt;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);return e>=64?"12":e>=56?"11":e>=48?"10":e>=41?"9":e>=34?"8":e>=28?"7":e>=22?"6":e>=17?"5":e>=11?"4":e>=7?"3":e>=4?"2":e>=1?"1":"0"}return"---"}get sunSet(){var t,e,i;switch(this.timeFormat){case"12hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"";break;case"24hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"";break;case"system":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):""}var o=new Date;if(o.setDate(o.getDate()+1),this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const s=null===(t=this.hass.states[this._config.entity_sun].attributes)||void 0===t?void 0:t.elevation;return(void 0!==s?s>0:"above_horizon"===this.hass.states[this._config.entity_sun].state)?(i=o.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,{next:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${e}</div>
            </li>`,following:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${i}</div>
            </li>`,nextText:e,followingText:i,nextIcon:"mdi:weather-sunset-down",followingIcon:"mdi:weather-sunset-up"}):((new Date).getDate()!=new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()&&(i=o.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,e=o.toLocaleDateString(this.locale,{weekday:"short"})+" "+e),{next:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${i}</div>
            </li>`,following:U`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${e}</div>
            </li>`,nextText:i,followingText:e,nextIcon:"mdi:weather-sunset-up",followingIcon:"mdi:weather-sunset-down"})}return{next:U``,following:U``,nextText:"",followingText:"",nextIcon:"",followingIcon:""}}get timeFormat(){var t,e;if(this._config.option_time_format&&"system"!==this._config.option_time_format)return this._config.option_time_format;const i=null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.time_format;return"12"===i?"12hour":"24"===i?"24hour":"system"}_formatDate(t){var e,i;const o=null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.date_format,s=this.locale||navigator.language;switch(o){case"DMY":default:return t.toLocaleDateString(s,{weekday:"short",day:"numeric",month:"short",year:"numeric"}).replace(",","");case"MDY":return t.toLocaleDateString(s,{weekday:"short",month:"short",day:"numeric",year:"numeric"}).replace(",","");case"YMD":return t.toLocaleDateString(s,{weekday:"short",year:"numeric",month:"short",day:"numeric"}).replace(",","")}}_getIconUrl(t,e=!1){var i,o,s,n,a;const r=null!==(o=null===(i=this._config)||void 0===i?void 0:i.icon_pack)&&void 0!==o?o:"default",l=e?t.replace("-night","-day"):t;if("default"===r){const t=(null===(s=this._config)||void 0===s?void 0:s.option_static_icons)?"s-":"a-";return new URL(t+l+".svg",import.meta.url).href}const c=this._iconToWcc(l);if("wcc-2"===r)return`/hacsfiles/weather-chart-card/icons2/${c}.svg`;const d=this._iconToMeteocons(l);if("meteocons-fill"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${d}.svg`;if("meteocons-line"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/line/all/${d}.svg`;if("custom"===r&&(null===(n=this._config)||void 0===n?void 0:n.icon_pack_path))return this._config.icon_pack_path.replace("{condition}",c);const h=(null===(a=this._config)||void 0===a?void 0:a.option_static_icons)?"s-":"a-";return new URL(h+l+".svg",import.meta.url).href}_iconToWcc(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partlycloudy-day","cloudy-1-night":"partlycloudy-night","cloudy-2-day":"partlycloudy-day","cloudy-2-night":"partlycloudy-night",cloudy:"cloudy","haze-day":"fog","haze-night":"fog","frost-day":"snow","frost-night":"snow","rainy-2":"rain",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"exceptional","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"lightning-rain","scattered-thunderstorms-night":"lightning-rain","rainy-3":"pouring","tropical-storm":"exceptional","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"lightning","isolated-thunderstorms-night":"lightning",unknown:"exceptional"}[t])&&void 0!==e?e:"exceptional"}_iconToMeteocons(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partly-cloudy-day","cloudy-1-night":"partly-cloudy-night","cloudy-2-day":"partly-cloudy-day","cloudy-2-night":"partly-cloudy-night",cloudy:"cloudy","haze-day":"haze","haze-night":"haze","frost-day":"snow","frost-night":"snow","rainy-2":"drizzle",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"dust-wind","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"thunderstorms-rain","scattered-thunderstorms-night":"thunderstorms-rain","rainy-3":"rain","tropical-storm":"tornado","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"thunderstorms","isolated-thunderstorms-night":"thunderstorms",unknown:"not-available"}[t])&&void 0!==e?e:"not-available"}_weatherIcon(t){switch(t){case"sunny":case"clear":return this.iconClear;case"mostly-sunny":case"mostly_sunny":return this.iconMostlySunny;case"partly-cloudy":case"partly_cloudy":case"partlycloudy":return this.iconPartlyCloudy;case"cloudy":return this.iconCloudy;case"hazy":case"hazey":case"haze":return this.iconHazy;case"frost":return this.iconFrost;case"light-rain":case"light_rain":return this.iconLightRain;case"wind":case"windy":return this.iconWindy;case"fog":case"foggy":return this.iconFog;case"showers":case"shower":return this.iconShowers;case"rain":case"rainy":return this.iconRain;case"dust":case"dusty":return this.iconDust;case"snow":case"snowy":return this.iconSnow;case"snowy-rainy":case"snowy_rainy":case"snowyrainy":return this.iconSnowRain;case"storm":case"stormy":return this.iconStorm;case"light-showers":case"light-shower":case"light_showers":case"light_shower":return this.iconLightShowers;case"heavy-showers":case"heavy-shower":case"heavy_showers":case"heavy_shower":case"pouring":return this.iconHeavyShowers;case"tropical-cyclone":case"tropical_cyclone":case"tropicalcyclone":return this.iconCyclone;case"clear-day":case"clear_day":return this.iconClearDay;case"clear-night":case"clear_night":return this.iconClearNight;case"sleet":return this.iconSleet;case"partly-cloudy-day":case"partly_cloudy_day":return this.iconPartlyCloudyDay;case"partly-cloudy-night":case"partly_cloudy_night":return this.iconPartlyCloudyNight;case"hail":return this.iconHail;case"lightning":case"lightning-rainy":case"lightning_rainy":case"thunderstorm":return this.iconLightning;case"windy-variant":case"windy_variant":return this.iconWindyVariant}return"unknown"}get dayOrNight(){var t;if(this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const e=this.hass.states[this._config.entity_sun];return void 0!==(null===(t=e.attributes)||void 0===t?void 0:t.elevation)?e.attributes.elevation>0?"day":"night":"above_horizon"===e.state?"day":"night"}return"day"}get iconClear(){return`clear-${this.dayOrNight}`}get iconMostlySunny(){return`cloudy-1-${this.dayOrNight}`}get iconPartlyCloudy(){return`cloudy-2-${this.dayOrNight}`}get iconCloudy(){return"cloudy"}get iconHazy(){return`haze-${this.dayOrNight}`}get iconFrost(){return`frost-${this.dayOrNight}`}get iconLightRain(){return"rainy-2"}get iconWindy(){return"wind"}get iconFog(){return`fog-${this.dayOrNight}`}get iconShowers(){return`rainy-1-${this.dayOrNight}`}get iconRain(){return`rainy-3-${this.dayOrNight}`}get iconDust(){return"dust"}get iconSnow(){return"snowy-3"}get iconSnowRain(){return"snow-and-sleet-mix"}get iconStorm(){return`scattered-thunderstorms-${this.dayOrNight}`}get iconLightShowers(){return`rainy-1-${this.dayOrNight}`}get iconHeavyShowers(){return"rainy-3"}get iconCyclone(){return"tropical-storm"}get iconClearDay(){return"clear-day"}get iconClearNight(){return"clear-night"}get iconSleet(){return"rain-and-sleet-mix"}get iconPartlyCloudyDay(){return"cloudy-1-day"}get iconPartlyCloudyNight(){return"cloudy-1-night"}get iconHail(){return"hail"}get iconLightning(){return`isolated-thunderstorms-${this.dayOrNight}`}get iconWindyVariant(){return"wind"}get compact(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)}get locale(){try{return Intl.NumberFormat(this._config.option_locale),this._config.option_locale}catch(t){return}}get localeTextFeelsLike(){switch(this.locale){case"it":return"Percepito";case"fr":return"Ressenti";case"de":return"Gefühlt";case"nl":return"Voelt als";case"pl":return"Odczuwalne";case"he":return"מרגיש כמו";case"da":return"Føles som";case"ru":return"Ощущается как";case"es":return"Sensación";case"ua":return"Відчувається як";case"bg":return"Усеща се като";default:return"Feels like"}}get localeTextObservedMax(){if(this.compact)return this.localeTextObsMax;switch(this.locale){case"it":return"Osservata Max";case"fr":return"Observé Max";case"de":return"Beobachtet Max";case"nl":return"Opgemerkt Max";case"pl":return"Zaobserwowany Max";case"he":return"נצפה מקסימום";case"da":return"Observeret Max";case"ru":return"Наблюдаемый макс.";case"es":return"Observado Max";case"ua":return"Спостережуваний макс.";case"bg":return"Наблюдавано макс.";default:return"Observed Max"}}get localeTextObservedMin(){if(this.compact)return this.localeTextObsMin;switch(this.locale){case"it":return"Osservata Min";case"fr":return"Observé Min";case"de":return"Beobachtet Min";case"nl":return"Opgemerkt Min";case"pl":return"Zaobserwowany Min";case"he":return"נצפה מינימום";case"da":return"Observeret Min";case"ru":return"Наблюдаемый мин.";case"es":return"Observado Min";case"ua":return"Спостережуваний мін.";case"bg":return"Наблюдавано мин.";default:return"Observed Min"}}get localeTextObsMax(){switch(this.locale){case"it":return"Oss Max";case"fr":case"pl":case"da":case"es":default:return"Obs Max";case"de":return"Beob Max";case"nl":return"Opgem Max";case"he":return"נצפה מקס";case"ru":return"Набл макс.";case"ua":return"Спост макс.";case"bg":return"Набл. макс."}}get localeTextObsMin(){switch(this.locale){case"it":return"Oss Min";case"fr":case"pl":case"da":case"es":default:return"Obs Min";case"de":return"Beob Min";case"nl":return"Opgem Min";case"he":return"נצפה מינ";case"ru":return"Набл мин.";case"ua":return"Спост мін.";case"bg":return"Набл. мин."}}get localeTextForecastMax(){if(this.compact)switch(this.locale){case"ru":case"ua":case"bg":return"Макс";case"he":return"מקס";default:return"Max"}switch(this.locale){case"it":return"Max oggi";case"fr":return"Max aujourd'hui";case"de":return"Max heute";case"nl":return"Max vandaag";case"pl":return"Maks Temperatura";case"he":return"מקסימלי היום";case"da":return"Højeste i dag";case"ru":return"Макс сегодня";case"es":return"Máx hoy";case"ua":return"Макс сьогодні";case"bg":return"Макс днес";default:return"Forecast Max"}}get localeTextForecastMin(){if(this.compact)switch(this.locale){case"ru":case"bg":return"Мин";case"ua":return"Мін";case"he":return"מינ";default:return"Min"}switch(this.locale){case"it":return"Min oggi";case"fr":return"Min aujourd'hui";case"de":return"Min heute";case"nl":return"Min vandaag";case"pl":return"Min Temperatura";case"he":return"דקות היום";case"da":return"Laveste i dag";case"ru":return"Мин сегодня";case"es":return"Mín hoy";case"ua":return"Мін сьогодні";case"bg":return"Мин днес";default:return"Forecast Min"}}get localeTextPosToday(){if(this.compact)return"";switch(this.locale){case"it":return"Previsione";case"fr":return"Prévoir";case"de":return"Vorhersage";case"nl":return"Prognose";case"pl":return"Prognoza";case"he":return"תַחֲזִית";case"da":return"Vejrudsigt";case"ru":case"ua":return"Прогноз";case"es":return"Previsión";case"bg":return"Прогноза";default:return"Forecast"}}get localeTextPosTomorrow(){if(this.compact)switch(this.locale){case"ru":case"ua":return"Завтра";case"bg":return"Утре";case"he":return"מחר";case"de":case"nl":case"da":return"Morgen";case"pl":return"Jutro";case"it":return"Dom";case"fr":return"Dem";case"es":return"Mañ";default:return"Tom"}switch(this.locale){case"it":return"Prev per domani";case"fr":return"Prév demain";case"de":case"nl":return"Prog morgen";case"pl":return"Prog jutro";case"he":return"תחזית מחר";case"da":return"Prog i morgen";case"ru":case"ua":return"Прогноз на завтра";case"es":return"Prev mañana";case"bg":return"Прогноза за утре";default:return"Fore Tom"}}get localeTextFore(){switch(this.locale){case"it":case"es":return"Prev";case"fr":return"Prév";case"de":case"nl":case"pl":case"da":return"Prog";case"he":return"תַחֲזִית";case"ru":case"ua":return"Прогноз";case"bg":return"Прогноза";default:return"Fore"}}get localeTextUVRating(){switch(this.locale){case"it":case"fr":case"de":case"nl":case"pl":case"he":case"da":case"es":case"bg":default:return"UV";case"ru":case"ua":return"УФ"}}get localeTextFireDanger(){switch(this.locale){case"it":return"Fuoco";case"fr":return"Feu";case"de":return"Feuer";case"nl":case"da":return"Brand";case"pl":return"Ogień";case"he":return"אֵשׁ";case"ru":return"Огонь";case"es":return"Fuego";case"ua":return"Вогонь";case"bg":return"Пожар";default:return"Fire"}}get localeTextGust(){switch(this.locale){case"it":return"Raffica";case"fr":return"Rafale";case"de":return"Böe";case"nl":return"Windstoot";case"pl":return"Poryw";case"he":return"נשיבה";case"da":return"Vindstød";case"ru":return"Порыв";case"es":return"Ráfaga";case"ua":return"Порив";case"bg":return"Пориви";default:return"Gust"}}getUOM(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":const i=this._config.entity_pressure;return i&&this.hass.states[i]?null===i.match("^weather.")?void 0!==this.hass.states[i].attributes.unit_of_measurement?this.hass.states[i].attributes.unit_of_measurement:"km"===e?"hPa":"mbar":void 0!==this.hass.states[i].attributes.pressure_unit?this.hass.states[i].attributes.pressure_unit:"--":"--";case"length":return e;case"precipitation":return"km"===e?"mm":"in";case"intensity":return"km"===e?"mm/h":"in/h";default:return this.hass.config.unit_system[t]||""}}_showConfigWarning(t){return U`
      <hui-warning>
        <div>Weather Card</div>
        ${t.map(t=>U`<div>${t}</div>`)}
      </hui-warning>
    `}_showWarning(t){return U`<hui-warning>${t}</hui-warning>`}_showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),U`${e}`}get styles(){const t=this._config.option_tooltips?"visible":"hidden",e=this._config.temp_font_weight||"300",i=this._config.temp_font_size||"4em",o=this._config.forecast_text_font_size||"21px",s=this._config.forecast_text_alignment||"center";return ht`
      ha-card {
        cursor: pointer;
        overflow: hidden;
      }

      .card {
        padding: 8px 16px 8px 16px;
      }
      .content {
        align-items: center;
      }
      .card-header {
        font-size: 1.5em;
        color: var(--primary-text-color);
      }
      .section {
        margin: -1px;
        border: 1px solid transparent;
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .updated {
        font-size: 0.9em;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .overview-top {
        display: flex;
        justify-content: space-between;
        flex-wrap: nowrap;
      }
      .stacked {
        position: absolute;
      }
      .top-left {
        display: flex;
        flex-direction: column;
        height: 120px;
      }
      .top-left-obs {
        display: flex;
        flex-direction: column;
      }
      .big-icon {
        height: 120px;
        width: 140px;
        position: relative;
      }
      .unknown-forecast {
        position: relative;
        top: -30px;
        text-align: center;
      }
      .currentTemps {
        display: flex;
        align-self: flex-start;
        flex-direction: column;
        height: 60px;
      }
      .current-temp {
        display: table-row;
        margin-left: auto;
        padding: 2px 0px;
      }
      .temp {
        display:table-cell;
        font-weight: ${dt(e)};
        font-size: ${dt(i)};
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .unit-temp-big {
        display: table-cell;
        vertical-align: top;
        font-weight: ${dt(e)};
        font-size: 1.5em;
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .apparent-temp {
        display: table-row;
        margin-left: auto;
        height: 24px;
      }
      .apparent {
        display: table-cell;
        color: var(--primary-text-color);
        font-weight: 300;
        position: relative;
        line-height: 24px;
      }
      .unit-temp-small {
        display: table-cell;
        vertical-align: top;
        font-size: 10.5px;
        color: var(--primary-text-color);
        position: relative;
        line-height: 14px;
        padding-top: 3.6px;
        padding-left: 1px;
      }
      .line {
        margin-top : 7px;
        margin-bottom: -9px;
        color: var(--primary-text-color);
      }
      .forecast-text {
        font-size: ${dt(o)};
        text-align: ${dt(s)};
        line-height: 25px;
      }
      .forecast-text-right {
        font-size: ${dt(o)};
        text-align: ${dt(s)};
        width: 100%;
        align-items: center;
        display: flex;
        justify-content: center;
        line-height: 25px;
        margin-left: -40px;
      }
      .variations {
        display: flex;
        flex-flow: row wrap;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .slot-list-item-1 {
        min-width:50%;
        padding-right: 8px;
      }
      .slot-list {
        list-style: none;
        padding: 0;
      }
      .slot-list li {
        height:24px;
      }
      .variations-ugly {
        display: flex;
        flex-flow: row wrap;
        justify-content: space-between;
        font-weight: 300;
        color: var(--primary-text-color);
        list-style: none;
        margin-block-start: 0px;
        margin-block-end: 0px;
        padding-inline-start: 8px;
      }
      .ha-icon {
        height: 24px;
        margin-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .unit {
        font-size: 0.8em;
        display: table-cell;
        padding-left: 1px;
      }
      .slot {
        display: table-row;
      }
      .slot-icon {
        display: table-cell;
        position: relative;
        height: 18px;
        padding-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .slot-text {
        display: table-cell;
        position: relative;
      }
      .label-text {
        display: table-cell;
        position: relative;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        padding-right: 4px;
      }
      .fire-danger-text-color {
        display: inline-block;
        height: 18px;
        line-height: 20px;
        text-align: left;
        vertical-align: middle;
        margin: 0;
        padding-left: 4px;
        font-weight: 600;
        width: 108px;
      }
      .daily-forecast-horiz-section {
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        margin: 0;
        clear: both;
      }
      .daily-forecast-horiz-section .day-horiz:nth-last-child(1) {
        border-right: transparent;
      }
      .day-horiz {
        flex: 1;
        min-width: 0;
        text-align: center;
        color: var(--primary-text-color);
        border-right: 0.5px solid rgba(217,217,217,0.25);
        box-sizing: border-box;
      }
      .daily-forecast-vert-section {
        display: flex;
        flex-flow: column nowrap;
        margin: 0 auto;
        clear: both;
      }
      .day-vert {
        flex: 1;
        color: var(--primary-text-color);
        border-top: 1px solid #d9d9d9;
        line-height: 24px;
        box-sizing: border-box;
        padding-bottom: 8px;
      }
      .day-vert-top {
        display: flex;
        width: 100%;
      }
      .day-vert-middle {
        display: flex;
        float: left;
        width: 100%;
      }
      .day-vert-bottom {
        text-align: left;
        float: left;
      }
      .day-vert-dayicon {
        width: 40px;
        text-align: left;
        float: left;
        margin-bottom: -8px;
      }
      .day-vert-temps {
        flex: 1;
        text-align: left;
        float: left;
        padding-left: 1em;
        padding-top: 0.5em;
      }
      .day-vert-rain {
        flex: 2;
        text-align: left;
        float: left;
        padding-left: 1em;
        padding-top: 0.5em;
      }
      .dayname {
        text-transform: uppercase;
      }
      .dayname-vert {
        min-width: 40px;
        max-width: 40px;
        text-transform: uppercase;
      }
      .icon {
        width: 49px;
        height: 42px;
        margin: auto;
        display: inline-block;
        background-size: contain;
        background-position: center center;
        background-repeat: no-repeat;
        text-indent: -9999px;
      }
      .f-slot-horiz {
        display: inline-block;
        text-align: center;
        list-style: none;
        overflow: hidden;
        font-weight: 300;
        padding: 0;
        margin-block-start: 0;
        margin-block-end: -12px;
      }
      .f-slot-horiz-text {
        height:20px;
      }
      .f-slot-horiz-icon {
        height:50px;
      }
      .f-summary-vert {
        padding-left: 1em;
        font-weight: 400;
      }
      .f-firedanger-vert {
        text-align: right;
        font-weight: 300;
        margin-top: -24px;
      }
      .f-slot-vert {
        display: table;
        overflow: hidden;
        height: 24px;
        font-weight: 300;
      }
      .f-slot-minmax {
        width: 100%;
      }
      .chart-section {
        padding: 4px 0;
      }
      .f-extended {
        display: inline-table;
        font-size: 13px;
        font-weight: 300;
        padding-top: 8px;
        line-height:20px;
      }
      .extended-section .f-extended {
        padding-top: 0;
      }
      .highTemp {
        display: table-cell;
        font-weight: bold;
      }
      .lowTemp {
        display: table-cell;
        font-weight: 300;
      }
      .slash {
        padding-left: 2px;
        padding-right: 2px;
      }
      .high-temp {
        display: table-cell;
        font-weight: bold;
        width: 21px;
        text-align: right;
      }
      .low-temp {
        display: table-cell;
        font-weight: 300;
        width: 21px;
        text-align: right;
      }
      .temp-label {
        display: table-cell;
        width: 32px;
        font-weight: 300;
      }
      .f-label {
        display: table-cell;
        white-space: nowrap;
        padding-right: 0.2em;
      }
      .pop {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
      }
      .pos {
        display: table-cell;
        font-weight: 300;
        color: var(--primary-text-color);
        white-space: nowrap;
      }
      .fcasttooltip {
        position: relative;
        display: inline-block;
      }
      .fcasttooltip .fcasttooltipblock {
        visibility: hidden;
        background-color: rgba(10, 20, 40, 0.96);
        color: #FFFFFF;
        text-align: center;
        border-radius: 6px;
        border-style: solid;
        border-color: #FFA100;
        border-width: 1px;
        padding: 5px 0;
        position: absolute;
        z-index: 1;
        bottom: 107%;
        margin-left: -2px;
      }
      .fcasttooltip:hover .fcasttooltipblock {
        visibility: ${dt(t)};
      }
      .fcasttooltiptext {
        padding-left: 8px;
        padding-right: 8px;
        color: #ffffff;
      }
    `}};o([Tt()],ie.prototype,"_subscribed",void 0),o([Tt()],ie.prototype,"_forecastEvent",void 0),o([At({attribute:!1})],ie.prototype,"hass",void 0),o([Tt()],ie.prototype,"_config",void 0),o([Tt()],ie.prototype,"_cardWidth",void 0),ie=o([St("platinum-weather-card-plus-charts")],ie);var oe="M11 20V22H3C1.9 22 1 21.1 1 20V4C1 2.9 1.9 2 3 2H21C22.1 2 23 2.9 23 4V12.1L22.8 11.9C22.3 11.4 21.7 11.1 21 11.1V6H3V20H11M21.4 13.3L22.7 14.6C22.9 14.8 22.9 15.2 22.7 15.4L21.7 16.4L19.6 14.3L20.6 13.3C20.7 13.2 20.8 13.1 21 13.1C21.2 13.1 21.3 13.2 21.4 13.3M21.1 16.9L15.1 23H13V20.9L19.1 14.8L21.1 16.9Z",se="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",ne="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",ae="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",re="M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",le="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";const ce=["overview","extended","slots","daily_forecast","charts"];
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var de=function(){function t(t){void 0===t&&(t={}),this.adapter=t}return Object.defineProperty(t,"cssClasses",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(t,"strings",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(t,"numbers",{get:function(){return{}},enumerable:!1,configurable:!0}),Object.defineProperty(t,"defaultAdapter",{get:function(){return{}},enumerable:!1,configurable:!0}),t.prototype.init=function(){},t.prototype.destroy=function(){},t}(),he={ROOT:"mdc-form-field"},ue={LABEL_SELECTOR:".mdc-form-field > label"},pe=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.click=function(){s.handleClick()},s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return he},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return ue},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{activateInputRipple:function(){},deactivateInputRipple:function(){},deregisterInteractionHandler:function(){},registerInteractionHandler:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){this.adapter.registerInteractionHandler("click",this.click)},o.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("click",this.click)},o.prototype.handleClick=function(){var t=this;this.adapter.activateInputRipple(),requestAnimationFrame(function(){t.adapter.deactivateInputRipple()})},o}(de);
/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const me=t=>t.nodeType===Node.ELEMENT_NODE;function _e(t){return{addClass:e=>{t.classList.add(e)},removeClass:e=>{t.classList.remove(e)},hasClass:e=>t.classList.contains(e)}}const fe=()=>{},ge={get passive(){return!1}};document.addEventListener("x",fe,ge),document.removeEventListener("x",fe);const ve=(t=window.document)=>{let e=t.activeElement;const i=[];if(!e)return i;for(;e&&(i.push(e),e.shadowRoot);)e=e.shadowRoot.activeElement;return i},ye=t=>{const e=ve();if(!e.length)return!1;const i=e[e.length-1],o=new Event("check-if-focused",{bubbles:!0,composed:!0});let s=[];const n=t=>{s=t.composedPath()};return document.body.addEventListener("check-if-focused",n),i.dispatchEvent(o),document.body.removeEventListener("check-if-focused",n),-1!==s.indexOf(t)};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class be extends Ct{click(){if(this.mdcRoot)return this.mdcRoot.focus(),void this.mdcRoot.click();super.click()}createFoundation(){void 0!==this.mdcFoundation&&this.mdcFoundation.destroy(),this.mdcFoundationClass&&(this.mdcFoundation=new this.mdcFoundationClass(this.createAdapter()),this.mdcFoundation.init())}firstUpdated(){this.createFoundation()}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */var xe,we;const $e=null!==(we=null===(xe=window.ShadyDOM)||void 0===xe?void 0:xe.inUse)&&void 0!==we&&we;class Ee extends be{constructor(){super(...arguments),this.disabled=!1,this.containingForm=null,this.formDataListener=t=>{this.disabled||this.setFormData(t.formData)}}findFormElement(){if(!this.shadowRoot||$e)return null;const t=this.getRootNode().querySelectorAll("form");for(const e of Array.from(t))if(e.contains(this))return e;return null}connectedCallback(){var t;super.connectedCallback(),this.containingForm=this.findFormElement(),null===(t=this.containingForm)||void 0===t||t.addEventListener("formdata",this.formDataListener)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this.containingForm)||void 0===t||t.removeEventListener("formdata",this.formDataListener),this.containingForm=null}click(){this.formElement&&!this.disabled&&(this.formElement.focus(),this.formElement.click())}firstUpdated(){super.firstUpdated(),this.shadowRoot&&this.mdcRoot.addEventListener("change",t=>{this.dispatchEvent(new Event("change",t))})}}Ee.shadowRootOptions={mode:"open",delegatesFocus:!0},o([At({type:Boolean})],Ee.prototype,"disabled",void 0);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Ce=t=>(e,i)=>{if(e.constructor._observers){if(!e.constructor.hasOwnProperty("_observers")){const t=e.constructor._observers;e.constructor._observers=new Map,t.forEach((t,i)=>e.constructor._observers.set(i,t))}}else{e.constructor._observers=new Map;const t=e.updated;e.updated=function(e){t.call(this,e),e.forEach((t,e)=>{const i=this.constructor._observers.get(e);void 0!==i&&i.call(this,this[e],t)})}}e.constructor._observers.set(i,t)},ke=Qt(class extends Jt{constructor(t){var e;if(super(t),t.type!==Xt||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){var i,o;if(void 0===this.it){this.it=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!(null===(i=this.nt)||void 0===i?void 0:i.has(t))&&this.it.add(t);return this.render(e)}const s=t.element.classList;this.it.forEach(t=>{t in e||(s.remove(t),this.it.delete(t))});for(const t in e){const i=!!e[t];i===this.it.has(t)||(null===(o=this.nt)||void 0===o?void 0:o.has(t))||(i?(s.add(t),this.it.add(t)):(s.remove(t),this.it.delete(t)))}return H}});
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Se extends be{constructor(){super(...arguments),this.alignEnd=!1,this.spaceBetween=!1,this.nowrap=!1,this.label="",this.mdcFoundationClass=pe}createAdapter(){return{registerInteractionHandler:(t,e)=>{this.labelEl.addEventListener(t,e)},deregisterInteractionHandler:(t,e)=>{this.labelEl.removeEventListener(t,e)},activateInputRipple:async()=>{const t=this.input;if(t instanceof Ee){const e=await t.ripple;e&&e.startPress()}},deactivateInputRipple:async()=>{const t=this.input;if(t instanceof Ee){const e=await t.ripple;e&&e.endPress()}}}}get input(){var t,e;return null!==(e=null===(t=this.slottedInputs)||void 0===t?void 0:t[0])&&void 0!==e?e:null}render(){const t={"mdc-form-field--align-end":this.alignEnd,"mdc-form-field--space-between":this.spaceBetween,"mdc-form-field--nowrap":this.nowrap};return U`
      <div class="mdc-form-field ${ke(t)}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
      </div>`}click(){this._labelClick()}_labelClick(){const t=this.input;t&&(t.focus(),t.click())}}o([At({type:Boolean})],Se.prototype,"alignEnd",void 0),o([At({type:Boolean})],Se.prototype,"spaceBetween",void 0),o([At({type:Boolean})],Se.prototype,"nowrap",void 0),o([At({type:String}),Ce(async function(t){var e;null===(e=this.input)||void 0===e||e.setAttribute("aria-label",t)})],Se.prototype,"label",void 0),o([Rt(".mdc-form-field")],Se.prototype,"mdcRoot",void 0),o([Mt("",!0,"*")],Se.prototype,"slottedInputs",void 0),o([Rt("label")],Se.prototype,"labelEl",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const Ie=ht`.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{margin-left:auto;margin-right:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}[dir=rtl] .mdc-form-field--space-between>label,.mdc-form-field--space-between>label[dir=rtl]{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}::slotted(mwc-switch){margin-right:10px}[dir=rtl] ::slotted(mwc-switch),::slotted(mwc-switch[dir=rtl]){margin-left:10px}`,Ae={"mwc-formfield":class extends Se{static get styles(){return Ie}}};
/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Te="Unknown",Oe="Backspace",Fe="Enter",Re="Spacebar",Le="PageUp",Ne="PageDown",De="End",Me="Home",Pe="ArrowLeft",Ve="ArrowUp",ze="ArrowRight",Ue="ArrowDown",He="Delete",Be="Escape",We="Tab",je=new Set;je.add(Oe),je.add(Fe),je.add(Re),je.add(Le),je.add(Ne),je.add(De),je.add(Me),je.add(Pe),je.add(Ve),je.add(ze),je.add(Ue),je.add(He),je.add(Be),je.add(We);var qe=8,Ge=13,Xe=32,Ye=33,Ke=34,Ze=35,Qe=36,Je=37,ti=38,ei=39,ii=40,oi=46,si=27,ni=9,ai=new Map;ai.set(qe,Oe),ai.set(Ge,Fe),ai.set(Xe,Re),ai.set(Ye,Le),ai.set(Ke,Ne),ai.set(Ze,De),ai.set(Qe,Me),ai.set(Je,Pe),ai.set(ti,Ve),ai.set(ei,ze),ai.set(ii,Ue),ai.set(oi,He),ai.set(si,Be),ai.set(ni,We);var ri,li,ci=new Set;function di(t){var e=t.key;if(je.has(e))return e;var i=ai.get(t.keyCode);return i||Te}
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */ci.add(Le),ci.add(Ne),ci.add(De),ci.add(Me),ci.add(Pe),ci.add(Ve),ci.add(ze),ci.add(Ue);var hi="mdc-list-item--activated",ui="mdc-list-item",pi="mdc-list-item--disabled",mi="mdc-list-item--selected",_i="mdc-list-item__text",fi="mdc-list-item__primary-text",gi="mdc-list";(ri={})[""+hi]="mdc-list-item--activated",ri[""+ui]="mdc-list-item",ri[""+pi]="mdc-list-item--disabled",ri[""+mi]="mdc-list-item--selected",ri[""+fi]="mdc-list-item__primary-text",ri[""+gi]="mdc-list";var vi=((li={})[""+hi]="mdc-deprecated-list-item--activated",li[""+ui]="mdc-deprecated-list-item",li[""+pi]="mdc-deprecated-list-item--disabled",li[""+mi]="mdc-deprecated-list-item--selected",li[""+_i]="mdc-deprecated-list-item__text",li[""+fi]="mdc-deprecated-list-item__primary-text",li[""+gi]="mdc-deprecated-list",li),yi={ACTION_EVENT:"MDCList:action",ARIA_CHECKED:"aria-checked",ARIA_CHECKED_CHECKBOX_SELECTOR:'[role="checkbox"][aria-checked="true"]',ARIA_CHECKED_RADIO_SELECTOR:'[role="radio"][aria-checked="true"]',ARIA_CURRENT:"aria-current",ARIA_DISABLED:"aria-disabled",ARIA_ORIENTATION:"aria-orientation",ARIA_ORIENTATION_HORIZONTAL:"horizontal",ARIA_ROLE_CHECKBOX_SELECTOR:'[role="checkbox"]',ARIA_SELECTED:"aria-selected",ARIA_INTERACTIVE_ROLES_SELECTOR:'[role="listbox"], [role="menu"]',ARIA_MULTI_SELECTABLE_SELECTOR:'[aria-multiselectable="true"]',CHECKBOX_RADIO_SELECTOR:'input[type="checkbox"], input[type="radio"]',CHECKBOX_SELECTOR:'input[type="checkbox"]',CHILD_ELEMENTS_TO_TOGGLE_TABINDEX:"\n    ."+ui+" button:not(:disabled),\n    ."+ui+" a,\n    ."+vi[ui]+" button:not(:disabled),\n    ."+vi[ui]+" a\n  ",DEPRECATED_SELECTOR:".mdc-deprecated-list",FOCUSABLE_CHILD_ELEMENTS:"\n    ."+ui+" button:not(:disabled),\n    ."+ui+" a,\n    ."+ui+' input[type="radio"]:not(:disabled),\n    .'+ui+' input[type="checkbox"]:not(:disabled),\n    .'+vi[ui]+" button:not(:disabled),\n    ."+vi[ui]+" a,\n    ."+vi[ui]+' input[type="radio"]:not(:disabled),\n    .'+vi[ui]+' input[type="checkbox"]:not(:disabled)\n  ',RADIO_SELECTOR:'input[type="radio"]',SELECTED_ITEM_SELECTOR:'[aria-selected="true"], [aria-current="true"]'},bi={UNSET_INDEX:-1,TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS:300},xi=["input","button","textarea","select"],wi=function(t){var e=t.target;if(e){var i=(""+e.tagName).toLowerCase();-1===xi.indexOf(i)&&t.preventDefault()}};function $i(t,e){for(var i=new Map,o=0;o<t;o++){var s=e(o).trim();if(s){var n=s[0].toLowerCase();i.has(n)||i.set(n,[]),i.get(n).push({text:s.toLowerCase(),index:o})}}return i.forEach(function(t){t.sort(function(t,e){return t.index-e.index})}),i}function Ei(t,e){var i,o=t.nextChar,s=t.focusItemAtIndex,n=t.sortedIndexByFirstChar,a=t.focusedItemIndex,r=t.skipFocus,l=t.isItemAtIndexDisabled;return clearTimeout(e.bufferClearTimeout),e.bufferClearTimeout=setTimeout(function(){!function(t){t.typeaheadBuffer=""}(e)},bi.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS),e.typeaheadBuffer=e.typeaheadBuffer+o,i=1===e.typeaheadBuffer.length?function(t,e,i,o){var s=o.typeaheadBuffer[0],n=t.get(s);if(!n)return-1;if(s===o.currentFirstChar&&n[o.sortedIndexCursor].index===e){o.sortedIndexCursor=(o.sortedIndexCursor+1)%n.length;var a=n[o.sortedIndexCursor].index;if(!i(a))return a}o.currentFirstChar=s;var r,l=-1;for(r=0;r<n.length;r++)if(!i(n[r].index)){l=r;break}for(;r<n.length;r++)if(n[r].index>e&&!i(n[r].index)){l=r;break}if(-1!==l)return o.sortedIndexCursor=l,n[o.sortedIndexCursor].index;return-1}(n,a,l,e):function(t,e,i){var o=i.typeaheadBuffer[0],s=t.get(o);if(!s)return-1;var n=s[i.sortedIndexCursor];if(0===n.text.lastIndexOf(i.typeaheadBuffer,0)&&!e(n.index))return n.index;var a=(i.sortedIndexCursor+1)%s.length,r=-1;for(;a!==i.sortedIndexCursor;){var l=s[a],c=0===l.text.lastIndexOf(i.typeaheadBuffer,0),d=!e(l.index);if(c&&d){r=a;break}a=(a+1)%s.length}if(-1!==r)return i.sortedIndexCursor=r,s[i.sortedIndexCursor].index;return-1}(n,l,e),-1===i||r||s(i),i}function Ci(t){return t.typeaheadBuffer.length>0}
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var ki={LABEL_FLOAT_ABOVE:"mdc-floating-label--float-above",LABEL_REQUIRED:"mdc-floating-label--required",LABEL_SHAKE:"mdc-floating-label--shake",ROOT:"mdc-floating-label"},Si=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.shakeAnimationEndHandler=function(){s.handleShakeAnimationEnd()},s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return ki},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},getWidth:function(){return 0},registerInteractionHandler:function(){},deregisterInteractionHandler:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){this.adapter.registerInteractionHandler("animationend",this.shakeAnimationEndHandler)},o.prototype.destroy=function(){this.adapter.deregisterInteractionHandler("animationend",this.shakeAnimationEndHandler)},o.prototype.getWidth=function(){return this.adapter.getWidth()},o.prototype.shake=function(t){var e=o.cssClasses.LABEL_SHAKE;t?this.adapter.addClass(e):this.adapter.removeClass(e)},o.prototype.float=function(t){var e=o.cssClasses,i=e.LABEL_FLOAT_ABOVE,s=e.LABEL_SHAKE;t?this.adapter.addClass(i):(this.adapter.removeClass(i),this.adapter.removeClass(s))},o.prototype.setRequired=function(t){var e=o.cssClasses.LABEL_REQUIRED;t?this.adapter.addClass(e):this.adapter.removeClass(e)},o.prototype.handleShakeAnimationEnd=function(){var t=o.cssClasses.LABEL_SHAKE;this.adapter.removeClass(t)},o}(de);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */const Ii=Qt(class extends Jt{constructor(t){switch(super(t),this.foundation=null,this.previousPart=null,t.type){case Xt:case Kt:break;default:throw new Error("FloatingLabel directive only support attribute and property parts")}}update(t,[e]){if(t!==this.previousPart){this.foundation&&this.foundation.destroy(),this.previousPart=t;const e=t.element;e.classList.add("mdc-floating-label");const i=(t=>({addClass:e=>t.classList.add(e),removeClass:e=>t.classList.remove(e),getWidth:()=>t.scrollWidth,registerInteractionHandler:(e,i)=>{t.addEventListener(e,i)},deregisterInteractionHandler:(e,i)=>{t.removeEventListener(e,i)}}))(e);this.foundation=new Si(i),this.foundation.init()}return this.render(e)}render(t){return this.foundation}});
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var Ai={LINE_RIPPLE_ACTIVE:"mdc-line-ripple--active",LINE_RIPPLE_DEACTIVATING:"mdc-line-ripple--deactivating"},Ti=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.transitionEndHandler=function(t){s.handleTransitionEnd(t)},s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return Ai},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},setStyle:function(){},registerEventHandler:function(){},deregisterEventHandler:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){this.adapter.registerEventHandler("transitionend",this.transitionEndHandler)},o.prototype.destroy=function(){this.adapter.deregisterEventHandler("transitionend",this.transitionEndHandler)},o.prototype.activate=function(){this.adapter.removeClass(Ai.LINE_RIPPLE_DEACTIVATING),this.adapter.addClass(Ai.LINE_RIPPLE_ACTIVE)},o.prototype.setRippleCenter=function(t){this.adapter.setStyle("transform-origin",t+"px center")},o.prototype.deactivate=function(){this.adapter.addClass(Ai.LINE_RIPPLE_DEACTIVATING)},o.prototype.handleTransitionEnd=function(t){var e=this.adapter.hasClass(Ai.LINE_RIPPLE_DEACTIVATING);"opacity"===t.propertyName&&e&&(this.adapter.removeClass(Ai.LINE_RIPPLE_ACTIVE),this.adapter.removeClass(Ai.LINE_RIPPLE_DEACTIVATING))},o}(de);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */const Oi=Qt(class extends Jt{constructor(t){switch(super(t),this.previousPart=null,this.foundation=null,t.type){case Xt:case Kt:return;default:throw new Error("LineRipple only support attribute and property parts.")}}update(t,e){if(this.previousPart!==t){this.foundation&&this.foundation.destroy(),this.previousPart=t;const e=t.element;e.classList.add("mdc-line-ripple");const i=(t=>({addClass:e=>t.classList.add(e),removeClass:e=>t.classList.remove(e),hasClass:e=>t.classList.contains(e),setStyle:(e,i)=>t.style.setProperty(e,i),registerEventHandler:(e,i)=>{t.addEventListener(e,i)},deregisterEventHandler:(e,i)=>{t.removeEventListener(e,i)}}))(e);this.foundation=new Ti(i),this.foundation.init()}return this.render()}render(){return this.foundation}});
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var Fi,Ri,Li={ANCHOR:"mdc-menu-surface--anchor",ANIMATING_CLOSED:"mdc-menu-surface--animating-closed",ANIMATING_OPEN:"mdc-menu-surface--animating-open",FIXED:"mdc-menu-surface--fixed",IS_OPEN_BELOW:"mdc-menu-surface--is-open-below",OPEN:"mdc-menu-surface--open",ROOT:"mdc-menu-surface"},Ni={CLOSED_EVENT:"MDCMenuSurface:closed",CLOSING_EVENT:"MDCMenuSurface:closing",OPENED_EVENT:"MDCMenuSurface:opened",FOCUSABLE_ELEMENTS:["button:not(:disabled)",'[href]:not([aria-disabled="true"])',"input:not(:disabled)","select:not(:disabled)","textarea:not(:disabled)",'[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])'].join(", ")},Di={TRANSITION_OPEN_DURATION:120,TRANSITION_CLOSE_DURATION:75,MARGIN_TO_EDGE:32,ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO:.67,TOUCH_EVENT_WAIT_MS:30};!function(t){t[t.BOTTOM=1]="BOTTOM",t[t.CENTER=2]="CENTER",t[t.RIGHT=4]="RIGHT",t[t.FLIP_RTL=8]="FLIP_RTL"}(Fi||(Fi={})),function(t){t[t.TOP_LEFT=0]="TOP_LEFT",t[t.TOP_RIGHT=4]="TOP_RIGHT",t[t.BOTTOM_LEFT=1]="BOTTOM_LEFT",t[t.BOTTOM_RIGHT=5]="BOTTOM_RIGHT",t[t.TOP_START=8]="TOP_START",t[t.TOP_END=12]="TOP_END",t[t.BOTTOM_START=9]="BOTTOM_START",t[t.BOTTOM_END=13]="BOTTOM_END"}(Ri||(Ri={}));
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Mi={ACTIVATED:"mdc-select--activated",DISABLED:"mdc-select--disabled",FOCUSED:"mdc-select--focused",INVALID:"mdc-select--invalid",MENU_INVALID:"mdc-select__menu--invalid",OUTLINED:"mdc-select--outlined",REQUIRED:"mdc-select--required",ROOT:"mdc-select",WITH_LEADING_ICON:"mdc-select--with-leading-icon"},Pi={ARIA_CONTROLS:"aria-controls",ARIA_DESCRIBEDBY:"aria-describedby",ARIA_SELECTED_ATTR:"aria-selected",CHANGE_EVENT:"MDCSelect:change",HIDDEN_INPUT_SELECTOR:'input[type="hidden"]',LABEL_SELECTOR:".mdc-floating-label",LEADING_ICON_SELECTOR:".mdc-select__icon",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",MENU_SELECTOR:".mdc-select__menu",OUTLINE_SELECTOR:".mdc-notched-outline",SELECTED_TEXT_SELECTOR:".mdc-select__selected-text",SELECT_ANCHOR_SELECTOR:".mdc-select__anchor",VALUE_ATTR:"data-value"},Vi={LABEL_SCALE:.75,UNSET_INDEX:-1,CLICK_DEBOUNCE_TIMEOUT_MS:330},zi=function(t){function o(e,s){void 0===s&&(s={});var n=t.call(this,i(i({},o.defaultAdapter),e))||this;return n.disabled=!1,n.isMenuOpen=!1,n.useDefaultValidation=!0,n.customValidity=!0,n.lastSelectedIndex=Vi.UNSET_INDEX,n.clickDebounceTimeout=0,n.recentlyClicked=!1,n.leadingIcon=s.leadingIcon,n.helperText=s.helperText,n}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return Mi},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return Vi},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Pi},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},activateBottomLine:function(){},deactivateBottomLine:function(){},getSelectedIndex:function(){return-1},setSelectedIndex:function(){},hasLabel:function(){return!1},floatLabel:function(){},getLabelWidth:function(){return 0},setLabelRequired:function(){},hasOutline:function(){return!1},notchOutline:function(){},closeOutline:function(){},setRippleCenter:function(){},notifyChange:function(){},setSelectedText:function(){},isSelectAnchorFocused:function(){return!1},getSelectAnchorAttr:function(){return""},setSelectAnchorAttr:function(){},removeSelectAnchorAttr:function(){},addMenuClass:function(){},removeMenuClass:function(){},openMenu:function(){},closeMenu:function(){},getAnchorElement:function(){return null},setMenuAnchorElement:function(){},setMenuAnchorCorner:function(){},setMenuWrapFocus:function(){},focusMenuItemAtIndex:function(){},getMenuItemCount:function(){return 0},getMenuItemValues:function(){return[]},getMenuItemTextAtIndex:function(){return""},isTypeaheadInProgress:function(){return!1},typeaheadMatchItem:function(){return-1}}},enumerable:!1,configurable:!0}),o.prototype.getSelectedIndex=function(){return this.adapter.getSelectedIndex()},o.prototype.setSelectedIndex=function(t,e,i){void 0===e&&(e=!1),void 0===i&&(i=!1),t>=this.adapter.getMenuItemCount()||(t===Vi.UNSET_INDEX?this.adapter.setSelectedText(""):this.adapter.setSelectedText(this.adapter.getMenuItemTextAtIndex(t).trim()),this.adapter.setSelectedIndex(t),e&&this.adapter.closeMenu(),i||this.lastSelectedIndex===t||this.handleChange(),this.lastSelectedIndex=t)},o.prototype.setValue=function(t,e){void 0===e&&(e=!1);var i=this.adapter.getMenuItemValues().indexOf(t);this.setSelectedIndex(i,!1,e)},o.prototype.getValue=function(){var t=this.adapter.getSelectedIndex(),e=this.adapter.getMenuItemValues();return t!==Vi.UNSET_INDEX?e[t]:""},o.prototype.getDisabled=function(){return this.disabled},o.prototype.setDisabled=function(t){this.disabled=t,this.disabled?(this.adapter.addClass(Mi.DISABLED),this.adapter.closeMenu()):this.adapter.removeClass(Mi.DISABLED),this.leadingIcon&&this.leadingIcon.setDisabled(this.disabled),this.disabled?this.adapter.removeSelectAnchorAttr("tabindex"):this.adapter.setSelectAnchorAttr("tabindex","0"),this.adapter.setSelectAnchorAttr("aria-disabled",this.disabled.toString())},o.prototype.openMenu=function(){this.adapter.addClass(Mi.ACTIVATED),this.adapter.openMenu(),this.isMenuOpen=!0,this.adapter.setSelectAnchorAttr("aria-expanded","true")},o.prototype.setHelperTextContent=function(t){this.helperText&&this.helperText.setContent(t)},o.prototype.layout=function(){if(this.adapter.hasLabel()){var t=this.getValue().length>0,e=this.adapter.hasClass(Mi.FOCUSED),i=t||e,o=this.adapter.hasClass(Mi.REQUIRED);this.notchOutline(i),this.adapter.floatLabel(i),this.adapter.setLabelRequired(o)}},o.prototype.layoutOptions=function(){var t=this.adapter.getMenuItemValues().indexOf(this.getValue());this.setSelectedIndex(t,!1,!0)},o.prototype.handleMenuOpened=function(){if(0!==this.adapter.getMenuItemValues().length){var t=this.getSelectedIndex(),e=t>=0?t:0;this.adapter.focusMenuItemAtIndex(e)}},o.prototype.handleMenuClosing=function(){this.adapter.setSelectAnchorAttr("aria-expanded","false")},o.prototype.handleMenuClosed=function(){this.adapter.removeClass(Mi.ACTIVATED),this.isMenuOpen=!1,this.adapter.isSelectAnchorFocused()||this.blur()},o.prototype.handleChange=function(){this.layout(),this.adapter.notifyChange(this.getValue()),this.adapter.hasClass(Mi.REQUIRED)&&this.useDefaultValidation&&this.setValid(this.isValid())},o.prototype.handleMenuItemAction=function(t){this.setSelectedIndex(t,!0)},o.prototype.handleFocus=function(){this.adapter.addClass(Mi.FOCUSED),this.layout(),this.adapter.activateBottomLine()},o.prototype.handleBlur=function(){this.isMenuOpen||this.blur()},o.prototype.handleClick=function(t){this.disabled||this.recentlyClicked||(this.setClickDebounceTimeout(),this.isMenuOpen?this.adapter.closeMenu():(this.adapter.setRippleCenter(t),this.openMenu()))},o.prototype.handleKeydown=function(t){if(!this.isMenuOpen&&this.adapter.hasClass(Mi.FOCUSED)){var e=di(t)===Fe,i=di(t)===Re,o=di(t)===Ve,s=di(t)===Ue;if(!(t.ctrlKey||t.metaKey)&&(!i&&t.key&&1===t.key.length||i&&this.adapter.isTypeaheadInProgress())){var n=i?" ":t.key,a=this.adapter.typeaheadMatchItem(n,this.getSelectedIndex());return a>=0&&this.setSelectedIndex(a),void t.preventDefault()}(e||i||o||s)&&(o&&this.getSelectedIndex()>0?this.setSelectedIndex(this.getSelectedIndex()-1):s&&this.getSelectedIndex()<this.adapter.getMenuItemCount()-1&&this.setSelectedIndex(this.getSelectedIndex()+1),this.openMenu(),t.preventDefault())}},o.prototype.notchOutline=function(t){if(this.adapter.hasOutline()){var e=this.adapter.hasClass(Mi.FOCUSED);if(t){var i=Vi.LABEL_SCALE,o=this.adapter.getLabelWidth()*i;this.adapter.notchOutline(o)}else e||this.adapter.closeOutline()}},o.prototype.setLeadingIconAriaLabel=function(t){this.leadingIcon&&this.leadingIcon.setAriaLabel(t)},o.prototype.setLeadingIconContent=function(t){this.leadingIcon&&this.leadingIcon.setContent(t)},o.prototype.getUseDefaultValidation=function(){return this.useDefaultValidation},o.prototype.setUseDefaultValidation=function(t){this.useDefaultValidation=t},o.prototype.setValid=function(t){this.useDefaultValidation||(this.customValidity=t),this.adapter.setSelectAnchorAttr("aria-invalid",(!t).toString()),t?(this.adapter.removeClass(Mi.INVALID),this.adapter.removeMenuClass(Mi.MENU_INVALID)):(this.adapter.addClass(Mi.INVALID),this.adapter.addMenuClass(Mi.MENU_INVALID)),this.syncHelperTextValidity(t)},o.prototype.isValid=function(){return this.useDefaultValidation&&this.adapter.hasClass(Mi.REQUIRED)&&!this.adapter.hasClass(Mi.DISABLED)?this.getSelectedIndex()!==Vi.UNSET_INDEX&&(0!==this.getSelectedIndex()||Boolean(this.getValue())):this.customValidity},o.prototype.setRequired=function(t){t?this.adapter.addClass(Mi.REQUIRED):this.adapter.removeClass(Mi.REQUIRED),this.adapter.setSelectAnchorAttr("aria-required",t.toString()),this.adapter.setLabelRequired(t)},o.prototype.getRequired=function(){return"true"===this.adapter.getSelectAnchorAttr("aria-required")},o.prototype.init=function(){var t=this.adapter.getAnchorElement();t&&(this.adapter.setMenuAnchorElement(t),this.adapter.setMenuAnchorCorner(Ri.BOTTOM_START)),this.adapter.setMenuWrapFocus(!1),this.setDisabled(this.adapter.hasClass(Mi.DISABLED)),this.syncHelperTextValidity(!this.adapter.hasClass(Mi.INVALID)),this.layout(),this.layoutOptions()},o.prototype.blur=function(){this.adapter.removeClass(Mi.FOCUSED),this.layout(),this.adapter.deactivateBottomLine(),this.adapter.hasClass(Mi.REQUIRED)&&this.useDefaultValidation&&this.setValid(this.isValid())},o.prototype.syncHelperTextValidity=function(t){if(this.helperText){this.helperText.setValidity(t);var e=this.helperText.isVisible(),i=this.helperText.getId();e&&i?this.adapter.setSelectAnchorAttr(Pi.ARIA_DESCRIBEDBY,i):this.adapter.removeSelectAnchorAttr(Pi.ARIA_DESCRIBEDBY)}},o.prototype.setClickDebounceTimeout=function(){var t=this;clearTimeout(this.clickDebounceTimeout),this.clickDebounceTimeout=setTimeout(function(){t.recentlyClicked=!1},Vi.CLICK_DEBOUNCE_TIMEOUT_MS),this.recentlyClicked=!0},o}(de);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Ui=(t={})=>{const e={};for(const i in t)e[i]=t[i];return Object.assign({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1},e)};class Hi extends Ee{constructor(){super(...arguments),this.mdcFoundationClass=zi,this.disabled=!1,this.outlined=!1,this.label="",this.outlineOpen=!1,this.outlineWidth=0,this.value="",this.name="",this.selectedText="",this.icon="",this.menuOpen=!1,this.helper="",this.validateOnInitialRender=!1,this.validationMessage="",this.required=!1,this.naturalMenuWidth=!1,this.isUiValid=!0,this.fixedMenuPosition=!1,this.typeaheadState={bufferClearTimeout:0,currentFirstChar:"",sortedIndexCursor:0,typeaheadBuffer:""},this.sortedIndexByFirstChar=new Map,this.menuElement_=null,this.listeners=[],this.onBodyClickBound=()=>{},this._menuUpdateComplete=null,this.valueSetDirectly=!1,this.validityTransform=null,this._validity=Ui()}get items(){return this.menuElement_||(this.menuElement_=this.menuElement),this.menuElement_?this.menuElement_.items:[]}get selected(){const t=this.menuElement;return t?t.selected:null}get index(){const t=this.menuElement;return t?t.index:-1}get shouldRenderHelperText(){return!!this.helper||!!this.validationMessage}get validity(){return this._checkValidity(this.value),this._validity}render(){const t={"mdc-select--disabled":this.disabled,"mdc-select--no-label":!this.label,"mdc-select--filled":!this.outlined,"mdc-select--outlined":this.outlined,"mdc-select--with-leading-icon":!!this.icon,"mdc-select--required":this.required,"mdc-select--invalid":!this.isUiValid},e={"mdc-select__menu--invalid":!this.isUiValid},i=this.label?"label":void 0,o=this.shouldRenderHelperText?"helper-text":void 0;return U`
      <div
          class="mdc-select ${ke(t)}">
        <input
            class="formElement"
            name="${this.name}"
            .value="${this.value}"
            hidden
            ?disabled="${this.disabled}"
            ?required=${this.required}>
        <!-- @ts-ignore -->
        <div class="mdc-select__anchor"
            aria-autocomplete="none"
            role="combobox"
            aria-expanded=${this.menuOpen}
            aria-invalid=${!this.isUiValid}
            aria-haspopup="listbox"
            aria-labelledby=${Gt(i)}
            aria-required=${this.required}
            aria-describedby=${Gt(o)}
            @click=${this.onClick}
            @focus=${this.onFocus}
            @blur=${this.onBlur}
            @keydown=${this.onKeydown}>
          ${this.renderRipple()}
          ${this.outlined?this.renderOutline():this.renderLabel()}
          ${this.renderLeadingIcon()}
          <span class="mdc-select__selected-text-container">
            <span class="mdc-select__selected-text">${this.selectedText}</span>
          </span>
          <span class="mdc-select__dropdown-icon">
            <svg
                class="mdc-select__dropdown-icon-graphic"
                viewBox="7 10 10 5"
                focusable="false">
              <polygon
                  class="mdc-select__dropdown-icon-inactive"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 10 12 15 17 10">
              </polygon>
              <polygon
                  class="mdc-select__dropdown-icon-active"
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 15 12 10 17 15">
              </polygon>
            </svg>
          </span>
          ${this.renderLineRipple()}
        </div>
        <mwc-menu
            innerRole="listbox"
            wrapFocus
            class="mdc-select__menu mdc-menu mdc-menu-surface ${ke(e)}"
            activatable
            .fullwidth=${!this.fixedMenuPosition&&!this.naturalMenuWidth}
            .open=${this.menuOpen}
            .anchor=${this.anchorElement}
            .fixed=${this.fixedMenuPosition}
            @selected=${this.onSelected}
            @opened=${this.onOpened}
            @closed=${this.onClosed}
            @items-updated=${this.onItemsUpdated}
            @keydown=${this.handleTypeahead}>
          <slot></slot>
        </mwc-menu>
      </div>
      ${this.renderHelperText()}`}renderRipple(){return this.outlined?B:U`
      <span class="mdc-select__ripple"></span>
    `}renderOutline(){return this.outlined?U`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`:B}renderLabel(){return this.label?U`
      <span
          .floatingLabelFoundation=${Ii(this.label)}
          id="label">${this.label}</span>
    `:B}renderLeadingIcon(){return this.icon?U`<mwc-icon class="mdc-select__icon"><div>${this.icon}</div></mwc-icon>`:B}renderLineRipple(){return this.outlined?B:U`
      <span .lineRippleFoundation=${Oi()}></span>
    `}renderHelperText(){if(!this.shouldRenderHelperText)return B;const t=this.validationMessage&&!this.isUiValid;return U`
        <p
          class="mdc-select-helper-text ${ke({"mdc-select-helper-text--validation-msg":t})}"
          id="helper-text">${t?this.validationMessage:this.helper}</p>`}createAdapter(){return Object.assign(Object.assign({},_e(this.mdcRoot)),{activateBottomLine:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.activate()},deactivateBottomLine:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.deactivate()},hasLabel:()=>!!this.label,floatLabel:t=>{this.labelElement&&this.labelElement.floatingLabelFoundation.float(t)},getLabelWidth:()=>this.labelElement?this.labelElement.floatingLabelFoundation.getWidth():0,setLabelRequired:t=>{this.labelElement&&this.labelElement.floatingLabelFoundation.setRequired(t)},hasOutline:()=>this.outlined,notchOutline:t=>{this.outlineElement&&!this.outlineOpen&&(this.outlineWidth=t,this.outlineOpen=!0)},closeOutline:()=>{this.outlineElement&&(this.outlineOpen=!1)},setRippleCenter:t=>{if(this.lineRippleElement){this.lineRippleElement.lineRippleFoundation.setRippleCenter(t)}},notifyChange:async t=>{if(!this.valueSetDirectly&&t===this.value)return;this.valueSetDirectly=!1,this.value=t,await this.updateComplete;const e=new Event("change",{bubbles:!0});this.dispatchEvent(e)},setSelectedText:t=>this.selectedText=t,isSelectAnchorFocused:()=>{const t=this.anchorElement;if(!t)return!1;return t.getRootNode().activeElement===t},getSelectAnchorAttr:t=>{const e=this.anchorElement;return e?e.getAttribute(t):null},setSelectAnchorAttr:(t,e)=>{const i=this.anchorElement;i&&i.setAttribute(t,e)},removeSelectAnchorAttr:t=>{const e=this.anchorElement;e&&e.removeAttribute(t)},openMenu:()=>{this.menuOpen=!0},closeMenu:()=>{this.menuOpen=!1},addMenuClass:()=>{},removeMenuClass:()=>{},getAnchorElement:()=>this.anchorElement,setMenuAnchorElement:()=>{},setMenuAnchorCorner:()=>{const t=this.menuElement;t&&(t.corner="BOTTOM_START")},setMenuWrapFocus:t=>{const e=this.menuElement;e&&(e.wrapFocus=t)},focusMenuItemAtIndex:t=>{const e=this.menuElement;if(!e)return;const i=e.items[t];i&&i.focus()},getMenuItemCount:()=>{const t=this.menuElement;return t?t.items.length:0},getMenuItemValues:()=>{const t=this.menuElement;if(!t)return[];return t.items.map(t=>t.value)},getMenuItemTextAtIndex:t=>{const e=this.menuElement;if(!e)return"";const i=e.items[t];return i?i.text:""},getSelectedIndex:()=>this.index,setSelectedIndex:()=>{},isTypeaheadInProgress:()=>Ci(this.typeaheadState),typeaheadMatchItem:(t,e)=>{if(!this.menuElement)return-1;const i={focusItemAtIndex:t=>{this.menuElement.focusItemAtIndex(t)},focusedItemIndex:e||this.menuElement.getFocusedItemIndex(),nextChar:t,sortedIndexByFirstChar:this.sortedIndexByFirstChar,skipFocus:!1,isItemAtIndexDisabled:t=>this.items[t].disabled},o=Ei(i,this.typeaheadState);return-1!==o&&this.select(o),o}})}checkValidity(){const t=this._checkValidity(this.value);if(!t){const t=new Event("invalid",{bubbles:!1,cancelable:!0});this.dispatchEvent(t)}return t}reportValidity(){const t=this.checkValidity();return this.isUiValid=t,t}_checkValidity(t){const e=this.formElement.validity;let i=Ui(e);if(this.validityTransform){const e=this.validityTransform(t,i);i=Object.assign(Object.assign({},i),e)}return this._validity=i,this._validity.valid}setCustomValidity(t){this.validationMessage=t,this.formElement.setCustomValidity(t)}async getUpdateComplete(){await this._menuUpdateComplete;return await super.getUpdateComplete()}async firstUpdated(){const t=this.menuElement;if(t&&(this._menuUpdateComplete=t.updateComplete,await this._menuUpdateComplete),super.firstUpdated(),this.mdcFoundation.isValid=()=>!0,this.mdcFoundation.setValid=()=>{},this.mdcFoundation.setDisabled(this.disabled),this.validateOnInitialRender&&this.reportValidity(),!this.selected){!this.items.length&&this.slotElement&&this.slotElement.assignedNodes({flatten:!0}).length&&(await new Promise(t=>requestAnimationFrame(t)),await this.layout());const t=this.items.length&&""===this.items[0].value;if(!this.value&&t)return void this.select(0);this.selectByValue(this.value)}this.sortedIndexByFirstChar=$i(this.items.length,t=>this.items[t].text)}onItemsUpdated(){this.sortedIndexByFirstChar=$i(this.items.length,t=>this.items[t].text)}select(t){const e=this.menuElement;e&&e.select(t)}selectByValue(t){let e=-1;for(let i=0;i<this.items.length;i++){if(this.items[i].value===t){e=i;break}}this.valueSetDirectly=!0,this.select(e),this.mdcFoundation.handleChange()}disconnectedCallback(){super.disconnectedCallback();for(const t of this.listeners)t.target.removeEventListener(t.name,t.cb)}focus(){const t=new CustomEvent("focus"),e=this.anchorElement;e&&(e.dispatchEvent(t),e.focus())}blur(){const t=new CustomEvent("blur"),e=this.anchorElement;e&&(e.dispatchEvent(t),e.blur())}onFocus(){this.mdcFoundation&&this.mdcFoundation.handleFocus()}onBlur(){this.mdcFoundation&&this.mdcFoundation.handleBlur();const t=this.menuElement;t&&!t.open&&this.reportValidity()}onClick(t){if(this.mdcFoundation){this.focus();const e=t.target.getBoundingClientRect();let i=0;i="touches"in t?t.touches[0].clientX:t.clientX;const o=i-e.left;this.mdcFoundation.handleClick(o)}}onKeydown(t){const e=di(t)===Ve,i=di(t)===Ue;if(i||e){const o=e&&this.index>0,s=i&&this.index<this.items.length-1;return o?this.select(this.index-1):s&&this.select(this.index+1),t.preventDefault(),void this.mdcFoundation.openMenu()}this.mdcFoundation.handleKeydown(t)}handleTypeahead(t){if(!this.menuElement)return;const e=this.menuElement.getFocusedItemIndex(),i=me(t.target)?t.target:null;!function(t,e){var i=t.event,o=t.isTargetListItem,s=t.focusedItemIndex,n=t.focusItemAtIndex,a=t.sortedIndexByFirstChar,r=t.isItemAtIndexDisabled,l="ArrowLeft"===di(i),c="ArrowUp"===di(i),d="ArrowRight"===di(i),h="ArrowDown"===di(i),u="Home"===di(i),p="End"===di(i),m="Enter"===di(i),_="Spacebar"===di(i);i.ctrlKey||i.metaKey||l||c||d||h||u||p||m||(_||1!==i.key.length?_&&(o&&wi(i),o&&Ci(e)&&Ei({focusItemAtIndex:n,focusedItemIndex:s,nextChar:" ",sortedIndexByFirstChar:a,skipFocus:!1,isItemAtIndexDisabled:r},e)):(wi(i),Ei({focusItemAtIndex:n,focusedItemIndex:s,nextChar:i.key.toLowerCase(),sortedIndexByFirstChar:a,skipFocus:!1,isItemAtIndexDisabled:r},e)))}({event:t,focusItemAtIndex:t=>{this.menuElement.focusItemAtIndex(t)},focusedItemIndex:e,isTargetListItem:!!i&&i.hasAttribute("mwc-list-item"),sortedIndexByFirstChar:this.sortedIndexByFirstChar,isItemAtIndexDisabled:t=>this.items[t].disabled},this.typeaheadState)}async onSelected(t){this.mdcFoundation||await this.updateComplete,this.mdcFoundation.handleMenuItemAction(t.detail.index);const e=this.items[t.detail.index];e&&(this.value=e.value)}onOpened(){this.mdcFoundation&&(this.menuOpen=!0,this.mdcFoundation.handleMenuOpened())}onClosed(){this.mdcFoundation&&(this.menuOpen=!1,this.mdcFoundation.handleMenuClosed())}setFormData(t){this.name&&null!==this.selected&&t.append(this.name,this.value)}async layout(t=!0){this.mdcFoundation&&this.mdcFoundation.layout(),await this.updateComplete;const e=this.menuElement;e&&e.layout(t);const i=this.labelElement;if(!i)return void(this.outlineOpen=!1);const o=!!this.label&&!!this.value;if(i.floatingLabelFoundation.float(o),!this.outlined)return;this.outlineOpen=o,await this.updateComplete;const s=i.floatingLabelFoundation.getWidth();this.outlineOpen&&(this.outlineWidth=s)}async layoutOptions(){this.mdcFoundation&&this.mdcFoundation.layoutOptions()}}o([Rt(".mdc-select")],Hi.prototype,"mdcRoot",void 0),o([Rt(".formElement")],Hi.prototype,"formElement",void 0),o([Rt("slot")],Hi.prototype,"slotElement",void 0),o([Rt("select")],Hi.prototype,"nativeSelectElement",void 0),o([Rt("input")],Hi.prototype,"nativeInputElement",void 0),o([Rt(".mdc-line-ripple")],Hi.prototype,"lineRippleElement",void 0),o([Rt(".mdc-floating-label")],Hi.prototype,"labelElement",void 0),o([Rt("mwc-notched-outline")],Hi.prototype,"outlineElement",void 0),o([Rt(".mdc-menu")],Hi.prototype,"menuElement",void 0),o([Rt(".mdc-select__anchor")],Hi.prototype,"anchorElement",void 0),o([At({type:Boolean,attribute:"disabled",reflect:!0}),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setDisabled(t)})],Hi.prototype,"disabled",void 0),o([At({type:Boolean}),Ce(function(t,e){void 0!==e&&this.outlined!==e&&this.layout(!1)})],Hi.prototype,"outlined",void 0),o([At({type:String}),Ce(function(t,e){void 0!==e&&this.label!==e&&this.layout(!1)})],Hi.prototype,"label",void 0),o([Tt()],Hi.prototype,"outlineOpen",void 0),o([Tt()],Hi.prototype,"outlineWidth",void 0),o([At({type:String}),Ce(function(t){if(this.mdcFoundation){const e=null===this.selected&&!!t,i=this.selected&&this.selected.value!==t;(e||i)&&this.selectByValue(t),this.reportValidity()}})],Hi.prototype,"value",void 0),o([At()],Hi.prototype,"name",void 0),o([Tt()],Hi.prototype,"selectedText",void 0),o([At({type:String})],Hi.prototype,"icon",void 0),o([Tt()],Hi.prototype,"menuOpen",void 0),o([At({type:String})],Hi.prototype,"helper",void 0),o([At({type:Boolean})],Hi.prototype,"validateOnInitialRender",void 0),o([At({type:String})],Hi.prototype,"validationMessage",void 0),o([At({type:Boolean})],Hi.prototype,"required",void 0),o([At({type:Boolean})],Hi.prototype,"naturalMenuWidth",void 0),o([Tt()],Hi.prototype,"isUiValid",void 0),o([At({type:Boolean})],Hi.prototype,"fixedMenuPosition",void 0),o([Ft({capture:!0})],Hi.prototype,"handleTypeahead",null);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Bi=(t,e)=>t-e,Wi=["input","button","textarea","select"];function ji(t){return t instanceof Set}const qi=t=>{const e=t===bi.UNSET_INDEX?new Set:t;return ji(e)?new Set(e):new Set([e])};class Gi extends de{constructor(t){super(Object.assign(Object.assign({},Gi.defaultAdapter),t)),this.isMulti_=!1,this.wrapFocus_=!1,this.isVertical_=!0,this.selectedIndex_=bi.UNSET_INDEX,this.focusedItemIndex_=bi.UNSET_INDEX,this.useActivatedClass_=!1,this.ariaCurrentAttrValue_=null}static get strings(){return yi}static get numbers(){return bi}static get defaultAdapter(){return{focusItemAtIndex:()=>{},getFocusedElementIndex:()=>0,getListItemCount:()=>0,isFocusInsideList:()=>!1,isRootFocused:()=>!1,notifyAction:()=>{},notifySelected:()=>{},getSelectedStateForElementIndex:()=>!1,setDisabledStateForElementIndex:()=>{},getDisabledStateForElementIndex:()=>!1,setSelectedStateForElementIndex:()=>{},setActivatedStateForElementIndex:()=>{},setTabIndexForElementIndex:()=>{},setAttributeForElementIndex:()=>{},getAttributeForElementIndex:()=>null}}setWrapFocus(t){this.wrapFocus_=t}setMulti(t){this.isMulti_=t;const e=this.selectedIndex_;if(t){if(!ji(e)){const t=e===bi.UNSET_INDEX;this.selectedIndex_=t?new Set:new Set([e])}}else if(ji(e))if(e.size){const t=Array.from(e).sort(Bi);this.selectedIndex_=t[0]}else this.selectedIndex_=bi.UNSET_INDEX}setVerticalOrientation(t){this.isVertical_=t}setUseActivatedClass(t){this.useActivatedClass_=t}getSelectedIndex(){return this.selectedIndex_}setSelectedIndex(t){this.isIndexValid_(t)&&(this.isMulti_?this.setMultiSelectionAtIndex_(qi(t)):this.setSingleSelectionAtIndex_(t))}handleFocusIn(t,e){e>=0&&this.adapter.setTabIndexForElementIndex(e,0)}handleFocusOut(t,e){e>=0&&this.adapter.setTabIndexForElementIndex(e,-1),setTimeout(()=>{this.adapter.isFocusInsideList()||this.setTabindexToFirstSelectedItem_()},0)}handleKeydown(t,e,i){const o="ArrowLeft"===di(t),s="ArrowUp"===di(t),n="ArrowRight"===di(t),a="ArrowDown"===di(t),r="Home"===di(t),l="End"===di(t),c="Enter"===di(t),d="Spacebar"===di(t);if(this.adapter.isRootFocused())return void(s||l?(t.preventDefault(),this.focusLastElement()):(a||r)&&(t.preventDefault(),this.focusFirstElement()));let h,u=this.adapter.getFocusedElementIndex();if(!(-1===u&&(u=i,u<0))){if(this.isVertical_&&a||!this.isVertical_&&n)this.preventDefaultEvent(t),h=this.focusNextElement(u);else if(this.isVertical_&&s||!this.isVertical_&&o)this.preventDefaultEvent(t),h=this.focusPrevElement(u);else if(r)this.preventDefaultEvent(t),h=this.focusFirstElement();else if(l)this.preventDefaultEvent(t),h=this.focusLastElement();else if((c||d)&&e){const e=t.target;if(e&&"A"===e.tagName&&c)return;this.preventDefaultEvent(t),this.setSelectedIndexOnAction_(u,!0)}this.focusedItemIndex_=u,void 0!==h&&(this.setTabindexAtIndex_(h),this.focusedItemIndex_=h)}}handleSingleSelection(t,e,i){t!==bi.UNSET_INDEX&&(this.setSelectedIndexOnAction_(t,e,i),this.setTabindexAtIndex_(t),this.focusedItemIndex_=t)}focusNextElement(t){let e=t+1;if(e>=this.adapter.getListItemCount()){if(!this.wrapFocus_)return t;e=0}return this.adapter.focusItemAtIndex(e),e}focusPrevElement(t){let e=t-1;if(e<0){if(!this.wrapFocus_)return t;e=this.adapter.getListItemCount()-1}return this.adapter.focusItemAtIndex(e),e}focusFirstElement(){return this.adapter.focusItemAtIndex(0),0}focusLastElement(){const t=this.adapter.getListItemCount()-1;return this.adapter.focusItemAtIndex(t),t}setEnabled(t,e){this.isIndexValid_(t)&&this.adapter.setDisabledStateForElementIndex(t,!e)}preventDefaultEvent(t){const e=`${t.target.tagName}`.toLowerCase();-1===Wi.indexOf(e)&&t.preventDefault()}setSingleSelectionAtIndex_(t,e=!0){this.selectedIndex_!==t&&(this.selectedIndex_!==bi.UNSET_INDEX&&(this.adapter.setSelectedStateForElementIndex(this.selectedIndex_,!1),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(this.selectedIndex_,!1)),e&&this.adapter.setSelectedStateForElementIndex(t,!0),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(t,!0),this.setAriaForSingleSelectionAtIndex_(t),this.selectedIndex_=t,this.adapter.notifySelected(t))}setMultiSelectionAtIndex_(t,e=!0){const i=((t,e)=>{const i=Array.from(t),o=Array.from(e),s={added:[],removed:[]},n=i.sort(Bi),a=o.sort(Bi);let r=0,l=0;for(;r<n.length||l<a.length;){const t=n[r],e=a[l];t!==e?void 0!==t&&(void 0===e||t<e)?(s.removed.push(t),r++):void 0!==e&&(void 0===t||e<t)&&(s.added.push(e),l++):(r++,l++)}return s})(qi(this.selectedIndex_),t);if(i.removed.length||i.added.length){for(const t of i.removed)e&&this.adapter.setSelectedStateForElementIndex(t,!1),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(t,!1);for(const t of i.added)e&&this.adapter.setSelectedStateForElementIndex(t,!0),this.useActivatedClass_&&this.adapter.setActivatedStateForElementIndex(t,!0);this.selectedIndex_=t,this.adapter.notifySelected(t,i)}}setAriaForSingleSelectionAtIndex_(t){this.selectedIndex_===bi.UNSET_INDEX&&(this.ariaCurrentAttrValue_=this.adapter.getAttributeForElementIndex(t,yi.ARIA_CURRENT));const e=null!==this.ariaCurrentAttrValue_,i=e?yi.ARIA_CURRENT:yi.ARIA_SELECTED;this.selectedIndex_!==bi.UNSET_INDEX&&this.adapter.setAttributeForElementIndex(this.selectedIndex_,i,"false");const o=e?this.ariaCurrentAttrValue_:"true";this.adapter.setAttributeForElementIndex(t,i,o)}setTabindexAtIndex_(t){this.focusedItemIndex_===bi.UNSET_INDEX&&0!==t?this.adapter.setTabIndexForElementIndex(0,-1):this.focusedItemIndex_>=0&&this.focusedItemIndex_!==t&&this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_,-1),this.adapter.setTabIndexForElementIndex(t,0)}setTabindexToFirstSelectedItem_(){let t=0;"number"==typeof this.selectedIndex_&&this.selectedIndex_!==bi.UNSET_INDEX?t=this.selectedIndex_:ji(this.selectedIndex_)&&this.selectedIndex_.size>0&&(t=Math.min(...this.selectedIndex_)),this.setTabindexAtIndex_(t)}isIndexValid_(t){if(t instanceof Set){if(!this.isMulti_)throw new Error("MDCListFoundation: Array of index is only supported for checkbox based list");if(0===t.size)return!0;{let e=!1;for(const i of t)if(e=this.isIndexInRange_(i),e)break;return e}}if("number"==typeof t){if(this.isMulti_)throw new Error("MDCListFoundation: Expected array of index for checkbox based list but got number: "+t);return t===bi.UNSET_INDEX||this.isIndexInRange_(t)}return!1}isIndexInRange_(t){const e=this.adapter.getListItemCount();return t>=0&&t<e}setSelectedIndexOnAction_(t,e,i){if(this.adapter.getDisabledStateForElementIndex(t))return;let o=t;if(this.isMulti_&&(o=new Set([t])),this.isIndexValid_(o)){if(this.isMulti_)this.toggleMultiAtIndex(t,i,e);else if(e||i)this.setSingleSelectionAtIndex_(t,e);else{this.selectedIndex_===t&&this.setSingleSelectionAtIndex_(bi.UNSET_INDEX)}e&&this.adapter.notifyAction(t)}}toggleMultiAtIndex(t,e,i=!0){let o=!1;o=void 0===e?!this.adapter.getSelectedStateForElementIndex(t):e;const s=qi(this.selectedIndex_);o?s.add(t):s.delete(t),this.setMultiSelectionAtIndex_(s,i)}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const Xi=t=>t.hasAttribute("mwc-list-item");function Yi(){const t=this.itemsReadyResolver;this.itemsReady=new Promise(t=>this.itemsReadyResolver=t),t()}class Ki extends be{constructor(){super(),this.mdcAdapter=null,this.mdcFoundationClass=Gi,this.activatable=!1,this.multi=!1,this.wrapFocus=!1,this.itemRoles=null,this.innerRole=null,this.innerAriaLabel=null,this.rootTabbable=!1,this.previousTabindex=null,this.noninteractive=!1,this.itemsReadyResolver=()=>{},this.itemsReady=Promise.resolve([]),this.items_=[];const t=function(t,e=50){let i;return function(o=!0){clearTimeout(i),i=setTimeout(()=>{t(o)},e)}}(this.layout.bind(this));this.debouncedLayout=(e=!0)=>{Yi.call(this),t(e)}}async getUpdateComplete(){const t=await super.getUpdateComplete();return await this.itemsReady,t}get items(){return this.items_}updateItems(){var t;const e=null!==(t=this.assignedElements)&&void 0!==t?t:[],i=[];for(const t of e)Xi(t)&&(i.push(t),t._managingList=this),t.hasAttribute("divider")&&!t.hasAttribute("role")&&t.setAttribute("role","separator");this.items_=i;const o=new Set;if(this.items_.forEach((t,e)=>{this.itemRoles?t.setAttribute("role",this.itemRoles):t.removeAttribute("role"),t.selected&&o.add(e)}),this.multi)this.select(o);else{const t=o.size?o.entries().next().value[1]:-1;this.select(t)}const s=new Event("items-updated",{bubbles:!0,composed:!0});this.dispatchEvent(s)}get selected(){const t=this.index;if(!ji(t))return-1===t?null:this.items[t];const e=[];for(const i of t)e.push(this.items[i]);return e}get index(){return this.mdcFoundation?this.mdcFoundation.getSelectedIndex():-1}render(){const t=null===this.innerRole?void 0:this.innerRole,e=null===this.innerAriaLabel?void 0:this.innerAriaLabel,i=this.rootTabbable?"0":"-1";return U`
      <!-- @ts-ignore -->
      <ul
          tabindex=${i}
          role="${Gt(t)}"
          aria-label="${Gt(e)}"
          class="mdc-deprecated-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}
          @list-item-rendered=${this.onListItemConnected}>
        <slot></slot>
        ${this.renderPlaceholder()}
      </ul>
    `}renderPlaceholder(){var t;const e=null!==(t=this.assignedElements)&&void 0!==t?t:[];return void 0!==this.emptyMessage&&0===e.length?U`
        <mwc-list-item noninteractive>${this.emptyMessage}</mwc-list-item>
      `:null}firstUpdated(){super.firstUpdated(),this.items.length||(this.mdcFoundation.setMulti(this.multi),this.layout())}onFocusIn(t){if(this.mdcFoundation&&this.mdcRoot){const e=this.getIndexOfTarget(t);this.mdcFoundation.handleFocusIn(t,e)}}onFocusOut(t){if(this.mdcFoundation&&this.mdcRoot){const e=this.getIndexOfTarget(t);this.mdcFoundation.handleFocusOut(t,e)}}onKeydown(t){if(this.mdcFoundation&&this.mdcRoot){const e=this.getIndexOfTarget(t),i=t.target,o=Xi(i);this.mdcFoundation.handleKeydown(t,o,e)}}onRequestSelected(t){if(this.mdcFoundation){let e=this.getIndexOfTarget(t);if(-1===e&&(this.layout(),e=this.getIndexOfTarget(t),-1===e))return;if(this.items[e].disabled)return;const i=t.detail.selected,o=t.detail.source;this.mdcFoundation.handleSingleSelection(e,"interaction"===o,i),t.stopPropagation()}}getIndexOfTarget(t){const e=this.items,i=t.composedPath();for(const t of i){let i=-1;if(me(t)&&Xi(t)&&(i=e.indexOf(t)),-1!==i)return i}return-1}createAdapter(){return this.mdcAdapter={getListItemCount:()=>this.mdcRoot?this.items.length:0,getFocusedElementIndex:this.getFocusedItemIndex,getAttributeForElementIndex:(t,e)=>{if(!this.mdcRoot)return"";const i=this.items[t];return i?i.getAttribute(e):""},setAttributeForElementIndex:(t,e,i)=>{if(!this.mdcRoot)return;const o=this.items[t];o&&o.setAttribute(e,i)},focusItemAtIndex:t=>{const e=this.items[t];e&&e.focus()},setTabIndexForElementIndex:(t,e)=>{const i=this.items[t];i&&(i.tabindex=e)},notifyAction:t=>{const e={bubbles:!0,composed:!0};e.detail={index:t};const i=new CustomEvent("action",e);this.dispatchEvent(i)},notifySelected:(t,e)=>{const i={bubbles:!0,composed:!0};i.detail={index:t,diff:e};const o=new CustomEvent("selected",i);this.dispatchEvent(o)},isFocusInsideList:()=>ye(this),isRootFocused:()=>{const t=this.mdcRoot;return t.getRootNode().activeElement===t},setDisabledStateForElementIndex:(t,e)=>{const i=this.items[t];i&&(i.disabled=e)},getDisabledStateForElementIndex:t=>{const e=this.items[t];return!!e&&e.disabled},setSelectedStateForElementIndex:(t,e)=>{const i=this.items[t];i&&(i.selected=e)},getSelectedStateForElementIndex:t=>{const e=this.items[t];return!!e&&e.selected},setActivatedStateForElementIndex:(t,e)=>{const i=this.items[t];i&&(i.activated=e)}},this.mdcAdapter}selectUi(t,e=!1){const i=this.items[t];i&&(i.selected=!0,i.activated=e)}deselectUi(t){const e=this.items[t];e&&(e.selected=!1,e.activated=!1)}select(t){this.mdcFoundation&&this.mdcFoundation.setSelectedIndex(t)}toggle(t,e){this.multi&&this.mdcFoundation.toggleMultiAtIndex(t,e)}onListItemConnected(t){const e=t.target;this.layout(-1===this.items.indexOf(e))}layout(t=!0){t&&this.updateItems();const e=this.items[0];for(const t of this.items)t.tabindex=-1;e&&(this.noninteractive?this.previousTabindex||(this.previousTabindex=e):e.tabindex=0),this.itemsReadyResolver()}getFocusedItemIndex(){if(!this.mdcRoot)return-1;if(!this.items.length)return-1;const t=ve();if(!t.length)return-1;for(let e=t.length-1;e>=0;e--){const i=t[e];if(Xi(i))return this.items.indexOf(i)}return-1}focusItemAtIndex(t){for(const t of this.items)if(0===t.tabindex){t.tabindex=-1;break}this.items[t].tabindex=0,this.items[t].focus()}focus(){const t=this.mdcRoot;t&&t.focus()}blur(){const t=this.mdcRoot;t&&t.blur()}}o([At({type:String})],Ki.prototype,"emptyMessage",void 0),o([Rt(".mdc-deprecated-list")],Ki.prototype,"mdcRoot",void 0),o([Mt("",!0,"*")],Ki.prototype,"assignedElements",void 0),o([Mt("",!0,'[tabindex="0"]')],Ki.prototype,"tabbableElements",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setUseActivatedClass(t)})],Ki.prototype,"activatable",void 0),o([At({type:Boolean}),Ce(function(t,e){this.mdcFoundation&&this.mdcFoundation.setMulti(t),void 0!==e&&this.layout()})],Ki.prototype,"multi",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setWrapFocus(t)})],Ki.prototype,"wrapFocus",void 0),o([At({type:String}),Ce(function(t,e){void 0!==e&&this.updateItems()})],Ki.prototype,"itemRoles",void 0),o([At({type:String})],Ki.prototype,"innerRole",void 0),o([At({type:String})],Ki.prototype,"innerAriaLabel",void 0),o([At({type:Boolean})],Ki.prototype,"rootTabbable",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t){var e,i;if(t){const t=null!==(i=null===(e=this.tabbableElements)||void 0===e?void 0:e[0])&&void 0!==i?i:null;this.previousTabindex=t,t&&t.setAttribute("tabindex","-1")}else!t&&this.previousTabindex&&(this.previousTabindex.setAttribute("tabindex","0"),this.previousTabindex=null)})],Ki.prototype,"noninteractive",void 0);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Zi{constructor(t){this.startPress=e=>{t().then(t=>{t&&t.startPress(e)})},this.endPress=()=>{t().then(t=>{t&&t.endPress()})},this.startFocus=()=>{t().then(t=>{t&&t.startFocus()})},this.endFocus=()=>{t().then(t=>{t&&t.endFocus()})},this.startHover=()=>{t().then(t=>{t&&t.startHover()})},this.endHover=()=>{t().then(t=>{t&&t.endHover()})}}}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Qi extends Ct{constructor(){super(...arguments),this.value="",this.group=null,this.tabindex=-1,this.disabled=!1,this.twoline=!1,this.activated=!1,this.graphic=null,this.multipleGraphics=!1,this.hasMeta=!1,this.noninteractive=!1,this.selected=!1,this.shouldRenderRipple=!1,this._managingList=null,this.boundOnClick=this.onClick.bind(this),this._firstChanged=!0,this._skipPropRequest=!1,this.rippleHandlers=new Zi(()=>(this.shouldRenderRipple=!0,this.ripple)),this.listeners=[{target:this,eventNames:["click"],cb:()=>{this.onClick()}},{target:this,eventNames:["mouseenter"],cb:this.rippleHandlers.startHover},{target:this,eventNames:["mouseleave"],cb:this.rippleHandlers.endHover},{target:this,eventNames:["focus"],cb:this.rippleHandlers.startFocus},{target:this,eventNames:["blur"],cb:this.rippleHandlers.endFocus},{target:this,eventNames:["mousedown","touchstart"],cb:t=>{const e=t.type;this.onDown("mousedown"===e?"mouseup":"touchend",t)}}]}get text(){const t=this.textContent;return t?t.trim():""}render(){const t=this.renderText(),e=this.graphic?this.renderGraphic():U``,i=this.hasMeta?this.renderMeta():U``;return U`
      ${this.renderRipple()}
      ${e}
      ${t}
      ${i}`}renderRipple(){return this.shouldRenderRipple?U`
      <mwc-ripple
        .activated=${this.activated}>
      </mwc-ripple>`:this.activated?U`<div class="fake-activated-ripple"></div>`:""}renderGraphic(){const t={multi:this.multipleGraphics};return U`
      <span class="mdc-deprecated-list-item__graphic material-icons ${ke(t)}">
        <slot name="graphic"></slot>
      </span>`}renderMeta(){return U`
      <span class="mdc-deprecated-list-item__meta material-icons">
        <slot name="meta"></slot>
      </span>`}renderText(){const t=this.twoline?this.renderTwoline():this.renderSingleLine();return U`
      <span class="mdc-deprecated-list-item__text">
        ${t}
      </span>`}renderSingleLine(){return U`<slot></slot>`}renderTwoline(){return U`
      <span class="mdc-deprecated-list-item__primary-text">
        <slot></slot>
      </span>
      <span class="mdc-deprecated-list-item__secondary-text">
        <slot name="secondary"></slot>
      </span>
    `}onClick(){this.fireRequestSelected(!this.selected,"interaction")}onDown(t,e){const i=()=>{window.removeEventListener(t,i),this.rippleHandlers.endPress()};window.addEventListener(t,i),this.rippleHandlers.startPress(e)}fireRequestSelected(t,e){if(this.noninteractive)return;const i=new CustomEvent("request-selected",{bubbles:!0,composed:!0,detail:{source:e,selected:t}});this.dispatchEvent(i)}connectedCallback(){super.connectedCallback(),this.noninteractive||this.setAttribute("mwc-list-item","");for(const t of this.listeners)for(const e of t.eventNames)t.target.addEventListener(e,t.cb,{passive:!0})}disconnectedCallback(){super.disconnectedCallback();for(const t of this.listeners)for(const e of t.eventNames)t.target.removeEventListener(e,t.cb);this._managingList&&(this._managingList.debouncedLayout?this._managingList.debouncedLayout(!0):this._managingList.layout(!0))}firstUpdated(){const t=new Event("list-item-rendered",{bubbles:!0,composed:!0});this.dispatchEvent(t)}}o([Rt("slot")],Qi.prototype,"slotElement",void 0),o([Lt("mwc-ripple")],Qi.prototype,"ripple",void 0),o([At({type:String})],Qi.prototype,"value",void 0),o([At({type:String,reflect:!0})],Qi.prototype,"group",void 0),o([At({type:Number,reflect:!0})],Qi.prototype,"tabindex",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t){t?this.setAttribute("aria-disabled","true"):this.setAttribute("aria-disabled","false")})],Qi.prototype,"disabled",void 0),o([At({type:Boolean,reflect:!0})],Qi.prototype,"twoline",void 0),o([At({type:Boolean,reflect:!0})],Qi.prototype,"activated",void 0),o([At({type:String,reflect:!0})],Qi.prototype,"graphic",void 0),o([At({type:Boolean})],Qi.prototype,"multipleGraphics",void 0),o([At({type:Boolean})],Qi.prototype,"hasMeta",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t){t?(this.removeAttribute("aria-checked"),this.removeAttribute("mwc-list-item"),this.selected=!1,this.activated=!1,this.tabIndex=-1):this.setAttribute("mwc-list-item","")})],Qi.prototype,"noninteractive",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t){const e=this.getAttribute("role"),i="gridcell"===e||"option"===e||"row"===e||"tab"===e;i&&t?this.setAttribute("aria-selected","true"):i&&this.setAttribute("aria-selected","false"),this._firstChanged?this._firstChanged=!1:this._skipPropRequest||this.fireRequestSelected(t,"property")})],Qi.prototype,"selected",void 0),o([Tt()],Qi.prototype,"shouldRenderRipple",void 0),o([Tt()],Qi.prototype,"_managingList",void 0);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Ji,to={MENU_SELECTED_LIST_ITEM:"mdc-menu-item--selected",MENU_SELECTION_GROUP:"mdc-menu__selection-group",ROOT:"mdc-menu"},eo={ARIA_CHECKED_ATTR:"aria-checked",ARIA_DISABLED_ATTR:"aria-disabled",CHECKBOX_SELECTOR:'input[type="checkbox"]',LIST_SELECTOR:".mdc-list,.mdc-deprecated-list",SELECTED_EVENT:"MDCMenu:selected",SKIP_RESTORE_FOCUS:"data-menu-item-skip-restore-focus"},io={FOCUS_ROOT_INDEX:-1};!function(t){t[t.NONE=0]="NONE",t[t.LIST_ROOT=1]="LIST_ROOT",t[t.FIRST_ITEM=2]="FIRST_ITEM",t[t.LAST_ITEM=3]="LAST_ITEM"}(Ji||(Ji={}));
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var oo=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.isSurfaceOpen=!1,s.isQuickOpen=!1,s.isHoistedElement=!1,s.isFixedPosition=!1,s.isHorizontallyCenteredOnViewport=!1,s.maxHeight=0,s.openBottomBias=0,s.openAnimationEndTimerId=0,s.closeAnimationEndTimerId=0,s.animationRequestId=0,s.anchorCorner=Ri.TOP_START,s.originCorner=Ri.TOP_START,s.anchorMargin={top:0,right:0,bottom:0,left:0},s.position={x:0,y:0},s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return Li},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Ni},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return Di},enumerable:!1,configurable:!0}),Object.defineProperty(o,"Corner",{get:function(){return Ri},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!1},hasAnchor:function(){return!1},isElementInContainer:function(){return!1},isFocused:function(){return!1},isRtl:function(){return!1},getInnerDimensions:function(){return{height:0,width:0}},getAnchorDimensions:function(){return null},getWindowDimensions:function(){return{height:0,width:0}},getBodyDimensions:function(){return{height:0,width:0}},getWindowScroll:function(){return{x:0,y:0}},setPosition:function(){},setMaxHeight:function(){},setTransformOrigin:function(){},saveFocus:function(){},restoreFocus:function(){},notifyClose:function(){},notifyOpen:function(){},notifyClosing:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var t=o.cssClasses,e=t.ROOT,i=t.OPEN;if(!this.adapter.hasClass(e))throw new Error(e+" class required in root element.");this.adapter.hasClass(i)&&(this.isSurfaceOpen=!0)},o.prototype.destroy=function(){clearTimeout(this.openAnimationEndTimerId),clearTimeout(this.closeAnimationEndTimerId),cancelAnimationFrame(this.animationRequestId)},o.prototype.setAnchorCorner=function(t){this.anchorCorner=t},o.prototype.flipCornerHorizontally=function(){this.originCorner=this.originCorner^Fi.RIGHT},o.prototype.setAnchorMargin=function(t){this.anchorMargin.top=t.top||0,this.anchorMargin.right=t.right||0,this.anchorMargin.bottom=t.bottom||0,this.anchorMargin.left=t.left||0},o.prototype.setIsHoisted=function(t){this.isHoistedElement=t},o.prototype.setFixedPosition=function(t){this.isFixedPosition=t},o.prototype.isFixed=function(){return this.isFixedPosition},o.prototype.setAbsolutePosition=function(t,e){this.position.x=this.isFinite(t)?t:0,this.position.y=this.isFinite(e)?e:0},o.prototype.setIsHorizontallyCenteredOnViewport=function(t){this.isHorizontallyCenteredOnViewport=t},o.prototype.setQuickOpen=function(t){this.isQuickOpen=t},o.prototype.setMaxHeight=function(t){this.maxHeight=t},o.prototype.setOpenBottomBias=function(t){this.openBottomBias=t},o.prototype.isOpen=function(){return this.isSurfaceOpen},o.prototype.open=function(){var t=this;this.isSurfaceOpen||(this.adapter.saveFocus(),this.isQuickOpen?(this.isSurfaceOpen=!0,this.adapter.addClass(o.cssClasses.OPEN),this.dimensions=this.adapter.getInnerDimensions(),this.autoposition(),this.adapter.notifyOpen()):(this.adapter.addClass(o.cssClasses.ANIMATING_OPEN),this.animationRequestId=requestAnimationFrame(function(){t.dimensions=t.adapter.getInnerDimensions(),t.autoposition(),t.adapter.addClass(o.cssClasses.OPEN),t.openAnimationEndTimerId=setTimeout(function(){t.openAnimationEndTimerId=0,t.adapter.removeClass(o.cssClasses.ANIMATING_OPEN),t.adapter.notifyOpen()},Di.TRANSITION_OPEN_DURATION)}),this.isSurfaceOpen=!0))},o.prototype.close=function(t){var e=this;if(void 0===t&&(t=!1),this.isSurfaceOpen){if(this.adapter.notifyClosing(),this.isQuickOpen)return this.isSurfaceOpen=!1,t||this.maybeRestoreFocus(),this.adapter.removeClass(o.cssClasses.OPEN),this.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),void this.adapter.notifyClose();this.adapter.addClass(o.cssClasses.ANIMATING_CLOSED),requestAnimationFrame(function(){e.adapter.removeClass(o.cssClasses.OPEN),e.adapter.removeClass(o.cssClasses.IS_OPEN_BELOW),e.closeAnimationEndTimerId=setTimeout(function(){e.closeAnimationEndTimerId=0,e.adapter.removeClass(o.cssClasses.ANIMATING_CLOSED),e.adapter.notifyClose()},Di.TRANSITION_CLOSE_DURATION)}),this.isSurfaceOpen=!1,t||this.maybeRestoreFocus()}},o.prototype.handleBodyClick=function(t){var e=t.target;this.adapter.isElementInContainer(e)||this.close()},o.prototype.handleKeydown=function(t){var e=t.keyCode;("Escape"===t.key||27===e)&&this.close()},o.prototype.autoposition=function(){var t;this.measurements=this.getAutoLayoutmeasurements();var e=this.getoriginCorner(),i=this.getMenuSurfaceMaxHeight(e),s=this.hasBit(e,Fi.BOTTOM)?"bottom":"top",n=this.hasBit(e,Fi.RIGHT)?"right":"left",a=this.getHorizontalOriginOffset(e),r=this.getVerticalOriginOffset(e),l=this.measurements,c=l.anchorSize,d=l.surfaceSize,h=((t={})[n]=a,t[s]=r,t);c.width/d.width>Di.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO&&(n="center"),(this.isHoistedElement||this.isFixedPosition)&&this.adjustPositionForHoistedElement(h),this.adapter.setTransformOrigin(n+" "+s),this.adapter.setPosition(h),this.adapter.setMaxHeight(i?i+"px":""),this.hasBit(e,Fi.BOTTOM)||this.adapter.addClass(o.cssClasses.IS_OPEN_BELOW)},o.prototype.getAutoLayoutmeasurements=function(){var t=this.adapter.getAnchorDimensions(),e=this.adapter.getBodyDimensions(),i=this.adapter.getWindowDimensions(),o=this.adapter.getWindowScroll();return t||(t={top:this.position.y,right:this.position.x,bottom:this.position.y,left:this.position.x,width:0,height:0}),{anchorSize:t,bodySize:e,surfaceSize:this.dimensions,viewportDistance:{top:t.top,right:i.width-t.right,bottom:i.height-t.bottom,left:t.left},viewportSize:i,windowScroll:o}},o.prototype.getoriginCorner=function(){var t,e,i=this.originCorner,s=this.measurements,n=s.viewportDistance,a=s.anchorSize,r=s.surfaceSize,l=o.numbers.MARGIN_TO_EDGE;this.hasBit(this.anchorCorner,Fi.BOTTOM)?(t=n.top-l+this.anchorMargin.bottom,e=n.bottom-l-this.anchorMargin.bottom):(t=n.top-l+this.anchorMargin.top,e=n.bottom-l+a.height-this.anchorMargin.top),!(e-r.height>0)&&t>e+this.openBottomBias&&(i=this.setBit(i,Fi.BOTTOM));var c,d,h=this.adapter.isRtl(),u=this.hasBit(this.anchorCorner,Fi.FLIP_RTL),p=this.hasBit(this.anchorCorner,Fi.RIGHT)||this.hasBit(i,Fi.RIGHT),m=!1;(m=h&&u?!p:p)?(c=n.left+a.width+this.anchorMargin.right,d=n.right-this.anchorMargin.right):(c=n.left+this.anchorMargin.left,d=n.right+a.width-this.anchorMargin.left);var _=c-r.width>0,f=d-r.width>0,g=this.hasBit(i,Fi.FLIP_RTL)&&this.hasBit(i,Fi.RIGHT);return f&&g&&h||!_&&g?i=this.unsetBit(i,Fi.RIGHT):(_&&m&&h||_&&!m&&p||!f&&c>=d)&&(i=this.setBit(i,Fi.RIGHT)),i},o.prototype.getMenuSurfaceMaxHeight=function(t){if(this.maxHeight>0)return this.maxHeight;var e=this.measurements.viewportDistance,i=0,s=this.hasBit(t,Fi.BOTTOM),n=this.hasBit(this.anchorCorner,Fi.BOTTOM),a=o.numbers.MARGIN_TO_EDGE;return s?(i=e.top+this.anchorMargin.top-a,n||(i+=this.measurements.anchorSize.height)):(i=e.bottom-this.anchorMargin.bottom+this.measurements.anchorSize.height-a,n&&(i-=this.measurements.anchorSize.height)),i},o.prototype.getHorizontalOriginOffset=function(t){var e=this.measurements.anchorSize,i=this.hasBit(t,Fi.RIGHT),o=this.hasBit(this.anchorCorner,Fi.RIGHT);if(i){var s=o?e.width-this.anchorMargin.left:this.anchorMargin.right;return this.isHoistedElement||this.isFixedPosition?s-(this.measurements.viewportSize.width-this.measurements.bodySize.width):s}return o?e.width-this.anchorMargin.right:this.anchorMargin.left},o.prototype.getVerticalOriginOffset=function(t){var e=this.measurements.anchorSize,i=this.hasBit(t,Fi.BOTTOM),o=this.hasBit(this.anchorCorner,Fi.BOTTOM);return i?o?e.height-this.anchorMargin.top:-this.anchorMargin.bottom:o?e.height+this.anchorMargin.bottom:this.anchorMargin.top},o.prototype.adjustPositionForHoistedElement=function(t){var e,i,o=this.measurements,n=o.windowScroll,a=o.viewportDistance,r=o.surfaceSize,l=o.viewportSize,c=Object.keys(t);try{for(var d=s(c),h=d.next();!h.done;h=d.next()){var u=h.value,p=t[u]||0;!this.isHorizontallyCenteredOnViewport||"left"!==u&&"right"!==u?(p+=a[u],this.isFixedPosition||("top"===u?p+=n.y:"bottom"===u?p-=n.y:"left"===u?p+=n.x:p-=n.x),t[u]=p):t[u]=(l.width-r.width)/2}}catch(t){e={error:t}}finally{try{h&&!h.done&&(i=d.return)&&i.call(d)}finally{if(e)throw e.error}}},o.prototype.maybeRestoreFocus=function(){var t=this,e=this.adapter.isFocused(),i=document.activeElement&&this.adapter.isElementInContainer(document.activeElement);(e||i)&&setTimeout(function(){t.adapter.restoreFocus()},Di.TOUCH_EVENT_WAIT_MS)},o.prototype.hasBit=function(t,e){return Boolean(t&e)},o.prototype.setBit=function(t,e){return t|e},o.prototype.unsetBit=function(t,e){return t^e},o.prototype.isFinite=function(t){return"number"==typeof t&&isFinite(t)},o}(de),so=oo,no=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.closeAnimationEndTimerId=0,s.defaultFocusState=Ji.LIST_ROOT,s.selectedIndex=-1,s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return to},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return eo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return io},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClassToElementAtIndex:function(){},removeClassFromElementAtIndex:function(){},addAttributeToElementAtIndex:function(){},removeAttributeFromElementAtIndex:function(){},getAttributeFromElementAtIndex:function(){return null},elementContainsClass:function(){return!1},closeSurface:function(){},getElementIndex:function(){return-1},notifySelected:function(){},getMenuItemCount:function(){return 0},focusItemAtIndex:function(){},focusListRoot:function(){},getSelectedSiblingOfItemAtIndex:function(){return-1},isSelectableItemAtIndex:function(){return!1}}},enumerable:!1,configurable:!0}),o.prototype.destroy=function(){this.closeAnimationEndTimerId&&clearTimeout(this.closeAnimationEndTimerId),this.adapter.closeSurface()},o.prototype.handleKeydown=function(t){var e=t.key,i=t.keyCode;("Tab"===e||9===i)&&this.adapter.closeSurface(!0)},o.prototype.handleItemAction=function(t){var e=this,i=this.adapter.getElementIndex(t);if(!(i<0)){this.adapter.notifySelected({index:i});var o="true"===this.adapter.getAttributeFromElementAtIndex(i,eo.SKIP_RESTORE_FOCUS);this.adapter.closeSurface(o),this.closeAnimationEndTimerId=setTimeout(function(){var i=e.adapter.getElementIndex(t);i>=0&&e.adapter.isSelectableItemAtIndex(i)&&e.setSelectedIndex(i)},oo.numbers.TRANSITION_CLOSE_DURATION)}},o.prototype.handleMenuSurfaceOpened=function(){switch(this.defaultFocusState){case Ji.FIRST_ITEM:this.adapter.focusItemAtIndex(0);break;case Ji.LAST_ITEM:this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount()-1);break;case Ji.NONE:break;default:this.adapter.focusListRoot()}},o.prototype.setDefaultFocusState=function(t){this.defaultFocusState=t},o.prototype.getSelectedIndex=function(){return this.selectedIndex},o.prototype.setSelectedIndex=function(t){if(this.validatedIndex(t),!this.adapter.isSelectableItemAtIndex(t))throw new Error("MDCMenuFoundation: No selection group at specified index.");var e=this.adapter.getSelectedSiblingOfItemAtIndex(t);e>=0&&(this.adapter.removeAttributeFromElementAtIndex(e,eo.ARIA_CHECKED_ATTR),this.adapter.removeClassFromElementAtIndex(e,to.MENU_SELECTED_LIST_ITEM)),this.adapter.addClassToElementAtIndex(t,to.MENU_SELECTED_LIST_ITEM),this.adapter.addAttributeToElementAtIndex(t,eo.ARIA_CHECKED_ATTR,"true"),this.selectedIndex=t},o.prototype.setEnabled=function(t,e){this.validatedIndex(t),e?(this.adapter.removeClassFromElementAtIndex(t,pi),this.adapter.addAttributeToElementAtIndex(t,eo.ARIA_DISABLED_ATTR,"false")):(this.adapter.addClassToElementAtIndex(t,pi),this.adapter.addAttributeToElementAtIndex(t,eo.ARIA_DISABLED_ATTR,"true"))},o.prototype.validatedIndex=function(t){var e=this.adapter.getMenuItemCount();if(!(t>=0&&t<e))throw new Error("MDCMenuFoundation: No list item at specified index.")},o}(de);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ao extends be{constructor(){super(...arguments),this.mdcFoundationClass=no,this.listElement_=null,this.anchor=null,this.open=!1,this.quick=!1,this.wrapFocus=!1,this.innerRole="menu",this.innerAriaLabel=null,this.corner="TOP_START",this.x=null,this.y=null,this.absolute=!1,this.multi=!1,this.activatable=!1,this.fixed=!1,this.forceGroupSelection=!1,this.fullwidth=!1,this.menuCorner="START",this.stayOpenOnBodyClick=!1,this.defaultFocus="LIST_ROOT",this._listUpdateComplete=null}get listElement(){return this.listElement_||(this.listElement_=this.renderRoot.querySelector("mwc-list")),this.listElement_}get items(){const t=this.listElement;return t?t.items:[]}get index(){const t=this.listElement;return t?t.index:-1}get selected(){const t=this.listElement;return t?t.selected:null}render(){const t="menu"===this.innerRole?"menuitem":"option";return U`
      <mwc-menu-surface
          ?hidden=${!this.open}
          .anchor=${this.anchor}
          .open=${this.open}
          .quick=${this.quick}
          .corner=${this.corner}
          .x=${this.x}
          .y=${this.y}
          .absolute=${this.absolute}
          .fixed=${this.fixed}
          .fullwidth=${this.fullwidth}
          .menuCorner=${this.menuCorner}
          ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
          class="mdc-menu mdc-menu-surface"
          @closed=${this.onClosed}
          @opened=${this.onOpened}
          @keydown=${this.onKeydown}>
        <mwc-list
          rootTabbable
          .innerAriaLabel=${this.innerAriaLabel}
          .innerRole=${this.innerRole}
          .multi=${this.multi}
          class="mdc-deprecated-list"
          .itemRoles=${t}
          .wrapFocus=${this.wrapFocus}
          .activatable=${this.activatable}
          @action=${this.onAction}>
        <slot></slot>
      </mwc-list>
    </mwc-menu-surface>`}createAdapter(){return{addClassToElementAtIndex:(t,e)=>{const i=this.listElement;if(!i)return;const o=i.items[t];o&&("mdc-menu-item--selected"===e?this.forceGroupSelection&&!o.selected&&i.toggle(t,!0):o.classList.add(e))},removeClassFromElementAtIndex:(t,e)=>{const i=this.listElement;if(!i)return;const o=i.items[t];o&&("mdc-menu-item--selected"===e?o.selected&&i.toggle(t,!1):o.classList.remove(e))},addAttributeToElementAtIndex:(t,e,i)=>{const o=this.listElement;if(!o)return;const s=o.items[t];s&&s.setAttribute(e,i)},removeAttributeFromElementAtIndex:(t,e)=>{const i=this.listElement;if(!i)return;const o=i.items[t];o&&o.removeAttribute(e)},getAttributeFromElementAtIndex:(t,e)=>{const i=this.listElement;if(!i)return null;const o=i.items[t];return o?o.getAttribute(e):null},elementContainsClass:(t,e)=>t.classList.contains(e),closeSurface:()=>{this.open=!1},getElementIndex:t=>{const e=this.listElement;return e?e.items.indexOf(t):-1},notifySelected:()=>{},getMenuItemCount:()=>{const t=this.listElement;return t?t.items.length:0},focusItemAtIndex:t=>{const e=this.listElement;if(!e)return;const i=e.items[t];i&&i.focus()},focusListRoot:()=>{this.listElement&&this.listElement.focus()},getSelectedSiblingOfItemAtIndex:t=>{const e=this.listElement;if(!e)return-1;const i=e.items[t];if(!i||!i.group)return-1;for(let o=0;o<e.items.length;o++){if(o===t)continue;const s=e.items[o];if(s.selected&&s.group===i.group)return o}return-1},isSelectableItemAtIndex:t=>{const e=this.listElement;if(!e)return!1;const i=e.items[t];return!!i&&i.hasAttribute("group")}}}onKeydown(t){this.mdcFoundation&&this.mdcFoundation.handleKeydown(t)}onAction(t){const e=this.listElement;if(this.mdcFoundation&&e){const i=t.detail.index,o=e.items[i];o&&this.mdcFoundation.handleItemAction(o)}}onOpened(){this.open=!0,this.mdcFoundation&&this.mdcFoundation.handleMenuSurfaceOpened()}onClosed(){this.open=!1}async getUpdateComplete(){await this._listUpdateComplete;return await super.getUpdateComplete()}async firstUpdated(){super.firstUpdated();const t=this.listElement;t&&(this._listUpdateComplete=t.updateComplete,await this._listUpdateComplete)}select(t){const e=this.listElement;e&&e.select(t)}close(){this.open=!1}show(){this.open=!0}getFocusedItemIndex(){const t=this.listElement;return t?t.getFocusedItemIndex():-1}focusItemAtIndex(t){const e=this.listElement;e&&e.focusItemAtIndex(t)}layout(t=!0){const e=this.listElement;e&&e.layout(t)}}o([Rt(".mdc-menu")],ao.prototype,"mdcRoot",void 0),o([Rt("slot")],ao.prototype,"slotElement",void 0),o([At({type:Object})],ao.prototype,"anchor",void 0),o([At({type:Boolean,reflect:!0})],ao.prototype,"open",void 0),o([At({type:Boolean})],ao.prototype,"quick",void 0),o([At({type:Boolean})],ao.prototype,"wrapFocus",void 0),o([At({type:String})],ao.prototype,"innerRole",void 0),o([At({type:String})],ao.prototype,"innerAriaLabel",void 0),o([At({type:String})],ao.prototype,"corner",void 0),o([At({type:Number})],ao.prototype,"x",void 0),o([At({type:Number})],ao.prototype,"y",void 0),o([At({type:Boolean})],ao.prototype,"absolute",void 0),o([At({type:Boolean})],ao.prototype,"multi",void 0),o([At({type:Boolean})],ao.prototype,"activatable",void 0),o([At({type:Boolean})],ao.prototype,"fixed",void 0),o([At({type:Boolean})],ao.prototype,"forceGroupSelection",void 0),o([At({type:Boolean})],ao.prototype,"fullwidth",void 0),o([At({type:String})],ao.prototype,"menuCorner",void 0),o([At({type:Boolean})],ao.prototype,"stayOpenOnBodyClick",void 0),o([At({type:String}),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setDefaultFocusState(Ji[t])})],ao.prototype,"defaultFocus",void 0);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ro="important",lo=" !"+ro,co=Qt(class extends Jt{constructor(t){var e;if(super(t),t.type!==Xt||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const o=t[i];return null==o?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ht){this.ht=new Set;for(const t in e)this.ht.add(t);return this.render(e)}this.ht.forEach(t=>{null==e[t]&&(this.ht.delete(t),t.includes("-")?i.removeProperty(t):i[t]="")});for(const t in e){const o=e[t];if(null!=o){this.ht.add(t);const e="string"==typeof o&&o.endsWith(lo);t.includes("-")||e?i.setProperty(t,e?o.slice(0,-11):o,e?ro:""):i[t]=o}}return H}}),ho={TOP_LEFT:Ri.TOP_LEFT,TOP_RIGHT:Ri.TOP_RIGHT,BOTTOM_LEFT:Ri.BOTTOM_LEFT,BOTTOM_RIGHT:Ri.BOTTOM_RIGHT,TOP_START:Ri.TOP_START,TOP_END:Ri.TOP_END,BOTTOM_START:Ri.BOTTOM_START,BOTTOM_END:Ri.BOTTOM_END};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class uo extends be{constructor(){super(...arguments),this.mdcFoundationClass=so,this.absolute=!1,this.fullwidth=!1,this.fixed=!1,this.x=null,this.y=null,this.quick=!1,this.open=!1,this.stayOpenOnBodyClick=!1,this.bitwiseCorner=Ri.TOP_START,this.previousMenuCorner=null,this.menuCorner="START",this.corner="TOP_START",this.styleTop="",this.styleLeft="",this.styleRight="",this.styleBottom="",this.styleMaxHeight="",this.styleTransformOrigin="",this.anchor=null,this.previouslyFocused=null,this.previousAnchor=null,this.onBodyClickBound=()=>{}}render(){const t={"mdc-menu-surface--fixed":this.fixed,"mdc-menu-surface--fullwidth":this.fullwidth},e={top:this.styleTop,left:this.styleLeft,right:this.styleRight,bottom:this.styleBottom,"max-height":this.styleMaxHeight,"transform-origin":this.styleTransformOrigin};return U`
      <div
          class="mdc-menu-surface ${ke(t)}"
          style="${co(e)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        <slot></slot>
      </div>`}createAdapter(){return Object.assign(Object.assign({},_e(this.mdcRoot)),{hasAnchor:()=>!!this.anchor,notifyClose:()=>{const t=new CustomEvent("closed",{bubbles:!0,composed:!0});this.open=!1,this.mdcRoot.dispatchEvent(t)},notifyClosing:()=>{const t=new CustomEvent("closing",{bubbles:!0,composed:!0});this.mdcRoot.dispatchEvent(t)},notifyOpen:()=>{const t=new CustomEvent("opened",{bubbles:!0,composed:!0});this.open=!0,this.mdcRoot.dispatchEvent(t)},isElementInContainer:()=>!1,isRtl:()=>!!this.mdcRoot&&"rtl"===getComputedStyle(this.mdcRoot).direction,setTransformOrigin:t=>{this.mdcRoot&&(this.styleTransformOrigin=t)},isFocused:()=>ye(this),saveFocus:()=>{const t=ve(),e=t.length;e||(this.previouslyFocused=null),this.previouslyFocused=t[e-1]},restoreFocus:()=>{this.previouslyFocused&&"focus"in this.previouslyFocused&&this.previouslyFocused.focus()},getInnerDimensions:()=>{const t=this.mdcRoot;return t?{width:t.offsetWidth,height:t.offsetHeight}:{width:0,height:0}},getAnchorDimensions:()=>{const t=this.anchor;return t?t.getBoundingClientRect():null},getBodyDimensions:()=>({width:document.body.clientWidth,height:document.body.clientHeight}),getWindowDimensions:()=>({width:window.innerWidth,height:window.innerHeight}),getWindowScroll:()=>({x:window.pageXOffset,y:window.pageYOffset}),setPosition:t=>{this.mdcRoot&&(this.styleLeft="left"in t?`${t.left}px`:"",this.styleRight="right"in t?`${t.right}px`:"",this.styleTop="top"in t?`${t.top}px`:"",this.styleBottom="bottom"in t?`${t.bottom}px`:"")},setMaxHeight:async t=>{this.mdcRoot&&(this.styleMaxHeight=t,await this.updateComplete,this.styleMaxHeight=`var(--mdc-menu-max-height, ${t})`)}})}onKeydown(t){this.mdcFoundation&&this.mdcFoundation.handleKeydown(t)}onBodyClick(t){if(this.stayOpenOnBodyClick)return;-1===t.composedPath().indexOf(this)&&this.close()}registerBodyClick(){this.onBodyClickBound=this.onBodyClick.bind(this),document.body.addEventListener("click",this.onBodyClickBound,{passive:!0,capture:!0})}deregisterBodyClick(){document.body.removeEventListener("click",this.onBodyClickBound,{capture:!0})}close(){this.open=!1}show(){this.open=!0}}o([Rt(".mdc-menu-surface")],uo.prototype,"mdcRoot",void 0),o([Rt("slot")],uo.prototype,"slotElement",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation&&!this.fixed&&this.mdcFoundation.setIsHoisted(t)})],uo.prototype,"absolute",void 0),o([At({type:Boolean})],uo.prototype,"fullwidth",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation&&!this.absolute&&this.mdcFoundation.setFixedPosition(t)})],uo.prototype,"fixed",void 0),o([At({type:Number}),Ce(function(t){this.mdcFoundation&&null!==this.y&&null!==t&&(this.mdcFoundation.setAbsolutePosition(t,this.y),this.mdcFoundation.setAnchorMargin({left:t,top:this.y,right:-t,bottom:this.y}))})],uo.prototype,"x",void 0),o([At({type:Number}),Ce(function(t){this.mdcFoundation&&null!==this.x&&null!==t&&(this.mdcFoundation.setAbsolutePosition(this.x,t),this.mdcFoundation.setAnchorMargin({left:this.x,top:t,right:-this.x,bottom:t}))})],uo.prototype,"y",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setQuickOpen(t)})],uo.prototype,"quick",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t,e){this.mdcFoundation&&(t?this.mdcFoundation.open():void 0!==e&&this.mdcFoundation.close())})],uo.prototype,"open",void 0),o([At({type:Boolean})],uo.prototype,"stayOpenOnBodyClick",void 0),o([Tt(),Ce(function(t){this.mdcFoundation&&this.mdcFoundation.setAnchorCorner(t)})],uo.prototype,"bitwiseCorner",void 0),o([At({type:String}),Ce(function(t){if(this.mdcFoundation){const e="START"===t||"END"===t,i=null===this.previousMenuCorner,o=!i&&t!==this.previousMenuCorner;e&&(o||i&&"END"===t)&&(this.bitwiseCorner=this.bitwiseCorner^Fi.RIGHT,this.mdcFoundation.flipCornerHorizontally(),this.previousMenuCorner=t)}})],uo.prototype,"menuCorner",void 0),o([At({type:String}),Ce(function(t){if(this.mdcFoundation&&t){let e=ho[t];"END"===this.menuCorner&&(e^=Fi.RIGHT),this.bitwiseCorner=e}})],uo.prototype,"corner",void 0),o([Tt()],uo.prototype,"styleTop",void 0),o([Tt()],uo.prototype,"styleLeft",void 0),o([Tt()],uo.prototype,"styleRight",void 0),o([Tt()],uo.prototype,"styleBottom",void 0),o([Tt()],uo.prototype,"styleMaxHeight",void 0),o([Tt()],uo.prototype,"styleTransformOrigin",void 0);
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var po={BG_FOCUSED:"mdc-ripple-upgraded--background-focused",FG_ACTIVATION:"mdc-ripple-upgraded--foreground-activation",FG_DEACTIVATION:"mdc-ripple-upgraded--foreground-deactivation",ROOT:"mdc-ripple-upgraded",UNBOUNDED:"mdc-ripple-upgraded--unbounded"},mo={VAR_FG_SCALE:"--mdc-ripple-fg-scale",VAR_FG_SIZE:"--mdc-ripple-fg-size",VAR_FG_TRANSLATE_END:"--mdc-ripple-fg-translate-end",VAR_FG_TRANSLATE_START:"--mdc-ripple-fg-translate-start",VAR_LEFT:"--mdc-ripple-left",VAR_TOP:"--mdc-ripple-top"},_o={DEACTIVATION_TIMEOUT_MS:225,FG_DEACTIVATION_MS:150,INITIAL_ORIGIN_SCALE:.6,PADDING:10,TAP_DELAY_MS:300};
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var fo=["touchstart","pointerdown","mousedown","keydown"],go=["touchend","pointerup","mouseup","contextmenu"],vo=[],yo=function(t){function o(e){var s=t.call(this,i(i({},o.defaultAdapter),e))||this;return s.activationAnimationHasEnded=!1,s.activationTimer=0,s.fgDeactivationRemovalTimer=0,s.fgScale="0",s.frame={width:0,height:0},s.initialSize=0,s.layoutFrame=0,s.maxRadius=0,s.unboundedCoords={left:0,top:0},s.activationState=s.defaultActivationState(),s.activationTimerCallback=function(){s.activationAnimationHasEnded=!0,s.runDeactivationUXLogicIfReady()},s.activateHandler=function(t){s.activateImpl(t)},s.deactivateHandler=function(){s.deactivateImpl()},s.focusHandler=function(){s.handleFocus()},s.blurHandler=function(){s.handleBlur()},s.resizeHandler=function(){s.layout()},s}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return po},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return mo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return _o},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},browserSupportsCssVars:function(){return!0},computeBoundingRect:function(){return{top:0,right:0,bottom:0,left:0,width:0,height:0}},containsEventTarget:function(){return!0},deregisterDocumentInteractionHandler:function(){},deregisterInteractionHandler:function(){},deregisterResizeHandler:function(){},getWindowPageOffset:function(){return{x:0,y:0}},isSurfaceActive:function(){return!0},isSurfaceDisabled:function(){return!0},isUnbounded:function(){return!0},registerDocumentInteractionHandler:function(){},registerInteractionHandler:function(){},registerResizeHandler:function(){},removeClass:function(){},updateCssVariable:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var t=this,e=this.supportsPressRipple();if(this.registerRootHandlers(e),e){var i=o.cssClasses,s=i.ROOT,n=i.UNBOUNDED;requestAnimationFrame(function(){t.adapter.addClass(s),t.adapter.isUnbounded()&&(t.adapter.addClass(n),t.layoutInternal())})}},o.prototype.destroy=function(){var t=this;if(this.supportsPressRipple()){this.activationTimer&&(clearTimeout(this.activationTimer),this.activationTimer=0,this.adapter.removeClass(o.cssClasses.FG_ACTIVATION)),this.fgDeactivationRemovalTimer&&(clearTimeout(this.fgDeactivationRemovalTimer),this.fgDeactivationRemovalTimer=0,this.adapter.removeClass(o.cssClasses.FG_DEACTIVATION));var e=o.cssClasses,i=e.ROOT,s=e.UNBOUNDED;requestAnimationFrame(function(){t.adapter.removeClass(i),t.adapter.removeClass(s),t.removeCssVars()})}this.deregisterRootHandlers(),this.deregisterDeactivationHandlers()},o.prototype.activate=function(t){this.activateImpl(t)},o.prototype.deactivate=function(){this.deactivateImpl()},o.prototype.layout=function(){var t=this;this.layoutFrame&&cancelAnimationFrame(this.layoutFrame),this.layoutFrame=requestAnimationFrame(function(){t.layoutInternal(),t.layoutFrame=0})},o.prototype.setUnbounded=function(t){var e=o.cssClasses.UNBOUNDED;t?this.adapter.addClass(e):this.adapter.removeClass(e)},o.prototype.handleFocus=function(){var t=this;requestAnimationFrame(function(){return t.adapter.addClass(o.cssClasses.BG_FOCUSED)})},o.prototype.handleBlur=function(){var t=this;requestAnimationFrame(function(){return t.adapter.removeClass(o.cssClasses.BG_FOCUSED)})},o.prototype.supportsPressRipple=function(){return this.adapter.browserSupportsCssVars()},o.prototype.defaultActivationState=function(){return{activationEvent:void 0,hasDeactivationUXRun:!1,isActivated:!1,isProgrammatic:!1,wasActivatedByPointer:!1,wasElementMadeActive:!1}},o.prototype.registerRootHandlers=function(t){var e,i;if(t){try{for(var o=s(fo),n=o.next();!n.done;n=o.next()){var a=n.value;this.adapter.registerInteractionHandler(a,this.activateHandler)}}catch(t){e={error:t}}finally{try{n&&!n.done&&(i=o.return)&&i.call(o)}finally{if(e)throw e.error}}this.adapter.isUnbounded()&&this.adapter.registerResizeHandler(this.resizeHandler)}this.adapter.registerInteractionHandler("focus",this.focusHandler),this.adapter.registerInteractionHandler("blur",this.blurHandler)},o.prototype.registerDeactivationHandlers=function(t){var e,i;if("keydown"===t.type)this.adapter.registerInteractionHandler("keyup",this.deactivateHandler);else try{for(var o=s(go),n=o.next();!n.done;n=o.next()){var a=n.value;this.adapter.registerDocumentInteractionHandler(a,this.deactivateHandler)}}catch(t){e={error:t}}finally{try{n&&!n.done&&(i=o.return)&&i.call(o)}finally{if(e)throw e.error}}},o.prototype.deregisterRootHandlers=function(){var t,e;try{for(var i=s(fo),o=i.next();!o.done;o=i.next()){var n=o.value;this.adapter.deregisterInteractionHandler(n,this.activateHandler)}}catch(e){t={error:e}}finally{try{o&&!o.done&&(e=i.return)&&e.call(i)}finally{if(t)throw t.error}}this.adapter.deregisterInteractionHandler("focus",this.focusHandler),this.adapter.deregisterInteractionHandler("blur",this.blurHandler),this.adapter.isUnbounded()&&this.adapter.deregisterResizeHandler(this.resizeHandler)},o.prototype.deregisterDeactivationHandlers=function(){var t,e;this.adapter.deregisterInteractionHandler("keyup",this.deactivateHandler);try{for(var i=s(go),o=i.next();!o.done;o=i.next()){var n=o.value;this.adapter.deregisterDocumentInteractionHandler(n,this.deactivateHandler)}}catch(e){t={error:e}}finally{try{o&&!o.done&&(e=i.return)&&e.call(i)}finally{if(t)throw t.error}}},o.prototype.removeCssVars=function(){var t=this,e=o.strings;Object.keys(e).forEach(function(i){0===i.indexOf("VAR_")&&t.adapter.updateCssVariable(e[i],null)})},o.prototype.activateImpl=function(t){var e=this;if(!this.adapter.isSurfaceDisabled()){var i=this.activationState;if(!i.isActivated){var o=this.previousActivationEvent;if(!(o&&void 0!==t&&o.type!==t.type))i.isActivated=!0,i.isProgrammatic=void 0===t,i.activationEvent=t,i.wasActivatedByPointer=!i.isProgrammatic&&(void 0!==t&&("mousedown"===t.type||"touchstart"===t.type||"pointerdown"===t.type)),void 0!==t&&vo.length>0&&vo.some(function(t){return e.adapter.containsEventTarget(t)})?this.resetActivationState():(void 0!==t&&(vo.push(t.target),this.registerDeactivationHandlers(t)),i.wasElementMadeActive=this.checkElementMadeActive(t),i.wasElementMadeActive&&this.animateActivation(),requestAnimationFrame(function(){vo=[],i.wasElementMadeActive||void 0===t||" "!==t.key&&32!==t.keyCode||(i.wasElementMadeActive=e.checkElementMadeActive(t),i.wasElementMadeActive&&e.animateActivation()),i.wasElementMadeActive||(e.activationState=e.defaultActivationState())}))}}},o.prototype.checkElementMadeActive=function(t){return void 0===t||"keydown"!==t.type||this.adapter.isSurfaceActive()},o.prototype.animateActivation=function(){var t=this,e=o.strings,i=e.VAR_FG_TRANSLATE_START,s=e.VAR_FG_TRANSLATE_END,n=o.cssClasses,a=n.FG_DEACTIVATION,r=n.FG_ACTIVATION,l=o.numbers.DEACTIVATION_TIMEOUT_MS;this.layoutInternal();var c="",d="";if(!this.adapter.isUnbounded()){var h=this.getFgTranslationCoordinates(),u=h.startPoint,p=h.endPoint;c=u.x+"px, "+u.y+"px",d=p.x+"px, "+p.y+"px"}this.adapter.updateCssVariable(i,c),this.adapter.updateCssVariable(s,d),clearTimeout(this.activationTimer),clearTimeout(this.fgDeactivationRemovalTimer),this.rmBoundedActivationClasses(),this.adapter.removeClass(a),this.adapter.computeBoundingRect(),this.adapter.addClass(r),this.activationTimer=setTimeout(function(){t.activationTimerCallback()},l)},o.prototype.getFgTranslationCoordinates=function(){var t,e=this.activationState,i=e.activationEvent;return t=e.wasActivatedByPointer?function(t,e,i){if(!t)return{x:0,y:0};var o,s,n=e.x,a=e.y,r=n+i.left,l=a+i.top;if("touchstart"===t.type){var c=t;o=c.changedTouches[0].pageX-r,s=c.changedTouches[0].pageY-l}else{var d=t;o=d.pageX-r,s=d.pageY-l}return{x:o,y:s}}(i,this.adapter.getWindowPageOffset(),this.adapter.computeBoundingRect()):{x:this.frame.width/2,y:this.frame.height/2},{startPoint:t={x:t.x-this.initialSize/2,y:t.y-this.initialSize/2},endPoint:{x:this.frame.width/2-this.initialSize/2,y:this.frame.height/2-this.initialSize/2}}},o.prototype.runDeactivationUXLogicIfReady=function(){var t=this,e=o.cssClasses.FG_DEACTIVATION,i=this.activationState,s=i.hasDeactivationUXRun,n=i.isActivated;(s||!n)&&this.activationAnimationHasEnded&&(this.rmBoundedActivationClasses(),this.adapter.addClass(e),this.fgDeactivationRemovalTimer=setTimeout(function(){t.adapter.removeClass(e)},_o.FG_DEACTIVATION_MS))},o.prototype.rmBoundedActivationClasses=function(){var t=o.cssClasses.FG_ACTIVATION;this.adapter.removeClass(t),this.activationAnimationHasEnded=!1,this.adapter.computeBoundingRect()},o.prototype.resetActivationState=function(){var t=this;this.previousActivationEvent=this.activationState.activationEvent,this.activationState=this.defaultActivationState(),setTimeout(function(){return t.previousActivationEvent=void 0},o.numbers.TAP_DELAY_MS)},o.prototype.deactivateImpl=function(){var t=this,e=this.activationState;if(e.isActivated){var o=i({},e);e.isProgrammatic?(requestAnimationFrame(function(){t.animateDeactivation(o)}),this.resetActivationState()):(this.deregisterDeactivationHandlers(),requestAnimationFrame(function(){t.activationState.hasDeactivationUXRun=!0,t.animateDeactivation(o),t.resetActivationState()}))}},o.prototype.animateDeactivation=function(t){var e=t.wasActivatedByPointer,i=t.wasElementMadeActive;(e||i)&&this.runDeactivationUXLogicIfReady()},o.prototype.layoutInternal=function(){var t=this;this.frame=this.adapter.computeBoundingRect();var e=Math.max(this.frame.height,this.frame.width);this.maxRadius=this.adapter.isUnbounded()?e:Math.sqrt(Math.pow(t.frame.width,2)+Math.pow(t.frame.height,2))+o.numbers.PADDING;var i=Math.floor(e*o.numbers.INITIAL_ORIGIN_SCALE);this.adapter.isUnbounded()&&i%2!=0?this.initialSize=i-1:this.initialSize=i,this.fgScale=""+this.maxRadius/this.initialSize,this.updateLayoutCssVars()},o.prototype.updateLayoutCssVars=function(){var t=o.strings,e=t.VAR_FG_SIZE,i=t.VAR_LEFT,s=t.VAR_TOP,n=t.VAR_FG_SCALE;this.adapter.updateCssVariable(e,this.initialSize+"px"),this.adapter.updateCssVariable(n,this.fgScale),this.adapter.isUnbounded()&&(this.unboundedCoords={left:Math.round(this.frame.width/2-this.initialSize/2),top:Math.round(this.frame.height/2-this.initialSize/2)},this.adapter.updateCssVariable(i,this.unboundedCoords.left+"px"),this.adapter.updateCssVariable(s,this.unboundedCoords.top+"px"))},o}(de),bo=yo;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class xo extends be{constructor(){super(...arguments),this.primary=!1,this.accent=!1,this.unbounded=!1,this.disabled=!1,this.activated=!1,this.selected=!1,this.internalUseStateLayerCustomProperties=!1,this.hovering=!1,this.bgFocused=!1,this.fgActivation=!1,this.fgDeactivation=!1,this.fgScale="",this.fgSize="",this.translateStart="",this.translateEnd="",this.leftPos="",this.topPos="",this.mdcFoundationClass=bo}get isActive(){return t=this.parentElement||this,e=":active",(t.matches||t.webkitMatchesSelector||t.msMatchesSelector).call(t,e);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var t,e}createAdapter(){return{browserSupportsCssVars:()=>!0,isUnbounded:()=>this.unbounded,isSurfaceActive:()=>this.isActive,isSurfaceDisabled:()=>this.disabled,addClass:t=>{switch(t){case"mdc-ripple-upgraded--background-focused":this.bgFocused=!0;break;case"mdc-ripple-upgraded--foreground-activation":this.fgActivation=!0;break;case"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation=!0}},removeClass:t=>{switch(t){case"mdc-ripple-upgraded--background-focused":this.bgFocused=!1;break;case"mdc-ripple-upgraded--foreground-activation":this.fgActivation=!1;break;case"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation=!1}},containsEventTarget:()=>!0,registerInteractionHandler:()=>{},deregisterInteractionHandler:()=>{},registerDocumentInteractionHandler:()=>{},deregisterDocumentInteractionHandler:()=>{},registerResizeHandler:()=>{},deregisterResizeHandler:()=>{},updateCssVariable:(t,e)=>{switch(t){case"--mdc-ripple-fg-scale":this.fgScale=e;break;case"--mdc-ripple-fg-size":this.fgSize=e;break;case"--mdc-ripple-fg-translate-end":this.translateEnd=e;break;case"--mdc-ripple-fg-translate-start":this.translateStart=e;break;case"--mdc-ripple-left":this.leftPos=e;break;case"--mdc-ripple-top":this.topPos=e}},computeBoundingRect:()=>(this.parentElement||this).getBoundingClientRect(),getWindowPageOffset:()=>({x:window.pageXOffset,y:window.pageYOffset})}}startPress(t){this.waitForFoundation(()=>{this.mdcFoundation.activate(t)})}endPress(){this.waitForFoundation(()=>{this.mdcFoundation.deactivate()})}startFocus(){this.waitForFoundation(()=>{this.mdcFoundation.handleFocus()})}endFocus(){this.waitForFoundation(()=>{this.mdcFoundation.handleBlur()})}startHover(){this.hovering=!0}endHover(){this.hovering=!1}waitForFoundation(t){this.mdcFoundation?t():this.updateComplete.then(t)}update(t){t.has("disabled")&&this.disabled&&this.endHover(),super.update(t)}render(){const t=this.activated&&(this.primary||!this.accent),e=this.selected&&(this.primary||!this.accent),i={"mdc-ripple-surface--accent":this.accent,"mdc-ripple-surface--primary--activated":t,"mdc-ripple-surface--accent--activated":this.accent&&this.activated,"mdc-ripple-surface--primary--selected":e,"mdc-ripple-surface--accent--selected":this.accent&&this.selected,"mdc-ripple-surface--disabled":this.disabled,"mdc-ripple-surface--hover":this.hovering,"mdc-ripple-surface--primary":this.primary,"mdc-ripple-surface--selected":this.selected,"mdc-ripple-upgraded--background-focused":this.bgFocused,"mdc-ripple-upgraded--foreground-activation":this.fgActivation,"mdc-ripple-upgraded--foreground-deactivation":this.fgDeactivation,"mdc-ripple-upgraded--unbounded":this.unbounded,"mdc-ripple-surface--internal-use-state-layer-custom-properties":this.internalUseStateLayerCustomProperties};return U`
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${ke(i)}"
          style="${co({"--mdc-ripple-fg-scale":this.fgScale,"--mdc-ripple-fg-size":this.fgSize,"--mdc-ripple-fg-translate-end":this.translateEnd,"--mdc-ripple-fg-translate-start":this.translateStart,"--mdc-ripple-left":this.leftPos,"--mdc-ripple-top":this.topPos})}"></div>`}}o([Rt(".mdc-ripple-surface")],xo.prototype,"mdcRoot",void 0),o([At({type:Boolean})],xo.prototype,"primary",void 0),o([At({type:Boolean})],xo.prototype,"accent",void 0),o([At({type:Boolean})],xo.prototype,"unbounded",void 0),o([At({type:Boolean})],xo.prototype,"disabled",void 0),o([At({type:Boolean})],xo.prototype,"activated",void 0),o([At({type:Boolean})],xo.prototype,"selected",void 0),o([At({type:Boolean})],xo.prototype,"internalUseStateLayerCustomProperties",void 0),o([Tt()],xo.prototype,"hovering",void 0),o([Tt()],xo.prototype,"bgFocused",void 0),o([Tt()],xo.prototype,"fgActivation",void 0),o([Tt()],xo.prototype,"fgDeactivation",void 0),o([Tt()],xo.prototype,"fgScale",void 0),o([Tt()],xo.prototype,"fgSize",void 0),o([Tt()],xo.prototype,"translateStart",void 0),o([Tt()],xo.prototype,"translateEnd",void 0),o([Tt()],xo.prototype,"leftPos",void 0),o([Tt()],xo.prototype,"topPos",void 0);
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var wo={NOTCH_ELEMENT_SELECTOR:".mdc-notched-outline__notch"},$o={NOTCH_ELEMENT_PADDING:8},Eo={NO_LABEL:"mdc-notched-outline--no-label",OUTLINE_NOTCHED:"mdc-notched-outline--notched",OUTLINE_UPGRADED:"mdc-notched-outline--upgraded"},Co=function(t){function o(e){return t.call(this,i(i({},o.defaultAdapter),e))||this}return e(o,t),Object.defineProperty(o,"strings",{get:function(){return wo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"cssClasses",{get:function(){return Eo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return $o},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},setNotchWidthProperty:function(){},removeNotchWidthProperty:function(){}}},enumerable:!1,configurable:!0}),o.prototype.notch=function(t){var e=o.cssClasses.OUTLINE_NOTCHED;t>0&&(t+=$o.NOTCH_ELEMENT_PADDING),this.adapter.setNotchWidthProperty(t),this.adapter.addClass(e)},o.prototype.closeNotch=function(){var t=o.cssClasses.OUTLINE_NOTCHED;this.adapter.removeClass(t),this.adapter.removeNotchWidthProperty()},o}(de);
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ko extends be{constructor(){super(...arguments),this.mdcFoundationClass=Co,this.width=0,this.open=!1,this.lastOpen=this.open}createAdapter(){return{addClass:t=>this.mdcRoot.classList.add(t),removeClass:t=>this.mdcRoot.classList.remove(t),setNotchWidthProperty:t=>this.notchElement.style.setProperty("width",`${t}px`),removeNotchWidthProperty:()=>this.notchElement.style.removeProperty("width")}}openOrClose(t,e){this.mdcFoundation&&(t&&void 0!==e?this.mdcFoundation.notch(e):this.mdcFoundation.closeNotch())}render(){this.openOrClose(this.open,this.width);const t=ke({"mdc-notched-outline--notched":this.open});return U`
      <span class="mdc-notched-outline ${t}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`}}o([Rt(".mdc-notched-outline")],ko.prototype,"mdcRoot",void 0),o([At({type:Number})],ko.prototype,"width",void 0),o([At({type:Boolean,reflect:!0})],ko.prototype,"open",void 0),o([Rt(".mdc-notched-outline__notch")],ko.prototype,"notchElement",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const So=ht`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-select{display:inline-flex;position:relative}.mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87)}.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-select.mdc-select--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54)}.mdc-select:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#6200ee;fill:var(--mdc-theme-primary, #6200ee)}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled)+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-select:not(.mdc-select--disabled) .mdc-select__icon{color:rgba(0, 0, 0, 0.54)}.mdc-select.mdc-select--disabled .mdc-select__icon{color:rgba(0, 0, 0, 0.38)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-select.mdc-select--disabled .mdc-select__selected-text{color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__dropdown-icon{fill:red}.mdc-select.mdc-select--disabled .mdc-floating-label{color:GrayText}.mdc-select.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}.mdc-select.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select.mdc-select--disabled .mdc-notched-outline__trailing{border-color:GrayText}.mdc-select.mdc-select--disabled .mdc-select__icon{color:GrayText}.mdc-select.mdc-select--disabled+.mdc-select-helper-text{color:GrayText}}.mdc-select .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-select .mdc-select__anchor{padding-left:16px;padding-right:0}[dir=rtl] .mdc-select .mdc-select__anchor,.mdc-select .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:16px}.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor{padding-left:0;padding-right:0}[dir=rtl] .mdc-select.mdc-select--with-leading-icon .mdc-select__anchor,.mdc-select.mdc-select--with-leading-icon .mdc-select__anchor[dir=rtl]{padding-left:0;padding-right:0}.mdc-select .mdc-select__icon{width:24px;height:24px;font-size:24px}.mdc-select .mdc-select__dropdown-icon{width:24px;height:24px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item,.mdc-select .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:12px}[dir=rtl] .mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic,.mdc-select .mdc-select__menu .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:12px;margin-right:0}.mdc-select__dropdown-icon{margin-left:12px;margin-right:12px;display:inline-flex;position:relative;align-self:center;align-items:center;justify-content:center;flex-shrink:0;pointer-events:none}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active,.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{position:absolute;top:0;left:0}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-graphic{width:41.6666666667%;height:20.8333333333%}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:1;transition:opacity 75ms linear 75ms}.mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:0;transition:opacity 75ms linear}[dir=rtl] .mdc-select__dropdown-icon,.mdc-select__dropdown-icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-inactive{opacity:0;transition:opacity 49.5ms linear}.mdc-select--activated .mdc-select__dropdown-icon .mdc-select__dropdown-icon-active{opacity:1;transition:opacity 100.5ms linear 49.5ms}.mdc-select__anchor{width:200px;min-width:0;flex:1 1 auto;position:relative;box-sizing:border-box;overflow:hidden;outline:none;cursor:pointer}.mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-select__selected-text-container{display:flex;appearance:none;pointer-events:none;box-sizing:border-box;width:auto;min-width:0;flex-grow:1;height:28px;border:none;outline:none;padding:0;background-color:transparent;color:inherit}.mdc-select__selected-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;width:100%;text-align:left}[dir=rtl] .mdc-select__selected-text,.mdc-select__selected-text[dir=rtl]{text-align:right}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--invalid+.mdc-select-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-select__dropdown-icon{fill:#b00020;fill:var(--mdc-theme-error, #b00020)}.mdc-select--disabled{cursor:default;pointer-events:none}.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item{padding-left:12px;padding-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item,.mdc-select--with-leading-icon .mdc-select__menu .mdc-deprecated-list-item[dir=rtl]{padding-left:12px;padding-right:12px}.mdc-select__menu .mdc-deprecated-list .mdc-select__icon,.mdc-select__menu .mdc-list .mdc-select__icon{margin-left:0;margin-right:0}[dir=rtl] .mdc-select__menu .mdc-deprecated-list .mdc-select__icon,[dir=rtl] .mdc-select__menu .mdc-list .mdc-select__icon,.mdc-select__menu .mdc-deprecated-list .mdc-select__icon[dir=rtl],.mdc-select__menu .mdc-list .mdc-select__icon[dir=rtl]{margin-left:0;margin-right:0}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__graphic,.mdc-select__menu .mdc-list .mdc-deprecated-list-item--activated .mdc-deprecated-list-item__graphic{color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-select__menu .mdc-list-item__start{display:inline-flex;align-items:center}.mdc-select__option{padding-left:16px;padding-right:16px}[dir=rtl] .mdc-select__option,.mdc-select__option[dir=rtl]{padding-left:16px;padding-right:16px}.mdc-select__one-line-option.mdc-list-item--with-one-line{height:48px}.mdc-select__two-line-option.mdc-list-item--with-two-lines{height:64px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__start{margin-top:20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text{display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::before{display:inline-block;width:0;height:28px;content:"";vertical-align:0}.mdc-select__two-line-option.mdc-list-item--with-two-lines .mdc-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end{display:block;margin-top:0;line-height:normal}.mdc-select__two-line-option.mdc-list-item--with-two-lines.mdc-list-item--with-trailing-meta .mdc-list-item__end::before{display:inline-block;width:0;height:36px;content:"";vertical-align:0}.mdc-select__option-with-leading-content{padding-left:0;padding-right:12px}.mdc-select__option-with-leading-content.mdc-list-item{padding-left:0;padding-right:auto}[dir=rtl] .mdc-select__option-with-leading-content.mdc-list-item,.mdc-select__option-with-leading-content.mdc-list-item[dir=rtl]{padding-left:auto;padding-right:0}.mdc-select__option-with-leading-content .mdc-list-item__start{margin-left:12px;margin-right:0}[dir=rtl] .mdc-select__option-with-leading-content .mdc-list-item__start,.mdc-select__option-with-leading-content .mdc-list-item__start[dir=rtl]{margin-left:0;margin-right:12px}.mdc-select__option-with-leading-content .mdc-list-item__start{width:36px;height:24px}[dir=rtl] .mdc-select__option-with-leading-content,.mdc-select__option-with-leading-content[dir=rtl]{padding-left:12px;padding-right:0}.mdc-select__option-with-meta.mdc-list-item{padding-left:auto;padding-right:0}[dir=rtl] .mdc-select__option-with-meta.mdc-list-item,.mdc-select__option-with-meta.mdc-list-item[dir=rtl]{padding-left:0;padding-right:auto}.mdc-select__option-with-meta .mdc-list-item__end{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select__option-with-meta .mdc-list-item__end,.mdc-select__option-with-meta .mdc-list-item__end[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select--filled .mdc-select__anchor{height:56px;display:flex;align-items:baseline}.mdc-select--filled .mdc-select__anchor::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--filled.mdc-select--no-label .mdc-select__anchor::before{display:none}.mdc-select--filled .mdc-select__anchor{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-select--filled:not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke}.mdc-select--filled.mdc-select--disabled .mdc-select__anchor{background-color:#fafafa}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-select--filled:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-select--filled:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--filled.mdc-select--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-select--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-select--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-select--filled .mdc-menu-surface--is-open-below{border-top-left-radius:0px;border-top-right-radius:0px}.mdc-select--filled.mdc-select--focused.mdc-line-ripple::after{transform:scale(1, 2);opacity:1}.mdc-select--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-select--filled .mdc-floating-label,.mdc-select--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{left:48px;right:initial}[dir=rtl] .mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-select--filled.mdc-select--with-leading-icon .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--invalid:not(.mdc-select--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined{border:none}.mdc-select--outlined .mdc-select__anchor{height:56px}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-56px{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-select--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-select--outlined .mdc-select__anchor{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined .mdc-select__anchor,.mdc-select--outlined .mdc-select__anchor[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-select--outlined+.mdc-select-helper-text{margin-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-select--outlined+.mdc-select-helper-text,.mdc-select--outlined+.mdc-select-helper-text[dir=rtl]{margin-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-select__anchor{background-color:transparent}.mdc-select--outlined.mdc-select--disabled .mdc-select__anchor{background-color:transparent}.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}.mdc-select--outlined .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-select--outlined .mdc-select__anchor{display:flex;align-items:baseline;overflow:visible}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined 250ms 1}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-select--outlined .mdc-select__anchor .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-select--outlined .mdc-select__anchor.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined .mdc-select__anchor .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text::before{content:"​"}.mdc-select--outlined .mdc-select__anchor .mdc-select__selected-text-container{height:100%;display:inline-flex;align-items:center}.mdc-select--outlined .mdc-select__anchor::before{display:none}.mdc-select--outlined .mdc-select__selected-text-container{display:flex;border:none;z-index:1;background-color:transparent}.mdc-select--outlined .mdc-select__icon{z-index:2}.mdc-select--outlined .mdc-floating-label{line-height:1.15rem;left:4px;right:initial}[dir=rtl] .mdc-select--outlined .mdc-floating-label,.mdc-select--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-select--outlined.mdc-select--focused .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled):not(.mdc-select--focused) .mdc-select__anchor:hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-width:2px}.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__leading,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__notch,.mdc-select--outlined.mdc-select--invalid:not(.mdc-select--disabled).mdc-select--focused .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--float-above{font-size:.75rem}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-select--outlined.mdc-select--with-leading-icon.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-select--outlined.mdc-select--with-leading-icon .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-select--outlined.mdc-select--with-leading-icon .mdc-floating-label--shake,.mdc-select--outlined.mdc-select--with-leading-icon[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px 250ms 1}@keyframes mdc-floating-label-shake-float-above-select-outlined-leading-icon-56px-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-select--outlined.mdc-select--with-leading-icon .mdc-select__anchor :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 96px)}.mdc-select--outlined .mdc-menu-surface{margin-bottom:8px}.mdc-select--outlined.mdc-select--no-label .mdc-menu-surface,.mdc-select--outlined .mdc-menu-surface--is-open-below{margin-bottom:0}.mdc-select__anchor{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-select__anchor .mdc-select__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-select__anchor .mdc-select__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-select__anchor.mdc-ripple-upgraded--unbounded .mdc-select__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-select__anchor.mdc-ripple-upgraded--foreground-activation .mdc-select__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-select__anchor.mdc-ripple-upgraded--foreground-deactivation .mdc-select__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-select__anchor.mdc-ripple-upgraded .mdc-select__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-select__anchor .mdc-select__ripple::before,.mdc-select__anchor .mdc-select__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-select__anchor:hover .mdc-select__ripple::before,.mdc-select__anchor.mdc-ripple-surface--hover .mdc-select__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__anchor.mdc-ripple-upgraded--background-focused .mdc-select__ripple::before,.mdc-select__anchor:not(.mdc-ripple-upgraded):focus .mdc-select__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__anchor .mdc-select__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-deprecated-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-deprecated-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-deprecated-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-deprecated-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-deprecated-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-deprecated-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected .mdc-list-item__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, var(--mdc-theme-on-surface, #000))}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:hover .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-surface--hover .mdc-list-item__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded--background-focused .mdc-list-item__ripple::before,.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):focus .mdc-list-item__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded) .mdc-list-item__ripple::after{transition:opacity 150ms linear}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected:not(.mdc-ripple-upgraded):active .mdc-list-item__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select__menu .mdc-deprecated-list .mdc-deprecated-list-item--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-select-helper-text{margin:0;margin-left:16px;margin-right:16px;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal}[dir=rtl] .mdc-select-helper-text,.mdc-select-helper-text[dir=rtl]{margin-left:16px;margin-right:16px}.mdc-select-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-select-helper-text--validation-msg{opacity:0;transition:opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-select--invalid+.mdc-select-helper-text--validation-msg,.mdc-select-helper-text--validation-msg-persistent{opacity:1}.mdc-select--with-leading-icon .mdc-select__icon{display:inline-block;box-sizing:border-box;border:none;text-decoration:none;cursor:pointer;user-select:none;flex-shrink:0;align-self:center;background-color:transparent;fill:currentColor}.mdc-select--with-leading-icon .mdc-select__icon{margin-left:12px;margin-right:12px}[dir=rtl] .mdc-select--with-leading-icon .mdc-select__icon,.mdc-select--with-leading-icon .mdc-select__icon[dir=rtl]{margin-left:12px;margin-right:12px}.mdc-select__icon:not([tabindex]),.mdc-select__icon[tabindex="-1"]{cursor:default;pointer-events:none}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-block;vertical-align:top;outline:none}.mdc-select{width:100%}[hidden]{display:none}.mdc-select__icon{z-index:2}.mdc-select--with-leading-icon{--mdc-list-item-graphic-margin: calc( 48px - var(--mdc-list-item-graphic-size, 24px) - var(--mdc-list-side-padding, 16px) )}.mdc-select .mdc-select__anchor .mdc-select__selected-text{overflow:hidden}.mdc-select .mdc-select__anchor *{display:inline-flex}.mdc-select .mdc-select__anchor .mdc-floating-label{display:inline-block}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-idle-border-color, rgba(0, 0, 0, 0.38) );--mdc-notched-outline-notch-offset: 1px}:host(:not([disabled]):hover) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.87);color:var(--mdc-select-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-select-idle-line-color, rgba(0, 0, 0, 0.42))}:host(:not([disabled])) .mdc-select:not(.mdc-select--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-select-hover-line-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-select:not(.mdc-select--outlined):not(.mdc-select--disabled) .mdc-select__anchor{background-color:whitesmoke;background-color:var(--mdc-select-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-select__dropdown-icon{fill:var(--mdc-select-error-dropdown-icon-color, var(--mdc-select-error-color, var(--mdc-theme-error, #b00020)))}:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label,:host(:not([disabled])) .mdc-select.mdc-select--invalid .mdc-floating-label::after{color:var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select.mdc-select--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}.mdc-select__menu--invalid{--mdc-theme-primary: var(--mdc-select-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.6);color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.54);fill:var(--mdc-select-dropdown-icon-color, rgba(0, 0, 0, 0.54))}:host(:not([disabled])) .mdc-select.mdc-select--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px;--mdc-notched-outline-notch-offset: 2px}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-select__dropdown-icon{fill:rgba(98,0,238,.87);fill:var(--mdc-select-focused-dropdown-icon-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)))}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select.mdc-select--focused:not(.mdc-select--invalid) .mdc-floating-label::after{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-select-helper-text:not(.mdc-select-helper-text--validation-msg){color:var(--mdc-select-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]){pointer-events:none}:host([disabled]) .mdc-select:not(.mdc-select--outlined).mdc-select--disabled .mdc-select__anchor{background-color:#fafafa;background-color:var(--mdc-select-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-select.mdc-select--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-select-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-select .mdc-select__dropdown-icon{fill:rgba(0, 0, 0, 0.38);fill:var(--mdc-select-disabled-dropdown-icon-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label,:host([disabled]) .mdc-select:not(.mdc-select--invalid):not(.mdc-select--focused) .mdc-floating-label::after{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select-helper-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-select__selected-text{color:rgba(0, 0, 0, 0.38);color:var(--mdc-select-disabled-ink-color, rgba(0, 0, 0, 0.38))}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,Io=ht`@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));padding:var(--mdc-list-vertical-padding, 8px) 0}.mdc-deprecated-list:focus{outline:none}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0, 0, 0, 0.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding, 16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin, 72px);margin-right:0;width:calc( 100% - var(--mdc-list-inset-margin, 72px) )}[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]),.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]){margin-left:0;margin-right:var(--mdc-list-inset-margin, 72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc( 100% - var(--mdc-list-inset-margin, 72px) - var(--mdc-list-side-padding, 16px) )}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 20px}.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,Ao=ht`:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding, 16px);padding-right:var(--mdc-list-side-padding, 16px);outline:none;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host:focus{outline:none}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary, #6200ee);--mdc-ripple-color: var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12);background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size, 24px);height:var(--mdc-list-item-meta-size, 24px);margin-left:auto;margin-right:0;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size, 24px);line-height:var(--mdc-list-item-meta-size, 24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size, 24px) !important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit)}[dir=rtl] .mdc-deprecated-list-item__meta,.mdc-deprecated-list-item__meta[dir=rtl]{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0, 0, 0, 0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 40px);height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 40px);line-height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 40px) !important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 16px)}[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 24px);height:var(--mdc-list-item-graphic-size, 24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 24px);line-height:var(--mdc-list-item-graphic-size, 24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 24px) !important}[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic,:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=medium]:not([twoLine])),:host([graphic=large]:not([twoLine])){height:72px}:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 56px);height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 56px);line-height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 56px) !important}:host([graphic=large]){padding-left:0px}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,To=ht`.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-upgraded--unbounded::before,.mdc-ripple-upgraded--unbounded::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-ripple-surface:hover::before,.mdc-ripple-surface.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary:hover::before,.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before,.mdc-ripple-surface--primary--activated::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--activated:hover::before,.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--primary--selected::before,.mdc-ripple-surface--primary--selected::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--selected:hover::before,.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent:hover::before,.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before,.mdc-ripple-surface--accent--activated::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--activated:hover::before,.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--accent--selected::before,.mdc-ripple-surface--accent--selected::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--selected:hover::before,.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties::after{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color, #000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-state-layer-opacity, 0.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,Oo=ht`mwc-list ::slotted([mwc-list-item]:not([twoline])),mwc-list ::slotted([noninteractive]:not([twoline])){height:var(--mdc-menu-item-height, 48px)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,Fo=ht`.mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;transition:opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1),height 250ms cubic-bezier(0, 0, 0.2, 1);box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0,0,0,.12);background-color:#fff;background-color:var(--mdc-theme-surface, #fff);color:#000;color:var(--mdc-theme-on-surface, #000);border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0;transition:opacity .075s linear}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}:host(:not([open])){display:none}.mdc-menu-surface{z-index:8;z-index:var(--mdc-menu-z-index, 8);min-width:112px;min-width:var(--mdc-menu-min-width, 112px)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */,Ro=ht`.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] :host,:host([dir=rtl]){text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / 0.75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading,.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color, var(--mdc-theme-primary, #6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width, 1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset, 0)}`,Lo={"mwc-select":class extends Hi{static get styles(){return So}},"mwc-list":class extends Ki{static get styles(){return Io}},"mwc-list-item":class extends Qi{static get styles(){return Ao}},"mwc-ripple":class extends xo{static get styles(){return To}},"mwc-menu":class extends ao{static get styles(){return Oo}},"mwc-menu-surface":class extends uo{static get styles(){return Fo}},"mwc-notched-outline":class extends ko{static get styles(){return Ro}}};function No(t,e,i){if(void 0!==e)
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
return function(t,e,i){const o=t.constructor;if(!i){const t=`__${e}`;if(!(i=o.getPropertyDescriptor(e,t)))throw new Error("@ariaProperty must be used after a @property decorator")}const s=i;let n="";if(!s.set)throw new Error(`@ariaProperty requires a setter for ${e}`);if(t.dispatchWizEvent)return i;const a={configurable:!0,enumerable:!0,set(t){if(""===n){const t=o.getPropertyOptions(e);n="string"==typeof t.attribute?t.attribute:e}this.hasAttribute(n)&&this.removeAttribute(n),s.set.call(this,t)}};return s.get&&(a.get=function(){return s.get.call(this)}),a}(t,e,i);throw new Error("@ariaProperty only supports TypeScript Decorators")}
/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */var Do={CHECKED:"mdc-switch--checked",DISABLED:"mdc-switch--disabled"},Mo={ARIA_CHECKED_ATTR:"aria-checked",NATIVE_CONTROL_SELECTOR:".mdc-switch__native-control",RIPPLE_SURFACE_SELECTOR:".mdc-switch__thumb-underlay"},Po=function(t){function o(e){return t.call(this,i(i({},o.defaultAdapter),e))||this}return e(o,t),Object.defineProperty(o,"strings",{get:function(){return Mo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"cssClasses",{get:function(){return Do},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},setNativeControlChecked:function(){},setNativeControlDisabled:function(){},setNativeControlAttr:function(){}}},enumerable:!1,configurable:!0}),o.prototype.setChecked=function(t){this.adapter.setNativeControlChecked(t),this.updateAriaChecked(t),this.updateCheckedStyling(t)},o.prototype.setDisabled=function(t){this.adapter.setNativeControlDisabled(t),t?this.adapter.addClass(Do.DISABLED):this.adapter.removeClass(Do.DISABLED)},o.prototype.handleChange=function(t){var e=t.target;this.updateAriaChecked(e.checked),this.updateCheckedStyling(e.checked)},o.prototype.updateCheckedStyling=function(t){t?this.adapter.addClass(Do.CHECKED):this.adapter.removeClass(Do.CHECKED)},o.prototype.updateAriaChecked=function(t){this.adapter.setNativeControlAttr(Mo.ARIA_CHECKED_ATTR,""+!!t)},o}(de);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Vo extends be{constructor(){super(...arguments),this.checked=!1,this.disabled=!1,this.shouldRenderRipple=!1,this.mdcFoundationClass=Po,this.rippleHandlers=new Zi(()=>(this.shouldRenderRipple=!0,this.ripple))}changeHandler(t){this.mdcFoundation.handleChange(t),this.checked=this.formElement.checked}createAdapter(){return Object.assign(Object.assign({},_e(this.mdcRoot)),{setNativeControlChecked:t=>{this.formElement.checked=t},setNativeControlDisabled:t=>{this.formElement.disabled=t},setNativeControlAttr:(t,e)=>{this.formElement.setAttribute(t,e)}})}renderRipple(){return this.shouldRenderRipple?U`
        <mwc-ripple
          .accent="${this.checked}"
          .disabled="${this.disabled}"
          unbounded>
        </mwc-ripple>`:""}focus(){const t=this.formElement;t&&(this.rippleHandlers.startFocus(),t.focus())}blur(){const t=this.formElement;t&&(this.rippleHandlers.endFocus(),t.blur())}click(){this.formElement&&!this.disabled&&(this.formElement.focus(),this.formElement.click())}firstUpdated(){super.firstUpdated(),this.shadowRoot&&this.mdcRoot.addEventListener("change",t=>{this.dispatchEvent(new Event("change",t))})}render(){return U`
      <div class="mdc-switch">
        <div class="mdc-switch__track"></div>
        <div class="mdc-switch__thumb-underlay">
          ${this.renderRipple()}
          <div class="mdc-switch__thumb">
            <input
              type="checkbox"
              id="basic-switch"
              class="mdc-switch__native-control"
              role="switch"
              aria-label="${Gt(this.ariaLabel)}"
              aria-labelledby="${Gt(this.ariaLabelledBy)}"
              @change="${this.changeHandler}"
              @focus="${this.handleRippleFocus}"
              @blur="${this.handleRippleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
          </div>
        </div>
      </div>`}handleRippleMouseDown(t){const e=()=>{window.removeEventListener("mouseup",e),this.handleRippleDeactivate()};window.addEventListener("mouseup",e),this.rippleHandlers.startPress(t)}handleRippleTouchStart(t){this.rippleHandlers.startPress(t)}handleRippleDeactivate(){this.rippleHandlers.endPress()}handleRippleMouseEnter(){this.rippleHandlers.startHover()}handleRippleMouseLeave(){this.rippleHandlers.endHover()}handleRippleFocus(){this.rippleHandlers.startFocus()}handleRippleBlur(){this.rippleHandlers.endFocus()}}o([At({type:Boolean}),Ce(function(t){this.mdcFoundation.setChecked(t)})],Vo.prototype,"checked",void 0),o([At({type:Boolean}),Ce(function(t){this.mdcFoundation.setDisabled(t)})],Vo.prototype,"disabled",void 0),o([No,At({attribute:"aria-label"})],Vo.prototype,"ariaLabel",void 0),o([No,At({attribute:"aria-labelledby"})],Vo.prototype,"ariaLabelledBy",void 0),o([Rt(".mdc-switch")],Vo.prototype,"mdcRoot",void 0),o([Rt("input")],Vo.prototype,"formElement",void 0),o([Lt("mwc-ripple")],Vo.prototype,"ripple",void 0),o([Tt()],Vo.prototype,"shouldRenderRipple",void 0),o([Ft({passive:!0})],Vo.prototype,"handleRippleMouseDown",null),o([Ft({passive:!0})],Vo.prototype,"handleRippleTouchStart",null);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const zo=ht`.mdc-switch__thumb-underlay{left:-14px;right:initial;top:-17px;width:48px;height:48px}[dir=rtl] .mdc-switch__thumb-underlay,.mdc-switch__thumb-underlay[dir=rtl]{left:initial;right:-14px}.mdc-switch__native-control{width:64px;height:48px}.mdc-switch{display:inline-block;position:relative;outline:none;user-select:none}.mdc-switch.mdc-switch--checked .mdc-switch__track{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786)}.mdc-switch.mdc-switch--checked .mdc-switch__thumb{background-color:#018786;background-color:var(--mdc-theme-secondary, #018786);border-color:#018786;border-color:var(--mdc-theme-secondary, #018786)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__track{background-color:#000;background-color:var(--mdc-theme-on-surface, #000)}.mdc-switch:not(.mdc-switch--checked) .mdc-switch__thumb{background-color:#fff;background-color:var(--mdc-theme-surface, #fff);border-color:#fff;border-color:var(--mdc-theme-surface, #fff)}.mdc-switch__native-control{left:0;right:initial;position:absolute;top:0;margin:0;opacity:0;cursor:pointer;pointer-events:auto;transition:transform 90ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-switch__native-control,.mdc-switch__native-control[dir=rtl]{left:initial;right:0}.mdc-switch__track{box-sizing:border-box;width:36px;height:14px;border:1px solid transparent;border-radius:7px;opacity:.38;transition:opacity 90ms cubic-bezier(0.4, 0, 0.2, 1),background-color 90ms cubic-bezier(0.4, 0, 0.2, 1),border-color 90ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-switch__thumb-underlay{display:flex;position:absolute;align-items:center;justify-content:center;transform:translateX(0);transition:transform 90ms cubic-bezier(0.4, 0, 0.2, 1),background-color 90ms cubic-bezier(0.4, 0, 0.2, 1),border-color 90ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-switch__thumb{box-shadow:0px 3px 1px -2px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 1px 5px 0px rgba(0,0,0,.12);box-sizing:border-box;width:20px;height:20px;border:10px solid;border-radius:50%;pointer-events:none;z-index:1}.mdc-switch--checked .mdc-switch__track{opacity:.54}.mdc-switch--checked .mdc-switch__thumb-underlay{transform:translateX(16px)}[dir=rtl] .mdc-switch--checked .mdc-switch__thumb-underlay,.mdc-switch--checked .mdc-switch__thumb-underlay[dir=rtl]{transform:translateX(-16px)}.mdc-switch--checked .mdc-switch__native-control{transform:translateX(-16px)}[dir=rtl] .mdc-switch--checked .mdc-switch__native-control,.mdc-switch--checked .mdc-switch__native-control[dir=rtl]{transform:translateX(16px)}.mdc-switch--disabled{opacity:.38;pointer-events:none}.mdc-switch--disabled .mdc-switch__thumb{border-width:1px}.mdc-switch--disabled .mdc-switch__native-control{cursor:default;pointer-events:none}:host{display:inline-flex;outline:none;-webkit-tap-highlight-color:transparent}`,Uo={"mwc-switch":class extends Vo{static get styles(){return zo}},"mwc-ripple":class extends xo{static get styles(){return To}}};
/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Ho={ARIA_CONTROLS:"aria-controls",ARIA_DESCRIBEDBY:"aria-describedby",INPUT_SELECTOR:".mdc-text-field__input",LABEL_SELECTOR:".mdc-floating-label",LEADING_ICON_SELECTOR:".mdc-text-field__icon--leading",LINE_RIPPLE_SELECTOR:".mdc-line-ripple",OUTLINE_SELECTOR:".mdc-notched-outline",PREFIX_SELECTOR:".mdc-text-field__affix--prefix",SUFFIX_SELECTOR:".mdc-text-field__affix--suffix",TRAILING_ICON_SELECTOR:".mdc-text-field__icon--trailing"},Bo={DISABLED:"mdc-text-field--disabled",FOCUSED:"mdc-text-field--focused",HELPER_LINE:"mdc-text-field-helper-line",INVALID:"mdc-text-field--invalid",LABEL_FLOATING:"mdc-text-field--label-floating",NO_LABEL:"mdc-text-field--no-label",OUTLINED:"mdc-text-field--outlined",ROOT:"mdc-text-field",TEXTAREA:"mdc-text-field--textarea",WITH_LEADING_ICON:"mdc-text-field--with-leading-icon",WITH_TRAILING_ICON:"mdc-text-field--with-trailing-icon",WITH_INTERNAL_COUNTER:"mdc-text-field--with-internal-counter"},Wo={LABEL_SCALE:.75},jo=["pattern","min","max","required","step","minlength","maxlength"],qo=["color","date","datetime-local","month","range","time","week"],Go=["mousedown","touchstart"],Xo=["click","keydown"],Yo=function(t){function o(e,s){void 0===s&&(s={});var n=t.call(this,i(i({},o.defaultAdapter),e))||this;return n.isFocused=!1,n.receivedUserInput=!1,n.valid=!0,n.useNativeValidation=!0,n.validateOnValueChange=!0,n.helperText=s.helperText,n.characterCounter=s.characterCounter,n.leadingIcon=s.leadingIcon,n.trailingIcon=s.trailingIcon,n.inputFocusHandler=function(){n.activateFocus()},n.inputBlurHandler=function(){n.deactivateFocus()},n.inputInputHandler=function(){n.handleInput()},n.setPointerXOffset=function(t){n.setTransformOrigin(t)},n.textFieldInteractionHandler=function(){n.handleTextFieldInteraction()},n.validationAttributeChangeHandler=function(t){n.handleValidationAttributeChange(t)},n}return e(o,t),Object.defineProperty(o,"cssClasses",{get:function(){return Bo},enumerable:!1,configurable:!0}),Object.defineProperty(o,"strings",{get:function(){return Ho},enumerable:!1,configurable:!0}),Object.defineProperty(o,"numbers",{get:function(){return Wo},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldAlwaysFloat",{get:function(){var t=this.getNativeInput().type;return qo.indexOf(t)>=0},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldFloat",{get:function(){return this.shouldAlwaysFloat||this.isFocused||!!this.getValue()||this.isBadInput()},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"shouldShake",{get:function(){return!this.isFocused&&!this.isValid()&&!!this.getValue()},enumerable:!1,configurable:!0}),Object.defineProperty(o,"defaultAdapter",{get:function(){return{addClass:function(){},removeClass:function(){},hasClass:function(){return!0},setInputAttr:function(){},removeInputAttr:function(){},registerTextFieldInteractionHandler:function(){},deregisterTextFieldInteractionHandler:function(){},registerInputInteractionHandler:function(){},deregisterInputInteractionHandler:function(){},registerValidationAttributeChangeHandler:function(){return new MutationObserver(function(){})},deregisterValidationAttributeChangeHandler:function(){},getNativeInput:function(){return null},isFocused:function(){return!1},activateLineRipple:function(){},deactivateLineRipple:function(){},setLineRippleTransformOrigin:function(){},shakeLabel:function(){},floatLabel:function(){},setLabelRequired:function(){},hasLabel:function(){return!1},getLabelWidth:function(){return 0},hasOutline:function(){return!1},notchOutline:function(){},closeOutline:function(){}}},enumerable:!1,configurable:!0}),o.prototype.init=function(){var t,e,i,o;this.adapter.hasLabel()&&this.getNativeInput().required&&this.adapter.setLabelRequired(!0),this.adapter.isFocused()?this.inputFocusHandler():this.adapter.hasLabel()&&this.shouldFloat&&(this.notchOutline(!0),this.adapter.floatLabel(!0),this.styleFloating(!0)),this.adapter.registerInputInteractionHandler("focus",this.inputFocusHandler),this.adapter.registerInputInteractionHandler("blur",this.inputBlurHandler),this.adapter.registerInputInteractionHandler("input",this.inputInputHandler);try{for(var n=s(Go),a=n.next();!a.done;a=n.next()){var r=a.value;this.adapter.registerInputInteractionHandler(r,this.setPointerXOffset)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(e=n.return)&&e.call(n)}finally{if(t)throw t.error}}try{for(var l=s(Xo),c=l.next();!c.done;c=l.next()){r=c.value;this.adapter.registerTextFieldInteractionHandler(r,this.textFieldInteractionHandler)}}catch(t){i={error:t}}finally{try{c&&!c.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}this.validationObserver=this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler),this.setcharacterCounter(this.getValue().length)},o.prototype.destroy=function(){var t,e,i,o;this.adapter.deregisterInputInteractionHandler("focus",this.inputFocusHandler),this.adapter.deregisterInputInteractionHandler("blur",this.inputBlurHandler),this.adapter.deregisterInputInteractionHandler("input",this.inputInputHandler);try{for(var n=s(Go),a=n.next();!a.done;a=n.next()){var r=a.value;this.adapter.deregisterInputInteractionHandler(r,this.setPointerXOffset)}}catch(e){t={error:e}}finally{try{a&&!a.done&&(e=n.return)&&e.call(n)}finally{if(t)throw t.error}}try{for(var l=s(Xo),c=l.next();!c.done;c=l.next()){r=c.value;this.adapter.deregisterTextFieldInteractionHandler(r,this.textFieldInteractionHandler)}}catch(t){i={error:t}}finally{try{c&&!c.done&&(o=l.return)&&o.call(l)}finally{if(i)throw i.error}}this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver)},o.prototype.handleTextFieldInteraction=function(){var t=this.adapter.getNativeInput();t&&t.disabled||(this.receivedUserInput=!0)},o.prototype.handleValidationAttributeChange=function(t){var e=this;t.some(function(t){return jo.indexOf(t)>-1&&(e.styleValidity(!0),e.adapter.setLabelRequired(e.getNativeInput().required),!0)}),t.indexOf("maxlength")>-1&&this.setcharacterCounter(this.getValue().length)},o.prototype.notchOutline=function(t){if(this.adapter.hasOutline()&&this.adapter.hasLabel())if(t){var e=this.adapter.getLabelWidth()*Wo.LABEL_SCALE;this.adapter.notchOutline(e)}else this.adapter.closeOutline()},o.prototype.activateFocus=function(){this.isFocused=!0,this.styleFocused(this.isFocused),this.adapter.activateLineRipple(),this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.adapter.shakeLabel(this.shouldShake)),!this.helperText||!this.helperText.isPersistent()&&this.helperText.isValidation()&&this.valid||this.helperText.showToScreenReader()},o.prototype.setTransformOrigin=function(t){if(!this.isDisabled()&&!this.adapter.hasOutline()){var e=t.touches,i=e?e[0]:t,o=i.target.getBoundingClientRect(),s=i.clientX-o.left;this.adapter.setLineRippleTransformOrigin(s)}},o.prototype.handleInput=function(){this.autoCompleteFocus(),this.setcharacterCounter(this.getValue().length)},o.prototype.autoCompleteFocus=function(){this.receivedUserInput||this.activateFocus()},o.prototype.deactivateFocus=function(){this.isFocused=!1,this.adapter.deactivateLineRipple();var t=this.isValid();this.styleValidity(t),this.styleFocused(this.isFocused),this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.adapter.shakeLabel(this.shouldShake)),this.shouldFloat||(this.receivedUserInput=!1)},o.prototype.getValue=function(){return this.getNativeInput().value},o.prototype.setValue=function(t){if(this.getValue()!==t&&(this.getNativeInput().value=t),this.setcharacterCounter(t.length),this.validateOnValueChange){var e=this.isValid();this.styleValidity(e)}this.adapter.hasLabel()&&(this.notchOutline(this.shouldFloat),this.adapter.floatLabel(this.shouldFloat),this.styleFloating(this.shouldFloat),this.validateOnValueChange&&this.adapter.shakeLabel(this.shouldShake))},o.prototype.isValid=function(){return this.useNativeValidation?this.isNativeInputValid():this.valid},o.prototype.setValid=function(t){this.valid=t,this.styleValidity(t);var e=!t&&!this.isFocused&&!!this.getValue();this.adapter.hasLabel()&&this.adapter.shakeLabel(e)},o.prototype.setValidateOnValueChange=function(t){this.validateOnValueChange=t},o.prototype.getValidateOnValueChange=function(){return this.validateOnValueChange},o.prototype.setUseNativeValidation=function(t){this.useNativeValidation=t},o.prototype.isDisabled=function(){return this.getNativeInput().disabled},o.prototype.setDisabled=function(t){this.getNativeInput().disabled=t,this.styleDisabled(t)},o.prototype.setHelperTextContent=function(t){this.helperText&&this.helperText.setContent(t)},o.prototype.setLeadingIconAriaLabel=function(t){this.leadingIcon&&this.leadingIcon.setAriaLabel(t)},o.prototype.setLeadingIconContent=function(t){this.leadingIcon&&this.leadingIcon.setContent(t)},o.prototype.setTrailingIconAriaLabel=function(t){this.trailingIcon&&this.trailingIcon.setAriaLabel(t)},o.prototype.setTrailingIconContent=function(t){this.trailingIcon&&this.trailingIcon.setContent(t)},o.prototype.setcharacterCounter=function(t){if(this.characterCounter){var e=this.getNativeInput().maxLength;if(-1===e)throw new Error("MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.");this.characterCounter.setCounterValue(t,e)}},o.prototype.isBadInput=function(){return this.getNativeInput().validity.badInput||!1},o.prototype.isNativeInputValid=function(){return this.getNativeInput().validity.valid},o.prototype.styleValidity=function(t){var e=o.cssClasses.INVALID;if(t?this.adapter.removeClass(e):this.adapter.addClass(e),this.helperText){if(this.helperText.setValidity(t),!this.helperText.isValidation())return;var i=this.helperText.isVisible(),s=this.helperText.getId();i&&s?this.adapter.setInputAttr(Ho.ARIA_DESCRIBEDBY,s):this.adapter.removeInputAttr(Ho.ARIA_DESCRIBEDBY)}},o.prototype.styleFocused=function(t){var e=o.cssClasses.FOCUSED;t?this.adapter.addClass(e):this.adapter.removeClass(e)},o.prototype.styleDisabled=function(t){var e=o.cssClasses,i=e.DISABLED,s=e.INVALID;t?(this.adapter.addClass(i),this.adapter.removeClass(s)):this.adapter.removeClass(i),this.leadingIcon&&this.leadingIcon.setDisabled(t),this.trailingIcon&&this.trailingIcon.setDisabled(t)},o.prototype.styleFloating=function(t){var e=o.cssClasses.LABEL_FLOATING;t?this.adapter.addClass(e):this.adapter.removeClass(e)},o.prototype.getNativeInput=function(){return(this.adapter?this.adapter.getNativeInput():null)||{disabled:!1,maxLength:-1,required:!1,type:"input",validity:{badInput:!1,valid:!0},value:""}},o}(de),Ko=Yo;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Zo={},Qo=Qt(class extends Jt{constructor(t){if(super(t),t.type!==Kt&&t.type!==Xt&&t.type!==Zt)throw Error("The `live` directive is not allowed on child or event bindings");if(!(t=>void 0===t.strings)(t))throw Error("`live` bindings can only contain a single expression")}render(t){return t}update(t,[e]){if(e===H||e===B)return e;const i=t.element,o=t.name;if(t.type===Kt){if(e===i[o])return H}else if(t.type===Zt){if(!!e===i.hasAttribute(o))return H}else if(t.type===Xt&&i.getAttribute(o)===e+"")return H;return((t,e=Zo)=>{t._$AH=e;
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */})(t),e}}),Jo=["touchstart","touchmove","scroll","mousewheel"],ts=(t={})=>{const e={};for(const i in t)e[i]=t[i];return Object.assign({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1},e)};class es extends Ee{constructor(){super(...arguments),this.mdcFoundationClass=Ko,this.value="",this.type="text",this.placeholder="",this.label="",this.icon="",this.iconTrailing="",this.disabled=!1,this.required=!1,this.minLength=-1,this.maxLength=-1,this.outlined=!1,this.helper="",this.validateOnInitialRender=!1,this.validationMessage="",this.autoValidate=!1,this.pattern="",this.min="",this.max="",this.step=null,this.size=null,this.helperPersistent=!1,this.charCounter=!1,this.endAligned=!1,this.prefix="",this.suffix="",this.name="",this.readOnly=!1,this.autocapitalize="",this.outlineOpen=!1,this.outlineWidth=0,this.isUiValid=!0,this.focused=!1,this._validity=ts(),this.validityTransform=null}get validity(){return this._checkValidity(this.value),this._validity}get willValidate(){return this.formElement.willValidate}get selectionStart(){return this.formElement.selectionStart}get selectionEnd(){return this.formElement.selectionEnd}focus(){const t=new CustomEvent("focus");this.formElement.dispatchEvent(t),this.formElement.focus()}blur(){const t=new CustomEvent("blur");this.formElement.dispatchEvent(t),this.formElement.blur()}select(){this.formElement.select()}setSelectionRange(t,e,i){this.formElement.setSelectionRange(t,e,i)}update(t){t.has("autoValidate")&&this.mdcFoundation&&this.mdcFoundation.setValidateOnValueChange(this.autoValidate),t.has("value")&&"string"!=typeof this.value&&(this.value=`${this.value}`),super.update(t)}setFormData(t){this.name&&t.append(this.name,this.value)}render(){const t=this.charCounter&&-1!==this.maxLength,e=!!this.helper||!!this.validationMessage||t,i={"mdc-text-field--disabled":this.disabled,"mdc-text-field--no-label":!this.label,"mdc-text-field--filled":!this.outlined,"mdc-text-field--outlined":this.outlined,"mdc-text-field--with-leading-icon":this.icon,"mdc-text-field--with-trailing-icon":this.iconTrailing,"mdc-text-field--end-aligned":this.endAligned};return U`
      <label class="mdc-text-field ${ke(i)}">
        ${this.renderRipple()}
        ${this.outlined?this.renderOutline():this.renderLabel()}
        ${this.renderLeadingIcon()}
        ${this.renderPrefix()}
        ${this.renderInput(e)}
        ${this.renderSuffix()}
        ${this.renderTrailingIcon()}
        ${this.renderLineRipple()}
      </label>
      ${this.renderHelperText(e,t)}
    `}updated(t){t.has("value")&&void 0!==t.get("value")&&(this.mdcFoundation.setValue(this.value),this.autoValidate&&this.reportValidity())}renderRipple(){return this.outlined?"":U`
      <span class="mdc-text-field__ripple"></span>
    `}renderOutline(){return this.outlined?U`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`:""}renderLabel(){return this.label?U`
      <span
          .floatingLabelFoundation=${Ii(this.label)}
          id="label">${this.label}</span>
    `:""}renderLeadingIcon(){return this.icon?this.renderIcon(this.icon):""}renderTrailingIcon(){return this.iconTrailing?this.renderIcon(this.iconTrailing,!0):""}renderIcon(t,e=!1){return U`<i class="material-icons mdc-text-field__icon ${ke({"mdc-text-field__icon--leading":!e,"mdc-text-field__icon--trailing":e})}">${t}</i>`}renderPrefix(){return this.prefix?this.renderAffix(this.prefix):""}renderSuffix(){return this.suffix?this.renderAffix(this.suffix,!0):""}renderAffix(t,e=!1){return U`<span class="mdc-text-field__affix ${ke({"mdc-text-field__affix--prefix":!e,"mdc-text-field__affix--suffix":e})}">
        ${t}</span>`}renderInput(t){const e=-1===this.minLength?void 0:this.minLength,i=-1===this.maxLength?void 0:this.maxLength,o=this.autocapitalize?this.autocapitalize:void 0,s=this.validationMessage&&!this.isUiValid,n=this.label?"label":void 0,a=t?"helper-text":void 0,r=this.focused||this.helperPersistent||s?"helper-text":void 0;return U`
      <input
          aria-labelledby=${Gt(n)}
          aria-controls="${Gt(a)}"
          aria-describedby="${Gt(r)}"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${Qo(this.value)}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${Gt(e)}"
          maxlength="${Gt(i)}"
          pattern="${Gt(this.pattern?this.pattern:void 0)}"
          min="${Gt(""===this.min?void 0:this.min)}"
          max="${Gt(""===this.max?void 0:this.max)}"
          step="${Gt(null===this.step?void 0:this.step)}"
          size="${Gt(null===this.size?void 0:this.size)}"
          name="${Gt(""===this.name?void 0:this.name)}"
          inputmode="${Gt(this.inputMode)}"
          autocapitalize="${Gt(o)}"
          @input="${this.handleInputChange}"
          @focus="${this.onInputFocus}"
          @blur="${this.onInputBlur}">`}renderLineRipple(){return this.outlined?"":U`
      <span .lineRippleFoundation=${Oi()}></span>
    `}renderHelperText(t,e){const i=this.validationMessage&&!this.isUiValid,o={"mdc-text-field-helper-text--persistent":this.helperPersistent,"mdc-text-field-helper-text--validation-msg":i},s=this.focused||this.helperPersistent||i?void 0:"true",n=i?this.validationMessage:this.helper;return t?U`
      <div class="mdc-text-field-helper-line">
        <div id="helper-text"
             aria-hidden="${Gt(s)}"
             class="mdc-text-field-helper-text ${ke(o)}"
             >${n}</div>
        ${this.renderCharCounter(e)}
      </div>`:""}renderCharCounter(t){const e=Math.min(this.value.length,this.maxLength);return t?U`
      <span class="mdc-text-field-character-counter"
            >${e} / ${this.maxLength}</span>`:""}onInputFocus(){this.focused=!0}onInputBlur(){this.focused=!1,this.reportValidity()}checkValidity(){const t=this._checkValidity(this.value);if(!t){const t=new Event("invalid",{bubbles:!1,cancelable:!0});this.dispatchEvent(t)}return t}reportValidity(){const t=this.checkValidity();return this.mdcFoundation.setValid(t),this.isUiValid=t,t}_checkValidity(t){const e=this.formElement.validity;let i=ts(e);if(this.validityTransform){const e=this.validityTransform(t,i);i=Object.assign(Object.assign({},i),e),this.mdcFoundation.setUseNativeValidation(!1)}else this.mdcFoundation.setUseNativeValidation(!0);return this._validity=i,this._validity.valid}setCustomValidity(t){this.validationMessage=t,this.formElement.setCustomValidity(t)}handleInputChange(){this.value=this.formElement.value}createAdapter(){return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},this.getRootAdapterMethods()),this.getInputAdapterMethods()),this.getLabelAdapterMethods()),this.getLineRippleAdapterMethods()),this.getOutlineAdapterMethods())}getRootAdapterMethods(){return Object.assign({registerTextFieldInteractionHandler:(t,e)=>this.addEventListener(t,e),deregisterTextFieldInteractionHandler:(t,e)=>this.removeEventListener(t,e),registerValidationAttributeChangeHandler:t=>{const e=new MutationObserver(e=>{t((t=>t.map(t=>t.attributeName).filter(t=>t))(e))});return e.observe(this.formElement,{attributes:!0}),e},deregisterValidationAttributeChangeHandler:t=>t.disconnect()},_e(this.mdcRoot))}getInputAdapterMethods(){return{getNativeInput:()=>this.formElement,setInputAttr:()=>{},removeInputAttr:()=>{},isFocused:()=>!!this.shadowRoot&&this.shadowRoot.activeElement===this.formElement,registerInputInteractionHandler:(t,e)=>this.formElement.addEventListener(t,e,{passive:t in Jo}),deregisterInputInteractionHandler:(t,e)=>this.formElement.removeEventListener(t,e)}}getLabelAdapterMethods(){return{floatLabel:t=>this.labelElement&&this.labelElement.floatingLabelFoundation.float(t),getLabelWidth:()=>this.labelElement?this.labelElement.floatingLabelFoundation.getWidth():0,hasLabel:()=>Boolean(this.labelElement),shakeLabel:t=>this.labelElement&&this.labelElement.floatingLabelFoundation.shake(t),setLabelRequired:t=>{this.labelElement&&this.labelElement.floatingLabelFoundation.setRequired(t)}}}getLineRippleAdapterMethods(){return{activateLineRipple:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.activate()},deactivateLineRipple:()=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.deactivate()},setLineRippleTransformOrigin:t=>{this.lineRippleElement&&this.lineRippleElement.lineRippleFoundation.setRippleCenter(t)}}}async getUpdateComplete(){var t;const e=await super.getUpdateComplete();return await(null===(t=this.outlineElement)||void 0===t?void 0:t.updateComplete),e}firstUpdated(){var t;super.firstUpdated(),this.mdcFoundation.setValidateOnValueChange(this.autoValidate),this.validateOnInitialRender&&this.reportValidity(),null===(t=this.outlineElement)||void 0===t||t.updateComplete.then(()=>{var t;this.outlineWidth=(null===(t=this.labelElement)||void 0===t?void 0:t.floatingLabelFoundation.getWidth())||0})}getOutlineAdapterMethods(){return{closeOutline:()=>this.outlineElement&&(this.outlineOpen=!1),hasOutline:()=>Boolean(this.outlineElement),notchOutline:t=>{this.outlineElement&&!this.outlineOpen&&(this.outlineWidth=t,this.outlineOpen=!0)}}}async layout(){await this.updateComplete;const t=this.labelElement;if(!t)return void(this.outlineOpen=!1);const e=!!this.label&&!!this.value;if(t.floatingLabelFoundation.float(e),!this.outlined)return;this.outlineOpen=e,await this.updateComplete;const i=t.floatingLabelFoundation.getWidth();this.outlineOpen&&(this.outlineWidth=i,await this.updateComplete)}}o([Rt(".mdc-text-field")],es.prototype,"mdcRoot",void 0),o([Rt("input")],es.prototype,"formElement",void 0),o([Rt(".mdc-floating-label")],es.prototype,"labelElement",void 0),o([Rt(".mdc-line-ripple")],es.prototype,"lineRippleElement",void 0),o([Rt("mwc-notched-outline")],es.prototype,"outlineElement",void 0),o([Rt(".mdc-notched-outline__notch")],es.prototype,"notchElement",void 0),o([At({type:String})],es.prototype,"value",void 0),o([At({type:String})],es.prototype,"type",void 0),o([At({type:String})],es.prototype,"placeholder",void 0),o([At({type:String}),Ce(function(t,e){void 0!==e&&this.label!==e&&this.layout()})],es.prototype,"label",void 0),o([At({type:String})],es.prototype,"icon",void 0),o([At({type:String})],es.prototype,"iconTrailing",void 0),o([At({type:Boolean,reflect:!0})],es.prototype,"disabled",void 0),o([At({type:Boolean})],es.prototype,"required",void 0),o([At({type:Number})],es.prototype,"minLength",void 0),o([At({type:Number})],es.prototype,"maxLength",void 0),o([At({type:Boolean,reflect:!0}),Ce(function(t,e){void 0!==e&&this.outlined!==e&&this.layout()})],es.prototype,"outlined",void 0),o([At({type:String})],es.prototype,"helper",void 0),o([At({type:Boolean})],es.prototype,"validateOnInitialRender",void 0),o([At({type:String})],es.prototype,"validationMessage",void 0),o([At({type:Boolean})],es.prototype,"autoValidate",void 0),o([At({type:String})],es.prototype,"pattern",void 0),o([At({type:String})],es.prototype,"min",void 0),o([At({type:String})],es.prototype,"max",void 0),o([At({type:String})],es.prototype,"step",void 0),o([At({type:Number})],es.prototype,"size",void 0),o([At({type:Boolean})],es.prototype,"helperPersistent",void 0),o([At({type:Boolean})],es.prototype,"charCounter",void 0),o([At({type:Boolean})],es.prototype,"endAligned",void 0),o([At({type:String})],es.prototype,"prefix",void 0),o([At({type:String})],es.prototype,"suffix",void 0),o([At({type:String})],es.prototype,"name",void 0),o([At({type:String})],es.prototype,"inputMode",void 0),o([At({type:Boolean})],es.prototype,"readOnly",void 0),o([At({type:String})],es.prototype,"autocapitalize",void 0),o([Tt()],es.prototype,"outlineOpen",void 0),o([Tt()],es.prototype,"outlineWidth",void 0),o([Tt()],es.prototype,"isUiValid",void 0),o([Tt()],es.prototype,"focused",void 0),o([Ft({passive:!0})],es.prototype,"handleInputChange",null);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const is=ht`.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0, 0, 0, 0.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);width:100%;min-width:0;border:none;border-radius:0;background:none;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens: none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field__affix--prefix,.mdc-text-field__affix--prefix[dir=rtl]{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl]{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field__affix--suffix,.mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-text-field--filled:hover .mdc-text-field__ripple::before,.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:whitesmoke}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-text-field--filled .mdc-floating-label,.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens: none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-text-field--outlined{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined{padding-right:max(16px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px, var(--mdc-shape-small, 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-right:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::before,.mdc-text-field--outlined .mdc-text-field__ripple::after{content:none}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-10.25px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-10.25px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-24.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-24.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer,.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl]{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateX(1px) translateY(1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl]{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}[dir=rtl] .mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake,.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}[dir=rtl] .mdc-text-field--with-trailing-icon,.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0, 0, 0, 0.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl]{text-align:left}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix{direction:ltr}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading{order:1}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{order:2}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input{order:3}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{order:4}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing{order:5}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix{padding-right:12px}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}[dir=rtl] .mdc-text-field__icon--leading,.mdc-text-field__icon--leading[dir=rtl]{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0px;margin-right:0px}[dir=rtl] .mdc-text-field__icon--trailing,.mdc-text-field__icon--trailing[dir=rtl]{margin-left:0px;margin-right:0px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:none}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06);border-bottom-color:var(--mdc-text-field-disabled-line-color, rgba(0, 0, 0, 0.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field__input{direction:inherit}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon{color:var(--mdc-text-field-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}`,os={"mwc-textfield":class extends es{static get styles(){return is}},"mwc-notched-outline":class extends ko{static get styles(){return Ro}}};let ss=class extends Ct{constructor(){super(...arguments),this._subElementEditor=void 0,this._initialized=!1,this._config_version=8}setConfig(t){this._config=t;let e=!1;null===this._section_order?(this._config=Object.assign(Object.assign({},this._config),{section_order:ce}),e=!0):(this._config.section_order.forEach(t=>{var i,o;if(!ce.includes(t)){const s=null===(i=this._config)||void 0===i?void 0:i.section_order.indexOf(t);void 0!==s&&-1!==s&&(null===(o=this._config)||void 0===o||o.section_order.splice(s,1)),e=!0}}),ce.forEach(t=>{this._config&&!this._config.section_order.includes(t)&&(this._config.section_order.push(t),e=!0)})),e&&Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)}),this.loadCardHelpers()}sortObjectByKeys(t){return Object.keys(t).sort().reduce((e,i)=>(e[i]=t[i],e),{})}_configCleanup(){if(!this._config||!this.hass)return;let t=Object.assign({},this._config);t.static_icons&&(t.option_static_icons=t.static_icons,delete t.static_icons),t.time_format&&(t.option_time_format="12"===t.time_format?"12hour":"24hour",delete t.time_format),t.locale&&(t.option_locale=t.locale,delete t.locale),t.option_today_temperature_decimals&&(t.option_today_temperature_decimals=t.show_today_decimals,delete t.show_today_decimals),t.show_decimals_pressure&&(t.option_pressure_decimals=t.show_decimals_pressure,delete t.show_decimals_pressure),t.tooltips&&(t.option_tooltips=t.tooltips,delete t.tooltips),t.show_beaufort&&(t.option_show_beaufort=t.show_beaufort,delete t.show_beaufort),t.entity_daytime_high&&(t.Entity_forecast_max=t.entity_daytime_high,delete t.entity_daytime_high),t.entity_daytime_low&&(t.entity_forecast_min=t.entity_daytime_low,delete t.entity_daytime_low),t.entity_current_conditions&&(t.entity_forecast_icon=t.entity_current_conditions,delete t.entity_current_conditions),t.entity_current_text&&(t.entity_summary=t.entity_current_text,delete t.entity_current_text),t.entity_daily_summary&&(t.entity_extended=t.entity_daily_summary,delete t.entity_daily_summary),t.entity_forecast_high_temp_1&&(t.entity_forecast_max_1=t.entity_forecast_high_temp_1,delete t.entity_forecast_high_temp_1),t.entity_forecast_low_temp_1&&(t.entity_forecast_min_1=t.entity_forecast_low_temp_1,delete t.entity_forecast_low_temp_1),t.entity_possible_today&&(t.entity_pos=t.entity_possible_today,delete t.entity_possible_today),t.entity_fire_danger_summary&&(t.entity_fire_danger=t.entity_fire_danger_summary,delete t.entity_fire_danger_summary),t.show_decimals&&(t.option_show_overview_decimals=t.show_decimals,delete t.show_decimals),t.show_separator&&(t.option_show_overview_separator=t.show_separator,delete t.show_separator);for(const e of["slot_l1, slot_l2, slot_l3, slot_l4, slot_l5, slot_l6, slot_l7, slot_l8, slot_r1, slot_r2, slot_r3, slot_r4, slot_r5, slot_r6, slot_r7, slot_r8"])"daytime_high"===t[e]&&(t[e]="forecast_max"),"daytime_low"===t[e]&&(t[e]="forecast_min");const e=["type","card_config_version","section_order","show_section_overview","show_section_extended","show_section_slots","show_section_daily_forecast","overview_layout","text_card_title","text_card_title_2","entity_update_time","update_time_use_attr","update_time_name_attr","text_update_time_prefix","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","option_show_overview_decimals","option_show_overview_separator","entity_extended","extended_use_attr","extended_name_attr","slot_l1","slot_l2","slot_l3","slot_l4","slot_l5","slot_l6","slot_l7","slot_l8","slot_r1","slot_r2","slot_r3","slot_r4","slot_r5","slot_r6","slot_r7","slot_r8","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_next_label","entity_temp_following","entity_temp_following_label","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_todays_fire_danger","entity_todays_uv_forecast","custom1_label","custom1_value","custom1_icon","custom1_units","custom2_label","custom2_value","custom2_icon","custom2_units","custom3_label","custom3_value","custom3_icon","custom3_units","custom4_label","custom4_value","custom4_icon","custom4_units","entity_forecast_icon_1","entity_pop_1","entity_pos_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_extended_1","entity_fire_danger_1","daily_forecast_layout","daily_forecast_days","daily_extended_forecast_days","daily_extended_use_attr","daily_extended_name_attr","summary_1_use_attr","summary_1_name_attr","option_compact_slots","option_today_temperature_decimals","option_today_rainfall_decimals","option_forecast_decimals","option_show_current_day","option_show_temperature_chart","option_show_precipitation_chart","icon_pack","icon_pack_path","option_show_gust_in_wind","option_show_forecast_wind","option_show_forecast_pop","option_pressure_decimals","option_color_fire_danger","option_locale","option_static_icons","option_time_format","option_tooltips","old_daily_format","option_show_beaufort","weather_entity","tempformat","entity","tap_action","hold_action","double_tap_action","entity_possible_tomorrow","style","index","view_index"];for(const i in this._config)e.includes(i)||delete t[i];t=Object.assign(Object.assign({},t),{card_config_version:this._config_version}),this._config=t,Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}shouldUpdate(){return this._initialized||this._initialize(),!0}get _section_order(){var t;return(null===(t=this._config)||void 0===t?void 0:t.section_order)||null}get _text_card_title(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title)||""}get _text_card_title_2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title_2)||""}get _entity_update_time(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_update_time)||""}get _update_time_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.update_time_use_attr)}get _update_time_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.update_time_name_attr)||""}get _text_update_time_prefix(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_update_time_prefix)||""}get _overview_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.overview_layout)||""}get _entity_temperature(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temperature)||""}get _entity_apparent_temp(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_apparent_temp)||""}get _entity_forecast_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon)||""}get _entity_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary)||""}get _option_show_overview_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_decimals)}get _option_show_overview_separator(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_separator)}get _entity_extended(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended)||""}get _extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.extended_use_attr)}get _extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.extended_name_attr)||""}get _entity_todays_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_fire_danger)||""}get _entity_todays_uv_forecast(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_uv_forecast)||""}get _slot_l1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||""}get _slot_l2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l2)||""}get _slot_l3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l3)||""}get _slot_l4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l4)||""}get _slot_l5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l5)||""}get _slot_l6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l6)||""}get _slot_l7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l7)||""}get _slot_l8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l8)||""}get _slot_r1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r1)||""}get _slot_r2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r2)||""}get _slot_r3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r3)||""}get _slot_r4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r4)||""}get _slot_r5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r5)||""}get _slot_r6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r6)||""}get _slot_r7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r7)||""}get _slot_r8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r8)||""}get _entity_observed_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_max)||""}get _entity_observed_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_min)||""}get _entity_forecast_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max)||""}get _entity_forecast_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min)||""}get _entity_temp_next(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next)||""}get _entity_temp_next_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next_label)||""}get _entity_temp_following(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following)||""}get _entity_temp_following_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following_label)||""}get _entity_wind_bearing(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_bearing)||""}get _entity_wind_speed(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed)||""}get _entity_wind_gust(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust)||""}get _entity_wind_speed_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed_kt)||""}get _entity_wind_gust_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust_kt)||""}get _entity_visibility(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_visibility)||""}get _entity_sun(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_sun)||""}get _entity_moon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_moon)||""}get _entity_pop(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop)||""}get _entity_pos(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos)||""}get _entity_possible_tomorrow(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_possible_tomorrow)||""}get _entity_humidity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_humidity)||""}get _entity_pressure(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pressure)||""}get _entity_uv_alert_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_uv_alert_summary)||""}get _entity_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger)||""}get _entity_rainfall(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_rainfall)||""}get _custom1_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_value)||""}get _custom1_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_icon)||""}get _custom1_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_label)||""}get _custom1_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_units)||""}get _custom2_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_value)||""}get _custom2_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_icon)||""}get _custom2_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_label)||""}get _custom2_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_units)||""}get _custom3_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_value)||""}get _custom3_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_icon)||""}get _custom3_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_label)||""}get _custom3_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_units)||""}get _custom4_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_value)||""}get _custom4_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_icon)||""}get _custom4_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_label)||""}get _custom4_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_units)||""}get _daily_forecast_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_layout)||""}get _daily_forecast_days(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_days)||null}get _daily_extended_forecast_days(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.daily_extended_forecast_days)&&void 0!==e?e:null}get _entity_forecast_icon_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon_1)||""}get _weather_entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.weather_entity)||""}get _forecast_type(){var t;return(null===(t=this._config)||void 0===t?void 0:t.forecast_type)||""}get _entity_summary_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary_1)||""}get _entity_forecast_min_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min_1)||""}get _entity_forecast_max_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max_1)||""}get _entity_pop_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop_1)||""}get _entity_pos_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos_1)||""}get _entity_extended_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended_1)||""}get _entity_fire_danger_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger_1)||""}get _daily_extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.daily_extended_use_attr)}get _daily_extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_extended_name_attr)||""}get _tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.tap_action}get _hold_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.hold_action}get _double_tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.double_tap_action}get _summary_1_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.summary_1_use_attr)}get _summary_1_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.summary_1_name_attr)||""}get _option_today_temperature_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_temperature_decimals)}get _option_today_rainfall_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_rainfall_decimals)}get _option_forecast_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_forecast_decimals)}get _option_show_gust_in_wind(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_gust_in_wind)}get _icon_pack(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack)||"default"}get _icon_pack_path(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack_path)||""}get _option_show_forecast_wind(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_wind)}get _option_show_forecast_pop(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_pop)}get _option_show_current_day(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_current_day)}get _option_show_temperature_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_temperature_chart)}get _option_show_precipitation_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_precipitation_chart)}get _option_pressure_decimals(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_pressure_decimals)||null}get _option_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_color_fire_danger)}get _option_daily_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_daily_color_fire_danger)}get _option_tooltips(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_tooltips)}get _option_static_icons(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_static_icons)}get _option_time_format(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.option_time_format)&&void 0!==e?e:null}get _option_locale(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_locale)||""}get _optional_entities(){var t,e,i,o,s,n,a,r,l,c,d,h,u,p,m,_;const f=new Set;for(const g of[(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||"forecast_max",(null===(e=this._config)||void 0===e?void 0:e.slot_l2)||"forecast_min",(null===(i=this._config)||void 0===i?void 0:i.slot_l3)||"wind",(null===(o=this._config)||void 0===o?void 0:o.slot_l4)||"pressure",(null===(s=this._config)||void 0===s?void 0:s.slot_l5)||"sun_next",(null===(n=this._config)||void 0===n?void 0:n.slot_l6)||"remove",(null===(a=this._config)||void 0===a?void 0:a.slot_l7)||"remove",(null===(r=this._config)||void 0===r?void 0:r.slot_l8)||"remove",(null===(l=this._config)||void 0===l?void 0:l.slot_r1)||"popforecast",(null===(c=this._config)||void 0===c?void 0:c.slot_r2)||"humidity",(null===(d=this._config)||void 0===d?void 0:d.slot_r3)||"uv_summary",(null===(h=this._config)||void 0===h?void 0:h.slot_r4)||"fire_danger",(null===(u=this._config)||void 0===u?void 0:u.slot_r5)||"sun_following",(null===(p=this._config)||void 0===p?void 0:p.slot_r6)||"remove",(null===(m=this._config)||void 0===m?void 0:m.slot_r7)||"remove",(null===(_=this._config)||void 0===_?void 0:_.slot_r8)||"remove"])switch(g){case"observed_max":f.add("entity_observed_max");break;case"observed_min":f.add("entity_observed_min");break;case"forecast_max":f.add("entity_forecast_max");break;case"forecast_min":f.add("entity_forecast_min");break;case"temp_next":f.add("entity_temp_next").add("entity_temp_next_label");break;case"temp_following":f.add("entity_temp_following").add("entity_temp_following_label");break;case"temp_maximums":f.add("entity_forecast_max").add("entity_observed_max");break;case"temp_minimums":f.add("entity_forecast_min").add("entity_observed_min");break;case"wind":f.add("entity_wind_bearing").add("entity_wind_speed").add("entity_wind_gust");break;case"wind_kt":f.add("entity_wind_bearing").add("entity_wind_speed_kt").add("entity_wind_gust_kt");break;case"visibility":f.add("entity_visibility");break;case"sun_next":case"sun_following":f.add("entity_sun");break;case"moon":f.add("entity_moon");break;case"pop":f.add("entity_pop");break;case"popforecast":f.add("entity_pop").add("entity_pos");break;case"humidity":f.add("entity_humidity");break;case"pressure":f.add("entity_pressure");break;case"uv_summary":f.add("entity_uv_alert_summary");break;case"fire_danger":f.add("entity_fire_danger");break;case"possible_today":f.add("entity_pos");break;case"possible_tomorrow":f.add("entity_possible_tomorrow");break;case"rainfall":f.add("entity_rainfall");break;case"custom1":f.add("custom1");break;case"custom2":f.add("custom2");break;case"custom3":f.add("custom3");break;case"custom4":f.add("custom4")}const g=f.has("entity_observed_max")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_max"} .value=${this._entity_observed_max} .includeDomains=${["sensor"]}
          name="entity_observed_max" label=${this._t("entity_observed_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",v=f.has("entity_observed_min")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_min"} .value=${this._entity_observed_min} .includeDomains=${["sensor"]}
          name="entity_observed_min" label=${this._t("entity_observed_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",y=f.has("entity_forecast_max")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_max"} .value=${this._entity_forecast_max} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_max" label=${this._t("entity_forecast_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",b=f.has("entity_forecast_min")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_min"} .value=${this._entity_forecast_min} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_min" label=${this._t("entity_forecast_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",x=f.has("entity_temp_next")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next"} .value=${this._entity_temp_next} .includeDomains=${["sensor"]}
          name="entity_temp_next" label=${this._t("entity_temp_next")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",w=f.has("entity_temp_next_label")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next_label"} .value=${this._entity_temp_next_label} .includeDomains=${["sensor"]}
          name="entity_temp_next_label" label=${this._t("entity_temp_next_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",$=f.has("entity_temp_following")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following"} .value=${this._entity_temp_following} .includeDomains=${["sensor"]}
          name="entity_temp_following" label=${this._t("entity_temp_following")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",E=f.has("entity_temp_following_label")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following_label"} .value=${this._entity_temp_following_label} .includeDomains=${["sensor"]}
          name="entity_temp_following_label" label=${this._t("entity_temp_fol_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",C=f.has("entity_wind_bearing")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_bearing"} .value=${this._entity_wind_bearing} .includeDomains=${["sensor","weather"]}
          name="entity_wind_bearing" label=${this._t("entity_wind_bearing")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",k=f.has("entity_wind_speed")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed"} .value=${this._entity_wind_speed} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed" label=${this._t("entity_wind_speed")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",S=f.has("entity_wind_gust")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust"} .value=${this._entity_wind_gust} .includeDomains=${["sensor","weather"]}
          name="entity_wind_gust" label=${this._t("entity_wind_gust")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",I=f.has("entity_wind_speed_kt")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed_kt"} .value=${this._entity_wind_speed_kt} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed_kt" label=${this._t("entity_wind_speed_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",A=f.has("entity_wind_gust_kt")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust_kt"} .value=${this._entity_wind_gust_kt} .includeDomains=${["sensor"]}
          name="entity_wind_gust_kt" label=${this._t("entity_wind_gust_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",T=f.has("entity_visibility")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_visibility"} .value=${this._entity_visibility} .includeDomains=${["sensor","weather"]}
          name="entity_visibility" label=${this._t("entity_visibility")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",O=f.has("entity_sun")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_sun"} .value=${this._entity_sun} .includeDomains=${["sun","sensor"]}
          name="entity_sun" label=${this._t("entity_sun")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",F=f.has("entity_moon")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_moon"} .value=${this._entity_moon} .includeDomains=${["sensor"]}
          name="entity_moon" label=${this._t("entity_moon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",R=f.has("entity_pop")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pop"} .value=${this._entity_pop} .includeDomains=${["sensor","weather"]}
          name="entity_pop" label=${this._t("entity_pop")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",L=f.has("entity_pos")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pos"} .value=${this._entity_pos} .includeDomains=${["sensor","weather"]}
          name="entity_pos" label=${this._t("entity_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",N=f.has("entity_possible_tomorrow")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_possible_tomorrow"} .value=${this._entity_possible_tomorrow} .includeDomains=${["sensor","weather"]}
          name="entity_possible_tomorrow" label=${this._t("entity_2day_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",D=f.has("entity_humidity")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_humidity"} .value=${this._entity_humidity} .includeDomains=${["sensor","weather"]}
          name="entity_humidity" label=${this._t("entity_humidity")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",M=f.has("entity_pressure")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pressure"} .value=${this._entity_pressure} .includeDomains=${["sensor","weather"]}
          name="entity_pressure" label=${this._t("entity_pressure")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",P=f.has("entity_uv_alert_summary")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_uv_alert_summary"} .value=${this._entity_uv_alert_summary} .includeDomains=${["sensor"]}
          name="entity_uv_alert_summary" label=${this._t("entity_uv_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",V=f.has("entity_fire_danger")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_fire_danger"} .value=${this._entity_fire_danger} .includeDomains=${["sensor"]}
          name="entity_fire_danger" label=${this._t("entity_fire_danger")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",z=f.has("entity_rainfall")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_rainfall"} .value=${this._entity_rainfall} .includeDomains=${["sensor"]}
          name="entity_rainfall" label=${this._t("entity_rainfall")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",H=f.has("custom1")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"custom1_value"} .value=${this._custom1_value} .includeDomains=${["sensor"]}
          name="custom1_value" label=${this._t("custom1_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${"custom1_icon"} .value=${this._custom1_icon} name="custom1_icon"
            label=${this._t("custom1_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom1_units")} .value=${this._custom1_units} .configValue=${"custom1_units"} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom1_label")} .value=${this._custom1_label} .configValue=${"custom1_label"} @input=${this._valueChanged}>
        </ha-input>
      `:"",B=f.has("custom2")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"custom2_value"} .value=${this._custom2_value} .includeDomains=${["sensor"]}
          name="custom2_value" label=${this._t("custom2_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${"custom2_icon"} .value=${this._custom2_icon} name="custom2_icon"
            label=${this._t("custom2_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom2_units")} .value=${this._custom2_units} .configValue=${"custom2_units"} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom2_label")} .value=${this._custom2_label} .configValue=${"custom2_label"} @input=${this._valueChanged}>
        </ha-input>
      `:"",W=f.has("custom3")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"custom3_value"} .value=${this._custom3_value} .includeDomains=${["sensor"]}
          name="custom3_value" label=${this._t("custom3_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${"custom3_icon"} .value=${this._custom3_icon} name="custom3_icon"
            label=${this._t("custom3_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom3_units")} .value=${this._custom3_units} .configValue=${"custom3_units"} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom3_label")} .value=${this._custom3_label} .configValue=${"custom3_label"} @input=${this._valueChanged}>
        </ha-input>
      `:"",j=f.has("custom4")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"custom4_value"} .value=${this._custom4_value} .includeDomains=${["sensor"]}
          name="custom4_value" label=${this._t("custom4_value")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <div class="side-by-side">
          <ha-icon-picker .configValue=${"custom4_icon"} .value=${this._custom4_icon} name="custom4_icon"
            label=${this._t("custom4_icon")} @value-changed=${this._valueChanged}>
          </ha-icon-picker>
          <ha-input label=${this._t("custom4_units")} .value=${this._custom4_units} .configValue=${"custom4_units"} @input=${this._valueChanged}>
          </ha-input>
        </div>
        <ha-input label=${this._t("custom4_label")} .value=${this._custom4_label} .configValue=${"custom4_label"} @input=${this._valueChanged}>
        </ha-input>
      `:"";return U`
      ${g}
      ${v}
      ${y}
      ${b}
      ${x}
      ${w}
      ${$}
      ${E}
      ${C}
      ${k}
      ${S}
      ${I}
      ${A}
      ${T}
      ${O}
      ${F}
      ${R}
      ${L}
      ${N}
      ${D}
      ${M}
      ${P}
      ${V}
      ${z}
      ${H}
      ${B}
      ${W}
      ${j}`}get _show_warning(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_warning)||!1}get _show_error(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_error)||!1}async firstUpdated(){var t;this._config&&this.hass&&this._config.card_config_version!==this._config_version&&this._configCleanup(),customElements.get("ha-switch")&&(customElements.get("ha-input")||customElements.get("ha-textfield"))&&customElements.get("ha-entity-picker")||null===(t=customElements.get("hui-entities-card"))||void 0===t||t.getConfigElement()}_sectionOverviewEditor(){return U`
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_update_time"} .value=${this._entity_update_time} .includeDomains=${["sensor"]}
        name="entity_update_time" label=${this._t("entity_update_time")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""!==this._entity_update_time?U`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._update_time_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._update_time_use_attr?re:ae} .value=${"update_time_use_attr"} .checked=${!1!==this._update_time_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
        </div>
        ${""!==this._entity_update_time&&!0===this._update_time_use_attr?U`<ha-selector .hass=${this.hass} .entityId=${this._entity_update_time}
          .selector = ${{attribute:{entity_id:this._entity_update_time}}} .required=${!1}
          .configValue=${"update_time_name_attr"} .value=${this._update_time_name_attr} name="update_time_name_attr" label=${this._t("attribute")}
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-selector>`:U``}
      </div>`:U``}
      <ha-input label=${this._t("update_time_prefix")} .value=${this._text_update_time_prefix}
        .configValue=${"text_update_time_prefix"} @input=${this._valueChanged}>
      </ha-input>
      ${"forecast"!==this._overview_layout?U`<ha-entity-picker .hass=${this.hass} .configValue=${"entity_temperature"} .value=${this._entity_temperature} .includeDomains=${["sensor","weather"]}
          name="entity_temperature" label=${this._t("entity_temperature")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_apparent_temp"} .value=${this._entity_apparent_temp} .includeDomains=${["sensor","weather"]}
          name="entity_apparent_temp" label=${this._t("entity_apparent_temp")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>`:U``}
      ${"observations"!==this._overview_layout?U`<ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_icon"} .value=${this._entity_forecast_icon} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_icon" label=${this._t("entity_forecast_icon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>
          <ha-entity-picker .hass=${this.hass} .configValue=${"entity_summary"} .value=${this._entity_summary} .includeDomains=${["sensor","weather"]}
            name="entity_summary" label=${this._t("entity_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>`:U``}
    `}_optionOverviewEditor(){return U`
      <div class="side-by-side">
        <label class='mdc-label'>${this._t("overview_layout")}</label>
        <select class='ha-select-compat' .configValue=${"overview_layout"} .value=${this._overview_layout} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="complete">${this._t("opt_complete")}</option>
          <option value="observations">${this._t("opt_observations")}</option>
          <option value="forecast">${this._t("opt_forecast")}</option>
          <option value="title only">${this._t("opt_title_only")}</option>
        </select>
        <div></div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_overview_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_overview_decimals?re:ae} .value=${"option_show_overview_decimals"} .checked=${!1!==this._option_show_overview_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_temp_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_overview_separator?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_overview_separator?re:ae} .value=${"option_show_overview_separator"} .checked=${!1!==this._option_show_overview_separator} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_separator")}</span>
            </div>
        </div>
      </div>
    `}_sectionExtendedEditor(){return!0===this._extended_use_attr&&(void 0===this.hass||void 0===this.hass.states[this._entity_extended]||this.hass.states[this._entity_extended].attributes),U`
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_extended"} .value=${this._entity_extended} .includeDomains=${["sensor","weather"]}
        name="entity_extended" label=${this._t("entity_extended")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""!==this._entity_extended?U`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${!1!==this._extended_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._extended_use_attr?re:ae} .value=${"extended_use_attr"} .checked=${!1!==this._extended_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${""!==this._entity_extended&&!0===this._extended_use_attr?U`<ha-selector .hass=${this.hass} .entityId=${this._entity_extended}
            .selector = ${{attribute:{entity_id:this._entity_extended}}} .required=${!1}
            .configValue=${"extended_name_attr"} .value=${this._extended_name_attr} name="extended_name_attr" label=${this._t("attribute")}
            allow-custom-value
            @value-changed=${this._valueChangedPicker}>
          </ha-selector>`:U``}
        </div>`:U``}
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_todays_uv_forecast"} .value=${this._entity_todays_uv_forecast} .includeDomains=${["sensor"]}
        name="entity_todays_uv_forecast" label=${this._t("entity_uv_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_todays_fire_danger"} .value=${this._entity_todays_fire_danger} .includeDomains=${["sensor"]}
        name="entity_todays_fire_danger" label=${this._t("entity_fire_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
    `}_slotOptions(t){return U`${[["humidity","Current humidity"],["rainfall","Today's recorded rainfall"],["pressure","Current air pressure"],["wind","Current wind conditions"],["wind_gust","Current wind gust"],["wind_kt","Current wind conditions kts"],["visibility","Current visibility"],["observed_max","Today's observed max"],["observed_min","Today's observed min"],["forecast_max","Today's forecast max"],["forecast_min","Today's forecast min"],["temp_next","Next temp min/max"],["temp_following","Following temp min/max"],["temp_maximums","Observed/forecast max"],["temp_minimums","Observed/forecast min"],["sun_next","Next sun rise/set time"],["sun_following","Following sun rise/set time"],["moon","Moon phase"],["pop","Chance of rain"],["popforecast","Rainfall forecast"],["possible_today","Today's forecast rainfall"],["possible_tomorrow","Tomorrow's forecast rainfall"],["uv_summary","Today's uv forecast"],["fire_danger","Today's fire danger"],["custom1","Custom entity 1"],["custom2","Custom entity 2"],["custom3","Custom entity 3"],["custom4","Custom entity 4"],["empty","Blank slot"],["remove","Remove slot"]].map(([e,i])=>U`<option value="${e}" ?selected=${t===e}>${i}</option>`)}`}_sectionSlotsEditor(){return U`
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l1")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l1"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l1)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r1")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r1"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r1)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l2")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l2"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l2)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r2")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r2"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r2)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l3")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l3"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l3)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r3")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r3"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r3)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l4")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l4"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l4)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r4")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r4"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r4)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l5")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l5"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l5)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r5")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r5"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r5)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l6")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l6"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l6)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r6")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r6"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r6)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l7")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l7"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l7)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r7")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r7"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r7)}
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("slot_l8")}</label>
          <select class='ha-select-compat' .configValue=${"slot_l8"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_l8)}
          </select>
        </div>
        <div>
          <label class='mdc-label'>${this._t("slot_r8")}</label>
          <select class='ha-select-compat' .configValue=${"slot_r8"} @change=${this._valueChanged}>
            ${this._slotOptions(this._slot_r8)}
          </select>
        </div>
      </div>
      ${this._optional_entities}
    `}_optionSlotsEditor(){return U`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_today_temperature_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_today_temperature_decimals?re:ae} .value=${"option_today_temperature_decimals"} .checked=${!1!==this._option_today_temperature_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("today_temp_decimals")}</span>
            </div>
        </div>
        <label class='mdc-label'>${this._t("pressure_decimals")}</label>
        <select class='ha-select-compat' .configValue=${"option_pressure_decimals"} .value=${null!==this._option_pressure_decimals?String(this._option_pressure_decimals):""} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_today_rainfall_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_today_rainfall_decimals?re:ae} .value=${"option_today_rainfall_decimals"} .checked=${!1!==this._option_today_rainfall_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("today_rain_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_forecast_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_forecast_decimals?re:ae} .value=${"option_forecast_decimals"} .checked=${!1!==this._option_forecast_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_temp_decimals")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_forecast_pop?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_forecast_pop?re:ae} .value=${"option_show_forecast_pop"} .checked=${!1!==this._option_show_forecast_pop} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_pop")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!0===this._option_show_forecast_wind?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_forecast_wind?re:ae} .value=${"option_show_forecast_wind"} .checked=${!0===this._option_show_forecast_wind} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_wind")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_gust_in_wind?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_gust_in_wind?re:ae} .value=${"option_show_gust_in_wind"} .checked=${!1!==this._option_show_gust_in_wind} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_gust_in_wind")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_color_fire_danger?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_color_fire_danger?re:ae} .value=${"option_color_fire_danger"} .checked=${!1!==this._option_color_fire_danger} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>
      </div>
    `}_sectionDailyForecastEditor(){return!0===this._daily_extended_use_attr&&(void 0===this.hass||void 0===this.hass.states[this._entity_extended_1]||this.hass.states[this._entity_extended_1].attributes),U`
      <ha-entity-picker .hass=${this.hass} .configValue=${"weather_entity"} .value=${this._weather_entity} .includeDomains=${["weather"]}
        name="weather_entity" label=${this._t("weather_entity")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <label class='mdc-label'>${this._t("forecast_type")}</label>
      <select class='ha-select-compat' .configValue=${"forecast_type"} .value=${this._forecast_type} @change=${this._valueChanged}>
        <option value=""></option>
        <option value="daily">${this._t("opt_daily")}</option>
        <option value="hourly">${this._t("opt_hourly")}</option>
        <option value="twice_daily">${this._t("opt_twice_daily")}</option>
      </select>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_icon_1"} .value=${this._entity_forecast_icon_1} .includeDomains=${["sensor","weather"]}
        name="entity_forecast_icon_1" label=${this._t("entity_forecast_icon_1")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_summary_1"} .value=${this._entity_summary_1} .includeDomains=${["sensor","weather"]}
        name="entity_summary_1" label=${this._t("entity_summary_1")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""===this._entity_summary_1||this._entity_summary_1.match("^weather.")?U``:U`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${this._summary_1_use_attr?"eye-toggle active":"eye-toggle"} .path=${this._summary_1_use_attr?re:ae} .value=${"summary_1_use_attr"} .checked=${this._summary_1_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${this._summary_1_use_attr?U`
            <ha-selector .hass=${this.hass} .entityId=${this._entity_summary_1} .configValue=${"summary_1_name_attr"} .value=${this._summary_1_name_attr}
              .selector=${{attribute:{entity_id:this._entity_summary_1}}} .required=${!1}
              name="summary_1_name_attr" label=${this._t("attribute")} allow-custom-value
              @value-changed=${this._valueChangedPicker}>
            </ha-selector>`:U``}
        </div>`}
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_min_1"} .value=${this._entity_forecast_min_1} .includeDomains=${["sensor","weather"]}
        name="entity_forecast_min_1" label=${this._t("entity_forecast_min_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_max_1"} .value=${this._entity_forecast_max_1} .includeDomains=${["sensor","weather"]}
        name="entity_forecast_max_1" label=${this._t("entity_forecast_max_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pop_1"} .value=${this._entity_pop_1}  .includeDomains=${["sensor","weather"]}
        name="entity_pop_1" label=${this._t("entity_pop_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pos_1"} .value=${this._entity_pos_1}  .includeDomains=${["sensor","weather"]}
        name="entity_pos_1" label=${this._t("entity_pos_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${"vertical"===this._daily_forecast_layout?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_extended_1"} .value=${this._entity_extended_1} .includeDomains=${["sensor","weather"]}
          name="entity_extended_1" label=${this._t("entity_extended_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        ${""!==this._entity_extended_1?U`
          <div class="side-by-side">
            <div>
              <div class="toggle-row">
              <ha-icon-button class=${!1!==this._daily_extended_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._daily_extended_use_attr?re:ae} .value=${"daily_extended_use_attr"} .checked=${!1!==this._daily_extended_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
            </div>
            ${""!==this._entity_extended_1&&!0===this._daily_extended_use_attr?U`
              <ha-selector .hass=${this.hass} .entityId=${this._entity_extended_1} .configValue=${"daily_extended_name_attr"} .value=${this._daily_extended_name_attr} .includeDomains=${["sensor"]}
                .selector = ${{attribute:{entity_id:this._entity_extended_1}}} .required=${!1}
                name="daily_extended_name_attr" label=${this._t("attribute")} allow-custom-value @value-changed=${this._valueChangedPicker}>
              </ha-selector>`:U``}
          </div>`:U``}
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_fire_danger_1"} .value=${this._entity_fire_danger_1} .includeDomains=${["sensor"]}
          name="entity_fire_danger_1" label=${this._t("entity_fire_danger_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:""}
    `}_optionChartsEditor(){return U`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
            <ha-icon-button class=${!0===this._option_show_temperature_chart?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_temperature_chart?re:ae} .value=${"option_show_temperature_chart"} .checked=${!0===this._option_show_temperature_chart} @click=${this._toggleVisibility}></ha-icon-button>
            <span class="toggle-label">${this._t("show_temp_chart")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
            <ha-icon-button class=${!0===this._option_show_precipitation_chart?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_precipitation_chart?re:ae} .value=${"option_show_precipitation_chart"} .checked=${!0===this._option_show_precipitation_chart} @click=${this._toggleVisibility}></ha-icon-button>
            <span class="toggle-label">${this._t("show_precip_chart")}</span>
          </div>
        </div>
      </div>
    `}_optionDailyForecastEditor(){return U`
      <div class="side-by-side">
        <label class='mdc-label'>${this._t("daily_forecast_layout")}</label>
        <select class='ha-select-compat' .configValue=${"daily_forecast_layout"} .value=${this._daily_forecast_layout} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="horizontal">${this._t("opt_horizontal")}</option>
          <option value="vertical">${this._t("opt_vertical")}</option>
        </select>
        <div></div>
      </div>
      <div class="side-by-side">
        <label class='mdc-label'>${this._t("daily_forecast_days")}</label>
        <select class='ha-select-compat' .configValue=${"daily_forecast_days"} .value=${null!==this._daily_forecast_days?String(this._daily_forecast_days):""} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          ${"vertical"===this._daily_forecast_layout?U`
            <option value="6">6</option>
            <option value="7">7</option>`:U``}
        </select>
        ${"vertical"===this._daily_forecast_layout?U`<label class='mdc-label'>${this._t("daily_extended_days")}</label>
          <select class='ha-select-compat' .configValue=${"daily_extended_forecast_days"} @change=${this._valueChangedNumber}>
          <option value=""></option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>`:U`<div></div>`}
      </div>

        <div class="side-by-side">
          <div>
            ${"vertical"!==this._daily_forecast_layout?U`
              <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_tooltips?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_tooltips?re:ae} .value=${"option_tooltips"} .checked=${!1!==this._option_tooltips} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_tooltips")}</span>
            </div>`:U``}
          </div>
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${!0===this._option_show_current_day?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_current_day?re:ae} .value=${"option_show_current_day"} .checked=${!0===this._option_show_current_day} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("include_today")}</span>
            </div>
          </div>
        </div>

        <div class="side-by-side">
        ${"vertical"===this._daily_forecast_layout?U`<div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_daily_color_fire_danger?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_daily_color_fire_danger?re:ae} .value=${"option_daily_color_fire_danger"} .checked=${!1!==this._option_daily_color_fire_danger} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>`:U``}
        <div>
        </div>
      </div>
    `}_optionGlobalOptionsEditor(){var t,e,i,o;return U`
      <ha-input label=${this._t("card_title_1")} .value=${this._text_card_title} .configValue=${"text_card_title"}
        @input=${this._valueChanged}>
      </ha-input>
      <ha-input label=${this._t("card_title_2")} .value=${this._text_card_title_2} .configValue=${"text_card_title_2"}
        @input=${this._valueChanged}>
      </ha-input>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_static_icons?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_static_icons?re:ae} .value=${"option_static_icons"} .checked=${!1!==this._option_static_icons} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_static_icons")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)?"eye-toggle active":"eye-toggle"} .path=${(null===(e=this._config)||void 0===e?void 0:e.option_compact_slots)?re:ae} .value=${"option_compact_slots"} .checked=${!0===(null===(i=this._config)||void 0===i?void 0:i.option_compact_slots)} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("compact_slots")}</span>
            </div>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <label class='mdc-label'>${this._t("time_format")}</label>
        <select class='ha-select-compat' .configValue=${"option_time_format"} .value=${null!==(o=this._option_time_format)&&void 0!==o?o:""} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="system">${this._t("opt_system")}</option>
          <option value="12hour">${this._t("opt_12hour")}</option>
          <option value="24hour">${this._t("opt_24hour")}</option>
        </select>
        <label class='mdc-label'>${this._t("locale")}</label>
        <select class='ha-select-compat' .configValue=${"option_locale"} .value=${this._option_locale} @change=${this._valueChanged}>
          <option value="">${this._t("opt_locale_auto")}</option>
          <option value="bg">🇧🇬 Български</option>
          <option value="da">🇩🇰 Dansk</option>
          <option value="de">🇩🇪 Deutsch</option>
          <option value="en">🇬🇧 English</option>
          <option value="es">🇪🇸 Español</option>
          <option value="fr">🇫🇷 Français</option>
          <option value="he">🇮🇱 עברית</option>
          <option value="it">🇮🇹 Italiano</option>
          <option value="nl">🇳🇱 Nederlands</option>
          <option value="pl">🇵🇱 Polski</option>
          <option value="ru">🇷🇺 Русский</option>
          <option value="ua">🇺🇦 Українська</option>
        </select>
      </div>
      <div class="side-by-side">
        <div>
          <label class="label">${this._t("icon_pack")}</label>
          <select class='ha-select-compat' .configValue=${"icon_pack"} .value=${this._icon_pack} @change=${this._valueChanged}>
            <option value='default'>Default (built-in animated)</option>
            <option value='meteocons-fill'>Meteocons — Fill (CDN, basmilius)</option>
            <option value='meteocons-line'>Meteocons — Line (CDN, basmilius)</option>
            <option value='wcc-2'>ammap Weather Icons (requires weather-chart-card)</option>
            <option value='custom'>Custom path...</option>
          </select>
        </div>
        ${"custom"===this._icon_pack?U`
        <div>
          <ha-input .label=${this._t("icon_path")} .value=${this._icon_pack_path}
            .configValue=${"icon_pack_path"} @change=${this._valueChanged}>
          </ha-input>
          <div class="help-text">Use {condition} as placeholder — e.g. /local/icons/{condition}.svg</div>
        </div>`:U``}
      </div>
      <div class="help-text" style="padding: 8px 0 4px; font-weight: 500;">${this._t("actions")}</div>
      <hui-action-editor
        .label=${this._t("tap_action")}
        .hass=${this.hass}
        .config=${this._tap_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${t=>this._valueChangedAction("tap_action",t)}>
      </hui-action-editor>
      <hui-action-editor
        .label=${this._t("hold_action")}
        .hass=${this.hass}
        .config=${this._hold_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${t=>this._valueChangedAction("hold_action",t)}>
      </hui-action-editor>
      <hui-action-editor
        .label=${this._t("double_tap_action")}
        .hass=${this.hass}
        .config=${this._double_tap_action}
        .actions=${["more-info","toggle","navigate","url","call-service","assist","none"]}
        @value-changed=${t=>this._valueChangedAction("double_tap_action",t)}>
      </hui-action-editor>
    `}_renderSubElementEditor(){const t=[U`
        <div class="header">
          <div class="back-title">
            <mwc-icon-button @click=${this._goBack}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </mwc-icon-button>
          </div>
        </div>
      `];switch(this._subElementEditor){case"section_overview":t.push(this._sectionOverviewEditor());break;case"option_overview":t.push(this._optionOverviewEditor());break;case"section_extended":t.push(this._sectionExtendedEditor());break;case"section_slots":t.push(this._sectionSlotsEditor());break;case"option_slots":t.push(this._optionSlotsEditor());break;case"section_daily_forecast":t.push(this._sectionDailyForecastEditor());break;case"option_daily_forecast":t.push(this._optionDailyForecastEditor());break;case"option_charts":t.push(this._optionChartsEditor());break;case"option_global_options":t.push(this._optionGlobalOptionsEditor())}return U`${t}`}_goBack(){this._subElementEditor=void 0}get _show_section_overview(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_overview)}get _show_section_extended(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_extended)}get _show_section_slots(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_slots)}get _show_section_daily_forecast(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)}get _show_section_charts(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_charts)}getConfigBlock(t,e,i){switch(t){case"overview":return U`
          <div class="section-flex edit-overview-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_overview?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_overview?re:ae} .value=${"show_section_overview"} .checked=${!1!==this._show_section_overview} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:eye-outline"></ha-icon>
              <span class="section-title">${this._t("overview_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"overview"} .path=${se} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"overview"} .path=${ne} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_overview"} .path=${le} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="option-icon" .value=${"option_overview"} .path=${oe} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"extended":return U`
          <div class="section-flex edit-extended-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_extended?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_extended?re:ae} .value=${"show_section_extended"} .checked=${!1!==this._show_section_extended} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:text-box-outline"></ha-icon>
              <span class="section-title">${this._t("extended_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"extended"} .path=${se} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"extended"} .path=${ne} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_extended"} .path=${le} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;case"slots":return U`
          <div class="section-flex edit-slots-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_slots?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_slots?re:ae} .value=${"show_section_slots"} .checked=${!1!==this._show_section_slots} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:view-grid-outline"></ha-icon>
              <span class="section-title">${this._t("slots_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"slots"} .path=${se} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"slots"} .path=${ne} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_slots"} .path=${le} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_slots"} .path=${oe} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"daily_forecast":return U`
          <div class="section-flex edit-daily-forecast-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_daily_forecast?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_daily_forecast?re:ae} .value=${"show_section_daily_forecast"} .checked=${!1!==this._show_section_daily_forecast} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:calendar-week"></ha-icon>
              <span class="section-title">${this._t("daily_forecast_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"daily_forecast"} .path=${se} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"daily_forecast"} .path=${ne} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_daily_forecast"} .path=${le} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_daily_forecast"} .path=${oe} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"charts":return U`
          <div class="section-flex edit-charts-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_charts?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_charts?re:ae} .value=${"show_section_charts"} .checked=${!1!==this._show_section_charts} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:chart-line"></ha-icon>
              <span class="section-title">${this._t("charts_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"charts"} .path=${se} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"charts"} .path=${ne} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <div class="no-icon"></div>
              <ha-icon-button class="option-icon" .value=${"option_charts"} .path=${oe} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"global_options":return U`
          <div class="section-flex">
            <div class="section-label">
              <div class="visibility-spacer"></div>
              <ha-icon class="section-icon" icon="mdi:cog"></ha-icon>
              <span class="section-title">${this._t("global_options")}</span>
            </div>
            <div>
              <div class="no-icon"></div>
              <ha-icon-button class="edit-icon" .value=${"option_global_options"} .path=${oe} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `}return U``}render(){if(!this.hass||!this._helpers)return U``;if(this._subElementEditor)return this._renderSubElementEditor();const t=[],e=this._section_order||[];return t.push(this.getConfigBlock("global_options",!1,!1)),e.forEach((i,o)=>{t.push(this.getConfigBlock(i,0===o,o+1===e.length))}),U`${t}`}_t(t){var e,i;const o=((null===(e=this.hass)||void 0===e?void 0:e.language)||"en").split("-")[0].toLowerCase(),s=this.constructor._translations;return s[o]&&s[o][t]?s[o][t]:null!==(i=s.en[t])&&void 0!==i?i:t}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_valueChangedPicker(t){if(!this._config||!this.hass)return;const e=t.target,i=t.detail.value;this[`_${e.configValue}`]!==i&&(e.configValue&&(i?this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:i}):(this._config=Object.assign({},this._config),delete this._config[e.configValue])),Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_valueChangedAction(t,e){const i=e.detail.value;null!=i&&(this._config=Object.assign(Object.assign({},this._config),{[t]:i}),Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_editSubmenu(t){if(t.currentTarget){const e=t.currentTarget;this._subElementEditor=e.value}}_moveUp(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t-1]]=[this._config.section_order[t-1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_moveDown(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t+1]]=[this._config.section_order[t+1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_toggleVisibility(t){const e=t.currentTarget,i=e.value,o=e.classList.contains("active");this._config=Object.assign(Object.assign({},this._config),{[i]:!o}),Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}_valueChanged(t){var e;if(!this._config||!this.hass)return;const i=t.target,o=void 0!==(null===(e=t.detail)||void 0===e?void 0:e.value)?t.detail.value:void 0!==i.checked?i.checked:i.value;if(this[`_${i.configValue}`]!==o){if(i.configValue)if(""===o){const t=Object.assign({},this._config);delete t[i.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[i.configValue]:o});Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_valueChangedNumber(t){if(!this._config||!this.hass)return;const e=t.target;this[`_${e.configValue}`]!==e.value&&(e.configValue&&(""===e.value||null===e.value?delete this._config[e.configValue]:this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:Number(e.value)})),Ut(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}};ss.elementDefinitions=Object.assign(Object.assign(Object.assign(Object.assign({"ha-card":customElements.get("ha-card")},os),Lo),Uo),Ae),ss._translations={en:{global_options:"Global Options",overview_section:"Overview Section",extended_section:"Extended Section",slots_section:"Slots Section",daily_forecast_section:"Daily Forecast Section",compact_slots:"Compact slot labels",show_static_icons:"Show Static Icons",time_format:"Time Format",locale:"Locale",icon_pack:"Icon Pack",opt_locale_auto:"Auto (browser)",compact_slots:"Libellés compacts",actions:"Actions",tap_action:"Tap Action",hold_action:"Hold Action",double_tap_action:"Double-tap Action",icon_pack_default:"Default (built-in animated)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (requires weather-chart-card)",icon_pack_custom:"Custom path...",icon_path:"Icon path",icon_path_hint:"Use {condition} as placeholder — e.g. /local/icons/{condition}.svg",overview_layout:"Overview Layout",card_title_1:"Card Title Text Line 1",card_title_2:"Card Title Text Line 2",entity_temperature:"Entity Current Temperature",entity_apparent_temp:"Entity Apparent Temperature",entity_forecast_icon:"Entity Forecast Icon",entity_forecast_icon_1:"Entity Forecast Icon 1",entity_summary:"Entity Forecast Summary",entity_summary_1:"Entity Forecast Summary 1",entity_extended:"Entity Extended Forecast",entity_extended_1:"Entity Extended Forecast 1",use_attribute:"Use Attribute",attribute:"Attribute",slot_l1:"Slot Left 1",slot_l2:"Slot Left 2",slot_l3:"Slot Left 3",slot_l4:"Slot Left 4",slot_l5:"Slot Left 5",slot_l6:"Slot Left 6",slot_l7:"Slot Left 7",slot_l8:"Slot Left 8",slot_r1:"Slot Right 1",slot_r2:"Slot Right 2",slot_r3:"Slot Right 3",slot_r4:"Slot Right 4",slot_r5:"Slot Right 5",slot_r6:"Slot Right 6",slot_r7:"Slot Right 7",slot_r8:"Slot Right 8",today_temp_decimals:"Todays Temperature Decimals",today_rain_decimals:"Todays Rainfall Decimals",forecast_temp_decimals:"Forecast Temperature Decimals",pressure_decimals:"Pressure Decimals",show_separator:"Show separator",show_temp_decimals:"Show temperature decimals",entity_humidity:"Humidity",entity_pressure:"Atmospheric Pressure",entity_pop:"Chance of Rain",entity_pos:"Possible Rain Today",entity_2day_pos:"Possible Rain Tomorrow",entity_rainfall:"Todays Rain",entity_fire_danger:"Fire Danger",entity_uv_summary:"UV Alert Summary",entity_sun:"Entity Sun",entity_moon:"Moon Phase Entity",entity_visibility:"Entity Visibility",entity_wind_speed:"Entity Wind Speed",entity_wind_bearing:"Entity Wind Bearing",entity_wind_gust:"Entity Wind Gust",entity_wind_speed_kt:"Entity Wind Speed Kt",entity_wind_gust_kt:"Entity Wind Gust Kt",entity_update_time:"Entity Update Time",update_time_prefix:"Update Time Prefix",entity_uv_today:"Entity Today's UV Forecast",entity_fire_today:"Entity Today's Fire Danger",entity_observed_max:"Entity Observed Max",entity_observed_min:"Entity Observed Min",entity_forecast_max:"Entity Forecast Max",entity_forecast_max_1:"Entity Forecast Max 1",entity_forecast_min:"Entity Forecast Min",entity_forecast_min_1:"Entity Forecast Min 1",entity_temp_next:"Entity Temp Next",entity_temp_next_label:"Entity Temp Next Label",entity_temp_following:"Entity Temp Following",entity_temp_fol_label:"Entity Temp Following Label",entity_fire_danger_1:"Entity Fire Danger 1",entity_pop_1:"Entity Forecast Chance of Rain 1",entity_pos_1:"Entity Forecast Possible Rain 1",custom1_value:"Custom 1 Value",custom2_value:"Custom 2 Value",custom3_value:"Custom 3 Value",custom4_value:"Custom 4 Value",custom1_icon:"Custom 1 Icon",custom2_icon:"Custom 2 Icon",custom3_icon:"Custom 3 Icon",custom4_icon:"Custom 4 Icon",custom1_units:"Custom 1 Units",custom2_units:"Custom 2 Units",custom3_units:"Custom 3 Units",custom4_units:"Custom 4 Units",custom1_label:"Custom 1 Label (optional)",custom2_label:"Custom 2 Label (optional)",custom3_label:"Custom 3 Label (optional)",custom4_label:"Custom 4 Label (optional)",weather_entity:"Weather Entity with Forecasts",forecast_type:"Forecast Type",daily_forecast_layout:"Daily Forecast Layout",daily_forecast_days:"Daily Forecast Days",daily_extended_days:"Daily Extended Days",show_forecast_pop:"Show Precipitation Probability in Forecast",show_forecast_wind:"Show Wind in Forecast",show_gust_in_wind:"Show Gust in Wind Slot",colour_fire_danger:"Colour Fire Danger",include_today:"Include Today in Forecast",show_temp_chart:"Show Temperature Chart",show_precip_chart:"Show Precipitation Chart",forecast_tooltips:"Enable forecast tooltips",charts_section:"Charts Section",opt_daily:"Daily",opt_hourly:"Hourly",opt_twice_daily:"Twice Daily",opt_horizontal:"Horizontal",opt_vertical:"Vertical",opt_complete:"Complete",opt_observations:"Observations",opt_forecast:"Forecast",opt_title_only:"Title only",opt_system:"System",opt_12hour:"12 hour",opt_24hour:"24 hour"},bg:{global_options:"Глобални настройки",overview_section:"Секция Преглед",extended_section:"Разширена секция",slots_section:"Секция Слотове",daily_forecast_section:"Секция Прогноза",compact_slots:"Компактни надписи",show_static_icons:"Статични икони",time_format:"Формат на часа",locale:"Език",icon_pack:"Пакет с икони",opt_locale_auto:"Автоматично (браузър)",compact_slots:"Компактные подписи",actions:"Действия",tap_action:"Действие при натискане",hold_action:"Действие при задържане",double_tap_action:"Двойно натискане",icon_pack_default:"По подразбиране (вградени анимирани)",icon_pack_met_fill:"Meteocons — Запълнен (CDN)",icon_pack_met_line:"Meteocons — Линеен (CDN)",icon_pack_ammap:"ammap икони (изисква weather-chart-card)",icon_pack_custom:"Персонализиран път...",icon_path:"Път до икона",icon_path_hint:"Използвай {condition} като плейсхолър",overview_layout:"Оформление на преглед",card_title_1:"Заглавие ред 1",card_title_2:"Заглавие ред 2",entity_temperature:"Текуща температура",entity_apparent_temp:"Усещана температура",entity_forecast_icon:"Икона прогноза",entity_forecast_icon_1:"Икона прогноза 1",entity_summary:"Резюме прогноза",entity_summary_1:"Резюме прогноза 1",entity_extended:"Разширена прогноза",entity_extended_1:"Разширена прогноза 1",use_attribute:"Използвай атрибут",attribute:"Атрибут",slot_l1:"Слот Ляво 1",slot_l2:"Слот Ляво 2",slot_l3:"Слот Ляво 3",slot_l4:"Слот Ляво 4",slot_l5:"Слот Ляво 5",slot_l6:"Слот Ляво 6",slot_l7:"Слот Ляво 7",slot_l8:"Слот Ляво 8",slot_r1:"Слот Дясно 1",slot_r2:"Слот Дясно 2",slot_r3:"Слот Дясно 3",slot_r4:"Слот Дясно 4",slot_r5:"Слот Дясно 5",slot_r6:"Слот Дясно 6",slot_r7:"Слот Дясно 7",slot_r8:"Слот Дясно 8",today_temp_decimals:"Десетични за текуща темп.",today_rain_decimals:"Десетични за валежи",forecast_temp_decimals:"Десетични за прогнозна темп.",pressure_decimals:"Десетични за налягане",show_separator:"Показвай разделител",show_temp_decimals:"Показвай десетични",entity_humidity:"Влажност",entity_pressure:"Атмосферно налягане",entity_pop:"Вероятност за дъжд",entity_pos:"Възможен дъжд днес",entity_2day_pos:"Възможен дъжд утре",entity_rainfall:"Дъжд днес",entity_fire_danger:"Опасност от пожар",entity_uv_summary:"UV сигнал",entity_sun:"Слънце",entity_moon:"Фаза на луната",entity_visibility:"Видимост",entity_wind_speed:"Скорост на вятъра",entity_wind_bearing:"Посока на вятъра",entity_wind_gust:"Пориви",entity_wind_speed_kt:"Скорост (kn)",entity_wind_gust_kt:"Пориви (kn)",entity_update_time:"Час на обновяване",update_time_prefix:"Префикс за час",entity_uv_today:"UV прогноза (днес)",entity_fire_today:"Опасност от пожар (днес)",entity_observed_max:"Макс. наблюдавана",entity_observed_min:"Мин. наблюдавана",entity_forecast_max:"Макс. прогноза",entity_forecast_max_1:"Макс. прогноза 1",entity_forecast_min:"Мин. прогноза",entity_forecast_min_1:"Мин. прогноза 1",entity_temp_next:"Следваща темп.",entity_temp_next_label:"Етикет следваща темп.",entity_temp_following:"Трета темп.",entity_temp_fol_label:"Етикет трета темп.",entity_fire_danger_1:"Опасност от пожар 1",entity_pop_1:"Вероятност за дъжд 1",entity_pos_1:"Възможни валежи 1",custom1_value:"Перс. 1 стойност",custom2_value:"Перс. 2 стойност",custom3_value:"Перс. 3 стойност",custom4_value:"Перс. 4 стойност",custom1_icon:"Перс. 1 икона",custom2_icon:"Перс. 2 икона",custom3_icon:"Перс. 3 икона",custom4_icon:"Перс. 4 икона",custom1_units:"Перс. 1 единица",custom2_units:"Перс. 2 единица",custom3_units:"Перс. 3 единица",custom4_units:"Перс. 4 единица",custom1_label:"Перс. 1 етикет",custom2_label:"Перс. 2 етикет",custom3_label:"Перс. 3 етикет",custom4_label:"Перс. 4 етикет",weather_entity:"Ентити за прогноза",forecast_type:"Тип прогноза",daily_forecast_layout:"Оформление на прогнозата",daily_forecast_days:"Дни в прогнозата",daily_extended_days:"Дни разширена прогноза",show_forecast_pop:"Вероятност за валежи в прогнозата",show_forecast_wind:"Вятър в прогнозата",show_gust_in_wind:"Пориви в слота за вятър",colour_fire_danger:"Оцветяване — опасност от пожар",include_today:"Включи днес в прогнозата",show_temp_chart:"Покажи температурен чарт",show_precip_chart:"Покажи чарт за валежи",forecast_tooltips:"Tooltip-ове в прогнозата",charts_section:"Секция Чартове",opt_daily:"Дневна",opt_hourly:"Почасова",opt_twice_daily:"Два пъти дневно",opt_horizontal:"Хоризонтална",opt_vertical:"Вертикална",opt_complete:"Пълно",opt_observations:"Наблюдения",opt_forecast:"Прогноза",opt_title_only:"Само заглавие",opt_system:"Системен",opt_12hour:"12-часов",opt_24hour:"24-часов"},da:{compact_slots:"Kompakte etiketter",actions:"Handlinger",tap_action:"Tryk-handling",hold_action:"Hold-handling",double_tap_action:"Dobbelttryk-handling"},de:{compact_slots:"Kompakte Beschriftungen",actions:"Aktionen",tap_action:"Tipp-Aktion",hold_action:"Halte-Aktion",double_tap_action:"Doppeltipp-Aktion"},es:{compact_slots:"Etiquetas compactas",actions:"Acciones",tap_action:"Acción al tocar",hold_action:"Acción al mantener",double_tap_action:"Doble toque"},fr:{actions:"Actions",tap_action:"Action au toucher",hold_action:"Action maintenue",double_tap_action:"Double toucher"},he:{compact_slots:"תוויות קומפקטיות",actions:"פעולות",tap_action:"פעולה בלחיצה",hold_action:"פעולה בלחיצה ממושכת",double_tap_action:"פעולה בלחיצה כפולה"},it:{compact_slots:"Etichette compatte",actions:"Azioni",tap_action:"Azione al tocco",hold_action:"Azione prolungata",double_tap_action:"Doppio tocco"},nl:{compact_slots:"Compacte labels",actions:"Acties",tap_action:"Tik-actie",hold_action:"Vasthoudactie",double_tap_action:"Dubbele tik-actie"},pl:{compact_slots:"Kompaktowe etykiety",actions:"Akcje",tap_action:"Akcja dotknięcia",hold_action:"Akcja przytrzymania",double_tap_action:"Podwójne dotknięcie"},ru:{actions:"Действия",tap_action:"Действие при нажатии",hold_action:"Действие при удержании",double_tap_action:"Двойное нажатие"},ua:{compact_slots:"Компактні підписи",actions:"Дії",tap_action:"Дія при дотику",hold_action:"Дія при утриманні",double_tap_action:"Подвійний дотик"}},ss.styles=ht`
    :host {
      display: block;
              /* --mdc-menu-min-width: var(--parentWidth); */
      --mdc-menu-item-height: 36px;
      --mdc-typography-subtitle1-font-size: 13px;
    }
    .ha-select-compat {
      display: block;
      width: 100%;
      padding: 8px;
      font-size: 14px;
      font-family: inherit;
      border: 1px solid var(--divider-color, #e0e0e0);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      cursor: pointer;
      box-sizing: border-box;
    }
    .ha-select-compat:focus {
      outline: none;
      border-color: var(--primary-color, #03a9f4);
    }
    label.mdc-label {
      display: block;
      font-size: 12px;
      color: var(--secondary-text-color, #727272);
      margin-top: 8px;
      margin-bottom: 2px;
    }
    ha-input {
      display: block;
    }
    ha-switch {
      --ha-switch-checked-background-color: var(--primary-color);
      --ha-switch-checked-thumb-background-color: var(--primary-text-color);
    }
    ha-formfield {
      height: 56px;
    }
    .no-icon {
      display: inline-flex;
      width: var(--mds-icon-button-size, 48px);
    }
    /* .option {
      cursor: pointer;
    } */
    /* .row {
      display: flex;
      margin-bottom: -14px;
      pointer-events: none;
    } */
    /* .title {
      padding-left: 16px;
      margin-top: -6px;
      pointer-events: none;
    } */
    /* .secondary {
      padding-left: 40px;
      color: var(--secondary-text-color);
      pointer-events: none;
    } */
    /* .values {
      padding-left: 16px;
      background: var(--secondary-background-color);
    } */
    .section-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-label {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .visibility-spacer {
      width: 32px;
      flex-shrink: 0;
    }
    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--primary-text-color);
      margin-left: 2px;
    }
    .section-icon {
      --mdc-icon-size: 20px;
      color: var(--secondary-text-color);
      opacity: 0.9;
      flex-shrink: 0;
      margin-right: 2px;
    }
    .toggle-row {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .toggle-label {
      font-size: 13px;
      color: var(--primary-text-color);
    }
    .visibility-toggle {
      --mdc-icon-button-size: 32px;
      --mdc-icon-size: 18px;
      color: var(--disabled-color, #9e9e9e);
      opacity: 0.6;
    }
    .visibility-toggle.active {
      color: var(--primary-color);
      opacity: 1;
    }
    .side-by-side {
      display: flex;
    }
    .side-by-side > * {
      flex: 1;
    }
    .side-by-side :not(:last-child) {
      padding-right: 4px;
    }
    .icon-side-by-side {
      display: flex;
    }
    .icon-condition {
      flex-grow: 1;
    }
    .no-switch {
      padding-left: 48px;
    }
    .condition_icon {
      position: relative;
    }
    .condition_icon .condition_icon_big {
      visibility: hidden;
      width: 96px;
      background-color: var(--card-background-color);
      border-radius: 6px;
      border-style: solid;
      border-width: 2px;
      /* Position the tooltip */
      position: absolute;
      z-index: 1;
      bottom: -50%;
      left: 60%;
      -webkit-transform: translateX(0%); /* Safari iOS */
      transform: translateX(-40%);
    }
    .condition_icon .condition_icon_big:after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
      }
    .condition_icon:hover .condition_icon_big {
      visibility: visible
    }
  `,o([At({attribute:!1})],ss.prototype,"hass",void 0),o([Tt()],ss.prototype,"_config",void 0),o([Tt()],ss.prototype,"_helpers",void 0),o([Tt()],ss.prototype,"_subElementEditor",void 0),ss=o([St("platinum-weather-card-plus-charts-editor")],ss);var ns=Object.freeze({__proto__:null,get WeatherCardEditor(){return ss}});export{ie as PlatinumWeatherCard};
