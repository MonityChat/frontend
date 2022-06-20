import React from 'react'

export default function Toast({
    type,
    title,
    message,
}) {
  return (
    <div className={`toast ${type.toLowerCase()}`}>
        <h1>{title}</h1>
        <span>{message}</span>
    </div>
  )
}
