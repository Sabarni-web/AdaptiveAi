import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';
import { PageHeader } from '../components/common/PageHeader';
import { profileService } from '../services/profileService';
import { toast } from 'sonner';
import { ProfileHero, DomainPerformance, StrengthsWeaknesses, LearningDNA, Achievements, RecentActivity, EditableSection } from '../components/profile/ProfileComponents';
import { Input } from '../components/common/Input';
import { Loader2, User, GraduationCap, Settings } from 'lucide-react';

export const Profile = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.user);
  
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  
  const [editingSection, setEditingSection] = useState(null); // 'personal', 'academic', 'preferences'

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: authUser?.name || '',
      course: '',
      year: '',
      primaryDomain: '',
      preferredLanguage: '',
      preferredDifficulty: 'Adaptive',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await profileService.getIntelligenceProfile();
        setProfileData(data);
        reset({
          name: data.user.name,
          course: data.user.academicInfo?.course || '',
          year: data.user.academicInfo?.year || '',
          primaryDomain: data.user.academicInfo?.primaryDomain || '',
          preferredLanguage: data.user.academicInfo?.preferredLanguage || '',
          preferredDifficulty: data.user.learningPreferences?.preferredDifficulty || 'Adaptive',
        });
      } catch (error) {
        toast.error('Failed to load intelligence profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSave = async (data) => {
    try {
      const updatePayload = {
        name: data.name,
        academicInfo: {
          course: data.course,
          year: data.year,
          primaryDomain: data.primaryDomain,
          preferredLanguage: data.preferredLanguage
        },
        learningPreferences: {
          preferredDifficulty: data.preferredDifficulty
        }
      };
      
      const updatedUser = await profileService.updateProfile(updatePayload);
      dispatch(updateUser({ name: updatedUser.name, email: updatedUser.email }));
      
      // Update local state
      setProfileData(prev => ({ ...prev, user: updatedUser }));
      setEditingSection(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-mint" />
      </div>
    );
  }

  if (!profileData) {
    return <div className="text-secondary text-center mt-10">Unable to load profile data. Please try again.</div>;
  }

  const { user, stats, domains, strengths, weaknesses, learningDNA, achievements, recentActivity } = profileData;

  return (
    <div className="flex flex-col gap-8 animate-fade-in pb-10">
      <PageHeader
        title="Intelligence Profile"
        description="Your AI-driven personal learning dashboard and performance DNA."
      />

      <ProfileHero user={user} stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <DomainPerformance domains={domains} />
          <Achievements achievements={achievements} />
          <RecentActivity activity={recentActivity} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <StrengthsWeaknesses strengths={strengths} weaknesses={weaknesses} />
          <LearningDNA dna={learningDNA} />
          
          <form id="profile-form" onSubmit={handleSubmit(onSave)} className="flex flex-col gap-6">
            <EditableSection 
              title="Personal Details" 
              icon={User}
              isEditing={editingSection === 'personal'} 
              onToggleEdit={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
              onSave={handleSubmit(onSave)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" disabled={editingSection !== 'personal'} {...register('name', { required: true })} />
                <Input label="Email Address" type="email" disabled value={user.email} />
              </div>
            </EditableSection>

            <EditableSection 
              title="Academic Information" 
              icon={GraduationCap}
              isEditing={editingSection === 'academic'} 
              onToggleEdit={() => setEditingSection(editingSection === 'academic' ? null : 'academic')}
              onSave={handleSubmit(onSave)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Course/Degree" disabled={editingSection !== 'academic'} placeholder="e.g. B.Tech CSE" {...register('course')} />
                <Input label="Year/Semester" disabled={editingSection !== 'academic'} placeholder="e.g. 3rd Year" {...register('year')} />
                <Input label="Primary Domain" disabled={editingSection !== 'academic'} placeholder="e.g. AI/ML" {...register('primaryDomain')} />
                <Input label="Preferred Language" disabled={editingSection !== 'academic'} placeholder="e.g. Python, Java" {...register('preferredLanguage')} />
              </div>
            </EditableSection>

            <EditableSection 
              title="Learning Preferences" 
              icon={Settings}
              isEditing={editingSection === 'preferences'} 
              onToggleEdit={() => setEditingSection(editingSection === 'preferences' ? null : 'preferences')}
              onSave={handleSubmit(onSave)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Preferred Difficulty</label>
                  <select 
                    {...register('preferredDifficulty')} 
                    disabled={editingSection !== 'preferences'}
                    className="w-full bg-surface-2 border border-hair rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-mint focus:ring-1 focus:ring-mint transition-all disabled:opacity-50"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Adaptive">Adaptive (AI Managed)</option>
                  </select>
                </div>
              </div>
            </EditableSection>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Profile;
