"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { API_BASE_URL } from '../lib/config'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Load token from localStorage on boot
        const storedToken = localStorage.getItem('token')
        if (storedToken) {
            setToken(storedToken)
            fetchUser(storedToken)
        } else {
            setLoading(false)
        }
    }, [])

    const fetchUser = async (authToken) => {
        try {
            const res = await fetch(`${API_BASE_URL}/user`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Accept': 'application/json'
                }
            })
            if (res.ok) {
                const userData = await res.json()
                setUser(userData)
            } else {
                logout()
            }
        } catch (error) {
            console.error('Error fetching user', error)
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const data = await res.json()
        if (data.success) {
            localStorage.setItem('token', data.access_token)
            setToken(data.access_token)
            setUser(data.data)
            return { success: true }
        }
        return { success: false, message: data.message }
    }

    const register = async (name, email, phone, password) => {
        const res = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password })
        })

        const data = await res.json()
        if (data.success) {
            return { success: true }
        }
        return { success: false, message: data.message || 'Gagal mendaftar' }
    }

    const logout = async () => {
        if (token) {
            await fetch(`${API_BASE_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }).catch(() => {})
        }
        localStorage.removeItem('token')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
