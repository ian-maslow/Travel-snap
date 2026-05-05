import { LitElement, html, css } from 'lit';
import { DDDSuper } from '@haxtheweb/d-d-d/d-d-d.js';

export class TravelSnap extends LitElement {

  static get tag() {
    return 'travel-snap';
  }

  constructor() {
    super();
    this.items = [];
    this.activeIndex = 0;
    this.loading = false;
    this.source = new URL('./data.json', import.meta.url).href;
  }

  static get properties() {
    return {
      items: { type: Array },
      activeIndex: { type: Number },
      loading: { type: Boolean, reflect: true },
      source: { type: String },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    const params = new URLSearchParams(window.location.search);
    if (params.has('activeIndex')) {
      this.activeIndex = parseInt(params.get('activeIndex'));
    }
    this.fetchData();
  }

  async fetchData() {
    this.loading = true;
    try {
      const res = await fetch(this.source);
      const json = await res.json();
      this.items = json.items || [];
    } catch(e) {
      console.error('Failed to load data', e);
    }
    this.loading = false;
  }

  updateURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('activeIndex', this.activeIndex);
    window.history.pushState({}, '', url);
  }

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.updateURL();
    }
  }

  next() {
    if (this.activeIndex < this.items.length - 1) {
      this.activeIndex++;
      this.updateURL();
    }
  }

  toggleLike(id) {
    const likes = JSON.parse(localStorage.getItem('travel-snap-likes') || '{}');
    likes[id] = !likes[id];
    localStorage.setItem('travel-snap-likes', JSON.stringify(likes));
    this.requestUpdate();
  }

  isLiked(id) {
    const likes = JSON.parse(localStorage.getItem('travel-snap-likes') || '{}');
    return !!likes[id];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        font-family: var(--ddd-font-primary, sans-serif);
        background: var(--ddd-theme-default-potentialMidnight, #1a1a2e);
        min-height: 100vh;
        padding: var(--ddd-spacing-8, 32px);
        box-sizing: border-box;
      }

      .gallery-title {
        text-align: center;
        color: var(--ddd-theme-default-white, #ffffff);
        font-size: var(--ddd-font-size-xl, 2rem);
        margin-bottom: var(--ddd-spacing-6, 24px);
        letter-spacing: 2px;
        text-transform: uppercase;
      }

      .card {
        max-width: 480px;
        margin: 0 auto;
        background: var(--ddd-theme-default-white, #ffffff);
        border-radius: var(--ddd-radius-lg, 16px);
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }

      .card-header {
        display: flex;
        align-items: center;
        padding: var(--ddd-spacing-4, 16px);
        gap: var(--ddd-spacing-3, 12px);
        border-bottom: 1px solid #eee;
      }

      .avatar {
        width: 42px;
        height: 42px;
        border-radius: 50%;
        object-fit: cover;
        border: 2px solid var(--ddd-theme-default-beaverBlue, #1e407c);
      }

      .author-info {
        display: flex;
        flex-direction: column;
      }

      .author-name {
        font-weight: bold;
        font-size: 14px;
        color: #222;
      }

      .author-channel {
        font-size: 12px;
        color: #888;
      }

      .card-image-wrapper {
        width: 100%;
        aspect-ratio: 1;
        overflow: hidden;
        background: #111;
        position: relative;
      }

      .card-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: opacity 0.3s;
      }

      .card-image[loading] {
        opacity: 0;
      }

      .card-body {
        padding: var(--ddd-spacing-4, 16px);
      }

      .card-title {
        font-size: 16px;
        font-weight: bold;
        color: #222;
        margin: 0 0 6px 0;
      }

      .card-description {
        font-size: 14px;
        color: #555;
        margin: 0 0 8px 0;
        line-height: 1.5;
      }

      .card-date {
        font-size: 11px;
        color: #aaa;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .card-actions {
        display: flex;
        align-items: center;
        padding: var(--ddd-spacing-3, 12px) var(--ddd-spacing-4, 16px);
        gap: var(--ddd-spacing-3, 12px);
        border-top: 1px solid #eee;
      }

      .like-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 24px;
        padding: 0;
        transition: transform 0.1s;
      }

      .like-btn:hover {
        transform: scale(1.2);
      }

      .share-btn {
        background: var(--ddd-theme-default-beaverBlue, #1e407c);
        color: white;
        border: none;
        border-radius: var(--ddd-radius-sm, 8px);
        padding: 6px 16px;
        cursor: pointer;
        font-size: 13px;
        margin-left: auto;
      }

      .share-btn:hover {
        opacity: 0.85;
      }

      .nav {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--ddd-spacing-6, 24px);
        margin-top: var(--ddd-spacing-6, 24px);
      }

      .nav-btn {
        background: var(--ddd-theme-default-beaverBlue, #1e407c);
        color: white;
        border: none;
        border-radius: var(--ddd-radius-sm, 8px);
        padding: 10px 28px;
        cursor: pointer;
        font-size: 15px;
        transition: opacity 0.2s;
      }

      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .nav-btn:hover:not(:disabled) {
        opacity: 0.85;
      }

      .counter {
        color: var(--ddd-theme-default-white, #fff);
        font-size: 14px;
      }

      .loading-msg {
        text-align: center;
        color: white;
        font-size: 18px;
        margin-top: 40px;
      }

      @media (max-width: 520px) {
        :host {
          padding: var(--ddd-spacing-4, 16px);
        }
        .card {
          max-width: 100%;
        }
      }

      @media (prefers-color-scheme: dark) {
        .card {
          background: #1e1e2e;
        }
        .card-title {
          color: #fff;
        }
        .card-description {
          color: #ccc;
        }
        .card-header {
          border-bottom-color: #333;
        }
        .card-actions {
          border-top-color: #333;
        }
      }
    `;
  }

  render() {
    if (this.loading) {
      return html`<p class="loading-msg">Loading...</p>`;
    }

    if (!this.items.length) {
      return html`<p class="loading-msg">No photos found.</p>`;
    }

    const item = this.items[this.activeIndex];
    const liked = this.isLiked(item.id);

    return html`
      <h1 class="gallery-title">Travel Snap</h1>
      <div class="card">
        <div class="card-header">
          <img
            class="avatar"
            src="${item.author.image}"
            alt="${item.author.name}"
          />
          <div class="author-info">
            <span class="author-name">${item.author.name}</span>
            <span class="author-channel">${item.author.channel} · since ${item.author.userSince}</span>
          </div>
        </div>

        <div class="card-image-wrapper">
          <img
            class="card-image"
            src="${item.fullSrc}"
            alt="${item.title}"
            loading="lazy"
          />
        </div>

        <div class="card-body">
          <p class="card-title">${item.title}</p>
          <p class="card-description">${item.description}</p>
          <span class="card-date">${item.dateTaken}</span>
        </div>

        <div class="card-actions">
          <button
            class="like-btn"
            @click="${() => this.toggleLike(item.id)}"
            title="${liked ? 'Unlike' : 'Like'}"
          >${liked ? '❤️' : '🤍'}</button>

          <button
            class="share-btn"
            @click="${() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}"
          >Share</button>
        </div>
      </div>

      <div class="nav">
        <button class="nav-btn" @click="${this.prev}" ?disabled="${this.activeIndex === 0}">← Prev</button>
        <span class="counter">${this.activeIndex + 1} / ${this.items.length}</span>
        <button class="nav-btn" @click="${this.next}" ?disabled="${this.activeIndex === this.items.length - 1}">Next →</button>
      </div>
    `;
  }
}

globalThis.customElements.define(TravelSnap.tag, TravelSnap);