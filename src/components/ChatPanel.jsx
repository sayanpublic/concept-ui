function ChatPanel({ contact }) {
  if (!contact) {
    return (
      <main className="chat-panel">
        <div className="empty">
          <p>Select a contact to start chatting.</p>
          <span>Messages will appear here.</span>
        </div>
      </main>
    )
  }

  return (
    <main className="chat-panel">
      <header className="chat-header">
        <div>
          <p className="chat-title">{contact.name}</p>
          <span className="chat-status">{contact.status}</span>
        </div>
      </header>
      <section className="chat-body">
        <p className="empty muted">No messages yet.</p>
      </section>
      <footer className="composer">
        <input placeholder={`Message @${contact.name}`} />
        <button>Send</button>
      </footer>
    </main>
  )
}

export default ChatPanel
