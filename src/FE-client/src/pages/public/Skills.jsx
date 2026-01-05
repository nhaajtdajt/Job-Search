/**
 * Skills Page
 * Browse jobs by skills - allows filtering by technical skills
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Code, Server, Smartphone, Database, Cloud, Wrench, Brain, Palette, Loader2 } from 'lucide-react';
import { message } from 'antd';
import { jobService } from '../../services/jobService';

// Skill categories for grouping
const SKILL_CATEGORIES = {
  'Frontend': { icon: Code, skills: ['SK001', 'SK002', 'SK003', 'SK004', 'SK005', 'SK006', 'SK007', 'SK008', 'SK009', 'SK010'] },
  'Backend': { icon: Server, skills: ['SK011', 'SK012', 'SK013', 'SK014', 'SK015', 'SK016', 'SK017', 'SK018', 'SK019', 'SK020', 'SK021', 'SK022', 'SK023', 'SK024', 'SK025'] },
  'Mobile': { icon: Smartphone, skills: ['SK026', 'SK027', 'SK028', 'SK029', 'SK030'] },
  'Database': { icon: Database, skills: ['SK031', 'SK032', 'SK033', 'SK034', 'SK035', 'SK036', 'SK037'] },
  'Cloud & DevOps': { icon: Cloud, skills: ['SK038', 'SK039', 'SK040', 'SK041', 'SK042', 'SK043', 'SK044', 'SK045', 'SK046', 'SK047', 'SK048'] },
  'Tools': { icon: Wrench, skills: ['SK049', 'SK050', 'SK051', 'SK052', 'SK053', 'SK054', 'SK055'] },
  'Testing': { icon: Wrench, skills: ['SK056', 'SK057', 'SK058', 'SK059'] },
  'AI/ML': { icon: Brain, skills: ['SK060', 'SK061', 'SK062', 'SK063'] },
  'UI/UX': { icon: Palette, skills: ['SK064', 'SK065', 'SK066', 'SK067'] },
};

export default function Skills() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await jobService.getSkills();
      setSkills(response.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      message.error('Không thể tải danh sách kỹ năng');
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId)
        ? prev.filter(s => s !== skillId)
        : [...prev, skillId]
    );
  };

  const handleSearch = () => {
    if (selectedSkills.length === 0) {
      message.info('Vui lòng chọn ít nhất một kỹ năng');
      return;
    }
    navigate(`/jobs?skills=${selectedSkills.join(',')}`);
  };

  // Filter skills by search query
  const filteredSkills = skills.filter(skill =>
    skill.skill_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group skills by category
  const getSkillsByCategory = (categorySkillIds) => {
    return filteredSkills.filter(skill => categorySkillIds.includes(skill.skill_id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Premium glassmorphism design (synced with Jobs/Companies) */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-6 overflow-hidden">
        {/* Animated background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <h1 className="text-xl md:text-2xl font-bold text-white mb-5 animate-fadeInUp">
            <span className="inline-block">Tìm việc theo</span>{' '}
            <span className="inline-block bg-gradient-to-r from-orange-300 to-yellow-200 bg-clip-text text-transparent">
              Kỹ năng
            </span>
          </h1>
          
          {/* Search Bar */}
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-2 md:p-3 border border-white/20 shadow-2xl animate-fadeInUp stagger-1">
            <div className="flex flex-col md:flex-row gap-2 md:gap-3">
              {/* Search input */}
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kỹ năng..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/95 border-2 border-transparent 
                    text-gray-900 placeholder-gray-400
                    transition-all duration-300 ease-out
                    focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 focus:bg-white
                    hover:bg-white hover:shadow-md"
                />
              </div>
              
              {/* Search button */}
              <button
                onClick={handleSearch}
                disabled={selectedSkills.length === 0}
                className="relative px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl 
                  transition-all duration-300 ease-out
                  hover:from-orange-600 hover:to-orange-700 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02]
                  active:scale-[0.98]
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2 overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Search className="w-5 h-5 relative z-10" />
                <span className="relative z-10">
                  Tìm {selectedSkills.length > 0 ? `(${selectedSkills.length})` : 'việc'}
                </span>
              </button>
            </div>
          </div>

          {/* Selected skills preview */}
          {selectedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 animate-fadeInUp">
              {selectedSkills.map(skillId => {
                const skill = skills.find(s => s.skill_id === skillId);
                return skill ? (
                  <button
                    key={skillId}
                    onClick={() => toggleSkill(skillId)}
                    className="px-3 py-1.5 rounded-full text-sm font-medium bg-white text-blue-700 border border-white shadow-lg
                      transition-all duration-200 hover:scale-105 flex items-center gap-1"
                  >
                    {skill.skill_name}
                    <span className="text-blue-400">×</span>
                  </button>
                ) : null;
              })}
              <button
                onClick={() => setSelectedSkills([])}
                className="px-3 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white border border-white/30
                  transition-all duration-200 hover:bg-white/20"
              >
                Xóa tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(SKILL_CATEGORIES).map(([category, { icon: Icon, skills: categorySkillIds }]) => {
              const categorySkills = getSkillsByCategory(categorySkillIds);
              if (categorySkills.length === 0) return null;

              return (
                <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                    <Icon className="w-5 h-5 text-blue-600" />
                    {category}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map(skill => {
                      const isSelected = selectedSkills.includes(skill.skill_id);
                      return (
                        <button
                          key={skill.skill_id}
                          onClick={() => toggleSkill(skill.skill_id)}
                          className={`
                            px-4 py-2 rounded-lg text-sm font-medium
                            transition-all duration-200 ease-out
                            hover:scale-105 active:scale-95
                            ${isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                        >
                          {skill.skill_name}
                          {skill.job_count > 0 && (
                            <span className={`ml-1.5 text-xs ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
                              ({skill.job_count})
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
