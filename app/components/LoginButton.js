"use client"

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState('login') // 'login' or 'register'
  const [showDropdown, setShowDropdown] = useState(false)
  const { user, login, register, logout, loading } = useAuth()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Reset view and forms when closed
      setTimeout(() => {
        setView('login')
        setError('')
        setEmail('')
        setPassword('')
        setName('')
        setPhone('')
        setConfirmPassword('')
      }, 300)
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError('')

    if (view === 'login') {
      const res = await login(email, password)
      if (res.success) {
        setIsOpen(false)
      } else {
        setError(res.message || 'Login failed')
      }
    } else {
      if (password !== confirmPassword) {
        setError('Kata sandi tidak cocok')
        return
      }
      const res = await register(name, email, phone, password)
      if (res.success) {
        setView('login')
        setError('')
        alert('Pendaftaran berhasil! Silakan masuk dengan akun baru Anda.')
        // Clear forms
        setName('')
        setPhone('')
        setConfirmPassword('')
        setPassword('')
      } else {
        setError(res.message || 'Pendaftaran gagal')
      }
    }
  }

  if (loading) return <div style={{ width: '80px' }}></div>

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U'
  }

  return (
    <div className="hidden-mobile">
      {user ? (
        <div style={{ position: 'relative' }}>
          {/* Avatar only — compact for navbar */}
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
          >
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a7f3d0, #6ee7b7)',
              color: '#064e3b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '700',
              fontSize: '0.8rem',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              flexShrink: 0
            }}>
              {getInitials(user.name)}
            </div>
            {/* Chevron indicator */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--color-text-muted)', transition: 'transform 0.2s', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Invisible backdrop to close on outside click */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 49 }}
                onClick={() => setShowDropdown(false)}
              />
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                background: 'var(--background)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '14px',
                padding: '0.5rem',
                minWidth: '180px',
                boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                zIndex: 50
              }}>
                {/* User name header */}
                <div style={{ padding: '0.5rem 1rem 0.75rem', borderBottom: '1px solid var(--color-card-border)', marginBottom: '0.3rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-text)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>{user.email}</div>
                </div>
                <Link
                  href="/donasi-saya"
                  onClick={() => setShowDropdown(false)}
                  style={{
                    padding: '0.6rem 1rem',
                    textDecoration: 'none',
                    color: 'var(--color-text)',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Donasi Saya
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                    window.location.href = '/';
                  }}
                  style={{
                    padding: '0.6rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    color: '#dc2626',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--glass-border)',
            color: 'var(--color-text)',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '50px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            fontSize: '0.85rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--color-btn-dynamic)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--glass-border)';
            e.currentTarget.style.color = 'var(--color-text)';
          }}
        >
          Masuk / Daftar
        </button>
      )}

      {isOpen && mounted ? createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(5px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'var(--color-card-bg)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '400px',
            padding: '2.5rem 2rem',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--color-card-border)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-text-muted)'
              }}
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                <Image src="/sehati.logo.png" alt="Logo" fill sizes="40px" style={{ objectFit: 'contain' }} />
              </div>
            </div>

            {/* Title */}
            <h2 style={{
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: 'var(--color-text)',
              marginBottom: '1.5rem'
            }}>
              {view === 'login' ? 'Masuk ke Panel Pengguna' : 'Daftar Akun Baru'}
            </h2>

            {error && (
              <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.8rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {view === 'register' && (
                <div>
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-card-border)',
                      background: 'var(--background)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div>
                <input
                  type="text"
                  placeholder={view === 'login' ? "Email atau Nama Pengguna" : "Email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-card-border)',
                    background: 'var(--background)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {view === 'register' && (
                <div>
                  <input
                    type="tel"
                    placeholder="Nomor WhatsApp / HP"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-card-border)',
                      background: 'var(--background)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                </div>
              )}

              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Kata Sandi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.8rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-card-border)',
                    background: 'var(--background)',
                    color: 'var(--color-text)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-muted)',
                    display: 'flex'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {view === 'register' && (
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Kata Sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-card-border)',
                      background: 'var(--background)',
                      color: 'var(--color-text)',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      display: 'flex'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              )}

              {view === 'login' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text)', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ cursor: 'pointer' }} />
                    Ingat Saya
                  </label>
                  <a href="#" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Lupa Kata Sandi?</a>
                </div>
              )}

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem'
                }}
              >
                {view === 'login' ? 'Masuk' : 'Daftar'}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-card-border)' }}></div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                {view === 'login' ? 'Atau masuk dengan' : 'Atau daftar dengan'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--color-card-border)' }}></div>
            </div>

            {/* Google Login */}
            <button
              onClick={handleAuth}
              style={{
                width: '100%',
                padding: '0.8rem',
                background: 'var(--background)',
                border: '1px solid var(--color-card-border)',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                color: 'var(--color-text)',
                fontSize: '0.9rem',
                fontWeight: '500',
                transition: 'background 0.2s'
              }}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {view === 'login' ? 'Masuk dengan Google' : 'Daftar dengan Google'}
            </button>

            {/* Footer */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--color-text)' }}>
              {view === 'login' ? (
                <>
                  Belum memiliki akun? <a href="#" onClick={(e) => { e.preventDefault(); setView('register'); }} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>Daftar Sekarang</a>
                </>
              ) : (
                <>
                  Sudah memiliki akun? <a href="#" onClick={(e) => { e.preventDefault(); setView('login'); }} style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}>Masuk Sekarang</a>
                </>
              )}
            </div>
          </div>
        </div>
        , document.body) : null}
    </div>
  )
}
