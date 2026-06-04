import { define, html } from "@unbndl/html";
import { Auth } from "@unbndl/auth";
import { BrowserHistory, Switch } from "@unbndl/switch";
import { Store } from "@unbndl/store";
import { Msg } from "./messages.js";
import { Model, init } from "./model.js";
import { update, Cmd } from "./update.js";
import { HeaderElement } from "./components/header.js";
import { EquipmentElement } from "./components/equipment.js";
import { EquipmentViewElement } from "./components/equipment-view.js";
import { AboutViewElement } from "./components/about-view.js";
import { ProfileViewElement } from "./components/profile-view.js";
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
    path: "/app/profile/:userid",
    view: html`
      <profile-view
        user-id=${($: any) => $.params.userid}
        mode=${($) => $.query.get("mode") || "view" }>
      </profile-view>
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
  "profile-view": ProfileViewElement,
  "item-type": ItemTypeElement,
  "item-slot": ItemSlotElement,
  "store-provider": class AppStore
    extends Store.Provider<Model, Msg, Cmd>
  {
    constructor() {
      super(update, init);
    }
  },
  /*"router-switch": class AppSwitch extends Switch.Element {
  constructor() {
    super(routes);
  }
},*/
});