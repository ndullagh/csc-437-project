import { html, css, shadow } from "@unbndl/html";
import { createView, createViewModel, fromAttributes } from "@unbndl/view";
import reset from "./styles/reset.css.js";


type ItemSlotAttributes = {
  itemname?: string;
  elem?: string;
  userid?: string;
  type?: string;
  cat?: "Weapons" | "Armor" | "";
}

interface ItemSlotViewModel {
  itemname: string;
  elem: string;
  userid: string;
  type: string;
  cat: "Weapons" | "Armor" | "";
}
export class ItemSlotElement extends HTMLElement {

  viewModel = createViewModel<ItemSlotViewModel>({
    itemname: "",
    elem: "",
    userid: "",
    type: "",
    cat: ""
  }).with(fromAttributes<ItemSlotAttributes>(this), "itemname", "elem", "userid", "cat", "type");

  view = createView<ItemSlotViewModel>(html`
        <li>
            ${($)=>$.elem}
            <a href=${($) =>
              `/app/${encodeURIComponent($.userid)}/${encodeURIComponent($.cat)}/${encodeURIComponent($.type)}/${encodeURIComponent($.itemname)}?mode=view`
              }>${($)=>$.itemname}</a>
            
        </li>
  `);
    //<div>Fire</div>
    //<a href="huntingbm.html">Hunting Set (Blademaster)</a>

 constructor() {
     super();
     shadow(this)
       .styles(reset.styles, ItemSlotElement.styles)
       .replace(this.viewModel.render(this.view));
   }


  /*static observedAttributes = ["href",];
  
  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case "href":
        // code to modify DOM
        this.shadowRoot.querySelector('a').setAttribute('href', newValue)
        break;
    }
  }*/

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