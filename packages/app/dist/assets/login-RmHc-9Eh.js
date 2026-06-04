import{d as e,f as t,i as n,l as r,o as i,s as a,t as o,u as s}from"./reset.css-vi_VBtWp.js";var c=class a extends HTMLElement{viewModel=n({username:``,password:``}).with(i(this),`username`,`password`);view=e`<form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>`;constructor(){super(),t(this).styles(o.styles,a.styles).replace(this.viewModel.render(this.view)),this.shadowRoot?.addEventListener(`submit`,e=>this.submitLogin(e,this.getAttribute(`api`)||`#`))}submitLogin(e,t){e.preventDefault();let n=this.viewModel.toObject(),r={"Content-Type":`application/json`},i=JSON.stringify(n);console.log(`Posting login form:`,t,i,e),fetch(t,{method:`POST`,headers:r,body:i}).then(e=>{if(e.status!==200)throw`Form submission failed: Status ${e.status}`;return e.json()}).then(e=>{let{token:t}=e,n=new CustomEvent(`auth:message`,{bubbles:!0,composed:!0,detail:[`auth/signin`,{token:t,redirect:`/`}]});this.dispatchEvent(n)})}static styles=r`
    :host {
      display: contents;
    }
    form {
      display: contents;
    }
  `};s({"auth-provider":a.Provider,"login-form":c});