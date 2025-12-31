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

// Industry options
const industryOptions = [
  { value: 'technology', label: 'Công nghệ thông tin' },
  { value: 'finance', label: 'Tài chính - Ngân hàng' },
  { value: 'retail', label: 'Bán lẻ - Thương mại' },
  { value: 'manufacturing', label: 'Sản xuất - Chế tạo' },
  { value: 'healthcare', label: 'Y tế - Sức khỏe' },
  { value: 'education', label: 'Giáo dục - Đào tạo' },
  { value: 'real_estate', label: 'Bất động sản' },
  { value: 'hospitality', label: 'Khách sạn - Du lịch' },
  { value: 'media', label: 'Truyền thông - Quảng cáo' },
  { value: 'consulting', label: 'Tư vấn' },
  { value: 'logistics', label: 'Vận tải - Logistics' },
  { value: 'other', label: 'Khác' },
];

export default function CompanyForm({ initialData, onSave, onCancel, saving }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    industry: initialData?.industry || '',
    size: initialData?.size || '',
    website: initialData?.website || '',
    address: initialData?.address || '',
    founded_year: initialData?.founded_year || '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="py-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tên công ty <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
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
            value={formData.size || undefined}
            onChange={(value) => handleChange('size', value)}
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
