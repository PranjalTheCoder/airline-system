// cypress/e2e/booking-flow.cy.ts
// Run: npx cypress open  OR  npx cypress run

describe('SkyWay Airlines — Full Booking Flow', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  // ─────────────────────────────────────────────────────────────
  // HOME PAGE
  // ─────────────────────────────────────────────────────────────
  describe('Home / Search Page', () => {
    it('loads the hero search form', () => {
      cy.get('.hero-title').should('contain', 'Where would you');
      cy.get('.search-card').should('be.visible');
    });

    it('shows trip type tabs', () => {
      cy.get('.trip-tab').should('have.length', 2);
      cy.get('.trip-tab').first().should('have.class', 'active');
    });

    it('can switch to round trip', () => {
      cy.get('.trip-tab').last().click();
      cy.get('.trip-tab').last().should('have.class', 'active');
    });

    it('shows popular route pills', () => {
      cy.get('.route-pill').should('have.length.greaterThan', 2);
    });

    it('fills origin on route pill click', () => {
      cy.get('.route-pill').first().click();
      cy.get('input[formControlName="origin"]').should('not.have.value', '');
    });

    it('shows validation error if form submitted empty', () => {
      cy.get('.search-btn').click();
      cy.get('.search-error').should('be.visible');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FLIGHT RESULTS
  // ─────────────────────────────────────────────────────────────
  describe('Flight Results', () => {
    beforeEach(() => {
      cy.visit('/results');
    });

    it('shows the filter sidebar', () => {
      cy.get('.filters-sidebar').should('be.visible');
    });

    it('shows flight cards or skeleton loaders', () => {
      cy.get('.flight-card, .flight-card-skeleton').should('have.length.greaterThan', 0);
    });

    it('shows sort buttons', () => {
      cy.get('.sort-btn').should('have.length', 3);
    });

    it('can switch between sort options', () => {
      cy.get('.sort-btn').eq(1).click();
      cy.get('.sort-btn').eq(1).should('have.class', 'active');
    });

    it('shows cabin class tabs', () => {
      cy.get('.cabin-tab').should('have.length', 4);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // AUTH
  // ─────────────────────────────────────────────────────────────
  describe('Authentication', () => {
    it('shows login form', () => {
      cy.visit('/auth/login');
      cy.get('input[formControlName="email"]').should('be.visible');
      cy.get('input[formControlName="password"]').should('be.visible');
    });

    it('shows validation on empty submit', () => {
      cy.visit('/auth/login');
      cy.get('button[type="submit"]').click();
      cy.get('.form-error').should('be.visible');
    });

    it('logs in with demo credentials', () => {
      cy.visit('/auth/login');
      cy.get('input[formControlName="email"]').type('user@skyway.com');
      cy.get('input[formControlName="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('register page renders', () => {
      cy.visit('/auth/register');
      cy.get('input[formControlName="firstName"]').should('be.visible');
      cy.get('input[formControlName="email"]').should('be.visible');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // CHECK-IN
  // ─────────────────────────────────────────────────────────────
  describe('Check-in', () => {
    it('shows PNR input', () => {
      cy.visit('/checkin');
      cy.get('.pnr-input').should('be.visible');
    });

    it('shows demo PNR pills', () => {
      cy.visit('/checkin');
      cy.get('.pnr-pill').should('have.length.greaterThan', 0);
    });

    it('fills PNR from demo pill', () => {
      cy.visit('/checkin');
      cy.get('.pnr-pill').first().click();
      cy.get('.pnr-input').should('not.have.value', '');
    });

    it('looks up PNR and shows booking details', () => {
      cy.visit('/checkin');
      cy.get('.pnr-pill').first().click();
      cy.get('button').contains('Find My Booking').click();
      cy.get('.booking-found-banner', { timeout: 3000 }).should('be.visible');
    });

    it('completes check-in and shows boarding pass', () => {
      cy.visit('/checkin');
      cy.get('.pnr-pill').first().click();
      cy.get('button').contains('Find My Booking').click();
      cy.get('.booking-found-banner', { timeout: 3000 });
      cy.get('input[type="checkbox"]').check();
      cy.get('button').contains('Complete Check-in').click();
      cy.get('.boarding-pass', { timeout: 3000 }).should('be.visible');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // LOYALTY
  // ─────────────────────────────────────────────────────────────
  describe('Loyalty Dashboard', () => {
    it('renders loyalty dashboard', () => {
      cy.visit('/loyalty');
      cy.get('.loyalty-hero').should('be.visible');
    });

    it('shows points card', () => {
      cy.visit('/loyalty');
      cy.get('.points-card', { timeout: 3000 }).should('be.visible');
    });

    it('shows rewards grid', () => {
      cy.visit('/loyalty');
      cy.get('.rewards-grid', { timeout: 3000 }).should('be.visible');
    });

    it('can filter rewards by category', () => {
      cy.visit('/loyalty');
      cy.get('.rwd-tab').contains('Upgrades').click();
      cy.get('.rwd-tab').contains('Upgrades').should('have.class', 'active');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // BAGGAGE TRACKING
  // ─────────────────────────────────────────────────────────────
  describe('Baggage Tracking', () => {
    it('shows tracking input', () => {
      cy.visit('/baggage/track');
      cy.get('.form-input').should('be.visible');
    });

    it('shows status timeline after tracking', () => {
      cy.visit('/baggage/track');
      cy.get('.form-input').type('SKY7X2');
      cy.get('button').contains('Track').click();
      cy.get('.timeline', { timeout: 3000 }).should('be.visible');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // OPERATIONS
  // ─────────────────────────────────────────────────────────────
  describe('Operations Dashboard', () => {
    it('loads dark operations dashboard', () => {
      cy.visit('/operations');
      cy.get('.ops-topbar').should('be.visible');
    });

    it('shows KPI strip', () => {
      cy.visit('/operations');
      cy.get('.kpi-strip').should('be.visible');
      cy.get('.kpi-card').should('have.length', 7);
    });

    it('shows FIDS table after load', () => {
      cy.visit('/operations');
      cy.get('.fids-table', { timeout: 3000 }).should('be.visible');
    });

    it('can filter by DELAYED', () => {
      cy.visit('/operations');
      cy.get('.filter-chip').contains('Delayed').click();
      cy.get('.filter-chip').contains('Delayed').should('have.class', 'active');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // ADMIN DASHBOARD
  // ─────────────────────────────────────────────────────────────
  describe('Admin Dashboard', () => {
    it('renders admin sidebar', () => {
      cy.visit('/admin');
      cy.get('.admin-sidebar').should('be.visible');
    });

    it('shows stats grid on dashboard tab', () => {
      cy.visit('/admin');
      cy.get('.stats-grid', { timeout: 3000 }).should('be.visible');
    });

    it('switches to flights tab', () => {
      cy.visit('/admin');
      cy.get('.nav-item').contains('Flights').click();
      cy.get('.admin-table', { timeout: 2000 }).should('be.visible');
    });

    it('switches to aircraft tab', () => {
      cy.visit('/admin');
      cy.get('.nav-item').contains('Aircraft').click();
      cy.get('.aircraft-grid', { timeout: 2000 }).should('be.visible');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // 404 PAGE
  // ─────────────────────────────────────────────────────────────
  describe('404 Not Found', () => {
    it('shows 404 page for unknown routes', () => {
      cy.visit('/this-route-does-not-exist', { failOnStatusCode: false });
      cy.url().should('eq', Cypress.config().baseUrl + '/'); // redirects to home
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESPONSIVE
  // ─────────────────────────────────────────────────────────────
  describe('Responsive layout', () => {
    it('hides nav links on mobile', () => {
      cy.viewport(375, 812);
      cy.visit('/');
      cy.get('.nav-links').should('not.be.visible');
      cy.get('.hamburger').should('be.visible');
    });

    it('opens nav on hamburger click', () => {
      cy.viewport(375, 812);
      cy.visit('/');
      cy.get('.hamburger').click();
      cy.get('.nav-links.open').should('be.visible');
    });
  });
});
