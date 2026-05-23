import { html, shadow } from "@unbndl/html";

export class AboutViewElement extends HTMLElement {
  view = html`
    <p>Here is an about page!</p>
    <a href="/app/6a02c9a118b7efa43b216b98">Go to equipment</a>
  `;

  constructor() {
    super();
    shadow(this).replace(this.view);
  }
}