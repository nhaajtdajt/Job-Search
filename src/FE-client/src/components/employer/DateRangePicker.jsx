import { useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, ChevronDown } from 'lucide-react';
import { DatePicker, Dropdown } from 'antd';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

/**
 * DateRangePicker Component
 * Custom date range selection with presets
 */
export default function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  // Preset options
  const presets = [
    {
      label: '7 ngày qua',
      value: '7d',
      getDates: () => ({
        start: subDays(new Date(), 7),
        end: new Date()
      })
    },
    {
      label: '30 ngày qua',
      value: '30d',
      getDates: () => ({
        start: subDays(new Date(), 30),
        end: new Date()
      })
    },
    {
      label: '90 ngày qua',
      value: '90d',
      getDates: () => ({
        start: subDays(new Date(), 90),
        end: new Date()
      })
    },
    {
      label: 'Tháng này',
      value: 'this_month',
      getDates: () => ({
        start: startOfMonth(new Date()),
        end: new Date()
      })
    },
    {
      label: 'Tháng trước',
      value: 'last_month',
      getDates: () => ({
        start: startOfMonth(subMonths(new Date(), 1)),
        end: endOfMonth(subMonths(new Date(), 1))
      })
    },
    {
      label: '6 tháng qua',
      value: '6m',
      getDates: () => ({
        start: subMonths(new Date(), 6),
        end: new Date()
      })
    }
  ];

  // Get current label
  const getCurrentLabel = () => {
    if (value?.preset) {
      const preset = presets.find(p => p.value === value.preset);
      if (preset) return preset.label;
    }
    if (value?.start && value?.end) {
      return `${format(new Date(value.start), 'dd/MM/yyyy')} - ${format(new Date(value.end), 'dd/MM/yyyy')}`;
    }
    return '30 ngày qua';
  };

  // Handle preset click
  const handlePresetClick = (preset) => {
    const dates = preset.getDates();
    onChange({
      preset: preset.value,
      start: format(dates.start, 'yyyy-MM-dd'),
      end: format(dates.end, 'yyyy-MM-dd')
    });
    setIsOpen(false);
  };

  // Handle custom range change
  const handleRangeChange = (dates) => {
    if (dates && dates[0] && dates[1]) {
      onChange({
        preset: 'custom',
        start: dates[0].format('YYYY-MM-DD'),
        end: dates[1].format('YYYY-MM-DD')
      });
    }
  };

  // Dropdown content
  const dropdownContent = (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset)}
            className={`px-3 py-2 text-sm rounded-lg transition ${
              value?.preset === preset.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500 mb-2">Hoặc chọn khoảng thời gian:</p>
        <RangePicker
          onChange={handleRangeChange}
          format="DD/MM/YYYY"
          className="w-full"
          value={value?.start && value?.end ? [dayjs(value.start), dayjs(value.end)] : null}
        />
      </div>
    </div>
  );

  return (
    <Dropdown
      dropdownRender={() => dropdownContent}
      trigger={['click']}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition shadow-sm">
        <Calendar className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{getCurrentLabel()}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </Dropdown>
  );
}
