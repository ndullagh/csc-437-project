// src/views/equipment-view.ts
import { html, shadow, css } from "@unbndl/html";
import { createView, createViewModel } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";

interface EquipmentViewModel {
  username?: string;
  //equipment?: Equipment;
}

export class EquipmentViewElement extends HTMLElement {
  viewModel = createViewModel<EquipmentViewModel>({})
    .with(fromAuth(this), "username")
    //.with(fromStore<Model>(this), "equipment");

  view = createView<EquipmentViewModel> ( html`
          <equipment-elem
            username=${$ => $.username || ""}>
          </equipment-elem>
`);


  constructor() {
    super();

    

    shadow(this)
      .styles(css`
        :host {
          grid-column: 1 / -1;
          display: contents;
        }
      `)
      .replace(this.viewModel.render(this.view));
  }
}