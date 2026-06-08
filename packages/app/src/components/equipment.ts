import { html, css, shadow } from "@unbndl/html";
import { createView, createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { Model } from "../model.ts";
import { Equipment, ItemType, Item } from "server/models";



interface EquipmentViewModel {
  authUsername?: string;
  username?: string;
  equipment: Equipment;
}

type EquipmentAttributes = {
  username?: string;
};

export class EquipmentElement extends HTMLElement {
  

  viewModel = createViewModel<EquipmentViewModel>({
    equipment: {
      userid: "",
      Weapons: [],
      Armor: []
    } // this will be the data from the API
  }).with(fromAttributes<EquipmentAttributes>(this), "username")
  .with(fromStore<Model>(this), "equipment")
  .withRenamed(fromAuth(this), {
    authUsername: "username"
  })

  view = createView<EquipmentViewModel>(html`
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${($) => {
            const userid = $.username || $.authUsername || "";
            
            return $.equipment?.Weapons.map((type) => EquipmentElement.renderItemType(type, userid, "Weapons")
          );
        }}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${($) => {
            const userid = $.username || $.authUsername || "";
            
            return $.equipment?.Armor.map((type) => EquipmentElement.renderItemType(type, userid, "Armor")
          );
        }}

        
        
    </section>
  `);

  


  constructor() {
    super();
    shadow(this).styles(EquipmentElement.styles)
    .replace(this.viewModel.render(this.view));
    // no template
  

    this.viewModel.createEffect(($) => {
      const user = $.username || $.authUsername

      if (user) {
        console.log("GET EVENT DISPATCHED! for user:", user);
        Store.dispatch(this, ["equipment/get", { userid: user }]);
      }
    });
  }
  
  
 


  
  static renderItemType(type: ItemType, userid: string, cat: "Weapons" | "Armor") {
    const {TypeName, Icon, ItemList} = type

    return html`
    <item-type icon=${Icon} type=${TypeName} userid=${userid} cat=${cat}>
        ${ItemList.map((list) => EquipmentElement.renderItem(list, TypeName, userid, cat))}
        
    </item-type>`
  }
  
  static renderItem(item: Item, type: string, userid: string, cat: "Weapons" | "Armor") {
    const {ItemName, Element, Stats} = item

    return html`
    <item-slot userid=${userid} cat=${cat} elem=${Element} itemname=${ItemName} type=${type}>`
  }

  

  static styles = css`

    :host {
        grid-column: 1 / -1;
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 20px;
    }
    .column {
        flex: 1;
        grid-column: span 2;
        /*background-color: var(--color-background-column);*/
        padding: 20px;
        margin-bottom: 20px;
    }
    @media screen and
    (max-width: 50rem) {

        .column,
        .weapon,
        .armor {
            grid-column: 1 / -1;
        }
    }`
}