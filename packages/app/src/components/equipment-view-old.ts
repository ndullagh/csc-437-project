// src/views/equipment-view.ts
import { fromAuth } from "@unbndl/auth";
import { html, shadow, css } from "@unbndl/html";
import { createViewModel, fromAttributes } from "@unbndl/view";

interface EquipmentViewModel {
  username?: string;
}

export class EquipmentViewElement extends HTMLElement {
  viewModel = createViewModel<EquipmentViewModel>({})
  .with(fromAuth(this), 'username');

  view = html`

    <equipment-elem
      src=${($: EquipmentViewModel) =>
        $.username
          ? `/api/Equipment/${$.username}`
          : `/api/Equipment/usr`
      }>
    </equipment-elem>
    
  `;

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

  //static observedAttributes = ["equipment-id"];
}