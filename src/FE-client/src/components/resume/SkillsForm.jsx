/**
 * SkillsForm Component
 * Form for managing skills in resume
 */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Code, Plus, X, Search, Loader2 } from 'lucide-react';
import resumeService from '../../services/resumeService';

const skillLevels = [
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung bình' },
  { value: 'advanced', label: 'Thành thạo' },
  { value: 'expert', label: 'Chuyên gia' },
];

function SkillsForm({ resumeId, currentSkills = [], onSkillsChange }) {
  const [allSkills, setAllSkills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState(currentSkills);

  useEffect(() => {
    loadAllSkills();
  }, []);

  useEffect(() => {
    setSelectedSkills(currentSkills);
  }, [currentSkills]);

  const loadAllSkills = async () => {
    try {
      const response = await resumeService.getAllSkills();
      if (response.success) {
        setAllSkills(response.data || []);
      }
    } catch (error) {
      console.error('Error loading skills:', error);
    }
  };

  const filteredSkills = allSkills.filter(skill => 
    skill.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedSkills.some(s => s.skill_id === skill.skill_id)
  );

  const handleAddSkill = async (skill) => {
    const newSkill = {
      ...skill,
      level: 'intermediate',
    };
    
    try {
      setLoading(true);
      if (resumeId) {
        await resumeService.addSkills(resumeId, [{ skill_id: skill.skill_id, level: 'intermediate' }]);
      }
      const updatedSkills = [...selectedSkills, newSkill];
      setSelectedSkills(updatedSkills);
      onSkillsChange?.(updatedSkills);
      setSearchTerm('');
      setShowDropdown(false);
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSkill = async (skillId) => {
    try {
      if (resumeId) {
        await resumeService.removeSkill(resumeId, skillId);
      }
      const updatedSkills = selectedSkills.filter(s => s.skill_id !== skillId);
      setSelectedSkills(updatedSkills);
      onSkillsChange?.(updatedSkills);
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  const handleLevelChange = (skillId, level) => {
    const updatedSkills = selectedSkills.map(s => 
      s.skill_id === skillId ? { ...s, level } : s
    );
    setSelectedSkills(updatedSkills);
    onSkillsChange?.(updatedSkills);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Code className="w-5 h-5 text-purple-600" />
        Kỹ năng ({selectedSkills.length})
      </h3>

      {/* Search and Add */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder="Tìm kiếm kỹ năng..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && searchTerm && filteredSkills.length > 0 && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-auto">
              {filteredSkills.slice(0, 10).map(skill => (
                <button
                  key={skill.skill_id}
                  onClick={() => handleAddSkill(skill)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span>{skill.name}</span>
                  {skill.category && (
                    <span className="text-xs text-gray-400 ml-auto">{skill.category}</span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {showDropdown && searchTerm && filteredSkills.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4 text-center text-gray-500">
            Không tìm thấy kỹ năng phù hợp
          </div>
        )}
      </div>

      {/* Selected Skills */}
      {selectedSkills.length > 0 ? (
        <div className="space-y-2">
          {selectedSkills.map(skill => (
            <div
              key={skill.skill_id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{skill.name || skill.skill_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={skill.level || 'intermediate'}
                  onChange={(e) => handleLevelChange(skill.skill_id, e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-purple-500"
                >
                  {skillLevels.map(level => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemoveSkill(skill.skill_id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Code className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Chưa có kỹ năng nào</p>
          <p className="text-sm">Tìm kiếm và thêm các kỹ năng của bạn</p>
        </div>
      )}

      {/* Popular Skills Suggestion */}
      {selectedSkills.length === 0 && allSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Kỹ năng phổ biến:</p>
          <div className="flex flex-wrap gap-2">
            {allSkills.slice(0, 8).map(skill => (
              <button
                key={skill.skill_id}
                onClick={() => handleAddSkill(skill)}
                className="px-3 py-1.5 text-sm bg-purple-50 text-purple-700 rounded-full hover:bg-purple-100 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {skill.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

SkillsForm.propTypes = {
  resumeId: PropTypes.string,
  currentSkills: PropTypes.array,
  onSkillsChange: PropTypes.func,
};

export default SkillsForm;
