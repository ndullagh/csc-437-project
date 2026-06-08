import { html, css, shadow } from "@unbndl/html";
import reset from "./styles/reset.css.js";


export class ItemSlotElement extends HTMLElement {
  static template = html`
    <template>
        <li>
            <slot name="Element">None</slot>
            <a><slot name="WeaponName">Default Name</slot></a>
            
        </li>
    </template>
  `;
    //<div>Fire</div>
    //<a href="huntingbm.html">Hunting Set (Blademaster)</a>

  constructor() {
    super();
    shadow(this)
      .template(ItemSlotElement.template)
      .styles(reset.styles, ItemSlotElement.styles)
  }


  static observedAttributes = ["href",];
  
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "href":
        // code to modify DOM
        this.shadowRoot.querySelector('a').setAttribute('href', newValue)
        break;
    }
  }

  // I like to keep the styles at the bottom of the class
  static styles = css`
    li {
        grid-column: span 2;
        display: flex;
        justify-content: space-between;
        background-color: var(--color-background-page);
        border: 1px solid var(--color-background-header);
        /*border-bottom: 0.5px solid var(--color-background-header);*/
        padding-left: 20px;
        padding-right: 20px ;
        a {
            color: var(--color-accent);
        }
    }
    
    `
    
    
    
}