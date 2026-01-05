import { useState } from 'react';
import { Input, Select, Button } from 'antd';

const { TextArea } = Input;

// Company size options
const companySizeOptions = [
  { value: '1-10', label: '1-10 nhân viên' },
  { value: '11-50', label: '11-50 nhân viên' },
  { value: '51-200', label: '51-200 nhân viên' },
  { value: '201-500', label: '201-500 nhân viên' },
  { value: '501-1000', label: '501-1000 nhân viên' },
  { value: '1000+', label: 'Trên 1000 nhân viên' },
];

// Industry options - use same values as Companies.jsx filter
const industryOptions = [
  { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
  { value: 'Thương mại điện tử', label: 'Thương mại điện tử' },
  { value: 'Viễn thông', label: 'Viễn thông' },
  { value: 'Fintech', label: 'Fintech' },
  { value: 'Tài chính - Ngân hàng', label: 'Tài chính - Ngân hàng' },
  { value: 'Bán lẻ - Thương mại', label: 'Bán lẻ - Thương mại' },
  { value: 'Sản xuất - Chế tạo', label: 'Sản xuất - Chế tạo' },
  { value: 'Y tế - Sức khỏe', label: 'Y tế - Sức khỏe' },
  { value: 'Giáo dục - Đào tạo', label: 'Giáo dục - Đào tạo' },
  { value: 'Bất động sản', label: 'Bất động sản' },
  { value: 'Khách sạn - Du lịch', label: 'Khách sạn - Du lịch' },
  { value: 'Truyền thông - Quảng cáo', label: 'Truyền thông - Quảng cáo' },
  { value: 'Tư vấn', label: 'Tư vấn' },
  { value: 'Vận tải - Logistics', label: 'Vận tải - Logistics' },
  { value: 'Đa ngành', label: 'Đa ngành' },
  { value: 'Khác', label: 'Khác' },
];

export default function CompanyForm({ initialData, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    company_name: initialData?.company_name || initialData?.name || '',
    description: initialData?.description || '',
    industry: initialData?.industry || '',
    company_size: initialData?.company_size || initialData?.size || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
    founded_year: initialData?.founded_year || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty values
    const dataToSave = {};
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        dataToSave[key] = formData[key];
      }
    });
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên công ty <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.company_name}
          onChange={(e) => handleChange('company_name', e.target.value)}
          placeholder="Nhập tên công ty"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngành nghề
          </label>
          <Select
            value={formData.industry || undefined}
            onChange={(value) => handleChange('industry', value)}
            placeholder="Chọn ngành nghề"
            className="w-full"
            options={industryOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quy mô công ty
          </label>
          <Select
            value={formData.company_size || undefined}
            onChange={(value) => handleChange('company_size', value)}
            placeholder="Chọn quy mô"
            className="w-full"
            options={companySizeOptions}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website
          </label>
          <Input
            value={formData.website}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Năm thành lập
          </label>
          <Input
            type="number"
            value={formData.founded_year}
            onChange={(e) => handleChange('founded_year', e.target.value)}
            placeholder="VD: 2020"
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email công ty
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="contact@company.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="0123 456 789"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ
        </label>
        <Input
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="Nhập địa chỉ công ty"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Giới thiệu công ty
        </label>
        <TextArea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Mô tả về công ty, văn hóa, sứ mệnh..."
          rows={4}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button onClick={onCancel}>
          Hủy
        </Button>
        <Button 
          type="primary" 
          htmlType="submit"
          loading={saving}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
}
