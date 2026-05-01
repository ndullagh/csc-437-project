import { html, css, shadow } from "@unbndl/html";
import reset from "./styles/reset.css.js";


export class ItemTypeElement extends HTMLElement {
  static template = html`
    <template>
        <div class="item-type">
          <div class="item-header">
              <svg class="icon">
                  <use href="" />
              </svg>
              <h4><slot name="typename"></slot></h4>
          </div>

          <ul>
              <slot></slot>   
          </ul>    
        </div>
    </template>
  `;
    //<div>Fire</div>
    //<a href="huntingbm.html">Hunting Set (Blademaster)</a>

  constructor() {
    super();
    shadow(this)
      .template(ItemTypeElement.template)
      .styles(reset.styles, ItemTypeElement.styles)
  }


  static observedAttributes = ["icon",];
  
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "icon":
        // code to modify DOM
        this.shadowRoot.querySelector('use').setAttribute('href', `sprite.svg#icon-${newValue}`)
        break;
    }
  }

  // I like to keep the styles at the bottom of the class
  static styles = css`
    .item-header {
        display: flex;
        background-color: var(--color-background-header);
        color: var(--color-accent-inverted);
        padding: 20px;
        align-items: baseline;
    }
    
    .item-type {
        margin-bottom: 20px;
    }
    
    svg.icon {
      display: inline;
      height: 2em;
      width: 2em;
      vertical-align: top;
      fill: currentColor;
    }
    

    
    `
    
    
    
}