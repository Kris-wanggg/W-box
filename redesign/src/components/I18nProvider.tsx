'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Locale = 'zh-TW' | 'en'

const translations = {
  'zh-TW': {
    brand: 'W-BOX',
    brandSub: '會員後台管理系統',
    // Login
    loginTitle: '歡迎回來',
    identityLabel: '電子郵件 / 手機號碼',
    identityPlaceholder: '請輸入電子郵件或手機號碼',
    passwordLabel: '密碼',
    passwordPlaceholder: '請輸入密碼',
    forgotPassword: '忘記密碼',
    register: '立即註冊',
    loginBtn: '登入',
    orContinue: '或繼續使用',
    loginGoogle: '使用 Google 登入',
    loginLine: '使用 LINE 登入',
    identityError: '請檢查信箱或手機號碼是否正確',
    passwordError: '密碼錯誤',
    // Forgot password
    forgotTitle: '忘記密碼',
    forgotDesc: '請在下方輸入驗證碼以重置密碼',
    codeLabel: '驗證碼',
    codePlaceholder: '請輸入電子郵件或手機以接收驗證碼',
    sendBtn: '發送',
    backToLogin: '← 返回登入',
    // Register
    registerTitle: '建立帳號',
    tabB2C: '個人註冊 (B2C)',
    tabB2B: '企業註冊 (B2B)',
    registerBtn: '立即註冊',
    registerGoogle: '使用 Google 註冊',
    registerLine: '使用 LINE 註冊',
    alreadyHaveAccount: '已有帳號？立即登入',
    orContinueWith: '或使用以下方式',
    // Fields
    nameLabel: '姓名',
    namePlaceholder: '請輸入姓名',
    emailLabel: '電子郵件',
    emailPlaceholder: '請輸入電子郵件',
    phoneLabel: '手機號碼',
    phonePlaceholder: '請輸入手機號碼',
    confirmPasswordLabel: '確認密碼',
    confirmPasswordPlaceholder: '請再次輸入密碼',
    companyLabel: '公司名稱',
    companyPlaceholder: '請輸入公司名稱',
    taxIdLabel: '統一編號',
    taxIdPlaceholder: '請輸入統一編號',
    contactLabel: '聯絡人姓名',
    contactPlaceholder: '請輸入聯絡人姓名',
    corpEmailLabel: '公司電子郵件',
    corpEmailPlaceholder: '請輸入公司電子郵件',
    // Password rules
    ruleLen: '8 個字元以上',
    ruleLetter: '包含字母',
    ruleNumber: '包含數字',
    ruleSymbol: '包含符號',
    // Theme
    toDark: '切換至暗色模式',
    toLight: '切換至亮色模式',
  },
  en: {
    brand: 'W-BOX',
    brandSub: 'Member Admin Portal',
    // Login
    loginTitle: 'Welcome Back',
    identityLabel: 'Email / Phone Number',
    identityPlaceholder: 'Enter email or phone number',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    forgotPassword: 'Forgot password?',
    register: 'Sign up',
    loginBtn: 'Sign In',
    orContinue: 'Or continue with',
    loginGoogle: 'Sign in with Google',
    loginLine: 'Sign in with LINE',
    identityError: 'Please check your email or phone number',
    passwordError: 'Incorrect password',
    // Forgot password
    forgotTitle: 'Forgot Password',
    forgotDesc: 'Enter your verification code below to reset your password',
    codeLabel: 'Verification Code',
    codePlaceholder: 'Enter email or phone to receive a code',
    sendBtn: 'Send',
    backToLogin: '← Back to Login',
    // Register
    registerTitle: 'Create Account',
    tabB2C: 'Personal (B2C)',
    tabB2B: 'Business (B2B)',
    registerBtn: 'Create Account',
    registerGoogle: 'Sign up with Google',
    registerLine: 'Sign up with LINE',
    alreadyHaveAccount: 'Already have an account? Sign in',
    orContinueWith: 'Or continue with',
    // Fields
    nameLabel: 'Full Name',
    namePlaceholder: 'Enter your name',
    emailLabel: 'Email',
    emailPlaceholder: 'Enter your email',
    phoneLabel: 'Phone Number',
    phonePlaceholder: 'Enter phone number',
    confirmPasswordLabel: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter password',
    companyLabel: 'Company Name',
    companyPlaceholder: 'Enter company name',
    taxIdLabel: 'Tax ID',
    taxIdPlaceholder: 'Enter tax ID',
    contactLabel: 'Contact Person',
    contactPlaceholder: 'Enter contact name',
    corpEmailLabel: 'Company Email',
    corpEmailPlaceholder: 'Enter company email',
    // Password rules
    ruleLen: '8+ characters',
    ruleLetter: 'Letter',
    ruleNumber: 'Number',
    ruleSymbol: 'Symbol',
    // Theme
    toDark: 'Switch to dark mode',
    toLight: 'Switch to light mode',
  },
} as const

type T = typeof translations['zh-TW'] | typeof translations['en']

interface I18nContextValue {
  locale: Locale
  t: T
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'zh-TW',
  t: translations['zh-TW'],
  setLocale: () => {},
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-TW')

  useEffect(() => {
    const stored = localStorage.getItem('locale') as Locale | null
    if (stored && stored in translations) setLocaleState(stored)
  }, [])

  function setLocale(l: Locale) {
    setLocaleState(l)
    localStorage.setItem('locale', l)
  }

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
