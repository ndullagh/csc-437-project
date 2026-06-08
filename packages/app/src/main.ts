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
import { ItemDetailElement } from "./components/item-detail-view.js";
import { ItemCreateElement } from "./components/item-new-view.js";

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
    path: "/app/:userid/:cat/:type/new",
    view: html`
      <item-new-view 
        userid=${($: any) => $.params.userid}
        cat=${($: any) => $.params.cat}
        type=${($: any) => $.params.type}>
      </item-new-view>
    `
  },

  {
    path: "/app/:userid/:cat/:type/:itemid",
    view: html`
      <item-detail
        userid=${($: any) => decodeURIComponent($.params.userid)}
        cat=${($: any) => decodeURIComponent($.params.cat)}
        type=${($: any) => decodeURIComponent($.params.type)}
        itemname=${($: any) => decodeURIComponent($.params.itemid)}
        mode=${($: any) => $.query.get("mode") || "view"}>
      </item-detail>
    `
  },
  
  
  {
    path: "/app/:userid",
    view: html`
      <equipment-elem
            username=${($: any) => $.params.userid || ""}>
          </equipment-elem>
    `
  },
  {
    path: "/app",
    view: html`
      <equipment-elem></equipment-elem>
    `
  },
  //now must support: /app/type/item/?mode=edit|view (statView), /app/type/newitem (createItemView)
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
  "item-detail": ItemDetailElement,
  "item-new-view": ItemCreateElement,
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