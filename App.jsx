
import { useState } from "react";
import "./index.css";

const topics = [
  { name: "Arrays", icon: "▦", count: 12 },
  { name: "Recursion", icon: "↻", count: 8 },
  { name: "Binary Search", icon: "⌕", count: 10 },
  { name: "Linked Lists", icon: "⇄", count: 7 },
  { name: "Trees", icon: "♧", count: 9 },
  { name: "Dynamic Programming", icon: "▤", count: 6 },
];

const resources = [
  {
    title: "Introduction to Recursion",
    description: "Understand base cases, recursive calls and simple examples.",
    topic: "Recursion",
    type: "Study Notes",
    date: "18 Oct 2026",
  },
  {
    title: "Binary Search Practice",
    description: "Learn binary search with step-by-step examples and problems.",
    topic: "Binary Search",
    type: "Practice Sheet",
    date: "17 Oct 2026",
  },
  {
    title: "Arrays and Searching Notes",
    description: "Revise array operations, linear search and common patterns.",
    topic: "Arrays",
    type: "PDF Notes",
    date: "16 Oct 2026",
  },
  {
    title: "Dynamic Programming Basics",
    description: "Explore overlapping subproblems and optimal substructure.",
    topic: "Dynamic Programming",
    type: "Study Notes",
    date: "15 Oct 2026",
  },
];

function App() {
  const [page, setPage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const filteredResources = resources.filter((resource) => {
    const matchesSearch = (
      resource.title +
      " " +
      resource.description +
      " " +
      resource.topic
    ).toLowerCase().includes(search.toLowerCase());

    if (page === "Bookmarks") {
      return matchesSearch && saved.includes(resource.title);
    }

    return matchesSearch;
  });

  function toggleBookmark(title) {
    setSaved((previous) =>
      previous.includes(title)
        ? previous.filter((item) => item !== title)
        : [...previous, title]
    );
  }

  
  async function askQuestion(event) {
    event.preventDefault();

    if (!question.trim()) return;

    const text = question.trim();

    setMessages((previous) => [
      ...previous,
      {
        question: text,
        answer: "Connecting to the backend...",
      },
    ]);

    setQuestion("");

    try {
      const response = await fetch("http://localhost:5000/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setMessages((previous) => {
        const updated = [...previous];
        const lastMessage = updated.length - 1;

        updated[lastMessage] = {
          ...updated[lastMessage],
          answer: data.answer,
        };

        return updated;
      });
    } catch (error) {
      setMessages((previous) => {
        const updated = [...previous];
        const lastMessage = updated.length - 1;

        updated[lastMessage] = {
          ...updated[lastMessage],
          answer:
            "Backend se connect nahi ho pa raha. Check karo ki server.js chal raha hai.",
        };

        return updated;
      });
    }
  }


  const navItems = [
    { name: "Overview", icon: "⌂" },
    { name: "Knowledge Search", icon: "⌕" },
    { name: "Resource Library", icon: "▤" },
    { name: "Knowledge Assistant", icon: "✧" },
    { name: "Bookmarks", icon: "♡" },
  ];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">K</div>
          <div>
            <h2>KnowSpace</h2>
            <span>Campus Knowledge</span>
          </div>
        </div>

        <div className="workspace-label">WORKSPACE</div>

        <nav className="navigation">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                page === item.name ? "active" : ""
              }`}
              onClick={() => {
                setPage(item.name);
                setSearch("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon">✦</div>
            <strong>Learn smarter</strong>
            <p>Find the right resources for your next topic.</p>
            <button onClick={() => setPage("Knowledge Assistant")}>
              Ask assistant →
            </button>
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            <div>
              <strong>Anupam Rambhashah</strong>
              <span>Data Science Student</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span> {page}
          </div>
          <div className="topbar-right">
            <span className="demo-label">● Demo Preview</span>
            <div className="avatar small">A</div>
          </div>
        </header>

        <div className="content">
          {page === "Overview" && (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">YOUR LEARNING WORKSPACE</span>
                  <h1>Knowledge, all in one place.</h1>
                  <p>
                    Discover resources, explore DSA topics, and learn
                    something new today.
                  </p>
                </div>
                <div className="welcome-decoration">✳</div>
              </section>

              <section className="hero-search">
                <div className="search-icon">⌕</div>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      setPage("Knowledge Search");
                    }
                  }}
                  placeholder="Search notes, topics, and learning resources..."
                />
                <button onClick={() => setPage("Knowledge Search")}>
                  Search →
                </button>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon purple">▤</span>
                  <span className="stat-label">Available resources</span>
                  <h2>52</h2>
                  <span className="stat-note">Sample data</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon blue">◈</span>
                  <span className="stat-label">Topics covered</span>
                  <h2>12</h2>
                  <span className="stat-note">DSA learning topics</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon pink">♡</span>
                  <span className="stat-label">Saved resources</span>
                  <h2>{saved.length}</h2>
                  <span className="stat-note">Your bookmarks</span>
                </div>

                <div className="stat-card">
                  <span className="stat-icon green">✧</span>
                  <span className="stat-label">Knowledge assistant</span>
                  <h2>Ready</h2>
                  <span className="stat-note">Demo mode</span>
                </div>
              </section>

              <section className="section">
                <div className="section-heading">
                  <div>
                    <h2>Explore popular topics</h2>
                    <p>Start learning with a topic of your choice.</p>
                  </div>
                  <button
                    className="text-button"
                    onClick={() => setPage("Knowledge Search")}
                  >
                    Explore all →
                  </button>
                </div>

                <div className="topics-grid">
                  {topics.map((topic, index) => (
                    <button
                      className="topic-card"
                      key={topic.name}
                      onClick={() => {
                        setSearch(topic.name);
                        setPage("Knowledge Search");
                      }}
                    >
                      <span className={`topic-icon topic-${index}`}>
                        {topic.icon}
                      </span>
                      <strong>{topic.name}</strong>
                      <span>{topic.count} sample resources</span>
                      <span className="topic-arrow">↗</span>
                    </button>
                  ))}
                </div>
              </section>

              <ResourceSection
                resources={resources.slice(0, 3)}
                saved={saved}
                onBookmark={toggleBookmark}
                onViewAll={() => setPage("Resource Library")}
              />
            </>
          )}

          {page === "Knowledge Search" && (
            <>
              <PageHeading
                eyebrow="DISCOVER KNOWLEDGE"
                title="Knowledge Search"
                subtitle="Find the notes and resources you need."
              />
              <SearchBar value={search} onChange={setSearch} />
              <p className="results-label">
                {filteredResources.length} resources found
              </p>
              <ResourceSection
                resources={filteredResources}
                saved={saved}
                onBookmark={toggleBookmark}
              />
            </>
          )}

          {page === "Resource Library" && (
            <>
              <PageHeading
                eyebrow="YOUR STUDY MATERIALS"
                title="Resource Library"
                subtitle="Browse your centralized learning resources."
              />
              <SearchBar value={search} onChange={setSearch} />
              <ResourceSection
                resources={filteredResources}
                saved={saved}
                onBookmark={toggleBookmark}
              />
            </>
          )}

          {page === "Bookmarks" && (
            <>
              <PageHeading
                eyebrow="SAVED FOR LATER"
                title="Your Bookmarks"
                subtitle="Keep your favourite learning resources close."
              />
              <SearchBar value={search} onChange={setSearch} />
              {filteredResources.length === 0 && (
                <div className="empty-state">
                  <span>♡</span>
                  <h3>No bookmarks yet</h3>
                  <p>Save a resource using the heart icon to see it here.</p>
                  <button
                    className="primary-button"
                    onClick={() => setPage("Resource Library")}
                  >
                    Explore resources
                  </button>
                </div>
              )}
              <ResourceSection
                resources={filteredResources}
                saved={saved}
                onBookmark={toggleBookmark}
              />
            </>
          )}

          {page === "Knowledge Assistant" && (
            <>
              <PageHeading
                eyebrow="YOUR LEARNING COMPANION"
                title="Knowledge Assistant"
                subtitle="Ask a question and explore relevant study material."
              />

              <div className="assistant-panel">
                <div className="assistant-welcome">
                  <div className="assistant-symbol">✧</div>
                  <h2>What would you like to learn?</h2>
                  <p>
                    Ask about DSA topics or discover relevant resources.
                  </p>
                </div>

                <div className="suggestions">
                  {[
                    "Explain recursion in simple words",
                    "Find binary search resources",
                    "How do arrays work?",
                    "Help me learn dynamic programming",
                  ].map((text) => (
                    <button key={text} onClick={() => setQuestion(text)}>
                      {text} <span>↗</span>
                    </button>
                  ))}
                </div>

                <div className="chat-messages">
                  {messages.map((message, index) => (
                    <div className="chat-pair" key={index}>
                      <div className="user-message">
                        {message.question}
                      </div>
                      <div className="assistant-message">
                        <span className="message-symbol">✧</span>
                        <div>
                          <strong>Knowledge Assistant · Demo</strong>
                          <p>{message.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form className="chat-input" onSubmit={askQuestion}>
                  <input
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask a DSA question..."
                  />
                  <button type="submit" aria-label="Send question">
                    ↑
                  </button>
                </form>
                <p className="demo-disclaimer">
                  Demo only · Responses are simulated, not real AI answers.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function PageHeading({ eyebrow, title, subtitle }) {
  return (
    <section className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </section>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="library-search">
      <span>⌕</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by title, topic, or keyword..."
      />
    </div>
  );
}

function ResourceSection({
  resources,
  saved,
  onBookmark,
  onViewAll,
}) {
  return (
    <section className="section resources-section">
      <div className="section-heading">
        <div>
          <h2>Learning resources</h2>
          <p>Curated sample materials for your DSA journey.</p>
        </div>
        {onViewAll && (
          <button className="text-button" onClick={onViewAll}>
            View all →
          </button>
        )}
      </div>

      {resources.length === 0 ? (
        <div className="empty-state">
          <span>⌕</span>
          <h3>No resources found</h3>
          <p>Try another search term.</p>
        </div>
      ) : (
        <div className="resources-grid">
          {resources.map((resource) => (
            <article className="resource-card" key={resource.title}>
              <div className="resource-top">
                <span className="document-icon">▤</span>
                <button
                  className={`bookmark-button ${
                    saved.includes(resource.title) ? "is-saved" : ""
                  }`}
                  onClick={() => onBookmark(resource.title)}
                  aria-label="Toggle bookmark"
                  title="Save resource"
                >
                  {saved.includes(resource.title) ? "♥" : "♡"}
                </button>
              </div>

              <span className="resource-type">{resource.type}</span>
              <h3>{resource.title}</h3>
              <p>{resource.description}</p>

              <div className="resource-tags">
                <span>{resource.topic}</span>
                <span>Demo resource</span>
              </div>

              <div className="resource-footer">
                <span>Updated {resource.date}</span>
                <span>↗</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;
