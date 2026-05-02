import { html, css, shadow } from "@unbndl/html";

export class EquipmentElement extends HTMLElement {
  constructor() {
    super();
    shadow(this).styles(EquipmentElement.styles);
    // no template
  }
  
  static observedAttributes = ["src"];

  attributeChangedCallback(name, _, newValue) {
    if (name === "src") {
      this.hydrate(newValue).then((data) => {
        const view = EquipmentElement.render(data)
        shadow(this).replace(view);
      });
    }
  }

  static render(data) {
    // render the data
    const { Weapons, Armor } = data;
    
    return html `
    <section class="column" id="Weapons">
        <h3>Weapons</h3>
        

        ${Weapons.map((type) => EquipmentElement.renderItemType(type))}
        

    </section>


    <section class="column" id="Armor">
        <h3>Armor</h3>

        ${Armor.map((type) => EquipmentElement.renderItemType(type))}

        
        
    </section>`


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
    return fetch(src)
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