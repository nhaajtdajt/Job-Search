import { useState } from 'react';
import { Input, Select, Button, Steps } from 'antd';
import { 
  Briefcase, 
  FileText, 
  ListChecks, 
  MapPin,
  ChevronLeft,
  ChevronRight,
  Save,
  Send
} from 'lucide-react';

const { TextArea } = Input;

// Job type options
const jobTypeOptions = [
  { value: 'full_time', label: 'Toàn thời gian' },
  { value: 'part_time', label: 'Bán thời gian' },
  { value: 'contract', label: 'Hợp đồng' },
  { value: 'internship', label: 'Thực tập' },
  { value: 'remote', label: 'Làm việc từ xa' },
];

// Experience level options
const experienceLevelOptions = [
  { value: 'intern', label: 'Thực tập sinh' },
  { value: 'fresher', label: 'Fresher (0-1 năm)' },
  { value: 'junior', label: 'Junior (1-3 năm)' },
  { value: 'middle', label: 'Middle (3-5 năm)' },
  { value: 'senior', label: 'Senior (5+ năm)' },
  { value: 'lead', label: 'Lead/Manager' },
];

// Industry options
const industryOptions = [
  { value: 'technology', label: 'Công nghệ thông tin' },
  { value: 'finance', label: 'Tài chính - Ngân hàng' },
  { value: 'marketing', label: 'Marketing - Truyền thông' },
  { value: 'sales', label: 'Kinh doanh - Bán hàng' },
  { value: 'hr', label: 'Nhân sự' },
  { value: 'accounting', label: 'Kế toán - Kiểm toán' },
  { value: 'engineering', label: 'Kỹ thuật' },
  { value: 'design', label: 'Thiết kế' },
  { value: 'healthcare', label: 'Y tế - Sức khỏe' },
  { value: 'education', label: 'Giáo dục' },
  { value: 'other', label: 'Khác' },
];

const steps = [
  { title: 'Thông tin cơ bản', icon: <Briefcase className="w-4 h-4" /> },
  { title: 'Mô tả công việc', icon: <FileText className="w-4 h-4" /> },
  { title: 'Yêu cầu & Phúc lợi', icon: <ListChecks className="w-4 h-4" /> },
  { title: 'Địa điểm & Kỹ năng', icon: <MapPin className="w-4 h-4" /> },
];

export default function JobForm({ initialData, onSubmit, onSaveDraft, saving }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic info
    title: initialData?.title || '',
    job_type: initialData?.job_type || '',
    experience_level: initialData?.experience_level || '',
    industry: initialData?.industry || '',
    salary_min: initialData?.salary_min || '',
    salary_max: initialData?.salary_max || '',
    is_salary_visible: initialData?.is_salary_visible ?? true,
    
    // Description
    description: initialData?.description || '',
    
    // Requirements & Benefits
    requirements: initialData?.requirements || '',
    benefits: initialData?.benefits || '',
    
    // Location & Skills
    location: initialData?.location || '',
    address: initialData?.address || '',
    is_remote: initialData?.is_remote || false,
    skills: initialData?.skills || [],
    tags: initialData?.tags || [],
    
    // Dates
    deadline: initialData?.deadline || '',
  });

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData);
    }
  };

  // Step 1: Basic Info
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tiêu đề tin tuyển dụng <span className="text-red-500">*</span>
        </label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="VD: Senior Frontend Developer"
          size="large"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Loại hình công việc <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.job_type || undefined}
            onChange={(value) => handleChange('job_type', value)}
            placeholder="Chọn loại hình"
            className="w-full"
            size="large"
            options={jobTypeOptions}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cấp bậc <span className="text-red-500">*</span>
          </label>
          <Select
            value={formData.experience_level || undefined}
            onChange={(value) => handleChange('experience_level', value)}
            placeholder="Chọn cấp bậc"
            className="w-full"
            size="large"
            options={experienceLevelOptions}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngành nghề
        </label>
        <Select
          value={formData.industry || undefined}
          onChange={(value) => handleChange('industry', value)}
          placeholder="Chọn ngành nghề"
          className="w-full"
          size="large"
          options={industryOptions}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mức lương (USD/tháng)
        </label>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={formData.salary_min}
            onChange={(e) => handleChange('salary_min', e.target.value)}
            placeholder="Tối thiểu"
            size="large"
            className="flex-1"
          />
          <span className="text-gray-500">-</span>
          <Input
            type="number"
            value={formData.salary_max}
            onChange={(e) => handleChange('salary_max', e.target.value)}
            placeholder="Tối đa"
            size="large"
            className="flex-1"
          />
        </div>
        <label className="flex items-center gap-2 mt-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={formData.is_salary_visible}
            onChange={(e) => handleChange('is_salary_visible', e.target.checked)}
            className="rounded border-gray-300"
          />
          Hiển thị mức lương trên tin tuyển dụng
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hạn nộp hồ sơ
        </label>
        <Input
          type="date"
          value={formData.deadline}
          onChange={(e) => handleChange('deadline', e.target.value)}
          size="large"
        />
      </div>
    </div>
  );

  // Step 2: Description
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mô tả công việc <span className="text-red-500">*</span>
        </label>
        <TextArea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Mô tả chi tiết về công việc, trách nhiệm, hoạt động hàng ngày..."
          rows={12}
          className="text-base"
        />
        <p className="text-xs text-gray-500 mt-2">
          Tip: Mô tả rõ ràng giúp thu hút ứng viên phù hợp hơn
        </p>
      </div>
    </div>
  );

  // Step 3: Requirements & Benefits
  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Yêu cầu ứng viên <span className="text-red-500">*</span>
        </label>
        <TextArea
          value={formData.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
          placeholder="- Tốt nghiệp Đại học chuyên ngành CNTT&#10;- Có ít nhất 3 năm kinh nghiệm&#10;- Thành thạo React, Node.js&#10;- Tiếng Anh giao tiếp tốt"
          rows={8}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quyền lợi
        </label>
        <TextArea
          value={formData.benefits}
          onChange={(e) => handleChange('benefits', e.target.value)}
          placeholder="- Lương thưởng cạnh tranh&#10;- Bảo hiểm sức khỏe&#10;- Du lịch hàng năm&#10;- Môi trường làm việc chuyên nghiệp"
          rows={8}
        />
      </div>
    </div>
  );

  // Step 4: Location & Skills
  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa điểm làm việc
        </label>
        <Input
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="VD: Quận 1, TP. Hồ Chí Minh"
          size="large"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Địa chỉ chi tiết
        </label>
        <Input
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="VD: Tòa nhà ABC, 123 Nguyễn Huệ, Quận 1"
          size="large"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={formData.is_remote}
          onChange={(e) => handleChange('is_remote', e.target.checked)}
          className="rounded border-gray-300"
        />
        Cho phép làm việc từ xa
      </label>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Kỹ năng yêu cầu
        </label>
        <Select
          mode="tags"
          value={formData.skills}
          onChange={(value) => handleChange('skills', value)}
          placeholder="Nhập kỹ năng và nhấn Enter"
          className="w-full"
          size="large"
        />
        <p className="text-xs text-gray-500 mt-1">
          VD: React, Node.js, TypeScript, AWS
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <Select
          mode="tags"
          value={formData.tags}
          onChange={(value) => handleChange('tags', value)}
          placeholder="Nhập tags và nhấn Enter"
          className="w-full"
          size="large"
        />
        <p className="text-xs text-gray-500 mt-1">
          VD: startup, fintech, remote-friendly
        </p>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps indicator */}
      <div className="mb-8">
        <Steps
          current={currentStep}
          items={steps.map((step, index) => ({
            title: step.title,
            icon: (
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step.icon}
              </div>
            ),
          }))}
        />
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {renderCurrentStep()}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between mt-6">
        <div>
          {currentStep > 0 && (
            <Button
              onClick={handlePrev}
              icon={<ChevronLeft className="w-4 h-4" />}
              size="large"
            >
              Quay lại
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {onSaveDraft && (
            <Button
              onClick={handleSaveDraft}
              icon={<Save className="w-4 h-4" />}
              size="large"
              loading={saving}
            >
              Lưu nháp
            </Button>
          )}

          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={handleNext}
              className="bg-orange-500 hover:bg-orange-600"
              size="large"
            >
              Tiếp theo
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<Send className="w-4 h-4" />}
              className="bg-orange-500 hover:bg-orange-600"
              size="large"
              loading={saving}
            >
              Đăng tin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
