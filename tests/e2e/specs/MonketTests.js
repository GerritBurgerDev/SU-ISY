import { createHorde } from 'gremlins.js';

describe('Run gremlins.js inside a cypress test', () => {
    let horde;
    beforeEach(() =>
        cy.window().then((testedWindow) => {
            horde = createHorde({ window: testedWindow });
        })
    );
    it('should run gremlins.js', () => {
        return cy.wrap(horde.unleash()).then(() => {
            /* ... */
        });
    });
});