import { html, css, shadow } from "@unbndl/html";
import { createView, createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { Model } from "../model.ts";
import { Equipment, ItemType, Item } from "server/models";



interface EquipmentViewModel {
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
  .with(fromStore<Model>(this), "equipment");

  view = createView<EquipmentViewModel>(html`
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${$=>$.equipment?.Weapons.map((type) => EquipmentElement.renderItemType(type))}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${$=>$.equipment?.Armor.map((type) => EquipmentElement.renderItemType(type))}

        
        
    </section>
  `);

  

  /*get authorization() {
    const $ = this.viewModel.toObject();
    if ($.authenticated)
        return { Authorization: `Bearer ${$.token}` };
      else return {};
  }*/
  constructor() {
    super();
    shadow(this).styles(EquipmentElement.styles)
    .replace(this.viewModel.render(this.view));
    // no template
  

    this.viewModel.createEffect(($) => {
      if ($.username) {
        console.log("GET EVENT DISPATCHED! for user:", $.username);
        Store.dispatch(this, ["equipment/get", { userid: $.username }]);
      }
    });
  }
  
  
 

  

  static render(data: Equipment) {
    // render the data

    console.log("render data:", data);

    const { Weapons = [], Armor = [] } = data ?? {};
    //const { Weapons, Armor } = data;
    
    return html `
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${Weapons.map((type: ItemType) => EquipmentElement.renderItemType(type))}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${Armor.map((type: ItemType) => EquipmentElement.renderItemType(type))}

        
        
    </section>
    <button>Add New Item</button>`


  }
  
  static renderItemType(type: ItemType) {
    const {TypeName, Icon, ItemList} = type

    return html`
    <item-type icon=${Icon}>
        <span slot="typename">${TypeName}</span>
        ${ItemList.map((list) => EquipmentElement.renderItem(list))}
        
    </item-type>`
  }
  
  static renderItem(item: Item) {
    const {ItemName, Element, Statsheet} = item

    return html`
    <item-slot href=${Statsheet}>
        <div slot="Element">${Element}</div>
        <div slot="WeaponName">${ItemName}</div>
    </item-slot>`
  }

  


  /*hydrate(username) {
    return fetch(username, { headers: this.authorization })
      .then((response) => {
        if (response.status !== 200)
          throw `HTTP Status ${response.status}`;
        else return response.json();
        })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
      });
  }*/

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