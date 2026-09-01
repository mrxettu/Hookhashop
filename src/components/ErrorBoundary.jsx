import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error){ return { hasError: true, error } }
  componentDidCatch(error, info){ console.error('ErrorBoundary caught', error, info) }
  render(){
    if (this.state.hasError){
      return (
        <div className="p-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <pre className="mt-4 p-4 bg-white border rounded text-sm text-gray-800">{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}
