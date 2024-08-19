import {LitElement, html, css} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {Task, initialState} from 'https://cdn.jsdelivr.net/npm/@lit/task@1.0.1/+esm'
import {bundeslandNames} from "./bundesland-names.mjs";


class SearchForm extends LitElement {
    static properties = {
        query: {},
    };

    static styles = css`
        table {
            display: block;
            max-width: 100%;
            overflow-y: auto;
        }
    `;

    renderSchoolRow(school) {
        return html`
            <tr>
                <td>${school.id}</td>
                <td>${school.name}</td>
                <td>${school.address}</td>
                <td>${school.zip}</td>
                <td>${school.city}</td>
                <td>${school.website}</td>
                <td>${school.email}</td>
            </tr>
        `
    }

    renderStateFilters() {
        return html`${Object.entries(bundeslandNames).map(([key, name]) => html`
            <label>
                <input type=checkbox name=state value=${key}/>
                ${name}
            </label>`)}`
    }


    render() {
        return html`
            <div>
                <form @submit=${this._submitForm}>
                    <input type="search" name="name"/>
                    <details>
                        <summary> Nach Bundesland filtern</summary>
                        ${this.renderStateFilters()}
                    </details>
                    <button type="submit">Suchen</button>
                </form>
                <div>
                    ${this._dataTask.render({
                        initial: () => html`<span class="initial">
                            Geben Sie einen Namen ein, um nach Schulen zu suchen
            </span>`,
                        pending: () =>
                                html`Lade Schulen...`,
                        complete: (schools) => html`
                            <table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Adresse</th>
                                    <th>PLZ</th>
                                    <th>Stadt</th>
                                    <th>Website</th>
                                    <th>E-Mail</th>
                                </tr>
                                </thead>
                                <tbody>
                                ${schools.map(this.renderSchoolRow.bind(this))}
                                </tbody>
                            </table>
                        `,
                        error: (e) => html`<span class="error">
            Error: ${e.message}
              </span>`,
                    })}
                </div>
            </div>
        `;
    }

    _dataTask = new Task(this, {
        task: async ([query], {signal}) => {
            if (query === undefined) {
                return initialState;
            }
            const response = await fetch(`https://jedeschule.codefor.de/schools/?${query}`);
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        },
        args: () => [this.query]

    })

    _submitForm(e) {
        e.preventDefault()
        const form = this.shadowRoot.querySelector("form");
        const formData = new FormData(form);
        this.query = new URLSearchParams(formData);
        console.log(this.query)
    }
}

customElements.define('search-form', SearchForm);
