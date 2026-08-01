function t(t,e,i,s){var o,n=arguments.length,a=n<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,i,s);else for(var r=t.length-1;r>=0;r--)(o=t[r])&&(a=(n<3?o(a):n>3?o(e,i,a):o(e,i))||a);return n>3&&a&&Object.defineProperty(e,i,a),a}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}}const a=t=>new n("string"==typeof t?t:t+"",void 0,s),r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(i,t,s)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return a(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var c;const _=window,d=_.trustedTypes,h=d?d.emptyScript:"",u=_.reactiveElementPolyfillSupport,p={toAttribute(t,e){switch(e){case Boolean:t=t?h:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},m=(t,e)=>e!==t&&(e==e||t==t),g={attribute:!0,type:String,converter:p,reflect:!1,hasChanged:m},v="finalized";class y extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=g){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||g}static finalize(){if(this.hasOwnProperty(v))return!1;this[v]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(i=>{const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=g){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:p).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:p;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||m)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var f;y[v]=!0,y.elementProperties=new Map,y.elementStyles=[],y.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:y}),(null!==(c=_.reactiveElementVersions)&&void 0!==c?c:_.reactiveElementVersions=[]).push("1.6.3");const b=window,w=b.trustedTypes,$=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,z="?"+k,S=`<${z}>`,E=document,P=()=>E.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,D=Array.isArray,j="[ \t\n\f\r]",V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,N=/>/g,M=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),O=/'/g,A=/"/g,L=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),U=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),R=new WeakMap,B=E.createTreeWalker(E,129,null,!1);function q(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==$?$.createHTML(e):e}const I=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",a=V;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,_=0;for(;_<i.length&&(a.lastIndex=_,l=a.exec(i),null!==l);)_=a.lastIndex,a===V?"!--"===l[1]?a=T:void 0!==l[1]?a=N:void 0!==l[2]?(L.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=M):void 0!==l[3]&&(a=M):a===M?">"===l[0]?(a=null!=o?o:V,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?M:'"'===l[3]?A:O):a===A||a===O?a=M:a===T||a===N?a=V:(a=M,o=void 0);const d=a===M&&t[e+1].startsWith("/>")?" ":"";n+=a===V?i+S:c>=0?(s.push(r),i.slice(0,c)+x+i.slice(c)+k+d):i+k+(-2===c?(s.push(void 0),e):d)}return[q(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class H{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[l,c]=I(t,e);if(this.el=H.createElement(l,i),B.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=B.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(x)||e.startsWith(k)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+x).split(k),e=/([.?@])?(.*)/.exec(i);r.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?Y:"?"===e[1]?Q:"@"===e[1]?tt:J})}else r.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(L.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),B.nextNode(),r.push({type:2,index:++o});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===z)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)r.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function Z(t,e,i=t,s){var o,n,a,r;if(e===U)return e;let l=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const c=C(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(a=(r=i)._$Co)&&void 0!==a?a:r._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=Z(t,l._$AS(t,e.values),l,s)),e}class K{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);B.currentNode=o;let n=B.nextNode(),a=0,r=0,l=s[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new G(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new et(n,this,t)),this._$AV.push(e),l=s[++r]}a!==(null==l?void 0:l.index)&&(n=B.nextNode(),a++)}return B.currentNode=E,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class G{constructor(t,e,i,s){var o;this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),C(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>D(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==W&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=H.createElement(q(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new K(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=R.get(t.strings);return void 0===e&&R.set(t.strings,e=new H(t)),e}T(t){D(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new G(this.k(P()),this.k(P()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class J{constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=Z(this,t,e,0),n=!C(t)||t!==this._$AH&&t!==U,n&&(this._$AH=t);else{const s=t;let a,r;for(t=o[0],a=0;a<o.length-1;a++)r=Z(this,s[i+a],e,a),r===U&&(r=this._$AH[a]),n||(n=!C(r)||r!==this._$AH[a]),r===W?t=W:t!==W&&(t+=(null!=r?r:"")+o[a+1]),this._$AH[a]=r}n&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class Y extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}const X=w?w.emptyScript:"";class Q extends J{constructor(){super(...arguments),this.type=4}j(t){t&&t!==W?this.element.setAttribute(this.name,X):this.element.removeAttribute(this.name)}}class tt extends J{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=Z(this,t,e,0))&&void 0!==i?i:W)===U)return;const s=this._$AH,o=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==W&&(s===W||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class et{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const it=b.litHtmlPolyfillSupport;null==it||it(H,G),(null!==(f=b.litHtmlVersions)&&void 0!==f?f:b.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var st,ot;class nt extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let a=n._$litPart$;if(void 0===a){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=a=new G(e.insertBefore(P(),t),t,void 0,null!=i?i:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return U}}nt.finalized=!0,nt._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:nt});const at=globalThis.litElementPolyfillSupport;null==at||at({LitElement:nt}),(null!==(ot=globalThis.litElementVersions)&&void 0!==ot?ot:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:s}=e;return{kind:i,elements:s,finisher(e){customElements.define(t,e)}}})(t,e),lt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ct(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):lt(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _t(t){return ct({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var dt,ht,ut;null===(dt=window.HTMLSlotElement)||void 0===dt||dt.prototype.assignedElements,function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(ht||(ht={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ut||(ut={}));var pt=["closed","locked","off"],mt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o},gt=function(t){mt(window,"haptic",t)},vt=function(t,e,i,s){if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(gt("warning"),confirm(s.confirmation.text||"Are you sure you want to "+s.action+"?")))switch(s.action){case"more-info":(i.entity||i.camera_image)&&mt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),mt(window,"location-changed",{replace:i})}(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(function(t,e){(function(t,e,i){void 0===i&&(i=!0);var s,o=function(t){return t.substr(0,t.indexOf("."))}(e),n="group"===o?"homeassistant":o;switch(o){case"lock":s=i?"unlock":"lock";break;case"cover":s=i?"open_cover":"close_cover";break;default:s=i?"turn_on":"turn_off"}t.callService(n,s,{entity_id:e})})(t,e,pt.includes(t.states[e].state))}(e,i.entity),gt("success"));break;case"call-service":if(!s.service)return void gt("failure");var o=s.service.split(".",2);e.callService(o[0],o[1],s.service_data,s.target),gt("success");break;case"fire-dom-event":mt(t,"ll-custom",s)}},yt=function(t,e,i,s){var o;"double_tap"===s&&i.double_tap_action?o=i.double_tap_action:"hold"===s&&i.hold_action?o=i.hold_action:"tap"===s&&i.tap_action&&(o=i.tap_action),vt(t,e,i,o)};function ft(t){return void 0!==t&&"none"!==t.action}const bt=(t,e)=>t(`component.weather.entity_component._.state.${e}`)||e,wt=2;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class $t{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class xt extends $t{constructor(t){if(super(t),this.et=W,t.type!==wt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===W||null==t)return this.ft=void 0,this.et=t;if(t===U)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}xt.directiveName="unsafeHTML",xt.resultType=1;const kt=(t=>(...e)=>({_$litDirective$:t,values:e}))(xt),zt={en:{zambrettiLong:{a:"The weather will remain settled and fair.",b:"Fair weather is expected.",c:"The weather is expected to clear and become fair.",d:"Fair at first, but gradually becoming less settled.",e:"Mostly fair with a chance of passing showers.",f:"Mostly fair weather with a tendency to improve.",g:"Mostly fair, with possible showers early on.",h:"Mostly fair, with showers expected later.",i:"Showers at first, then the weather will improve.",j:"Changeable weather with a tendency to improve.",k:"Mostly fair, but showers are likely.",l:"Rather unsettled weather, clearing later on.",m:"Unsettled weather that will probably improve.",n:"Showers alternating with bright intervals.",o:"Showers, with the weather gradually worsening.",p:"Changeable weather with some rain in places.",q:"Unsettled weather with short fair intervals.",r:"Unsettled weather, with rain expected later.",s:"Unsettled weather with rain at times.",t:"Very unsettled weather.",u:"Occasional rain with worsening conditions.",v:"Rain at times, the weather remains very unsettled.",w:"Frequent spells of rain throughout.",x:"Rainy and very unsettled weather.",y:"Stormy weather with a chance of improvement.",z:"Stormy weather with heavy rain.",rising:"The pressure is rising.",steady:"The pressure is steady.",falling:"The pressure is falling."},zambretti:{a:"Settled fair",b:"Fair weather",c:"Becoming fair",d:"Fair, becoming less settled",e:"Fair, possible showers",f:"Mostly fair, improving",g:"Mostly fair, possible showers early",h:"Mostly fair, showers later",i:"Showery early, improving",j:"Changeable, improving",k:"Mostly fair, showers likely",l:"Rather unsettled, clearing later",m:"Unsettled, probably improving",n:"Showery, bright intervals",o:"Showery, becoming less settled",p:"Changeable, some rain",q:"Unsettled, short fair intervals",r:"Unsettled, rain later",s:"Unsettled, some rain",t:"Very unsettled",u:"Occasional rain, worsening",v:"Rain at times, very unsettled",w:"Rain at frequent intervals",x:"Rain, very unsettled",y:"Stormy, may improve",z:"Stormy, much rain"},editor:{global_options:"Global Options",overview_section:"Overview Section",extended_section:"Extended Section",slots_section:"Slots Section",daily_forecast_section:"Daily Forecast Section",wind_bearing_icon:"Wind bearing arrow icon",slot_tap_more_info:"Tap on value opens history",moon_icon_only:"Moon phase: icon only",local_forecast:"Local forecast (Zambretti)",entity_uv_today:"UV forecast (today)",entity_fire_today:"Fire danger (today)",daily_forecast_date:"Show date next to day",local_forecast_verbose:"Verbose forecast text",forecast_altitude:"Station altitude (m)",forecast_altitude_hint:"Leave empty if the sensor reports relative (sea-level) pressure",compact_slots:"Compact slot labels",show_static_icons:"Show Static Icons",time_format:"Time Format",locale:"Locale",icon_pack:"Icon Pack",opt_locale_auto:"Auto (browser)",actions:"Actions",tap_action:"Tap Action",hold_action:"Hold Action",double_tap_action:"Double-tap Action",icon_pack_default:"Default (built-in animated)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (requires weather-chart-card)",icon_pack_custom:"Custom path...",icon_path:"Icon path",icon_path_hint:"Use {condition} as placeholder — e.g. /local/icons/{condition}.svg",overview_layout:"Overview Layout",card_title_1:"Card Title Text Line 1",card_title_2:"Card Title Text Line 2",entity_temperature:"Entity Current Temperature",entity_apparent_temp:"Entity Apparent Temperature",entity_forecast_icon:"Entity Forecast Icon",entity_forecast_icon_1:"Entity Forecast Icon 1",entity_summary:"Entity Forecast Summary",entity_summary_1:"Entity Forecast Summary 1",entity_extended:"Entity Extended Forecast",entity_extended_1:"Entity Extended Forecast 1",use_attribute:"Use Attribute",attribute:"Attribute",slot_l1:"Slot Left 1",slot_l2:"Slot Left 2",slot_l3:"Slot Left 3",slot_l4:"Slot Left 4",slot_l5:"Slot Left 5",slot_l6:"Slot Left 6",slot_l7:"Slot Left 7",slot_l8:"Slot Left 8",slot_r1:"Slot Right 1",slot_r2:"Slot Right 2",slot_r3:"Slot Right 3",slot_r4:"Slot Right 4",slot_r5:"Slot Right 5",slot_r6:"Slot Right 6",slot_r7:"Slot Right 7",slot_r8:"Slot Right 8",today_temp_decimals:"Todays Temperature Decimals",today_rain_decimals:"Todays Rainfall Decimals",forecast_temp_decimals:"Forecast Temperature Decimals",pressure_decimals:"Pressure Decimals",show_separator:"Show separator",show_temp_decimals:"Show temperature decimals",entity_humidity:"Humidity",entity_pressure:"Atmospheric Pressure",entity_pressure_trend:"Entity Pressure Trend (optional — derivative/trend sensor)",entity_pop:"Chance of Rain",entity_pos:"Possible Rain Today",entity_2day_pos:"Possible Rain Tomorrow",entity_rainfall:"Todays Rain",entity_fire_danger:"Fire Danger",entity_uv_summary:"UV Alert Summary",entity_sun:"Entity Sun",entity_moon:"Moon Phase Entity",entity_visibility:"Entity Visibility",entity_wind_speed:"Entity Wind Speed",entity_wind_bearing:"Entity Wind Bearing",entity_wind_gust:"Entity Wind Gust",entity_wind_speed_kt:"Entity Wind Speed Kt",entity_wind_gust_kt:"Entity Wind Gust Kt",entity_update_time:"Entity Update Time",update_time_prefix:"Update Time Prefix",entity_observed_max:"Entity Observed Max",entity_observed_min:"Entity Observed Min",entity_forecast_max:"Entity Forecast Max",entity_forecast_max_1:"Entity Forecast Max 1",entity_forecast_min:"Entity Forecast Min",entity_forecast_min_1:"Entity Forecast Min 1",entity_temp_next:"Entity Temp Next",entity_temp_next_label:"Entity Temp Next Label",entity_temp_following:"Entity Temp Following",entity_temp_fol_label:"Entity Temp Following Label",entity_fire_danger_1:"Entity Fire Danger 1",entity_pop_1:"Entity Forecast Chance of Rain 1",entity_pos_1:"Entity Forecast Possible Rain 1",custom1_value:"Custom 1 Value",custom2_value:"Custom 2 Value",custom3_value:"Custom 3 Value",custom4_value:"Custom 4 Value",custom1_icon:"Custom 1 Icon",custom2_icon:"Custom 2 Icon",custom3_icon:"Custom 3 Icon",custom4_icon:"Custom 4 Icon",custom1_units:"Custom 1 Units",custom2_units:"Custom 2 Units",custom3_units:"Custom 3 Units",custom4_units:"Custom 4 Units",custom1_label:"Custom 1 Label (optional)",custom2_label:"Custom 2 Label (optional)",custom3_label:"Custom 3 Label (optional)",custom4_label:"Custom 4 Label (optional)",weather_entity:"Weather Entity with Forecasts",forecast_type:"Forecast Type",daily_forecast_layout:"Daily Forecast Layout",daily_forecast_days:"Daily Forecast Days",daily_extended_days:"Daily Extended Days",show_forecast_pop:"Show Precipitation Probability in Forecast",show_forecast_wind:"Show Wind in Forecast",show_gust_in_wind:"Show Gust in Wind Slot",colour_fire_danger:"Colour Fire Danger",include_today:"Include Today in Forecast",show_temp_chart:"Show Temperature Chart",show_precip_chart:"Show Precipitation Chart",forecast_tooltips:"Enable forecast tooltips",charts_section:"Charts Section",opt_daily:"Daily",opt_hourly:"Hourly",opt_twice_daily:"Twice Daily",opt_horizontal:"Horizontal",opt_vertical:"Vertical",opt_complete:"Complete",opt_observations:"Observations",opt_forecast:"Forecast",opt_title_only:"Title only",opt_system:"System",opt_12hour:"12 hour",opt_24hour:"24 hour"},card:{uv_rating:"UV",feels_like:"Feels like",observed_max:"Observed Max",observed_min:"Observed Min",obs_max:"Obs Max",obs_min:"Obs Min",forecast_max:"Max",forecast_min:"Min",pos_today:"Forecast",pos_tomorrow:"Tom",fore:"Fore",u_v_rating:"UV",fire_danger:"Fire",gust:"Gust",forecast_max_compact:"Max",forecast_min_compact:"Min",pos_tomorrow_compact:"Tom"},moonPhases:{new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"},windDirections:["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"]},bg:{zambrettiLong:{a:"Времето ще остане устойчиво и хубаво.",b:"Очаква се хубаво време.",c:"Очаква се прояснение и подобрение на времето.",d:"Времето ще е хубаво, но постепенно ще става по-неустойчиво.",e:"Предимно хубаво време с възможност за краткотрайни превалявания.",f:"Предимно хубаво време с тенденция към подобрение.",g:"Предимно хубаво, с възможни краткотрайни превалявания в близките часове.",h:"Предимно хубаво, по-късно се очакват превалявания.",i:"Краткотрайни превалявания с изгледи за постепенно подобрение на времето.",j:"Променливо време с тенденция към подобрение.",k:"Предимно хубаво, но са вероятни превалявания.",l:"Неустойчиво време, по-късно се очаква прояснение.",m:"Неустойчиво време, което вероятно ще се подобри.",n:"Превалявания, редуващи се с прояснения.",o:"Превалявания и постепенно влошаване на времето.",p:"Променливо време, на места с дъжд.",q:"Неустойчиво време с кратки прояснения.",r:"Неустойчиво време, по-късно се очаква дъжд.",s:"Неустойчиво време, на моменти с дъжд.",t:"Предимно много неустойчиво време.",u:"Временен дъжд с тенденция към влошаване.",v:"Периодичен дъжд, времето остава много неустойчиво.",w:"Чести дъждове през целия период.",x:"Дъждовно и много неустойчиво време.",y:"Бурно време с възможност за подобрение.",z:"Бурно време с обилни валежи.",rising:"Налягането се покачва.",steady:"Налягането е стабилно.",falling:"Налягането пада."},zambretti:{a:"Устойчиво хубаво време",b:"Хубаво време",c:"Прояснение",d:"Хубаво, с тенденция към влошаване",e:"Хубаво, възможни превалявания",f:"Предимно хубаво, с подобрение",g:"Предимно хубаво, възможни краткотрайни превалявания",h:"Предимно хубаво, превалявания по-късно",i:"Краткотрайни превалявания, с подобрение",j:"Променливо, с подобрение",k:"Предимно хубаво, вероятни превалявания",l:"Неустойчиво, прояснение по-късно",m:"Неустойчиво, вероятно подобрение",n:"Превалявания с прояснения",o:"Превалявания, с тенденция към влошаване",p:"Променливо, на места дъжд",q:"Неустойчиво, кратки прояснения",r:"Неустойчиво, дъжд по-късно",s:"Неустойчиво, на моменти дъжд",t:"Предимно много неустойчиво",u:"Временен дъжд, с влошаване",v:"Периодичен дъжд, много неустойчиво",w:"Чести дъждове",x:"Дъждовно, много неустойчиво",y:"Бурно, възможно подобрение",z:"Бурно, обилни валежи"},editor:{global_options:"Глобални настройки",overview_section:"Секция Преглед",extended_section:"Разширена секция",slots_section:"Секция Слотове",daily_forecast_section:"Секция Прогноза",wind_bearing_icon:"Стрелка за посока на вятъра",slot_tap_more_info:"Клик върху стойност отваря историята",moon_icon_only:"Лунна фаза: само икона",local_forecast:"Локална прогноза (Zambretti)",daily_forecast_date:"Дата до деня",local_forecast_verbose:"Многословна прогноза",forecast_altitude:"Надморска височина (м)",forecast_altitude_hint:"Остави празно, ако сензорът дава относително (sea-level) налягане",compact_slots:"Компактни надписи",show_static_icons:"Статични икони",time_format:"Формат на часа",locale:"Език",icon_pack:"Пакет с икони",opt_locale_auto:"Автоматично (браузър)",actions:"Действия",tap_action:"Действие при натискане",hold_action:"Действие при задържане",double_tap_action:"Двойно натискане",icon_pack_default:"По подразбиране (вградени анимирани)",icon_pack_met_fill:"Meteocons — Запълнен (CDN)",icon_pack_met_line:"Meteocons — Линеен (CDN)",icon_pack_ammap:"ammap икони (изисква weather-chart-card)",icon_pack_custom:"Персонализиран път...",icon_path:"Път до икона",icon_path_hint:"Използвай {condition} като плейсхолър",overview_layout:"Оформление на преглед",card_title_1:"Заглавие ред 1",card_title_2:"Заглавие ред 2",entity_temperature:"Текуща температура",entity_apparent_temp:"Усещана температура",entity_forecast_icon:"Икона прогноза",entity_forecast_icon_1:"Икона прогноза 1",entity_summary:"Резюме прогноза",entity_summary_1:"Резюме прогноза 1",entity_extended:"Разширена прогноза",entity_extended_1:"Разширена прогноза 1",use_attribute:"Използвай атрибут",attribute:"Атрибут",slot_l1:"Слот Ляво 1",slot_l2:"Слот Ляво 2",slot_l3:"Слот Ляво 3",slot_l4:"Слот Ляво 4",slot_l5:"Слот Ляво 5",slot_l6:"Слот Ляво 6",slot_l7:"Слот Ляво 7",slot_l8:"Слот Ляво 8",slot_r1:"Слот Дясно 1",slot_r2:"Слот Дясно 2",slot_r3:"Слот Дясно 3",slot_r4:"Слот Дясно 4",slot_r5:"Слот Дясно 5",slot_r6:"Слот Дясно 6",slot_r7:"Слот Дясно 7",slot_r8:"Слот Дясно 8",today_temp_decimals:"Десетични за текуща темп.",today_rain_decimals:"Десетични за валежи",forecast_temp_decimals:"Десетични за прогнозна темп.",pressure_decimals:"Десетични за налягане",show_separator:"Показвай разделител",show_temp_decimals:"Показвай десетични",entity_humidity:"Влажност",entity_pressure:"Атмосферно налягане",entity_pressure_trend:"Ентити тренд на налягането (по избор — derivative/trend сензор)",entity_pop:"Вероятност за дъжд",entity_pos:"Възможен дъжд днес",entity_2day_pos:"Възможен дъжд утре",entity_rainfall:"Дъжд днес",entity_fire_danger:"Опасност от пожар",entity_uv_summary:"UV сигнал",entity_sun:"Слънце",entity_moon:"Фаза на луната",entity_visibility:"Видимост",entity_wind_speed:"Скорост на вятъра",entity_wind_bearing:"Посока на вятъра",entity_wind_gust:"Пориви",entity_wind_speed_kt:"Скорост (kn)",entity_wind_gust_kt:"Пориви (kn)",entity_update_time:"Час на обновяване",update_time_prefix:"Префикс за час",entity_uv_today:"UV прогноза (днес)",entity_fire_today:"Опасност от пожар (днес)",entity_observed_max:"Макс. наблюдавана",entity_observed_min:"Мин. наблюдавана",entity_forecast_max:"Макс. прогноза",entity_forecast_max_1:"Макс. прогноза 1",entity_forecast_min:"Мин. прогноза",entity_forecast_min_1:"Мин. прогноза 1",entity_temp_next:"Следваща темп.",entity_temp_next_label:"Етикет следваща темп.",entity_temp_following:"Трета темп.",entity_temp_fol_label:"Етикет трета темп.",entity_fire_danger_1:"Опасност от пожар 1",entity_pop_1:"Вероятност за дъжд 1",entity_pos_1:"Възможни валежи 1",custom1_value:"Перс. 1 стойност",custom2_value:"Перс. 2 стойност",custom3_value:"Перс. 3 стойност",custom4_value:"Перс. 4 стойност",custom1_icon:"Перс. 1 икона",custom2_icon:"Перс. 2 икона",custom3_icon:"Перс. 3 икона",custom4_icon:"Перс. 4 икона",custom1_units:"Перс. 1 единица",custom2_units:"Перс. 2 единица",custom3_units:"Перс. 3 единица",custom4_units:"Перс. 4 единица",custom1_label:"Перс. 1 етикет",custom2_label:"Перс. 2 етикет",custom3_label:"Перс. 3 етикет",custom4_label:"Перс. 4 етикет",weather_entity:"Ентити за прогноза",forecast_type:"Тип прогноза",daily_forecast_layout:"Оформление на прогнозата",daily_forecast_days:"Дни в прогнозата",daily_extended_days:"Дни разширена прогноза",show_forecast_pop:"Вероятност за валежи в прогнозата",show_forecast_wind:"Вятър в прогнозата",show_gust_in_wind:"Пориви в слота за вятър",colour_fire_danger:"Оцветяване — опасност от пожар",include_today:"Включи днес в прогнозата",show_temp_chart:"Покажи температурен чарт",show_precip_chart:"Покажи чарт за валежи",forecast_tooltips:"Tooltip-ове в прогнозата",charts_section:"Секция Чартове",opt_daily:"Дневна",opt_hourly:"Почасова",opt_twice_daily:"Два пъти дневно",opt_horizontal:"Хоризонтална",opt_vertical:"Вертикална",opt_complete:"Пълно",opt_observations:"Наблюдения",opt_forecast:"Прогноза",opt_title_only:"Само заглавие",opt_system:"Системен",opt_12hour:"12-часов",opt_24hour:"24-часов"},card:{uv_rating:"UV",feels_like:"Усеща се като",observed_max:"Наблюдавано макс.",observed_min:"Наблюдавано мин.",obs_max:"Набл. макс.",obs_min:"Набл. мин.",forecast_max:"Макс днес",forecast_min:"Мин днес",pos_today:"Прогноза",pos_tomorrow:"Прогноза за утре",fore:"Прогноза",u_v_rating:"UV",fire_danger:"Пожар",gust:"Пориви",forecast_max_compact:"Макс",forecast_min_compact:"Мин",pos_tomorrow_compact:"Утре"},moonPhases:{new_moon:"Новолуние",waxing_crescent:"Растяща луна",first_quarter:"Първа четвърт",waxing_gibbous:"Растяща луна",full_moon:"Пълнолуние",waning_gibbous:"Намаляваща луна",last_quarter:"Последна четвърт",waning_crescent:"Намаляваща луна"},windDirections:["С","ССИ","СИ","ИСИ","И","ИЮИ","ЮИ","ЮЮИ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"],units:{"km/h":"км/ч",kph:"км/ч","m/s":"м/с",mm:"мм",in:"инч",cm:"см"}},da:{zambrettiLong:{a:"Vejret forbliver stabilt og godt.",b:"Der forventes godt vejr.",c:"Vejret ventes at klare op og blive godt.",d:"Godt i starten, men gradvist mere ustadigt.",e:"Overvejende godt med mulighed for enkelte byger.",f:"Ret godt vejr med tendens til bedring.",g:"Ret godt, med mulige byger i starten.",h:"Ret godt, med byger senere.",i:"Byger i starten, derefter bedres vejret.",j:"Skiftende vejr med tendens til bedring.",k:"Ret godt, men byger er sandsynlige.",l:"Ret ustadigt vejr, der klarer op senere.",m:"Ustadigt vejr, som formentlig bedres.",n:"Byger vekslende med solstrejf.",o:"Byger, vejret forværres gradvist.",p:"Skiftende vejr med lidt regn stedvis.",q:"Ustadigt vejr med korte gode perioder.",r:"Ustadigt vejr, med regn senere.",s:"Ustadigt vejr med regn til tider.",t:"Overvejende meget ustadigt vejr.",u:"Regn til tider under forværrede forhold.",v:"Regn til tider, vejret forbliver meget ustadigt.",w:"Hyppige perioder med regn.",x:"Regnfuldt og meget ustadigt vejr.",y:"Stormfuldt vejr med mulighed for bedring.",z:"Stormfuldt vejr med megen regn.",rising:"Trykket stiger.",steady:"Trykket er stabilt.",falling:"Trykket falder."},zambretti:{a:"Stabilt godt vejr",b:"Godt vejr",c:"Opklarende",d:"Godt, bliver ustadigt",e:"Godt, mulige byger",f:"Ret godt, i bedring",g:"Ret godt, mulige byger først",h:"Ret godt, byger senere",i:"Byger først, i bedring",j:"Skiftende, i bedring",k:"Ret godt, byger sandsynlige",l:"Ret ustadigt, opklarer senere",m:"Ustadigt, formentlig bedring",n:"Byger med solstrejf",o:"Byger, bliver ustadigt",p:"Skiftende, lidt regn",q:"Ustadigt, korte gode perioder",r:"Ustadigt, regn senere",s:"Ustadigt, lidt regn",t:"Overvejende meget ustadigt",u:"Regn til tider, forværring",v:"Regn til tider, meget ustadigt",w:"Regn med hyppige mellemrum",x:"Regn, meget ustadigt",y:"Stormfuldt, mulig bedring",z:"Stormfuldt, megen regn"},editor:{global_options:"Globale indstillinger",overview_section:"Oversigtssektion",extended_section:"Udvidet sektion",slots_section:"Slot-sektion",daily_forecast_section:"Daglig vejrudsigt",wind_bearing_icon:"Pil for vindretning",slot_tap_more_info:"Tryk på værdi åbner historik",moon_icon_only:"Månefase: kun ikon",local_forecast:"Lokal vejrudsigt (Zambretti)",entity_uv_today:"UV-prognose (i dag)",entity_fire_today:"Brandfare (i dag)",daily_forecast_date:"Dato ved siden af dagen",local_forecast_verbose:"Udførlig prognosetekst",forecast_altitude:"Stationens højde (m)",forecast_altitude_hint:"Lad stå tomt, hvis sensoren rapporterer relativt tryk (havniveau)",compact_slots:"Kompakte etiketter",show_static_icons:"Statiske ikoner",time_format:"Tidsformat",locale:"Sprog",icon_pack:"Ikonpakke",opt_locale_auto:"Automatisk (browser)",actions:"Handlinger",tap_action:"Tryk-handling",hold_action:"Hold-handling",double_tap_action:"Dobbelttryk-handling",icon_pack_default:"Standard (indbygget, animeret)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (kræver weather-chart-card)",icon_pack_custom:"Brugerdefineret sti...",icon_path:"Ikonsti",icon_path_hint:"Brug {condition} som pladsholder — f.eks. /local/icons/{condition}.svg",overview_layout:"Oversigtslayout",card_title_1:"Korttitel linje 1",card_title_2:"Korttitel linje 2",entity_temperature:"Entitet aktuel temperatur",entity_apparent_temp:"Entitet følt temperatur",entity_forecast_icon:"Entitet vejrudsigtsikon",entity_forecast_icon_1:"Entitet vejrudsigtsikon 1",entity_summary:"Entitet vejrudsigtsresumé",entity_summary_1:"Entitet vejrudsigtsresumé 1",entity_extended:"Entitet udvidet vejrudsigt",entity_extended_1:"Entitet udvidet vejrudsigt 1",use_attribute:"Brug attribut",attribute:"Attribut",slot_l1:"Slot venstre 1",slot_l2:"Slot venstre 2",slot_l3:"Slot venstre 3",slot_l4:"Slot venstre 4",slot_l5:"Slot venstre 5",slot_l6:"Slot venstre 6",slot_l7:"Slot venstre 7",slot_l8:"Slot venstre 8",slot_r1:"Slot højre 1",slot_r2:"Slot højre 2",slot_r3:"Slot højre 3",slot_r4:"Slot højre 4",slot_r5:"Slot højre 5",slot_r6:"Slot højre 6",slot_r7:"Slot højre 7",slot_r8:"Slot højre 8",today_temp_decimals:"Decimaler for dagens temperatur",today_rain_decimals:"Decimaler for dagens regn",forecast_temp_decimals:"Decimaler for prognosetemperatur",pressure_decimals:"Decimaler for tryk",show_separator:"Vis separator",show_temp_decimals:"Vis temperaturdecimaler",entity_humidity:"Luftfugtighed",entity_pressure:"Lufttryk",entity_pressure_trend:"Entitet tryktendens (valgfri — derivative/trend-sensor)",entity_pop:"Regnsandsynlighed",entity_pos:"Mulig regn i dag",entity_2day_pos:"Mulig regn i morgen",entity_rainfall:"Dagens regn",entity_fire_danger:"Brandfare",entity_uv_summary:"UV-advarsel",entity_sun:"Entitet sol",entity_moon:"Entitet månefase",entity_visibility:"Entitet sigtbarhed",entity_wind_speed:"Entitet vindhastighed",entity_wind_bearing:"Entitet vindretning",entity_wind_gust:"Entitet vindstød",entity_wind_speed_kt:"Entitet vindhastighed (kt)",entity_wind_gust_kt:"Entitet vindstød (kt)",entity_update_time:"Entitet opdateringstid",update_time_prefix:"Præfiks opdateringstid",entity_observed_max:"Entitet observeret maks",entity_observed_min:"Entitet observeret min",entity_forecast_max:"Entitet prognose maks",entity_forecast_max_1:"Entitet prognose maks 1",entity_forecast_min:"Entitet prognose min",entity_forecast_min_1:"Entitet prognose min 1",entity_temp_next:"Entitet næste temperatur",entity_temp_next_label:"Etiket næste temperatur",entity_temp_following:"Entitet efterfølgende temperatur",entity_temp_fol_label:"Etiket efterfølgende temperatur",entity_fire_danger_1:"Entitet brandfare 1",entity_pop_1:"Entitet regnsandsynlighed 1",entity_pos_1:"Entitet mulig regn 1",custom1_value:"Brugerdefineret værdi 1",custom2_value:"Brugerdefineret værdi 2",custom3_value:"Brugerdefineret værdi 3",custom4_value:"Brugerdefineret værdi 4",custom1_icon:"Brugerdefineret ikon 1",custom2_icon:"Brugerdefineret ikon 2",custom3_icon:"Brugerdefineret ikon 3",custom4_icon:"Brugerdefineret ikon 4",custom1_units:"Brugerdefinerede enheder 1",custom2_units:"Brugerdefinerede enheder 2",custom3_units:"Brugerdefinerede enheder 3",custom4_units:"Brugerdefinerede enheder 4",custom1_label:"Brugerdefineret etiket (valgfri) 1",custom2_label:"Brugerdefineret etiket (valgfri) 2",custom3_label:"Brugerdefineret etiket (valgfri) 3",custom4_label:"Brugerdefineret etiket (valgfri) 4",weather_entity:"Vejrentitet med prognoser",forecast_type:"Prognosetype",daily_forecast_layout:"Layout for daglig vejrudsigt",daily_forecast_days:"Dage i daglig vejrudsigt",daily_extended_days:"Dage i udvidet vejrudsigt",show_forecast_pop:"Vis nedbørssandsynlighed i vejrudsigt",show_forecast_wind:"Vis vind i vejrudsigt",show_gust_in_wind:"Vis vindstød i vind-slot",colour_fire_danger:"Farvelæg brandfare",include_today:"Inkluder i dag i vejrudsigt",show_temp_chart:"Vis temperaturdiagram",show_precip_chart:"Vis nedbørsdiagram",forecast_tooltips:"Aktivér vejrudsigts-tooltips",charts_section:"Diagramsektion",opt_daily:"Dagligt",opt_hourly:"Hver time",opt_twice_daily:"To gange dagligt",opt_horizontal:"Vandret",opt_vertical:"Lodret",opt_complete:"Komplet",opt_observations:"Observationer",opt_forecast:"Vejrudsigt",opt_title_only:"Kun titel",opt_system:"System",opt_12hour:"12 timer",opt_24hour:"24 timer"},card:{uv_rating:"UV",feels_like:"Føles som",observed_max:"Observeret Max",observed_min:"Observeret Min",obs_max:"Obs Max",obs_min:"Obs Min",forecast_max:"Højeste i dag",forecast_max_compact:"Maks",forecast_min_compact:"Min",forecast_min:"Laveste i dag",pos_today:"Vejrudsigt",pos_tomorrow:"Prog i morgen",fore:"Prog",u_v_rating:"UV",fire_danger:"Brand",gust:"Vindstød",pos_tomorrow_compact:"Morgen"},moonPhases:{new_moon:"Nymåne",waxing_crescent:"Voksende måne",first_quarter:"Første kvartal",waxing_gibbous:"Voksende måne",full_moon:"Fuldmåne",waning_gibbous:"Aftagende måne",last_quarter:"Sidste kvartal",waning_crescent:"Aftagende måne"},windDirections:["N","NNØ","NØ","ØNØ","Ø","ØSØ","SØ","SSØ","S","SSV","SV","VSV","V","VNV","NV","NNV","N"]},de:{zambrettiLong:{a:"Das Wetter bleibt beständig und schön.",b:"Es wird schönes Wetter erwartet.",c:"Das Wetter klart auf und wird schön.",d:"Zunächst schön, aber allmählich unbeständiger.",e:"Überwiegend schön mit vereinzelten Schauern.",f:"Recht schönes Wetter mit Tendenz zur Besserung.",g:"Recht schön, anfangs sind Schauer möglich.",h:"Recht schön, später sind Schauer zu erwarten.",i:"Anfangs Schauer, danach bessert sich das Wetter.",j:"Wechselhaftes Wetter mit Tendenz zur Besserung.",k:"Recht schön, aber Schauer sind wahrscheinlich.",l:"Eher unbeständiges Wetter, später Aufklarung.",m:"Unbeständiges Wetter, das sich vermutlich bessert.",n:"Schauer im Wechsel mit sonnigen Abschnitten.",o:"Schauer, das Wetter verschlechtert sich allmählich.",p:"Wechselhaftes Wetter mit etwas Regen.",q:"Unbeständiges Wetter mit kurzen schönen Abschnitten.",r:"Unbeständiges Wetter, später ist Regen zu erwarten.",s:"Unbeständiges Wetter mit zeitweiligem Regen.",t:"Überwiegend sehr unbeständiges Wetter.",u:"Zeitweise Regen bei sich verschlechterndem Wetter.",v:"Zeitweise Regen, das Wetter bleibt sehr unbeständig.",w:"Häufige Regenfälle im gesamten Zeitraum.",x:"Regnerisches und sehr unbeständiges Wetter.",y:"Stürmisches Wetter mit Chance auf Besserung.",z:"Stürmisches Wetter mit ergiebigem Regen.",rising:"Der Luftdruck steigt.",steady:"Der Luftdruck ist stabil.",falling:"Der Luftdruck fällt."},zambretti:{a:"Beständig schön",b:"Schönes Wetter",c:"Aufheiternd",d:"Schön, zunehmend unbeständig",e:"Schön, Schauer möglich",f:"Recht schön, Besserung",g:"Recht schön, anfangs Schauer möglich",h:"Recht schön, später Schauer",i:"Anfangs Schauer, Besserung",j:"Wechselhaft, Besserung",k:"Recht schön, Schauer wahrscheinlich",l:"Eher unbeständig, später Aufklarung",m:"Unbeständig, vermutlich Besserung",n:"Schauer, sonnige Abschnitte",o:"Schauer, zunehmend unbeständig",p:"Wechselhaft, etwas Regen",q:"Unbeständig, kurze schöne Abschnitte",r:"Unbeständig, später Regen",s:"Unbeständig, etwas Regen",t:"Überwiegend sehr unbeständig",u:"Zeitweise Regen, Verschlechterung",v:"Zeitweise Regen, sehr unbeständig",w:"Häufiger Regen",x:"Regen, sehr unbeständig",y:"Stürmisch, evtl. Besserung",z:"Stürmisch, viel Regen"},editor:{global_options:"Globale Optionen",overview_section:"Übersichtsbereich",extended_section:"Erweiterter Bereich",slots_section:"Slots-Bereich",daily_forecast_section:"Tagesvorhersage",wind_bearing_icon:"Windrichtungspfeil",slot_tap_more_info:"Tippen auf Wert öffnet Verlauf",moon_icon_only:"Mondphase: nur Symbol",local_forecast:"Lokale Vorhersage (Zambretti)",entity_uv_today:"UV-Vorhersage (heute)",entity_fire_today:"Waldbrandgefahr (heute)",daily_forecast_date:"Datum neben dem Tag",local_forecast_verbose:"Ausführlicher Vorhersagetext",forecast_altitude:"Stationshöhe (m)",forecast_altitude_hint:"Leer lassen, wenn der Sensor relativen Druck (Meereshöhe) liefert",compact_slots:"Kompakte Beschriftungen",show_static_icons:"Statische Icons",time_format:"Zeitformat",locale:"Sprache",icon_pack:"Icon-Paket",opt_locale_auto:"Automatisch (Browser)",actions:"Aktionen",tap_action:"Tipp-Aktion",hold_action:"Halte-Aktion",double_tap_action:"Doppeltipp-Aktion",icon_pack_default:"Standard (integriert, animiert)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Wetter-Icons (erfordert weather-chart-card)",icon_pack_custom:"Benutzerdefinierter Pfad...",icon_path:"Icon-Pfad",icon_path_hint:"{condition} als Platzhalter verwenden — z. B. /local/icons/{condition}.svg",overview_layout:"Übersichts-Layout",card_title_1:"Kartentitel Zeile 1",card_title_2:"Kartentitel Zeile 2",entity_temperature:"Entität aktuelle Temperatur",entity_apparent_temp:"Entität gefühlte Temperatur",entity_forecast_icon:"Entität Vorhersage-Icon",entity_forecast_icon_1:"Entität Vorhersage-Icon 1",entity_summary:"Entität Vorhersage-Zusammenfassung",entity_summary_1:"Entität Vorhersage-Zusammenfassung 1",entity_extended:"Entität erweiterte Vorhersage",entity_extended_1:"Entität erweiterte Vorhersage 1",use_attribute:"Attribut verwenden",attribute:"Attribut",slot_l1:"Slot links 1",slot_l2:"Slot links 2",slot_l3:"Slot links 3",slot_l4:"Slot links 4",slot_l5:"Slot links 5",slot_l6:"Slot links 6",slot_l7:"Slot links 7",slot_l8:"Slot links 8",slot_r1:"Slot rechts 1",slot_r2:"Slot rechts 2",slot_r3:"Slot rechts 3",slot_r4:"Slot rechts 4",slot_r5:"Slot rechts 5",slot_r6:"Slot rechts 6",slot_r7:"Slot rechts 7",slot_r8:"Slot rechts 8",today_temp_decimals:"Dezimalstellen heutige Temperatur",today_rain_decimals:"Dezimalstellen heutiger Regen",forecast_temp_decimals:"Dezimalstellen Vorhersagetemperatur",pressure_decimals:"Dezimalstellen Luftdruck",show_separator:"Trennlinie anzeigen",show_temp_decimals:"Temperatur-Dezimalstellen anzeigen",entity_humidity:"Luftfeuchtigkeit",entity_pressure:"Luftdruck",entity_pressure_trend:"Entität Drucktrend (optional — Derivative/Trend-Sensor)",entity_pop:"Regenwahrscheinlichkeit",entity_pos:"Möglicher Regen heute",entity_2day_pos:"Möglicher Regen morgen",entity_rainfall:"Heutiger Regen",entity_fire_danger:"Brandgefahr",entity_uv_summary:"UV-Warnung",entity_sun:"Entität Sonne",entity_moon:"Entität Mondphase",entity_visibility:"Entität Sichtweite",entity_wind_speed:"Entität Windgeschwindigkeit",entity_wind_bearing:"Entität Windrichtung",entity_wind_gust:"Entität Windböen",entity_wind_speed_kt:"Entität Windgeschwindigkeit (kt)",entity_wind_gust_kt:"Entität Windböen (kt)",entity_update_time:"Entität Aktualisierungszeit",update_time_prefix:"Präfix Aktualisierungszeit",entity_observed_max:"Entität beobachtetes Max",entity_observed_min:"Entität beobachtetes Min",entity_forecast_max:"Entität Vorhersage-Max",entity_forecast_max_1:"Entität Vorhersage-Max 1",entity_forecast_min:"Entität Vorhersage-Min",entity_forecast_min_1:"Entität Vorhersage-Min 1",entity_temp_next:"Entität nächste Temperatur",entity_temp_next_label:"Beschriftung nächste Temperatur",entity_temp_following:"Entität folgende Temperatur",entity_temp_fol_label:"Beschriftung folgende Temperatur",entity_fire_danger_1:"Entität Brandgefahr 1",entity_pop_1:"Entität Regenwahrscheinlichkeit 1",entity_pos_1:"Entität möglicher Regen 1",custom1_value:"Benutzerdefiniert Wert 1",custom2_value:"Benutzerdefiniert Wert 2",custom3_value:"Benutzerdefiniert Wert 3",custom4_value:"Benutzerdefiniert Wert 4",custom1_icon:"Benutzerdefiniert Icon 1",custom2_icon:"Benutzerdefiniert Icon 2",custom3_icon:"Benutzerdefiniert Icon 3",custom4_icon:"Benutzerdefiniert Icon 4",custom1_units:"Benutzerdefiniert Einheiten 1",custom2_units:"Benutzerdefiniert Einheiten 2",custom3_units:"Benutzerdefiniert Einheiten 3",custom4_units:"Benutzerdefiniert Einheiten 4",custom1_label:"Benutzerdefiniert Beschriftung (optional) 1",custom2_label:"Benutzerdefiniert Beschriftung (optional) 2",custom3_label:"Benutzerdefiniert Beschriftung (optional) 3",custom4_label:"Benutzerdefiniert Beschriftung (optional) 4",weather_entity:"Wetter-Entität mit Vorhersagen",forecast_type:"Vorhersagetyp",daily_forecast_layout:"Layout der Tagesvorhersage",daily_forecast_days:"Tage der Tagesvorhersage",daily_extended_days:"Tage der erweiterten Vorhersage",show_forecast_pop:"Regenwahrscheinlichkeit in Vorhersage anzeigen",show_forecast_wind:"Wind in Vorhersage anzeigen",show_gust_in_wind:"Böen im Wind-Slot anzeigen",colour_fire_danger:"Brandgefahr einfärben",include_today:"Heute in Vorhersage einbeziehen",show_temp_chart:"Temperaturdiagramm anzeigen",show_precip_chart:"Niederschlagsdiagramm anzeigen",forecast_tooltips:"Vorhersage-Tooltips aktivieren",charts_section:"Diagramm-Bereich",opt_daily:"Täglich",opt_hourly:"Stündlich",opt_twice_daily:"Zweimal täglich",opt_horizontal:"Horizontal",opt_vertical:"Vertikal",opt_complete:"Vollständig",opt_observations:"Beobachtungen",opt_forecast:"Vorhersage",opt_title_only:"Nur Titel",opt_system:"System",opt_12hour:"12 Stunden",opt_24hour:"24 Stunden"},card:{uv_rating:"UV",feels_like:"Gefühlt",observed_max:"Beobachtet Max",observed_min:"Beobachtet Min",obs_max:"Beob Max",obs_min:"Beob Min",forecast_max:"Max heute",forecast_max_compact:"Max",forecast_min_compact:"Min",forecast_min:"Min heute",pos_today:"Vorhersage",pos_tomorrow:"Prog morgen",fore:"Prog",u_v_rating:"UV",fire_danger:"Feuer",gust:"Böe",pos_tomorrow_compact:"Morgen"},moonPhases:{new_moon:"Neumond",waxing_crescent:"Zunehmende Sichel",first_quarter:"Erstes Viertel",waxing_gibbous:"Zunehmender Mond",full_moon:"Vollmond",waning_gibbous:"Abnehmender Mond",last_quarter:"Letztes Viertel",waning_crescent:"Abnehmende Sichel"},windDirections:["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW","N"]},es:{zambrettiLong:{a:"El tiempo se mantendrá estable y despejado.",b:"Se espera buen tiempo.",c:"Se espera que el tiempo mejore y se despeje.",d:"Bueno al principio, pero volviéndose gradualmente inestable.",e:"Mayormente bueno con posibilidad de chubascos pasajeros.",f:"Tiempo bastante bueno con tendencia a mejorar.",g:"Bastante bueno, con posibles chubascos al principio.",h:"Bastante bueno, con chubascos esperados más tarde.",i:"Chubascos al principio, luego el tiempo mejorará.",j:"Tiempo variable con tendencia a mejorar.",k:"Bastante bueno, pero los chubascos son probables.",l:"Tiempo algo inestable, despejándose más tarde.",m:"Tiempo inestable que probablemente mejorará.",n:"Chubascos alternando con intervalos despejados.",o:"Chubascos, con el tiempo empeorando gradualmente.",p:"Tiempo variable con algo de lluvia en algunas zonas.",q:"Tiempo inestable con breves intervalos buenos.",r:"Tiempo inestable, con lluvia esperada más tarde.",s:"Tiempo inestable con lluvia a ratos.",t:"Tiempo muy inestable en general.",u:"Lluvia ocasional con condiciones empeorando.",v:"Lluvia a ratos, el tiempo sigue muy inestable.",w:"Períodos frecuentes de lluvia.",x:"Tiempo lluvioso y muy inestable.",y:"Tiempo tormentoso con posibilidad de mejora.",z:"Tiempo tormentoso con lluvia abundante.",rising:"La presión está subiendo.",steady:"La presión se mantiene estable.",falling:"La presión está bajando."},zambretti:{a:"Estable y despejado",b:"Buen tiempo",c:"Mejorando, despejándose",d:"Bueno, tendiendo a inestable",e:"Bueno, posibles chubascos",f:"Bastante bueno, mejorando",g:"Bastante bueno, posibles chubascos al principio",h:"Bastante bueno, chubascos más tarde",i:"Chubascos al principio, mejorando",j:"Variable, mejorando",k:"Bastante bueno, chubascos probables",l:"Algo inestable, despejando más tarde",m:"Inestable, probable mejora",n:"Chubascos con claros",o:"Chubascos, tendiendo a inestable",p:"Variable, algo de lluvia",q:"Inestable, breves intervalos buenos",r:"Inestable, lluvia más tarde",s:"Inestable, algo de lluvia",t:"Muy inestable en general",u:"Lluvia ocasional, empeorando",v:"Lluvia a ratos, muy inestable",w:"Lluvia a intervalos frecuentes",x:"Lluvia, muy inestable",y:"Tormentoso, posible mejora",z:"Tormentoso, mucha lluvia"},editor:{global_options:"Opciones globales",overview_section:"Sección de resumen",extended_section:"Sección extendida",slots_section:"Sección de ranuras",daily_forecast_section:"Pronóstico diario",wind_bearing_icon:"Flecha de dirección del viento",slot_tap_more_info:"Tocar un valor abre el historial",moon_icon_only:"Fase lunar: solo icono",local_forecast:"Pronóstico local (Zambretti)",entity_uv_today:"Pronóstico UV (hoy)",entity_fire_today:"Peligro de incendio (hoy)",daily_forecast_date:"Fecha junto al día",local_forecast_verbose:"Texto de pronóstico detallado",forecast_altitude:"Altitud de la estación (m)",forecast_altitude_hint:"Dejar vacío si el sensor informa presión relativa (nivel del mar)",compact_slots:"Etiquetas compactas",show_static_icons:"Iconos estáticos",time_format:"Formato de hora",locale:"Idioma",icon_pack:"Paquete de iconos",opt_locale_auto:"Automático (navegador)",actions:"Acciones",tap_action:"Acción al tocar",hold_action:"Acción al mantener",double_tap_action:"Doble toque",icon_pack_default:"Predeterminado (animado integrado)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (requiere weather-chart-card)",icon_pack_custom:"Ruta personalizada...",icon_path:"Ruta del icono",icon_path_hint:"Use {condition} como marcador — ej. /local/icons/{condition}.svg",overview_layout:"Diseño del resumen",card_title_1:"Título de tarjeta línea 1",card_title_2:"Título de tarjeta línea 2",entity_temperature:"Entidad temperatura actual",entity_apparent_temp:"Entidad sensación térmica",entity_forecast_icon:"Entidad icono de pronóstico",entity_forecast_icon_1:"Entidad icono de pronóstico 1",entity_summary:"Entidad resumen de pronóstico",entity_summary_1:"Entidad resumen de pronóstico 1",entity_extended:"Entidad pronóstico extendido",entity_extended_1:"Entidad pronóstico extendido 1",use_attribute:"Usar atributo",attribute:"Atributo",slot_l1:"Ranura izquierda 1",slot_l2:"Ranura izquierda 2",slot_l3:"Ranura izquierda 3",slot_l4:"Ranura izquierda 4",slot_l5:"Ranura izquierda 5",slot_l6:"Ranura izquierda 6",slot_l7:"Ranura izquierda 7",slot_l8:"Ranura izquierda 8",slot_r1:"Ranura derecha 1",slot_r2:"Ranura derecha 2",slot_r3:"Ranura derecha 3",slot_r4:"Ranura derecha 4",slot_r5:"Ranura derecha 5",slot_r6:"Ranura derecha 6",slot_r7:"Ranura derecha 7",slot_r8:"Ranura derecha 8",today_temp_decimals:"Decimales de temperatura de hoy",today_rain_decimals:"Decimales de lluvia de hoy",forecast_temp_decimals:"Decimales de temperatura prevista",pressure_decimals:"Decimales de presión",show_separator:"Mostrar separador",show_temp_decimals:"Mostrar decimales de temperatura",entity_humidity:"Humedad",entity_pressure:"Presión atmosférica",entity_pressure_trend:"Entidad tendencia de presión (opcional — sensor derivative/trend)",entity_pop:"Probabilidad de lluvia",entity_pos:"Lluvia posible hoy",entity_2day_pos:"Lluvia posible mañana",entity_rainfall:"Lluvia de hoy",entity_fire_danger:"Peligro de incendio",entity_uv_summary:"Alerta UV",entity_sun:"Entidad sol",entity_moon:"Entidad fase lunar",entity_visibility:"Entidad visibilidad",entity_wind_speed:"Entidad velocidad del viento",entity_wind_bearing:"Entidad dirección del viento",entity_wind_gust:"Entidad rachas",entity_wind_speed_kt:"Entidad velocidad del viento (kt)",entity_wind_gust_kt:"Entidad rachas (kt)",entity_update_time:"Entidad hora de actualización",update_time_prefix:"Prefijo hora de actualización",entity_observed_max:"Entidad máx. observado",entity_observed_min:"Entidad mín. observado",entity_forecast_max:"Entidad máx. previsto",entity_forecast_max_1:"Entidad máx. previsto 1",entity_forecast_min:"Entidad mín. previsto",entity_forecast_min_1:"Entidad mín. previsto 1",entity_temp_next:"Entidad próxima temperatura",entity_temp_next_label:"Etiqueta próxima temperatura",entity_temp_following:"Entidad temperatura siguiente",entity_temp_fol_label:"Etiqueta temperatura siguiente",entity_fire_danger_1:"Entidad peligro de incendio 1",entity_pop_1:"Entidad probabilidad de lluvia 1",entity_pos_1:"Entidad lluvia posible 1",custom1_value:"Personalizado valor 1",custom2_value:"Personalizado valor 2",custom3_value:"Personalizado valor 3",custom4_value:"Personalizado valor 4",custom1_icon:"Personalizado icono 1",custom2_icon:"Personalizado icono 2",custom3_icon:"Personalizado icono 3",custom4_icon:"Personalizado icono 4",custom1_units:"Personalizado unidades 1",custom2_units:"Personalizado unidades 2",custom3_units:"Personalizado unidades 3",custom4_units:"Personalizado unidades 4",custom1_label:"Personalizado etiqueta (opcional) 1",custom2_label:"Personalizado etiqueta (opcional) 2",custom3_label:"Personalizado etiqueta (opcional) 3",custom4_label:"Personalizado etiqueta (opcional) 4",weather_entity:"Entidad meteorológica con pronósticos",forecast_type:"Tipo de pronóstico",daily_forecast_layout:"Diseño del pronóstico diario",daily_forecast_days:"Días del pronóstico diario",daily_extended_days:"Días del pronóstico extendido",show_forecast_pop:"Probabilidad de precipitación en el pronóstico",show_forecast_wind:"Viento en el pronóstico",show_gust_in_wind:"Rachas en la ranura de viento",colour_fire_danger:"Colorear peligro de incendio",include_today:"Incluir hoy en el pronóstico",show_temp_chart:"Mostrar gráfico de temperatura",show_precip_chart:"Mostrar gráfico de precipitación",forecast_tooltips:"Activar información emergente",charts_section:"Sección de gráficos",opt_daily:"Diario",opt_hourly:"Cada hora",opt_twice_daily:"Dos veces al día",opt_horizontal:"Horizontal",opt_vertical:"Vertical",opt_complete:"Completo",opt_observations:"Observaciones",opt_forecast:"Pronóstico",opt_title_only:"Solo título",opt_system:"Sistema",opt_12hour:"12 horas",opt_24hour:"24 horas"},card:{uv_rating:"UV",feels_like:"Sensación",observed_max:"Observado Max",observed_min:"Observado Min",obs_max:"Obs Max",obs_min:"Obs Min",forecast_max:"Máx hoy",forecast_max_compact:"Máx",forecast_min_compact:"Mín",forecast_min:"Mín hoy",pos_today:"Previsión",pos_tomorrow:"Prev mañana",fore:"Prev",u_v_rating:"UV",fire_danger:"Fuego",gust:"Ráfaga",pos_tomorrow_compact:"Mañ"},moonPhases:{new_moon:"Luna nueva",waxing_crescent:"Creciente",first_quarter:"Cuarto creciente",waxing_gibbous:"Luna creciente",full_moon:"Luna llena",waning_gibbous:"Luna menguante",last_quarter:"Cuarto menguante",waning_crescent:"Menguante"},windDirections:["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"]},fr:{zambrettiLong:{a:"Le temps restera stable et beau.",b:"Du beau temps est attendu.",c:"Le temps devrait s'éclaircir et devenir beau.",d:"Beau au début, mais devenant progressivement instable.",e:"Généralement beau avec un risque d'averses passagères.",f:"Assez beau temps avec une tendance à l'amélioration.",g:"Assez beau, avec des averses possibles au début.",h:"Assez beau, avec des averses attendues plus tard.",i:"Averses au début, puis le temps s'améliorera.",j:"Temps variable avec une tendance à l'amélioration.",k:"Assez beau, mais des averses sont probables.",l:"Temps plutôt instable, s'éclaircissant plus tard.",m:"Temps instable qui devrait s'améliorer.",n:"Averses alternant avec de belles éclaircies.",o:"Averses, le temps se dégradant progressivement.",p:"Temps variable avec un peu de pluie par endroits.",q:"Temps instable avec de brèves éclaircies.",r:"Temps instable, avec de la pluie attendue plus tard.",s:"Temps instable avec de la pluie par moments.",t:"Temps très instable dans l'ensemble.",u:"Pluie occasionnelle avec des conditions se dégradant.",v:"Pluie par moments, le temps reste très instable.",w:"Épisodes de pluie fréquents.",x:"Temps pluvieux et très instable.",y:"Temps orageux avec une possibilité d'amélioration.",z:"Temps orageux avec de fortes pluies.",rising:"La pression est en hausse.",steady:"La pression est stable.",falling:"La pression est en baisse."},zambretti:{a:"Beau temps établi",b:"Beau temps",c:"Amélioration, éclaircies",d:"Beau, devenant instable",e:"Beau, averses possibles",f:"Assez beau, en amélioration",g:"Assez beau, averses possibles au début",h:"Assez beau, averses plus tard",i:"Averses au début, amélioration",j:"Variable, en amélioration",k:"Assez beau, averses probables",l:"Plutôt instable, éclaircies plus tard",m:"Instable, amélioration probable",n:"Averses, belles éclaircies",o:"Averses, devenant instable",p:"Variable, un peu de pluie",q:"Instable, brèves éclaircies",r:"Instable, pluie plus tard",s:"Instable, un peu de pluie",t:"Très instable dans l'ensemble",u:"Pluie occasionnelle, dégradation",v:"Pluie par moments, très instable",w:"Pluie à intervalles fréquents",x:"Pluie, très instable",y:"Orageux, amélioration possible",z:"Orageux, pluie abondante"},editor:{global_options:"Options globales",overview_section:"Section vue d'ensemble",extended_section:"Section étendue",slots_section:"Section des emplacements",daily_forecast_section:"Prévisions quotidiennes",wind_bearing_icon:"Flèche de direction du vent",slot_tap_more_info:"Toucher une valeur ouvre l'historique",moon_icon_only:"Phase de lune : icône seule",local_forecast:"Prévision locale (Zambretti)",entity_uv_today:"Prévision UV (aujourd'hui)",entity_fire_today:"Danger d'incendie (aujourd'hui)",daily_forecast_date:"Date à côté du jour",local_forecast_verbose:"Texte de prévision détaillé",forecast_altitude:"Altitude de la station (m)",forecast_altitude_hint:"Laisser vide si le capteur fournit une pression relative (niveau de la mer)",compact_slots:"Libellés compacts",show_static_icons:"Icônes statiques",time_format:"Format horaire",locale:"Langue",icon_pack:"Pack d'icônes",opt_locale_auto:"Automatique (navigateur)",actions:"Actions",tap_action:"Action au toucher",hold_action:"Action maintenue",double_tap_action:"Double toucher",icon_pack_default:"Par défaut (animé intégré)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (nécessite weather-chart-card)",icon_pack_custom:"Chemin personnalisé...",icon_path:"Chemin d'icône",icon_path_hint:"Utilisez {condition} comme espace réservé — ex. /local/icons/{condition}.svg",overview_layout:"Disposition de la vue d'ensemble",card_title_1:"Titre de la carte ligne 1",card_title_2:"Titre de la carte ligne 2",entity_temperature:"Entité température actuelle",entity_apparent_temp:"Entité température ressentie",entity_forecast_icon:"Entité icône de prévision",entity_forecast_icon_1:"Entité icône de prévision 1",entity_summary:"Entité résumé de prévision",entity_summary_1:"Entité résumé de prévision 1",entity_extended:"Entité prévision étendue",entity_extended_1:"Entité prévision étendue 1",use_attribute:"Utiliser l'attribut",attribute:"Attribut",slot_l1:"Emplacement gauche 1",slot_l2:"Emplacement gauche 2",slot_l3:"Emplacement gauche 3",slot_l4:"Emplacement gauche 4",slot_l5:"Emplacement gauche 5",slot_l6:"Emplacement gauche 6",slot_l7:"Emplacement gauche 7",slot_l8:"Emplacement gauche 8",slot_r1:"Emplacement droit 1",slot_r2:"Emplacement droit 2",slot_r3:"Emplacement droit 3",slot_r4:"Emplacement droit 4",slot_r5:"Emplacement droit 5",slot_r6:"Emplacement droit 6",slot_r7:"Emplacement droit 7",slot_r8:"Emplacement droit 8",today_temp_decimals:"Décimales température du jour",today_rain_decimals:"Décimales pluie du jour",forecast_temp_decimals:"Décimales température prévue",pressure_decimals:"Décimales pression",show_separator:"Afficher le séparateur",show_temp_decimals:"Afficher les décimales de température",entity_humidity:"Humidité",entity_pressure:"Pression atmosphérique",entity_pressure_trend:"Entité tendance de pression (optionnel — capteur derivative/trend)",entity_pop:"Risque de pluie",entity_pos:"Pluie possible aujourd'hui",entity_2day_pos:"Pluie possible demain",entity_rainfall:"Pluie du jour",entity_fire_danger:"Risque d'incendie",entity_uv_summary:"Alerte UV",entity_sun:"Entité soleil",entity_moon:"Entité phase de lune",entity_visibility:"Entité visibilité",entity_wind_speed:"Entité vitesse du vent",entity_wind_bearing:"Entité direction du vent",entity_wind_gust:"Entité rafales",entity_wind_speed_kt:"Entité vitesse du vent (kt)",entity_wind_gust_kt:"Entité rafales (kt)",entity_update_time:"Entité heure de mise à jour",update_time_prefix:"Préfixe heure de mise à jour",entity_observed_max:"Entité max observé",entity_observed_min:"Entité min observé",entity_forecast_max:"Entité max prévu",entity_forecast_max_1:"Entité max prévu 1",entity_forecast_min:"Entité min prévu",entity_forecast_min_1:"Entité min prévu 1",entity_temp_next:"Entité température suivante",entity_temp_next_label:"Libellé température suivante",entity_temp_following:"Entité température d'après",entity_temp_fol_label:"Libellé température d'après",entity_fire_danger_1:"Entité risque d'incendie 1",entity_pop_1:"Entité risque de pluie 1",entity_pos_1:"Entité pluie possible 1",custom1_value:"Personnalisé valeur 1",custom2_value:"Personnalisé valeur 2",custom3_value:"Personnalisé valeur 3",custom4_value:"Personnalisé valeur 4",custom1_icon:"Personnalisé icône 1",custom2_icon:"Personnalisé icône 2",custom3_icon:"Personnalisé icône 3",custom4_icon:"Personnalisé icône 4",custom1_units:"Personnalisé unités 1",custom2_units:"Personnalisé unités 2",custom3_units:"Personnalisé unités 3",custom4_units:"Personnalisé unités 4",custom1_label:"Personnalisé libellé (optionnel) 1",custom2_label:"Personnalisé libellé (optionnel) 2",custom3_label:"Personnalisé libellé (optionnel) 3",custom4_label:"Personnalisé libellé (optionnel) 4",weather_entity:"Entité météo avec prévisions",forecast_type:"Type de prévision",daily_forecast_layout:"Disposition des prévisions quotidiennes",daily_forecast_days:"Jours de prévision quotidienne",daily_extended_days:"Jours de prévision étendue",show_forecast_pop:"Probabilité de précipitations dans les prévisions",show_forecast_wind:"Vent dans les prévisions",show_gust_in_wind:"Rafales dans l'emplacement vent",colour_fire_danger:"Colorer le risque d'incendie",include_today:"Inclure aujourd'hui dans les prévisions",show_temp_chart:"Afficher le graphique de température",show_precip_chart:"Afficher le graphique de précipitations",forecast_tooltips:"Activer les infobulles de prévision",charts_section:"Section graphiques",opt_daily:"Quotidien",opt_hourly:"Horaire",opt_twice_daily:"Deux fois par jour",opt_horizontal:"Horizontal",opt_vertical:"Vertical",opt_complete:"Complet",opt_observations:"Observations",opt_forecast:"Prévisions",opt_title_only:"Titre seul",opt_system:"Système",opt_12hour:"12 heures",opt_24hour:"24 heures"},card:{uv_rating:"UV",feels_like:"Ressenti",observed_max:"Observé Max",observed_min:"Observé Min",obs_max:"Obs Max",obs_min:"Obs Min",forecast_max:"Max aujourd'hui",forecast_max_compact:"Max",forecast_min_compact:"Min",forecast_min:"Min aujourd'hui",pos_today:"Prévoir",pos_tomorrow:"Prév demain",fore:"Prév",u_v_rating:"UV",fire_danger:"Feu",gust:"Rafale",pos_tomorrow_compact:"Dem"},moonPhases:{new_moon:"Nouvelle lune",waxing_crescent:"Croissant",first_quarter:"Premier quartier",waxing_gibbous:"Lune croissante",full_moon:"Pleine lune",waning_gibbous:"Lune décroissante",last_quarter:"Dernier quartier",waning_crescent:"Dernier croissant"},windDirections:["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"]},he:{zambrettiLong:{a:"מזג האוויר יישאר יציב ונאה.",b:"צפוי מזג אוויר נאה.",c:"מזג האוויר צפוי להתבהר ולהשתפר.",d:"נאה בתחילה, אך בהדרגה פחות יציב.",e:"נאה ברובו עם סיכוי לממטרים חולפים.",f:"מזג אוויר נאה למדי עם נטייה לשיפור.",g:"נאה למדי, עם ממטרים אפשריים בתחילה.",h:"נאה למדי, עם ממטרים צפויים מאוחר יותר.",i:"ממטרים בתחילה, לאחר מכן מזג האוויר ישתפר.",j:"מזג אוויר הפכפך עם נטייה לשיפור.",k:"נאה למדי, אך ממטרים צפויים.",l:"מזג אוויר לא יציב, מתבהר מאוחר יותר.",m:"מזג אוויר לא יציב שכנראה ישתפר.",n:"ממטרים לסירוגין עם הבהרות.",o:"ממטרים, מזג האוויר מחמיר בהדרגה.",p:"מזג אוויר הפכפך עם מעט גשם מקומי.",q:"מזג אוויר לא יציב עם הבהרות קצרות.",r:"מזג אוויר לא יציב, עם גשם צפוי מאוחר יותר.",s:"מזג אוויר לא יציב עם גשם לעיתים.",t:"מזג אוויר מאוד לא יציב ברובו.",u:"גשם מדי פעם בתנאים מחמירים.",v:"גשם לעיתים, מזג האוויר נותר מאוד לא יציב.",w:"פרקי גשם תכופים.",x:"מזג אוויר גשום ומאוד לא יציב.",y:"מזג אוויר סוער עם סיכוי לשיפור.",z:"מזג אוויר סוער עם גשם כבד.",rising:"הלחץ עולה.",steady:"הלחץ יציב.",falling:"הלחץ יורד."},zambretti:{a:"מזג אוויר נאה ויציב",b:"מזג אוויר נאה",c:"מתבהר",d:"נאה, נעשה פחות יציב",e:"נאה, ייתכנו ממטרים",f:"נאה למדי, שיפור",g:"נאה למדי, ייתכנו ממטרים בתחילה",h:"נאה למדי, ממטרים מאוחר יותר",i:"ממטרים בתחילה, שיפור",j:"הפכפך, שיפור",k:"נאה למדי, ממטרים צפויים",l:"לא יציב, התבהרות מאוחר יותר",m:"לא יציב, כנראה שיפור",n:"ממטרים עם הבהרות",o:"ממטרים, נעשה פחות יציב",p:"הפכפך, מעט גשם",q:"לא יציב, הבהרות קצרות",r:"לא יציב, גשם מאוחר יותר",s:"לא יציב, מעט גשם",t:"ברובו מאוד לא יציב",u:"גשם מדי פעם, החמרה",v:"גשם לעיתים, מאוד לא יציב",w:"גשם לעיתים קרובות",x:"גשם, מאוד לא יציב",y:"סוער, ייתכן שיפור",z:"סוער, גשם רב"},editor:{global_options:"הגדרות כלליות",overview_section:"מקטע סקירה",extended_section:"מקטע מורחב",slots_section:"מקטע משבצות",daily_forecast_section:"תחזית יומית",wind_bearing_icon:"חץ כיוון הרוח",slot_tap_more_info:"הקשה על ערך פותחת היסטוריה",moon_icon_only:"מופע הירח: סמל בלבד",local_forecast:"תחזית מקומית (Zambretti)",entity_uv_today:"תחזית UV (היום)",entity_fire_today:"סכנת שריפה (היום)",daily_forecast_date:"תאריך ליד היום",local_forecast_verbose:"טקסט תחזית מפורט",forecast_altitude:"גובה התחנה (מ')",forecast_altitude_hint:"השאר ריק אם החיישן מדווח לחץ יחסי (גובה פני הים)",compact_slots:"תוויות קומפקטיות",show_static_icons:"סמלים סטטיים",time_format:"תבנית שעה",locale:"שפה",icon_pack:"חבילת סמלים",opt_locale_auto:"אוטומטי (דפדפן)",actions:"פעולות",tap_action:"פעולה בלחיצה",hold_action:"פעולה בלחיצה ממושכת",double_tap_action:"פעולה בלחיצה כפולה",icon_pack_default:"ברירת מחדל (מובנה, מונפש)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (דורש weather-chart-card)",icon_pack_custom:"נתיב מותאם אישית...",icon_path:"נתיב סמל",icon_path_hint:"השתמשו ב-{condition} כממלא מקום — למשל /local/icons/{condition}.svg",overview_layout:"פריסת סקירה",card_title_1:"כותרת כרטיס שורה 1",card_title_2:"כותרת כרטיס שורה 2",entity_temperature:"ישות טמפרטורה נוכחית",entity_apparent_temp:"ישות טמפרטורה מורגשת",entity_forecast_icon:"ישות סמל תחזית",entity_forecast_icon_1:"ישות סמל תחזית 1",entity_summary:"ישות תקציר תחזית",entity_summary_1:"ישות תקציר תחזית 1",entity_extended:"ישות תחזית מורחבת",entity_extended_1:"ישות תחזית מורחבת 1",use_attribute:"שימוש בתכונה",attribute:"תכונה",slot_l1:"משבצת שמאל 1",slot_l2:"משבצת שמאל 2",slot_l3:"משבצת שמאל 3",slot_l4:"משבצת שמאל 4",slot_l5:"משבצת שמאל 5",slot_l6:"משבצת שמאל 6",slot_l7:"משבצת שמאל 7",slot_l8:"משבצת שמאל 8",slot_r1:"משבצת ימין 1",slot_r2:"משבצת ימין 2",slot_r3:"משבצת ימין 3",slot_r4:"משבצת ימין 4",slot_r5:"משבצת ימין 5",slot_r6:"משבצת ימין 6",slot_r7:"משבצת ימין 7",slot_r8:"משבצת ימין 8",today_temp_decimals:"ספרות עשרוניות טמפרטורת היום",today_rain_decimals:"ספרות עשרוניות גשם היום",forecast_temp_decimals:"ספרות עשרוניות טמפרטורת תחזית",pressure_decimals:"ספרות עשרוניות לחץ",show_separator:"הצג מפריד",show_temp_decimals:"הצג ספרות עשרוניות של טמפרטורה",entity_humidity:"לחות",entity_pressure:"לחץ אטמוספרי",entity_pressure_trend:"ישות מגמת לחץ (אופציונלי — חיישן derivative/trend)",entity_pop:"סיכוי לגשם",entity_pos:"גשם אפשרי היום",entity_2day_pos:"גשם אפשרי מחר",entity_rainfall:"גשם היום",entity_fire_danger:"סכנת שריפה",entity_uv_summary:"התראת UV",entity_sun:"ישות שמש",entity_moon:"ישות שלב ירח",entity_visibility:"ישות ראות",entity_wind_speed:"ישות מהירות רוח",entity_wind_bearing:"ישות כיוון רוח",entity_wind_gust:"ישות משבי רוח",entity_wind_speed_kt:"ישות מהירות רוח (kt)",entity_wind_gust_kt:"ישות משבי רוח (kt)",entity_update_time:"ישות זמן עדכון",update_time_prefix:"קידומת זמן עדכון",entity_observed_max:"ישות מקסימום שנצפה",entity_observed_min:"ישות מינימום שנצפה",entity_forecast_max:"ישות מקסימום תחזית",entity_forecast_max_1:"ישות מקסימום תחזית 1",entity_forecast_min:"ישות מינימום תחזית",entity_forecast_min_1:"ישות מינימום תחזית 1",entity_temp_next:"ישות טמפרטורה הבאה",entity_temp_next_label:"תווית טמפרטורה הבאה",entity_temp_following:"ישות טמפרטורה שלאחריה",entity_temp_fol_label:"תווית טמפרטורה שלאחריה",entity_fire_danger_1:"ישות סכנת שריפה 1",entity_pop_1:"ישות סיכוי לגשם 1",entity_pos_1:"ישות גשם אפשרי 1",custom1_value:"ערך מותאם 1",custom2_value:"ערך מותאם 2",custom3_value:"ערך מותאם 3",custom4_value:"ערך מותאם 4",custom1_icon:"סמל מותאם 1",custom2_icon:"סמל מותאם 2",custom3_icon:"סמל מותאם 3",custom4_icon:"סמל מותאם 4",custom1_units:"יחידות מותאמות 1",custom2_units:"יחידות מותאמות 2",custom3_units:"יחידות מותאמות 3",custom4_units:"יחידות מותאמות 4",custom1_label:"תווית מותאמת (אופציונלי) 1",custom2_label:"תווית מותאמת (אופציונלי) 2",custom3_label:"תווית מותאמת (אופציונלי) 3",custom4_label:"תווית מותאמת (אופציונלי) 4",weather_entity:"ישות מזג אוויר עם תחזיות",forecast_type:"סוג תחזית",daily_forecast_layout:"פריסת תחזית יומית",daily_forecast_days:"ימי תחזית יומית",daily_extended_days:"ימי תחזית מורחבת",show_forecast_pop:"הצג הסתברות משקעים בתחזית",show_forecast_wind:"הצג רוח בתחזית",show_gust_in_wind:"הצג משבים במשבצת הרוח",colour_fire_danger:"צביעת סכנת שריפה",include_today:"כלול את היום בתחזית",show_temp_chart:"הצג תרשים טמפרטורה",show_precip_chart:"הצג תרשים משקעים",forecast_tooltips:"הפעל חלוניות תחזית",charts_section:"מקטע תרשימים",opt_daily:"יומי",opt_hourly:"שעתי",opt_twice_daily:"פעמיים ביום",opt_horizontal:"אופקי",opt_vertical:"אנכי",opt_complete:"מלא",opt_observations:"תצפיות",opt_forecast:"תחזית",opt_title_only:"כותרת בלבד",opt_system:"מערכת",opt_12hour:"12 שעות",opt_24hour:"24 שעות"},card:{uv_rating:"UV",feels_like:"מרגיש כמו",observed_max:"נצפה מקסימום",observed_min:"נצפה מינימום",obs_max:"נצפה מקס",obs_min:"נצפה מינ",forecast_max:"מקסימלי היום",forecast_min:"דקות היום",pos_today:"תַחֲזִית",pos_tomorrow:"תחזית מחר",fore:"תַחֲזִית",u_v_rating:"UV",fire_danger:"אֵשׁ",gust:"נשיבה",forecast_max_compact:"מקס",forecast_min_compact:"מינ",pos_tomorrow_compact:"מחר"},moonPhases:{new_moon:"ירח חדש",waxing_crescent:"סהר בגדילה",first_quarter:"רבע ראשון",waxing_gibbous:"ירח גדל",full_moon:"ירח מלא",waning_gibbous:"ירח קטן",last_quarter:"רבע אחרון",waning_crescent:"סהר בקטנה"},windDirections:["צפון","צ-צ-מז","צפון מזרח","מז-צ-מז","מזרח","מז-ד-מז","דרום מזרח","ד-ד-מז","דרום","ד-ד-מע","דרום מערב","מע-ד-מע","מערב","מע-צ-מע","צפון מערב","צ-צ-מע","צפון"],units:{"km/h":'קמ"ש',mm:'מ"מ'}},it:{zambrettiLong:{a:"Il tempo rimarrà stabile e bello.",b:"È previsto bel tempo.",c:"Il tempo dovrebbe schiarirsi e migliorare.",d:"Bello all'inizio, ma gradualmente più instabile.",e:"Prevalentemente bello con possibilità di rovesci passeggeri.",f:"Tempo abbastanza bello con tendenza al miglioramento.",g:"Abbastanza bello, con possibili rovesci all'inizio.",h:"Abbastanza bello, con rovesci attesi più tardi.",i:"Rovesci all'inizio, poi il tempo migliorerà.",j:"Tempo variabile con tendenza al miglioramento.",k:"Abbastanza bello, ma i rovesci sono probabili.",l:"Tempo piuttosto instabile, con schiarite più tardi.",m:"Tempo instabile che probabilmente migliorerà.",n:"Rovesci alternati a schiarite.",o:"Rovesci, con il tempo in graduale peggioramento.",p:"Tempo variabile con qualche pioggia a tratti.",q:"Tempo instabile con brevi schiarite.",r:"Tempo instabile, con pioggia attesa più tardi.",s:"Tempo instabile con pioggia a tratti.",t:"Tempo molto instabile nel complesso.",u:"Pioggia occasionale con condizioni in peggioramento.",v:"Pioggia a tratti, il tempo resta molto instabile.",w:"Frequenti episodi di pioggia.",x:"Tempo piovoso e molto instabile.",y:"Tempo tempestoso con possibilità di miglioramento.",z:"Tempo tempestoso con piogge abbondanti.",rising:"La pressione è in aumento.",steady:"La pressione è stabile.",falling:"La pressione è in calo."},zambretti:{a:"Bello stabile",b:"Bel tempo",c:"In miglioramento, schiarite",d:"Bello, tendente a instabile",e:"Bello, possibili rovesci",f:"Abbastanza bello, in miglioramento",g:"Abbastanza bello, possibili rovesci iniziali",h:"Abbastanza bello, rovesci più tardi",i:"Rovesci iniziali, in miglioramento",j:"Variabile, in miglioramento",k:"Abbastanza bello, rovesci probabili",l:"Piuttosto instabile, schiarite più tardi",m:"Instabile, probabile miglioramento",n:"Rovesci con schiarite",o:"Rovesci, tendente a instabile",p:"Variabile, qualche pioggia",q:"Instabile, brevi schiarite",r:"Instabile, pioggia più tardi",s:"Instabile, qualche pioggia",t:"Prevalentemente molto instabile",u:"Pioggia occasionale, in peggioramento",v:"Pioggia a tratti, molto instabile",w:"Pioggia a intervalli frequenti",x:"Pioggia, molto instabile",y:"Tempestoso, possibile miglioramento",z:"Tempestoso, molta pioggia"},editor:{global_options:"Opzioni globali",overview_section:"Sezione panoramica",extended_section:"Sezione estesa",slots_section:"Sezione slot",daily_forecast_section:"Previsioni giornaliere",wind_bearing_icon:"Freccia direzione vento",slot_tap_more_info:"Tocca un valore per aprire la cronologia",moon_icon_only:"Fase lunare: solo icona",local_forecast:"Previsione locale (Zambretti)",entity_uv_today:"Previsione UV (oggi)",entity_fire_today:"Pericolo di incendio (oggi)",daily_forecast_date:"Data accanto al giorno",local_forecast_verbose:"Testo di previsione esteso",forecast_altitude:"Altitudine della stazione (m)",forecast_altitude_hint:"Lasciare vuoto se il sensore riporta la pressione relativa (livello del mare)",compact_slots:"Etichette compatte",show_static_icons:"Icone statiche",time_format:"Formato ora",locale:"Lingua",icon_pack:"Pacchetto icone",opt_locale_auto:"Automatico (browser)",actions:"Azioni",tap_action:"Azione al tocco",hold_action:"Azione prolungata",double_tap_action:"Doppio tocco",icon_pack_default:"Predefinito (animato integrato)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (richiede weather-chart-card)",icon_pack_custom:"Percorso personalizzato...",icon_path:"Percorso icona",icon_path_hint:"Usa {condition} come segnaposto — es. /local/icons/{condition}.svg",overview_layout:"Layout panoramica",card_title_1:"Titolo scheda riga 1",card_title_2:"Titolo scheda riga 2",entity_temperature:"Entità temperatura attuale",entity_apparent_temp:"Entità temperatura percepita",entity_forecast_icon:"Entità icona previsione",entity_forecast_icon_1:"Entità icona previsione 1",entity_summary:"Entità riepilogo previsione",entity_summary_1:"Entità riepilogo previsione 1",entity_extended:"Entità previsione estesa",entity_extended_1:"Entità previsione estesa 1",use_attribute:"Usa attributo",attribute:"Attributo",slot_l1:"Slot sinistro 1",slot_l2:"Slot sinistro 2",slot_l3:"Slot sinistro 3",slot_l4:"Slot sinistro 4",slot_l5:"Slot sinistro 5",slot_l6:"Slot sinistro 6",slot_l7:"Slot sinistro 7",slot_l8:"Slot sinistro 8",slot_r1:"Slot destro 1",slot_r2:"Slot destro 2",slot_r3:"Slot destro 3",slot_r4:"Slot destro 4",slot_r5:"Slot destro 5",slot_r6:"Slot destro 6",slot_r7:"Slot destro 7",slot_r8:"Slot destro 8",today_temp_decimals:"Decimali temperatura odierna",today_rain_decimals:"Decimali pioggia odierna",forecast_temp_decimals:"Decimali temperatura prevista",pressure_decimals:"Decimali pressione",show_separator:"Mostra separatore",show_temp_decimals:"Mostra decimali temperatura",entity_humidity:"Umidità",entity_pressure:"Pressione atmosferica",entity_pressure_trend:"Entità tendenza pressione (opzionale — sensore derivative/trend)",entity_pop:"Probabilità di pioggia",entity_pos:"Pioggia possibile oggi",entity_2day_pos:"Pioggia possibile domani",entity_rainfall:"Pioggia di oggi",entity_fire_danger:"Pericolo incendi",entity_uv_summary:"Allerta UV",entity_sun:"Entità sole",entity_moon:"Entità fase lunare",entity_visibility:"Entità visibilità",entity_wind_speed:"Entità velocità vento",entity_wind_bearing:"Entità direzione vento",entity_wind_gust:"Entità raffiche",entity_wind_speed_kt:"Entità velocità vento (kt)",entity_wind_gust_kt:"Entità raffiche (kt)",entity_update_time:"Entità ora aggiornamento",update_time_prefix:"Prefisso ora aggiornamento",entity_observed_max:"Entità max osservato",entity_observed_min:"Entità min osservato",entity_forecast_max:"Entità max previsto",entity_forecast_max_1:"Entità max previsto 1",entity_forecast_min:"Entità min previsto",entity_forecast_min_1:"Entità min previsto 1",entity_temp_next:"Entità prossima temperatura",entity_temp_next_label:"Etichetta prossima temperatura",entity_temp_following:"Entità temperatura successiva",entity_temp_fol_label:"Etichetta temperatura successiva",entity_fire_danger_1:"Entità pericolo incendi 1",entity_pop_1:"Entità probabilità di pioggia 1",entity_pos_1:"Entità pioggia possibile 1",custom1_value:"Personalizzato valore 1",custom2_value:"Personalizzato valore 2",custom3_value:"Personalizzato valore 3",custom4_value:"Personalizzato valore 4",custom1_icon:"Personalizzato icona 1",custom2_icon:"Personalizzato icona 2",custom3_icon:"Personalizzato icona 3",custom4_icon:"Personalizzato icona 4",custom1_units:"Personalizzato unità 1",custom2_units:"Personalizzato unità 2",custom3_units:"Personalizzato unità 3",custom4_units:"Personalizzato unità 4",custom1_label:"Personalizzato etichetta (opzionale) 1",custom2_label:"Personalizzato etichetta (opzionale) 2",custom3_label:"Personalizzato etichetta (opzionale) 3",custom4_label:"Personalizzato etichetta (opzionale) 4",weather_entity:"Entità meteo con previsioni",forecast_type:"Tipo di previsione",daily_forecast_layout:"Layout previsioni giornaliere",daily_forecast_days:"Giorni previsioni giornaliere",daily_extended_days:"Giorni previsioni estese",show_forecast_pop:"Probabilità di precipitazioni nelle previsioni",show_forecast_wind:"Vento nelle previsioni",show_gust_in_wind:"Raffiche nello slot vento",colour_fire_danger:"Colora pericolo incendi",include_today:"Includi oggi nelle previsioni",show_temp_chart:"Mostra grafico temperatura",show_precip_chart:"Mostra grafico precipitazioni",forecast_tooltips:"Attiva tooltip previsioni",charts_section:"Sezione grafici",opt_daily:"Giornaliero",opt_hourly:"Orario",opt_twice_daily:"Due volte al giorno",opt_horizontal:"Orizzontale",opt_vertical:"Verticale",opt_complete:"Completo",opt_observations:"Osservazioni",opt_forecast:"Previsioni",opt_title_only:"Solo titolo",opt_system:"Sistema",opt_12hour:"12 ore",opt_24hour:"24 ore"},card:{uv_rating:"UV",feels_like:"Percepito",observed_max:"Osservata Max",observed_min:"Osservata Min",obs_max:"Oss Max",obs_min:"Oss Min",forecast_max:"Max oggi",forecast_max_compact:"Max",forecast_min_compact:"Min",forecast_min:"Min oggi",pos_today:"Previsione",pos_tomorrow:"Prev per domani",fore:"Prev",u_v_rating:"UV",fire_danger:"Fuoco",gust:"Raffica",pos_tomorrow_compact:"Dom"},moonPhases:{new_moon:"Luna nuova",waxing_crescent:"Luna crescente",first_quarter:"Primo quarto",waxing_gibbous:"Luna quasi piena",full_moon:"Luna piena",waning_gibbous:"Luna calante",last_quarter:"Ultimo quarto",waning_crescent:"Falce calante"},windDirections:[]},nl:{zambrettiLong:{a:"Het weer blijft bestendig en mooi.",b:"Er wordt mooi weer verwacht.",c:"Het weer klaart naar verwachting op.",d:"Eerst mooi, maar geleidelijk onbestendiger.",e:"Overwegend mooi met kans op een enkele bui.",f:"Vrij mooi weer met een neiging tot verbetering.",g:"Vrij mooi, met eerst kans op buien.",h:"Vrij mooi, later worden buien verwacht.",i:"Eerst buien, daarna verbetert het weer.",j:"Wisselvallig weer met een neiging tot verbetering.",k:"Vrij mooi, maar buien zijn waarschijnlijk.",l:"Vrij onbestendig weer, later opklarend.",m:"Onbestendig weer dat waarschijnlijk verbetert.",n:"Buien afgewisseld met opklaringen.",o:"Buien, het weer verslechtert geleidelijk.",p:"Wisselvallig weer met plaatselijk wat regen.",q:"Onbestendig weer met korte mooie perioden.",r:"Onbestendig weer, later wordt regen verwacht.",s:"Onbestendig weer met af en toe regen.",t:"Overwegend zeer onbestendig weer.",u:"Af en toe regen bij verslechterend weer.",v:"Soms regen, het weer blijft zeer onbestendig.",w:"Veelvuldig perioden met regen.",x:"Regenachtig en zeer onbestendig weer.",y:"Stormachtig weer met kans op verbetering.",z:"Stormachtig weer met veel regen.",rising:"De luchtdruk stijgt.",steady:"De luchtdruk is stabiel.",falling:"De luchtdruk daalt."},zambretti:{a:"Bestendig mooi",b:"Mooi weer",c:"Opklarend",d:"Mooi, wordt onbestendig",e:"Mooi, kans op buien",f:"Vrij mooi, verbeterend",g:"Vrij mooi, eerst kans op buien",h:"Vrij mooi, later buien",i:"Eerst buien, verbeterend",j:"Wisselvallig, verbeterend",k:"Vrij mooi, buien waarschijnlijk",l:"Vrij onbestendig, later opklarend",m:"Onbestendig, waarschijnlijk verbetering",n:"Buien met opklaringen",o:"Buien, wordt onbestendig",p:"Wisselvallig, wat regen",q:"Onbestendig, korte mooie perioden",r:"Onbestendig, later regen",s:"Onbestendig, wat regen",t:"Overwegend zeer onbestendig",u:"Af en toe regen, verslechterend",v:"Soms regen, zeer onbestendig",w:"Regen met korte tussenpozen",x:"Regen, zeer onbestendig",y:"Stormachtig, mogelijk verbetering",z:"Stormachtig, veel regen"},editor:{global_options:"Globale opties",overview_section:"Overzichtssectie",extended_section:"Uitgebreide sectie",slots_section:"Slots-sectie",daily_forecast_section:"Dagelijkse voorspelling",wind_bearing_icon:"Windrichtingspijl",slot_tap_more_info:"Tik op waarde opent geschiedenis",moon_icon_only:"Maanfase: alleen pictogram",local_forecast:"Lokale voorspelling (Zambretti)",entity_uv_today:"UV-verwachting (vandaag)",entity_fire_today:"Brandgevaar (vandaag)",daily_forecast_date:"Datum naast de dag",local_forecast_verbose:"Uitgebreide voorspellingstekst",forecast_altitude:"Hoogte van het station (m)",forecast_altitude_hint:"Leeg laten als de sensor relatieve druk (zeeniveau) rapporteert",compact_slots:"Compacte labels",show_static_icons:"Statische pictogrammen",time_format:"Tijdformaat",locale:"Taal",icon_pack:"Pictogrampakket",opt_locale_auto:"Automatisch (browser)",actions:"Acties",tap_action:"Tik-actie",hold_action:"Vasthoudactie",double_tap_action:"Dubbele tik-actie",icon_pack_default:"Standaard (ingebouwd, geanimeerd)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (vereist weather-chart-card)",icon_pack_custom:"Aangepast pad...",icon_path:"Pictogrampad",icon_path_hint:"Gebruik {condition} als tijdelijke aanduiding — bijv. /local/icons/{condition}.svg",overview_layout:"Overzichtsindeling",card_title_1:"Kaarttitel regel 1",card_title_2:"Kaarttitel regel 2",entity_temperature:"Entiteit huidige temperatuur",entity_apparent_temp:"Entiteit gevoelstemperatuur",entity_forecast_icon:"Entiteit voorspellingspictogram",entity_forecast_icon_1:"Entiteit voorspellingspictogram 1",entity_summary:"Entiteit voorspellingssamenvatting",entity_summary_1:"Entiteit voorspellingssamenvatting 1",entity_extended:"Entiteit uitgebreide voorspelling",entity_extended_1:"Entiteit uitgebreide voorspelling 1",use_attribute:"Attribuut gebruiken",attribute:"Attribuut",slot_l1:"Slot links 1",slot_l2:"Slot links 2",slot_l3:"Slot links 3",slot_l4:"Slot links 4",slot_l5:"Slot links 5",slot_l6:"Slot links 6",slot_l7:"Slot links 7",slot_l8:"Slot links 8",slot_r1:"Slot rechts 1",slot_r2:"Slot rechts 2",slot_r3:"Slot rechts 3",slot_r4:"Slot rechts 4",slot_r5:"Slot rechts 5",slot_r6:"Slot rechts 6",slot_r7:"Slot rechts 7",slot_r8:"Slot rechts 8",today_temp_decimals:"Decimalen temperatuur vandaag",today_rain_decimals:"Decimalen regen vandaag",forecast_temp_decimals:"Decimalen voorspelde temperatuur",pressure_decimals:"Decimalen luchtdruk",show_separator:"Scheidingslijn tonen",show_temp_decimals:"Temperatuurdecimalen tonen",entity_humidity:"Luchtvochtigheid",entity_pressure:"Luchtdruk",entity_pressure_trend:"Entiteit druktrend (optioneel — derivative/trend-sensor)",entity_pop:"Regenkans",entity_pos:"Mogelijke regen vandaag",entity_2day_pos:"Mogelijke regen morgen",entity_rainfall:"Regen vandaag",entity_fire_danger:"Brandgevaar",entity_uv_summary:"UV-waarschuwing",entity_sun:"Entiteit zon",entity_moon:"Entiteit maanfase",entity_visibility:"Entiteit zicht",entity_wind_speed:"Entiteit windsnelheid",entity_wind_bearing:"Entiteit windrichting",entity_wind_gust:"Entiteit windstoten",entity_wind_speed_kt:"Entiteit windsnelheid (kt)",entity_wind_gust_kt:"Entiteit windstoten (kt)",entity_update_time:"Entiteit bijwerktijd",update_time_prefix:"Voorvoegsel bijwerktijd",entity_observed_max:"Entiteit waargenomen max",entity_observed_min:"Entiteit waargenomen min",entity_forecast_max:"Entiteit voorspeld max",entity_forecast_max_1:"Entiteit voorspeld max 1",entity_forecast_min:"Entiteit voorspeld min",entity_forecast_min_1:"Entiteit voorspeld min 1",entity_temp_next:"Entiteit volgende temperatuur",entity_temp_next_label:"Label volgende temperatuur",entity_temp_following:"Entiteit daaropvolgende temperatuur",entity_temp_fol_label:"Label daaropvolgende temperatuur",entity_fire_danger_1:"Entiteit brandgevaar 1",entity_pop_1:"Entiteit regenkans 1",entity_pos_1:"Entiteit mogelijke regen 1",custom1_value:"Aangepast waarde 1",custom2_value:"Aangepast waarde 2",custom3_value:"Aangepast waarde 3",custom4_value:"Aangepast waarde 4",custom1_icon:"Aangepast pictogram 1",custom2_icon:"Aangepast pictogram 2",custom3_icon:"Aangepast pictogram 3",custom4_icon:"Aangepast pictogram 4",custom1_units:"Aangepast eenheden 1",custom2_units:"Aangepast eenheden 2",custom3_units:"Aangepast eenheden 3",custom4_units:"Aangepast eenheden 4",custom1_label:"Aangepast label (optioneel) 1",custom2_label:"Aangepast label (optioneel) 2",custom3_label:"Aangepast label (optioneel) 3",custom4_label:"Aangepast label (optioneel) 4",weather_entity:"Weerentiteit met voorspellingen",forecast_type:"Voorspellingstype",daily_forecast_layout:"Indeling dagelijkse voorspelling",daily_forecast_days:"Dagen dagelijkse voorspelling",daily_extended_days:"Dagen uitgebreide voorspelling",show_forecast_pop:"Neerslagkans in voorspelling tonen",show_forecast_wind:"Wind in voorspelling tonen",show_gust_in_wind:"Windstoten in wind-slot tonen",colour_fire_danger:"Brandgevaar kleuren",include_today:"Vandaag opnemen in voorspelling",show_temp_chart:"Temperatuurgrafiek tonen",show_precip_chart:"Neerslaggrafiek tonen",forecast_tooltips:"Voorspellings-tooltips inschakelen",charts_section:"Grafieksectie",opt_daily:"Dagelijks",opt_hourly:"Elk uur",opt_twice_daily:"Tweemaal daags",opt_horizontal:"Horizontaal",opt_vertical:"Verticaal",opt_complete:"Volledig",opt_observations:"Waarnemingen",opt_forecast:"Voorspelling",opt_title_only:"Alleen titel",opt_system:"Systeem",opt_12hour:"12 uur",opt_24hour:"24 uur"},card:{uv_rating:"UV",feels_like:"Voelt als",observed_max:"Opgemerkt Max",observed_min:"Opgemerkt Min",obs_max:"Opgem Max",obs_min:"Opgem Min",forecast_max:"Max vandaag",forecast_max_compact:"Max",forecast_min_compact:"Min",forecast_min:"Min vandaag",pos_today:"Prognose",pos_tomorrow:"Prog morgen",fore:"Prog",u_v_rating:"UV",fire_danger:"Brand",gust:"Windstoot",pos_tomorrow_compact:"Morgen"},moonPhases:{new_moon:"Nieuwe maan",waxing_crescent:"Wassende sikkel",first_quarter:"Eerste kwartier",waxing_gibbous:"Wassende maan",full_moon:"Volle maan",waning_gibbous:"Afnemende maan",last_quarter:"Laatste kwartier",waning_crescent:"Afnemende sikkel"},windDirections:["N","NNO","NO","ONO","O","OZO","ZO","ZZO","Z","ZZW","ZW","WZW","W","WNW","NW","NNW","N"]},pl:{zambrettiLong:{a:"Pogoda pozostanie stabilna i ładna.",b:"Oczekiwana jest ładna pogoda.",c:"Oczekuje się przejaśnień i poprawy pogody.",d:"Początkowo ładnie, ale stopniowo coraz mniej stabilnie.",e:"Przeważnie ładnie z możliwością przelotnych opadów.",f:"Dość ładna pogoda z tendencją do poprawy.",g:"Dość ładnie, początkowo możliwe przelotne opady.",h:"Dość ładnie, później spodziewane przelotne opady.",i:"Początkowo opady, potem pogoda się poprawi.",j:"Zmienna pogoda z tendencją do poprawy.",k:"Dość ładnie, ale opady są prawdopodobne.",l:"Raczej niestabilna pogoda, później przejaśnienia.",m:"Niestabilna pogoda, która prawdopodobnie się poprawi.",n:"Przelotne opady na przemian z przejaśnieniami.",o:"Przelotne opady, pogoda stopniowo się pogarsza.",p:"Zmienna pogoda, miejscami deszcz.",q:"Niestabilna pogoda z krótkimi przejaśnieniami.",r:"Niestabilna pogoda, później spodziewany deszcz.",s:"Niestabilna pogoda z okresowym deszczem.",t:"Przeważnie bardzo niestabilna pogoda.",u:"Okresami deszcz, warunki się pogarszają.",v:"Chwilami deszcz, pogoda pozostaje bardzo niestabilna.",w:"Częste opady deszczu.",x:"Deszczowa i bardzo niestabilna pogoda.",y:"Burzowa pogoda z możliwością poprawy.",z:"Burzowa pogoda z obfitymi opadami.",rising:"Ciśnienie rośnie.",steady:"Ciśnienie jest stabilne.",falling:"Ciśnienie spada."},zambretti:{a:"Trwała ładna pogoda",b:"Ładna pogoda",c:"Przejaśnienia, poprawa",d:"Ładnie, coraz mniej stabilnie",e:"Ładnie, możliwe przelotne opady",f:"Dość ładnie, poprawa",g:"Dość ładnie, początkowo możliwe opady",h:"Dość ładnie, później przelotne opady",i:"Początkowo opady, poprawa",j:"Zmiennie, poprawa",k:"Dość ładnie, prawdopodobne opady",l:"Raczej niestabilnie, później przejaśnienia",m:"Niestabilnie, prawdopodobna poprawa",n:"Przelotne opady z przejaśnieniami",o:"Przelotne opady, pogorszenie",p:"Zmiennie, miejscami deszcz",q:"Niestabilnie, krótkie przejaśnienia",r:"Niestabilnie, później deszcz",s:"Niestabilnie, okresami deszcz",t:"Przeważnie bardzo niestabilnie",u:"Okresami deszcz, pogorszenie",v:"Chwilami deszcz, bardzo niestabilnie",w:"Częste opady deszczu",x:"Deszczowo, bardzo niestabilnie",y:"Burzowo, możliwa poprawa",z:"Burzowo, obfite opady"},editor:{global_options:"Opcje globalne",overview_section:"Sekcja przeglądu",extended_section:"Sekcja rozszerzona",slots_section:"Sekcja slotów",daily_forecast_section:"Prognoza dzienna",wind_bearing_icon:"Strzałka kierunku wiatru",slot_tap_more_info:"Dotknięcie wartości otwiera historię",moon_icon_only:"Faza księżyca: tylko ikona",local_forecast:"Prognoza lokalna (Zambretti)",entity_uv_today:"Prognoza UV (dziś)",entity_fire_today:"Zagrożenie pożarowe (dziś)",daily_forecast_date:"Data obok dnia",local_forecast_verbose:"Rozbudowany tekst prognozy",forecast_altitude:"Wysokość stacji (m)",forecast_altitude_hint:"Pozostaw puste, jeśli czujnik podaje ciśnienie względne (poziom morza)",compact_slots:"Kompaktowe etykiety",show_static_icons:"Ikony statyczne",time_format:"Format czasu",locale:"Język",icon_pack:"Pakiet ikon",opt_locale_auto:"Automatycznie (przeglądarka)",actions:"Akcje",tap_action:"Akcja dotknięcia",hold_action:"Akcja przytrzymania",double_tap_action:"Podwójne dotknięcie",icon_pack_default:"Domyślny (wbudowany, animowany)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (wymaga weather-chart-card)",icon_pack_custom:"Własna ścieżka...",icon_path:"Ścieżka ikony",icon_path_hint:"Użyj {condition} jako symbolu — np. /local/icons/{condition}.svg",overview_layout:"Układ przeglądu",card_title_1:"Tytuł karty, wiersz 1",card_title_2:"Tytuł karty, wiersz 2",entity_temperature:"Encja bieżącej temperatury",entity_apparent_temp:"Encja temperatury odczuwalnej",entity_forecast_icon:"Encja ikony prognozy",entity_forecast_icon_1:"Encja ikony prognozy 1",entity_summary:"Encja podsumowania prognozy",entity_summary_1:"Encja podsumowania prognozy 1",entity_extended:"Encja prognozy rozszerzonej",entity_extended_1:"Encja prognozy rozszerzonej 1",use_attribute:"Użyj atrybutu",attribute:"Atrybut",slot_l1:"Slot lewy 1",slot_l2:"Slot lewy 2",slot_l3:"Slot lewy 3",slot_l4:"Slot lewy 4",slot_l5:"Slot lewy 5",slot_l6:"Slot lewy 6",slot_l7:"Slot lewy 7",slot_l8:"Slot lewy 8",slot_r1:"Slot prawy 1",slot_r2:"Slot prawy 2",slot_r3:"Slot prawy 3",slot_r4:"Slot prawy 4",slot_r5:"Slot prawy 5",slot_r6:"Slot prawy 6",slot_r7:"Slot prawy 7",slot_r8:"Slot prawy 8",today_temp_decimals:"Miejsca dziesiętne temperatury dziś",today_rain_decimals:"Miejsca dziesiętne opadów dziś",forecast_temp_decimals:"Miejsca dziesiętne temperatury prognozy",pressure_decimals:"Miejsca dziesiętne ciśnienia",show_separator:"Pokaż separator",show_temp_decimals:"Pokaż miejsca dziesiętne temperatury",entity_humidity:"Wilgotność",entity_pressure:"Ciśnienie atmosferyczne",entity_pressure_trend:"Encja trendu ciśnienia (opcjonalnie — czujnik derivative/trend)",entity_pop:"Prawdopodobieństwo deszczu",entity_pos:"Możliwy deszcz dziś",entity_2day_pos:"Możliwy deszcz jutro",entity_rainfall:"Dzisiejszy deszcz",entity_fire_danger:"Zagrożenie pożarowe",entity_uv_summary:"Ostrzeżenie UV",entity_sun:"Encja słońca",entity_moon:"Encja fazy księżyca",entity_visibility:"Encja widoczności",entity_wind_speed:"Encja prędkości wiatru",entity_wind_bearing:"Encja kierunku wiatru",entity_wind_gust:"Encja porywów wiatru",entity_wind_speed_kt:"Encja prędkości wiatru (kt)",entity_wind_gust_kt:"Encja porywów wiatru (kt)",entity_update_time:"Encja czasu aktualizacji",update_time_prefix:"Prefiks czasu aktualizacji",entity_observed_max:"Encja obserwowanego maks.",entity_observed_min:"Encja obserwowanego min.",entity_forecast_max:"Encja prognozowanego maks.",entity_forecast_max_1:"Encja prognozowanego maks. 1",entity_forecast_min:"Encja prognozowanego min.",entity_forecast_min_1:"Encja prognozowanego min. 1",entity_temp_next:"Encja następnej temperatury",entity_temp_next_label:"Etykieta następnej temperatury",entity_temp_following:"Encja kolejnej temperatury",entity_temp_fol_label:"Etykieta kolejnej temperatury",entity_fire_danger_1:"Encja zagrożenia pożarowego 1",entity_pop_1:"Encja prawdopodobieństwa deszczu 1",entity_pos_1:"Encja możliwego deszczu 1",custom1_value:"Własna wartość 1",custom2_value:"Własna wartość 2",custom3_value:"Własna wartość 3",custom4_value:"Własna wartość 4",custom1_icon:"Własna ikona 1",custom2_icon:"Własna ikona 2",custom3_icon:"Własna ikona 3",custom4_icon:"Własna ikona 4",custom1_units:"Własne jednostki 1",custom2_units:"Własne jednostki 2",custom3_units:"Własne jednostki 3",custom4_units:"Własne jednostki 4",custom1_label:"Własna etykieta (opcjonalnie) 1",custom2_label:"Własna etykieta (opcjonalnie) 2",custom3_label:"Własna etykieta (opcjonalnie) 3",custom4_label:"Własna etykieta (opcjonalnie) 4",weather_entity:"Encja pogodowa z prognozami",forecast_type:"Typ prognozy",daily_forecast_layout:"Układ prognozy dziennej",daily_forecast_days:"Dni prognozy dziennej",daily_extended_days:"Dni prognozy rozszerzonej",show_forecast_pop:"Prawdopodobieństwo opadów w prognozie",show_forecast_wind:"Wiatr w prognozie",show_gust_in_wind:"Porywy w slocie wiatru",colour_fire_danger:"Koloruj zagrożenie pożarowe",include_today:"Uwzględnij dziś w prognozie",show_temp_chart:"Pokaż wykres temperatury",show_precip_chart:"Pokaż wykres opadów",forecast_tooltips:"Włącz podpowiedzi prognozy",charts_section:"Sekcja wykresów",opt_daily:"Codziennie",opt_hourly:"Co godzinę",opt_twice_daily:"Dwa razy dziennie",opt_horizontal:"Poziomo",opt_vertical:"Pionowo",opt_complete:"Pełny",opt_observations:"Obserwacje",opt_forecast:"Prognoza",opt_title_only:"Tylko tytuł",opt_system:"Systemowy",opt_12hour:"12 godzin",opt_24hour:"24 godziny"},card:{uv_rating:"UV",feels_like:"Odczuwalne",observed_max:"Zaobserwowany Max",observed_min:"Zaobserwowany Min",obs_max:"Obs Max",obs_min:"Obs Min",forecast_max:"Maks Temperatura",forecast_max_compact:"Maks",forecast_min_compact:"Min",forecast_min:"Min Temperatura",pos_today:"Prognoza",pos_tomorrow:"Prog jutro",fore:"Prog",u_v_rating:"UV",fire_danger:"Ogień",gust:"Poryw",pos_tomorrow_compact:"Jutro"},moonPhases:{new_moon:"Nów",waxing_crescent:"Sierp rosnący",first_quarter:"Pierwsza kwadra",waxing_gibbous:"Rosnący księżyc",full_moon:"Pełnia",waning_gibbous:"Malejący księżyc",last_quarter:"Ostatnia kwadra",waning_crescent:"Sierp ubywający"},windDirections:[]},ru:{zambrettiLong:{a:"Погода останется устойчивой и ясной.",b:"Ожидается хорошая погода.",c:"Ожидается прояснение и улучшение погоды.",d:"Сначала ясно, но постепенно всё более неустойчиво.",e:"Преимущественно ясно с вероятностью кратковременных ливней.",f:"Довольно ясная погода с тенденцией к улучшению.",g:"Довольно ясно, вначале возможны ливни.",h:"Довольно ясно, позже ожидаются ливни.",i:"Вначале ливни, затем погода улучшится.",j:"Переменная погода с тенденцией к улучшению.",k:"Довольно ясно, но ливни вероятны.",l:"Неустойчивая погода, позже прояснение.",m:"Неустойчивая погода, которая, вероятно, улучшится.",n:"Ливни, чередующиеся с прояснениями.",o:"Ливни, погода постепенно ухудшается.",p:"Переменная погода, местами дождь.",q:"Неустойчивая погода с короткими прояснениями.",r:"Неустойчивая погода, позже ожидается дождь.",s:"Неустойчивая погода с временами дождём.",t:"Преимущественно очень неустойчивая погода.",u:"Временами дождь, условия ухудшаются.",v:"Периодами дождь, погода остаётся очень неустойчивой.",w:"Частые дожди в течение всего периода.",x:"Дождливая и очень неустойчивая погода.",y:"Штормовая погода с возможностью улучшения.",z:"Штормовая погода с сильными дождями.",rising:"Давление растёт.",steady:"Давление стабильно.",falling:"Давление падает."},zambretti:{a:"Устойчивая ясная погода",b:"Хорошая погода",c:"Прояснение",d:"Ясно, с тенденцией к ухудшению",e:"Ясно, возможны ливни",f:"Довольно ясно, улучшение",g:"Довольно ясно, вначале возможны ливни",h:"Довольно ясно, позже ливни",i:"Вначале ливни, улучшение",j:"Переменно, улучшение",k:"Довольно ясно, вероятны ливни",l:"Неустойчиво, позже прояснение",m:"Неустойчиво, вероятно улучшение",n:"Ливни с прояснениями",o:"Ливни, ухудшение",p:"Переменно, местами дождь",q:"Неустойчиво, короткие прояснения",r:"Неустойчиво, позже дождь",s:"Неустойчиво, временами дождь",t:"Преимущественно очень неустойчиво",u:"Временами дождь, ухудшение",v:"Периодами дождь, очень неустойчиво",w:"Частые дожди",x:"Дождь, очень неустойчиво",y:"Штормовая погода, возможно улучшение",z:"Штормовая погода, сильный дождь"},editor:{global_options:"Глобальные настройки",overview_section:"Раздел обзора",extended_section:"Расширенный раздел",slots_section:"Раздел слотов",daily_forecast_section:"Ежедневный прогноз",wind_bearing_icon:"Стрелка направления ветра",slot_tap_more_info:"Нажатие на значение открывает историю",moon_icon_only:"Фаза луны: только значок",local_forecast:"Локальный прогноз (Zambretti)",entity_uv_today:"УФ-прогноз (сегодня)",entity_fire_today:"Пожарная опасность (сегодня)",daily_forecast_date:"Дата рядом с днём",local_forecast_verbose:"Развёрнутый текст прогноза",forecast_altitude:"Высота станции (м)",forecast_altitude_hint:"Оставьте пустым, если датчик сообщает относительное давление (уровень моря)",compact_slots:"Компактные подписи",show_static_icons:"Статичные значки",time_format:"Формат времени",locale:"Язык",icon_pack:"Набор значков",opt_locale_auto:"Автоматически (браузер)",actions:"Действия",tap_action:"Действие при нажатии",hold_action:"Действие при удержании",double_tap_action:"Двойное нажатие",icon_pack_default:"По умолчанию (встроенные анимированные)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (требуется weather-chart-card)",icon_pack_custom:"Свой путь...",icon_path:"Путь к значку",icon_path_hint:"Используйте {condition} как заполнитель — напр. /local/icons/{condition}.svg",overview_layout:"Компоновка обзора",card_title_1:"Заголовок карточки, строка 1",card_title_2:"Заголовок карточки, строка 2",entity_temperature:"Сущность текущей температуры",entity_apparent_temp:"Сущность ощущаемой температуры",entity_forecast_icon:"Сущность значка прогноза",entity_forecast_icon_1:"Сущность значка прогноза 1",entity_summary:"Сущность сводки прогноза",entity_summary_1:"Сущность сводки прогноза 1",entity_extended:"Сущность расширенного прогноза",entity_extended_1:"Сущность расширенного прогноза 1",use_attribute:"Использовать атрибут",attribute:"Атрибут",slot_l1:"Слот слева 1",slot_l2:"Слот слева 2",slot_l3:"Слот слева 3",slot_l4:"Слот слева 4",slot_l5:"Слот слева 5",slot_l6:"Слот слева 6",slot_l7:"Слот слева 7",slot_l8:"Слот слева 8",slot_r1:"Слот справа 1",slot_r2:"Слот справа 2",slot_r3:"Слот справа 3",slot_r4:"Слот справа 4",slot_r5:"Слот справа 5",slot_r6:"Слот справа 6",slot_r7:"Слот справа 7",slot_r8:"Слот справа 8",today_temp_decimals:"Десятичные знаки температуры сегодня",today_rain_decimals:"Десятичные знаки осадков сегодня",forecast_temp_decimals:"Десятичные знаки прогнозной температуры",pressure_decimals:"Десятичные знаки давления",show_separator:"Показать разделитель",show_temp_decimals:"Показать десятичные знаки температуры",entity_humidity:"Влажность",entity_pressure:"Атмосферное давление",entity_pressure_trend:"Сущность тренда давления (необязательно — derivative/trend сенсор)",entity_pop:"Вероятность дождя",entity_pos:"Возможный дождь сегодня",entity_2day_pos:"Возможный дождь завтра",entity_rainfall:"Дождь сегодня",entity_fire_danger:"Пожарная опасность",entity_uv_summary:"УФ-предупреждение",entity_sun:"Сущность солнца",entity_moon:"Сущность фазы луны",entity_visibility:"Сущность видимости",entity_wind_speed:"Сущность скорости ветра",entity_wind_bearing:"Сущность направления ветра",entity_wind_gust:"Сущность порывов ветра",entity_wind_speed_kt:"Сущность скорости ветра (уз)",entity_wind_gust_kt:"Сущность порывов ветра (уз)",entity_update_time:"Сущность времени обновления",update_time_prefix:"Префикс времени обновления",entity_observed_max:"Сущность наблюдаемого макс.",entity_observed_min:"Сущность наблюдаемого мин.",entity_forecast_max:"Сущность прогнозного макс.",entity_forecast_max_1:"Сущность прогнозного макс. 1",entity_forecast_min:"Сущность прогнозного мин.",entity_forecast_min_1:"Сущность прогнозного мин. 1",entity_temp_next:"Сущность следующей температуры",entity_temp_next_label:"Подпись следующей температуры",entity_temp_following:"Сущность последующей температуры",entity_temp_fol_label:"Подпись последующей температуры",entity_fire_danger_1:"Сущность пожарной опасности 1",entity_pop_1:"Сущность вероятности дождя 1",entity_pos_1:"Сущность возможного дождя 1",custom1_value:"Пользовательское значение 1",custom2_value:"Пользовательское значение 2",custom3_value:"Пользовательское значение 3",custom4_value:"Пользовательское значение 4",custom1_icon:"Пользовательский значок 1",custom2_icon:"Пользовательский значок 2",custom3_icon:"Пользовательский значок 3",custom4_icon:"Пользовательский значок 4",custom1_units:"Пользовательские единицы 1",custom2_units:"Пользовательские единицы 2",custom3_units:"Пользовательские единицы 3",custom4_units:"Пользовательские единицы 4",custom1_label:"Пользовательская подпись (необязательно) 1",custom2_label:"Пользовательская подпись (необязательно) 2",custom3_label:"Пользовательская подпись (необязательно) 3",custom4_label:"Пользовательская подпись (необязательно) 4",weather_entity:"Погодная сущность с прогнозами",forecast_type:"Тип прогноза",daily_forecast_layout:"Компоновка ежедневного прогноза",daily_forecast_days:"Дни ежедневного прогноза",daily_extended_days:"Дни расширенного прогноза",show_forecast_pop:"Вероятность осадков в прогнозе",show_forecast_wind:"Ветер в прогнозе",show_gust_in_wind:"Порывы в слоте ветра",colour_fire_danger:"Окрашивать пожарную опасность",include_today:"Включить сегодня в прогноз",show_temp_chart:"Показать график температуры",show_precip_chart:"Показать график осадков",forecast_tooltips:"Включить подсказки прогноза",charts_section:"Раздел графиков",opt_daily:"Ежедневно",opt_hourly:"Ежечасно",opt_twice_daily:"Дважды в день",opt_horizontal:"Горизонтально",opt_vertical:"Вертикально",opt_complete:"Полный",opt_observations:"Наблюдения",opt_forecast:"Прогноз",opt_title_only:"Только заголовок",opt_system:"Системный",opt_12hour:"12 часов",opt_24hour:"24 часа"},card:{uv_rating:"УФ",feels_like:"Ощущается как",observed_max:"Наблюдаемый макс.",observed_min:"Наблюдаемый мин.",obs_max:"Набл макс.",obs_min:"Набл мин.",forecast_max:"Макс сегодня",forecast_min:"Мин сегодня",pos_today:"Прогноз",pos_tomorrow:"Прогноз на завтра",fore:"Прогноз",u_v_rating:"УФ",fire_danger:"Огонь",gust:"Порыв",forecast_max_compact:"Макс",forecast_min_compact:"Мин",pos_tomorrow_compact:"Завтра"},moonPhases:{new_moon:"Новолуние",waxing_crescent:"Растущий серп",first_quarter:"Первая четверть",waxing_gibbous:"Растущая луна",full_moon:"Полнолуние",waning_gibbous:"Убывающая луна",last_quarter:"Последняя четверть",waning_crescent:"Убывающий серп"},windDirections:["С","ССВ","СВ","ВСВ","В","ВЮВ","ЮВ","ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"],units:{"km/h":"км/ч",kph:"км/ч","m/s":"м/с",mm:"мм",in:"дюйм",cm:"см"}},ua:{zambrettiLong:{a:"Погода залишиться стійкою та ясною.",b:"Очікується гарна погода.",c:"Очікується прояснення та покращення погоди.",d:"Спочатку ясно, але поступово дедалі нестійкіше.",e:"Переважно ясно з імовірністю короткочасних злив.",f:"Досить ясна погода з тенденцією до покращення.",g:"Досить ясно, спочатку можливі зливи.",h:"Досить ясно, згодом очікуються зливи.",i:"Спочатку зливи, потім погода покращиться.",j:"Мінлива погода з тенденцією до покращення.",k:"Досить ясно, але зливи ймовірні.",l:"Нестійка погода, згодом прояснення.",m:"Нестійка погода, яка, ймовірно, покращиться.",n:"Зливи, що чергуються з проясненнями.",o:"Зливи, погода поступово погіршується.",p:"Мінлива погода, місцями дощ.",q:"Нестійка погода з короткими проясненнями.",r:"Нестійка погода, згодом очікується дощ.",s:"Нестійка погода з часом дощем.",t:"Переважно дуже нестійка погода.",u:"Часом дощ, умови погіршуються.",v:"Періодами дощ, погода залишається дуже нестійкою.",w:"Часті дощі протягом усього періоду.",x:"Дощова та дуже нестійка погода.",y:"Штормова погода з можливістю покращення.",z:"Штормова погода з сильними дощами.",rising:"Тиск зростає.",steady:"Тиск стабільний.",falling:"Тиск падає."},zambretti:{a:"Стійка ясна погода",b:"Гарна погода",c:"Прояснення",d:"Ясно, з тенденцією до погіршення",e:"Ясно, можливі зливи",f:"Досить ясно, покращення",g:"Досить ясно, спочатку можливі зливи",h:"Досить ясно, згодом зливи",i:"Спочатку зливи, покращення",j:"Мінливо, покращення",k:"Досить ясно, ймовірні зливи",l:"Нестійко, згодом прояснення",m:"Нестійко, ймовірне покращення",n:"Зливи з проясненнями",o:"Зливи, погіршення",p:"Мінливо, місцями дощ",q:"Нестійко, короткі прояснення",r:"Нестійко, згодом дощ",s:"Нестійко, часом дощ",t:"Переважно дуже нестійко",u:"Часом дощ, погіршення",v:"Періодами дощ, дуже нестійко",w:"Часті дощі",x:"Дощ, дуже нестійко",y:"Штормова погода, можливе покращення",z:"Штормова погода, сильний дощ"},editor:{global_options:"Глобальні налаштування",overview_section:"Розділ огляду",extended_section:"Розширений розділ",slots_section:"Розділ слотів",daily_forecast_section:"Щоденний прогноз",wind_bearing_icon:"Стрілка напряму вітру",slot_tap_more_info:"Натискання на значення відкриває історію",moon_icon_only:"Фаза місяця: лише значок",local_forecast:"Локальний прогноз (Zambretti)",entity_uv_today:"УФ-прогноз (сьогодні)",entity_fire_today:"Пожежна небезпека (сьогодні)",daily_forecast_date:"Дата поруч із днем",local_forecast_verbose:"Розгорнутий текст прогнозу",forecast_altitude:"Висота станції (м)",forecast_altitude_hint:"Залиште порожнім, якщо датчик повідомляє відносний тиск (рівень моря)",compact_slots:"Компактні підписи",show_static_icons:"Статичні значки",time_format:"Формат часу",locale:"Мова",icon_pack:"Набір значків",opt_locale_auto:"Автоматично (браузер)",actions:"Дії",tap_action:"Дія при дотику",hold_action:"Дія при утриманні",double_tap_action:"Подвійний дотик",icon_pack_default:"За замовчуванням (вбудовані анімовані)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (потребує weather-chart-card)",icon_pack_custom:"Власний шлях...",icon_path:"Шлях до значка",icon_path_hint:"Використовуйте {condition} як заповнювач — напр. /local/icons/{condition}.svg",overview_layout:"Компонування огляду",card_title_1:"Заголовок картки, рядок 1",card_title_2:"Заголовок картки, рядок 2",entity_temperature:"Сутність поточної температури",entity_apparent_temp:"Сутність відчутної температури",entity_forecast_icon:"Сутність значка прогнозу",entity_forecast_icon_1:"Сутність значка прогнозу 1",entity_summary:"Сутність зведення прогнозу",entity_summary_1:"Сутність зведення прогнозу 1",entity_extended:"Сутність розширеного прогнозу",entity_extended_1:"Сутність розширеного прогнозу 1",use_attribute:"Використовувати атрибут",attribute:"Атрибут",slot_l1:"Слот ліворуч 1",slot_l2:"Слот ліворуч 2",slot_l3:"Слот ліворуч 3",slot_l4:"Слот ліворуч 4",slot_l5:"Слот ліворуч 5",slot_l6:"Слот ліворуч 6",slot_l7:"Слот ліворуч 7",slot_l8:"Слот ліворуч 8",slot_r1:"Слот праворуч 1",slot_r2:"Слот праворуч 2",slot_r3:"Слот праворуч 3",slot_r4:"Слот праворуч 4",slot_r5:"Слот праворуч 5",slot_r6:"Слот праворуч 6",slot_r7:"Слот праворуч 7",slot_r8:"Слот праворуч 8",today_temp_decimals:"Десяткові знаки температури сьогодні",today_rain_decimals:"Десяткові знаки опадів сьогодні",forecast_temp_decimals:"Десяткові знаки прогнозної температури",pressure_decimals:"Десяткові знаки тиску",show_separator:"Показати роздільник",show_temp_decimals:"Показати десяткові знаки температури",entity_humidity:"Вологість",entity_pressure:"Атмосферний тиск",entity_pressure_trend:"Сутність тренду тиску (необов’язково — derivative/trend сенсор)",entity_pop:"Ймовірність дощу",entity_pos:"Можливий дощ сьогодні",entity_2day_pos:"Можливий дощ завтра",entity_rainfall:"Дощ сьогодні",entity_fire_danger:"Пожежна небезпека",entity_uv_summary:"УФ-попередження",entity_sun:"Сутність сонця",entity_moon:"Сутність фази місяця",entity_visibility:"Сутність видимості",entity_wind_speed:"Сутність швидкості вітру",entity_wind_bearing:"Сутність напряму вітру",entity_wind_gust:"Сутність поривів вітру",entity_wind_speed_kt:"Сутність швидкості вітру (вуз)",entity_wind_gust_kt:"Сутність поривів вітру (вуз)",entity_update_time:"Сутність часу оновлення",update_time_prefix:"Префікс часу оновлення",entity_observed_max:"Сутність спостережуваного макс.",entity_observed_min:"Сутність спостережуваного мін.",entity_forecast_max:"Сутність прогнозного макс.",entity_forecast_max_1:"Сутність прогнозного макс. 1",entity_forecast_min:"Сутність прогнозного мін.",entity_forecast_min_1:"Сутність прогнозного мін. 1",entity_temp_next:"Сутність наступної температури",entity_temp_next_label:"Підпис наступної температури",entity_temp_following:"Сутність подальшої температури",entity_temp_fol_label:"Підпис подальшої температури",entity_fire_danger_1:"Сутність пожежної небезпеки 1",entity_pop_1:"Сутність ймовірності дощу 1",entity_pos_1:"Сутність можливого дощу 1",custom1_value:"Власне значення 1",custom2_value:"Власне значення 2",custom3_value:"Власне значення 3",custom4_value:"Власне значення 4",custom1_icon:"Власний значок 1",custom2_icon:"Власний значок 2",custom3_icon:"Власний значок 3",custom4_icon:"Власний значок 4",custom1_units:"Власні одиниці 1",custom2_units:"Власні одиниці 2",custom3_units:"Власні одиниці 3",custom4_units:"Власні одиниці 4",custom1_label:"Власний підпис (необов’язково) 1",custom2_label:"Власний підпис (необов’язково) 2",custom3_label:"Власний підпис (необов’язково) 3",custom4_label:"Власний підпис (необов’язково) 4",weather_entity:"Погодна сутність з прогнозами",forecast_type:"Тип прогнозу",daily_forecast_layout:"Компонування щоденного прогнозу",daily_forecast_days:"Дні щоденного прогнозу",daily_extended_days:"Дні розширеного прогнозу",show_forecast_pop:"Ймовірність опадів у прогнозі",show_forecast_wind:"Вітер у прогнозі",show_gust_in_wind:"Пориви у слоті вітру",colour_fire_danger:"Забарвлювати пожежну небезпеку",include_today:"Включити сьогодні у прогноз",show_temp_chart:"Показати графік температури",show_precip_chart:"Показати графік опадів",forecast_tooltips:"Увімкнути підказки прогнозу",charts_section:"Розділ графіків",opt_daily:"Щодня",opt_hourly:"Щогодини",opt_twice_daily:"Двічі на день",opt_horizontal:"Горизонтально",opt_vertical:"Вертикально",opt_complete:"Повний",opt_observations:"Спостереження",opt_forecast:"Прогноз",opt_title_only:"Лише заголовок",opt_system:"Системний",opt_12hour:"12 годин",opt_24hour:"24 години"},card:{uv_rating:"УФ",feels_like:"Відчувається як",observed_max:"Спостережуваний макс.",observed_min:"Спостережуваний мін.",obs_max:"Спост макс.",obs_min:"Спост мін.",forecast_max:"Макс сьогодні",forecast_min:"Мін сьогодні",pos_today:"Прогноз",pos_tomorrow:"Прогноз на завтра",fore:"Прогноз",u_v_rating:"УФ",fire_danger:"Вогонь",gust:"Порив",forecast_max_compact:"Макс",forecast_min_compact:"Мін",pos_tomorrow_compact:"Завтра"},moonPhases:{new_moon:"Новий місяць",waxing_crescent:"Молодий місяць",first_quarter:"Перша чверть",waxing_gibbous:"Зростаючий місяць",full_moon:"Повний місяць",waning_gibbous:"Спадаючий місяць",last_quarter:"Остання чверть",waning_crescent:"Старий місяць"},windDirections:[],units:{"km/h":"км/год",kph:"км/год","m/s":"м/с",mm:"мм",in:"дюйм",cm:"см"}},cs:{zambrettiLong:{a:"Počasí zůstane ustálené a pěkné.",b:"Očekává se pěkné počasí.",c:"Počasí se vyjasní a bude pěkné.",d:"Zpočátku pěkné, postupně méně ustálené.",e:"Většinou pěkné, s možností přeháněk.",f:"Poměrně pěkné počasí se sklonem ke zlepšení.",g:"Poměrně pěkné, možné přeháňky zpočátku.",h:"Poměrně pěkné, později se očekávají přeháňky.",i:"Zpočátku přeháňky, poté se počasí zlepší.",j:"Proměnlivé počasí se sklonem ke zlepšení.",k:"Poměrně pěkné, přeháňky pravděpodobné.",l:"Dosti nestálé počasí, později se vyjasní.",m:"Nestálé počasí, které se pravděpodobně zlepší.",n:"Přeháňky střídající se s jasnými intervaly.",o:"Přeháňky, počasí se postupně zhorší.",p:"Proměnlivé počasí, místy déšť.",q:"Nestálé počasí s krátkými pěknými intervaly.",r:"Nestálé počasí, později déšť.",s:"Nestálé počasí, občasný déšť.",t:"Většinou velmi nestálé počasí.",u:"Občasný déšť se zhoršujícími se podmínkami.",v:"Občasný déšť, počasí zůstává velmi nestálé.",w:"Časté dešťové přeháňky po celý den.",x:"Deštivé a velmi nestálé počasí.",y:"Bouřlivé počasí s možností zlepšení.",z:"Bouřlivé počasí s vydatným deštěm.",rising:"Tlak stoupá.",steady:"Tlak je stálý.",falling:"Tlak klesá."},zambretti:{a:"Ustálené pěkné",b:"Pěkné počasí",c:"Zlepšující se počasí",d:"Pěkné, postupně méně ustálené",e:"Pěkné, možné přeháňky",f:"Poměrně pěkné, zlepšující se",g:"Poměrně pěkné, možné přeháňky zpočátku",h:"Poměrně pěkné, později přeháňky",i:"Přeháňky zpočátku, zlepšení",j:"Proměnlivé, zlepšující se",k:"Poměrně pěkné, přeháňky pravděpodobné",l:"Dosti nestálé, později vyjasnění",m:"Nestálé, pravděpodobně zlepšení",n:"Přeháňky, jasné intervaly",o:"Přeháňky, méně ustálené",p:"Proměnlivé, místy déšť",q:"Nestálé, krátké pěkné intervaly",r:"Nestálé, později déšť",s:"Nestálé, občasný déšť",t:"Většinou velmi nestálé",u:"Občasný déšť, zhoršení",v:"Občasný déšť, velmi nestálé",w:"Časté dešťové intervaly",x:"Déšť, velmi nestálé",y:"Bouřlivé, může se zlepšit",z:"Bouřlivé, hodně deště"},editor:{global_options:"Globální nastavení",overview_section:"Sekce přehledu",extended_section:"Rozšířená sekce",slots_section:"Sekce slotů",daily_forecast_section:"Denní předpověď",wind_bearing_icon:"Ikona směru větru",slot_tap_more_info:"Klepnutí na hodnotu otevře historii",moon_icon_only:"Fáze měsíce: pouze ikona",local_forecast:"Místní předpověď (Zambretti)",entity_uv_today:"UV předpověď (dnes)",entity_fire_today:"Nebezpečí požáru (dnes)",daily_forecast_date:"Zobrazit datum vedle dne",local_forecast_verbose:"Podrobný text předpovědi",forecast_altitude:"Nadmořská výška stanice (m)",forecast_altitude_hint:"Nechte prázdné, pokud senzor hlásí relativní tlak (k hladině moře)",compact_slots:"Kompaktní popisky slotů",show_static_icons:"Zobrazit statické ikony",time_format:"Formát času",locale:"Jazyk",icon_pack:"Balíček ikon",opt_locale_auto:"Auto (prohlížeč)",actions:"Akce",tap_action:"Akce při kliknutí",hold_action:"Akce při podržení",double_tap_action:"Akce při dvojitém kliknutí",icon_pack_default:"Výchozí (vestavěné animované)",icon_pack_met_fill:"Meteocons — výplň (CDN, basmilius)",icon_pack_met_line:"Meteocons — linka (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (vyžaduje weather-chart-card)",icon_pack_custom:"Vlastní cesta...",icon_path:"Cesta k ikonám",icon_path_hint:"Použijte {condition} jako zástupný symbol — např. /local/icons/{condition}.svg",overview_layout:"Rozvržení přehledu",card_title_1:"Název karty — řádek 1",card_title_2:"Název karty — řádek 2",entity_temperature:"Aktuální teplota",entity_apparent_temp:"Zdánlivá teplota",entity_forecast_icon:"Ikona předpovědi",entity_forecast_icon_1:"Ikona předpovědi 1",entity_summary:"Souhrn předpovědi",entity_summary_1:"Souhrn předpovědi 1",entity_extended:"Rozšířená předpověď",entity_extended_1:"Rozšířená předpověď 1",use_attribute:"Použít atribut",attribute:"Atribut",slot_l1:"Slot vlevo 1",slot_l2:"Slot vlevo 2",slot_l3:"Slot vlevo 3",slot_l4:"Slot vlevo 4",slot_l5:"Slot vlevo 5",slot_l6:"Slot vlevo 6",slot_l7:"Slot vlevo 7",slot_l8:"Slot vlevo 8",slot_r1:"Slot vpravo 1",slot_r2:"Slot vpravo 2",slot_r3:"Slot vpravo 3",slot_r4:"Slot vpravo 4",slot_r5:"Slot vpravo 5",slot_r6:"Slot vpravo 6",slot_r7:"Slot vpravo 7",slot_r8:"Slot vpravo 8",today_temp_decimals:"Dnešní teplota — desetinná místa",today_rain_decimals:"Dnešní srážky — desetinná místa",forecast_temp_decimals:"Teplota v předpovědi — desetinná místa",pressure_decimals:"Tlak — desetinná místa",show_separator:"Zobrazit oddělovač",show_temp_decimals:"Zobrazit desetinná místa teploty",entity_humidity:"Vlhkost",entity_pressure:"Atmosférický tlak",entity_pressure_trend:"Trend tlaku (volitelné — senzor derivace/trendu)",entity_pop:"Pravděpodobnost srážek",entity_pos:"Možné srážky dnes",entity_2day_pos:"Možné srážky zítra",entity_rainfall:"Dnešní srážky",entity_fire_danger:"Nebezpečí požáru",entity_uv_summary:"Souhrn UV výstrahy",entity_sun:"Slunce",entity_moon:"Fáze měsíce",entity_visibility:"Viditelnost",entity_wind_speed:"Rychlost větru",entity_wind_bearing:"Směr větru",entity_wind_gust:"Nárazy větru",entity_wind_speed_kt:"Rychlost větru (kt)",entity_wind_gust_kt:"Nárazy větru (kt)",entity_update_time:"Čas aktualizace",update_time_prefix:"Předpona času aktualizace",entity_observed_max:"Pozorované maximum",entity_observed_min:"Pozorované minimum",entity_forecast_max:"Předpověď — maximum",entity_forecast_max_1:"Předpověď — maximum 1",entity_forecast_min:"Předpověď — minimum",entity_forecast_min_1:"Předpověď — minimum 1",entity_temp_next:"Teplota — další",entity_temp_next_label:"Popisek — další teplota",entity_temp_following:"Teplota — následující",entity_temp_fol_label:"Popisek — následující teplota",entity_fire_danger_1:"Nebezpečí požáru 1",entity_pop_1:"Pravděpodobnost srážek 1",entity_pos_1:"Možné srážky 1",custom1_value:"Vlastní hodnota 1",custom2_value:"Vlastní hodnota 2",custom3_value:"Vlastní hodnota 3",custom4_value:"Vlastní hodnota 4",custom1_icon:"Vlastní ikona 1",custom2_icon:"Vlastní ikona 2",custom3_icon:"Vlastní ikona 3",custom4_icon:"Vlastní ikona 4",custom1_units:"Vlastní jednotky 1",custom2_units:"Vlastní jednotky 2",custom3_units:"Vlastní jednotky 3",custom4_units:"Vlastní jednotky 4",custom1_label:"Vlastní popisek 1 (volitelné)",custom2_label:"Vlastní popisek 2 (volitelné)",custom3_label:"Vlastní popisek 3 (volitelné)",custom4_label:"Vlastní popisek 4 (volitelné)",weather_entity:"Entita počasí s předpovědí",forecast_type:"Typ předpovědi",daily_forecast_layout:"Rozvržení denní předpovědi",daily_forecast_days:"Počet dnů denní předpovědi",daily_extended_days:"Počet dnů rozšířené předpovědi",show_forecast_pop:"Zobrazit pravděpodobnost srážek v předpovědi",show_forecast_wind:"Zobrazit vítr v předpovědi",show_gust_in_wind:"Zobrazit nárazy ve slotu větru",colour_fire_danger:"Barevné zobrazení nebezpečí požáru",include_today:"Zahrnout dnešek do předpovědi",show_temp_chart:"Zobrazit graf teploty",show_precip_chart:"Zobrazit graf srážek",forecast_tooltips:"Povolit tooltipy předpovědi",charts_section:"Sekce grafů",opt_daily:"Denní",opt_hourly:"Hodinové",opt_twice_daily:"Dvakrát denně",opt_horizontal:"Vodorovný",opt_vertical:"Svislý",opt_complete:"Kompletní",opt_observations:"Pozorování",opt_forecast:"Předpověď",opt_title_only:"Pouze titul",opt_system:"Systém",opt_12hour:"12 hodin",opt_24hour:"24 hodin"},card:{uv_rating:"UV",feels_like:"Pocitově",observed_max:"Pozorované maximum",observed_min:"Pozorované minimum",obs_max:"Poz. max",obs_min:"Poz. min",forecast_max:"Max",forecast_min:"Min",pos_today:"Předp.",pos_tomorrow:"Zítř.",fore:"Předp.",u_v_rating:"UV",fire_danger:"Nebezpečí požáru",gust:"Nárazy",forecast_max_compact:"Max",forecast_min_compact:"Min",pos_tomorrow_compact:"Zítř."},moonPhases:{new_moon:"Nov",waxing_crescent:"Dorůstající srpek",first_quarter:"První čtvrť",waxing_gibbous:"Dorůstající měsíc",full_moon:"Úplněk",waning_gibbous:"Couvající měsíc",last_quarter:"Poslední čtvrť",waning_crescent:"Ubývající srpek"},windDirections:["S","SSV","SV","VSV","V","VJV","JV","JJV","J","JJZ","JZ","ZJZ","Z","ZSZ","SZ","SSZ","S"]}};function St(t,e){var i,s,o;const n=(t||"en").split("-")[0].toLowerCase();return null!==(o=null!==(s=null===(i=zt[n])||void 0===i?void 0:i.card[e])&&void 0!==s?s:zt.en.card[e])&&void 0!==o?o:e}function Et(t,e,i=!1){var s,o,n,a;const r=(t||"en").split("-")[0].toLowerCase(),l=i?"zambrettiLong":"zambretti";return null!==(a=null!==(n=null===(o=null===(s=zt[r])||void 0===s?void 0:s[l])||void 0===o?void 0:o[e])&&void 0!==n?n:zt.en[l][e])&&void 0!==a?a:""}const Pt=[5.2,4.2,3.2,1.05,-1.1,-3.15,-5.2,-8.35,-11.5,-9.4,-7.3,-5.25,-3.2,-1.15,.9,3.05];console.info("%c  PLATINUM-WEATHER-CARD-TL  \n%c  Version 2.2.3          ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"platinum-weather-card-plus-charts",name:"Platinum Weather Card Plus Charts",description:"An fully customisable weather card with a GUI configuration"});let Ct=class extends nt{constructor(){super(...arguments),this._cardWidth=492,this._zamTrendCat="steady",this._zamShownKey=null,this._zamCandidateKey=null,this._zamCandidateTs=0,this._error=[],this._boundPointerDown=this._onPointerDown.bind(this),this._boundPointerCancel=this._onPointerCancel.bind(this),this._boundCardClick=this._onCardClick.bind(this),this._pHoldFired=!1,this._clickCount=0}static get properties(){return{_config:{},_forecastEvent:{},hass:{}}}static async getConfigElement(){return await Promise.resolve().then(function(){return Ot}),document.createElement("platinum-weather-card-plus-charts-editor")}static getStubConfig(){return{}}getCardSize(){const t=16+this._getCardSizeOverviewSection()+this._getCardSizeExtendedSection()+this._getCardSizeSlotsSection()+this._getCardSizeDailyForecastSection();return Math.ceil(t/50)}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=/^[a-z0-9_]+\.[a-z0-9_]+$/,i=["weather_entity","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","entity_extended","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_following","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_update_time"];for(const s of i){const i=t[s];if(i&&"string"==typeof i&&!e.test(i))throw new Error(`platinum-weather-card-plus-charts: "${s}" has invalid entity ID format: "${i}". Expected format: domain.object_id (e.g. sensor.temperature).`)}const s=["overview","extended","slots","daily_forecast","charts"];if(t.section_order){if(!Array.isArray(t.section_order))throw new Error("platinum-weather-card: section_order must be an array.");for(const e of t.section_order)if(!s.includes(e))throw new Error(`platinum-weather-card-plus-charts: invalid section "${e}" in section_order. Valid values: ${s.join(", ")}.`)}if(void 0!==t.daily_forecast_days){const e=Number(t.daily_forecast_days);if(!Number.isInteger(e)||e<1||e>7)throw new Error(`platinum-weather-card-plus-charts: daily_forecast_days must be an integer between 1 and 7, got "${t.daily_forecast_days}".`)}t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({name:"Weather",forecast_type:"daily"},t)}_needForecastSubscription(){return this._config&&this._config.weather_entity&&this._config.forecast_type&&"legacy"!==this._config.forecast_type}_unsubscribeForecastEvents(){this._subscribed&&(this._subscribed.then(t=>t()),this._subscribed=void 0)}async _subscribeForecastEvents(){var t,e,i,s;(this._unsubscribeForecastEvents(),this.isConnected&&this.hass&&this._config&&this._needForecastSubscription())&&(this.hass&&this._config&&(this._subscribed=(t=this.hass,e=this._config.weather_entity,i=this._config.forecast_type,s=t=>{this._forecastEvent=t},t.connection.subscribeMessage(s,{type:"weather/subscribe_forecast",forecast_type:i,entity_id:e}))))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._config&&this.hass&&this._subscribeForecastEvents(),this.addEventListener("pointerdown",this._boundPointerDown),this.addEventListener("pointercancel",this._boundPointerCancel),this.addEventListener("click",this._boundCardClick)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeForecastEvents(),this.removeEventListener("pointerdown",this._boundPointerDown),this.removeEventListener("pointercancel",this._boundPointerCancel),this.removeEventListener("click",this._boundCardClick),clearTimeout(this._pHoldTimer),clearTimeout(this._clickTimer)}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config")||t.has("_forecastEvent"))return!0;if(t.has("hass"))return!0;const e=t.get("hass")||void 0;if(!e||e.themes!==this.hass.themes||e.locale!==this.hass.locale)return!0;if(!1===Object.keys(this._config).every(t=>null===t.match(/^entity_/)||e.states[this._config[t]]===this.hass.states[this._config[t]]))return!0;if(this._config.show_section_daily_forecast){const t=this._config.daily_forecast_days||5;for(const s of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1"])if(void 0!==this._config[s]&&null===this._config[s].match("^weather.")){const o=this._config[s].match(/(\d+)(?!.*\d)/g);if(o)for(var i=1;i<t;i++){const t=this._config[s].replace(/(\d+)(?!.*\d)/g,Number(o)+i);if(e.states[t]!==this.hass.states[t])return!0}}}return t.has("config")}updated(t){super.updated(t),this.hass&&this._config&&(!t.has("_config")&&this._subscribed||this._subscribeForecastEvents(),this.renderRoot.querySelectorAll("li[data-slot]").forEach(t=>{const e=t;e.classList.toggle("slot-tappable",null!==this._slotTapEntity(e.dataset.slot||""))}))}firstUpdated(){this._resize(),this._attachObserver()}_attachObserver(){var t;this._resizeObserver||(this._resizeObserver=new ResizeObserver(function(t,e,i){var s;return void 0===i&&(i=!1),function(){var o=[].slice.call(arguments),n=this,a=i&&!s;clearTimeout(s),s=setTimeout(function(){s=null,i||t.apply(n,o)},e),a&&t.apply(n,o)}}(()=>this._resize(),250,!1)));(null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card"))&&this._resizeObserver.observe(this)}_resize(){var t;if(!this.isConnected)return;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card");e&&(this._cardWidth=e.getBoundingClientRect().width)}_checkForErrors(){this._error=[],Object.keys(this._config).forEach(t=>{null!==t.match(/^entity_/)&&void 0===this.hass.states[this._config[t]]&&this._error.push(`'${t}=${this._config[t]}' not found`)});for(const t of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1","entity_extended_1"])if(void 0!==this._config[t])if(this._config[t].match("^weather.")){if(void 0===this.hass.states[this._config.weather_entity]){this._error.push("'weather_entity needs to be defined (not found).");break}if(this._config[t]!==this._config.weather_entity){this._error.push(`'${t} needs to be the same as weather_entity.`);break}const e=this.forecast1;if(void 0!==e){const i=new Date;switch(i.setDate(i.getDate()+1),t){case"entity_forecast_icon_1":void 0===this._getForecastPropFromWeather(e,i,"condition")&&this._error.push(`'${t} attribute forecast[1].condition not found`);break;case"entity_forecast_min_1":void 0===this._getForecastPropFromWeather(e,i,"templow")&&this._error.push(`'${t} attribute forecast[1].templow not found`);break;case"entity_forecast_max_1":void 0===this._getForecastPropFromWeather(e,i,"temperature")&&this._error.push(`'${t} attribute forecast[1].temperature not found`);break;case"entity_pop_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation_probability")&&this._error.push(`'${t} attribute forecast[1].precipitation_probability not found`);break;case"entity_pos_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation")&&this._error.push(`'${t} attribute forecast[1].precipitation not found`)}}}else{this._config[t].match(/(\d+)(?!.*\d)/g)||this._error.push(`'${t}=${this._config[t]}' value needs to have a number`)}return void 0!==this._config.weather_entity&&(void 0!==this._config.forecast_type?["daily","hourly","twice_daily"].includes(this._config.forecast_type)||this._error.push("'forecast_type must be daily, hourly, or twice_daily"):this._error.push("'forecast_type needs to be configured.")),0!==this._error.length}_renderUpdateTime(){if(this._config.entity_update_time&&this.hass.states[this._config.entity_update_time]&&void 0!==this.hass.states[this._config.entity_update_time].state)if(!0===this._config.update_time_use_attr){if(void 0!==this._config.update_time_name_attr){const t=this._config.update_time_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[this._config.entity_update_time].attributes);if(void 0!==t){const e=new Date(`${t}`);switch(this.timeFormat){case"12hour":return F`${e.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(e)}`;case"24hour":return F`${e.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(e)}`;case"system":return F`${e.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(e)}`}}}}else{const t=new Date(this.hass.states[this._config.entity_update_time].state);switch(this.timeFormat){case"12hour":return F`${t.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(t)}`;case"24hour":return F`${t.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(t)}`;case"system":return F`${t.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(t)}`}}return F`---`}_renderCompleteOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return F``;const i=this._weatherIcon(this.forecastIcon),s=this._getIconUrl(i),o="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?F``:F`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=F`<div class="big-icon"><img src="${s}" width="100%" height="100%" title="${o}"></div>`,r=F`
      <div class="current-temp${this._overviewTapEntity("temperature")?" overview-tappable":""}"
           @click=${this._overviewClick} data-overview="temperature">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,l=this.currentApparentTemperature,c=""!=l?F`
      <div class="apparent-temp${this._overviewTapEntity("apparent")?" overview-tappable":""}"
           @click=${this._overviewClick} data-overview="apparent">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${l}</div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `:F``,_=!0===this._config.option_show_overview_separator?F`<hr class=line>`:"",d=this.localForecastText,h=null!==d?F`<div class="forecast-text">${d}</div>`:this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=F`<div class="forecast-text">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:F`<div class="forecast-text">---</div>`:F``;return F`
      <div class="overview-section section">
        ${this._config.text_card_title?F`<div class="card-header">${this._config.text_card_title}</div>`:F``}
        ${this._config.text_card_title_2?F`<div class="card-header">${this._config.text_card_title_2}</div>`:F``}
        ${this._config.entity_update_time?F`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:F``}
        <div class="overview-top">
          <div class="top-left">${a}${n}</div>
          <div class="currentTemps">${r}${c}</div>
        </div>
        ${h}
        ${_}
      </div>
    `}_renderObservationsOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return F``;const e=this._cardWidth>=344?" stacked":"",i=F`
      <div class="current-temp${this._overviewTapEntity("temperature")?" overview-tappable":""}"
           @click=${this._overviewClick} data-overview="temperature">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,s=this.currentApparentTemperature,o=""!=s?F`
      <div class="apparent-temp${this._overviewTapEntity("apparent")?" overview-tappable":""}"
           @click=${this._overviewClick} data-overview="apparent">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${s}</div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `:F``,n=!0===this._config.option_show_overview_separator?F`<hr class=line>`:"";return F`
      <div class="overview-section section${e}">
        ${this._config.text_card_title?F`<div class="card-header">${this._config.text_card_title}</div>`:F``}
        ${this._config.text_card_title_2?F`<div class="card-header">${this._config.text_card_title_2}</div>`:F``}
        ${this._config.entity_update_time?F`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:F``}
      </div>
      <div class="overview-section section">
        <div class="overview-top">
          <div class="top-left-obs"></div>
          <div class="currentTemps">${i}${o}</div>
        </div>
        ${n}
      </div>
    `}_renderTitleOnlyOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return F``;const e=!0===this._config.option_show_overview_separator?F`<hr class=line>`:"";return F`
      <div class="overview-section section">
        ${this._config.text_card_title?F`<div class="card-header">${this._config.text_card_title}</div>`:F``}
        ${this._config.text_card_title_2?F`<div class="card-header">${this._config.text_card_title_2}</div>`:F``}
        ${this._config.entity_update_time?F`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:F``}
        ${e}
      </div>
    `}_renderForecastOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return F``;const i=this._weatherIcon(this.forecastIcon),s=this._getIconUrl(i),o="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?F``:F`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=F`<div class="big-icon"><img src="${s}" width="100%" height="100%" title="${o}"></div>`,r=!0===this._config.option_show_overview_separator?F`<hr class=line>`:"",l=this.localForecastText,c=null!==l?F`<div class="forecast-text-right">${l}</div>`:this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=F`<div class="forecast-text-right">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:F`<div class="forecast-text-right">---</div>`:F``;return F`
      <div class="overview-section section">
        ${this._config.text_card_title?F`<div class="card-header">${this._config.text_card_title}</div>`:F``}
        ${this._config.text_card_title_2?F`<div class="card-header">${this._config.text_card_title_2}</div>`:F``}
        ${this._config.entity_update_time?F`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:F``}
        <div class="overview-top">
          <div class="top-left">${a}${n}</div>
          ${c}
        </div>
        ${r}
      </div>
    `}_getCardSizeOverviewSection(){var t=0;if(!1!==this._config.show_section_overview){if("observations"===this._config.overview_layout)return 76;t=16,t+=void 0!==this._config.text_card_title?20:0,t+=void 0!==this._config.text_card_title_2?20:0,t+=void 0!==this._config.entity_update_time?20:0,"title only"!==this._config.overview_layout&&(t+="forecast"===this._config.overview_layout||void 0===this._config.entity_summary&&!0!==this._config.option_local_forecast?120:145)}return t}_renderOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return F``;switch(this._config.overview_layout||"complete"){case"observations":return this._renderObservationsOverviewSection();case"forecast":return this._renderForecastOverviewSection();case"title only":return this._renderTitleOnlyOverviewSection();default:return this._renderCompleteOverviewSection()}}_getCardSizeExtendedSection(){var t=0;return!1!==this._config.show_section_extended&&(t+=16,t+=this._config.entity_extended?40:0,t+=void 0!==this._config.entity_todays_uv_forecast||void 0!==this._config.entity_todays_fire_danger?20:0),t}_renderExtendedSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_extended)||void 0===this._config.entity_extended&&void 0===this._config.entity_todays_uv_forecast&&void 0===this._config.entity_todays_fire_danger)return F``;const i=this._config.entity_extended||"";var s=[];if(void 0!==this.hass.states[i])if(null===(e=this._config.entity_extended)||void 0===e?void 0:e.match("^weather.")){const t=this.forecast1;var o;if(void 0!==t)o=void 0,!0===this._config.extended_use_attr?void 0!==this._config.extended_name_attr&&(o=t[0][this._config.extended_name_attr]):o="extended_use_attr: - must be set to true when entity_extended is set to a weather entity",void 0!==o&&s.push(F`${o}`)}else if(!0===this._config.extended_use_attr){if(void 0!==this._config.extended_name_attr){const t=this._config.extended_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[i].attributes);void 0!==t&&s.push(F`${t}`)}}else if(void 0!==this.hass.states[i]){const t=this.hass.states[i].state;"unknown"!==t&&"unavailable"!==t&&s.push(F`${t}`)}return s.push(F`${this._config.entity_todays_uv_forecast&&this.hass.states[this._config.entity_todays_uv_forecast]&&"unknown"!==this.hass.states[this._config.entity_todays_uv_forecast].state?" "+this.hass.states[this._config.entity_todays_uv_forecast].state:""}`),s.push(F`${this._config.entity_todays_fire_danger&&this.hass.states[this._config.entity_todays_fire_danger]&&"unknown"!==this.hass.states[this._config.entity_todays_fire_danger].state?" "+this.hass.states[this._config.entity_todays_fire_danger].state:""}`),F`
      <div class="extended-section section">
        <div class="f-extended">
          ${s}
        </div>
      </div>
    `}_getCardSizeSlotsSection(){var t=0;if(!1!==this._config.show_section_slots){var e=("remove"!==this._config.slot_l1?1:0)+("remove"!==this._config.slot_l2?1:0)+("remove"!==this._config.slot_l3?1:0)+("remove"!==this._config.slot_l4?1:0)+("remove"!==this._config.slot_l5?1:0)+(void 0!==this._config.slot_l6&&"remove"!==this._config.slot_l6?1:0)+(void 0!==this._config.slot_l7&&"remove"!==this._config.slot_l7?1:0)+(void 0!==this._config.slot_l8&&"remove"!==this._config.slot_l8?1:0),i=("remove"!==this._config.slot_r1?1:0)+("remove"!==this._config.slot_r2?1:0)+("remove"!==this._config.slot_r3?1:0)+("remove"!==this._config.slot_r4?1:0)+("remove"!==this._config.slot_r5?1:0)+(void 0!==this._config.slot_r6&&"remove"!==this._config.slot_r6?1:0)+(void 0!==this._config.slot_r7&&"remove"!==this._config.slot_r7?1:0)+(void 0!==this._config.slot_r8&&"remove"!==this._config.slot_r8?1:0);t+=16+24*Math.max(e,i)}return t}_renderSlotsSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_slots))return F``;var e=!0===this._config.use_old_column_format?F`
      <div>
        <ul class="variations-ugly">
          <li>
            <ul class="slot-list" @click=${this._slotClick}>${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}</ul>
          </li>
          <li>
            <ul class="slot-list" @click=${this._slotClick}>${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}</ul>
          </li>
        </ul>
      </div>
    `:F`
      <div>
        <ul class="variations">
          <li class="slot-list-item-1">
            <ul class="slot-list" @click=${this._slotClick}>
              ${this.slotL1}${this.slotL2}${this.slotL3}${this.slotL4}${this.slotL5}${this.slotL6}${this.slotL7}${this.slotL8}
            </ul>
          </li>
          <li>
            <ul class="slot-list" @click=${this._slotClick}>
              ${this.slotR1}${this.slotR2}${this.slotR3}${this.slotR4}${this.slotR5}${this.slotR6}${this.slotR7}${this.slotR8}
            </ul>
          </li>
        </ul>
      </div>
    `;return F`
      <div class="slot-section section">${e}</div>
    `}_renderHorizontalDailyForecastSection(){var t,e,i,s,o,n,a,r,l,c,_,d;const h=[],u=this._config.daily_forecast_days||5;for(var p=0;p<u;p++){const S=new Date;var m,g,v;if(S.setDate(S.getDate()+p+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;var y;if(void 0!==this.forecast1&&(y=this._getForecastPropFromWeather(this.forecast1,S,"condition")),void 0===y)break;const e={href:this._getIconUrl(t&&y?this._weatherIcon(y):"unknown",!0)};m=F`<li class="f-slot-horiz-icon"><i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i></li>`}else{var f=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p)):void 0;if(void 0===t||void 0===this.hass.states[t])break;const e={href:this._getIconUrl(t&&this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};m=F`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i>`}(null===(e=this._config.entity_forecast_max_1)||void 0===e?void 0:e.match("^weather."))?void 0!==this.forecast1&&(g=this._getForecastPropFromWeather(this.forecast1,S,"temperature")):g=(f=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p))].state:void 0,(null===(i=this._config.entity_forecast_min_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(v=this._getForecastPropFromWeather(this.forecast1,S,"templow")):v=(f=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p))].state:void 0;const E=F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,P=!0===this._config.old_daily_format?F`
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text highTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${E}
            </span>
          </li>
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text lowTemp">${v?Number(v).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${E}
            </span>
          </li>`:"highlow"===this._config.tempformat?F`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text highTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text lowTemp">${v?Number(v).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${E}
              </span>
            </li>`:F`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text lowTemp">${v?Number(v).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text highTemp">${g?Number(g).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${E}
              </span>
            </li>
          `;var b,w,$;if(null===(s=this._config.entity_pop_1)||void 0===s?void 0:s.match("^weather.")){const t=this._config.entity_pop_1;var x;void 0!==this.forecast1&&(x=this._getForecastPropFromWeather(this.forecast1,S,"precipitation_probability")),b=t&&!1!==this._config.option_show_forecast_pop?F`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${this.hass.states[t]&&void 0!==x?Math.round(Number(x)):"---"}</div><div class="unit">%</div></span></li>`:F``}else{const t=(f=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p)):void 0;b=f&&!1!==this._config.option_show_forecast_pop?F`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></span></li>`:F``}if(null===(o=this._config.entity_pos_1)||void 0===o?void 0:o.match("^weather.")){const t=this._config.entity_pos_1;var k;void 0!==this.forecast1&&(k=this._getForecastPropFromWeather(this.forecast1,S,"precipitation")),w=t?F`<li class="f-slot-horiz-text"><span><div class="pos">${this.hass.states[t]&&void 0!==k?k:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:F``}else{const t=(f=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p)):void 0;w=f?F`<li class="f-slot-horiz-text"><span><div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:F``}if(null===(n=this._config.entity_summary_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_summary_1;var z;void 0!==this.forecast1&&(z=null!==(a=this._getForecastPropFromWeather(this.forecast1,S,"detailed_description"))&&void 0!==a?a:this._getForecastPropFromWeather(this.forecast1,S,"condition"));const e=(this._config.option_show_current_day?0:1)+p,i=this.forecast1&&this.forecast1[e],s=this.constructor.COMPASS_DEG,o=null==i?void 0:i.wind_bearing;let n=null;if(null!=o){const t=Number(o);n=isNaN(t)?null!==(r=s[String(o).toUpperCase().trim()])&&void 0!==r?r:null:t}const c=S?S.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",_=this.hass.states[t]&&void 0!==z?bt(this.hass.localize,z):"",d=this._config.entity?this.hass.states[this._config.entity]:null,h=this._buildTooltipRows({date:c,condition:_,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(l=null==d?void 0:d.attributes)||void 0===l?void 0:l.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});$=F`<div class="fcasttooltipblock" id="fcast-summary-${p}" style="width:${100*u}%;left:-${100*p}%;">${kt(h)}<span style="content:'';position:absolute;top:100%;left:${100/u/2+p*(100/u)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}else{const t=(f=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(f)+p)):void 0,e=(this._config.option_show_current_day?0:1)+p,i=this.forecast1&&this.forecast1[e],s=this.constructor.COMPASS_DEG,o=null==i?void 0:i.wind_bearing;let n=null;if(null!=o){const t=Number(o);n=isNaN(t)?null!==(c=s[String(o).toUpperCase().trim()])&&void 0!==c?c:null:t}const a=S?S.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",r=this._config.option_tooltips&&t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?null!==(_=this.hass.states[t].attributes[this._config.summary_1_name_attr])&&void 0!==_?_:"":this.hass.states[t].state:"",l=this._config.entity?this.hass.states[this._config.entity]:null,h=this._buildTooltipRows({date:a,condition:r,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(d=null==l?void 0:l.attributes)||void 0===d?void 0:d.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});$=F`<div class="fcasttooltipblock" id="fcast-summary-${p}" style="width:${100*u}%;left:-${100*p}%;">${kt(h)}<span style="content:'';position:absolute;top:100%;left:${100/u/2+p*(100/u)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}h.push(F`
        <div class="day-horiz fcasttooltip">
          <ul class="f-slot-horiz">
            <li class="f-slot-horiz-text"><span class="${!0===this._config.option_daily_forecast_date?"dayname dayname-with-date":"dayname"}">${S?S.toLocaleDateString(this.locale,{weekday:"short"}):"---"}${!0===this._config.option_daily_forecast_date&&S?F` ${S.toLocaleDateString(this.locale,{day:"numeric",month:"numeric"})}`:""}</span></li>
            ${m}
            ${this._config.option_show_temperature_chart?F``:P}
            ${b}
            ${this._config.option_show_precipitation_chart?F``:w}
            ${!0===this._config.option_show_forecast_wind?(()=>{var t;const e=(this._config.option_show_current_day?0:1)+p,i=this.forecast1&&this.forecast1[e];if(!i||void 0===i.wind_speed)return F``;const s=Math.round(Number(i.wind_speed)),o=this.constructor.COMPASS_DEG;let n=null;if(void 0!==i.wind_bearing&&null!==i.wind_bearing){const e=Number(i.wind_bearing);if(isNaN(e)){n=null!==(t=o[String(i.wind_bearing).toUpperCase().trim()])&&void 0!==t?t:null}else n=e}const a=null!==n&&isFinite(Number(n))?`<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10" style="transform:rotate(${(Number(n)+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:1px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:"";return F`<li class="f-slot-horiz-text"><span>${kt(a)}${s}</span></li>`})():F``}

          </ul>
          ${$}
        </div>
      `)}return F`
      <div class="daily-forecast-horiz-section section">
        ${h}
      </div>
    `}_renderVerticalDailyForecastSection(){var t,e,i,s,o,n,a;const r=[],l=this._config.daily_forecast_days||5;for(var c=0;c<l;c++){const l=new Date;var _,d,h,u,p,m,g;if(l.setDate(l.getDate()+c+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;if(void 0!==this.forecast1&&(g=this._getForecastPropFromWeather(this.forecast1,l,"condition")),void 0===g)break;const e={href:this._getIconUrl(t&&g?this._weatherIcon(g):"unknown",!0)};_=F`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}else{var v=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=v&&this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0;if(!t||void 0===this.hass.states[t]||"unknown"===this.hass.states[t].state)break;const e={href:this._getIconUrl(void 0!==this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};_=F`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}if(null===(e=this._config.entity_summary_1)||void 0===e?void 0:e.match("^weather.")){void 0!==this.forecast1&&(g=this._getForecastPropFromWeather(this.forecast1,l,"condition"));var y=(v=!0)?F`
          <div class="f-summary-vert">${this.hass.states[this._config.entity_summary_1]?this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary_1],g):"---"}</div>`:""}else{const t=(v=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0,e=t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?this.hass.states[t].attributes[this._config.summary_1_name_attr]:this.hass.states[t].state:"---";y=v?F`
          <div class="f-summary-vert">${null!=e?e:"---"}</div>`:""}(null===(i=this._config.entity_forecast_max_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(d=this._getForecastPropFromWeather(this.forecast1,l,"temperature")):d=(v=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c))].state:void 0,(null===(s=this._config.entity_forecast_min_1)||void 0===s?void 0:s.match("^weather."))?void 0!==this.forecast1&&(h=this._getForecastPropFromWeather(this.forecast1,l,"templow")):h=(v=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c))].state:void 0;const k=F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,z=h?F`
        <div class="f-slot-vert">
          <div class="temp-label">Min: </div>
          <div class="low-temp">${Number(h).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${k}
        </div>`:F`---`,S=d?F`
        <div class="f-slot-vert">
          <div class="temp-label">Max: </div>
          <div class="high-temp">${Number(d).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${k}
        </div>`:F`---`;if(null===(o=this._config.entity_pop_1)||void 0===o?void 0:o.match("^weather.")){const t=this._config.entity_pop_1;var f;void 0!==this.forecast1&&(f=this._getForecastPropFromWeather(this.forecast1,l,"precipitation_probability")),u=t?F`<div class="f-slot-vert"><div class="f-label">Chance of rain </div>
        <div class="pop">${this.hass.states[t]&&void 0!==f?Math.round(Number(f)):"---"}</div><div class="unit">%</div></div>`:F``}else{const t=(v=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0;u=v?F`
          <div class="f-slot-vert"><div class="f-label">Chance of rain </div>
          <div class="pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></div>`:F``}if(null===(n=this._config.entity_pos_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_pos_1;var b;void 0!==this.forecast1&&(b=this._getForecastPropFromWeather(this.forecast1,l,"precipitation")),p=t?F`<div class="f-slot-vert"><div class="f-label">Possible rain </div>
        <div class="pos">${this.hass.states[t]&&void 0!==b?b:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></div>`:F``}else{const t=(v=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0;p=v?F`
          <div class="f-slot-vert"><div class="f-label">Possible rain </div>
          <div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>
          <div class="unit">${this.getUOM("precipitation")}</div></div>`:F``}var w,$=F``;if(null===(a=this._config.entity_extended_1)||void 0===a?void 0:a.match("^weather.")){if(void 0!==this.forecast1)w=void 0,!0===this._config.daily_extended_use_attr?void 0!==this._config.daily_extended_name_attr&&(w=this._getForecastPropFromWeather(this.forecast1,l,this._config.daily_extended_name_attr)):w="daily_extended_use_attr: - must be set to true when entity_extended_1 is set to a weather entity",void 0!==w&&($=w?F`<div class="f-extended">${w}</div>`:F``)}else if(v=!!(this._config.entity_extended_1&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g),c<(this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days:7))if(!0===this._config.daily_extended_use_attr){const t=(v=!!this._config.entity_extended_1&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):this._config.entity_extended_1;if(t&&void 0!==this.hass.states[t]){const e=null==(v=!!(this._config.daily_extended_name_attr&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.daily_extended_name_attr.match(/(\d+)(?!.*\d)/g))&&t&&this._config.daily_extended_name_attr?this.hass.states[t].attributes[this._config.daily_extended_name_attr]:v&&this._config.daily_extended_name_attr&&t?this._config.daily_extended_name_attr.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)).toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[t].attributes):void 0;$=e?F`<div class="f-extended">${e}</div>`:F``}}else{const t=v&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0;$=v?F`<div class="f-extended">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>`:F``}v=!!this._config.entity_fire_danger_1&&this._config.entity_fire_danger_1.match(/(\d+)(?!.*\d)/g),m=F``;const E=v&&this._config.entity_fire_danger_1?this._config.entity_fire_danger_1.replace(/(\d+)(?!.*\d)/g,String(Number(v)+c)):void 0;if(v&&E){var x=!1!==this._config.option_daily_color_fire_danger&&this.hass.states[E].attributes.color_fill?`background-color:${this.hass.states[E].attributes.color_fill}; color:${this.hass.states[E].attributes.color_text};`:"";!1===this._config.option_daily_color_fire_danger?m=v&&"unknown"!==this.hass.states[E].state?F`
          <div class="f-firedanger-vert">${E&&this.hass.states[E]?this.hass.states[E].state:"---"}</div>`:F``:(""===x&&(x="font-weight:300;"),m=v&&"unknown"!==this.hass.states[E].state?F`
          <div class="f-firedanger-vert">
            <p class="fire-danger-text-color" style="${x}">${E&&this.hass.states[E]?this.hass.states[E].state.toUpperCase():"---"}</p>
          </div>`:F``)}r.push(F`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="dayname-vert">${l?l.toLocaleDateString(this.locale,{weekday:"short"}):"---"}${!0===this._config.option_daily_forecast_date&&l?F` ${l.toLocaleDateString(this.locale,{day:"numeric",month:"numeric"})}`:""}</div>
            ${y}
          </div>
          <div>
            ${m}
          </div>
          <div class="day-vert-middle">
            <div class="day-vert-dayicon">
              ${_}
            </div>
            <div class="day-vert-temps">
              ${z}
              ${S}
            </div>
            <div class="day-vert-rain">
              ${u}
              ${p}
            </div>
          </div>
          <div class="day-vert-bottom">
            ${$}
          </div>
        </div>
      `)}return F`
      <div class="daily-forecast-vert-section section">
        ${r}
      </div>
    `}_getForecastPropFromWeather(t,e,i){if(!t)return;const s=e.toDateString(),o=t.filter(t=>new Date(t.datetime).toDateString()===s);if(1===o.length)return void 0!==o[0][i]?String(o[0][i]):void 0;if(2===o.length){const t=o.find(t=>!0===t.daytime),e=o.find(t=>!1===t.daytime);return"templow"===i?e&&void 0!==e.temperature?String(e.temperature):void 0:t&&void 0!==t[i]?String(t[i]):void 0}}_getCardSizeDailyForecastSection(){var t=0;return!1!==this._config.show_section_daily_forecast&&("vertical"!==this._config.daily_forecast_layout?t+=146:(t+=18+87*(this._config.daily_forecast_days||5),0!==this._config.daily_extended_forecast_days&&(t+=48*Math.min(this._config.daily_forecast_days||5,this._config.daily_extended_forecast_days||7)))),t}_getWindUnit(){var t,e,i,s,o,n;const a=this._config.entity?null===(e=null===(t=this.hass.states[this._config.entity])||void 0===t?void 0:t.attributes)||void 0===e?void 0:e.wind_speed_unit:void 0;if(a)return a;const r=null===(s=null===(i=this.hass.config)||void 0===i?void 0:i.unit_system)||void 0===s?void 0:s.wind_speed;return r&&"m/s"!==r?r:"km"===(null===(n=null===(o=this.hass.config)||void 0===o?void 0:o.unit_system)||void 0===n?void 0:n.length)?"km/h":"mph"}_localizeUnit(t){var e;return function(t,e){var i,s,o;const n=(t||"en").split("-")[0].toLowerCase();return null!==(o=null===(s=null===(i=zt[n])||void 0===i?void 0:i.units)||void 0===s?void 0:s[e])&&void 0!==o?o:e}(this.locale||(null===(e=this.hass)||void 0===e?void 0:e.language),t)}static _escapeHtml(t){return String(null!=t?t:"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}_buildTooltipRows(t){const{date:e,condition:i,maxT:s,minT:o,precip:n,windSpeed:a,windBearDeg:r,uomPrecip:l="",uomWind:c=""}=t;let _="";const d=t=>this.constructor._escapeHtml(t);if(e&&(_+=`<div class="fcasttooltiptext" style="color:#fff;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:3px;margin-bottom:4px;">${d(e)}</div>`),i&&(_+=`<div class="fcasttooltiptext" style="color:#fff;margin-bottom:2px;">${d(i)}</div>`),null!=s&&(_+=`<div class="fcasttooltiptext" style="color:#fff;margin-top:2px;"><b style="color:#ef5350;">↑ ${Math.round(s)}°</b>&nbsp;&nbsp;<b style="color:#90caf9;">↓ ${null!=o?Math.round(o)+"°":"---"}</b></div>`),null!=n&&n>0&&(_+=`<div class="fcasttooltiptext" style="color:#fff;">💧 ${n.toFixed(1)} ${d(this._localizeUnit(l))}</div>`),null!=a){_+=`<div class="fcasttooltiptext" style="color:#fff;">${null!=r&&isFinite(Number(r))?`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" style="transform:rotate(${(Number(r)+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:2px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:""}${a} ${d(this._localizeUnit(c))}</div>`}return _}_renderChartSection(){var t,e,i,s,o,n;if(!1===this._config.show_section_charts)return F``;const a=!0===this._config.option_show_temperature_chart,r=!0===this._config.option_show_precipitation_chart;if(!a&&!r)return F``;if(!this.forecast1||0===this.forecast1.length)return F``;const l=this._config.daily_forecast_days||5,c=this.constructor.COMPASS_DEG,_=[];for(let o=0;o<l;o++){const n=new Date;n.setDate(n.getDate()+o+(this._config.option_show_current_day?0:1));const a=t=>this._getForecastPropFromWeather(this.forecast1,n,t);if(void 0===a("condition"))break;const r=a("temperature"),l=a("templow"),d=a("wind_speed"),h=a("wind_bearing");let u=null;if(void 0!==h){const e=Number(h);u=isNaN(e)?null!==(t=c[String(h).toUpperCase().trim()])&&void 0!==t?t:null:e}_.push({maxT:Number(null!=r?r:0),minT:Number(null!==(e=null!=l?l:r)&&void 0!==e?e:0),precip:Number(null!==(i=a("precipitation"))&&void 0!==i?i:0),windSpeed:void 0!==d?Math.round(Number(d)):null,windBear:u,datetime:String(null!==(s=a("datetime"))&&void 0!==s?s:"")})}if(0===_.length)return F``;const d=a?75:52,h=d+(r?16:0),u=a?_.flatMap(t=>[t.maxT,t.minT]):[],p=a?Math.max(...u):0,m=a?Math.min(...u):0,g=p-m||1,v=d-16,y=t=>16+(p-t)/g*(v-16),f=_.map(t=>{let e=y(t.maxT),i=y(t.minT);const s=i-e;if(s<18){const t=(18-s)/2;e-=t,i+=t}return{maxY:e,minY:i}}),b=100/_.length,w=t=>(t+.5)*b,$=a?(()=>{const t=f.map((t,e)=>`${w(e)},${t.maxY}`).join(" "),e=f.map((t,e)=>`${w(e)},${t.minY}`).join(" ");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${h}" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:${h}px;overflow:visible;pointer-events:none;"><polyline points="${t}" fill="none" stroke="rgba(255,152,0,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${e}" fill="none" stroke="rgba(90,150,210,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>`+(r?`<line x1="0" y1="${d}" x2="100" y2="${d}" stroke="rgba(115,198,239,0.2)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>`:"")+"</svg>"})():"",x=this._localizeUnit((this._config.entity?null===(n=null===(o=this.hass.states[this._config.entity])||void 0===o?void 0:o.attributes)||void 0===n?void 0:n.precipitation_unit:void 0)||this.getUOM("precipitation")),k=_.map((t,e)=>{var i,s,o,n,l;let c="";if(a){const i=f[e].maxY-6.5,s=f[e].minY-6.5;c+=`<div style="position:absolute;top:${i}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(255,152,0,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.maxT)}°</div>`,c+=`<div style="position:absolute;top:${s}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(90,150,210,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.minT)}°</div>`}if(r){const e=Math.max(..._.map(t=>t.precip),.1),i=.85*d;if(t.precip>0){const s=Math.max(t.precip/e*i,2),o=d-s,n=this.constructor._escapeHtml((t.precip%1==0?String(t.precip):t.precip.toFixed(1))+" "+x);c=`<div style="position:absolute;top:${o}px;left:0;right:0;height:${s}px;background:rgba(151,230,255,0.50);border-radius:2px 2px 0 0;z-index:0;"></div>`+c,c+=`<div style="position:absolute;top:${d-6}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(115,198,239,0.85);border-radius:2.5px;background:rgba(10,14,24,0.9);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${n}</div>`}else c+=`<div style="position:absolute;top:${d-1}px;left:0;right:0;height:2px;background:rgba(151,230,255,0.15);border-radius:1px;"></div>`}const u=h,p=this.locale,m=t.datetime?new Date(t.datetime).toLocaleDateString(p,{weekday:"long",month:"short",day:"numeric"}):"",g=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g);let v="";if(null===(i=this._config.entity_summary_1)||void 0===i?void 0:i.match("^weather.")){const e=t.datetime?new Date(t.datetime):null,i=t=>e?this._getForecastPropFromWeather(this.forecast1,e,t):void 0;v=String(null!==(o=null!==(s=i("detailed_description"))&&void 0!==s?s:i("condition"))&&void 0!==o?o:"")}else if(g&&this._config.entity_summary_1){const t=this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(g)+e));v=this.hass.states[t]?this.hass.states[t].state:""}const y=this._getWindUnit(),b=(this._config.entity?null===(l=null===(n=this.hass.states[this._config.entity])||void 0===n?void 0:n.attributes)||void 0===l?void 0:l.precipitation_unit:void 0)||this.getUOM("precipitation"),w=this._buildTooltipRows({date:m,condition:v,maxT:a?t.maxT:null,minT:a?t.minT:null,precip:t.precip,windSpeed:t.windSpeed,windBearDeg:t.windBear,uomPrecip:b,uomWind:y});return`<div class="day-horiz fcasttooltip" style="position:relative;height:${u}px;overflow:visible;">${`<div class="fcasttooltipblock" style="width:${100*_.length}%;left:-${100*e}%;">`+w+`<span style="position:absolute;top:100%;left:${100/_.length/2+e*(100/_.length)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}${c}</div>`}).join("");return F`<div class="daily-forecast-horiz-section section"
        style="position:relative;margin-top:4px;margin-bottom:4px;padding-top:0;padding-bottom:0;">
      ${kt($+k)}
    </div>`}_renderDailyForecastSection(){var t;return!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)?F``:"vertical"!==this._config.daily_forecast_layout?this._renderHorizontalDailyForecastSection():this._renderVerticalDailyForecastSection()}render(){var t,e;const i=[];this.hassExtended=this.hass;const s=((t,e)=>{var i,s;if(void 0===e){if(void 0!==(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(i=null==t?void 0:t.forecast)||void 0===i?void 0:i.length)>2)return{forecast:t.forecast,type:null==t?void 0:t.type};e="daily"}if(e===(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(s=null==t?void 0:t.forecast)||void 0===s?void 0:s.length)>2)return{forecast:t.forecast,type:e}})(this._forecastEvent,null===(t=this._config)||void 0===t?void 0:t.forecast_type);this.forecast1=this._config.weather_entity&&(null===(e=null==s?void 0:s.forecast)||void 0===e?void 0:e.length)?s.forecast.slice(0,this._config.daily_forecast_days?this._config.daily_forecast_days:5):void 0,this._checkForErrors()&&i.push(this._showConfigWarning(this._error));const o=[];return void 0!==this._config.section_order&&this._config.section_order.forEach(t=>{switch(t){case"overview":o.push(this._renderOverviewSection());break;case"extended":o.push(this._renderExtendedSection());break;case"slots":o.push(this._renderSlotsSection());break;case"daily_forecast":o.push(this._renderDailyForecastSection()),o.push(this._renderChartSection())}}),i.push(F`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card"
        tabindex=${(t=>null!=t?t:W)(ft(this._config.tap_action)?"0":void 0)}
        ><div class="content">
          ${o}
        </div>
      </ha-card>
    `),F`${i}`}_onPointerDown(t){var e;if(!t.isPrimary)return;const i=t.target;(null==i?void 0:i.closest("li.slot-tappable, .overview-tappable"))||(this._pHoldFired=!1,clearTimeout(this._pHoldTimer),this.hass&&this._config&&ft(null===(e=this._config)||void 0===e?void 0:e.hold_action)&&(this._pHoldTimer=window.setTimeout(()=>{this._pHoldFired=!0,this.hass&&this._config&&yt(this,this.hass,this._config,"hold")},500)))}_onPointerCancel(){clearTimeout(this._pHoldTimer),this._pHoldFired=!1}_onCardClick(){var t,e;this._pHoldFired?this._pHoldFired=!1:this.hass&&this._config&&(ft(null===(t=this._config)||void 0===t?void 0:t.double_tap_action)?(this._clickCount++,1===this._clickCount?this._clickTimer=window.setTimeout(()=>{var t;this._clickCount=0,this.hass&&this._config&&ft(null===(t=this._config)||void 0===t?void 0:t.tap_action)&&yt(this,this.hass,this._config,"tap")},250):(clearTimeout(this._clickTimer),this._clickCount=0,yt(this,this.hass,this._config,"double_tap"))):ft(null===(e=this._config)||void 0===e?void 0:e.tap_action)&&yt(this,this.hass,this._config,"tap"))}get slotL1(){return this.slotValue("l1",this._config.slot_l1)}get slotL2(){return this.slotValue("l2",this._config.slot_l2)}get slotL3(){return this.slotValue("l3",this._config.slot_l3)}get slotL4(){return this.slotValue("l4",this._config.slot_l4)}get slotL5(){return this.slotValue("l5",this._config.slot_l5)}get slotL6(){return this.slotValue("l6",this._config.slot_l6)}get slotL7(){return this.slotValue("l7",this._config.slot_l7)}get slotL8(){return this.slotValue("l8",this._config.slot_l8)}get slotR1(){return this.slotValue("r1",this._config.slot_r1)}get slotR2(){return this.slotValue("r2",this._config.slot_r2)}get slotR3(){return this.slotValue("r3",this._config.slot_r3)}get slotR4(){return this.slotValue("r4",this._config.slot_r4)}get slotR5(){return this.slotValue("r5",this._config.slot_r5)}get slotR6(){return this.slotValue("r6",this._config.slot_r6)}get slotR7(){return this.slotValue("r7",this._config.slot_r7)}get slotR8(){return this.slotValue("r8",this._config.slot_r8)}slotValue(t,e){switch(e){case"pop":return this.slotPop;case"popforecast":return this.slotPopForecast;case"possible_today":return this.slotPos;case"possible_tomorrow":return this.slotPossibleTomorrow;case"rainfall":return this.slotRainfall;case"humidity":return this.slotHumidity;case"pressure":return this.slotPressure;case"observed_max":return this.slotObservedMax;case"observed_min":return this.slotObservedMin;case"forecast_max":return this.slotForecastMax;case"forecast_min":return this.slotForecastMin;case"temp_next":return this.slotTempNext;case"temp_following":return this.slotTempFollowing;case"temp_maximums":return this.slotTempMaximums;case"temp_minimums":return this.slotTempMinimums;case"uv_summary":return this.slotUvSummary;case"fire_danger":return this.slotFireDanger;case"wind":return this.slotWind;case"wind_gust":return this.slotWindGust;case"wind_kt":return this.slotWindKt;case"visibility":return this.slotVisibility;case"sun_next":return this.slotSunNext;case"sun_following":return this.slotSunFollowing;case"moon":return this.slotMoon;case"custom1":return this.slotCustom1;case"custom2":return this.slotCustom2;case"custom3":return this.slotCustom3;case"custom4":return this.slotCustom4;case"empty":return this.slotEmpty;case"remove":return this.slotRemove}switch(t){case"l1":return this.slotForecastMax;case"l2":return this.slotForecastMin;case"l3":return this.slotWind;case"l4":return this.slotPressure;case"l5":return this.slotSunNext;case"l6":case"l7":case"l8":case"r6":case"r7":case"r8":return this.slotRemove;case"r1":return this.slotPopForecast;case"r2":return this.slotHumidity;case"r3":return this.slotUvSummary;case"r4":return this.slotMoon;case"r5":return this.slotSunFollowing}return this.slotEmpty}get slotEmpty(){return F`<li>&nbsp;</li>`}get slotRemove(){return F``}get slotPopForecast(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation_probability:void 0,e=this._config.entity_pop&&void 0!==this.hass.states[this._config.entity_pop]?null===this._config.entity_pop.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pop].state||"unavailable"===this.hass.states[this._config.entity_pop].state?"---":Math.round(Number(this.hass.states[this._config.entity_pop].state)):void 0!==t?Math.round(Number(t)):"---":"---",i="---"!==e?F`<div class="slot-text unit">%</div>`:F``,s=void 0!==this.forecast1?this.forecast1[0].precipitation:void 0,o=this._config.entity_pos&&void 0!==this.hass.states[this._config.entity_pos]?null===this._config.entity_pos.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pos].state||"unavailable"===this.hass.states[this._config.entity_pos].state?"---":this.hass.states[this._config.entity_pos].state:void 0!==s?s:"---":"---",n="---"!==o?F`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:F``;return F`
      <li data-slot="popforecast">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${e}</div>${i}<div class="slot-text">&nbsp;</div>
          <div class="slot-text pop-text-today">${o}</div>${n}
        </div>
      </li>
    `}get slotPop(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation_probability:void 0,e=this._config.entity_pop&&void 0!==this.hass.states[this._config.entity_pop]?null===this._config.entity_pop.match("^weather.")?Math.round(Number(this.hass.states[this._config.entity_pop].state)):void 0!==t?Math.round(Number(t)):"---":"---",i="---"!==e?F`<div class="slot-text unit">%</div>`:F``;return F`
      <li data-slot="pop">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${e}</div>${i}<div class="slot-text"></div>
        </div>
      </li>
    `}get slotPos(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation:void 0,e=this._config.entity_pos&&void 0!==this.hass.states[this._config.entity_pos]?null===this._config.entity_pos.match("^weather.")?this.hass.states[this._config.entity_pos].state:void 0!==t?t:"---":"---",i="---"!==e?F`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:F``;return F`
      <li data-slot="possible_today">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosToday}&nbsp;<div class="slot-text possible_today-text">${e}</div>${i}
        </div>
      </li>
    `}get slotPossibleTomorrow(){const t=void 0!==this.forecast1&&this.forecast1.length>1?this.forecast1[1].precipitation:void 0,e=this._config.entity_possible_tomorrow&&void 0!==this.hass.states[this._config.entity_possible_tomorrow]?null===this._config.entity_possible_tomorrow.match("^weather.")?this.hass.states[this._config.entity_possible_tomorrow].state:void 0!==t?t:"---":"---",i="---"!==e?F`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:F``;return F`
      <li data-slot="possible_tomorrow">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>${this.localeTextPosTomorrow}&nbsp;<div class="slot-text possible_tomorrow-text">${e}</div>${i}
        </div>
      </li>
    `}get slotRainfall(){const t=this.currentRainfall,e="---"!==t?F`<div class="slot-text unit"></span>${this.getUOM("precipitation")}</div>`:F``;return F`
      <li data-slot="rainfall">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text rainfall-text">${t}</div>${e}
        </div>
      </li>
    `}get slotHumidity(){const t=this.currentHumidity,e="---"!==t?F`<div class="slot-text unit">%</div>`:F``;return F`
      <li data-slot="humidity">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:water-percent"></ha-icon>
          </div>
          <div class="slot-text humidity-text">${t}</div>${e}
        </div>
      </li>`}get pressureTrend(){const t=this._config.entity_pressure_trend;if(!t||!this.hass.states[t])return null;const e=this.hass.states[t].state,i=Number(e);if(!isNaN(i))return i>.05?"rising":i<-.05?"falling":"steady";const s=String(e).toLowerCase();return["rising","up","increasing"].includes(s)?"rising":["falling","down","decreasing"].includes(s)?"falling":["steady","stable"].includes(s)?"steady":null}get localForecastText(){var t,e;const i=this._config.entity_pressure;if(!0!==this._config.option_local_forecast||!i||!this.hass.states[i])return null;const s=this.hass.states[i],o=null===i.match("^weather.")?s.state:s.attributes.pressure,n=Number(o);if(isNaN(n))return null;let a=function(t,e){const i=(e||"").toLowerCase().replace(/\s/g,"");return"inhg"===i||'"hg'===i?33.8639*t:"mmhg"===i||"torr"===i?1.33322*t:"kpa"===i?10*t:"psi"===i?68.9476*t:"pa"===i?t/100:t}(n,this._config.pressure_units?this._config.pressure_units:null===i.match("^weather.")?s.attributes.unit_of_measurement:s.attributes.pressure_unit);const r=Number(this._config.option_forecast_altitude);if(!isNaN(r)&&r>0){const t=this._config.entity_temperature,e=t&&this.hass.states[t]?null===t.match("^weather.")?this.hass.states[t].state:this.hass.states[t].attributes.temperature:void 0,i=Number(e);a=function(t,e,i=15){if(!e)return t;const s=i+273.15;return t*Math.pow(1-.0065*e/(s+.0065*e),-5.257)}(a,r,isNaN(i)?15:i)}let l=0;const c=this._config.entity_pressure_trend;if(c&&this.hass.states[c]){const t=Number(this.hass.states[c].state);if(isNaN(t)){const t=this.pressureTrend;l="rising"===t?.2:"falling"===t?-.2:0}else l=t}const _=(null!==(e=null===(t=this.hass.config)||void 0===t?void 0:t.latitude)&&void 0!==e?e:42)>=0,d=(new Date).getMonth()+1;let h=this.windBearingDegrees;const u=this._config.entity_wind_speed;if(null!==h&&u&&this.hass.states[u]){const t=function(t,e){const i=(e||"").toLowerCase().replace(/\s/g,"");return"m/s"===i||"ms"===i?3.6*t:"mph"===i||"mi/h"===i?1.60934*t:"kn"===i||"kt"===i||"knots"===i?1.852*t:"ft/s"===i||"fps"===i?1.09728*t:t}(Number(this.hass.states[u].state),this.hass.states[u].attributes.unit_of_measurement);!isNaN(t)&&t<2&&(h=null)}let p=this._zamTrendCat;l>=.12?p="rising":l<=-.12?p="falling":("rising"===p&&l<.08||"falling"===p&&l>-.08)&&(p="steady"),this._zamTrendCat=p;const m=function(t,e,i,s,o,n=1050,a=950){if(!isFinite(t)||t<=0)return null;let r=950+100*(t-a)/(n-a);if(null!==i&&isFinite(i)){let t=Math.round((i%360+360)%360/22.5)%16;o||(t=(t+8)%16),r+=Pt[t]}const l=e>=4&&e<=9;let c,_;s>=.1?(o===l&&(r+=3.2),c=.174*(1031.4-r),_="abbcfgijlmmqty"):s<=-.1?(o===l&&(r-=3.2),c=.1553*(1029.95-r),_="bdhoruvxxz"):(c=.2314*(1030.81-r),_="abbbeknnppswwxxxz");const d=Math.min(Math.max(Math.round(c),0),_.length-1);return _.charAt(d)}(a,d,h,"rising"===p?.2:"falling"===p?-.2:0,_);if(null===m)return null;const g=`${m}|${null!==this.pressureTrend||c&&this.hass.states[c]&&!isNaN(Number(this.hass.states[c].state))?p:""}`,v=Date.now();null===this._zamShownKey||g===this._zamShownKey?(this._zamShownKey=g,this._zamCandidateKey=null):g!==this._zamCandidateKey?(this._zamCandidateKey=g,this._zamCandidateTs=v):v-this._zamCandidateTs>=3e5&&(this._zamShownKey=g,this._zamCandidateKey=null);const[y,f]=this._zamShownKey.split("|");if(!0===this._config.option_local_forecast_verbose){const t=Et(this.locale,y,!0);return f?`${t} ${Et(this.locale,f,!0)}`:t}return Et(this.locale,y)}_slotTapEntity(t){if(!1===this._config.option_slot_tap_more_info)return null;const e=this._config,i={pop:e.entity_pop,popforecast:e.entity_pop,possible_today:e.entity_pos,possible_tomorrow:e.entity_possible_tomorrow,rainfall:e.entity_rainfall,humidity:e.entity_humidity,pressure:e.entity_pressure,observed_max:e.entity_observed_max,observed_min:e.entity_observed_min,forecast_max:e.entity_forecast_max,forecast_min:e.entity_forecast_min,temp_next:e.entity_temp_next,temp_following:e.entity_temp_following,temp_maximums:e.entity_forecast_max,temp_minimums:e.entity_forecast_min,uv_summary:e.entity_uv_alert_summary,fire_danger:e.entity_fire_danger,wind:e.entity_wind_speed,wind_gust:e.entity_wind_gust,wind_kt:e.entity_wind_speed_kt,visibility:e.entity_visibility,moon:e.entity_moon,custom1:e.custom1_value,custom2:e.custom2_value,custom3:e.custom3_value,custom4:e.custom4_value}[t];return i&&this.hass.states[i]&&!i.startsWith("weather.")?i:null}_overviewTapEntity(t){if(!1===this._config.option_slot_tap_more_info)return null;const e="temperature"===t?this._config.entity_temperature:this._config.entity_apparent_temp;return e&&this.hass.states[e]&&!e.startsWith("weather.")?e:null}_overviewClick(t){const e=t.currentTarget.dataset.overview;if(!e)return;const i=this._overviewTapEntity(e);null!==i&&(t.stopPropagation(),mt(this,"hass-more-info",{entityId:i}))}_slotClick(t){const e=t.target.closest("li[data-slot]");if(!e||!e.dataset.slot)return;const i=this._slotTapEntity(e.dataset.slot);null!==i&&(t.stopPropagation(),mt(this,"hass-more-info",{entityId:i}))}get slotPressure(){const t="---"!==this.currentPressure?F`<div class="slot-text unit">${this._config.pressure_units?this._config.pressure_units:this.getUOM("air_pressure")}</div>`:F``,e=this.pressureTrend,i=null===e?F``:F`<div class="slot-text pressure-trend"><ha-icon
      icon="${"rising"===e?"mdi:arrow-top-right-thin":"falling"===e?"mdi:arrow-bottom-right-thin":"mdi:arrow-right-thin"}"
      style="--mdc-icon-size: 16px; color: ${"rising"===e?"var(--label-badge-green, #4caf50)":"falling"===e?"var(--label-badge-red, #f44336)":"var(--secondary-text-color)"};"></ha-icon></div>`;return F`
      <li data-slot="pressure">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:gauge"></ha-icon>
          </div>
          <div class="slot-text pressure-text">${this.currentPressure}</div>${t}${i}
        </div>
      </li>
    `}get slotObservedMax(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_max&&void 0!==this.hass.states[this._config.entity_observed_max]?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="observed_max">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${i}
        </div>
      </li>
    `}get slotObservedMin(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_min&&void 0!==this.hass.states[this._config.entity_observed_min]?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i="---"!==e?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="observed_min">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObservedMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${i}
        </div>
      </li>
    `}get slotForecastMax(){const t=void 0!==this.forecast1?this.forecast1[0].temperature:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?null===this._config.entity_forecast_max.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",s="---"!==i?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="forecast_max">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${s}
        </div>
      </li>
    `}get slotForecastMin(){const t=void 0!==this.forecast1?this.forecast1[0].templow:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?null===this._config.entity_forecast_min.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",s="---"!==i?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="forecast_min">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${s}
        </div>
      </li>
    `}get slotTempNext(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_next&&void 0!==this.hass.states[this._config.entity_temp_next]?Number(this.hass.states[this._config.entity_temp_next].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state:"",o="---"!==i?F`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="temp_next">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempFollowing(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_following&&void 0!==this.hass.states[this._config.entity_temp_following]?Number(this.hass.states[this._config.entity_temp_following].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state:"",o="---"!==i?F`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="temp_following">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempMaximums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_max&&void 0!==this.hass.states[this._config.entity_observed_max]?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="temp_maximums">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMax}&nbsp;</div>
          <div class="slot-text observed-max-text">${e}</div>${s}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${s}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotTempMinimums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_min&&void 0!==this.hass.states[this._config.entity_observed_min]?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?F`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:F``;return F`
      <li data-slot="temp_minimums">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextObsMin}&nbsp;</div>
          <div class="slot-text observed-min-text">${e}</div>${s}
          <div class="slot-text">&nbsp;(${this.localeTextFore}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${s}
          <div class="slot-text">)</div>
        </div>
      </li>
    `}get slotUvSummary(){const t=this._config.entity_uv_alert_summary&&void 0!==this.hass.states[this._config.entity_uv_alert_summary]?"unknown"!==this.hass.states[this._config.entity_uv_alert_summary].state?this.hass.states[this._config.entity_uv_alert_summary].state:"Not Applicable":"---";return F`
      <li data-slot="uv_summary">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-sunny"></ha-icon>
          </div>
          <div class="slot-text trim daytime-uv-text" title="${this.localeTextUVRating} ${t}">${this.localeTextUVRating} ${t}</div>
        </div>
      </li>
    `}get slotFireDanger(){const t=this._config.entity_fire_danger,e=t&&void 0!==this.hass.states[t]?"unknown"!==this.hass.states[t].state?!1===this._config.option_color_fire_danger?this.hass.states[t].state:this.hass.states[t].state.toLocaleUpperCase():"Not Applicable":"---";var i=t&&!1!==this._config.option_color_fire_danger&&this.hass.states[t].attributes.color_fill?`background-color:${this.hass.states[t].attributes.color_fill}; color:${this.hass.states[t].attributes.color_text};`:"";return!1===this._config.option_color_fire_danger?F`
      <li data-slot="fire_danger">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text trim fire-danger-text" style="${i}">${e} </div>
        </div>
      </li>`:(""===i&&(i="font-weight:300; padding-left:0px;"),F`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:fire"></ha-icon>
          </div>
          <div class="slot-text trim fire-danger-text">
            <p class="fire-danger-text-color" style="${i}">${e}</p>
          </div>
        </div>
      </li>`)}get slotWind(){const t=this._config.entity_wind_speed&&this._config.option_show_beaufort?F`<div class="slot-text">BFT: ${this.currentBeaufort} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?F`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=F`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`,s=this._config.entity_wind_speed?F`<div class="slot-text">${this.currentWindSpeed}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust&&!1!==this._config.option_show_gust_in_wind?F`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGust}</div>${i})`:"";return F`
      <li data-slot="wind">
        <div class="slot">
          <div class="slot-icon">
            ${this._windIcon("mdi:weather-windy",this._config.option_wind_bearing_icon)}
          </div>
          ${t}${e}${s}${o}
        </div>
      </li>
    `}get slotWindGust(){if(!this._config.entity_wind_gust)return F``;const t=F`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`;return F`
      <li data-slot="wind_gust">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy-variant"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextGust}&nbsp;</div>
          <div class="slot-text">${this.currentWindGust}</div>${t}
        </div>
      </li>
    `}get slotWindKt(){const t=this._config.entity_wind_speed_kt&&this._config.option_show_beaufort?F`<div class="slot-text">BFT: ${this.currentBeaufortKt} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?F`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=F`<div class="slot-text unit">Kt</div>`,s=this._config.entity_wind_speed_kt?F`<div class="slot-text">${this.currentWindSpeedKt}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust_kt?F`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGustKt}</div>${i})`:"";return F`
      <li data-slot="wind_kt">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${s}${o}
        </div>
      </li>
    `}get slotVisibility(){const t=this.currentVisibility,e="---"!==t?this.getUOM("length"):"";return F`
      <li data-slot="visibility">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-fog"></ha-icon>
          </div>
          <div class="slot-text visibility-text">${t}</div>
          <div class="slot-text unit">${e}</div>
        </div>
      </li>
    `}get slotSunNext(){return this._config.entity_sun?this.sunSet.next:F``}get slotSunFollowing(){return this._config.entity_sun?this.sunSet.following:F``}get slotMoon(){if(!this._config.entity_moon)return F``;const t=this.hass.states[this._config.entity_moon];if(!t)return F``;const e=t.state;return F`
      <li data-slot="moon">
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${this.moonPhaseIcon(e)}"></ha-icon>
          </div>
          ${!0===this._config.option_moon_icon_only?F``:F`<div class="slot-text trim" title="${this.localeTextMoonPhase(e)}">${this.localeTextMoonPhase(e)}</div>`}
        </div>
      </li>
    `}moonPhaseIcon(t){switch(t){case"new_moon":return"mdi:moon-new";case"waxing_crescent":return"mdi:moon-waxing-crescent";case"first_quarter":return"mdi:moon-first-quarter";case"waxing_gibbous":return"mdi:moon-waxing-gibbous";case"full_moon":default:return"mdi:moon-full";case"waning_gibbous":return"mdi:moon-waning-gibbous";case"last_quarter":return"mdi:moon-last-quarter";case"waning_crescent":return"mdi:moon-waning-crescent"}}localeTextMoonPhase(t){return function(t,e){var i,s,o;const n=(t||"en").split("-")[0].toLowerCase();return null!==(o=null!==(s=null===(i=zt[n])||void 0===i?void 0:i.moonPhases[e])&&void 0!==s?s:zt.en.moonPhases[e])&&void 0!==o?o:e.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}(this.locale,t)}get slotCustom1(){var t=this._config.custom1_icon?this._config.custom1_icon:"mdi:help-box",e=this._config.custom1_value&&void 0!==this.hass.states[this._config.custom1_value]?this.hass.states[this._config.custom1_value].state:"unknown",i=this._config.custom1_units?this._config.custom1_units:"",s=this._config.custom1_label?this._config.custom1_label:"";return F`
      <li data-slot="custom1">
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?F`<div class="slot-text label-text">${s}</div>`:F``}
        <div class="slot-text trim custom-1-text" title="${e}">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom2(){var t=this._config.custom2_icon?this._config.custom2_icon:"mdi:help-box",e=this._config.custom2_value&&void 0!==this.hass.states[this._config.custom2_value]?this.hass.states[this._config.custom2_value].state:"unknown",i=this._config.custom2_units?this._config.custom2_units:"",s=this._config.custom2_label?this._config.custom2_label:"";return F`
      <li data-slot="custom2">
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?F`<div class="slot-text label-text">${s}</div>`:F``}
        <div class="slot-text trim custom-2-text" title="${e}">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom3(){var t=this._config.custom3_icon?this._config.custom3_icon:"mdi:help-box",e=this._config.custom3_value&&void 0!==this.hass.states[this._config.custom3_value]?this.hass.states[this._config.custom3_value].state:"unknown",i=this._config.custom3_units?this._config.custom3_units:"",s=this._config.custom3_label?this._config.custom3_label:"";return F`
      <li data-slot="custom3">
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?F`<div class="slot-text label-text">${s}</div>`:F``}
        <div class="slot-text trim custom-3-text" title="${e}">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom4(){var t=this._config.custom4_icon?this._config.custom4_icon:"mdi:help-box",e=this._config.custom4_value&&void 0!==this.hass.states[this._config.custom4_value]?this.hass.states[this._config.custom4_value].state:"unknown",i=this._config.custom4_units?this._config.custom4_units:"",s=this._config.custom4_label?this._config.custom4_label:"";return F`
      <li data-slot="custom4">
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?F`<div class="slot-text label-text">${s}</div>`:F``}
        <div class="slot-text trim custom-4-text" title="${e}">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get forecastIcon(){const t=this._config.entity_forecast_icon;return t&&this.hass.states[t]?this.hass.states[t].state:"---"}get currentTemperature(){const t=this._config.entity_temperature,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.temperature?Number(this.hass.states[t].attributes.temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---"}get currentApparentTemperature(){const t=this._config.entity_apparent_temp,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.apparent_temperature?Number(this.hass.states[t].attributes.apparent_temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---":""}get currentHumidity(){const t=this._config.entity_humidity;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.humidity?Number(this.hass.states[t].attributes.humidity).toLocaleString(this.locale):"---":"---"}get currentRainfall(){const t=this._config.entity_rainfall,e=!0===this._config.option_today_rainfall_decimals?1:0;return t&&this.hass.states[t]?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---"}get currentPressure(){const t=this._config.entity_pressure;var e=this._config.option_pressure_decimals?Math.max(Math.min(this._config.option_pressure_decimals,3),0):0;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.pressure?Number(this.hass.states[t].attributes.pressure).toLocaleString(this.locale):"---":"---"}get currentVisibility(){const t=this._config.entity_visibility;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.visibility?Number(this.hass.states[t].attributes.visibility).toLocaleString(this.locale):"---":"---"}get windBearingDegrees(){const t=this._config.entity_wind_bearing;if(!t||!this.hass.states[t])return null;const e=null===t.match("^weather.")?this.hass.states[t].state:this.hass.states[t].attributes.wind_bearing;if(null==e||""===e)return null;const i=Number(e);if(!isNaN(i))return i;const s=this.constructor.COMPASS_DEG[String(e).toUpperCase().trim()];return void 0!==s?s:null}_windIcon(t,e){const i=this.windBearingDegrees;return!0===e&&null!==i?F`<ha-icon icon="mdi:arrow-up" style="display:inline-block; transform: rotate(${(i+180)%360}deg);"></ha-icon>`:F`<ha-icon icon="${t}"></ha-icon>`}get currentWindBearing(){const t=this._config.entity_wind_bearing;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":isNaN(Number(this.hass.states[t].state))?this.hass.states[t].state:this.windDirections[Math.round(Number(this.hass.states[t].state)/360*16)]:void 0!==this.hass.states[t].attributes.wind_bearing?isNaN(Number(this.hass.states[t].attributes.wind_bearing))?this.hass.states[t].attributes.wind_bearing:this.windDirections[Math.round(Number(this.hass.states[t].attributes.wind_bearing)/360*16)]:"---":"---"}get currentWindSpeed(){const t=this._config.entity_wind_speed;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedUnit(){const t=this._config.entity_wind_speed;if(!t||!this.hass.states[t])return this.getUOM("length")+"/h";if(null!==t.match("^weather.")){const e=this.hass.states[t].attributes.wind_speed_unit;return void 0!==e?e:this.getUOM("length")+"/h"}return this.getUOM("length")+"/h"}get currentWindGust(){const t=this._config.entity_wind_gust;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_gust_speed?Math.round(Number(this.hass.states[t].attributes.wind_gust_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedKt(){const t=this._config.entity_wind_speed_kt;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindGustKt(){const t=this._config.entity_wind_gust_kt;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get windDirections(){return function(t){var e;const i=(t||"en").split("-")[0].toLowerCase(),s=null===(e=zt[i])||void 0===e?void 0:e.windDirections;return s&&s.length?s:zt.en.windDirections}(this.locale)}get currentBeaufort(){const t=this._config.entity_wind_speed;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);switch(this.hass.states[t].attributes.unit_of_measurement){case"mph":return e>=73?"12":e>=64?"11":e>=55?"10":e>=47?"9":e>=39?"8":e>=32?"7":e>=25?"6":e>=19?"5":e>=13?"4":e>=8?"3":e>=4?"2":e>=1?"1":"0";case"m/s":return e>=32.7?"12":e>=28.5?"11":e>=24.5?"10":e>=20.8?"9":e>=17.2?"8":e>=13.9?"7":e>=10.8?"6":e>=8?"5":e>=5.5?"4":e>=3.4?"3":e>=1.6?"2":e>=.5?"1":"0";default:return e>=118?"12":e>=103?"11":e>=89?"10":e>=75?"9":e>=62?"8":e>=50?"7":e>=39?"6":e>=29?"5":e>=20?"4":e>=12?"3":e>=6?"2":e>=2?"1":"0"}}return"---"}get currentBeaufortKt(){const t=this._config.entity_wind_speed_kt;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);return e>=64?"12":e>=56?"11":e>=48?"10":e>=41?"9":e>=34?"8":e>=28?"7":e>=22?"6":e>=17?"5":e>=11?"4":e>=7?"3":e>=4?"2":e>=1?"1":"0"}return"---"}get sunSet(){var t,e,i;switch(this.timeFormat){case"12hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"";break;case"24hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"";break;case"system":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):""}var s=new Date;if(s.setDate(s.getDate()+1),this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const o=null===(t=this.hass.states[this._config.entity_sun].attributes)||void 0===t?void 0:t.elevation;return(void 0!==o?o>0:"above_horizon"===this.hass.states[this._config.entity_sun].state)?(i=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,{next:F`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${e}</div>
            </li>`,following:F`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${i}</div>
            </li>`,nextText:e,followingText:i,nextIcon:"mdi:weather-sunset-down",followingIcon:"mdi:weather-sunset-up"}):((new Date).getDate()!=new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()&&(i=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,e=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+e),{next:F`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-next-icon" icon="mdi:weather-sunset-up"></ha-icon>
              </div>
              <div class="slot-text sun-next-text">${i}</div>
            </li>`,following:F`
            <li>
              <div class="slot-icon">
                <ha-icon id="sun-following-icon" icon="mdi:weather-sunset-down"></ha-icon>
              </div>
              <div class="slot-text sun-following-text">${e}</div>
            </li>`,nextText:i,followingText:e,nextIcon:"mdi:weather-sunset-up",followingIcon:"mdi:weather-sunset-down"})}return{next:F``,following:F``,nextText:"",followingText:"",nextIcon:"",followingIcon:""}}get timeFormat(){var t,e;if(this._config.option_time_format&&"system"!==this._config.option_time_format)return this._config.option_time_format;const i=null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.time_format;return"12"===i?"12hour":"24"===i?"24hour":"system"}_formatDate(t){var e,i;const s=null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.date_format,o=this.locale||navigator.language;switch(s){case"DMY":default:return t.toLocaleDateString(o,{weekday:"short",day:"numeric",month:"short",year:"numeric"}).replace(",","");case"MDY":return t.toLocaleDateString(o,{weekday:"short",month:"short",day:"numeric",year:"numeric"}).replace(",","");case"YMD":return t.toLocaleDateString(o,{weekday:"short",year:"numeric",month:"short",day:"numeric"}).replace(",","")}}_getIconUrl(t,e=!1){var i,s,o,n,a;const r=null!==(s=null===(i=this._config)||void 0===i?void 0:i.icon_pack)&&void 0!==s?s:"default",l=e?t.replace("-night","-day"):t;if("default"===r){const t=(null===(o=this._config)||void 0===o?void 0:o.option_static_icons)?"s-":"a-";return this._iconBaseUrl()+t+l+".svg"}const c=this._iconToWcc(l);if("wcc-2"===r)return`/hacsfiles/weather-chart-card/icons2/${c}.svg`;const _=this._iconToMeteocons(l);if("meteocons-fill"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${_}.svg`;if("meteocons-line"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/line/all/${_}.svg`;if("custom"===r&&(null===(n=this._config)||void 0===n?void 0:n.icon_pack_path))return this._config.icon_pack_path.replace("{condition}",c);const d=(null===(a=this._config)||void 0===a?void 0:a.option_static_icons)?"s-":"a-";return this._iconBaseUrl()+d+l+".svg"}_iconBaseUrl(){const t=import.meta.url.split("?")[0];return t.substring(0,t.lastIndexOf("/")+1)}_iconToWcc(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partlycloudy-day","cloudy-1-night":"partlycloudy-night","cloudy-2-day":"partlycloudy-day","cloudy-2-night":"partlycloudy-night",cloudy:"cloudy","haze-day":"fog","haze-night":"fog","frost-day":"snow","frost-night":"snow","rainy-2":"rain",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"exceptional","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"lightning-rain","scattered-thunderstorms-night":"lightning-rain","rainy-3":"pouring","tropical-storm":"exceptional","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"lightning","isolated-thunderstorms-night":"lightning",unknown:"exceptional"}[t])&&void 0!==e?e:"exceptional"}_iconToMeteocons(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partly-cloudy-day","cloudy-1-night":"partly-cloudy-night","cloudy-2-day":"partly-cloudy-day","cloudy-2-night":"partly-cloudy-night",cloudy:"cloudy","haze-day":"haze","haze-night":"haze","frost-day":"snow","frost-night":"snow","rainy-2":"drizzle",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"dust-wind","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"thunderstorms-rain","scattered-thunderstorms-night":"thunderstorms-rain","rainy-3":"rain","tropical-storm":"tornado","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"thunderstorms","isolated-thunderstorms-night":"thunderstorms",unknown:"not-available"}[t])&&void 0!==e?e:"not-available"}_weatherIcon(t){switch(t){case"sunny":case"clear":return this.iconClear;case"mostly-sunny":case"mostly_sunny":return this.iconMostlySunny;case"partly-cloudy":case"partly_cloudy":case"partlycloudy":return this.iconPartlyCloudy;case"cloudy":return this.iconCloudy;case"hazy":case"hazey":case"haze":return this.iconHazy;case"frost":return this.iconFrost;case"light-rain":case"light_rain":return this.iconLightRain;case"wind":case"windy":return this.iconWindy;case"fog":case"foggy":return this.iconFog;case"showers":case"shower":return this.iconShowers;case"rain":case"rainy":return this.iconRain;case"dust":case"dusty":return this.iconDust;case"snow":case"snowy":return this.iconSnow;case"snowy-rainy":case"snowy_rainy":case"snowyrainy":return this.iconSnowRain;case"storm":case"stormy":return this.iconStorm;case"light-showers":case"light-shower":case"light_showers":case"light_shower":return this.iconLightShowers;case"heavy-showers":case"heavy-shower":case"heavy_showers":case"heavy_shower":case"pouring":return this.iconHeavyShowers;case"tropical-cyclone":case"tropical_cyclone":case"tropicalcyclone":return this.iconCyclone;case"clear-day":case"clear_day":return this.iconClearDay;case"clear-night":case"clear_night":return this.iconClearNight;case"sleet":return this.iconSleet;case"partly-cloudy-day":case"partly_cloudy_day":return this.iconPartlyCloudyDay;case"partly-cloudy-night":case"partly_cloudy_night":return this.iconPartlyCloudyNight;case"hail":return this.iconHail;case"lightning":case"lightning-rainy":case"lightning_rainy":case"thunderstorm":return this.iconLightning;case"windy-variant":case"windy_variant":return this.iconWindyVariant}return"unknown"}get dayOrNight(){var t;if(this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const e=this.hass.states[this._config.entity_sun];return void 0!==(null===(t=e.attributes)||void 0===t?void 0:t.elevation)?e.attributes.elevation>0?"day":"night":"above_horizon"===e.state?"day":"night"}return"day"}get iconClear(){return`clear-${this.dayOrNight}`}get iconMostlySunny(){return`cloudy-1-${this.dayOrNight}`}get iconPartlyCloudy(){return`cloudy-2-${this.dayOrNight}`}get iconCloudy(){return"cloudy"}get iconHazy(){return`haze-${this.dayOrNight}`}get iconFrost(){return`frost-${this.dayOrNight}`}get iconLightRain(){return"rainy-2"}get iconWindy(){return"wind"}get iconFog(){return`fog-${this.dayOrNight}`}get iconShowers(){return`rainy-1-${this.dayOrNight}`}get iconRain(){return`rainy-3-${this.dayOrNight}`}get iconDust(){return"dust"}get iconSnow(){return"snowy-3"}get iconSnowRain(){return"snow-and-sleet-mix"}get iconStorm(){return`scattered-thunderstorms-${this.dayOrNight}`}get iconLightShowers(){return`rainy-1-${this.dayOrNight}`}get iconHeavyShowers(){return"rainy-3"}get iconCyclone(){return"tropical-storm"}get iconClearDay(){return"clear-day"}get iconClearNight(){return"clear-night"}get iconSleet(){return"rain-and-sleet-mix"}get iconPartlyCloudyDay(){return"cloudy-1-day"}get iconPartlyCloudyNight(){return"cloudy-1-night"}get iconHail(){return"hail"}get iconLightning(){return`isolated-thunderstorms-${this.dayOrNight}`}get iconWindyVariant(){return"wind"}get compact(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)}get locale(){var t,e,i,s,o;try{return Intl.NumberFormat(this._config.option_locale),null!==(t=this._config.option_locale)&&void 0!==t?t:null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.language}catch(t){return null===(o=null===(s=this.hass)||void 0===s?void 0:s.locale)||void 0===o?void 0:o.language}}get localeTextFeelsLike(){return St(this.locale,"feels_like")}get localeTextObservedMax(){return St(this.locale,this.compact?"obs_max":"observed_max")}get localeTextObservedMin(){return St(this.locale,this.compact?"obs_min":"observed_min")}get localeTextObsMax(){return St(this.locale,"obs_max")}get localeTextObsMin(){return St(this.locale,"obs_min")}get localeTextForecastMax(){return St(this.locale,this.compact?"forecast_max_compact":"forecast_max")}get localeTextForecastMin(){return St(this.locale,this.compact?"forecast_min_compact":"forecast_min")}get localeTextPosToday(){return this.compact?"":St(this.locale,"pos_today")}get localeTextPosTomorrow(){return St(this.locale,this.compact?"pos_tomorrow_compact":"pos_tomorrow")}get localeTextFore(){return St(this.locale,"fore")}get localeTextUVRating(){return St(this.locale,"uv_rating")}get localeTextFireDanger(){return St(this.locale,"fire_danger")}get localeTextGust(){return St(this.locale,"gust")}getUOM(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":const i=this._config.entity_pressure;return i&&this.hass.states[i]?null===i.match("^weather.")?void 0!==this.hass.states[i].attributes.unit_of_measurement?this.hass.states[i].attributes.unit_of_measurement:"km"===e?"hPa":"mbar":void 0!==this.hass.states[i].attributes.pressure_unit?this.hass.states[i].attributes.pressure_unit:"--":"--";case"length":return e;case"precipitation":return"km"===e?"mm":"in";case"intensity":return"km"===e?"mm/h":"in/h";default:return this.hass.config.unit_system[t]||""}}_showConfigWarning(t){return F`
      <hui-warning>
        <div>Weather Card</div>
        ${t.map(t=>F`<div>${t}</div>`)}
      </hui-warning>
    `}_showWarning(t){return F`<hui-warning>${t}</hui-warning>`}_showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),F`${e}`}get styles(){const t=this._config.option_tooltips?"visible":"hidden",e=this._config.temp_font_weight||"300",i=this._config.temp_font_size||"4em",s=this._config.forecast_text_font_size||"21px",o=this._config.forecast_text_alignment||"center";return r`
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
        font-weight: ${a(e)};
        font-size: ${a(i)};
        color: var(--primary-text-color);
        position: relative;
        line-height: 74%;
      }
      .unit-temp-big {
        display: table-cell;
        vertical-align: top;
        font-weight: ${a(e)};
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
        font-size: ${a(s)};
        text-align: ${a(o)};
        line-height: 25px;
      }
      .forecast-text-right {
        font-size: ${a(s)};
        text-align: ${a(o)};
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
        padding-right: 8px;
      }
      .variations > li,
      .variations-ugly > li {
        flex: 0 0 50%;
        min-width: 0;
        max-width: 50%;
        box-sizing: border-box;
        overflow: hidden;
      }
      .slot-list {
        list-style: none;
        padding: 0;
      }
      .slot-list li {
        height:24px;
        display: flex;
        align-items: center;
        min-width: 0;
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
      .slot-list .slot {
        display: flex;
        align-items: center;
        min-width: 0;
        width: 100%;
      }
      .overview-tappable {
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.15s ease;
      }
      .overview-tappable:hover {
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      }
      li.slot-tappable {
        cursor: pointer;
        border-radius: 6px;
        transition: background 0.15s ease;
      }
      li.slot-tappable:hover {
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.15));
      }
      .slot-list .slot-icon {
        display: block;
        flex: 0 0 auto;
        position: relative;
        height: 18px;
        padding-right: 5px;
        color: var(--paper-item-icon-color);
      }
      .slot-text {
        display: table-cell;
        position: relative;
      }
      .slot-list .slot-text {
        display: block;
        flex: 0 0 auto;
        white-space: nowrap;
      }
      .slot-list .slot-text.trim {
        flex: 0 1 auto;
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .label-text {
        display: table-cell;
        position: relative;
        font-size: 0.85em;
        color: var(--secondary-text-color);
        padding-right: 4px;
      }
      .slot-list .label-text {
        display: block;
        flex: 0 0 auto;
        white-space: nowrap;
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
      .dayname-with-date {
        font-size: 0.8em;
        letter-spacing: -0.2px;
        white-space: nowrap;
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
        visibility: ${a(t)};
      }
      .fcasttooltiptext {
        padding-left: 8px;
        padding-right: 8px;
        color: #ffffff;
      }
    `}};Ct.COMPASS_DEG={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5,"С":0,"ССИ":22.5,"СИ":45,"ИСИ":67.5,"И":90,"ИЮИ":112.5,"ЮИ":135,"ЮЮИ":157.5,"Ю":180,"ЮЮЗ":202.5,"ЮЗ":225,"ЗЮЗ":247.5,"З":270,"ЗСЗ":292.5,"СЗ":315,"ССЗ":337.5,"В":90,"ССВ":22.5,"СВ":45,"ВСВ":67.5,"ВЮВ":112.5,"ЮВ":135,"ЮЮВ":157.5},t([_t()],Ct.prototype,"_subscribed",void 0),t([_t()],Ct.prototype,"_forecastEvent",void 0),t([ct({attribute:!1})],Ct.prototype,"hass",void 0),t([_t()],Ct.prototype,"_config",void 0),t([_t()],Ct.prototype,"_cardWidth",void 0),Ct=t([rt("platinum-weather-card-plus-charts")],Ct);var Dt="M11 20V22H3C1.9 22 1 21.1 1 20V4C1 2.9 1.9 2 3 2H21C22.1 2 23 2.9 23 4V12.1L22.8 11.9C22.3 11.4 21.7 11.1 21 11.1V6H3V20H11M21.4 13.3L22.7 14.6C22.9 14.8 22.9 15.2 22.7 15.4L21.7 16.4L19.6 14.3L20.6 13.3C20.7 13.2 20.8 13.1 21 13.1C21.2 13.1 21.3 13.2 21.4 13.3M21.1 16.9L15.1 23H13V20.9L19.1 14.8L21.1 16.9Z",jt="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",Vt="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",Tt="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";const Nt=["overview","extended","slots","daily_forecast","charts"];let Mt=class extends nt{constructor(){super(...arguments),this._subElementEditor=void 0,this._initialized=!1,this._config_version=8}setConfig(t){this._config=t;let e=!1;null===this._section_order?(this._config=Object.assign(Object.assign({},this._config),{section_order:Nt}),e=!0):(this._config.section_order.forEach(t=>{var i,s;if(!Nt.includes(t)){const o=null===(i=this._config)||void 0===i?void 0:i.section_order.indexOf(t);void 0!==o&&-1!==o&&(null===(s=this._config)||void 0===s||s.section_order.splice(o,1)),e=!0}}),Nt.forEach(t=>{this._config&&!this._config.section_order.includes(t)&&(this._config.section_order.push(t),e=!0)})),e&&mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}),this.loadCardHelpers()}sortObjectByKeys(t){return Object.keys(t).sort().reduce((e,i)=>(e[i]=t[i],e),{})}_configCleanup(){if(!this._config||!this.hass)return;let t=Object.assign({},this._config);t.static_icons&&(t.option_static_icons=t.static_icons,delete t.static_icons),t.time_format&&(t.option_time_format="12"===t.time_format?"12hour":"24hour",delete t.time_format),t.locale&&(t.option_locale=t.locale,delete t.locale),t.option_today_temperature_decimals&&(t.option_today_temperature_decimals=t.show_today_decimals,delete t.show_today_decimals),t.show_decimals_pressure&&(t.option_pressure_decimals=t.show_decimals_pressure,delete t.show_decimals_pressure),t.tooltips&&(t.option_tooltips=t.tooltips,delete t.tooltips),t.show_beaufort&&(t.option_show_beaufort=t.show_beaufort,delete t.show_beaufort),t.entity_daytime_high&&(t.Entity_forecast_max=t.entity_daytime_high,delete t.entity_daytime_high),t.entity_daytime_low&&(t.entity_forecast_min=t.entity_daytime_low,delete t.entity_daytime_low),t.entity_current_conditions&&(t.entity_forecast_icon=t.entity_current_conditions,delete t.entity_current_conditions),t.entity_current_text&&(t.entity_summary=t.entity_current_text,delete t.entity_current_text),t.entity_daily_summary&&(t.entity_extended=t.entity_daily_summary,delete t.entity_daily_summary),t.entity_forecast_high_temp_1&&(t.entity_forecast_max_1=t.entity_forecast_high_temp_1,delete t.entity_forecast_high_temp_1),t.entity_forecast_low_temp_1&&(t.entity_forecast_min_1=t.entity_forecast_low_temp_1,delete t.entity_forecast_low_temp_1),t.entity_possible_today&&(t.entity_pos=t.entity_possible_today,delete t.entity_possible_today),t.entity_fire_danger_summary&&(t.entity_fire_danger=t.entity_fire_danger_summary,delete t.entity_fire_danger_summary),t.show_decimals&&(t.option_show_overview_decimals=t.show_decimals,delete t.show_decimals),t.show_separator&&(t.option_show_overview_separator=t.show_separator,delete t.show_separator);for(const e of["slot_l1, slot_l2, slot_l3, slot_l4, slot_l5, slot_l6, slot_l7, slot_l8, slot_r1, slot_r2, slot_r3, slot_r4, slot_r5, slot_r6, slot_r7, slot_r8"])"daytime_high"===t[e]&&(t[e]="forecast_max"),"daytime_low"===t[e]&&(t[e]="forecast_min");const e=["type","card_config_version","section_order","show_section_overview","show_section_extended","show_section_slots","show_section_daily_forecast","overview_layout","text_card_title","text_card_title_2","entity_update_time","update_time_use_attr","update_time_name_attr","text_update_time_prefix","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","option_show_overview_decimals","option_show_overview_separator","entity_extended","extended_use_attr","extended_name_attr","slot_l1","slot_l2","slot_l3","slot_l4","slot_l5","slot_l6","slot_l7","slot_l8","slot_r1","slot_r2","slot_r3","slot_r4","slot_r5","slot_r6","slot_r7","slot_r8","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_next_label","entity_temp_following","entity_temp_following_label","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_todays_fire_danger","entity_todays_uv_forecast","custom1_label","custom1_value","custom1_icon","custom1_units","custom2_label","custom2_value","custom2_icon","custom2_units","custom3_label","custom3_value","custom3_icon","custom3_units","custom4_label","custom4_value","custom4_icon","custom4_units","entity_forecast_icon_1","entity_pop_1","entity_pos_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_extended_1","entity_fire_danger_1","daily_forecast_layout","daily_forecast_days","daily_extended_forecast_days","daily_extended_use_attr","daily_extended_name_attr","summary_1_use_attr","summary_1_name_attr","option_compact_slots","option_wind_bearing_icon","entity_pressure_trend","option_local_forecast","option_local_forecast_verbose","option_daily_forecast_date","option_slot_tap_more_info","option_moon_icon_only","option_forecast_altitude","option_today_temperature_decimals","option_today_rainfall_decimals","option_forecast_decimals","option_show_current_day","option_show_temperature_chart","option_show_precipitation_chart","icon_pack","icon_pack_path","option_show_gust_in_wind","option_show_forecast_wind","option_show_forecast_pop","option_pressure_decimals","option_color_fire_danger","option_locale","option_static_icons","option_time_format","option_tooltips","old_daily_format","option_show_beaufort","weather_entity","tempformat","entity","tap_action","hold_action","double_tap_action","entity_possible_tomorrow","style","index","view_index"];for(const i in this._config)e.includes(i)||delete t[i];t=Object.assign(Object.assign({},t),{card_config_version:this._config_version}),this._config=t,mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}shouldUpdate(){return this._initialized||this._initialize(),!0}get _section_order(){var t;return(null===(t=this._config)||void 0===t?void 0:t.section_order)||null}get _text_card_title(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title)||""}get _text_card_title_2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title_2)||""}get _entity_update_time(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_update_time)||""}get _update_time_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.update_time_use_attr)}get _update_time_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.update_time_name_attr)||""}get _text_update_time_prefix(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_update_time_prefix)||""}get _overview_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.overview_layout)||""}get _entity_temperature(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temperature)||""}get _entity_apparent_temp(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_apparent_temp)||""}get _entity_forecast_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon)||""}get _entity_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary)||""}get _option_show_overview_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_decimals)}get _option_show_overview_separator(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_separator)}get _entity_extended(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended)||""}get _extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.extended_use_attr)}get _extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.extended_name_attr)||""}get _entity_todays_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_fire_danger)||""}get _entity_todays_uv_forecast(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_uv_forecast)||""}get _slot_l1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||""}get _slot_l2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l2)||""}get _slot_l3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l3)||""}get _slot_l4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l4)||""}get _slot_l5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l5)||""}get _slot_l6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l6)||""}get _slot_l7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l7)||""}get _slot_l8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l8)||""}get _slot_r1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r1)||""}get _slot_r2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r2)||""}get _slot_r3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r3)||""}get _slot_r4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r4)||""}get _slot_r5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r5)||""}get _slot_r6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r6)||""}get _slot_r7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r7)||""}get _slot_r8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r8)||""}get _entity_observed_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_max)||""}get _entity_observed_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_min)||""}get _entity_forecast_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max)||""}get _entity_forecast_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min)||""}get _entity_temp_next(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next)||""}get _entity_temp_next_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next_label)||""}get _entity_temp_following(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following)||""}get _entity_temp_following_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following_label)||""}get _entity_wind_bearing(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_bearing)||""}get _entity_wind_speed(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed)||""}get _entity_wind_gust(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust)||""}get _entity_wind_speed_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed_kt)||""}get _entity_wind_gust_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust_kt)||""}get _entity_visibility(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_visibility)||""}get _entity_sun(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_sun)||""}get _entity_moon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_moon)||""}get _entity_pop(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop)||""}get _entity_pos(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos)||""}get _entity_possible_tomorrow(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_possible_tomorrow)||""}get _entity_humidity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_humidity)||""}get _entity_pressure_trend(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pressure_trend)||""}get _entity_pressure(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pressure)||""}get _entity_uv_alert_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_uv_alert_summary)||""}get _entity_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger)||""}get _entity_rainfall(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_rainfall)||""}get _custom1_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_value)||""}get _custom1_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_icon)||""}get _custom1_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_label)||""}get _custom1_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_units)||""}get _custom2_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_value)||""}get _custom2_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_icon)||""}get _custom2_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_label)||""}get _custom2_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_units)||""}get _custom3_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_value)||""}get _custom3_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_icon)||""}get _custom3_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_label)||""}get _custom3_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_units)||""}get _custom4_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_value)||""}get _custom4_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_icon)||""}get _custom4_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_label)||""}get _custom4_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_units)||""}get _daily_forecast_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_layout)||""}get _daily_forecast_days(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_days)||null}get _daily_extended_forecast_days(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.daily_extended_forecast_days)&&void 0!==e?e:null}get _entity_forecast_icon_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon_1)||""}get _weather_entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.weather_entity)||""}get _forecast_type(){var t;return(null===(t=this._config)||void 0===t?void 0:t.forecast_type)||""}get _entity_summary_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary_1)||""}get _entity_forecast_min_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min_1)||""}get _entity_forecast_max_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max_1)||""}get _entity_pop_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop_1)||""}get _entity_pos_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos_1)||""}get _entity_extended_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended_1)||""}get _entity_fire_danger_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger_1)||""}get _daily_extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.daily_extended_use_attr)}get _daily_extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_extended_name_attr)||""}get _tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.tap_action}get _hold_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.hold_action}get _double_tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.double_tap_action}get _summary_1_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.summary_1_use_attr)}get _summary_1_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.summary_1_name_attr)||""}get _option_today_temperature_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_temperature_decimals)}get _option_today_rainfall_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_rainfall_decimals)}get _option_forecast_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_forecast_decimals)}get _option_show_gust_in_wind(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_gust_in_wind)}get _icon_pack(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack)||"default"}get _icon_pack_path(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack_path)||""}get _option_show_forecast_wind(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_wind)}get _option_show_forecast_pop(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_pop)}get _option_show_current_day(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_current_day)}get _option_show_temperature_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_temperature_chart)}get _option_show_precipitation_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_precipitation_chart)}get _option_pressure_decimals(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_pressure_decimals)||null}get _option_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_color_fire_danger)}get _option_daily_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_daily_color_fire_danger)}get _option_tooltips(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_tooltips)}get _option_static_icons(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_static_icons)}get _option_time_format(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.option_time_format)&&void 0!==e?e:null}get _option_locale(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_locale)||""}get _optional_entities(){var t,e,i,s,o,n,a,r,l,c,_,d,h,u,p,m;const g=new Set;for(const v of[(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||"forecast_max",(null===(e=this._config)||void 0===e?void 0:e.slot_l2)||"forecast_min",(null===(i=this._config)||void 0===i?void 0:i.slot_l3)||"wind",(null===(s=this._config)||void 0===s?void 0:s.slot_l4)||"pressure",(null===(o=this._config)||void 0===o?void 0:o.slot_l5)||"sun_next",(null===(n=this._config)||void 0===n?void 0:n.slot_l6)||"remove",(null===(a=this._config)||void 0===a?void 0:a.slot_l7)||"remove",(null===(r=this._config)||void 0===r?void 0:r.slot_l8)||"remove",(null===(l=this._config)||void 0===l?void 0:l.slot_r1)||"popforecast",(null===(c=this._config)||void 0===c?void 0:c.slot_r2)||"humidity",(null===(_=this._config)||void 0===_?void 0:_.slot_r3)||"uv_summary",(null===(d=this._config)||void 0===d?void 0:d.slot_r4)||"fire_danger",(null===(h=this._config)||void 0===h?void 0:h.slot_r5)||"sun_following",(null===(u=this._config)||void 0===u?void 0:u.slot_r6)||"remove",(null===(p=this._config)||void 0===p?void 0:p.slot_r7)||"remove",(null===(m=this._config)||void 0===m?void 0:m.slot_r8)||"remove"])switch(v){case"observed_max":g.add("entity_observed_max");break;case"observed_min":g.add("entity_observed_min");break;case"forecast_max":g.add("entity_forecast_max");break;case"forecast_min":g.add("entity_forecast_min");break;case"temp_next":g.add("entity_temp_next").add("entity_temp_next_label");break;case"temp_following":g.add("entity_temp_following").add("entity_temp_following_label");break;case"temp_maximums":g.add("entity_forecast_max").add("entity_observed_max");break;case"temp_minimums":g.add("entity_forecast_min").add("entity_observed_min");break;case"wind":g.add("entity_wind_bearing").add("entity_wind_speed").add("entity_wind_gust");break;case"wind_kt":g.add("entity_wind_bearing").add("entity_wind_speed_kt").add("entity_wind_gust_kt");break;case"visibility":g.add("entity_visibility");break;case"sun_next":case"sun_following":g.add("entity_sun");break;case"moon":g.add("entity_moon");break;case"pop":g.add("entity_pop");break;case"popforecast":g.add("entity_pop").add("entity_pos");break;case"humidity":g.add("entity_humidity");break;case"pressure":g.add("entity_pressure");break;case"uv_summary":g.add("entity_uv_alert_summary");break;case"fire_danger":g.add("entity_fire_danger");break;case"possible_today":g.add("entity_pos");break;case"possible_tomorrow":g.add("entity_possible_tomorrow");break;case"rainfall":g.add("entity_rainfall");break;case"custom1":g.add("custom1");break;case"custom2":g.add("custom2");break;case"custom3":g.add("custom3");break;case"custom4":g.add("custom4")}const v=g.has("entity_observed_max")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_max"} .value=${this._entity_observed_max} .includeDomains=${["sensor"]}
          name="entity_observed_max" label=${this._t("entity_observed_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",y=g.has("entity_observed_min")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_min"} .value=${this._entity_observed_min} .includeDomains=${["sensor"]}
          name="entity_observed_min" label=${this._t("entity_observed_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",f=g.has("entity_forecast_max")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_max"} .value=${this._entity_forecast_max} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_max" label=${this._t("entity_forecast_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",b=g.has("entity_forecast_min")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_min"} .value=${this._entity_forecast_min} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_min" label=${this._t("entity_forecast_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",w=g.has("entity_temp_next")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next"} .value=${this._entity_temp_next} .includeDomains=${["sensor"]}
          name="entity_temp_next" label=${this._t("entity_temp_next")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",$=g.has("entity_temp_next_label")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next_label"} .value=${this._entity_temp_next_label} .includeDomains=${["sensor"]}
          name="entity_temp_next_label" label=${this._t("entity_temp_next_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",x=g.has("entity_temp_following")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following"} .value=${this._entity_temp_following} .includeDomains=${["sensor"]}
          name="entity_temp_following" label=${this._t("entity_temp_following")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",k=g.has("entity_temp_following_label")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following_label"} .value=${this._entity_temp_following_label} .includeDomains=${["sensor"]}
          name="entity_temp_following_label" label=${this._t("entity_temp_fol_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",z=g.has("entity_wind_bearing")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_bearing"} .value=${this._entity_wind_bearing} .includeDomains=${["sensor","weather"]}
          name="entity_wind_bearing" label=${this._t("entity_wind_bearing")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",S=g.has("entity_wind_speed")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed"} .value=${this._entity_wind_speed} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed" label=${this._t("entity_wind_speed")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",E=g.has("entity_wind_gust")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust"} .value=${this._entity_wind_gust} .includeDomains=${["sensor","weather"]}
          name="entity_wind_gust" label=${this._t("entity_wind_gust")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",P=g.has("entity_wind_speed_kt")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed_kt"} .value=${this._entity_wind_speed_kt} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed_kt" label=${this._t("entity_wind_speed_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",C=g.has("entity_wind_gust_kt")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust_kt"} .value=${this._entity_wind_gust_kt} .includeDomains=${["sensor"]}
          name="entity_wind_gust_kt" label=${this._t("entity_wind_gust_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",D=g.has("entity_visibility")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_visibility"} .value=${this._entity_visibility} .includeDomains=${["sensor","weather"]}
          name="entity_visibility" label=${this._t("entity_visibility")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",j=g.has("entity_sun")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_sun"} .value=${this._entity_sun} .includeDomains=${["sun","sensor"]}
          name="entity_sun" label=${this._t("entity_sun")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",V=g.has("entity_moon")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_moon"} .value=${this._entity_moon} .includeDomains=${["sensor"]}
          name="entity_moon" label=${this._t("entity_moon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",T=g.has("entity_pop")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pop"} .value=${this._entity_pop} .includeDomains=${["sensor","weather"]}
          name="entity_pop" label=${this._t("entity_pop")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",N=g.has("entity_pos")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pos"} .value=${this._entity_pos} .includeDomains=${["sensor","weather"]}
          name="entity_pos" label=${this._t("entity_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",M=g.has("entity_possible_tomorrow")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_possible_tomorrow"} .value=${this._entity_possible_tomorrow} .includeDomains=${["sensor","weather"]}
          name="entity_possible_tomorrow" label=${this._t("entity_2day_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",O=g.has("entity_humidity")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_humidity"} .value=${this._entity_humidity} .includeDomains=${["sensor","weather"]}
          name="entity_humidity" label=${this._t("entity_humidity")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",A=g.has("entity_pressure")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pressure"} .value=${this._entity_pressure} .includeDomains=${["sensor","weather"]}
          name="entity_pressure" label=${this._t("entity_pressure")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        ${""!==this._entity_pressure?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pressure_trend"} .value=${this._entity_pressure_trend} .includeDomains=${["sensor","binary_sensor"]}
          name="entity_pressure_trend" label=${this._t("entity_pressure_trend")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>`:F``}
      `:"",L=g.has("entity_uv_alert_summary")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_uv_alert_summary"} .value=${this._entity_uv_alert_summary} .includeDomains=${["sensor"]}
          name="entity_uv_alert_summary" label=${this._t("entity_uv_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",U=g.has("entity_fire_danger")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_fire_danger"} .value=${this._entity_fire_danger} .includeDomains=${["sensor"]}
          name="entity_fire_danger" label=${this._t("entity_fire_danger")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",W=g.has("entity_rainfall")?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_rainfall"} .value=${this._entity_rainfall} .includeDomains=${["sensor"]}
          name="entity_rainfall" label=${this._t("entity_rainfall")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",R=g.has("custom1")?F`
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
      `:"",B=g.has("custom2")?F`
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
      `:"",q=g.has("custom3")?F`
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
      `:"",I=g.has("custom4")?F`
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
      `:"";return F`
      ${v}
      ${y}
      ${f}
      ${b}
      ${w}
      ${$}
      ${x}
      ${k}
      ${z}
      ${S}
      ${E}
      ${P}
      ${C}
      ${D}
      ${j}
      ${V}
      ${T}
      ${N}
      ${M}
      ${O}
      ${A}
      ${L}
      ${U}
      ${W}
      ${R}
      ${B}
      ${q}
      ${I}`}get _show_warning(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_warning)||!1}get _show_error(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_error)||!1}async firstUpdated(){var t;this._config&&this.hass&&this._config.card_config_version!==this._config_version&&this._configCleanup(),customElements.get("ha-switch")&&(customElements.get("ha-input")||customElements.get("ha-textfield"))&&customElements.get("ha-entity-picker")||null===(t=customElements.get("hui-entities-card"))||void 0===t||t.getConfigElement()}_sectionOverviewEditor(){return F`
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_update_time"} .value=${this._entity_update_time} .includeDomains=${["sensor"]}
        name="entity_update_time" label=${this._t("entity_update_time")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""!==this._entity_update_time?F`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._update_time_use_attr?"pwc-switch active":"pwc-switch"} .value=${"update_time_use_attr"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
        </div>
        ${""!==this._entity_update_time&&!0===this._update_time_use_attr?F`<ha-selector .hass=${this.hass} .entityId=${this._entity_update_time}
          .selector = ${{attribute:{entity_id:this._entity_update_time}}} .required=${!1}
          .configValue=${"update_time_name_attr"} .value=${this._update_time_name_attr} name="update_time_name_attr" label=${this._t("attribute")}
          allow-custom-value
          @value-changed=${this._valueChangedPicker}>
        </ha-selector>`:F``}
      </div>`:F``}
      <ha-input label=${this._t("update_time_prefix")} .value=${this._text_update_time_prefix}
        .configValue=${"text_update_time_prefix"} @input=${this._valueChanged}>
      </ha-input>
      ${"forecast"!==this._overview_layout?F`<ha-entity-picker .hass=${this.hass} .configValue=${"entity_temperature"} .value=${this._entity_temperature} .includeDomains=${["sensor","weather"]}
          name="entity_temperature" label=${this._t("entity_temperature")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_apparent_temp"} .value=${this._entity_apparent_temp} .includeDomains=${["sensor","weather"]}
          name="entity_apparent_temp" label=${this._t("entity_apparent_temp")} allow-custom-entity
          @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>`:F``}
      ${"observations"!==this._overview_layout?F`<ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_icon"} .value=${this._entity_forecast_icon} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_icon" label=${this._t("entity_forecast_icon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>
          <ha-entity-picker .hass=${this.hass} .configValue=${"entity_summary"} .value=${this._entity_summary} .includeDomains=${["sensor","weather"]}
            name="entity_summary" label=${this._t("entity_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
          </ha-entity-picker>`:F``}
    `}_optionOverviewEditor(){var t,e,i,s,o,n;return F`
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("overview_layout")}</label>
          <select class='ha-select-compat' .configValue=${"overview_layout"} .value=${this._overview_layout} @change=${this._valueChanged}>
            <option value=""></option>
            <option value="complete">${this._t("opt_complete")}</option>
            <option value="observations">${this._t("opt_observations")}</option>
            <option value="forecast">${this._t("opt_forecast")}</option>
            <option value="title only">${this._t("opt_title_only")}</option>
          </select>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_show_overview_decimals?"pwc-switch active":"pwc-switch"} .value=${"option_show_overview_decimals"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_temp_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_show_overview_separator?"pwc-switch active":"pwc-switch"} .value=${"option_show_overview_separator"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_separator")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${(null===(t=this._config)||void 0===t?void 0:t.option_local_forecast)?"pwc-switch active":"pwc-switch"} .value=${"option_local_forecast"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("local_forecast")}</span>
            </div>
        </div>
        ${!0===(null===(e=this._config)||void 0===e?void 0:e.option_local_forecast)?F`
        <div>
          <ha-input type="number" label=${this._t("forecast_altitude")} .value=${null!==(s=null===(i=this._config)||void 0===i?void 0:i.option_forecast_altitude)&&void 0!==s?s:""} .configValue=${"option_forecast_altitude"} @input=${this._valueChangedNumber}>
          </ha-input>
          <div class="help-text">${this._t("forecast_altitude_hint")}</div>
        </div>`:F`<div></div>`}
      </div>
      ${!0===(null===(o=this._config)||void 0===o?void 0:o.option_local_forecast)?F`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${(null===(n=this._config)||void 0===n?void 0:n.option_local_forecast_verbose)?"pwc-switch active":"pwc-switch"} .value=${"option_local_forecast_verbose"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("local_forecast_verbose")}</span>
            </div>
        </div>
        <div></div>
      </div>`:F``}
    `}_sectionExtendedEditor(){return!0===this._extended_use_attr&&(void 0===this.hass||void 0===this.hass.states[this._entity_extended]||this.hass.states[this._entity_extended].attributes),F`
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_extended"} .value=${this._entity_extended} .includeDomains=${["sensor","weather"]}
        name="entity_extended" label=${this._t("entity_extended")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""!==this._entity_extended?F`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <span class=${!1!==this._extended_use_attr?"pwc-switch active":"pwc-switch"} .value=${"extended_use_attr"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${""!==this._entity_extended&&!0===this._extended_use_attr?F`<ha-selector .hass=${this.hass} .entityId=${this._entity_extended}
            .selector = ${{attribute:{entity_id:this._entity_extended}}} .required=${!1}
            .configValue=${"extended_name_attr"} .value=${this._extended_name_attr} name="extended_name_attr" label=${this._t("attribute")}
            allow-custom-value
            @value-changed=${this._valueChangedPicker}>
          </ha-selector>`:F``}
        </div>`:F``}
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_todays_uv_forecast"} .value=${this._entity_todays_uv_forecast} .includeDomains=${["sensor"]}
        name="entity_todays_uv_forecast" label=${this._t("entity_uv_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_todays_fire_danger"} .value=${this._entity_todays_fire_danger} .includeDomains=${["sensor"]}
        name="entity_todays_fire_danger" label=${this._t("entity_fire_today")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
    `}_slotOptions(t){return F`${[["humidity","Current humidity"],["rainfall","Today's recorded rainfall"],["pressure","Current air pressure"],["wind","Current wind conditions"],["wind_gust","Current wind gust"],["wind_kt","Current wind conditions kts"],["visibility","Current visibility"],["observed_max","Today's observed max"],["observed_min","Today's observed min"],["forecast_max","Today's forecast max"],["forecast_min","Today's forecast min"],["temp_next","Next temp min/max"],["temp_following","Following temp min/max"],["temp_maximums","Observed/forecast max"],["temp_minimums","Observed/forecast min"],["sun_next","Next sun rise/set time"],["sun_following","Following sun rise/set time"],["moon","Moon phase"],["pop","Chance of rain"],["popforecast","Rainfall forecast"],["possible_today","Today's forecast rainfall"],["possible_tomorrow","Tomorrow's forecast rainfall"],["uv_summary","Today's uv forecast"],["fire_danger","Today's fire danger"],["custom1","Custom entity 1"],["custom2","Custom entity 2"],["custom3","Custom entity 3"],["custom4","Custom entity 4"],["empty","Blank slot"],["remove","Remove slot"]].map(([e,i])=>F`<option value="${e}" ?selected=${t===e}>${i}</option>`)}`}_sectionSlotsEditor(){return F`
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
    `}_optionSlotsEditor(){var t,e,i;return F`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_today_temperature_decimals?"pwc-switch active":"pwc-switch"} .value=${"option_today_temperature_decimals"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("today_temp_decimals")}</span>
            </div>
        </div>
        <div>
          <label class='mdc-label'>${this._t("pressure_decimals")}</label>
          <select class='ha-select-compat' .configValue=${"option_pressure_decimals"} .value=${null!==this._option_pressure_decimals?String(this._option_pressure_decimals):""} @change=${this._valueChanged}>
            <option value=""></option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_today_rainfall_decimals?"pwc-switch active":"pwc-switch"} .value=${"option_today_rainfall_decimals"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("today_rain_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_forecast_decimals?"pwc-switch active":"pwc-switch"} .value=${"option_forecast_decimals"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("forecast_temp_decimals")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_show_forecast_pop?"pwc-switch active":"pwc-switch"} .value=${"option_show_forecast_pop"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_forecast_pop")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${!0===this._option_show_forecast_wind?"pwc-switch active":"pwc-switch"} .value=${"option_show_forecast_wind"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_forecast_wind")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_show_gust_in_wind?"pwc-switch active":"pwc-switch"} .value=${"option_show_gust_in_wind"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_gust_in_wind")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_color_fire_danger?"pwc-switch active":"pwc-switch"} .value=${"option_color_fire_danger"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${(null===(t=this._config)||void 0===t?void 0:t.option_wind_bearing_icon)?"pwc-switch active":"pwc-switch"} .value=${"option_wind_bearing_icon"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("wind_bearing_icon")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${(null===(e=this._config)||void 0===e?void 0:e.option_moon_icon_only)?"pwc-switch active":"pwc-switch"} .value=${"option_moon_icon_only"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("moon_icon_only")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==(null===(i=this._config)||void 0===i?void 0:i.option_slot_tap_more_info)?"pwc-switch active":"pwc-switch"} .value=${"option_slot_tap_more_info"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("slot_tap_more_info")}</span>
            </div>
        </div>
        <div></div>
            </div>
        </div>
      </div>
    `}_sectionDailyForecastEditor(){return!0===this._daily_extended_use_attr&&(void 0===this.hass||void 0===this.hass.states[this._entity_extended_1]||this.hass.states[this._entity_extended_1].attributes),F`
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
      ${""===this._entity_summary_1||this._entity_summary_1.match("^weather.")?F``:F`
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <span class=${this._summary_1_use_attr?"pwc-switch active":"pwc-switch"} .value=${"summary_1_use_attr"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
          </div>
          ${this._summary_1_use_attr?F`
            <ha-selector .hass=${this.hass} .entityId=${this._entity_summary_1} .configValue=${"summary_1_name_attr"} .value=${this._summary_1_name_attr}
              .selector=${{attribute:{entity_id:this._entity_summary_1}}} .required=${!1}
              name="summary_1_name_attr" label=${this._t("attribute")} allow-custom-value
              @value-changed=${this._valueChangedPicker}>
            </ha-selector>`:F``}
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
      ${"vertical"===this._daily_forecast_layout?F`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_extended_1"} .value=${this._entity_extended_1} .includeDomains=${["sensor","weather"]}
          name="entity_extended_1" label=${this._t("entity_extended_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
        ${""!==this._entity_extended_1?F`
          <div class="side-by-side">
            <div>
              <div class="toggle-row">
              <span class=${!1!==this._daily_extended_use_attr?"pwc-switch active":"pwc-switch"} .value=${"daily_extended_use_attr"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("use_attribute")}</span>
            </div>
            </div>
            ${""!==this._entity_extended_1&&!0===this._daily_extended_use_attr?F`
              <ha-selector .hass=${this.hass} .entityId=${this._entity_extended_1} .configValue=${"daily_extended_name_attr"} .value=${this._daily_extended_name_attr} .includeDomains=${["sensor"]}
                .selector = ${{attribute:{entity_id:this._entity_extended_1}}} .required=${!1}
                name="daily_extended_name_attr" label=${this._t("attribute")} allow-custom-value @value-changed=${this._valueChangedPicker}>
              </ha-selector>`:F``}
          </div>`:F``}
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_fire_danger_1"} .value=${this._entity_fire_danger_1} .includeDomains=${["sensor"]}
          name="entity_fire_danger_1" label=${this._t("entity_fire_danger_1")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:""}
    `}_optionChartsEditor(){return F`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
            <span class=${!0===this._option_show_temperature_chart?"pwc-switch active":"pwc-switch"} .value=${"option_show_temperature_chart"} @click=${this._toggleVisibility}></span>
            <span class="toggle-label">${this._t("show_temp_chart")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
            <span class=${!0===this._option_show_precipitation_chart?"pwc-switch active":"pwc-switch"} .value=${"option_show_precipitation_chart"} @click=${this._toggleVisibility}></span>
            <span class="toggle-label">${this._t("show_precip_chart")}</span>
          </div>
        </div>
      </div>
    `}_optionDailyForecastEditor(){var t;return F`
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("daily_forecast_layout")}</label>
          <select class='ha-select-compat' .configValue=${"daily_forecast_layout"} .value=${this._daily_forecast_layout} @change=${this._valueChanged}>
            <option value=""></option>
            <option value="horizontal">${this._t("opt_horizontal")}</option>
            <option value="vertical">${this._t("opt_vertical")}</option>
          </select>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <div>
        <label class='mdc-label'>${this._t("daily_forecast_days")}</label>
        <select class='ha-select-compat' .configValue=${"daily_forecast_days"} .value=${null!==this._daily_forecast_days?String(this._daily_forecast_days):""} @change=${this._valueChanged}>
          <option value=""></option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          ${"vertical"===this._daily_forecast_layout?F`
            <option value="6">6</option>
            <option value="7">7</option>`:F``}
        </select>
        </div>
        ${"vertical"===this._daily_forecast_layout?F`<div>
          <label class='mdc-label'>${this._t("daily_extended_days")}</label>
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
        </select>
        </div>`:F`<div></div>`}
      </div>

        <div class="side-by-side">
          <div>
            ${"vertical"!==this._daily_forecast_layout?F`
              <div class="toggle-row">
              <span class=${!1!==this._option_tooltips?"pwc-switch active":"pwc-switch"} .value=${"option_tooltips"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("forecast_tooltips")}</span>
            </div>`:F``}
          </div>
          <div>
            <div class="toggle-row">
              <span class=${!0===this._option_show_current_day?"pwc-switch active":"pwc-switch"} .value=${"option_show_current_day"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("include_today")}</span>
            </div>
          </div>
        </div>
        <div class="side-by-side">
          <div>
            <div class="toggle-row">
              <span class=${!0===(null===(t=this._config)||void 0===t?void 0:t.option_daily_forecast_date)?"pwc-switch active":"pwc-switch"} .value=${"option_daily_forecast_date"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("daily_forecast_date")}</span>
            </div>
          </div>
          <div></div>
        </div>

        <div class="side-by-side">
        ${"vertical"===this._daily_forecast_layout?F`<div>
          <div class="toggle-row">
              <span class=${!1!==this._option_daily_color_fire_danger?"pwc-switch active":"pwc-switch"} .value=${"option_daily_color_fire_danger"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>`:F``}
        <div>
        </div>
      </div>
    `}_optionGlobalOptionsEditor(){var t,e;return F`
      <ha-input label=${this._t("card_title_1")} .value=${this._text_card_title} .configValue=${"text_card_title"}
        @input=${this._valueChanged}>
      </ha-input>
      <ha-input label=${this._t("card_title_2")} .value=${this._text_card_title_2} .configValue=${"text_card_title_2"}
        @input=${this._valueChanged}>
      </ha-input>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <span class=${!1!==this._option_static_icons?"pwc-switch active":"pwc-switch"} .value=${"option_static_icons"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("show_static_icons")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
              <span class=${(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)?"pwc-switch active":"pwc-switch"} .value=${"option_compact_slots"} @click=${this._toggleVisibility}></span>
              <span class="toggle-label">${this._t("compact_slots")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <label class='mdc-label'>${this._t("time_format")}</label>
          <select class='ha-select-compat' .configValue=${"option_time_format"} .value=${null!==(e=this._option_time_format)&&void 0!==e?e:""} @change=${this._valueChanged}>
            <option value=""></option>
            <option value="system">${this._t("opt_system")}</option>
            <option value="12hour">${this._t("opt_12hour")}</option>
            <option value="24hour">${this._t("opt_24hour")}</option>
          </select>
        </div>
        <div>
        <label class='mdc-label'>${this._t("locale")}</label>
        <select class='ha-select-compat' .configValue=${"option_locale"} .value=${this._option_locale} @change=${this._valueChanged}>
          <option value="">${this._t("opt_locale_auto")}</option>
          <option value="bg">🇧🇬 Български</option>
          <option value="cs">🇨🇿 Čeština</option>
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
        ${"custom"===this._icon_pack?F`
        <div>
          <ha-input .label=${this._t("icon_path")} .value=${this._icon_pack_path}
            .configValue=${"icon_pack_path"} @change=${this._valueChanged}>
          </ha-input>
          <div class="help-text">Use {condition} as placeholder — e.g. /local/icons/{condition}.svg</div>
        </div>`:F``}
      </div>
      <div style="padding: 8px 0 4px; font-weight: 500;">${this._t("actions")}</div>
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
    `}_renderSubElementEditor(){const t=[F`
        <div class="header">
          <div class="back-title">
            <mwc-icon-button @click=${this._goBack}>
              <ha-icon icon="mdi:arrow-left"></ha-icon>
            </mwc-icon-button>
          </div>
        </div>
      `];switch(this._subElementEditor){case"section_overview":t.push(this._sectionOverviewEditor());break;case"option_overview":t.push(this._optionOverviewEditor());break;case"section_extended":t.push(this._sectionExtendedEditor());break;case"section_slots":t.push(this._sectionSlotsEditor());break;case"option_slots":t.push(this._optionSlotsEditor());break;case"section_daily_forecast":t.push(this._sectionDailyForecastEditor());break;case"option_daily_forecast":t.push(this._optionDailyForecastEditor());break;case"option_charts":t.push(this._optionChartsEditor());break;case"option_global_options":t.push(this._optionGlobalOptionsEditor())}return F`${t}`}_goBack(){this._subElementEditor=void 0}get _show_section_overview(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_overview)}get _show_section_extended(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_extended)}get _show_section_slots(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_slots)}get _show_section_daily_forecast(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)}get _show_section_charts(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.show_section_charts)}getConfigBlock(t,e,i){switch(t){case"overview":return F`
          <div class="section-flex edit-overview-section">
            <div class="section-label">
              <span class=${!1!==this._show_section_overview?"pwc-switch active":"pwc-switch"} .value=${"show_section_overview"} @click=${this._toggleVisibility}></span>
              <ha-icon class="section-icon" icon="mdi:eye-outline"></ha-icon>
              <span class="section-title">${this._t("overview_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"overview"} .path=${jt} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"overview"} .path=${Vt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_overview"} .path=${Tt} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="option-icon" .value=${"option_overview"} .path=${Dt} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"extended":return F`
          <div class="section-flex edit-extended-section">
            <div class="section-label">
              <span class=${!1!==this._show_section_extended?"pwc-switch active":"pwc-switch"} .value=${"show_section_extended"} @click=${this._toggleVisibility}></span>
              <ha-icon class="section-icon" icon="mdi:text-box-outline"></ha-icon>
              <span class="section-title">${this._t("extended_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"extended"} .path=${jt} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"extended"} .path=${Vt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_extended"} .path=${Tt} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;case"slots":return F`
          <div class="section-flex edit-slots-section">
            <div class="section-label">
              <span class=${!1!==this._show_section_slots?"pwc-switch active":"pwc-switch"} .value=${"show_section_slots"} @click=${this._toggleVisibility}></span>
              <ha-icon class="section-icon" icon="mdi:view-grid-outline"></ha-icon>
              <span class="section-title">${this._t("slots_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"slots"} .path=${jt} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"slots"} .path=${Vt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_slots"} .path=${Tt} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_slots"} .path=${Dt} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"daily_forecast":return F`
          <div class="section-flex edit-daily-forecast-section">
            <div class="section-label">
              <span class=${!1!==this._show_section_daily_forecast?"pwc-switch active":"pwc-switch"} .value=${"show_section_daily_forecast"} @click=${this._toggleVisibility}></span>
              <ha-icon class="section-icon" icon="mdi:calendar-week"></ha-icon>
              <span class="section-title">${this._t("daily_forecast_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"daily_forecast"} .path=${jt} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"daily_forecast"} .path=${Vt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_daily_forecast"} .path=${Tt} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_daily_forecast"} .path=${Dt} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"charts":return F`
          <div class="section-flex edit-charts-section">
            <div class="section-label">
              <span class=${!1!==this._show_section_charts?"pwc-switch active":"pwc-switch"} .value=${"show_section_charts"} @click=${this._toggleVisibility}></span>
              <ha-icon class="section-icon" icon="mdi:chart-line"></ha-icon>
              <span class="section-title">${this._t("charts_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"charts"} .path=${jt} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"charts"} .path=${Vt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <div class="no-icon"></div>
              <ha-icon-button class="option-icon" .value=${"option_charts"} .path=${Dt} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"global_options":return F`
          <div class="section-flex">
            <div class="section-label">
              <div class="visibility-spacer"></div>
              <ha-icon class="section-icon" icon="mdi:cog"></ha-icon>
              <span class="section-title">${this._t("global_options")}</span>
            </div>
            <div>
              <div class="no-icon"></div>
              <ha-icon-button class="edit-icon" .value=${"option_global_options"} .path=${Dt} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `}return F``}render(){if(!this.hass||!this._helpers)return F``;if(this._subElementEditor)return this._renderSubElementEditor();const t=[],e=this._section_order||[];return t.push(this.getConfigBlock("global_options",!1,!1)),e.forEach((i,s)=>{t.push(this.getConfigBlock(i,0===s,s+1===e.length))}),F`${t}`}_t(t){var e;return function(t,e){var i,s,o;const n=(t||"en").split("-")[0].toLowerCase();return null!==(o=null!==(s=null===(i=zt[n])||void 0===i?void 0:i.editor[e])&&void 0!==s?s:zt.en.editor[e])&&void 0!==o?o:e}((null===(e=this.hass)||void 0===e?void 0:e.language)||"en",t)}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_valueChangedPicker(t){if(!this._config||!this.hass)return;const e=t.target,i=t.detail.value;this[`_${e.configValue}`]!==i&&(e.configValue&&(i?this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:i}):(this._config=Object.assign({},this._config),delete this._config[e.configValue])),mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_valueChangedAction(t,e){const i=e.detail.value;null!=i&&(this._config=Object.assign(Object.assign({},this._config),{[t]:i}),mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_editSubmenu(t){if(t.currentTarget){const e=t.currentTarget;this._subElementEditor=e.value}}_moveUp(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t-1]]=[this._config.section_order[t-1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_moveDown(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t+1]]=[this._config.section_order[t+1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_toggleVisibility(t){const e=t.currentTarget,i=e.value,s=e.classList.contains("active");this._config=Object.assign(Object.assign({},this._config),{[i]:!s}),mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}_valueChanged(t){var e;if(!this._config||!this.hass)return;const i=t.target,s=void 0!==(null===(e=t.detail)||void 0===e?void 0:e.value)?t.detail.value:void 0!==i.checked?i.checked:i.value;if(this[`_${i.configValue}`]!==s){if(i.configValue)if(""===s){const t=Object.assign({},this._config);delete t[i.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[i.configValue]:s});mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_valueChangedNumber(t){if(!this._config||!this.hass)return;const e=t.target;this[`_${e.configValue}`]!==e.value&&(e.configValue&&(""===e.value||null===e.value?delete this._config[e.configValue]:this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:Number(e.value)})),mt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}};Mt.styles=r`
    .help-text {
      font-size: 12px;
      line-height: 1.3;
      color: var(--secondary-text-color);
      margin: 2px 0 6px;
    }
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
      font-size: 13px;
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
      gap: 6px;
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
      gap: 8px;
      min-height: 28px;
    }
    .pwc-switch {
      position: relative;
      display: inline-block;
      width: 30px;
      height: 16px;
      border-radius: 8px;
      background: var(--disabled-color, #9e9e9e);
      cursor: pointer;
      transition: background 0.2s ease;
      flex-shrink: 0;
    }
    .pwc-switch::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.2s ease;
      box-shadow: 0 1px 2px rgba(0,0,0,0.3);
    }
    .pwc-switch.active {
      background: var(--success-color, #4caf50);
    }
    .pwc-switch.active::after {
      transform: translateX(14px);
    }
    .toggle-label {
      font-size: 13px;
      color: var(--primary-text-color);
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
  `,t([ct({attribute:!1})],Mt.prototype,"hass",void 0),t([_t()],Mt.prototype,"_config",void 0),t([_t()],Mt.prototype,"_helpers",void 0),t([_t()],Mt.prototype,"_subElementEditor",void 0),Mt=t([rt("platinum-weather-card-plus-charts-editor")],Mt);var Ot=Object.freeze({__proto__:null,get WeatherCardEditor(){return Mt}});export{Ct as PlatinumWeatherCard};
