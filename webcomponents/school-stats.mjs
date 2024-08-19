import {html, LitElement} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import {Task} from 'https://cdn.jsdelivr.net/npm/@lit/task@1.0.1/+esm'
import {bundeslandNames} from "./bundesland-names.mjs";


export class SchoolStats extends LitElement {
    _statsTask = new Task(this, {
        task: async ([], {signal}) => {
            const response = await fetch('https://jedeschule.codefor.de/stats');
            if (!response.ok) {
                throw new Error(response.status);
            }
            return response.json();
        },
        args: () => []
    });


    render() {
        return this._statsTask.render({
            pending: () => html`<p>Lade Daten...</p>`,
            complete: (stats) => html`
                <table>
                    <thead>
                    <tr>
                        <th>Bundesland</th>
                        <th>Schulanzahl</th>
                    </tr>
                    </thead>
                    <tbody>
                    ${stats.map(entry => html`
                        <tr>
                            <td>${bundeslandNames[entry.state]}</td>
                            <td>${entry.count}</td>
                        </tr>`)}
                    </tbody>
                </table>

            `,

            error: (e) => html`<p>Error: ${e}</p>`

        });
    }
}

customElements.define('school-stats', SchoolStats);
