// proto/public/js/header.js
import { css, html, shadow } from "@unbndl/html";
import { createViewModel } from "@unbndl/view";
import { Auth, fromAuth } from "@unbndl/auth";
import reset from "./styles/reset.css.js";

export class HeaderElement extends HTMLElement {
  viewModel = createViewModel({
  authenticated: false,
  username: ""
}).with(fromAuth(this), "authenticated", "username");

  constructor() {
    super();

    shadow(this)
      .styles(reset.styles, HeaderElement.styles)
      .replace(this.viewModel.render(this.view))
      .delegate(".when-signed-in button", {
        click: () => this.signout()
      });
  

    this.viewModel.createEffect(($) => {
        console.log("header auth state:", $);
        });
  }

  view = html`
    <header>
      <h1>Monster Hunter Set Builder</h1>
      <nav
        class=${($) =>
          $.authenticated ? "logged-in" : "logged-out"}>
        <p>Hello, ${($) => $.username || "traveler"}</p>
        <menu>
          <li class="when-signed-in">
            <button>Sign Out</button>
          </li>
          <li class="when-signed-out">
            <a href="/login.html">Sign In</a>
          </li>
        </menu>
      </nav>
    </header>
  `;

    get authorization() {
        const $ = this.viewModel.toObject();
        if ($.authenticated)
            return { Authorization: `Bearer ${$.token}` };
        else return {};
    }

    signout() {
    const customEvent = new CustomEvent("auth:message", {
        bubbles: true,
        composed: true,
        detail: ["auth/signout"]
    });
    this.dispatchEvent(customEvent);
    }

  // in class HeaderElement
    static styles = css`
    /* add any other CSS your header requires */
    
    li {
        display: none;
    }
    .logged-in .when-signed-in,
    .logged-out .when-signed-out {
        display: block;
    }
    `;
}