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


type ItemDetailAttributes = {
  userid?: string;
  cat?: "Weapons" | "Armor" | "";
  type?: string;
  itemname?: string;
  mode?: string;
}

interface ItemDetailViewModel {
  userid: string;
  cat: "Weapons" | "Armor" | "";
  type: string;
  itemname: string;
  mode: string;
  stats: Record<string, string> | null;
}
export class ItemDetailElement extends HTMLElement {

    viewModel = createViewModel<ItemDetailViewModel>({
        userid: "",
        cat: "",
        type: "",
        itemname: "",
        mode: "view",
        stats: null,
    }).with(fromAttributes<ItemDetailAttributes>(this), "userid", "type", "itemname", "mode", "cat")
    .with(fromStore<Model>(this), "stats");

    view = createView<ItemDetailViewModel>(html`
        <section>
        
            ${($) =>
                $.mode === "edit"
                ? this.renderEditForm($)
                : this.renderItemStats($)}
        </section>
    `);
    constructor() {
        super();
        shadow(this)
        .styles(reset.styles, ItemDetailElement.styles)
        .replace(this.viewModel.render(this.view))
        .delegate("form", {
            submit: (ev: SubmitEvent) => this.submitEdit(ev)
        })
        .delegate(".cancel", {
            click: () => this.navigateToMode("view")
        });

        this.viewModel.createEffect(($) => {
            if ($.userid && $.cat && $.type && $.itemname) {
                Store.dispatch(this, [
                "equipment/item/get",
                {
                    userid: $.userid,
                    type: $.type,
                    itemname: $.itemname,
                    cat: $.cat,
                }
                ]);
            }
        });
    }

    dispatch(msg: Msg) {
        Store.dispatch<Msg>(this, msg);
    }
   
   
    submitEdit(ev: SubmitEvent) {
        ev.preventDefault();

        const form = ev.target as HTMLFormElement;
        const formData = new FormData(form);
        const stats = Object.fromEntries(formData.entries()) as Record<string, string>;

        const $ = this.viewModel.toObject();

        Store.dispatch(this, [
            "equipment/item/save",
            {
            userid: $.userid,
            cat: $.cat,
            type: $.type,
            itemname: $.itemname,
            stats
            }
        ]);

        this.navigateToMode("view");
    }

    navigateToMode(mode: "view" | "edit") {
    const userid = encodeURIComponent(this.viewModel.$.userid)
    const cat = encodeURIComponent(this.viewModel.$.cat)
    const type = encodeURIComponent(this.viewModel.$.type)
    const itemname = encodeURIComponent(this.viewModel.$.itemname)

    BrowserHistory.dispatch(this, "history/navigate", {
        href: `/app/${userid}/${cat}/${type}/${itemname}?mode=${mode}`
    });
    }
   
    formDataToJSON(form: HTMLFormElement): object {
        const inputs = Array.from(form.elements).filter(
            (el) => "name" in el // exclude unnamed things like buttons
        ) as Array<HTMLInputElement>;

        const entries = inputs.map((el) => [el.name, el.value]);
        return Object.fromEntries(entries);
    }

    renderEditForm($: ItemDetailViewModel) {
        if (!$.stats) {
            return html`<p>Loading item stats...</p>`;
        }

        return html`
            <nav>
                <a href=${`/app/${encodeURIComponent($.userid)}`}>
                ← Back to Equipment
                </a>
            </nav>
            <h2>Edit ${$.itemname}</h2>

            <form>
            ${Object.entries($.stats).map(
                ([key, value]) => html`
                <label>
                    <span>${key}</span>
                    <input name=${key} value=${value} />
                </label>
                `
            )}

            <button type="submit">Save</button>
            <button type="cancel">Cancel</button>
            
            </form>
        `;
    }

    renderItemStats($: ItemDetailViewModel) {
        if (!$.stats) {
            return html`<p>Loading item stats...</p>`;
        }

        return html`
            <nav>
                <a href=${`/app/${encodeURIComponent($.userid)}`}>
                ← Back to Equipment
                </a>
            </nav>
            <h2>${$.itemname}</h2>

            <p>
            <a href=${`/app/${encodeURIComponent($.userid)}/${encodeURIComponent($.cat)}/${encodeURIComponent($.type)}/${encodeURIComponent($.itemname)}?mode=edit`}>
                Edit
            </a>
            </p>

            <dl>
            ${Object.entries($.stats).map(
                ([key, value]) => html`
                <dt>${key}</dt>
                <dd>${value}</dd>
                `
            )}
            </dl>
        `;
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