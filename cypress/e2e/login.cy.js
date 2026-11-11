/**
 * Skenario pengujian E2E - Alur Login:
 *
 * 1. Halaman login menampilkan form dengan judul, input email, password, dan tombol Login
 * 2. Login berhasil dengan kredensial valid → redirect ke homepage
 * 3. Login gagal dengan kredensial tidak valid → menampilkan pesan error
 */

const API_BASE = 'https://forum-api.dicoding.dev/v1';

describe('Login Flow', () => {
  beforeEach(() => {
    // Mock API: ambil daftar thread (dipanggil setelah login berhasil)
    cy.intercept('GET', `${API_BASE}/threads`, {
      statusCode: 200,
      body: { status: 'success', data: { threads: [] } },
    }).as('getThreads');

    cy.intercept('GET', `${API_BASE}/users`, {
      statusCode: 200,
      body: { status: 'success', data: { users: [] } },
    }).as('getUsers');
  });

  it('1. halaman login menampilkan form dengan elemen yang diperlukan', () => {
    cy.visit('/login');

    cy.get('h1').should('contain.text', 'Login');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('contain.text', 'Login');
    cy.get('a').should('contain.text', 'Register');
  });

  it('2. login berhasil → redirect ke homepage', () => {
    cy.intercept('POST', `${API_BASE}/login`, {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'User logged in',
        data: { token: 'mock-token-xyz' },
      },
    }).as('loginRequest');

    cy.intercept('GET', `${API_BASE}/users/me`, {
      statusCode: 200,
      body: {
        status: 'success',
        data: {
          user: {
            id: 'user-test',
            name: 'Test User',
            email: 'test@example.com',
            avatar: 'https://ui-avatars.com/api/?name=Test+User',
          },
        },
      },
    }).as('getMe');

    cy.visit('/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest');
    cy.wait('@getMe');

    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });

  it('3. login gagal → menampilkan pesan error dari server', () => {
    cy.intercept('POST', `${API_BASE}/login`, {
      statusCode: 400,
      body: {
        status: 'fail',
        message: 'email or password is wrong',
      },
    }).as('loginFailed');

    cy.visit('/login');
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailed');
    cy.contains('email or password is wrong').should('be.visible');
    cy.url().should('include', '/login');
  });
});
