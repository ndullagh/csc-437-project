import { html, css, shadow } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

export class EquipmentElement extends HTMLElement {

  viewModel = createViewModel({
    authenticated: false,
    equipment: {Weapons: [],
      Armor: []
    } // this will be the data from the API
  }).with(fromAttributes(this), "src")
  .with(fromAuth(this), "authenticated", "token");

  view = html`
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${$=>$.equipment.Weapons.map((type) => EquipmentElement.renderItemType(type))}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${$=>$.equipment.Armor.map((type) => EquipmentElement.renderItemType(type))}

        
        
    </section>
    <button>Add New Item</button>
  `;

  

  get authorization() {
    const $ = this.viewModel.toObject();
    if ($.authenticated)
        return { Authorization: `Bearer ${$.token}` };
      else return {};
  }
  constructor() {
    super();
    shadow(this).styles(EquipmentElement.styles)
    .replace(this.viewModel.render(this.view));
    // no template
    this.viewModel.createEffect(($) => {
      if ($.authenticated && $.src) {
        this.hydrate($.src).then((data) => {
          this.viewModel.set("equipment", data); //TODO idk where these hook up to
        });
      }
    })
  


    this.viewModel.createEffect(($) => {
      console.log("EQUIPMENT:", $.equipment);
    });
  }
  
  static observedAttributes = ["src"];

  /*reload() {


    //const data = response.data ? response.data[0] : response;

    this.hydrate(this.getAttribute("src")).then((data) => {
      const view = EquipmentElement.render(data);
      shadow(this).replace(view);
    });
  }*/

  reload() {
    this.hydrate(this.getAttribute("src")).then((response) => {
      console.log("API response:", response);

      //const data = response.data ? response.data[0] : response;
      const data = response[0];/*Array.isArray(response)
      ? response[0]
      : response.data
        ? response.data[0]
        : response;*/

      const view = EquipmentElement.render(data);
      shadow(this).replace(view);
    });
  }

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      //this.reload();


      this.addEventListener("click", (event) => {
        fetch(`/api/Equipment/Weapons/${encodeURIComponent("Dual Blades")}`, {
          method: "POST",
          headers: {

            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            ItemName: "New Blades",
            Element: "Water",
            Statsheet: "newblades.html"
          })
        }).then(res => {
          if(!res.ok) throw new Error("post failed!");
          return res.json({added});
        }).then(data => {
          console.log("Created:", data);
          this.reload();
        })
      });
    }
  }

  static render(data) {
    // render the data

    console.log("render data:", data);

    const { Weapons = [], Armor = [] } = data ?? {};
    //const { Weapons, Armor } = data;
    
    return html `
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${Weapons.map((type) => EquipmentElement.renderItemType(type))}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${Armor.map((type) => EquipmentElement.renderItemType(type))}

        
        
    </section>
    <button>Add New Item</button>`


  }
  
  static renderItemType(type) {
    const {TypeName, Icon, ItemList} = type

    return html`
    <item-type icon=${Icon}>
        <span slot="typename">${TypeName}</span>
        ${ItemList.map((list) => EquipmentElement.renderItem(list))}
        
    </item-type>`
  }
  
  static renderItem(item) {
    const {ItemName, Element, Statsheet} = item

    return html`
    <item-slot href=${Statsheet}>
        <div slot="Element">${Element}</div>
        <div slot="WeaponName">${ItemName}</div>
    </item-slot>`
  }

  


  hydrate(src) {
    return fetch(src, { headers: this.authorization })
      .then((response) => {
        if (response.status !== 200)
          throw `HTTP Status ${response.status}`;
        else return response.json();
        })
      .catch((error) => {
        console.log(`Could not fetch ${src}:`, error);
      });
  }

  static styles = css`

    :host{
        grid-column: 1 / -1;
        display: contents;
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