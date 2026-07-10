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
 */var c;const _=window,h=_.trustedTypes,d=h?h.emptyScript:"",u=_.reactiveElementPolyfillSupport,g={toAttribute(t,e){switch(e){case Boolean:t=t?d:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),p={attribute:!0,type:String,converter:g,reflect:!1,hasChanged:v},m="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const s=this._$Ep(i,e);void 0!==s&&(this._$Ev.set(s,i),t.push(s))}),t}static createProperty(t,e=p){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,s=this.getPropertyDescriptor(t,i,e);void 0!==s&&Object.defineProperty(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(s){const o=this[t];this[e]=s,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||p}static finalize(){if(this.hasOwnProperty(m))return!1;this[m]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{i?t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):s.forEach(i=>{const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)})})(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=p){var s;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==(null===(s=i.converter)||void 0===s?void 0:s.toAttribute)?i.converter:g).toAttribute(e,i.type);this._$El=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this._$El=null}}_$AK(t,e){var i;const s=this.constructor,o=s._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=s.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:g;this._$El=o,this[o]=n.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let s=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):s=!1),!this.isUpdatePending&&s&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var y;f[m]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:f}),(null!==(c=_.reactiveElementVersions)&&void 0!==c?c:_.reactiveElementVersions=[]).push("1.6.3");const b=window,$=b.trustedTypes,w=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,x="$lit$",k=`lit$${(Math.random()+"").slice(9)}$`,S="?"+k,C=`<${S}>`,E=document,N=()=>E.createComment(""),D=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,F="[ \t\n\f\r]",V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,M=/>/g,A=RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),P=/'/g,L=/"/g,W=/^(?:script|style|textarea|title)$/i,U=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),z=Symbol.for("lit-noChange"),R=Symbol.for("lit-nothing"),H=new WeakMap,j=E.createTreeWalker(E,129,null,!1);function I(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const B=(t,e)=>{const i=t.length-1,s=[];let o,n=2===e?"<svg>":"",a=V;for(let e=0;e<i;e++){const i=t[e];let r,l,c=-1,_=0;for(;_<i.length&&(a.lastIndex=_,l=a.exec(i),null!==l);)_=a.lastIndex,a===V?"!--"===l[1]?a=T:void 0!==l[1]?a=M:void 0!==l[2]?(W.test(l[2])&&(o=RegExp("</"+l[2],"g")),a=A):void 0!==l[3]&&(a=A):a===A?">"===l[0]?(a=null!=o?o:V,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,r=l[1],a=void 0===l[3]?A:'"'===l[3]?L:P):a===L||a===P?a=A:a===T||a===M?a=V:(a=A,o=void 0);const h=a===A&&t[e+1].startsWith("/>")?" ":"";n+=a===V?i+C:c>=0?(s.push(r),i.slice(0,c)+x+i.slice(c)+k+h):i+k+(-2===c?(s.push(void 0),e):h)}return[I(t,n+(t[i]||"<?>")+(2===e?"</svg>":"")),s]};class q{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0;const a=t.length-1,r=this.parts,[l,c]=B(t,e);if(this.el=q.createElement(l,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(s=j.nextNode())&&r.length<a;){if(1===s.nodeType){if(s.hasAttributes()){const t=[];for(const e of s.getAttributeNames())if(e.endsWith(x)||e.startsWith(k)){const i=c[n++];if(t.push(e),void 0!==i){const t=s.getAttribute(i.toLowerCase()+x).split(k),e=/([.?@])?(.*)/.exec(i);r.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?X:"?"===e[1]?Q:"@"===e[1]?tt:Y})}else r.push({type:6,index:o})}for(const e of t)s.removeAttribute(e)}if(W.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],N()),j.nextNode(),r.push({type:2,index:++o});s.append(t[e],N())}}}else if(8===s.nodeType)if(s.data===S)r.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)r.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){var o,n,a,r;if(e===z)return e;let l=void 0!==s?null===(o=i._$Co)||void 0===o?void 0:o[s]:i._$Cl;const c=D(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(n=null==l?void 0:l._$AO)||void 0===n||n.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,s)),void 0!==s?(null!==(a=(r=i)._$Co)&&void 0!==a?a:r._$Co=[])[s]=l:i._$Cl=l),void 0!==l&&(e=K(t,l._$AS(t,e.values),l,s)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:s}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);j.currentNode=o;let n=j.nextNode(),a=0,r=0,l=s[0];for(;void 0!==l;){if(a===l.index){let e;2===l.type?e=new Z(n,n.nextSibling,this,t):1===l.type?e=new l.ctor(n,l.name,l.strings,this,t):6===l.type&&(e=new et(n,this,t)),this._$AV.push(e),l=s[++r]}a!==(null==l?void 0:l.index)&&(n=j.nextNode(),a++)}return j.currentNode=E,o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{constructor(t,e,i,s){var o;this.type=2,this._$AH=R,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cp=null===(o=null==s?void 0:s.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),D(t)?t===R||null==t||""===t?(this._$AH!==R&&this._$AR(),this._$AH=R):t!==this._$AH&&t!==z&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>O(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==R&&D(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:s}=t,o="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=q.createElement(I(s.h,s.h[0]),this.options)),s);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new G(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=H.get(t.strings);return void 0===e&&H.set(t.strings,e=new q(t)),e}T(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Z(this.k(N()),this.k(N()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,s,o){this.type=1,this._$AH=R,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=R}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,s){const o=this.strings;let n=!1;if(void 0===o)t=K(this,t,e,0),n=!D(t)||t!==this._$AH&&t!==z,n&&(this._$AH=t);else{const s=t;let a,r;for(t=o[0],a=0;a<o.length-1;a++)r=K(this,s[i+a],e,a),r===z&&(r=this._$AH[a]),n||(n=!D(r)||r!==this._$AH[a]),r===R?t=R:t!==R&&(t+=(null!=r?r:"")+o[a+1]),this._$AH[a]=r}n&&!s&&this.j(t)}j(t){t===R?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class X extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===R?void 0:t}}const J=$?$.emptyScript:"";class Q extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==R?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class tt extends Y{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=K(this,t,e,0))&&void 0!==i?i:R)===z)return;const s=this._$AH,o=t===R&&s!==R||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==R&&(s===R||o);o&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class et{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const it=b.litHtmlPolyfillSupport;null==it||it(q,Z),(null!==(y=b.litHtmlVersions)&&void 0!==y?y:b.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var st,ot;class nt extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var s,o;const n=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:e;let a=n._$litPart$;if(void 0===a){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;n._$litPart$=a=new Z(e.insertBefore(N(),t),t,void 0,null!=i?i:{})}return a._$AI(t),a})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return z}}nt.finalized=!0,nt._$litElement$=!0,null===(st=globalThis.litElementHydrateSupport)||void 0===st||st.call(globalThis,{LitElement:nt});const at=globalThis.litElementPolyfillSupport;null==at||at({LitElement:nt}),(null!==(ot=globalThis.litElementVersions)&&void 0!==ot?ot:globalThis.litElementVersions=[]).push("3.3.3");
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
 */var ht,dt,ut;null===(ht=window.HTMLSlotElement)||void 0===ht||ht.prototype.assignedElements,function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(dt||(dt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(ut||(ut={}));var gt=["closed","locked","off"],vt=function(t,e,i,s){s=s||{},i=null==i?{}:i;var o=new Event(e,{bubbles:void 0===s.bubbles||s.bubbles,cancelable:Boolean(s.cancelable),composed:void 0===s.composed||s.composed});return o.detail=i,t.dispatchEvent(o),o},pt=function(t){vt(window,"haptic",t)},mt=function(t,e,i,s){if(s||(s={action:"more-info"}),!s.confirmation||s.confirmation.exemptions&&s.confirmation.exemptions.some(function(t){return t.user===e.user.id})||(pt("warning"),confirm(s.confirmation.text||"Are you sure you want to "+s.action+"?")))switch(s.action){case"more-info":(i.entity||i.camera_image)&&vt(t,"hass-more-info",{entityId:i.entity?i.entity:i.camera_image});break;case"navigate":s.navigation_path&&function(t,e,i){void 0===i&&(i=!1),i?history.replaceState(null,"",e):history.pushState(null,"",e),vt(window,"location-changed",{replace:i})}(0,s.navigation_path);break;case"url":s.url_path&&window.open(s.url_path);break;case"toggle":i.entity&&(function(t,e){(function(t,e,i){void 0===i&&(i=!0);var s,o=function(t){return t.substr(0,t.indexOf("."))}(e),n="group"===o?"homeassistant":o;switch(o){case"lock":s=i?"unlock":"lock";break;case"cover":s=i?"open_cover":"close_cover";break;default:s=i?"turn_on":"turn_off"}t.callService(n,s,{entity_id:e})})(t,e,gt.includes(t.states[e].state))}(e,i.entity),pt("success"));break;case"call-service":if(!s.service)return void pt("failure");var o=s.service.split(".",2);e.callService(o[0],o[1],s.service_data,s.target),pt("success");break;case"fire-dom-event":vt(t,"ll-custom",s)}},ft=function(t,e,i,s){var o;"double_tap"===s&&i.double_tap_action?o=i.double_tap_action:"hold"===s&&i.hold_action?o=i.hold_action:"tap"===s&&i.tap_action&&(o=i.tap_action),mt(t,e,i,o)};function yt(t){return void 0!==t&&"none"!==t.action}const bt=(t,e)=>t(`component.weather.entity_component._.state.${e}`)||e,$t=2;
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class wt{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class xt extends wt{constructor(t){if(super(t),this.et=R,t.type!==$t)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===R||null==t)return this.ft=void 0,this.et=t;if(t===z)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}xt.directiveName="unsafeHTML",xt.resultType=1;const kt=(t=>(...e)=>({_$litDirective$:t,values:e}))(xt);console.info("%c  PLATINUM-WEATHER-CARD-TL  \n%c  Version 2.0.9-beta.2          ","color: orange; font-weight: bold; background: black","color: white; font-weight: bold; background: dimgray"),window.customCards=window.customCards||[],window.customCards.push({type:"platinum-weather-card-plus-charts",name:"Platinum Weather Card Plus Charts",description:"An fully customisable weather card with a GUI configuration"});let St=class extends nt{constructor(){super(...arguments),this._cardWidth=492,this._error=[],this._boundPointerDown=this._onPointerDown.bind(this),this._boundPointerCancel=this._onPointerCancel.bind(this),this._boundCardClick=this._onCardClick.bind(this),this._pHoldFired=!1,this._clickCount=0}static get properties(){return{_config:{},_forecastEvent:{},hass:{}}}static async getConfigElement(){return await Promise.resolve().then(function(){return Mt}),document.createElement("platinum-weather-card-plus-charts-editor")}static getStubConfig(){return{}}getCardSize(){const t=16+this._getCardSizeOverviewSection()+this._getCardSizeExtendedSection()+this._getCardSizeSlotsSection()+this._getCardSizeDailyForecastSection();return Math.ceil(t/50)}setConfig(t){if(!t)throw new Error("Invalid configuration");const e=/^[a-z0-9_]+\.[a-z0-9_]+$/,i=["weather_entity","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","entity_extended","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_following","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_update_time"];for(const s of i){const i=t[s];if(i&&"string"==typeof i&&!e.test(i))throw new Error(`platinum-weather-card-plus-charts: "${s}" has invalid entity ID format: "${i}". Expected format: domain.object_id (e.g. sensor.temperature).`)}const s=["overview","extended","slots","daily_forecast","charts"];if(t.section_order){if(!Array.isArray(t.section_order))throw new Error("platinum-weather-card: section_order must be an array.");for(const e of t.section_order)if(!s.includes(e))throw new Error(`platinum-weather-card-plus-charts: invalid section "${e}" in section_order. Valid values: ${s.join(", ")}.`)}if(void 0!==t.daily_forecast_days){const e=Number(t.daily_forecast_days);if(!Number.isInteger(e)||e<1||e>7)throw new Error(`platinum-weather-card-plus-charts: daily_forecast_days must be an integer between 1 and 7, got "${t.daily_forecast_days}".`)}t.test_gui&&function(){var t=document.querySelector("home-assistant");if(t=(t=(t=(t=(t=(t=(t=(t=t&&t.shadowRoot)&&t.querySelector("home-assistant-main"))&&t.shadowRoot)&&t.querySelector("app-drawer-layout partial-panel-resolver"))&&t.shadowRoot||t)&&t.querySelector("ha-panel-lovelace"))&&t.shadowRoot)&&t.querySelector("hui-root")){var e=t.lovelace;return e.current_view=t.___curView,e}return null}().setEditMode(!0),this._config=Object.assign({name:"Weather",forecast_type:"daily"},t)}_needForecastSubscription(){return this._config&&this._config.weather_entity&&this._config.forecast_type&&"legacy"!==this._config.forecast_type}_unsubscribeForecastEvents(){this._subscribed&&(this._subscribed.then(t=>t()),this._subscribed=void 0)}async _subscribeForecastEvents(){var t,e,i,s;(this._unsubscribeForecastEvents(),this.isConnected&&this.hass&&this._config&&this._needForecastSubscription())&&(this.hass&&this._config&&(this._subscribed=(t=this.hass,e=this._config.weather_entity,i=this._config.forecast_type,s=t=>{this._forecastEvent=t},t.connection.subscribeMessage(s,{type:"weather/subscribe_forecast",forecast_type:i,entity_id:e}))))}connectedCallback(){super.connectedCallback(),this.hasUpdated&&this._config&&this.hass&&this._subscribeForecastEvents(),this.addEventListener("pointerdown",this._boundPointerDown),this.addEventListener("pointercancel",this._boundPointerCancel),this.addEventListener("click",this._boundCardClick)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeForecastEvents(),this.removeEventListener("pointerdown",this._boundPointerDown),this.removeEventListener("pointercancel",this._boundPointerCancel),this.removeEventListener("click",this._boundCardClick),clearTimeout(this._pHoldTimer),clearTimeout(this._clickTimer)}shouldUpdate(t){if(!this._config)return!1;if(t.has("_config")||t.has("_forecastEvent"))return!0;if(t.has("hass"))return!0;const e=t.get("hass")||void 0;if(!e||e.themes!==this.hass.themes||e.locale!==this.hass.locale)return!0;if(!1===Object.keys(this._config).every(t=>null===t.match(/^entity_/)||e.states[this._config[t]]===this.hass.states[this._config[t]]))return!0;if(this._config.show_section_daily_forecast){const t=this._config.daily_forecast_days||5;for(const s of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1"])if(void 0!==this._config[s]&&null===this._config[s].match("^weather.")){const o=this._config[s].match(/(\d+)(?!.*\d)/g);if(o)for(var i=1;i<t;i++){const t=this._config[s].replace(/(\d+)(?!.*\d)/g,Number(o)+i);if(e.states[t]!==this.hass.states[t])return!0}}}return t.has("config")}updated(t){this.hass&&this._config&&(!t.has("_config")&&this._subscribed||this._subscribeForecastEvents())}firstUpdated(){this._resize(),this._attachObserver()}_attachObserver(){var t;this._resizeObserver||(this._resizeObserver=new ResizeObserver(function(t,e,i){var s;return void 0===i&&(i=!1),function(){var o=[].slice.call(arguments),n=this,a=i&&!s;clearTimeout(s),s=setTimeout(function(){s=null,i||t.apply(n,o)},e),a&&t.apply(n,o)}}(()=>this._resize(),250,!1)));(null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card"))&&this._resizeObserver.observe(this)}_resize(){var t;if(!this.isConnected)return;const e=null===(t=this.shadowRoot)||void 0===t?void 0:t.querySelector("ha-card");e&&(this._cardWidth=e.getBoundingClientRect().width)}_checkForErrors(){this._error=[],Object.keys(this._config).forEach(t=>{null!==t.match(/^entity_/)&&void 0===this.hass.states[this._config[t]]&&this._error.push(`'${t}=${this._config[t]}' not found`)});for(const t of["entity_forecast_icon_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_pop_1","entity_pos_1","entity_extended_1"])if(void 0!==this._config[t])if(this._config[t].match("^weather.")){if(void 0===this.hass.states[this._config.weather_entity]){this._error.push("'weather_entity needs to be defined (not found).");break}if(this._config[t]!==this._config.weather_entity){this._error.push(`'${t} needs to be the same as weather_entity.`);break}const e=this.forecast1;if(void 0!==e){const i=new Date;switch(i.setDate(i.getDate()+1),t){case"entity_forecast_icon_1":void 0===this._getForecastPropFromWeather(e,i,"condition")&&this._error.push(`'${t} attribute forecast[1].condition not found`);break;case"entity_forecast_min_1":void 0===this._getForecastPropFromWeather(e,i,"templow")&&this._error.push(`'${t} attribute forecast[1].templow not found`);break;case"entity_forecast_max_1":void 0===this._getForecastPropFromWeather(e,i,"temperature")&&this._error.push(`'${t} attribute forecast[1].temperature not found`);break;case"entity_pop_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation_probability")&&this._error.push(`'${t} attribute forecast[1].precipitation_probability not found`);break;case"entity_pos_1":void 0===this._getForecastPropFromWeather(e,i,"precipitation")&&this._error.push(`'${t} attribute forecast[1].precipitation not found`)}}}else{this._config[t].match(/(\d+)(?!.*\d)/g)||this._error.push(`'${t}=${this._config[t]}' value needs to have a number`)}return void 0!==this._config.weather_entity&&(void 0!==this._config.forecast_type?["daily","hourly","twice_daily"].includes(this._config.forecast_type)||this._error.push("'forecast_type must be daily, hourly, or twice_daily"):this._error.push("'forecast_type needs to be configured.")),0!==this._error.length}_renderUpdateTime(){if(this._config.entity_update_time&&this.hass.states[this._config.entity_update_time]&&void 0!==this.hass.states[this._config.entity_update_time].state)if(!0===this._config.update_time_use_attr){if(void 0!==this._config.update_time_name_attr){const t=this._config.update_time_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[this._config.entity_update_time].attributes);if(void 0!==t){const e=new Date(`${t}`);switch(this.timeFormat){case"12hour":return U`${e.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(e)}`;case"24hour":return U`${e.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(e)}`;case"system":return U`${e.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(e)}`}}}}else{const t=new Date(this.hass.states[this._config.entity_update_time].state);switch(this.timeFormat){case"12hour":return U`${t.toLocaleString(this.locale||navigator.language,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" ","")+", "+this._formatDate(t)}`;case"24hour":return U`${t.toLocaleString(this.locale||navigator.language,{hour:"2-digit",minute:"2-digit",hour12:!1})+", "+this._formatDate(t)}`;case"system":return U`${t.toLocaleTimeString(this.locale||navigator.language,{timeStyle:"short"}).replace(" ","")+", "+this._formatDate(t)}`}}return U`---`}_renderCompleteOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const i=this._weatherIcon(this.forecastIcon),s=this._getIconUrl(i),o="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?U``:U`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=U`<div class="big-icon"><img src="${s}" width="100%" height="100%" title="${o}"></div>`,r=U`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,l=this.currentApparentTemperature,c=""!=l?U`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${l}</div>
        <div class="unit-temp-small"> ${this.getUOM("temperature")}</div>
      </div>
    `:U``,_=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"",h=this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=U`<div class="forecast-text">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:U`<div class="forecast-text">---</div>`:U``;return U`
      <div class="overview-section section">
        ${this._config.text_card_title?U`<div class="card-header">${this._config.text_card_title}</div>`:U``}
        ${this._config.text_card_title_2?U`<div class="card-header">${this._config.text_card_title_2}</div>`:U``}
        ${this._config.entity_update_time?U`<div class="updated">${this._config.text_update_time_prefix?this._config.text_update_time_prefix+" ":""}${this._renderUpdateTime()}</div>`:U``}
        <div class="overview-top">
          <div class="top-left">${a}${n}</div>
          <div class="currentTemps">${r}${c}</div>
        </div>
        ${h}
        ${_}
      </div>
    `}_renderObservationsOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const e=this._cardWidth>=344?" stacked":"",i=U`
      <div class="current-temp">
        <div class="temp" id="current-temp-text">${this.currentTemperature}</div>
        <div class="unit-temp-big">${this.getUOM("temperature")}</div>
      </div>
    `,s=this.currentApparentTemperature,o=""!=s?U`
      <div class="apparent-temp">
        <div class="apparent">${this.localeTextFeelsLike}&nbsp;${s}</div>
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
          <div class="currentTemps">${i}${o}</div>
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
    `}_renderForecastOverviewSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;const i=this._weatherIcon(this.forecastIcon),s=this._getIconUrl(i),o="unknown"!==i?"":`Unknown condition\n${this.forecastIcon}`,n="unknown"!==i?U``:U`<div class="unknown-forecast">${this.forecastIcon}</div>`,a=U`<div class="big-icon"><img src="${s}" width="100%" height="100%" title="${o}"></div>`,r=!0===this._config.option_show_overview_separator?U`<hr class=line>`:"",l=this._config.entity_summary&&this.hass.states[this._config.entity_summary]?null!==(e=U`<div class="forecast-text-right">${this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary])}</div>`)&&void 0!==e?e:U`<div class="forecast-text-right">---</div>`:U``;return U`
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
    `}_getCardSizeOverviewSection(){var t=0;if(!1!==this._config.show_section_overview){if("observations"===this._config.overview_layout)return 76;t=16,t+=void 0!==this._config.text_card_title?20:0,t+=void 0!==this._config.text_card_title_2?20:0,t+=void 0!==this._config.entity_update_time?20:0,"title only"!==this._config.overview_layout&&(t+="forecast"!==this._config.overview_layout&&void 0!==this._config.entity_summary?145:120)}return t}_renderOverviewSection(){var t;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_overview))return U``;switch(this._config.overview_layout||"complete"){case"observations":return this._renderObservationsOverviewSection();case"forecast":return this._renderForecastOverviewSection();case"title only":return this._renderTitleOnlyOverviewSection();default:return this._renderCompleteOverviewSection()}}_getCardSizeExtendedSection(){var t=0;return!1!==this._config.show_section_extended&&(t+=16,t+=this._config.entity_extended?40:0,t+=void 0!==this._config.entity_todays_uv_forecast||void 0!==this._config.entity_todays_fire_danger?20:0),t}_renderExtendedSection(){var t,e;if(!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_extended)||void 0===this._config.entity_extended&&void 0===this._config.entity_todays_uv_forecast&&void 0===this._config.entity_todays_fire_danger)return U``;const i=this._config.entity_extended||"";var s=[];if(void 0!==this.hass.states[i])if(null===(e=this._config.entity_extended)||void 0===e?void 0:e.match("^weather.")){const t=this.forecast1;var o;if(void 0!==t)o=void 0,!0===this._config.extended_use_attr?void 0!==this._config.extended_name_attr&&(o=t[0][this._config.extended_name_attr]):o="extended_use_attr: - must be set to true when entity_extended is set to a weather entity",void 0!==o&&s.push(U`${o}`)}else if(!0===this._config.extended_use_attr){if(void 0!==this._config.extended_name_attr){const t=this._config.extended_name_attr.toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[i].attributes);void 0!==t&&s.push(U`${t}`)}}else if(void 0!==this.hass.states[i]){const t=this.hass.states[i].state;"unknown"!==t&&"unavailable"!==t&&s.push(U`${t}`)}return s.push(U`${this._config.entity_todays_uv_forecast&&this.hass.states[this._config.entity_todays_uv_forecast]&&"unknown"!==this.hass.states[this._config.entity_todays_uv_forecast].state?" "+this.hass.states[this._config.entity_todays_uv_forecast].state:""}`),s.push(U`${this._config.entity_todays_fire_danger&&this.hass.states[this._config.entity_todays_fire_danger]&&"unknown"!==this.hass.states[this._config.entity_todays_fire_danger].state?" "+this.hass.states[this._config.entity_todays_fire_danger].state:""}`),U`
      <div class="extended-section section">
        <div class="f-extended">
          ${s}
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
    `}_renderHorizontalDailyForecastSection(){var t,e,i,s,o,n,a,r,l,c,_,h;const d=[],u=this._config.daily_forecast_days||5;for(var g=0;g<u;g++){const C=new Date;var v,p,m;if(C.setDate(C.getDate()+g+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;var f;if(void 0!==this.forecast1&&(f=this._getForecastPropFromWeather(this.forecast1,C,"condition")),void 0===f)break;const e={href:this._getIconUrl(t&&f?this._weatherIcon(f):"unknown",!0)};v=U`<li class="f-slot-horiz-icon"><i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i></li>`}else{var y=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g)):void 0;if(void 0===t||void 0===this.hass.states[t])break;const e={href:this._getIconUrl(t&&this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};v=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i>`}(null===(e=this._config.entity_forecast_max_1)||void 0===e?void 0:e.match("^weather."))?void 0!==this.forecast1&&(p=this._getForecastPropFromWeather(this.forecast1,C,"temperature")):p=(y=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g))].state:void 0,(null===(i=this._config.entity_forecast_min_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(m=this._getForecastPropFromWeather(this.forecast1,C,"templow")):m=(y=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g))].state:void 0;const E=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,N=!0===this._config.old_daily_format?U`
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text highTemp">${p?Number(p).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${E}
            </span>
          </li>
          <li class="f-slot-horiz-text">
            <span>
              <div class="slot-text lowTemp">${m?Number(m).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
              ${E}
            </span>
          </li>`:"highlow"===this._config.tempformat?U`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text highTemp">${p?Number(p).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text lowTemp">${m?Number(m).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${E}
              </span>
            </li>`:U`
            <li class="f-slot-horiz-text">
              <span>
                <div class="slot-text lowTemp">${m?Number(m).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                <div class="slot-text slash">/</div>
                <div class="slot-text highTemp">${p?Number(p).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0}):"---"}</div>
                ${E}
              </span>
            </li>
          `;var b,$,w;if(null===(s=this._config.entity_pop_1)||void 0===s?void 0:s.match("^weather.")){const t=this._config.entity_pop_1;var x;void 0!==this.forecast1&&(x=this._getForecastPropFromWeather(this.forecast1,C,"precipitation_probability")),b=t&&!1!==this._config.option_show_forecast_pop?U`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${this.hass.states[t]&&void 0!==x?Math.round(Number(x)):"---"}</div><div class="unit">%</div></span></li>`:U``}else{const t=(y=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g)):void 0;b=y&&!1!==this._config.option_show_forecast_pop?U`<li class="f-slot-horiz-text"><span><div class="slot-text pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></span></li>`:U``}if(null===(o=this._config.entity_pos_1)||void 0===o?void 0:o.match("^weather.")){const t=this._config.entity_pos_1;var k;void 0!==this.forecast1&&(k=this._getForecastPropFromWeather(this.forecast1,C,"precipitation")),$=t?U`<li class="f-slot-horiz-text"><span><div class="pos">${this.hass.states[t]&&void 0!==k?k:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:U``}else{const t=(y=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g)):void 0;$=y?U`<li class="f-slot-horiz-text"><span><div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></span></li>`:U``}if(null===(n=this._config.entity_summary_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_summary_1;var S;void 0!==this.forecast1&&(S=null!==(a=this._getForecastPropFromWeather(this.forecast1,C,"detailed_description"))&&void 0!==a?a:this._getForecastPropFromWeather(this.forecast1,C,"condition"));const e=(this._config.option_show_current_day?0:1)+g,i=this.forecast1&&this.forecast1[e],s={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},o=null==i?void 0:i.wind_bearing;let n=null;if(null!=o){const t=Number(o);n=isNaN(t)?null!==(r=s[String(o).toUpperCase().trim()])&&void 0!==r?r:null:t}const c=C?C.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",_=this.hass.states[t]&&void 0!==S?bt(this.hass.localize,S):"",h=this._config.entity?this.hass.states[this._config.entity]:null,d=this._buildTooltipRows({date:c,condition:_,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(l=null==h?void 0:h.attributes)||void 0===l?void 0:l.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});w=U`<div class="fcasttooltipblock" id="fcast-summary-${g}" style="width:${100*u}%;left:-${100*g}%;">${kt(d)}<span style="content:'';position:absolute;top:100%;left:${100/u/2+g*(100/u)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}else{const t=(y=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(y)+g)):void 0,e=(this._config.option_show_current_day?0:1)+g,i=this.forecast1&&this.forecast1[e],s={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},o=null==i?void 0:i.wind_bearing;let n=null;if(null!=o){const t=Number(o);n=isNaN(t)?null!==(c=s[String(o).toUpperCase().trim()])&&void 0!==c?c:null:t}const a=C?C.toLocaleDateString(this.locale,{weekday:"long",month:"short",day:"numeric"}):"",r=this._config.option_tooltips&&t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?null!==(_=this.hass.states[t].attributes[this._config.summary_1_name_attr])&&void 0!==_?_:"":this.hass.states[t].state:"",l=this._config.entity?this.hass.states[this._config.entity]:null,d=this._buildTooltipRows({date:a,condition:r,maxT:void 0!==(null==i?void 0:i.temperature)?Number(i.temperature):null,minT:void 0!==(null==i?void 0:i.templow)?Number(i.templow):null,precip:void 0!==(null==i?void 0:i.precipitation)?Number(i.precipitation):null,windSpeed:void 0!==(null==i?void 0:i.wind_speed)?Math.round(Number(i.wind_speed)):null,windBearDeg:n,uomPrecip:(null===(h=null==l?void 0:l.attributes)||void 0===h?void 0:h.precipitation_unit)||this.getUOM("precipitation"),uomWind:this._getWindUnit()});w=U`<div class="fcasttooltipblock" id="fcast-summary-${g}" style="width:${100*u}%;left:-${100*g}%;">${kt(d)}<span style="content:'';position:absolute;top:100%;left:${100/u/2+g*(100/u)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}d.push(U`
        <div class="day-horiz fcasttooltip">
          <ul class="f-slot-horiz">
            <li class="f-slot-horiz-text"><span class="dayname">${C?C.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</span></li>
            ${v}
            ${this._config.option_show_temperature_chart?U``:N}
            ${b}
            ${this._config.option_show_precipitation_chart?U``:$}
            ${!0===this._config.option_show_forecast_wind?(()=>{var t;const e=(this._config.option_show_current_day?0:1)+g,i=this.forecast1&&this.forecast1[e];if(!i||void 0===i.wind_speed)return U``;const s=Math.round(Number(i.wind_speed)),o={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337};let n=null;if(void 0!==i.wind_bearing&&null!==i.wind_bearing){const e=Number(i.wind_bearing);if(isNaN(e)){n=null!==(t=o[String(i.wind_bearing).toUpperCase().trim()])&&void 0!==t?t:null}else n=e}return U`<li class="f-slot-horiz-text"><span>${kt(null!==n?`<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 10 10" style="transform:rotate(${(n+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:1px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:"")}${s}</span></li>`})():U``}

          </ul>
          ${w}
        </div>
      `)}return U`
      <div class="daily-forecast-horiz-section section">
        ${d}
      </div>
    `}_renderVerticalDailyForecastSection(){var t,e,i,s,o,n,a;const r=[],l=this._config.daily_forecast_days||5;for(var c=0;c<l;c++){const l=new Date;var _,h,d,u,g,v,p;if(l.setDate(l.getDate()+c+(this._config.option_show_current_day?0:1)),null===(t=this._config.entity_forecast_icon_1)||void 0===t?void 0:t.match("^weather.")){const t=this._config.entity_forecast_icon_1;if(void 0!==this.forecast1&&(p=this._getForecastPropFromWeather(this.forecast1,l,"condition")),void 0===p)break;const e={href:this._getIconUrl(t&&p?this._weatherIcon(p):"unknown",!0)};_=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}else{var m=!!this._config.entity_forecast_icon_1&&this._config.entity_forecast_icon_1.match(/(\d+)(?!.*\d)/g);const t=m&&this._config.entity_forecast_icon_1?this._config.entity_forecast_icon_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0;if(!t||void 0===this.hass.states[t]||"unknown"===this.hass.states[t].state)break;const e={href:this._getIconUrl(void 0!==this.hass.states[t]?this._weatherIcon(this.hass.states[t].state):"unknown",!0)};_=U`<i class="icon" style="background: none, url(${e.href}) no-repeat; background-size: contain;"></i><br>`}if(null===(e=this._config.entity_summary_1)||void 0===e?void 0:e.match("^weather.")){void 0!==this.forecast1&&(p=this._getForecastPropFromWeather(this.forecast1,l,"condition"));var f=(m=!0)?U`
          <div class="f-summary-vert">${this.hass.states[this._config.entity_summary_1]?this.hassExtended.formatEntityState(this.hass.states[this._config.entity_summary_1],p):"---"}</div>`:""}else{const t=(m=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_summary_1?this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0,e=t&&this.hass.states[t]?this._config.summary_1_use_attr&&this._config.summary_1_name_attr?this.hass.states[t].attributes[this._config.summary_1_name_attr]:this.hass.states[t].state:"---";f=m?U`
          <div class="f-summary-vert">${null!=e?e:"---"}</div>`:""}(null===(i=this._config.entity_forecast_max_1)||void 0===i?void 0:i.match("^weather."))?void 0!==this.forecast1&&(h=this._getForecastPropFromWeather(this.forecast1,l,"temperature")):h=(m=!!this._config.entity_forecast_max_1&&this._config.entity_forecast_max_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_max_1?this.hass.states[this._config.entity_forecast_max_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c))].state:void 0,(null===(s=this._config.entity_forecast_min_1)||void 0===s?void 0:s.match("^weather."))?void 0!==this.forecast1&&(d=this._getForecastPropFromWeather(this.forecast1,l,"templow")):d=(m=!!this._config.entity_forecast_min_1&&this._config.entity_forecast_min_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_forecast_min_1?this.hass.states[this._config.entity_forecast_min_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c))].state:void 0;const k=U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`,S=d?U`
        <div class="f-slot-vert">
          <div class="temp-label">Min: </div>
          <div class="low-temp">${Number(d).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${k}
        </div>`:U`---`,C=h?U`
        <div class="f-slot-vert">
          <div class="temp-label">Max: </div>
          <div class="high-temp">${Number(h).toLocaleString(this.locale,{minimumFractionDigits:this._config.option_forecast_decimals?1:0,maximumFractionDigits:this._config.option_forecast_decimals?1:0})}</div>${k}
        </div>`:U`---`;if(null===(o=this._config.entity_pop_1)||void 0===o?void 0:o.match("^weather.")){const t=this._config.entity_pop_1;var y;void 0!==this.forecast1&&(y=this._getForecastPropFromWeather(this.forecast1,l,"precipitation_probability")),u=t?U`<div class="f-slot-vert"><div class="f-label">Chance of rain </div>
        <div class="pop">${this.hass.states[t]&&void 0!==y?Math.round(Number(y)):"---"}</div><div class="unit">%</div></div>`:U``}else{const t=(m=!!this._config.entity_pop_1&&this._config.entity_pop_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pop_1?this._config.entity_pop_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0;u=m?U`
          <div class="f-slot-vert"><div class="f-label">Chance of rain </div>
          <div class="pop">${t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)):"---"}</div><div class="unit">%</div></div>`:U``}if(null===(n=this._config.entity_pos_1)||void 0===n?void 0:n.match("^weather.")){const t=this._config.entity_pos_1;var b;void 0!==this.forecast1&&(b=this._getForecastPropFromWeather(this.forecast1,l,"precipitation")),g=t?U`<div class="f-slot-vert"><div class="f-label">Possible rain </div>
        <div class="pos">${this.hass.states[t]&&void 0!==b?b:"---"}</div><div class="unit">${this.getUOM("precipitation")}</div></div>`:U``}else{const t=(m=!!this._config.entity_pos_1&&this._config.entity_pos_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_pos_1?this._config.entity_pos_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0;g=m?U`
          <div class="f-slot-vert"><div class="f-label">Possible rain </div>
          <div class="pos">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>
          <div class="unit">${this.getUOM("precipitation")}</div></div>`:U``}var $,w=U``;if(null===(a=this._config.entity_extended_1)||void 0===a?void 0:a.match("^weather.")){if(void 0!==this.forecast1)$=void 0,!0===this._config.daily_extended_use_attr?void 0!==this._config.daily_extended_name_attr&&($=this._getForecastPropFromWeather(this.forecast1,l,this._config.daily_extended_name_attr)):$="daily_extended_use_attr: - must be set to true when entity_extended_1 is set to a weather entity",void 0!==$&&(w=$?U`<div class="f-extended">${$}</div>`:U``)}else if(m=!!(this._config.entity_extended_1&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g),c<(this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days:7))if(!0===this._config.daily_extended_use_attr){const t=(m=!!this._config.entity_extended_1&&this._config.entity_extended_1.match(/(\d+)(?!.*\d)/g))&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):this._config.entity_extended_1;if(t&&void 0!==this.hass.states[t]){const e=null==(m=!!(this._config.daily_extended_name_attr&&c<(0!==this._config.daily_extended_forecast_days?this._config.daily_extended_forecast_days||7:0))&&this._config.daily_extended_name_attr.match(/(\d+)(?!.*\d)/g))&&t&&this._config.daily_extended_name_attr?this.hass.states[t].attributes[this._config.daily_extended_name_attr]:m&&this._config.daily_extended_name_attr&&t?this._config.daily_extended_name_attr.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)).toLowerCase().split(".").reduce((t,e)=>void 0!==t?t[e]:void 0,this.hass.states[t].attributes):void 0;w=e?U`<div class="f-extended">${e}</div>`:U``}}else{const t=m&&this._config.entity_extended_1?this._config.entity_extended_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0;w=m?U`<div class="f-extended">${t&&this.hass.states[t]?this.hass.states[t].state:"---"}</div>`:U``}m=!!this._config.entity_fire_danger_1&&this._config.entity_fire_danger_1.match(/(\d+)(?!.*\d)/g),v=U``;const E=m&&this._config.entity_fire_danger_1?this._config.entity_fire_danger_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+c)):void 0;if(m&&E){var x=!1!==this._config.option_daily_color_fire_danger&&this.hass.states[E].attributes.color_fill?`background-color:${this.hass.states[E].attributes.color_fill}; color:${this.hass.states[E].attributes.color_text};`:"";!1===this._config.option_daily_color_fire_danger?v=m&&"unknown"!==this.hass.states[E].state?U`
          <div class="f-firedanger-vert">${E&&this.hass.states[E]?this.hass.states[E].state:"---"}</div>`:U``:(""===x&&(x="font-weight:300;"),v=m&&"unknown"!==this.hass.states[E].state?U`
          <div class="f-firedanger-vert">
            <p class="fire-danger-text-color" style="${x}">${E&&this.hass.states[E]?this.hass.states[E].state.toUpperCase():"---"}</p>
          </div>`:U``)}r.push(U`
        <div class="day-vert fcasttooltip">
          <div class="day-vert-top">
            <div class="dayname-vert">${l?l.toLocaleDateString(this.locale,{weekday:"short"}):"---"}</div>
            ${f}
          </div>
          <div>
            ${v}
          </div>
          <div class="day-vert-middle">
            <div class="day-vert-dayicon">
              ${_}
            </div>
            <div class="day-vert-temps">
              ${S}
              ${C}
            </div>
            <div class="day-vert-rain">
              ${u}
              ${g}
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
    `}_getForecastPropFromWeather(t,e,i){const s=e.toDateString(),o=t.filter(t=>new Date(t.datetime).toDateString()===s);if(1===o.length)return void 0!==o[0][i]?String(o[0][i]):void 0;if(2===o.length){const t=o.find(t=>!0===t.daytime),e=o.find(t=>!1===t.daytime);return"templow"===i?e&&void 0!==e.temperature?String(e.temperature):void 0:t&&void 0!==t[i]?String(t[i]):void 0}}_getCardSizeDailyForecastSection(){var t=0;return!1!==this._config.show_section_daily_forecast&&("vertical"!==this._config.daily_forecast_layout?t+=146:(t+=18+87*(this._config.daily_forecast_days||5),0!==this._config.daily_extended_forecast_days&&(t+=48*Math.min(this._config.daily_forecast_days||5,this._config.daily_extended_forecast_days||7)))),t}_getWindUnit(){var t,e,i,s,o,n;const a=this._config.entity?null===(e=null===(t=this.hass.states[this._config.entity])||void 0===t?void 0:t.attributes)||void 0===e?void 0:e.wind_speed_unit:void 0;if(a)return a;const r=null===(s=null===(i=this.hass.config)||void 0===i?void 0:i.unit_system)||void 0===s?void 0:s.wind_speed;return r&&"m/s"!==r?r:"km"===(null===(n=null===(o=this.hass.config)||void 0===o?void 0:o.unit_system)||void 0===n?void 0:n.length)?"km/h":"mph"}_localizeUnit(t){var e;if(((null===(e=this.hass)||void 0===e?void 0:e.language)||"en").toLowerCase().startsWith("bg")){return{"km/h":"км/ч",kph:"км/ч","m/s":"м/с",mph:"мph",mm:"мм",in:"инч",cm:"см"}[t]||t}return t}_buildTooltipRows(t){const{date:e,condition:i,maxT:s,minT:o,precip:n,windSpeed:a,windBearDeg:r,uomPrecip:l="",uomWind:c=""}=t;let _="";if(e&&(_+=`<div class="fcasttooltiptext" style="color:#fff;font-weight:600;border-bottom:1px solid rgba(255,255,255,0.25);padding-bottom:3px;margin-bottom:4px;">${e}</div>`),i&&(_+=`<div class="fcasttooltiptext" style="color:#fff;margin-bottom:2px;">${i}</div>`),null!=s&&(_+=`<div class="fcasttooltiptext" style="color:#fff;margin-top:2px;"><b style="color:#ef5350;">↑ ${Math.round(s)}°</b>&nbsp;&nbsp;<b style="color:#90caf9;">↓ ${null!=o?Math.round(o)+"°":"---"}</b></div>`),null!=n&&n>0&&(_+=`<div class="fcasttooltiptext" style="color:#fff;">💧 ${n.toFixed(1)} ${this._localizeUnit(l)}</div>`),null!=a){_+=`<div class="fcasttooltiptext" style="color:#fff;">${null!=r?`<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" style="transform:rotate(${(r+180)%360}deg);display:inline-block;vertical-align:middle;margin-right:2px;"><polygon points="5,0 8.5,9 5,6.5 1.5,9" fill="currentColor"/></svg>`:""}${a} ${this._localizeUnit(c)}</div>`}return _}_renderChartSection(){var t,e,i,s,o,n,a,r;if(!1===this._config.show_section_charts)return U``;const l=!0===this._config.option_show_temperature_chart,c=!0===this._config.option_show_precipitation_chart;if(!l&&!c)return U``;if(!this.forecast1||0===this.forecast1.length)return U``;const _=Math.min(this._config.daily_forecast_days||5,this.forecast1.length),h=this._config.option_show_current_day?0:1,d={N:0,NNE:22,NE:45,ENE:67,E:90,ESE:112,SE:135,SSE:157,S:180,SSW:202,SW:225,WSW:247,W:270,WNW:292,NW:315,NNW:337},u=[];for(let a=0;a<_;a++){const r=this.forecast1[h+a];if(!r)break;const l=r.wind_bearing;let c=null;if(null!=l){const e=Number(l);c=isNaN(e)?null!==(t=d[String(l).toUpperCase().trim()])&&void 0!==t?t:null:e}u.push({maxT:Number(null!==(e=r.temperature)&&void 0!==e?e:0),minT:Number(null!==(s=null!==(i=r.templow)&&void 0!==i?i:r.temperature)&&void 0!==s?s:0),precip:Number(null!==(o=r.precipitation)&&void 0!==o?o:0),windSpeed:void 0!==r.wind_speed?Math.round(Number(r.wind_speed)):null,windBear:c,datetime:String(null!==(n=r.datetime)&&void 0!==n?n:"")})}if(0===u.length)return U``;const g=l?75:52,v=g+(c?16:0),p=l?u.flatMap(t=>[t.maxT,t.minT]):[],m=l?Math.max(...p):0,f=l?Math.min(...p):0,y=m-f||1,b=g-16,$=t=>16+(m-t)/y*(b-16),w=u.map(t=>{let e=$(t.maxT),i=$(t.minT);const s=i-e;if(s<18){const t=(18-s)/2;e-=t,i+=t}return{maxY:e,minY:i}}),x=100/u.length,k=t=>(t+.5)*x,S=l?(()=>{const t=w.map((t,e)=>`${k(e)},${t.maxY}`).join(" "),e=w.map((t,e)=>`${k(e)},${t.minY}`).join(" ");return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 ${v}" preserveAspectRatio="none" style="position:absolute;top:0;left:0;width:100%;height:${v}px;overflow:visible;pointer-events:none;"><polyline points="${t}" fill="none" stroke="rgba(255,152,0,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/><polyline points="${e}" fill="none" stroke="rgba(90,150,210,0.9)" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-linecap="round"/>`+(c?`<line x1="0" y1="${g}" x2="100" y2="${g}" stroke="rgba(115,198,239,0.2)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>`:"")+"</svg>"})():"",C=this._localizeUnit((this._config.entity?null===(r=null===(a=this.hass.states[this._config.entity])||void 0===a?void 0:a.attributes)||void 0===r?void 0:r.precipitation_unit:void 0)||this.getUOM("precipitation")),E=u.map((t,e)=>{var i,s,o,n,a;let r="";if(l){const i=w[e].maxY-6.5,s=w[e].minY-6.5;r+=`<div style="position:absolute;top:${i}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(255,152,0,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.maxT)}°</div>`,r+=`<div style="position:absolute;top:${s}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(90,150,210,0.9);border-radius:2.5px;background:rgba(10,14,24,0.85);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${Math.round(t.minT)}°</div>`}if(c){const e=Math.max(...u.map(t=>t.precip),.1),i=.85*g;if(t.precip>0){const s=Math.max(t.precip/e*i,2),o=g-s,n=(t.precip%1==0?String(t.precip):t.precip.toFixed(1))+" "+C;r=`<div style="position:absolute;top:${o}px;left:0;right:0;height:${s}px;background:rgba(151,230,255,0.50);border-radius:2px 2px 0 0;z-index:0;"></div>`+r,r+=`<div style="position:absolute;top:${g-6}px;left:50%;transform:translateX(-50%);border:0.8px solid rgba(115,198,239,0.85);border-radius:2.5px;background:rgba(10,14,24,0.9);padding:1px 4px;font-size:8px;color:#fff;white-space:nowrap;">${n}</div>`}else r+=`<div style="position:absolute;top:${g-1}px;left:0;right:0;height:2px;background:rgba(151,230,255,0.15);border-radius:1px;"></div>`}const _=v,d=this.locale,p=t.datetime?new Date(t.datetime).toLocaleDateString(d,{weekday:"long",month:"short",day:"numeric"}):"",m=!!this._config.entity_summary_1&&this._config.entity_summary_1.match(/(\d+)(?!.*\d)/g);let f="";if(null===(i=this._config.entity_summary_1)||void 0===i?void 0:i.match("^weather.")){const t=this.forecast1&&this.forecast1[h+e];f=t?String(null!==(o=null!==(s=t.detailed_description)&&void 0!==s?s:t.condition)&&void 0!==o?o:""):""}else if(m&&this._config.entity_summary_1){const t=this._config.entity_summary_1.replace(/(\d+)(?!.*\d)/g,String(Number(m)+e));f=this.hass.states[t]?this.hass.states[t].state:""}const y=this._getWindUnit(),b=(this._config.entity?null===(a=null===(n=this.hass.states[this._config.entity])||void 0===n?void 0:n.attributes)||void 0===a?void 0:a.precipitation_unit:void 0)||this.getUOM("precipitation"),$=this._buildTooltipRows({date:p,condition:f,maxT:l?t.maxT:null,minT:l?t.minT:null,precip:t.precip,windSpeed:t.windSpeed,windBearDeg:t.windBear,uomPrecip:b,uomWind:y});return`<div class="day-horiz fcasttooltip" style="position:relative;height:${_}px;overflow:visible;">${`<div class="fcasttooltipblock" style="width:${100*u.length}%;left:-${100*e}%;">`+$+`<span style="position:absolute;top:100%;left:${100/u.length/2+e*(100/u.length)}%;margin-left:-7.5px;border-width:7.5px;border-style:solid;border-color:#FFA100 transparent transparent transparent;"></span></div>`}${r}</div>`}).join("");return U`<div class="daily-forecast-horiz-section section"
        style="position:relative;margin-top:4px;margin-bottom:4px;padding-top:0;padding-bottom:0;">
      ${kt(S+E)}
    </div>`}_renderDailyForecastSection(){var t;return!1===(null===(t=this._config)||void 0===t?void 0:t.show_section_daily_forecast)?U``:"vertical"!==this._config.daily_forecast_layout?this._renderHorizontalDailyForecastSection():this._renderVerticalDailyForecastSection()}render(){var t,e;const i=[];this.hassExtended=this.hass;const s=((t,e)=>{var i,s;if(void 0===e){if(void 0!==(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(i=null==t?void 0:t.forecast)||void 0===i?void 0:i.length)>2)return{forecast:t.forecast,type:null==t?void 0:t.type};e="daily"}if(e===(null==t?void 0:t.type)&&(null==t?void 0:t.forecast)&&(null===(s=null==t?void 0:t.forecast)||void 0===s?void 0:s.length)>2)return{forecast:t.forecast,type:e}})(this._forecastEvent,null===(t=this._config)||void 0===t?void 0:t.forecast_type);this.forecast1=this._config.weather_entity&&(null===(e=null==s?void 0:s.forecast)||void 0===e?void 0:e.length)?s.forecast.slice(0,this._config.daily_forecast_days?this._config.daily_forecast_days:5):void 0,this._checkForErrors()&&i.push(this._showConfigWarning(this._error));const o=[];return void 0!==this._config.section_order&&this._config.section_order.forEach(t=>{switch(t){case"overview":o.push(this._renderOverviewSection());break;case"extended":o.push(this._renderExtendedSection());break;case"slots":o.push(this._renderSlotsSection());break;case"daily_forecast":o.push(this._renderDailyForecastSection()),o.push(this._renderChartSection())}}),i.push(U`
      <style>
        ${this.styles}
      </style>
      <ha-card class="card"
        tabindex=${(t=>null!=t?t:R)(yt(this._config.tap_action)?"0":void 0)}
        ><div class="content">
          ${o}
        </div>
      </ha-card>
    `),U`${i}`}_onPointerDown(t){var e;t.isPrimary&&(this._pHoldFired=!1,clearTimeout(this._pHoldTimer),this.hass&&this._config&&yt(null===(e=this._config)||void 0===e?void 0:e.hold_action)&&(this._pHoldTimer=window.setTimeout(()=>{this._pHoldFired=!0,this.hass&&this._config&&ft(this,this.hass,this._config,"hold")},500)))}_onPointerCancel(){clearTimeout(this._pHoldTimer),this._pHoldFired=!1}_onCardClick(){var t,e;this._pHoldFired?this._pHoldFired=!1:this.hass&&this._config&&(yt(null===(t=this._config)||void 0===t?void 0:t.double_tap_action)?(this._clickCount++,1===this._clickCount?this._clickTimer=window.setTimeout(()=>{var t;this._clickCount=0,this.hass&&this._config&&yt(null===(t=this._config)||void 0===t?void 0:t.tap_action)&&ft(this,this.hass,this._config,"tap")},250):(clearTimeout(this._clickTimer),this._clickCount=0,ft(this,this.hass,this._config,"double_tap"))):yt(null===(e=this._config)||void 0===e?void 0:e.tap_action)&&ft(this,this.hass,this._config,"tap"))}get slotL1(){return this.slotValue("l1",this._config.slot_l1)}get slotL2(){return this.slotValue("l2",this._config.slot_l2)}get slotL3(){return this.slotValue("l3",this._config.slot_l3)}get slotL4(){return this.slotValue("l4",this._config.slot_l4)}get slotL5(){return this.slotValue("l5",this._config.slot_l5)}get slotL6(){return this.slotValue("l6",this._config.slot_l6)}get slotL7(){return this.slotValue("l7",this._config.slot_l7)}get slotL8(){return this.slotValue("l8",this._config.slot_l8)}get slotR1(){return this.slotValue("r1",this._config.slot_r1)}get slotR2(){return this.slotValue("r2",this._config.slot_r2)}get slotR3(){return this.slotValue("r3",this._config.slot_r3)}get slotR4(){return this.slotValue("r4",this._config.slot_r4)}get slotR5(){return this.slotValue("r5",this._config.slot_r5)}get slotR6(){return this.slotValue("r6",this._config.slot_r6)}get slotR7(){return this.slotValue("r7",this._config.slot_r7)}get slotR8(){return this.slotValue("r8",this._config.slot_r8)}slotValue(t,e){switch(e){case"pop":return this.slotPop;case"popforecast":return this.slotPopForecast;case"possible_today":return this.slotPos;case"possible_tomorrow":return this.slotPossibleTomorrow;case"rainfall":return this.slotRainfall;case"humidity":return this.slotHumidity;case"pressure":return this.slotPressure;case"observed_max":return this.slotObservedMax;case"observed_min":return this.slotObservedMin;case"forecast_max":return this.slotForecastMax;case"forecast_min":return this.slotForecastMin;case"temp_next":return this.slotTempNext;case"temp_following":return this.slotTempFollowing;case"temp_maximums":return this.slotTempMaximums;case"temp_minimums":return this.slotTempMinimums;case"uv_summary":return this.slotUvSummary;case"fire_danger":return this.slotFireDanger;case"wind":return this.slotWind;case"wind_gust":return this.slotWindGust;case"wind_kt":return this.slotWindKt;case"visibility":return this.slotVisibility;case"sun_next":return this.slotSunNext;case"sun_following":return this.slotSunFollowing;case"moon":return this.slotMoon;case"custom1":return this.slotCustom1;case"custom2":return this.slotCustom2;case"custom3":return this.slotCustom3;case"custom4":return this.slotCustom4;case"empty":return this.slotEmpty;case"remove":return this.slotRemove}switch(t){case"l1":return this.slotForecastMax;case"l2":return this.slotForecastMin;case"l3":return this.slotWind;case"l4":return this.slotPressure;case"l5":return this.slotSunNext;case"l6":case"l7":case"l8":case"r6":case"r7":case"r8":return this.slotRemove;case"r1":return this.slotPopForecast;case"r2":return this.slotHumidity;case"r3":return this.slotUvSummary;case"r4":return this.slotMoon;case"r5":return this.slotSunFollowing}return this.slotEmpty}get slotEmpty(){return U`<li>&nbsp;</li>`}get slotRemove(){return U``}get slotPopForecast(){const t=void 0!==this.forecast1?this.forecast1[0].precipitation_probability:void 0,e=this._config.entity_pop&&void 0!==this.hass.states[this._config.entity_pop]?null===this._config.entity_pop.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pop].state||"unavailable"===this.hass.states[this._config.entity_pop].state?"---":Math.round(Number(this.hass.states[this._config.entity_pop].state)):void 0!==t?Math.round(Number(t)):"---":"---",i="---"!==e?U`<div class="slot-text unit">%</div>`:U``,s=void 0!==this.forecast1?this.forecast1[0].precipitation:void 0,o=this._config.entity_pos&&void 0!==this.hass.states[this._config.entity_pos]?null===this._config.entity_pos.match("^weather.")?"unknown"===this.hass.states[this._config.entity_pos].state||"unavailable"===this.hass.states[this._config.entity_pos].state?"---":this.hass.states[this._config.entity_pos].state:void 0!==s?s:"---":"---",n="---"!==o?U`<div class="slot-text unit">${this.getUOM("precipitation")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-rainy"></ha-icon>
          </div>
          <div class="slot-text pop-text">${e}</div>${i}<div class="slot-text">&nbsp;</div>
          <div class="slot-text pop-text-today">${o}</div>${n}
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
    `}get slotForecastMax(){const t=void 0!==this.forecast1?this.forecast1[0].temperature:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?null===this._config.entity_forecast_max.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",s="---"!==i?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-high"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMax}&nbsp;</div>
          <div class="slot-text forecast-max-text">${i}</div>${s}
        </div>
      </li>
    `}get slotForecastMin(){const t=void 0!==this.forecast1?this.forecast1[0].templow:void 0,e=!0===this._config.option_today_temperature_decimals?1:0,i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?null===this._config.entity_forecast_min.match("^weather.")?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==t?Number(t).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---",s="---"!==i?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:thermometer-low"></ha-icon>
          </div>
          <div class="slot-text">${this.localeTextForecastMin}&nbsp;</div>
          <div class="slot-text forecast-min-text">${i}</div>${s}
        </div>
      </li>
    `}get slotTempNext(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_next_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_next&&void 0!==this.hass.states[this._config.entity_temp_next]?Number(this.hass.states[this._config.entity_temp_next].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_next_label&&void 0!==this.hass.states[this._config.entity_temp_next_label]?this.hass.states[this._config.entity_temp_next_label].state:"",o="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-next-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempFollowing(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("min")||this.hass.states[this._config.entity_temp_following_label].state.toLowerCase().includes("low")?"mdi:thermometer-low":"mdi:thermometer-high":"mdi:help-box",i=this._config.entity_temp_following&&void 0!==this.hass.states[this._config.entity_temp_following]?Number(this.hass.states[this._config.entity_temp_following].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s=this._config.entity_temp_following_label&&void 0!==this.hass.states[this._config.entity_temp_following_label]?this.hass.states[this._config.entity_temp_following_label].state:"",o="---"!==i?U`<div class="slot-text unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="${e}"></ha-icon>
          </div>
          <div class="slot-text temp-following-text">${s} ${i}</div>
          ${o}
        </div>
      </li>
    `}get slotTempMaximums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_max&&void 0!==this.hass.states[this._config.entity_observed_max]?Number(this.hass.states[this._config.entity_observed_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_max&&void 0!==this.hass.states[this._config.entity_forecast_max]?Number(this.hass.states[this._config.entity_forecast_max].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
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
    `}get slotTempMinimums(){const t=!0===this._config.option_today_temperature_decimals?1:0,e=this._config.entity_observed_min&&void 0!==this.hass.states[this._config.entity_observed_min]?Number(this.hass.states[this._config.entity_observed_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",i=this._config.entity_forecast_min&&void 0!==this.hass.states[this._config.entity_forecast_min]?Number(this.hass.states[this._config.entity_forecast_min].state).toLocaleString(this.locale,{minimumFractionDigits:t,maximumFractionDigits:t}):"---",s="---"!==e?U`<div class="unit-temp-small">${this.getUOM("temperature")}</div>`:U``;return U`
      <li>
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
      </li>`)}get slotWind(){const t=this._config.entity_wind_speed&&this._config.option_show_beaufort?U`<div class="slot-text">BFT: ${this.currentBeaufort} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`,s=this._config.entity_wind_speed?U`<div class="slot-text">${this.currentWindSpeed}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust&&!1!==this._config.option_show_gust_in_wind?U`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGust}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            ${this._windIcon("mdi:weather-windy",this._config.option_wind_bearing_icon)}
          </div>
          ${t}${e}${s}${o}
        </div>
      </li>
    `}get slotWindGust(){if(!this._config.entity_wind_gust)return U``;const t=U`<div class="slot-text unit">${this.currentWindSpeedUnit}</div>`;return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            ${this._windIcon("mdi:weather-windy-variant",this._config.option_gust_bearing_icon)}
          </div>
          <div class="slot-text">${this.localeTextGust}&nbsp;</div>
          <div class="slot-text">${this.currentWindGust}</div>${t}
        </div>
      </li>
    `}get slotWindKt(){const t=this._config.entity_wind_speed_kt&&this._config.option_show_beaufort?U`<div class="slot-text">BFT: ${this.currentBeaufortKt} -&nbsp;</div>`:"",e=this._config.entity_wind_bearing?U`<div class="slot-text">${this.currentWindBearing}&nbsp;</div>`:"",i=U`<div class="slot-text unit">Kt</div>`,s=this._config.entity_wind_speed_kt?U`<div class="slot-text">${this.currentWindSpeedKt}</div>${i}&nbsp;`:"",o=this._config.entity_wind_gust_kt?U`<div class="slot-text">(${this.localeTextGust} ${this.currentWindGustKt}</div>${i})`:"";return U`
      <li>
        <div class="slot">
          <div class="slot-icon">
            <ha-icon icon="mdi:weather-windy"></ha-icon>
          </div>
          ${t}${e}${s}${o}
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
    `}moonPhaseIcon(t){switch(t){case"new_moon":return"mdi:moon-new";case"waxing_crescent":return"mdi:moon-waxing-crescent";case"first_quarter":return"mdi:moon-first-quarter";case"waxing_gibbous":return"mdi:moon-waxing-gibbous";case"full_moon":default:return"mdi:moon-full";case"waning_gibbous":return"mdi:moon-waning-gibbous";case"last_quarter":return"mdi:moon-last-quarter";case"waning_crescent":return"mdi:moon-waning-crescent"}}localeTextMoonPhase(t){switch(this.locale){case"bg":switch(t){case"new_moon":return"Новолуние";case"waxing_crescent":return"Растящ полумесец";case"first_quarter":return"Първа четвърт";case"waxing_gibbous":return"Растяща луна";case"full_moon":return"Пълнолуние";case"waning_gibbous":return"Намаляваща луна";case"last_quarter":return"Последна четвърт";case"waning_crescent":return"Намаляващ полумесец"}break;case"ru":switch(t){case"new_moon":return"Новолуние";case"waxing_crescent":return"Растущий серп";case"first_quarter":return"Первая четверть";case"waxing_gibbous":return"Растущая луна";case"full_moon":return"Полнолуние";case"waning_gibbous":return"Убывающая луна";case"last_quarter":return"Последняя четверть";case"waning_crescent":return"Убывающий серп"}break;case"ua":switch(t){case"new_moon":return"Новий місяць";case"waxing_crescent":return"Молодий місяць";case"first_quarter":return"Перша чверть";case"waxing_gibbous":return"Зростаючий місяць";case"full_moon":return"Повний місяць";case"waning_gibbous":return"Спадаючий місяць";case"last_quarter":return"Остання чверть";case"waning_crescent":return"Старий місяць"}break;case"de":switch(t){case"new_moon":return"Neumond";case"waxing_crescent":return"Zunehmende Sichel";case"first_quarter":return"Erstes Viertel";case"waxing_gibbous":return"Zunehmender Mond";case"full_moon":return"Vollmond";case"waning_gibbous":return"Abnehmender Mond";case"last_quarter":return"Letztes Viertel";case"waning_crescent":return"Abnehmende Sichel"}break;case"fr":switch(t){case"new_moon":return"Nouvelle lune";case"waxing_crescent":return"Croissant";case"first_quarter":return"Premier quartier";case"waxing_gibbous":return"Lune croissante";case"full_moon":return"Pleine lune";case"waning_gibbous":return"Lune décroissante";case"last_quarter":return"Dernier quartier";case"waning_crescent":return"Dernier croissant"}break;case"it":switch(t){case"new_moon":return"Luna nuova";case"waxing_crescent":return"Luna crescente";case"first_quarter":return"Primo quarto";case"waxing_gibbous":return"Luna quasi piena";case"full_moon":return"Luna piena";case"waning_gibbous":return"Luna calante";case"last_quarter":return"Ultimo quarto";case"waning_crescent":return"Falce calante"}break;case"nl":switch(t){case"new_moon":return"Nieuwe maan";case"waxing_crescent":return"Wassende sikkel";case"first_quarter":return"Eerste kwartier";case"waxing_gibbous":return"Wassende maan";case"full_moon":return"Volle maan";case"waning_gibbous":return"Afnemende maan";case"last_quarter":return"Laatste kwartier";case"waning_crescent":return"Afnemende sikkel"}break;case"pl":switch(t){case"new_moon":return"Nów";case"waxing_crescent":return"Sierp rosnący";case"first_quarter":return"Pierwsza kwadra";case"waxing_gibbous":return"Rosnący księżyc";case"full_moon":return"Pełnia";case"waning_gibbous":return"Malejący księżyc";case"last_quarter":return"Ostatnia kwadra";case"waning_crescent":return"Sierp ubywający"}break;case"da":switch(t){case"new_moon":return"Nymåne";case"waxing_crescent":case"waxing_gibbous":return"Voksende måne";case"first_quarter":return"Første kvartal";case"full_moon":return"Fuldmåne";case"waning_gibbous":case"waning_crescent":return"Aftagende måne";case"last_quarter":return"Sidste kvartal"}break;case"es":switch(t){case"new_moon":return"Luna nueva";case"waxing_crescent":return"Creciente";case"first_quarter":return"Cuarto creciente";case"waxing_gibbous":return"Luna creciente";case"full_moon":return"Luna llena";case"waning_gibbous":return"Luna menguante";case"last_quarter":return"Cuarto menguante";case"waning_crescent":return"Menguante"}break;case"he":switch(t){case"new_moon":return"ירח חדש";case"waxing_crescent":return"סהר בגדילה";case"first_quarter":return"רבע ראשון";case"waxing_gibbous":return"ירח גדל";case"full_moon":return"ירח מלא";case"waning_gibbous":return"ירח קטן";case"last_quarter":return"רבע אחרון";case"waning_crescent":return"סהר בקטנה"}}return t.split("_").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}get slotCustom1(){var t=this._config.custom1_icon?this._config.custom1_icon:"mdi:help-box",e=this._config.custom1_value&&void 0!==this.hass.states[this._config.custom1_value]?this.hass.states[this._config.custom1_value].state:"unknown",i=this._config.custom1_units?this._config.custom1_units:"",s=this._config.custom1_label?this._config.custom1_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?U`<div class="slot-text label-text">${s}</div>`:U``}
        <div class="slot-text custom-1-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom2(){var t=this._config.custom2_icon?this._config.custom2_icon:"mdi:help-box",e=this._config.custom2_value&&void 0!==this.hass.states[this._config.custom2_value]?this.hass.states[this._config.custom2_value].state:"unknown",i=this._config.custom2_units?this._config.custom2_units:"",s=this._config.custom2_label?this._config.custom2_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?U`<div class="slot-text label-text">${s}</div>`:U``}
        <div class="slot-text custom-2-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom3(){var t=this._config.custom3_icon?this._config.custom3_icon:"mdi:help-box",e=this._config.custom3_value&&void 0!==this.hass.states[this._config.custom3_value]?this.hass.states[this._config.custom3_value].state:"unknown",i=this._config.custom3_units?this._config.custom3_units:"",s=this._config.custom3_label?this._config.custom3_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?U`<div class="slot-text label-text">${s}</div>`:U``}
        <div class="slot-text custom-3-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get slotCustom4(){var t=this._config.custom4_icon?this._config.custom4_icon:"mdi:help-box",e=this._config.custom4_value&&void 0!==this.hass.states[this._config.custom4_value]?this.hass.states[this._config.custom4_value].state:"unknown",i=this._config.custom4_units?this._config.custom4_units:"",s=this._config.custom4_label?this._config.custom4_label:"";return U`
      <li>
        <div class="slot-icon">
          <ha-icon icon=${t}></ha-icon>
        </div>
        ${s?U`<div class="slot-text label-text">${s}</div>`:U``}
        <div class="slot-text custom-4-text">${e}</div><div class="slot-text unit">${i}</div>
      </li>
    `}get forecastIcon(){const t=this._config.entity_forecast_icon;return t&&this.hass.states[t]?this.hass.states[t].state:"---"}get currentTemperature(){const t=this._config.entity_temperature,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.temperature?Number(this.hass.states[t].attributes.temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---"}get currentApparentTemperature(){const t=this._config.entity_apparent_temp,e=!0===this._config.option_show_overview_decimals?1:0;return t&&this.hass.states[t]?t&&this.hass.states[t]?null===t.match("^weather.")?Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.apparent_temperature?Number(this.hass.states[t].attributes.apparent_temperature).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---":"---":""}get currentHumidity(){const t=this._config.entity_humidity;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.humidity?Number(this.hass.states[t].attributes.humidity).toLocaleString(this.locale):"---":"---"}get currentRainfall(){const t=this._config.entity_rainfall,e=!0===this._config.option_today_rainfall_decimals?1:0;return t&&this.hass.states[t]?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):"---"}get currentPressure(){const t=this._config.entity_pressure;var e=this._config.option_pressure_decimals?Math.max(Math.min(this._config.option_pressure_decimals,3),0):0;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale,{minimumFractionDigits:e,maximumFractionDigits:e}):void 0!==this.hass.states[t].attributes.pressure?Number(this.hass.states[t].attributes.pressure).toLocaleString(this.locale):"---":"---"}get currentVisibility(){const t=this._config.entity_visibility;return t&&this.hass.states[t]?null===t.match("^weather.")?"unknown"===this.hass.states[t].state||"unavailable"===this.hass.states[t].state?"---":Number(this.hass.states[t].state).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.visibility?Number(this.hass.states[t].attributes.visibility).toLocaleString(this.locale):"---":"---"}get windBearingDegrees(){const t=this._config.entity_wind_bearing;if(!t||!this.hass.states[t])return null;const e=null===t.match("^weather.")?this.hass.states[t].state:this.hass.states[t].attributes.wind_bearing,i=Number(e);return null==e||""===e||isNaN(i)?null:i}_windIcon(t,e){const i=this.windBearingDegrees;return!0===e&&null!==i?U`<ha-icon icon="mdi:arrow-up" style="display:inline-block; transform: rotate(${(i+180)%360}deg);"></ha-icon>`:U`<ha-icon icon="${t}"></ha-icon>`}get currentWindBearing(){const t=this._config.entity_wind_bearing;return t&&this.hass.states[t]?null===t.match("^weather.")?isNaN(Number(this.hass.states[t].state))?this.hass.states[t].state:this.windDirections[Math.round(Number(this.hass.states[t].state)/360*16)]:void 0!==this.hass.states[t].attributes.wind_bearing?isNaN(Number(this.hass.states[t].attributes.wind_bearing))?this.hass.states[t].attributes.wind_bearing:this.windDirections[Math.round(Number(this.hass.states[t].attributes.wind_bearing)/360*16)]:"---":"---"}get currentWindSpeed(){const t=this._config.entity_wind_speed;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedUnit(){const t=this._config.entity_wind_speed;if(!t||!this.hass.states[t])return this.getUOM("length")+"/h";if(null!==t.match("^weather.")){const e=this.hass.states[t].attributes.wind_speed_unit;return void 0!==e?e:this.getUOM("length")+"/h"}return this.getUOM("length")+"/h"}get currentWindGust(){const t=this._config.entity_wind_gust;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_gust_speed?Math.round(Number(this.hass.states[t].attributes.wind_gust_speed)).toLocaleString(this.locale):"---":"---"}get currentWindSpeedKt(){const t=this._config.entity_wind_speed_kt;return t&&this.hass.states[t]?null===t.match("^weather.")?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):void 0!==this.hass.states[t].attributes.wind_speed?Math.round(Number(this.hass.states[t].attributes.wind_speed)).toLocaleString(this.locale):"---":"---"}get currentWindGustKt(){const t=this._config.entity_wind_gust_kt;return t&&this.hass.states[t]?Math.round(Number(this.hass.states[t].state)).toLocaleString(this.locale):"---"}get windDirections(){const t=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],e=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],i=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW","N"],s=["N","NNO","NO","ONO","O","OZO","ZO","ZZO","Z","ZZW","ZW","WZW","W","WNW","NW","NNW","N"],o=["צפון","צ-צ-מז","צפון מזרח","מז-צ-מז","מזרח","מז-ד-מז","דרום מזרח","ד-ד-מז","דרום","ד-ד-מע","דרום מערב","מע-ד-מע","מערב","מע-צ-מע","צפון מערב","צ-צ-מע","צפון"],n=["N","NNØ","NØ","ØNØ","Ø","ØSØ","SØ","SSØ","S","SSV","SV","VSV","V","VNV","NV","NNV","N"],a=["С","ССВ","СВ","ВСВ","В","ВЮВ","ЮВ","ЮЮВ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"],r=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSO","SO","OSO","O","ONO","NO","NNO","N"],l=["С","ССИ","СИ","ИСИ","И","ИЮИ","ЮИ","ЮЮИ","Ю","ЮЮЗ","ЮЗ","ЗЮЗ","З","ЗСЗ","СЗ","ССЗ","С"];switch(this.locale){case"it":case"fr":return e;case"de":return i;case"nl":return s;case"es":return r;case"he":return o;case"ru":return a;case"da":return n;case"bg":return l;default:return t}}get currentBeaufort(){const t=this._config.entity_wind_speed;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);switch(this.hass.states[t].attributes.unit_of_measurement){case"mph":return e>=73?"12":e>=64?"11":e>=55?"10":e>=47?"9":e>=39?"8":e>=32?"7":e>=25?"6":e>=19?"5":e>=13?"4":e>=8?"3":e>=4?"2":e>=1?"1":"0";case"m/s":return e>=32.7?"12":e>=28.5?"11":e>=24.5?"10":e>=20.8?"9":e>=17.2?"8":e>=13.9?"7":e>=10.8?"6":e>=8?"5":e>=5.5?"4":e>=3.4?"3":e>=1.6?"2":e>=.5?"1":"0";default:return e>=118?"12":e>=103?"11":e>=89?"10":e>=75?"9":e>=62?"8":e>=50?"7":e>=39?"6":e>=29?"5":e>=20?"4":e>=12?"3":e>=6?"2":e>=2?"1":"0"}}return"---"}get currentBeaufortKt(){const t=this._config.entity_wind_speed_kt;if(t&&this.hass.states[t]&&!isNaN(Number(this.hass.states[t].state))){const e=Number(this.hass.states[t].state);return e>=64?"12":e>=56?"11":e>=48?"10":e>=41?"9":e>=34?"8":e>=28?"7":e>=22?"6":e>=17?"5":e>=11?"4":e>=7?"3":e>=4?"2":e>=1?"1":"0"}return"---"}get sunSet(){var t,e,i;switch(this.timeFormat){case"12hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"numeric",minute:"2-digit",hour12:!0}).replace(" am","am").replace(" pm","pm"):"";break;case"24hour":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(this.locale,{hour:"2-digit",minute:"2-digit",hour12:!1}):"";break;case"system":e=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_setting).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):"",i=this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]?new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).toLocaleTimeString(navigator.language,{timeStyle:"short"}).replace(" am","am").replace(" pm","pm"):""}var s=new Date;if(s.setDate(s.getDate()+1),this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const o=null===(t=this.hass.states[this._config.entity_sun].attributes)||void 0===t?void 0:t.elevation;return(void 0!==o?o>0:"above_horizon"===this.hass.states[this._config.entity_sun].state)?(i=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,{next:U`
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
            </li>`,nextText:e,followingText:i,nextIcon:"mdi:weather-sunset-down",followingIcon:"mdi:weather-sunset-up"}):((new Date).getDate()!=new Date(this.hass.states[this._config.entity_sun].attributes.next_rising).getDate()&&(i=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+i,e=s.toLocaleDateString(this.locale,{weekday:"short"})+" "+e),{next:U`
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
            </li>`,nextText:i,followingText:e,nextIcon:"mdi:weather-sunset-up",followingIcon:"mdi:weather-sunset-down"})}return{next:U``,following:U``,nextText:"",followingText:"",nextIcon:"",followingIcon:""}}get timeFormat(){var t,e;if(this._config.option_time_format&&"system"!==this._config.option_time_format)return this._config.option_time_format;const i=null===(e=null===(t=this.hass)||void 0===t?void 0:t.locale)||void 0===e?void 0:e.time_format;return"12"===i?"12hour":"24"===i?"24hour":"system"}_formatDate(t){var e,i;const s=null===(i=null===(e=this.hass)||void 0===e?void 0:e.locale)||void 0===i?void 0:i.date_format,o=this.locale||navigator.language;switch(s){case"DMY":default:return t.toLocaleDateString(o,{weekday:"short",day:"numeric",month:"short",year:"numeric"}).replace(",","");case"MDY":return t.toLocaleDateString(o,{weekday:"short",month:"short",day:"numeric",year:"numeric"}).replace(",","");case"YMD":return t.toLocaleDateString(o,{weekday:"short",year:"numeric",month:"short",day:"numeric"}).replace(",","")}}_getIconUrl(t,e=!1){var i,s,o,n,a;const r=null!==(s=null===(i=this._config)||void 0===i?void 0:i.icon_pack)&&void 0!==s?s:"default",l=e?t.replace("-night","-day"):t;if("default"===r){const t=(null===(o=this._config)||void 0===o?void 0:o.option_static_icons)?"s-":"a-";return this._iconBaseUrl()+t+l+".svg"}const c=this._iconToWcc(l);if("wcc-2"===r)return`/hacsfiles/weather-chart-card/icons2/${c}.svg`;const _=this._iconToMeteocons(l);if("meteocons-fill"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${_}.svg`;if("meteocons-line"===r)return`https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/line/all/${_}.svg`;if("custom"===r&&(null===(n=this._config)||void 0===n?void 0:n.icon_pack_path))return this._config.icon_pack_path.replace("{condition}",c);const h=(null===(a=this._config)||void 0===a?void 0:a.option_static_icons)?"s-":"a-";return this._iconBaseUrl()+h+l+".svg"}_iconBaseUrl(){const t=import.meta.url.split("?")[0];return t.substring(0,t.lastIndexOf("/")+1)}_iconToWcc(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partlycloudy-day","cloudy-1-night":"partlycloudy-night","cloudy-2-day":"partlycloudy-day","cloudy-2-night":"partlycloudy-night",cloudy:"cloudy","haze-day":"fog","haze-night":"fog","frost-day":"snow","frost-night":"snow","rainy-2":"rain",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"exceptional","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"lightning-rain","scattered-thunderstorms-night":"lightning-rain","rainy-3":"pouring","tropical-storm":"exceptional","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"lightning","isolated-thunderstorms-night":"lightning",unknown:"exceptional"}[t])&&void 0!==e?e:"exceptional"}_iconToMeteocons(t){var e;return null!==(e={"clear-day":"clear-day","clear-night":"clear-night","cloudy-1-day":"partly-cloudy-day","cloudy-1-night":"partly-cloudy-night","cloudy-2-day":"partly-cloudy-day","cloudy-2-night":"partly-cloudy-night",cloudy:"cloudy","haze-day":"haze","haze-night":"haze","frost-day":"snow","frost-night":"snow","rainy-2":"drizzle",wind:"wind","fog-day":"fog","fog-night":"fog","rainy-1-day":"rain","rainy-1-night":"rain","rainy-3-day":"rain","rainy-3-night":"rain",dust:"dust-wind","snowy-3":"snow","snow-and-sleet-mix":"sleet","scattered-thunderstorms-day":"thunderstorms-rain","scattered-thunderstorms-night":"thunderstorms-rain","rainy-3":"rain","tropical-storm":"tornado","rain-and-sleet-mix":"sleet",hail:"hail","isolated-thunderstorms-day":"thunderstorms","isolated-thunderstorms-night":"thunderstorms",unknown:"not-available"}[t])&&void 0!==e?e:"not-available"}_weatherIcon(t){switch(t){case"sunny":case"clear":return this.iconClear;case"mostly-sunny":case"mostly_sunny":return this.iconMostlySunny;case"partly-cloudy":case"partly_cloudy":case"partlycloudy":return this.iconPartlyCloudy;case"cloudy":return this.iconCloudy;case"hazy":case"hazey":case"haze":return this.iconHazy;case"frost":return this.iconFrost;case"light-rain":case"light_rain":return this.iconLightRain;case"wind":case"windy":return this.iconWindy;case"fog":case"foggy":return this.iconFog;case"showers":case"shower":return this.iconShowers;case"rain":case"rainy":return this.iconRain;case"dust":case"dusty":return this.iconDust;case"snow":case"snowy":return this.iconSnow;case"snowy-rainy":case"snowy_rainy":case"snowyrainy":return this.iconSnowRain;case"storm":case"stormy":return this.iconStorm;case"light-showers":case"light-shower":case"light_showers":case"light_shower":return this.iconLightShowers;case"heavy-showers":case"heavy-shower":case"heavy_showers":case"heavy_shower":case"pouring":return this.iconHeavyShowers;case"tropical-cyclone":case"tropical_cyclone":case"tropicalcyclone":return this.iconCyclone;case"clear-day":case"clear_day":return this.iconClearDay;case"clear-night":case"clear_night":return this.iconClearNight;case"sleet":return this.iconSleet;case"partly-cloudy-day":case"partly_cloudy_day":return this.iconPartlyCloudyDay;case"partly-cloudy-night":case"partly_cloudy_night":return this.iconPartlyCloudyNight;case"hail":return this.iconHail;case"lightning":case"lightning-rainy":case"lightning_rainy":case"thunderstorm":return this.iconLightning;case"windy-variant":case"windy_variant":return this.iconWindyVariant}return"unknown"}get dayOrNight(){var t;if(this._config.entity_sun&&void 0!==this.hass.states[this._config.entity_sun]){const e=this.hass.states[this._config.entity_sun];return void 0!==(null===(t=e.attributes)||void 0===t?void 0:t.elevation)?e.attributes.elevation>0?"day":"night":"above_horizon"===e.state?"day":"night"}return"day"}get iconClear(){return`clear-${this.dayOrNight}`}get iconMostlySunny(){return`cloudy-1-${this.dayOrNight}`}get iconPartlyCloudy(){return`cloudy-2-${this.dayOrNight}`}get iconCloudy(){return"cloudy"}get iconHazy(){return`haze-${this.dayOrNight}`}get iconFrost(){return`frost-${this.dayOrNight}`}get iconLightRain(){return"rainy-2"}get iconWindy(){return"wind"}get iconFog(){return`fog-${this.dayOrNight}`}get iconShowers(){return`rainy-1-${this.dayOrNight}`}get iconRain(){return`rainy-3-${this.dayOrNight}`}get iconDust(){return"dust"}get iconSnow(){return"snowy-3"}get iconSnowRain(){return"snow-and-sleet-mix"}get iconStorm(){return`scattered-thunderstorms-${this.dayOrNight}`}get iconLightShowers(){return`rainy-1-${this.dayOrNight}`}get iconHeavyShowers(){return"rainy-3"}get iconCyclone(){return"tropical-storm"}get iconClearDay(){return"clear-day"}get iconClearNight(){return"clear-night"}get iconSleet(){return"rain-and-sleet-mix"}get iconPartlyCloudyDay(){return"cloudy-1-day"}get iconPartlyCloudyNight(){return"cloudy-1-night"}get iconHail(){return"hail"}get iconLightning(){return`isolated-thunderstorms-${this.dayOrNight}`}get iconWindyVariant(){return"wind"}get compact(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)}get locale(){try{return Intl.NumberFormat(this._config.option_locale),this._config.option_locale}catch(t){return}}get localeTextFeelsLike(){switch(this.locale){case"it":return"Percepito";case"fr":return"Ressenti";case"de":return"Gefühlt";case"nl":return"Voelt als";case"pl":return"Odczuwalne";case"he":return"מרגיש כמו";case"da":return"Føles som";case"ru":return"Ощущается как";case"es":return"Sensación";case"ua":return"Відчувається як";case"bg":return"Усеща се като";default:return"Feels like"}}get localeTextObservedMax(){if(this.compact)return this.localeTextObsMax;switch(this.locale){case"it":return"Osservata Max";case"fr":return"Observé Max";case"de":return"Beobachtet Max";case"nl":return"Opgemerkt Max";case"pl":return"Zaobserwowany Max";case"he":return"נצפה מקסימום";case"da":return"Observeret Max";case"ru":return"Наблюдаемый макс.";case"es":return"Observado Max";case"ua":return"Спостережуваний макс.";case"bg":return"Наблюдавано макс.";default:return"Observed Max"}}get localeTextObservedMin(){if(this.compact)return this.localeTextObsMin;switch(this.locale){case"it":return"Osservata Min";case"fr":return"Observé Min";case"de":return"Beobachtet Min";case"nl":return"Opgemerkt Min";case"pl":return"Zaobserwowany Min";case"he":return"נצפה מינימום";case"da":return"Observeret Min";case"ru":return"Наблюдаемый мин.";case"es":return"Observado Min";case"ua":return"Спостережуваний мін.";case"bg":return"Наблюдавано мин.";default:return"Observed Min"}}get localeTextObsMax(){switch(this.locale){case"it":return"Oss Max";case"fr":case"pl":case"da":case"es":default:return"Obs Max";case"de":return"Beob Max";case"nl":return"Opgem Max";case"he":return"נצפה מקס";case"ru":return"Набл макс.";case"ua":return"Спост макс.";case"bg":return"Набл. макс."}}get localeTextObsMin(){switch(this.locale){case"it":return"Oss Min";case"fr":case"pl":case"da":case"es":default:return"Obs Min";case"de":return"Beob Min";case"nl":return"Opgem Min";case"he":return"נצפה מינ";case"ru":return"Набл мин.";case"ua":return"Спост мін.";case"bg":return"Набл. мин."}}get localeTextForecastMax(){if(this.compact)switch(this.locale){case"ru":case"ua":case"bg":return"Макс";case"he":return"מקס";default:return"Max"}switch(this.locale){case"it":return"Max oggi";case"fr":return"Max aujourd'hui";case"de":return"Max heute";case"nl":return"Max vandaag";case"pl":return"Maks Temperatura";case"he":return"מקסימלי היום";case"da":return"Højeste i dag";case"ru":return"Макс сегодня";case"es":return"Máx hoy";case"ua":return"Макс сьогодні";case"bg":return"Макс днес";default:return"Forecast Max"}}get localeTextForecastMin(){if(this.compact)switch(this.locale){case"ru":case"bg":return"Мин";case"ua":return"Мін";case"he":return"מינ";default:return"Min"}switch(this.locale){case"it":return"Min oggi";case"fr":return"Min aujourd'hui";case"de":return"Min heute";case"nl":return"Min vandaag";case"pl":return"Min Temperatura";case"he":return"דקות היום";case"da":return"Laveste i dag";case"ru":return"Мин сегодня";case"es":return"Mín hoy";case"ua":return"Мін сьогодні";case"bg":return"Мин днес";default:return"Forecast Min"}}get localeTextPosToday(){if(this.compact)return"";switch(this.locale){case"it":return"Previsione";case"fr":return"Prévoir";case"de":return"Vorhersage";case"nl":return"Prognose";case"pl":return"Prognoza";case"he":return"תַחֲזִית";case"da":return"Vejrudsigt";case"ru":case"ua":return"Прогноз";case"es":return"Previsión";case"bg":return"Прогноза";default:return"Forecast"}}get localeTextPosTomorrow(){if(this.compact)switch(this.locale){case"ru":case"ua":return"Завтра";case"bg":return"Утре";case"he":return"מחר";case"de":case"nl":case"da":return"Morgen";case"pl":return"Jutro";case"it":return"Dom";case"fr":return"Dem";case"es":return"Mañ";default:return"Tom"}switch(this.locale){case"it":return"Prev per domani";case"fr":return"Prév demain";case"de":case"nl":return"Prog morgen";case"pl":return"Prog jutro";case"he":return"תחזית מחר";case"da":return"Prog i morgen";case"ru":case"ua":return"Прогноз на завтра";case"es":return"Prev mañana";case"bg":return"Прогноза за утре";default:return"Fore Tom"}}get localeTextFore(){switch(this.locale){case"it":case"es":return"Prev";case"fr":return"Prév";case"de":case"nl":case"pl":case"da":return"Prog";case"he":return"תַחֲזִית";case"ru":case"ua":return"Прогноз";case"bg":return"Прогноза";default:return"Fore"}}get localeTextUVRating(){switch(this.locale){case"it":case"fr":case"de":case"nl":case"pl":case"he":case"da":case"es":case"bg":default:return"UV";case"ru":case"ua":return"УФ"}}get localeTextFireDanger(){switch(this.locale){case"it":return"Fuoco";case"fr":return"Feu";case"de":return"Feuer";case"nl":case"da":return"Brand";case"pl":return"Ogień";case"he":return"אֵשׁ";case"ru":return"Огонь";case"es":return"Fuego";case"ua":return"Вогонь";case"bg":return"Пожар";default:return"Fire"}}get localeTextGust(){switch(this.locale){case"it":return"Raffica";case"fr":return"Rafale";case"de":return"Böe";case"nl":return"Windstoot";case"pl":return"Poryw";case"he":return"נשיבה";case"da":return"Vindstød";case"ru":return"Порыв";case"es":return"Ráfaga";case"ua":return"Порив";case"bg":return"Пориви";default:return"Gust"}}getUOM(t){const e=this.hass.config.unit_system.length;switch(t){case"air_pressure":const i=this._config.entity_pressure;return i&&this.hass.states[i]?null===i.match("^weather.")?void 0!==this.hass.states[i].attributes.unit_of_measurement?this.hass.states[i].attributes.unit_of_measurement:"km"===e?"hPa":"mbar":void 0!==this.hass.states[i].attributes.pressure_unit?this.hass.states[i].attributes.pressure_unit:"--":"--";case"length":return e;case"precipitation":return"km"===e?"mm":"in";case"intensity":return"km"===e?"mm/h":"in/h";default:return this.hass.config.unit_system[t]||""}}_showConfigWarning(t){return U`
      <hui-warning>
        <div>Weather Card</div>
        ${t.map(t=>U`<div>${t}</div>`)}
      </hui-warning>
    `}_showWarning(t){return U`<hui-warning>${t}</hui-warning>`}_showError(t){const e=document.createElement("hui-error-card");return e.setConfig({type:"error",error:t,origConfig:this._config}),U`${e}`}get styles(){const t=this._config.option_tooltips?"visible":"hidden",e=this._config.temp_font_weight||"300",i=this._config.temp_font_size||"4em",s=this._config.forecast_text_font_size||"21px",o=this._config.forecast_text_alignment||"center";return r`
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
        visibility: ${a(t)};
      }
      .fcasttooltiptext {
        padding-left: 8px;
        padding-right: 8px;
        color: #ffffff;
      }
    `}};t([_t()],St.prototype,"_subscribed",void 0),t([_t()],St.prototype,"_forecastEvent",void 0),t([ct({attribute:!1})],St.prototype,"hass",void 0),t([_t()],St.prototype,"_config",void 0),t([_t()],St.prototype,"_cardWidth",void 0),St=t([rt("platinum-weather-card-plus-charts")],St);var Ct="M11 20V22H3C1.9 22 1 21.1 1 20V4C1 2.9 1.9 2 3 2H21C22.1 2 23 2.9 23 4V12.1L22.8 11.9C22.3 11.4 21.7 11.1 21 11.1V6H3V20H11M21.4 13.3L22.7 14.6C22.9 14.8 22.9 15.2 22.7 15.4L21.7 16.4L19.6 14.3L20.6 13.3C20.7 13.2 20.8 13.1 21 13.1C21.2 13.1 21.3 13.2 21.4 13.3M21.1 16.9L15.1 23H13V20.9L19.1 14.8L21.1 16.9Z",Et="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z",Nt="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",Dt="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z",Ot="M18 1C15.24 1 13 3.24 13 6V8H4C2.9 8 2 8.89 2 10V20C2 21.11 2.9 22 4 22H16C17.11 22 18 21.11 18 20V10C18 8.9 17.11 8 16 8H15V6C15 4.34 16.34 3 18 3C19.66 3 21 4.34 21 6V8H23V6C23 3.24 20.76 1 18 1M10 13C11.1 13 12 13.89 12 15C12 16.11 11.11 17 10 17C8.9 17 8 16.11 8 15C8 13.9 8.9 13 10 13Z",Ft="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";const Vt=["overview","extended","slots","daily_forecast","charts"];let Tt=class extends nt{constructor(){super(...arguments),this._subElementEditor=void 0,this._initialized=!1,this._config_version=8}setConfig(t){this._config=t;let e=!1;null===this._section_order?(this._config=Object.assign(Object.assign({},this._config),{section_order:Vt}),e=!0):(this._config.section_order.forEach(t=>{var i,s;if(!Vt.includes(t)){const o=null===(i=this._config)||void 0===i?void 0:i.section_order.indexOf(t);void 0!==o&&-1!==o&&(null===(s=this._config)||void 0===s||s.section_order.splice(o,1)),e=!0}}),Vt.forEach(t=>{this._config&&!this._config.section_order.includes(t)&&(this._config.section_order.push(t),e=!0)})),e&&vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}),this.loadCardHelpers()}sortObjectByKeys(t){return Object.keys(t).sort().reduce((e,i)=>(e[i]=t[i],e),{})}_configCleanup(){if(!this._config||!this.hass)return;let t=Object.assign({},this._config);t.static_icons&&(t.option_static_icons=t.static_icons,delete t.static_icons),t.time_format&&(t.option_time_format="12"===t.time_format?"12hour":"24hour",delete t.time_format),t.locale&&(t.option_locale=t.locale,delete t.locale),t.option_today_temperature_decimals&&(t.option_today_temperature_decimals=t.show_today_decimals,delete t.show_today_decimals),t.show_decimals_pressure&&(t.option_pressure_decimals=t.show_decimals_pressure,delete t.show_decimals_pressure),t.tooltips&&(t.option_tooltips=t.tooltips,delete t.tooltips),t.show_beaufort&&(t.option_show_beaufort=t.show_beaufort,delete t.show_beaufort),t.entity_daytime_high&&(t.Entity_forecast_max=t.entity_daytime_high,delete t.entity_daytime_high),t.entity_daytime_low&&(t.entity_forecast_min=t.entity_daytime_low,delete t.entity_daytime_low),t.entity_current_conditions&&(t.entity_forecast_icon=t.entity_current_conditions,delete t.entity_current_conditions),t.entity_current_text&&(t.entity_summary=t.entity_current_text,delete t.entity_current_text),t.entity_daily_summary&&(t.entity_extended=t.entity_daily_summary,delete t.entity_daily_summary),t.entity_forecast_high_temp_1&&(t.entity_forecast_max_1=t.entity_forecast_high_temp_1,delete t.entity_forecast_high_temp_1),t.entity_forecast_low_temp_1&&(t.entity_forecast_min_1=t.entity_forecast_low_temp_1,delete t.entity_forecast_low_temp_1),t.entity_possible_today&&(t.entity_pos=t.entity_possible_today,delete t.entity_possible_today),t.entity_fire_danger_summary&&(t.entity_fire_danger=t.entity_fire_danger_summary,delete t.entity_fire_danger_summary),t.show_decimals&&(t.option_show_overview_decimals=t.show_decimals,delete t.show_decimals),t.show_separator&&(t.option_show_overview_separator=t.show_separator,delete t.show_separator);for(const e of["slot_l1, slot_l2, slot_l3, slot_l4, slot_l5, slot_l6, slot_l7, slot_l8, slot_r1, slot_r2, slot_r3, slot_r4, slot_r5, slot_r6, slot_r7, slot_r8"])"daytime_high"===t[e]&&(t[e]="forecast_max"),"daytime_low"===t[e]&&(t[e]="forecast_min");const e=["type","card_config_version","section_order","show_section_overview","show_section_extended","show_section_slots","show_section_daily_forecast","overview_layout","text_card_title","text_card_title_2","entity_update_time","update_time_use_attr","update_time_name_attr","text_update_time_prefix","entity_temperature","entity_apparent_temp","entity_forecast_icon","entity_summary","option_show_overview_decimals","option_show_overview_separator","entity_extended","extended_use_attr","extended_name_attr","slot_l1","slot_l2","slot_l3","slot_l4","slot_l5","slot_l6","slot_l7","slot_l8","slot_r1","slot_r2","slot_r3","slot_r4","slot_r5","slot_r6","slot_r7","slot_r8","entity_humidity","entity_pressure","entity_visibility","entity_wind_bearing","entity_wind_speed","entity_wind_gust","entity_wind_speed_kt","entity_wind_gust_kt","entity_temp_next","entity_temp_next_label","entity_temp_following","entity_temp_following_label","entity_forecast_max","entity_forecast_min","entity_observed_max","entity_observed_min","entity_fire_danger","entity_pop","entity_pos","entity_sun","entity_moon","entity_uv_alert_summary","entity_rainfall","entity_todays_fire_danger","entity_todays_uv_forecast","custom1_label","custom1_value","custom1_icon","custom1_units","custom2_label","custom2_value","custom2_icon","custom2_units","custom3_label","custom3_value","custom3_icon","custom3_units","custom4_label","custom4_value","custom4_icon","custom4_units","entity_forecast_icon_1","entity_pop_1","entity_pos_1","entity_summary_1","entity_forecast_min_1","entity_forecast_max_1","entity_extended_1","entity_fire_danger_1","daily_forecast_layout","daily_forecast_days","daily_extended_forecast_days","daily_extended_use_attr","daily_extended_name_attr","summary_1_use_attr","summary_1_name_attr","option_compact_slots","option_wind_bearing_icon","option_gust_bearing_icon","option_today_temperature_decimals","option_today_rainfall_decimals","option_forecast_decimals","option_show_current_day","option_show_temperature_chart","option_show_precipitation_chart","icon_pack","icon_pack_path","option_show_gust_in_wind","option_show_forecast_wind","option_show_forecast_pop","option_pressure_decimals","option_color_fire_danger","option_locale","option_static_icons","option_time_format","option_tooltips","old_daily_format","option_show_beaufort","weather_entity","tempformat","entity","tap_action","hold_action","double_tap_action","entity_possible_tomorrow","style","index","view_index"];for(const i in this._config)e.includes(i)||delete t[i];t=Object.assign(Object.assign({},t),{card_config_version:this._config_version}),this._config=t,vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}shouldUpdate(){return this._initialized||this._initialize(),!0}get _section_order(){var t;return(null===(t=this._config)||void 0===t?void 0:t.section_order)||null}get _text_card_title(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title)||""}get _text_card_title_2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_card_title_2)||""}get _entity_update_time(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_update_time)||""}get _update_time_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.update_time_use_attr)}get _update_time_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.update_time_name_attr)||""}get _text_update_time_prefix(){var t;return(null===(t=this._config)||void 0===t?void 0:t.text_update_time_prefix)||""}get _overview_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.overview_layout)||""}get _entity_temperature(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temperature)||""}get _entity_apparent_temp(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_apparent_temp)||""}get _entity_forecast_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon)||""}get _entity_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary)||""}get _option_show_overview_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_decimals)}get _option_show_overview_separator(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_overview_separator)}get _entity_extended(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended)||""}get _extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.extended_use_attr)}get _extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.extended_name_attr)||""}get _entity_todays_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_fire_danger)||""}get _entity_todays_uv_forecast(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_todays_uv_forecast)||""}get _slot_l1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||""}get _slot_l2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l2)||""}get _slot_l3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l3)||""}get _slot_l4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l4)||""}get _slot_l5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l5)||""}get _slot_l6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l6)||""}get _slot_l7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l7)||""}get _slot_l8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_l8)||""}get _slot_r1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r1)||""}get _slot_r2(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r2)||""}get _slot_r3(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r3)||""}get _slot_r4(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r4)||""}get _slot_r5(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r5)||""}get _slot_r6(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r6)||""}get _slot_r7(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r7)||""}get _slot_r8(){var t;return(null===(t=this._config)||void 0===t?void 0:t.slot_r8)||""}get _entity_observed_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_max)||""}get _entity_observed_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_observed_min)||""}get _entity_forecast_max(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max)||""}get _entity_forecast_min(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min)||""}get _entity_temp_next(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next)||""}get _entity_temp_next_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_next_label)||""}get _entity_temp_following(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following)||""}get _entity_temp_following_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_temp_following_label)||""}get _entity_wind_bearing(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_bearing)||""}get _entity_wind_speed(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed)||""}get _entity_wind_gust(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust)||""}get _entity_wind_speed_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_speed_kt)||""}get _entity_wind_gust_kt(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_wind_gust_kt)||""}get _entity_visibility(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_visibility)||""}get _entity_sun(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_sun)||""}get _entity_moon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_moon)||""}get _entity_pop(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop)||""}get _entity_pos(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos)||""}get _entity_possible_tomorrow(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_possible_tomorrow)||""}get _entity_humidity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_humidity)||""}get _entity_pressure(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pressure)||""}get _entity_uv_alert_summary(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_uv_alert_summary)||""}get _entity_fire_danger(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger)||""}get _entity_rainfall(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_rainfall)||""}get _custom1_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_value)||""}get _custom1_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_icon)||""}get _custom1_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_label)||""}get _custom1_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom1_units)||""}get _custom2_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_value)||""}get _custom2_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_icon)||""}get _custom2_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_label)||""}get _custom2_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom2_units)||""}get _custom3_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_value)||""}get _custom3_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_icon)||""}get _custom3_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_label)||""}get _custom3_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom3_units)||""}get _custom4_value(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_value)||""}get _custom4_icon(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_icon)||""}get _custom4_label(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_label)||""}get _custom4_units(){var t;return(null===(t=this._config)||void 0===t?void 0:t.custom4_units)||""}get _daily_forecast_layout(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_layout)||""}get _daily_forecast_days(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_forecast_days)||null}get _daily_extended_forecast_days(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.daily_extended_forecast_days)&&void 0!==e?e:null}get _entity_forecast_icon_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_icon_1)||""}get _weather_entity(){var t;return(null===(t=this._config)||void 0===t?void 0:t.weather_entity)||""}get _forecast_type(){var t;return(null===(t=this._config)||void 0===t?void 0:t.forecast_type)||""}get _entity_summary_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_summary_1)||""}get _entity_forecast_min_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_min_1)||""}get _entity_forecast_max_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_forecast_max_1)||""}get _entity_pop_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pop_1)||""}get _entity_pos_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_pos_1)||""}get _entity_extended_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_extended_1)||""}get _entity_fire_danger_1(){var t;return(null===(t=this._config)||void 0===t?void 0:t.entity_fire_danger_1)||""}get _daily_extended_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.daily_extended_use_attr)}get _daily_extended_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.daily_extended_name_attr)||""}get _tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.tap_action}get _hold_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.hold_action}get _double_tap_action(){var t;return null===(t=this._config)||void 0===t?void 0:t.double_tap_action}get _summary_1_use_attr(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.summary_1_use_attr)}get _summary_1_name_attr(){var t;return(null===(t=this._config)||void 0===t?void 0:t.summary_1_name_attr)||""}get _option_today_temperature_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_temperature_decimals)}get _option_today_rainfall_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_today_rainfall_decimals)}get _option_forecast_decimals(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_forecast_decimals)}get _option_show_gust_in_wind(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_gust_in_wind)}get _icon_pack(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack)||"default"}get _icon_pack_path(){var t;return(null===(t=this._config)||void 0===t?void 0:t.icon_pack_path)||""}get _option_show_forecast_wind(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_wind)}get _option_show_forecast_pop(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_show_forecast_pop)}get _option_show_current_day(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_current_day)}get _option_show_temperature_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_temperature_chart)}get _option_show_precipitation_chart(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_show_precipitation_chart)}get _option_pressure_decimals(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_pressure_decimals)||null}get _option_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_color_fire_danger)}get _option_daily_color_fire_danger(){var t;return!1!==(null===(t=this._config)||void 0===t?void 0:t.option_daily_color_fire_danger)}get _option_tooltips(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_tooltips)}get _option_static_icons(){var t;return!0===(null===(t=this._config)||void 0===t?void 0:t.option_static_icons)}get _option_time_format(){var t,e;return null!==(e=null===(t=this._config)||void 0===t?void 0:t.option_time_format)&&void 0!==e?e:null}get _option_locale(){var t;return(null===(t=this._config)||void 0===t?void 0:t.option_locale)||""}get _optional_entities(){var t,e,i,s,o,n,a,r,l,c,_,h,d,u,g,v;const p=new Set;for(const m of[(null===(t=this._config)||void 0===t?void 0:t.slot_l1)||"forecast_max",(null===(e=this._config)||void 0===e?void 0:e.slot_l2)||"forecast_min",(null===(i=this._config)||void 0===i?void 0:i.slot_l3)||"wind",(null===(s=this._config)||void 0===s?void 0:s.slot_l4)||"pressure",(null===(o=this._config)||void 0===o?void 0:o.slot_l5)||"sun_next",(null===(n=this._config)||void 0===n?void 0:n.slot_l6)||"remove",(null===(a=this._config)||void 0===a?void 0:a.slot_l7)||"remove",(null===(r=this._config)||void 0===r?void 0:r.slot_l8)||"remove",(null===(l=this._config)||void 0===l?void 0:l.slot_r1)||"popforecast",(null===(c=this._config)||void 0===c?void 0:c.slot_r2)||"humidity",(null===(_=this._config)||void 0===_?void 0:_.slot_r3)||"uv_summary",(null===(h=this._config)||void 0===h?void 0:h.slot_r4)||"fire_danger",(null===(d=this._config)||void 0===d?void 0:d.slot_r5)||"sun_following",(null===(u=this._config)||void 0===u?void 0:u.slot_r6)||"remove",(null===(g=this._config)||void 0===g?void 0:g.slot_r7)||"remove",(null===(v=this._config)||void 0===v?void 0:v.slot_r8)||"remove"])switch(m){case"observed_max":p.add("entity_observed_max");break;case"observed_min":p.add("entity_observed_min");break;case"forecast_max":p.add("entity_forecast_max");break;case"forecast_min":p.add("entity_forecast_min");break;case"temp_next":p.add("entity_temp_next").add("entity_temp_next_label");break;case"temp_following":p.add("entity_temp_following").add("entity_temp_following_label");break;case"temp_maximums":p.add("entity_forecast_max").add("entity_observed_max");break;case"temp_minimums":p.add("entity_forecast_min").add("entity_observed_min");break;case"wind":p.add("entity_wind_bearing").add("entity_wind_speed").add("entity_wind_gust");break;case"wind_kt":p.add("entity_wind_bearing").add("entity_wind_speed_kt").add("entity_wind_gust_kt");break;case"visibility":p.add("entity_visibility");break;case"sun_next":case"sun_following":p.add("entity_sun");break;case"moon":p.add("entity_moon");break;case"pop":p.add("entity_pop");break;case"popforecast":p.add("entity_pop").add("entity_pos");break;case"humidity":p.add("entity_humidity");break;case"pressure":p.add("entity_pressure");break;case"uv_summary":p.add("entity_uv_alert_summary");break;case"fire_danger":p.add("entity_fire_danger");break;case"possible_today":p.add("entity_pos");break;case"possible_tomorrow":p.add("entity_possible_tomorrow");break;case"rainfall":p.add("entity_rainfall");break;case"custom1":p.add("custom1");break;case"custom2":p.add("custom2");break;case"custom3":p.add("custom3");break;case"custom4":p.add("custom4")}const m=p.has("entity_observed_max")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_max"} .value=${this._entity_observed_max} .includeDomains=${["sensor"]}
          name="entity_observed_max" label=${this._t("entity_observed_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",f=p.has("entity_observed_min")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_observed_min"} .value=${this._entity_observed_min} .includeDomains=${["sensor"]}
          name="entity_observed_min" label=${this._t("entity_observed_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",y=p.has("entity_forecast_max")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_max"} .value=${this._entity_forecast_max} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_max" label=${this._t("entity_forecast_max")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",b=p.has("entity_forecast_min")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_forecast_min"} .value=${this._entity_forecast_min} .includeDomains=${["sensor","weather"]}
          name="entity_forecast_min" label=${this._t("entity_forecast_min")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",$=p.has("entity_temp_next")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next"} .value=${this._entity_temp_next} .includeDomains=${["sensor"]}
          name="entity_temp_next" label=${this._t("entity_temp_next")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",w=p.has("entity_temp_next_label")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_next_label"} .value=${this._entity_temp_next_label} .includeDomains=${["sensor"]}
          name="entity_temp_next_label" label=${this._t("entity_temp_next_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",x=p.has("entity_temp_following")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following"} .value=${this._entity_temp_following} .includeDomains=${["sensor"]}
          name="entity_temp_following" label=${this._t("entity_temp_following")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",k=p.has("entity_temp_following_label")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_temp_following_label"} .value=${this._entity_temp_following_label} .includeDomains=${["sensor"]}
          name="entity_temp_following_label" label=${this._t("entity_temp_fol_label")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",S=p.has("entity_wind_bearing")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_bearing"} .value=${this._entity_wind_bearing} .includeDomains=${["sensor","weather"]}
          name="entity_wind_bearing" label=${this._t("entity_wind_bearing")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",C=p.has("entity_wind_speed")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed"} .value=${this._entity_wind_speed} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed" label=${this._t("entity_wind_speed")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",E=p.has("entity_wind_gust")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust"} .value=${this._entity_wind_gust} .includeDomains=${["sensor","weather"]}
          name="entity_wind_gust" label=${this._t("entity_wind_gust")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",N=p.has("entity_wind_speed_kt")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_speed_kt"} .value=${this._entity_wind_speed_kt} .includeDomains=${["sensor","weather"]}
          name="entity_wind_speed_kt" label=${this._t("entity_wind_speed_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",D=p.has("entity_wind_gust_kt")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_wind_gust_kt"} .value=${this._entity_wind_gust_kt} .includeDomains=${["sensor"]}
          name="entity_wind_gust_kt" label=${this._t("entity_wind_gust_kt")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",O=p.has("entity_visibility")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_visibility"} .value=${this._entity_visibility} .includeDomains=${["sensor","weather"]}
          name="entity_visibility" label=${this._t("entity_visibility")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",F=p.has("entity_sun")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_sun"} .value=${this._entity_sun} .includeDomains=${["sun","sensor"]}
          name="entity_sun" label=${this._t("entity_sun")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",V=p.has("entity_moon")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_moon"} .value=${this._entity_moon} .includeDomains=${["sensor"]}
          name="entity_moon" label=${this._t("entity_moon")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",T=p.has("entity_pop")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pop"} .value=${this._entity_pop} .includeDomains=${["sensor","weather"]}
          name="entity_pop" label=${this._t("entity_pop")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",M=p.has("entity_pos")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pos"} .value=${this._entity_pos} .includeDomains=${["sensor","weather"]}
          name="entity_pos" label=${this._t("entity_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",A=p.has("entity_possible_tomorrow")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_possible_tomorrow"} .value=${this._entity_possible_tomorrow} .includeDomains=${["sensor","weather"]}
          name="entity_possible_tomorrow" label=${this._t("entity_2day_pos")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",P=p.has("entity_humidity")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_humidity"} .value=${this._entity_humidity} .includeDomains=${["sensor","weather"]}
          name="entity_humidity" label=${this._t("entity_humidity")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",L=p.has("entity_pressure")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_pressure"} .value=${this._entity_pressure} .includeDomains=${["sensor","weather"]}
          name="entity_pressure" label=${this._t("entity_pressure")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",W=p.has("entity_uv_alert_summary")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_uv_alert_summary"} .value=${this._entity_uv_alert_summary} .includeDomains=${["sensor"]}
          name="entity_uv_alert_summary" label=${this._t("entity_uv_summary")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",z=p.has("entity_fire_danger")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_fire_danger"} .value=${this._entity_fire_danger} .includeDomains=${["sensor"]}
          name="entity_fire_danger" label=${this._t("entity_fire_danger")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",R=p.has("entity_rainfall")?U`
        <ha-entity-picker .hass=${this.hass} .configValue=${"entity_rainfall"} .value=${this._entity_rainfall} .includeDomains=${["sensor"]}
          name="entity_rainfall" label=${this._t("entity_rainfall")} allow-custom-entity @value-changed=${this._valueChangedPicker}>
        </ha-entity-picker>
      `:"",H=p.has("custom1")?U`
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
      `:"",j=p.has("custom2")?U`
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
      `:"",I=p.has("custom3")?U`
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
      `:"",B=p.has("custom4")?U`
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
      ${m}
      ${f}
      ${y}
      ${b}
      ${$}
      ${w}
      ${x}
      ${k}
      ${S}
      ${C}
      ${E}
      ${N}
      ${D}
      ${O}
      ${F}
      ${V}
      ${T}
      ${M}
      ${A}
      ${P}
      ${L}
      ${W}
      ${z}
      ${R}
      ${H}
      ${j}
      ${I}
      ${B}`}get _show_warning(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_warning)||!1}get _show_error(){var t;return(null===(t=this._config)||void 0===t?void 0:t.show_error)||!1}async firstUpdated(){var t;this._config&&this.hass&&this._config.card_config_version!==this._config_version&&this._configCleanup(),customElements.get("ha-switch")&&(customElements.get("ha-input")||customElements.get("ha-textfield"))&&customElements.get("ha-entity-picker")||null===(t=customElements.get("hui-entities-card"))||void 0===t||t.getConfigElement()}_sectionOverviewEditor(){return U`
      <ha-entity-picker .hass=${this.hass} .configValue=${"entity_update_time"} .value=${this._entity_update_time} .includeDomains=${["sensor"]}
        name="entity_update_time" label=${this._t("entity_update_time")} allow-custom-entity
        @value-changed=${this._valueChangedPicker}>
      </ha-entity-picker>
      ${""!==this._entity_update_time?U`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._update_time_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._update_time_use_attr?Ot:Dt} .value=${"update_time_use_attr"} .checked=${!1!==this._update_time_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
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
              <ha-icon-button class=${!1!==this._option_show_overview_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_overview_decimals?Ot:Dt} .value=${"option_show_overview_decimals"} .checked=${!1!==this._option_show_overview_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_temp_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_overview_separator?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_overview_separator?Ot:Dt} .value=${"option_show_overview_separator"} .checked=${!1!==this._option_show_overview_separator} @click=${this._toggleVisibility}></ha-icon-button>
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
              <ha-icon-button class=${!1!==this._extended_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._extended_use_attr?Ot:Dt} .value=${"extended_use_attr"} .checked=${!1!==this._extended_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
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
    `}_optionSlotsEditor(){var t,e,i,s,o,n;return U`
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_today_temperature_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_today_temperature_decimals?Ot:Dt} .value=${"option_today_temperature_decimals"} .checked=${!1!==this._option_today_temperature_decimals} @click=${this._toggleVisibility}></ha-icon-button>
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
              <ha-icon-button class=${!1!==this._option_today_rainfall_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_today_rainfall_decimals?Ot:Dt} .value=${"option_today_rainfall_decimals"} .checked=${!1!==this._option_today_rainfall_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("today_rain_decimals")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_forecast_decimals?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_forecast_decimals?Ot:Dt} .value=${"option_forecast_decimals"} .checked=${!1!==this._option_forecast_decimals} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_temp_decimals")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_forecast_pop?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_forecast_pop?Ot:Dt} .value=${"option_show_forecast_pop"} .checked=${!1!==this._option_show_forecast_pop} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_pop")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!0===this._option_show_forecast_wind?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_forecast_wind?Ot:Dt} .value=${"option_show_forecast_wind"} .checked=${!0===this._option_show_forecast_wind} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_forecast_wind")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_show_gust_in_wind?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_show_gust_in_wind?Ot:Dt} .value=${"option_show_gust_in_wind"} .checked=${!1!==this._option_show_gust_in_wind} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_gust_in_wind")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_color_fire_danger?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_color_fire_danger?Ot:Dt} .value=${"option_color_fire_danger"} .checked=${!1!==this._option_color_fire_danger} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>
      </div>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${(null===(t=this._config)||void 0===t?void 0:t.option_wind_bearing_icon)?"eye-toggle active":"eye-toggle"} .path=${(null===(e=this._config)||void 0===e?void 0:e.option_wind_bearing_icon)?Ot:Dt} .value=${"option_wind_bearing_icon"} .checked=${!0===(null===(i=this._config)||void 0===i?void 0:i.option_wind_bearing_icon)} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("wind_bearing_icon")}</span>
            </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${(null===(s=this._config)||void 0===s?void 0:s.option_gust_bearing_icon)?"eye-toggle active":"eye-toggle"} .path=${(null===(o=this._config)||void 0===o?void 0:o.option_gust_bearing_icon)?Ot:Dt} .value=${"option_gust_bearing_icon"} .checked=${!0===(null===(n=this._config)||void 0===n?void 0:n.option_gust_bearing_icon)} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("gust_bearing_icon")}</span>
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
              <ha-icon-button class=${this._summary_1_use_attr?"eye-toggle active":"eye-toggle"} .path=${this._summary_1_use_attr?Ot:Dt} .value=${"summary_1_use_attr"} .checked=${this._summary_1_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
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
              <ha-icon-button class=${!1!==this._daily_extended_use_attr?"eye-toggle active":"eye-toggle"} .path=${!1!==this._daily_extended_use_attr?Ot:Dt} .value=${"daily_extended_use_attr"} .checked=${!1!==this._daily_extended_use_attr} @click=${this._toggleVisibility}></ha-icon-button>
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
            <ha-icon-button class=${!0===this._option_show_temperature_chart?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_temperature_chart?Ot:Dt} .value=${"option_show_temperature_chart"} .checked=${!0===this._option_show_temperature_chart} @click=${this._toggleVisibility}></ha-icon-button>
            <span class="toggle-label">${this._t("show_temp_chart")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
            <ha-icon-button class=${!0===this._option_show_precipitation_chart?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_precipitation_chart?Ot:Dt} .value=${"option_show_precipitation_chart"} .checked=${!0===this._option_show_precipitation_chart} @click=${this._toggleVisibility}></ha-icon-button>
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
              <ha-icon-button class=${!1!==this._option_tooltips?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_tooltips?Ot:Dt} .value=${"option_tooltips"} .checked=${!1!==this._option_tooltips} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("forecast_tooltips")}</span>
            </div>`:U``}
          </div>
          <div>
            <div class="toggle-row">
              <ha-icon-button class=${!0===this._option_show_current_day?"eye-toggle active":"eye-toggle"} .path=${!0===this._option_show_current_day?Ot:Dt} .value=${"option_show_current_day"} .checked=${!0===this._option_show_current_day} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("include_today")}</span>
            </div>
          </div>
        </div>

        <div class="side-by-side">
        ${"vertical"===this._daily_forecast_layout?U`<div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_daily_color_fire_danger?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_daily_color_fire_danger?Ot:Dt} .value=${"option_daily_color_fire_danger"} .checked=${!1!==this._option_daily_color_fire_danger} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("colour_fire_danger")}</span>
            </div>
        </div>`:U``}
        <div>
        </div>
      </div>
    `}_optionGlobalOptionsEditor(){var t,e,i,s;return U`
      <ha-input label=${this._t("card_title_1")} .value=${this._text_card_title} .configValue=${"text_card_title"}
        @input=${this._valueChanged}>
      </ha-input>
      <ha-input label=${this._t("card_title_2")} .value=${this._text_card_title_2} .configValue=${"text_card_title_2"}
        @input=${this._valueChanged}>
      </ha-input>
      <div class="side-by-side">
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${!1!==this._option_static_icons?"eye-toggle active":"eye-toggle"} .path=${!1!==this._option_static_icons?Ot:Dt} .value=${"option_static_icons"} .checked=${!1!==this._option_static_icons} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("show_static_icons")}</span>
          </div>
        </div>
        <div>
          <div class="toggle-row">
              <ha-icon-button class=${(null===(t=this._config)||void 0===t?void 0:t.option_compact_slots)?"eye-toggle active":"eye-toggle"} .path=${(null===(e=this._config)||void 0===e?void 0:e.option_compact_slots)?Ot:Dt} .value=${"option_compact_slots"} .checked=${!0===(null===(i=this._config)||void 0===i?void 0:i.option_compact_slots)} @click=${this._toggleVisibility}></ha-icon-button>
              <span class="toggle-label">${this._t("compact_slots")}</span>
            </div>
        </div>
        <div></div>
      </div>
      <div class="side-by-side">
        <label class='mdc-label'>${this._t("time_format")}</label>
        <select class='ha-select-compat' .configValue=${"option_time_format"} .value=${null!==(s=this._option_time_format)&&void 0!==s?s:""} @change=${this._valueChanged}>
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
              <ha-icon-button class=${!1!==this._show_section_overview?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_overview?Ot:Dt} .value=${"show_section_overview"} .checked=${!1!==this._show_section_overview} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:eye-outline"></ha-icon>
              <span class="section-title">${this._t("overview_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"overview"} .path=${Et} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"overview"} .path=${Nt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_overview"} .path=${Ft} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="option-icon" .value=${"option_overview"} .path=${Ct} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"extended":return U`
          <div class="section-flex edit-extended-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_extended?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_extended?Ot:Dt} .value=${"show_section_extended"} .checked=${!1!==this._show_section_extended} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:text-box-outline"></ha-icon>
              <span class="section-title">${this._t("extended_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"extended"} .path=${Et} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"extended"} .path=${Nt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_extended"} .path=${Ft} @click="${this._editSubmenu}">
              </ha-icon-button>
              <div class="no-icon"></div>
            </div>
          </div>
        `;case"slots":return U`
          <div class="section-flex edit-slots-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_slots?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_slots?Ot:Dt} .value=${"show_section_slots"} .checked=${!1!==this._show_section_slots} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:view-grid-outline"></ha-icon>
              <span class="section-title">${this._t("slots_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"slots"} .path=${Et} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"slots"} .path=${Nt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_slots"} .path=${Ft} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_slots"} .path=${Ct} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"daily_forecast":return U`
          <div class="section-flex edit-daily-forecast-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_daily_forecast?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_daily_forecast?Ot:Dt} .value=${"show_section_daily_forecast"} .checked=${!1!==this._show_section_daily_forecast} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:calendar-week"></ha-icon>
              <span class="section-title">${this._t("daily_forecast_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"daily_forecast"} .path=${Et} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"daily_forecast"} .path=${Nt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <ha-icon-button class="edit-icon" .value=${"section_daily_forecast"} .path=${Ft} @click="${this._editSubmenu}">
              </ha-icon-button>
              <ha-icon-button class="options-icon" .value=${"option_daily_forecast"} .path=${Ct} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `;case"charts":return U`
          <div class="section-flex edit-charts-section">
            <div class="section-label">
              <ha-icon-button class=${!1!==this._show_section_charts?"visibility-toggle active":"visibility-toggle"} .path=${!1!==this._show_section_charts?Ot:Dt} .value=${"show_section_charts"} .checked=${!1!==this._show_section_charts} @click=${this._toggleVisibility}>
              </ha-icon-button>
              <ha-icon class="section-icon" icon="mdi:chart-line"></ha-icon>
              <span class="section-title">${this._t("charts_section")}</span>
            </div>
            <div>
              <ha-icon-button class="down-icon" .value=${"charts"} .path=${Et} .disabled=${i} @click="${this._moveDown}">
              </ha-icon-button>
              <ha-icon-button class="up-icon" .value=${"charts"} .path=${Nt} .disabled=${e} @click="${this._moveUp}">
              </ha-icon-button>
              <div class="no-icon"></div>
              <ha-icon-button class="option-icon" .value=${"option_charts"} .path=${Ct} @click="${this._editSubmenu}">
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
              <ha-icon-button class="edit-icon" .value=${"option_global_options"} .path=${Ct} @click="${this._editSubmenu}">
              </ha-icon-button>
            </div>
          </div>
        `}return U``}render(){if(!this.hass||!this._helpers)return U``;if(this._subElementEditor)return this._renderSubElementEditor();const t=[],e=this._section_order||[];return t.push(this.getConfigBlock("global_options",!1,!1)),e.forEach((i,s)=>{t.push(this.getConfigBlock(i,0===s,s+1===e.length))}),U`${t}`}_t(t){var e,i;const s=((null===(e=this.hass)||void 0===e?void 0:e.language)||"en").split("-")[0].toLowerCase(),o=this.constructor._translations;return o[s]&&o[s][t]?o[s][t]:null!==(i=o.en[t])&&void 0!==i?i:t}_initialize(){void 0!==this.hass&&void 0!==this._config&&void 0!==this._helpers&&(this._initialized=!0)}async loadCardHelpers(){this._helpers=await window.loadCardHelpers()}_valueChangedPicker(t){if(!this._config||!this.hass)return;const e=t.target,i=t.detail.value;this[`_${e.configValue}`]!==i&&(e.configValue&&(i?this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:i}):(this._config=Object.assign({},this._config),delete this._config[e.configValue])),vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_valueChangedAction(t,e){const i=e.detail.value;null!=i&&(this._config=Object.assign(Object.assign({},this._config),{[t]:i}),vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}_editSubmenu(t){if(t.currentTarget){const e=t.currentTarget;this._subElementEditor=e.value}}_moveUp(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t-1]]=[this._config.section_order[t-1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_moveDown(t){if(this._config&&this.hass){if(t.currentTarget){const e=t.currentTarget;if(this._config.section_order){const t=this._config.section_order.findIndex(t=>t===e.value),i=[...this._config.section_order];[i[t],i[t+1]]=[this._config.section_order[t+1],this._config.section_order[t]],this._config=Object.assign(Object.assign({},this._config),{section_order:i})}}vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_toggleVisibility(t){const e=t.currentTarget,i=e.value,s=e.classList.contains("active");this._config=Object.assign(Object.assign({},this._config),{[i]:!s}),vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}_valueChanged(t){var e;if(!this._config||!this.hass)return;const i=t.target,s=void 0!==(null===(e=t.detail)||void 0===e?void 0:e.value)?t.detail.value:void 0!==i.checked?i.checked:i.value;if(this[`_${i.configValue}`]!==s){if(i.configValue)if(""===s){const t=Object.assign({},this._config);delete t[i.configValue],this._config=t}else this._config=Object.assign(Object.assign({},this._config),{[i.configValue]:s});vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)})}}_valueChangedNumber(t){if(!this._config||!this.hass)return;const e=t.target;this[`_${e.configValue}`]!==e.value&&(e.configValue&&(""===e.value||null===e.value?delete this._config[e.configValue]:this._config=Object.assign(Object.assign({},this._config),{[e.configValue]:Number(e.value)})),vt(this,"config-changed",{config:this.sortObjectByKeys(this._config)}))}};Tt._translations={en:{global_options:"Global Options",overview_section:"Overview Section",extended_section:"Extended Section",slots_section:"Slots Section",daily_forecast_section:"Daily Forecast Section",wind_bearing_icon:"Wind bearing arrow icon",gust_bearing_icon:"Gust bearing arrow icon",compact_slots:"Compact slot labels",show_static_icons:"Show Static Icons",time_format:"Time Format",locale:"Locale",icon_pack:"Icon Pack",opt_locale_auto:"Auto (browser)",actions:"Actions",tap_action:"Tap Action",hold_action:"Hold Action",double_tap_action:"Double-tap Action",icon_pack_default:"Default (built-in animated)",icon_pack_met_fill:"Meteocons — Fill (CDN, basmilius)",icon_pack_met_line:"Meteocons — Line (CDN, basmilius)",icon_pack_ammap:"ammap Weather Icons (requires weather-chart-card)",icon_pack_custom:"Custom path...",icon_path:"Icon path",icon_path_hint:"Use {condition} as placeholder — e.g. /local/icons/{condition}.svg",overview_layout:"Overview Layout",card_title_1:"Card Title Text Line 1",card_title_2:"Card Title Text Line 2",entity_temperature:"Entity Current Temperature",entity_apparent_temp:"Entity Apparent Temperature",entity_forecast_icon:"Entity Forecast Icon",entity_forecast_icon_1:"Entity Forecast Icon 1",entity_summary:"Entity Forecast Summary",entity_summary_1:"Entity Forecast Summary 1",entity_extended:"Entity Extended Forecast",entity_extended_1:"Entity Extended Forecast 1",use_attribute:"Use Attribute",attribute:"Attribute",slot_l1:"Slot Left 1",slot_l2:"Slot Left 2",slot_l3:"Slot Left 3",slot_l4:"Slot Left 4",slot_l5:"Slot Left 5",slot_l6:"Slot Left 6",slot_l7:"Slot Left 7",slot_l8:"Slot Left 8",slot_r1:"Slot Right 1",slot_r2:"Slot Right 2",slot_r3:"Slot Right 3",slot_r4:"Slot Right 4",slot_r5:"Slot Right 5",slot_r6:"Slot Right 6",slot_r7:"Slot Right 7",slot_r8:"Slot Right 8",today_temp_decimals:"Todays Temperature Decimals",today_rain_decimals:"Todays Rainfall Decimals",forecast_temp_decimals:"Forecast Temperature Decimals",pressure_decimals:"Pressure Decimals",show_separator:"Show separator",show_temp_decimals:"Show temperature decimals",entity_humidity:"Humidity",entity_pressure:"Atmospheric Pressure",entity_pop:"Chance of Rain",entity_pos:"Possible Rain Today",entity_2day_pos:"Possible Rain Tomorrow",entity_rainfall:"Todays Rain",entity_fire_danger:"Fire Danger",entity_uv_summary:"UV Alert Summary",entity_sun:"Entity Sun",entity_moon:"Moon Phase Entity",entity_visibility:"Entity Visibility",entity_wind_speed:"Entity Wind Speed",entity_wind_bearing:"Entity Wind Bearing",entity_wind_gust:"Entity Wind Gust",entity_wind_speed_kt:"Entity Wind Speed Kt",entity_wind_gust_kt:"Entity Wind Gust Kt",entity_update_time:"Entity Update Time",update_time_prefix:"Update Time Prefix",entity_uv_today:"Entity Today's UV Forecast",entity_fire_today:"Entity Today's Fire Danger",entity_observed_max:"Entity Observed Max",entity_observed_min:"Entity Observed Min",entity_forecast_max:"Entity Forecast Max",entity_forecast_max_1:"Entity Forecast Max 1",entity_forecast_min:"Entity Forecast Min",entity_forecast_min_1:"Entity Forecast Min 1",entity_temp_next:"Entity Temp Next",entity_temp_next_label:"Entity Temp Next Label",entity_temp_following:"Entity Temp Following",entity_temp_fol_label:"Entity Temp Following Label",entity_fire_danger_1:"Entity Fire Danger 1",entity_pop_1:"Entity Forecast Chance of Rain 1",entity_pos_1:"Entity Forecast Possible Rain 1",custom1_value:"Custom 1 Value",custom2_value:"Custom 2 Value",custom3_value:"Custom 3 Value",custom4_value:"Custom 4 Value",custom1_icon:"Custom 1 Icon",custom2_icon:"Custom 2 Icon",custom3_icon:"Custom 3 Icon",custom4_icon:"Custom 4 Icon",custom1_units:"Custom 1 Units",custom2_units:"Custom 2 Units",custom3_units:"Custom 3 Units",custom4_units:"Custom 4 Units",custom1_label:"Custom 1 Label (optional)",custom2_label:"Custom 2 Label (optional)",custom3_label:"Custom 3 Label (optional)",custom4_label:"Custom 4 Label (optional)",weather_entity:"Weather Entity with Forecasts",forecast_type:"Forecast Type",daily_forecast_layout:"Daily Forecast Layout",daily_forecast_days:"Daily Forecast Days",daily_extended_days:"Daily Extended Days",show_forecast_pop:"Show Precipitation Probability in Forecast",show_forecast_wind:"Show Wind in Forecast",show_gust_in_wind:"Show Gust in Wind Slot",colour_fire_danger:"Colour Fire Danger",include_today:"Include Today in Forecast",show_temp_chart:"Show Temperature Chart",show_precip_chart:"Show Precipitation Chart",forecast_tooltips:"Enable forecast tooltips",charts_section:"Charts Section",opt_daily:"Daily",opt_hourly:"Hourly",opt_twice_daily:"Twice Daily",opt_horizontal:"Horizontal",opt_vertical:"Vertical",opt_complete:"Complete",opt_observations:"Observations",opt_forecast:"Forecast",opt_title_only:"Title only",opt_system:"System",opt_12hour:"12 hour",opt_24hour:"24 hour"},bg:{global_options:"Глобални настройки",overview_section:"Секция Преглед",extended_section:"Разширена секция",slots_section:"Секция Слотове",daily_forecast_section:"Секция Прогноза",wind_bearing_icon:"Стрелка за посока на вятъра",gust_bearing_icon:"Стрелка за посока на поривите",compact_slots:"Компактни надписи",show_static_icons:"Статични икони",time_format:"Формат на часа",locale:"Език",icon_pack:"Пакет с икони",opt_locale_auto:"Автоматично (браузър)",actions:"Действия",tap_action:"Действие при натискане",hold_action:"Действие при задържане",double_tap_action:"Двойно натискане",icon_pack_default:"По подразбиране (вградени анимирани)",icon_pack_met_fill:"Meteocons — Запълнен (CDN)",icon_pack_met_line:"Meteocons — Линеен (CDN)",icon_pack_ammap:"ammap икони (изисква weather-chart-card)",icon_pack_custom:"Персонализиран път...",icon_path:"Път до икона",icon_path_hint:"Използвай {condition} като плейсхолър",overview_layout:"Оформление на преглед",card_title_1:"Заглавие ред 1",card_title_2:"Заглавие ред 2",entity_temperature:"Текуща температура",entity_apparent_temp:"Усещана температура",entity_forecast_icon:"Икона прогноза",entity_forecast_icon_1:"Икона прогноза 1",entity_summary:"Резюме прогноза",entity_summary_1:"Резюме прогноза 1",entity_extended:"Разширена прогноза",entity_extended_1:"Разширена прогноза 1",use_attribute:"Използвай атрибут",attribute:"Атрибут",slot_l1:"Слот Ляво 1",slot_l2:"Слот Ляво 2",slot_l3:"Слот Ляво 3",slot_l4:"Слот Ляво 4",slot_l5:"Слот Ляво 5",slot_l6:"Слот Ляво 6",slot_l7:"Слот Ляво 7",slot_l8:"Слот Ляво 8",slot_r1:"Слот Дясно 1",slot_r2:"Слот Дясно 2",slot_r3:"Слот Дясно 3",slot_r4:"Слот Дясно 4",slot_r5:"Слот Дясно 5",slot_r6:"Слот Дясно 6",slot_r7:"Слот Дясно 7",slot_r8:"Слот Дясно 8",today_temp_decimals:"Десетични за текуща темп.",today_rain_decimals:"Десетични за валежи",forecast_temp_decimals:"Десетични за прогнозна темп.",pressure_decimals:"Десетични за налягане",show_separator:"Показвай разделител",show_temp_decimals:"Показвай десетични",entity_humidity:"Влажност",entity_pressure:"Атмосферно налягане",entity_pop:"Вероятност за дъжд",entity_pos:"Възможен дъжд днес",entity_2day_pos:"Възможен дъжд утре",entity_rainfall:"Дъжд днес",entity_fire_danger:"Опасност от пожар",entity_uv_summary:"UV сигнал",entity_sun:"Слънце",entity_moon:"Фаза на луната",entity_visibility:"Видимост",entity_wind_speed:"Скорост на вятъра",entity_wind_bearing:"Посока на вятъра",entity_wind_gust:"Пориви",entity_wind_speed_kt:"Скорост (kn)",entity_wind_gust_kt:"Пориви (kn)",entity_update_time:"Час на обновяване",update_time_prefix:"Префикс за час",entity_uv_today:"UV прогноза (днес)",entity_fire_today:"Опасност от пожар (днес)",entity_observed_max:"Макс. наблюдавана",entity_observed_min:"Мин. наблюдавана",entity_forecast_max:"Макс. прогноза",entity_forecast_max_1:"Макс. прогноза 1",entity_forecast_min:"Мин. прогноза",entity_forecast_min_1:"Мин. прогноза 1",entity_temp_next:"Следваща темп.",entity_temp_next_label:"Етикет следваща темп.",entity_temp_following:"Трета темп.",entity_temp_fol_label:"Етикет трета темп.",entity_fire_danger_1:"Опасност от пожар 1",entity_pop_1:"Вероятност за дъжд 1",entity_pos_1:"Възможни валежи 1",custom1_value:"Перс. 1 стойност",custom2_value:"Перс. 2 стойност",custom3_value:"Перс. 3 стойност",custom4_value:"Перс. 4 стойност",custom1_icon:"Перс. 1 икона",custom2_icon:"Перс. 2 икона",custom3_icon:"Перс. 3 икона",custom4_icon:"Перс. 4 икона",custom1_units:"Перс. 1 единица",custom2_units:"Перс. 2 единица",custom3_units:"Перс. 3 единица",custom4_units:"Перс. 4 единица",custom1_label:"Перс. 1 етикет",custom2_label:"Перс. 2 етикет",custom3_label:"Перс. 3 етикет",custom4_label:"Перс. 4 етикет",weather_entity:"Ентити за прогноза",forecast_type:"Тип прогноза",daily_forecast_layout:"Оформление на прогнозата",daily_forecast_days:"Дни в прогнозата",daily_extended_days:"Дни разширена прогноза",show_forecast_pop:"Вероятност за валежи в прогнозата",show_forecast_wind:"Вятър в прогнозата",show_gust_in_wind:"Пориви в слота за вятър",colour_fire_danger:"Оцветяване — опасност от пожар",include_today:"Включи днес в прогнозата",show_temp_chart:"Покажи температурен чарт",show_precip_chart:"Покажи чарт за валежи",forecast_tooltips:"Tooltip-ове в прогнозата",charts_section:"Секция Чартове",opt_daily:"Дневна",opt_hourly:"Почасова",opt_twice_daily:"Два пъти дневно",opt_horizontal:"Хоризонтална",opt_vertical:"Вертикална",opt_complete:"Пълно",opt_observations:"Наблюдения",opt_forecast:"Прогноза",opt_title_only:"Само заглавие",opt_system:"Системен",opt_12hour:"12-часов",opt_24hour:"24-часов"},da:{wind_bearing_icon:"Pil for vindretning",gust_bearing_icon:"Pil for vindstødsretning",compact_slots:"Kompakte etiketter",actions:"Handlinger",tap_action:"Tryk-handling",hold_action:"Hold-handling",double_tap_action:"Dobbelttryk-handling"},de:{wind_bearing_icon:"Windrichtungspfeil",gust_bearing_icon:"Böenrichtungspfeil",compact_slots:"Kompakte Beschriftungen",actions:"Aktionen",tap_action:"Tipp-Aktion",hold_action:"Halte-Aktion",double_tap_action:"Doppeltipp-Aktion"},es:{wind_bearing_icon:"Flecha de dirección del viento",gust_bearing_icon:"Flecha de dirección de rachas",compact_slots:"Etiquetas compactas",actions:"Acciones",tap_action:"Acción al tocar",hold_action:"Acción al mantener",double_tap_action:"Doble toque"},fr:{wind_bearing_icon:"Flèche de direction du vent",gust_bearing_icon:"Flèche de direction des rafales",compact_slots:"Libellés compacts",actions:"Actions",tap_action:"Action au toucher",hold_action:"Action maintenue",double_tap_action:"Double toucher"},he:{wind_bearing_icon:"חץ כיוון הרוח",gust_bearing_icon:"חץ כיוון המשבים",compact_slots:"תוויות קומפקטיות",actions:"פעולות",tap_action:"פעולה בלחיצה",hold_action:"פעולה בלחיצה ממושכת",double_tap_action:"פעולה בלחיצה כפולה"},it:{wind_bearing_icon:"Freccia direzione vento",gust_bearing_icon:"Freccia direzione raffiche",compact_slots:"Etichette compatte",actions:"Azioni",tap_action:"Azione al tocco",hold_action:"Azione prolungata",double_tap_action:"Doppio tocco"},nl:{wind_bearing_icon:"Windrichtingspijl",gust_bearing_icon:"Windstootrichtingspijl",compact_slots:"Compacte labels",actions:"Acties",tap_action:"Tik-actie",hold_action:"Vasthoudactie",double_tap_action:"Dubbele tik-actie"},pl:{wind_bearing_icon:"Strzałka kierunku wiatru",gust_bearing_icon:"Strzałka kierunku porywów",compact_slots:"Kompaktowe etykiety",actions:"Akcje",tap_action:"Akcja dotknięcia",hold_action:"Akcja przytrzymania",double_tap_action:"Podwójne dotknięcie"},ru:{wind_bearing_icon:"Стрелка направления ветра",gust_bearing_icon:"Стрелка направления порывов",compact_slots:"Компактные подписи",actions:"Действия",tap_action:"Действие при нажатии",hold_action:"Действие при удержании",double_tap_action:"Двойное нажатие"},ua:{wind_bearing_icon:"Стрілка напряму вітру",gust_bearing_icon:"Стрілка напряму поривів",compact_slots:"Компактні підписи",actions:"Дії",tap_action:"Дія при дотику",hold_action:"Дія при утриманні",double_tap_action:"Подвійний дотик"}},Tt.styles=r`
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
  `,t([ct({attribute:!1})],Tt.prototype,"hass",void 0),t([_t()],Tt.prototype,"_config",void 0),t([_t()],Tt.prototype,"_helpers",void 0),t([_t()],Tt.prototype,"_subElementEditor",void 0),Tt=t([rt("platinum-weather-card-plus-charts-editor")],Tt);var Mt=Object.freeze({__proto__:null,get WeatherCardEditor(){return Tt}});export{St as PlatinumWeatherCard};
