import { html, css, shadow } from "@unbndl/html";
import reset from "./styles/reset.css.js";

export class DarkToggleElement extends HTMLElement{
    static template = html`
        <template>
            <label>
                <input type="checkbox" autocomplete="off">
                <slot name="label">defaulttt</slot>
            </label>
        </template>`;
    
    constructor() {
        super();
        shadow(this).template(DarkToggleElement.template)
        .styles(reset.styles, DarkToggleElement.styles);
    }

    connectedCallback() {

        this.shadowRoot.addEventListener("change", (event) => {
            console.log("change event registered");
            event.stopPropagation();
           const dmevent = new CustomEvent(
                "dark-mode:toggle", 
                {
                    bubbles: true,
                    detail: { checked: event.target.checked },
                    composed: true
                }
            );
            this.dispatchEvent(dmevent);
            console.log("toggle even dispatched!");
        })
    }

    //add disconnected callback. prob not an issue for rn tho


    static styles = css`
        :host {
            border: 1px solid white}
`;
    
}