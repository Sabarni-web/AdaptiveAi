import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../redux/slices/authSlice';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { toast } from 'sonner';

export const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = (data) => {
    dispatch(updateUser({ name: data.name, email: data.email }));
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <PageHeader
        title="Profile"
        description="Update your personal information."
      />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card title="Personal Details" description="Configure your account details and contact information.">
            <div className="flex flex-col gap-5 mt-4">
              <Input
                label="Full Name"
                placeholder="Name"
                {...register('name', { required: true })}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                {...register('email', { required: true })}
              />

              <div className="flex justify-end border-t border-hair pt-5 mt-2">
                <Button type="submit" variant="primary">Save Profile</Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </div>
  );
};
export default Profile;
