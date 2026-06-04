// src/views/equipment-view.ts
import { html, shadow, css } from "@unbndl/html";
import { createView, createViewModel, fromAttributes, View } from "@unbndl/view";
import { fromAuth } from "@unbndl/auth";
import { Store, fromStore } from "@unbndl/store";
import { Model } from "../model.ts";
import { Profile } from "server/models";
import { BrowserHistory } from "@unbndl/switch";
import { Msg } from "../messages.ts";


type ProfileMode = "view" | "edit" | "new";

interface ProfileViewModel {
  username?: string | undefined;
  profile?: Profile;
  userid?: string;
  mode: ProfileMode
  //equipment?: Equipment;
}

type ProfileViewAttributes = {
  mode?: string;
  "user-id"?: string
};


export class ProfileViewElement extends HTMLElement {


  viewModel = createViewModel<ProfileViewModel>({
    mode: "view" as ProfileMode
  })
    .withRenamed(fromAttributes<ProfileViewAttributes>(this), {
      userid: "user-id",
      mode: "mode"
    })
    .with(fromAuth(this), "username")
    .with(fromStore<Model>(this), "profile");

  mainView = createView<Profile>(html`
    ${($) =>
      $.userid === this.viewModel.get("username")
        ? html`
            <button id="edit-mode">Edit</button>
          `
        : ""}
    <h1>Profile</h1>
    <dl>
      <dt>User ID</dt>
      <dd>${($) => $.userid}</dd>
      <dt>Teststring</dt>
      <dd>${($) => $.teststring || ""}</dd>
    </dl>
  `);
  editView = createView<Profile>(html`
    <form>
      <h1>
        Edit Profile
      </h1>
      <dl>
        <dt id="userid-label">User ID</dt>
        <dd>
            <input disabled name="userid"
              value=${($) => $.userid}
              aria-labelled-by="userid-label"/>
        </dd>
        <dt id="teststring-label">Teststring</dt>
        <dd>
            <input name="teststring"
              value=${($) => $.teststring || ""}
              aria-labelled-by="teststring-label"/>
        </dd>
      </dl>
      <button id="cancel" type="button">Cancel</button>
      <button type="submit">Save</button>
     </form>
  `);

  view = createView<ProfileViewModel>(html`
      <section>
        ${($) => $.profile
          ? View.apply(
            $.mode === "view" ? this.mainView : this.editView,
            $.profile)
          : ""}
      </section>
    `);

  navigateToMode(mode: ProfileMode) {
    const userid = this.viewModel.$.userid
    BrowserHistory.dispatch(this, "history/navigate", {
      href: `/app/profile/${userid}?mode=${mode}`
    });
  }


  constructor() {
    super();

    

    shadow(this)
      .styles(css`
        :host {
          grid-column: 1 / -1;
          display: block;
        }
      `)
      .replace(this.viewModel.render(this.view))
      .delegate("#edit-mode", {
        click: () => this.navigateToMode("edit")
      })
      .delegate("#cancel", {
        click: () => this.navigateToMode("view")
      })
      .listen({
        submit: (ev: Event) => this.submitForm(ev)
      });
  

  this.viewModel.createEffect(($) => {
        if ($.userid) {
          console.log("GET EVENT DISPATCHED! for user:", $.userid);
          Store.dispatch(this, ["profile/get", { userid: $.userid }]);
        }
      });
  }

  dispatch(msg: Msg) {
    Store.dispatch<Msg>(this, msg);
  }


  submitForm(ev: Event) {
    ev.preventDefault();

    const form = ev.target as HTMLFormElement;
    const json: object = this.formDataToJSON(form);
    const userid = this.viewModel.$.userid;

    if (userid)
      this.dispatch([
        "profile/save",
        { userid, profile: json as Profile },
        {
          onSuccess: () =>
            BrowserHistory.dispatch(this, "history/navigate", {
              href: `/app/profile/${userid}`
            }),
          onFailure: (error: Error) =>
            console.log("ERROR:", error)
        }
      ]);
  }

  formDataToJSON(form: HTMLFormElement): object {
    const inputs = Array.from(form.elements).filter(
      (el) => "name" in el // exclude unnamed things like buttons
    ) as Array<HTMLInputElement>;

    const entries = inputs.map((el) => [el.name, el.value]);
    return Object.fromEntries(entries);
  }
}