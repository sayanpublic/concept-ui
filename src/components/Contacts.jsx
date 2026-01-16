function Contacts({
  contacts,
  isLoading,
  error,
  selectedId,
  onSelect,
  friendInput,
  onFriendInputChange,
  onAddFriend,
  isAdding,
  addError,
  addSuccess,
}) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <p className="sidebar-title">Contacts</p>
        <span className="sidebar-status">online</span>
      </div>
      <form className="friend-form" onSubmit={onAddFriend}>
        <label>
          Add friend
          <input
            value={friendInput}
            onChange={(event) => onFriendInputChange(event.target.value)}
            placeholder="Username or email"
          />
        </label>
        <button type="submit" disabled={!friendInput || isAdding}>
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>
      {addError ? <p className="error">{addError}</p> : null}
      {addSuccess ? <p className="success">{addSuccess}</p> : null}
      {isLoading ? <p className="hint">Loading contacts...</p> : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="contact-list">
        {contacts.map((contact) => (
          <button
            key={contact.id}
            className={`contact ${selectedId === contact.id ? 'is-active' : ''}`}
            onClick={() => onSelect(contact.id)}
          >
            <div className="contact-avatar">
              {contact.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="contact-info">
              <p>{contact.name}</p>
              <span>{contact.lastMessage}</span>
            </div>
            <span className={`presence ${contact.status}`} />
          </button>
        ))}
      </div>
    </aside>
  )
}

export default Contacts
