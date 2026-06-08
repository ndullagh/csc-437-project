import { html, css, shadow } from "@unbndl/html";
import { createView, createViewModel, fromAttributes } from "@unbndl/view";
import reset from "./styles/reset.css.js";

type ItemTypeAttributes = {
  type?: string;
  icon?: string;
  userid?: string;
  cat?: string;
}

interface ItemTypeViewModel {
  type: string;
  icon: string;
  userid: string;
  cat: string;
}

export class ItemTypeElement extends HTMLElement {

  viewModel = createViewModel<ItemTypeViewModel>({
    type: "",
    icon: "",
    userid: "",
    cat: "",
  }).with(fromAttributes<ItemTypeAttributes>(this), "type", "icon", "userid", "cat");

  view = createView<ItemTypeViewModel>(html`
  <div class="item-type">
    <div class="item-header">
      <svg class="icon">
        <use href=${($) => `/sprite.svg#icon-${$.icon}`} />
      </svg>

      <h4>${($) => $.type}</h4>

      <a href=${($) => `/app/${$.userid}/${$.cat}/${$.type}/new`}>
        +
      </a>
    </div>

    <ul>
      <slot></slot>
    </ul>
  </div>
`);

constructor() {
    super();
    shadow(this)
      .styles(reset.styles, ItemTypeElement.styles)
      .replace(this.viewModel.render(this.view));
  }


  /*static template = html`
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
  }*/

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