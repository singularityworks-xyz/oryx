"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        className: 'rounded-none border border-gray-200 shadow-sm font-light font-outfit',
        style: {
          background: 'white',
          color: 'rgb(0 0 0)', // pure black - maximum contrast
          border: '1px solid rgb(229 231 235)', // gray-200
          borderRadius: '0px',
        } as React.CSSProperties,
      }}
      style={
        {
          "--normal-bg": "rgb(255 255 255)",
          "--normal-text": "rgb(0 0 0)", // pure black - maximum visibility
          "--normal-border": "rgb(229 231 235)",
          "--success-bg": "rgb(236 253 245)",
          "--success-text": "rgb(0 0 0)", // pure black for success descriptions too
          "--success-border": "rgb(34 197 94)",
          "--error-bg": "rgb(254 242 242)",
          "--error-text": "rgb(99 23 23)", // red-900 - darkest red possible
          "--error-border": "rgb(239 68 68)",
          "--warning-bg": "rgb(255 251 235)",
          "--warning-text": "rgb(92 38 8)", // amber-900 - darkest amber possible
          "--warning-border": "rgb(245 158 11)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
