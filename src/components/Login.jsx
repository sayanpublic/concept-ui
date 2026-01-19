import { useState } from 'react'

function Login({
  mode,
  username,
  password,
  rememberMe,
  error,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
  onToggleMode,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const isSignUp = mode === 'signup'

  return (
    <div className="auth">
      <form className="auth-card" onSubmit={onSubmit}>
        <div>
          <p className="auth-title">Concept App</p>
          <p className="auth-subtitle">
            {isSignUp ? 'Create your account' : 'Sign in to your workspace'}
          </p>
        </div>
        <label className="auth-field">
          {isSignUp ? 'Username' : 'Email'}
          <input
            type={isSignUp ? 'text' : 'email'}
            value={username}
            onChange={(event) => onUsernameChange(event.target.value)}
            placeholder={isSignUp ? 'Enter your username' : 'Enter your email'}
          />
        </label>
        <label className="auth-field">
          Password
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Enter your password"
          />
        </label>
        {error ? <p className="auth-error">{error}</p> : null}
        {isSignUp ? null : (
          <label className="auth-toggle">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => onRememberMeChange(event.target.checked)}
            />
            Remember me
          </label>
        )}
        <label className="auth-toggle">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          Show password
        </label>
        <button className="auth-submit" type="submit" disabled={isLoading}>
          {isLoading ? 'Please wait...' : isSignUp ? 'Sign up' : 'Login'}
        </button>
        <button
          className="auth-switch"
          type="button"
          onClick={onToggleMode}
          disabled={isLoading}
        >
          {isSignUp ? 'Already have an account? Sign in' : 'New here? Sign up'}
        </button>
      </form>
    </div>
  )
}

export default Login
