import{a as e,c as t,i as n,l as r,n as i,s as a,t as o,u as s}from"./reset.css-CQzz8SJB.js";var c=class e extends HTMLElement{viewModel=i({username:``,password:``}).with(n(this),`username`,`password`);view=r`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`;constructor(){super(),s(this).styles(o.styles,e.styles).replace(this.viewModel.render(this.view)),this.shadowRoot?.addEventListener(`submit`,e=>this.submitLogin(e,this.getAttribute(`api`)||`#`))}submitLogin(e,t){e.preventDefault();let n=this.viewModel.toObject(),r={"Content-Type":`application/json`},i=JSON.stringify(n);console.log(`Posting login form:`,t,i,e),fetch(t,{method:`POST`,headers:r,body:i}).then(e=>{if(e.status!==200)throw`Form submission failed: Status ${e.status}`;return e.json()}).then(e=>{let{token:t}=e,n=new CustomEvent(`auth:message`,{bubbles:!0,composed:!0,detail:[`auth/signin`,{token:t,redirect:`/`}]});this.dispatchEvent(n)})}static styles=a`
    :host {
      display: contents;
    }
    form {
      display: contents;
    }
  `};t({"auth-provider":e.Provider,"login-form":c});