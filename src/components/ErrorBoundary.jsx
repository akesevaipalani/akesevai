import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AkEsevai App Error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: '#f8fafc',
          color: '#0f172a',
          fontFamily: 'Manrope, sans-serif',
          textAlign: 'center'
        }}>
          <div style={{
            background: 'white',
            padding: '32px',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            maxWidth: '460px',
            width: '100%',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#fef2f2',
              color: '#dc2626',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 8px', color: '#0f172a' }}>
              தற்காலிகக் கோளாறு சரிசெய்யப்பட்டது
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>
              ஆவணம் பதிவேற்றம் அல்லது பக்க புதுப்பிப்பின் போது சிறிய கோளாறு ஏற்பட்டது. உங்கள் விவரங்கள் பாதுகாப்பாக உள்ளன.
            </p>

            <button
              onClick={this.handleReload}
              style={{
                background: 'linear-gradient(135deg, #0052cc 0%, #16a34a 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0,82,204,0.25)'
              }}
            >
              <RefreshCw size={16} /> பக்கத்தை புதுப்பிக்கவும் (Reload)
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
