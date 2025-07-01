import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/*
  Color Palette (used in CSS variables and inline for components):
   Primary:   #1a202c
   Secondary: #2d3748
   Accent:    #f6ad55
*/

/** PUBLIC_INTERFACE
 * SidebarNav: Sidebar navigation component
 */
function SidebarNav({ navSections, currentSection, onChange }) {
  return (
    <nav className="sidebar-nav" aria-label="Sidebar Navigation">
      <div className="sidebar-title">NumismatiQ</div>
      <ul>
        {navSections.map(({ key, label, icon }) => (
          <li key={key}>
            <button
              className={`sidebar-link${currentSection === key ? " active" : ""}`}
              onClick={() => onChange(key)}
              aria-current={currentSection === key ? "page" : undefined}
            >
              <span className="sidebar-icon">{icon}</span>
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** PUBLIC_INTERFACE
 * CatalogImport: Catalog import/upload view and logic
 */
function CatalogImport({ onUpload, loading, uploadErr, lastCatalogFilename, lastCatalogTimestamp }) {
  const fileInputRef = useRef();

  // PUBLIC_INTERFACE
  const handleCatalogFile = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="main-section">
      <h2>Import Catalog</h2>
      <p>
        Upload a numismatic catalog file.<br />
        <span className="file-accept-note">
          Accepted formats: <strong>Images</strong> (jpg, png, etc.) or <strong>PDF</strong>
        </span>
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleCatalogFile}
        aria-label="Upload catalog file"
      />
      <button className="accent-btn"
        onClick={() => fileInputRef.current.click()}
        disabled={!!loading}
      >
        {loading ? <span className="loader" /> : "Select Catalog File"}
      </button>
      {lastCatalogFilename && (
        <div className="last-upload-info">
          Last uploaded: <strong>{lastCatalogFilename}</strong>
          {lastCatalogTimestamp && (
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-secondary)" }}>
              ({new Date(lastCatalogTimestamp).toLocaleString()})
            </span>
          )}
        </div>
      )}
      {uploadErr && <div className="alert alert-error">{uploadErr}</div>}
    </div>
  );
}

/** PUBLIC_INTERFACE
 * ImageUpload: Upload an item image for matching
 */
function DocumentUpload({ onUpload, uploading, uploadErr, matchedItem, noMatch, itemDetails, onReset }) {
  const fileInputRef = useRef();

  // PUBLIC_INTERFACE
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div className="main-section">
      <h2>Match Item</h2>
      <p>
        Upload a photo or PDF document to match it with your coin catalog.<br />
        <span className="file-accept-note">
          Accepted formats: <strong>Images</strong> (jpg, png, etc.) or <strong>PDF</strong>
        </span>
      </p>
      <input
        type="file"
        accept="image/*,.pdf"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
        aria-label="Upload coin image or PDF"
      />
      {(!matchedItem && !itemDetails && !noMatch) && (
        <button className="accent-btn"
          onClick={() => fileInputRef.current.click()}
          disabled={!!uploading}
        >
          {uploading ? <span className="loader" /> : "Select File"}
        </button>
      )}
      {uploadErr && <div className="alert alert-error">{uploadErr}</div>}
      {itemDetails && (
        <ItemDetails details={itemDetails} onClose={onReset} />
      )}
      {noMatch && (
        <div className="alert alert-warning" style={{ margin: '32px 0' }}>
          No item found matching this image in the catalog.
          <button className="secondary-btn" onClick={onReset} style={{ marginLeft: 16 }}>
            Try Another Image
          </button>
        </div>
      )}
    </div>
  );
}

/** PUBLIC_INTERFACE
 * CatalogListing: Table view of catalog items
 */
function CatalogListing({ items, loading, error }) {
  const [sortKey, setSortKey] = useState(null);
  const [ascending, setAscending] = useState(true);
  const [query, setQuery] = useState("");

  // PUBLIC_INTERFACE
  const handleSort = (key) => {
    setAscending(sortKey === key ? !ascending : true);
    setSortKey(key);
  };
  const filtered = query
    ? items.filter((item) =>
        (item.name || "")
          .toLowerCase()
          .includes(query.trim().toLowerCase())
      )
    : items;

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey) return 0;
    if (a[sortKey] < b[sortKey]) return ascending ? -1 : 1;
    if (a[sortKey] > b[sortKey]) return ascending ? 1 : -1;
    return 0;
  });

  if (loading) { return <div className="main-section"><span className="loader" /> Loading catalog...</div>; }
  if (error) { return <div className="main-section"><div className="alert alert-error">{error}</div></div>; }

  return (
    <div className="main-section">
      <h2>Catalog Items</h2>
      <div className="catalog-actions">
        <input
          type="text"
          placeholder="Search by name..."
          className="catalog-search"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>
      <div className="catalog-table-scroll">
      <table className="catalog-table">
        <thead>
          <tr>
            <th>
              <button className="sort-btn" onClick={() => handleSort("name")}>Name{sortKey === "name" ? (ascending ? " ▲" : " ▼") : ""}</button>
            </th>
            <th>
              <button className="sort-btn" onClick={() => handleSort("type")}>Type{sortKey === "type" ? (ascending ? " ▲" : " ▼") : ""}</button>
            </th>
            <th>
              <button className="sort-btn" onClick={() => handleSort("year")}>Year{sortKey === "year" ? (ascending ? " ▲" : " ▼") : ""}</button>
            </th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
        {sorted.length === 0 && (
          <tr>
            <td colSpan={4}>
              <em>No items found</em>
            </td>
          </tr>
        )}
        {sorted.map((item, i) => (
          <tr key={i}>
            <td>{item.name}</td>
            <td>{item.type}</td>
            <td>{item.year}</td>
            <td>{item.country}</td>
          </tr>
        ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * ItemDetails: Details panel for a matched item
 */
function ItemDetails({ details, onClose }) {
  return (
    <div className="item-details-panel">
      <h3>Matched Item</h3>
      <div className="item-details-grid">
        <div>
          <strong>Name:</strong>
          <div>{details.name}</div>
        </div>
        <div>
          <strong>Type:</strong>
          <div>{details.type}</div>
        </div>
        <div>
          <strong>Year:</strong>
          <div>{details.year}</div>
        </div>
        <div>
          <strong>Country:</strong>
          <div>{details.country}</div>
        </div>
        <div>
          <strong>Description:</strong>
          <div>{details.description}</div>
        </div>
      </div>
      {details.image_url && (
        <img src={details.image_url} alt="Identified coin" className="item-detail-img" />
      )}
      <button className="secondary-btn" onClick={onClose} style={{ marginTop: 20 }}>Close</button>
    </div>
  );
}

/** PUBLIC_INTERFACE
 * API functions - handles backend communication.
 */
const API_BASE = "/api";
async function uploadCatalogFile(file) {
  /* PUBLIC_INTERFACE: Uploads catalog file to backend. Returns {success, filename, timestamp}. */
  const form = new FormData();
  form.append("catalog", file);
  const res = await fetch(`${API_BASE}/catalog/import`, {
    method: "POST",
    body: form
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
async function matchCoinDocument(file) {
  /* PUBLIC_INTERFACE: Uploads coin image or PDF for matching. Returns match result or {not_found: true}. */
  const form = new FormData();
  form.append("document", file);
  const res = await fetch(`${API_BASE}/match`, {
    method: "POST",
    body: form
  });
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}
async function fetchCatalogItems() {
  /* PUBLIC_INTERFACE: Fetch list of catalog items. */
  const res = await fetch(`${API_BASE}/catalog/items`);
  if (!res.ok) throw new Error(await res.text());
  return await res.json();
}

// PUBLIC_INTERFACE
function App() {
  // Section navigation state
  const NAV_SECTIONS = [
    { key: "catalog", label: "Catalog", icon: "📚" },
    { key: "match", label: "Match Item", icon: "🖼️" },
    { key: "listing", label: "Catalog Listing", icon: "🔎" }
  ];
  const [section, setSection] = useState("catalog");

  // Theme (auto, light/dark toggle)
  const [theme, setTheme] = useState(() =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  );
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  useEffect(() => {
    // Listen for OS color theme changes for "auto" support
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = e => setTheme(e.matches ? "dark" : "light");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // Catalog file state
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogUploadError, setCatalogUploadError] = useState("");
  const [catalogFilename, setCatalogFilename] = useState("");
  const [catalogTimestamp, setCatalogTimestamp] = useState(null);

  // Catalog listing
  const [catalogItems, setCatalogItems] = useState([]);
  const [catalogListError, setCatalogListError] = useState("");
  const [catalogListLoading, setCatalogListLoading] = useState(false);

  // Image matching state
  const [imgUploading, setImgUploading] = useState(false);
  const [imgError, setImgError] = useState("");
  const [matchedItem, setMatchedItem] = useState(null);
  const [itemDetails, setItemDetails] = useState(null);
  const [itemNotFound, setItemNotFound] = useState(false);

  // Functions for each section
  const handleCatalogUpload = async (file) => {
    setCatalogLoading(true);
    setCatalogUploadError("");
    try {
      const res = await uploadCatalogFile(file);
      setCatalogFilename(res.filename || file.name);
      setCatalogTimestamp(res.timestamp ? res.timestamp : Date.now());
      setSection("listing");
      // Optionally reload catalog listing after upload
      fetchAndSetCatalogItems();
    } catch (err) {
      setCatalogUploadError("Failed to upload catalog: " + err.message);
    } finally {
      setCatalogLoading(false);
    }
  };

  const fetchAndSetCatalogItems = async () => {
    setCatalogListLoading(true);
    setCatalogListError("");
    try {
      const res = await fetchCatalogItems();
      setCatalogItems(Array.isArray(res.items) ? res.items : []);
    } catch (err) {
      setCatalogListError("Failed to load catalog listing: " + err.message);
    } finally {
      setCatalogListLoading(false);
    }
  };

  // On section change, optionally refresh catalog listing
  useEffect(() => {
    if (section === "listing") {
      fetchAndSetCatalogItems();
    }
  // eslint-disable-next-line
  }, [section]);

  const handleDocUpload = async (file) => {
    setImgUploading(true);
    setImgError(""); setMatchedItem(null); setItemDetails(null); setItemNotFound(false);
    try {
      const res = await matchCoinDocument(file);
      if (res.not_found || !res.item) {
        setItemNotFound(true);
        setMatchedItem(null);
        setItemDetails(null);
      } else {
        setMatchedItem(res.item);
        setItemDetails(res.item);
        setItemNotFound(false);
      }
    } catch (err) {
      setImgError("Image match failed: " + err.message);
    } finally {
      setImgUploading(false);
    }
  };

  const handleResetMatch = () => {
    setImgError(""); setMatchedItem(null); setItemDetails(null); setItemNotFound(false);
  };

  // Layout
  return (
    <div className="numismatiq-root">
      <SidebarNav
        navSections={NAV_SECTIONS}
        currentSection={section}
        onChange={setSection}
      />
      <main className="app-main-section">
        <button
          className="theme-toggle"
          type="button"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        {section === "catalog" && (
          <CatalogImport
            onUpload={handleCatalogUpload}
            loading={catalogLoading}
            uploadErr={catalogUploadError}
            lastCatalogFilename={catalogFilename}
            lastCatalogTimestamp={catalogTimestamp}
          />
        )}
        {section === "match" && (
          <DocumentUpload
            onUpload={handleDocUpload}
            uploading={imgUploading}
            uploadErr={imgError}
            matchedItem={matchedItem}
            itemDetails={itemDetails}
            noMatch={itemNotFound}
            onReset={handleResetMatch}
          />
        )}
        {section === "listing" && (
          <CatalogListing
            items={catalogItems}
            loading={catalogListLoading}
            error={catalogListError}
          />
        )}
      </main>
    </div>
  );
}

export default App;
