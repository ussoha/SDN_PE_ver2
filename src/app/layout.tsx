import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Contact Manager - SDN302 Exam",
  description: "A simple contact management application built with Next.js and MongoDB",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <header className="bg-white shadow-sm border-b">
            <div className="container mx-auto px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Contact Manager</h1>
              <p className="text-sm text-gray-600">SDN302 Practical Exam - Contact Management System</p>
            </div>
          </header>
          <main className="container mx-auto px-6 py-8">{children}</main>
          <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-6 py-4 text-center text-sm text-gray-600">
              <p>&copy; 2025 Contact Manager. Built with Next.js & MongoDB for SDN302 Exam.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
