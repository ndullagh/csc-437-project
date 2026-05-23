import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { HeaderElement } from "./components/header.js";
import { EquipmentElement } from "./components/equipment.js";
import { EquipmentViewElement } from "./components/equipment-view.ts";
import { AboutViewElement } from "./components/about-view.js";
import { ItemTypeElement } from "./components/item-type.js";
import { ItemSlotElement } from "./components/item-slot.js";

const routes: any = [
  {
    path: "/app/about",
    view: html`
      <p>Here is an about page!</p>
      <a href="/app/6a02c9a118b7efa43b216b98">Go to equipment</a>
    `
  },
  {
    
    path: "/app/statsheet/:id/:cat/:type/:name",
    view: html`
      <stat-view 
        equipment-id=${($: any) => $.params.id}
        category=${($: any) => $.params.cat}
        type=${($: any) => $.params.type}
        name=${($: any) => $.params.name}>
      </stat-view>
    `
  },
  {
    path: "/app/newItem/:id/:cat/:type",
    view: html`
      <newitem-view 
        equipment-id=${($: any) => $.params.id}
        category=${($: any) => $.params.cat}
        type=${($: any) => $.params.type}>
      </newitem-view>
    `
  },
  
  {
    path: "/app/:id",
    view: html`
      <equipment-view equipment-id=${($: any) => $.params.id}></equipment-view>
    `
  },
  {
    path: "/app",
    view: html`
      <equipment-view></equipment-view>
    `
  },
  {
    path: "/",
    redirect: "/app"
  }
];


define({
  "auth-provider": Auth.Provider,
  "history-provider": BrowserHistory.Provider,
  "router-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes);
    }
  },
  "blz-header": HeaderElement,
  "equipment-elem": EquipmentElement,
  "equipment-view": EquipmentViewElement,
  "about-view": AboutViewElement,
  "item-type": ItemTypeElement,
  "item-slot": ItemSlotElement,
  /*"router-switch": class AppSwitch extends Switch.Element {
  constructor() {
    super(routes);
  }
},*/
});