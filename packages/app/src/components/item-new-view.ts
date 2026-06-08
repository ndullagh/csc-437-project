// src/views/equipment-view.ts
import { html, shadow, css } from "@unbndl/html";
import { createView, createViewModel, fromAttributes, View } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { Model } from "../model.ts";
import { Profile } from "server/models";
import { BrowserHistory } from "@unbndl/switch";
import { Msg } from "../messages.ts";
import reset from "./styles/reset.css.js";


type ItemCreateAttributes = {
  userid?: string;
  cat?: "Weapons" | "Armor" | "";
  type?: string;
}

interface ItemCreateViewModel {
  userid: string;
  cat: "Weapons" | "Armor" | "";
  type: string;
}
export class ItemCreateElement extends HTMLElement {

    viewModel = createViewModel<ItemCreateViewModel>({
        userid: "",
        cat: "",
        type: "",
    }).with(fromAttributes<ItemCreateAttributes>(this), "userid", "type", "cat");

    view = createView<ItemCreateViewModel>(html`
        <section>
            ${($) => this.renderFormForType($.type)}
        </section>
    `);

    constructor() {
        super();
        console.log("ITEM CREATE CONSTRUCTOR RAN");
        shadow(this)
        .styles(reset.styles, ItemCreateElement.styles)
        .replace(this.viewModel.render(this.view))
        .delegate("form", {
            submit: (ev: SubmitEvent) => this.submitCreate(ev)
        })
        .delegate(".cancel", {
            click: () => BrowserHistory.dispatch(this, "history/navigate", {
                            href: `/app`
                        })
        });

    }

    dispatch(msg: Msg) {
        Store.dispatch<Msg>(this, msg);
    }
   
   
    submitCreate(ev: SubmitEvent) {
        ev.preventDefault();

        const form = ev.target as HTMLFormElement;
        const formData = new FormData(form);

        const ItemName = formData.get("ItemName") as string;
        const Element = formData.get("Element") as string;

        const stats: Record<string, string> = {};

        for (const [key, value] of formData.entries()) {
            if (key.startsWith("Stats.")) {
                stats[key.replace("Stats.", "")] = String(value);
            }
        }

        stats["Element/Status"] = Element

        const item = {
            ItemName,
            Element,
            Stats: stats
        };

        const $ = this.viewModel.toObject();

        Store.dispatch(this, [
            "equipment/item/create",
            {
            userid: $.userid,
            cat: $.cat,
            type: $.type,
            item
            }
        ]);


         BrowserHistory.dispatch(this, "history/navigate", {
            href: `/app`
        });
    }

   
    formDataToJSON(form: HTMLFormElement): object {
        const inputs = Array.from(form.elements).filter(
            (el) => "name" in el // exclude unnamed things like buttons
        ) as Array<HTMLInputElement>;

        const entries = inputs.map((el) => [el.name, el.value]);
        return Object.fromEntries(entries);
    }

   

    renderFormForType(type: string) {
        switch (type) {
            case "Greatsword": return html`
                <form>
                    <label>
                        <span>Name</span>
                        <input name="ItemName" />
                    </label>
                    <label>
                        <span>Element/Status</span>
                        <input name="Element" />
                    </label>
                    <label>
                        <span>Raw</span>
                        <input name="Stats.Raw" />
                    </label>

                    <label>
                        <span>Element</span>
                        <input name="Stats.Element" />
                    </label>
                    <label>
                        <span>Status</span>
                        <input name="Stats.Status" />
                    </label>
                    <label>
                        <span>Affinity</span>
                        <input name="Stats.Affinity" />
                    </label>
                    <label>
                        <span>Defense</span>
                        <input name="Stats.Defense" />
                    </label>
                    <label>
                        <span>Slots</span>
                        <input name="Stats.Slots" />
                    </label>

                    <button type="submit">Save</button>
                    <button type="cancel">Cancel</button>
                </form>
            `;
            case "Dualblades": return html`
                <form>
                    <label>
                        <span>Name</span>
                        <input name="ItemName" />
                    </label>
                    <label>
                        <span>Element/Status</span>
                        <input name="Element" />
                    </label>
                    <label>
                        <span>Raw</span>
                        <input name="Stats.Raw" />
                    </label>
                    <label>
                        <span>Element</span>
                        <input name="Stats.Element" />
                    </label>
                    <label>
                        <span>2nd Element</span>
                        <input name="Stats.2nd Element" />
                    </label>
                    <label>
                        <span>Status</span>
                        <input name="Stats.Status" />
                    </label>
                    <label>
                        <span>Affinity</span>
                        <input name="Stats.Affinity" />
                    </label>
                    <label>
                        <span>Defense</span>
                        <input name="Stats.Defense" />
                    </label>
                    <label>
                        <span>Slots</span>
                        <input name="Stats.Slots" />
                    </label>

                    <button type="submit">Save</button>
                    <button type="cancel">Cancel</button>
                </form>
            `;
            case "Blademaster": return html`
                <form>
                    <label>
                        <span>Name</span>
                        <input name="ItemName" />
                    </label>
                    <label>
                        <span>Element/Status</span>
                        <input name="Element" />
                    </label>
                    <label>
                        <span>Defense</span>
                        <input name="Stats.Defense" />
                    </label>
                    <label>
                        <span>Fir</span>
                        <input name="Stats.Fir" />
                    </label>
                    <label>
                        <span>Wat</span>
                        <input name="Stats.Wat" />
                    </label>
                    <label>
                        <span>Thm</span>
                        <input name="Stats.Thn" />
                    </label>
                    <label>
                        <span>Ice</span>
                        <input name="Stats.Ice" />
                    </label>
                    <label>
                        <span>Dra</span>
                        <input name="Stats.Dra" />
                    </label>
                    <label>
                        <span>Slots</span>
                        <input name="Stats.Slots" />
                    </label>
                    <label>
                        <span>Skills</span>
                        <input name="Stats.Skills" />
                    </label>

                    <button type="submit">Save</button>
                    <button type="cancel">Cancel</button>
                </form>
            `;
            default:
                return html`<p>No create form for type: ${type}</p>`;
        }
    }


  // I like to keep the styles at the bottom of the class
  static styles = css`
    li {
        grid-column: span 2;
        display: flex;
        justify-content: space-between;
        background-color: var(--color-background-page);
        border: 1px solid var(--color-background-header);
        /*border-bottom: 0.5px solid var(--color-background-header);*/
        padding-left: 20px;
        padding-right: 20px ;
        a {
            color: var(--color-accent);
        }
    }
    
    `
    
    
    
}