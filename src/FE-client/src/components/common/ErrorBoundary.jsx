import React from 'react';
import { Button, Result } from 'antd';
import { Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Result
            status="500"
            title="Đã xảy ra lỗi"
            subTitle="Xin lỗi, đã có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau."
            extra={
              <Button 
                type="primary" 
                className="bg-blue-600"
                onClick={() => window.location.href = '/'}
                icon={<Home className="w-4 h-4 inline mr-2" />}
              >
                Về trang chủ
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
